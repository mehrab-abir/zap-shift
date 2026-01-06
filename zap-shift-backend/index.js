const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const admin = require("firebase-admin");
const serviceAccount = require("./zap-shift-firebase-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

function generateTrackingId() {
    const prefix = "TRK";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);

    return `${prefix}-${random}-${timestamp}`;
}

//firebase token verification
const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    try {
        const decode = await admin.auth().verifyIdToken(token);
        req.token_email = decode.email;

        next();
    }
    catch {
        return res.status(401).send({ message: "unauthorized access" });
    }
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Zap shift server is running");
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zvein0m.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();

        const db = client.db("zap-shift-db");
        const parcelCollection = db.collection("parcels");
        const paymentCollection = db.collection("payments");
        const usersCollection = db.collection("users");
        const ridersCollection = db.collection("riders");
        const trackingCollection = db.collection("tracking");
        const completedDeliveriesCollection = db.collection("completed-deliveries");

        //middleware for admin verification
        //must be called after 'verifyToken' in the api definition
        const verifyAdmin = async (req, res, next) => {
            const email = req.token_email;

            const user = await usersCollection.findOne({ email: email });

            if (!user || user.currentRole !== "admin") {
                return res.status(403).send({ message: "forbidden access" });
            }
            next();
        }

        //middleware for rider verification
        //must be called after 'verifyToken' in the api definition
        const verifyRider = async (req, res, next) => {
            const email = req.token_email;

            const user = await usersCollection.findOne({ email: email });

            if (!user || user.currentRole !== "rider") {
                return res.status(403).send({ message: "forbidden access" });
            }
            next();
        }

        //tracking log
        const logTracking = async (trackingId, deliveryStatus) => {
            const log = {
                trackingId,
                deliveryStatus,
                updatedAt: new Date()
            }

            const result = await trackingCollection.insertOne(log);
            return result;
        }

        //post a parcel 
        app.post('/parcels', verifyToken, async (req, res) => {
            const newParcel = req.body;

            const trackingId = generateTrackingId();
            newParcel.trackingId = trackingId;

            logTracking(trackingId, "Parcel created"); //1st tracking log

            const afterPost = await parcelCollection.insertOne(newParcel);
            res.send(afterPost)
        })

        //get all my parcels - as normal user
        app.get('/parcels', verifyToken, async (req, res) => {
            const { email } = req.query;

            if (email !== req.token_email) {
                return res.status(403).send({ message: "forbidden access" });
            }

            const parcels = await parcelCollection.find({ senderEmail: req.token_email }).toArray();
            res.send(parcels);
        })

        //tracking logs to track parcel
        app.get('/tracking-log/:trackingId',async (req,res)=>{
            const {trackingId} = req.params;

            const trackLogs = await trackingCollection.find({trackingId:trackingId}).toArray();

            res.send(trackLogs);
        })

        //get one parcel by id
        app.get('/parcels/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });
            res.send(parcel);
        })

        //delete a parcel
        app.delete('/parcels/:id', verifyToken, async (req, res) => {
            const { id } = req.params;
            const afterDelete = await parcelCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(afterDelete);
        })

        //payment apis
        app.post('/create-checkout-session', verifyToken, async (req, res) => {
            try {
                const paymentInfo = req.body;
                const amount = Number(paymentInfo.deliveryFee) * 100;

                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: 'USD',
                                unit_amount: amount,
                                product_data: {
                                    name: paymentInfo.parcelName
                                },
                            },
                            quantity: 1
                        }
                    ],
                    customer_email: paymentInfo.senderEmail,
                    mode: 'payment',
                    metadata: {
                        parcelId: paymentInfo.parcelId,
                        parcelName: paymentInfo.parcelName,
                        receiverName: paymentInfo.receiverName,
                        trackingId : paymentInfo.trackingId
                    },
                    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
                })

                // console.log(session);

                res.send({ url: session.url });
            } catch (err) {
                res.send({ error: err.message })
            }
        })

        //change payment status after successfull payment and post payment information to database and send to client
        app.patch("/payment-success", verifyToken, async (req, res) => {
            try {
                const sessionId = req.query.session_id;
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                const transactionId = session.payment_intent;

                // Fast-path: if already saved, return same response as before
                const paymentExist = await paymentCollection.findOne({ transactionId });

                if (paymentExist) {
                    return res.send({
                        message: "Payment already exists",
                        transactionId,
                        trackingId: paymentExist.trackingId,
                    });
                }

                // update payment status
                if (session.payment_status === "paid") {
                    const parcelId = session.metadata.parcelId;
                    const paymentDate = new Date();
                    const trackingId = session.metadata.trackingId;

                    logTracking(trackingId, "Delivery Fee paid"); //2nd log

                    const afterUpdate = await parcelCollection.updateOne(
                        { _id: new ObjectId(parcelId) },
                        {
                            $set: {
                                paymentStatus: "Paid",
                                paidAt: paymentDate,
                                trackingId: trackingId,
                                deliveryStatus: "Looking for rider",
                            },
                        }
                    );

                    // payment info to store in the db
                    const payment = {
                        parcelName: session.metadata.parcelName,
                        parcelId: session.metadata.parcelId,
                        senderEmail: session.customer_email,
                        receiverName: session.metadata.receiverName,
                        currency: session.currency,
                        amount: session.amount_total / 100,
                        transactionId,
                        trackingId,
                        paymentStatus: session.payment_status,
                        paidAt: paymentDate,
                    };

                    // post payment info to db
                    let postPayment;
                    try {
                        postPayment = await paymentCollection.insertOne(payment);
                    } catch (err) {
                        // Duplicate key (unique index on transactionId) => another request inserted first
                        if (err?.code === 11000) {
                            const existing = await paymentCollection.findOne({ transactionId });

                            return res.send({
                                message: "Payment already exists",
                                transactionId,
                                trackingId: existing?.trackingId,
                            });
                        }

                        // anything else is a real error
                        throw err;
                    }

                    return res.send({
                        success: true,
                        afterUpdate: afterUpdate,
                        postPayment: postPayment,
                        trackingId: trackingId,
                        transactionId: transactionId,
                    });
                } else {
                    return res.send({ message: "Payment not completed" });
                }
            } catch (err) {
                console.error("payment-success error:", err);
                return res.status(500).send({ message: "Internal server error" });
            }
        });


        //get all payments info for payment history
        app.get('/payment-history', verifyToken, async (req, res) => {
            const { email } = req.query;
            const query = {};

            if (email) {
                query.senderEmail = email;
            }

            const allPayments = await paymentCollection.find(query).sort({ paidAt: -1 }).toArray();
            res.send(allPayments);
        })

        //post user to db
        app.post('/users', async (req, res) => {
            const newUser = req.body;

            const userExists = await usersCollection.findOne({ email: newUser.email });

            if (userExists) {
                return res.send({ userExists: "user already exists, not posted." });
            }

            const afterPost = await usersCollection.insertOne(newUser);
            res.send(afterPost);
        })

        //rider application status
        app.get('/rider-application/:email',async (req,res)=>{
            const {email} = req.params;
            const user = await usersCollection.findOne({email:email}, {
                projection : {appliedToBeRider : 1}
            });
            res.send(user);
        })

        //get a rider's details -- for rider
        app.get('/rider/details/:email',async(req, res)=>{
            const {email} = req.params;
            const rider = await ridersCollection.findOne({riderEmail : email});
            res.send(rider);
        })

        //update work status of a rider, "available, in-a-trip, offline" --for rider
        app.patch('/rider/work-status/:id',async (req,res)=>{
            const {id} = req.params;
            const {workStatus} = req.body;

            const afterUpdate = await ridersCollection.updateOne({_id: new ObjectId(id)},{
                $set : {
                    workStatus : workStatus
                }
            })
            res.send(afterUpdate);
        })

        //get all parcels - admin
        app.get('/admin/parcels', verifyToken, verifyAdmin, async (req, res) => {
            const { searchText, deliveryStatus } = req.query;
            const query = {};

            if (deliveryStatus === "Looking for rider") {
                query.deliveryStatus = "Looking for rider";
            }
            else if(deliveryStatus === "Rider Assigned"){
                query.deliveryStatus = "Rider Assigned";
            }
            else if (deliveryStatus === 'In transit') {
                query.deliveryStatus = "In transit";
            }
            else if (deliveryStatus === "Delivered") {
                query.deliveryStatus = "Delivered";
            }

            if (searchText) {
                query.senderEmail = { $regex: searchText, $options: 'i' }
            }

            const parcels = await parcelCollection.find(query).sort({createdAt: -1}).toArray();
            res.send(parcels);
        })

        //save a rider application to db
        app.post('/riders', verifyToken, async (req, res) => {
            const rider = req.body;
            const postRider = await ridersCollection.insertOne(rider);

            await usersCollection.updateOne({email : rider.riderEmail},{
                $set : {
                    appliedToBeRider : true
                }
            })
            res.send(postRider);
        })

        //get all riders - as admin
        app.get('/riders', verifyToken, verifyAdmin, async (req, res) => {
            const status = req.query.status;

            const query = {};

            if (status === "pending") {
                query.status = "pending"
            }
            else if (status === "approved") {
                query.status = "approved"
            }
            else if (status === "rejected") {
                query.status = "rejected"
            }

            const allRiders = await ridersCollection.find(query).toArray();
            res.send(allRiders);
        })

        //get all riders who are - approved, in same district as sender and workStatus is available
        app.get('/assign-pickup/riders',verifyToken, verifyAdmin,async (req,res)=>{
            let {status, riderDistrict, workStatus} = req.query;

            const query = {
                status, riderDistrict, workStatus
            };

            const riders = await ridersCollection.find(query).toArray();
            res.send(riders);
        })

        //update parcel's deliveryStatus and rider's work status after a rider is assigned to a parcel
        app.patch("/parcels/rider-assigned",async (req,res)=>{
            const {riderId,riderName, riderEmail, parcelId, trackingId } = req.body;

            //find the parcel and update its deliveryStatus
            const updatedParcel = await parcelCollection.updateOne({_id: new ObjectId(parcelId)},{
                $set : {
                    deliveryStatus : "Rider Assigned",
                    riderName : riderName,
                    riderEmail : riderEmail
                }
            })

            logTracking(trackingId, `Rider Assigned -${riderName}`); //3rd log

            //find the rider and update their workStatus to 'On a delivery'
            const updatedRider = await ridersCollection.updateOne({_id:new ObjectId(riderId)},{
                $set : {
                    workStatus : "One Parcel Assigned"
                }
            })

            res.send({updatedParcel,updatedRider});
        })

        //get all assigned parcels --for rider
        app.get("/parcels/assigned-to-me/:riderEmail", async (req, res) => {
            const riderEmail = req.params.riderEmail;
            const assigned_parcels = await parcelCollection.find({ riderEmail: riderEmail, deliveryStatus : {$ne : "Delivered"}}).toArray();
            res.send(assigned_parcels);
        })

        //rider accepts/rejects/confirm-pickup of a parcel
        app.patch('/parcel-request/:parcelId',verifyToken, verifyRider,async (req,res)=>{
            let {riderResponse, riderEmail, riderName, trackingId} = req.body;
            const parcelId = req.params.parcelId;

            const originalRiderEmail = riderEmail;
            let workStatus = '';
            let deliveryStatus = '';

            if(riderResponse === "accept"){
                workStatus = "Picking up a parcel";
                deliveryStatus = "Rider arriving";
            }
            else if(riderResponse === "confirm pickup"){
                workStatus = "delivering a parcel";
                deliveryStatus = "In transit";
            }
            else if(riderResponse === "complete delivery"){
                workStatus = "Available";
                deliveryStatus = "Delivered";
            }
            else if(riderResponse === "reject"){
                workStatus = "Available";
                deliveryStatus = "Looking for rider";
                riderEmail = "";
                riderName = "";
            }

            //update delivery status of the parcel based rider response
            const updatedParcelDoc = await parcelCollection.updateOne({ _id: new ObjectId(parcelId) }, {
                $set: {
                    deliveryStatus: deliveryStatus,
                    riderEmail: riderEmail,
                    riderName: riderName
                }
            });

            //update work status of the rider based on his response
            const updatedWorkStatus = await ridersCollection.updateOne({riderEmail:originalRiderEmail},{
                $set : {
                    workStatus : workStatus
                }  
            })

            logTracking(trackingId, deliveryStatus); //4th, 5th, 6th... log

            res.send({updatedParcelDoc, updatedWorkStatus});
        })

        //complete a delivery
        app.post('/rider/complete-delivery',verifyToken, verifyRider,async(req,res)=>{
            const {parcelName, fare, senderName, senderEmail, senderDistrict, receiverName, receiverEmail, receiverDistrict, riderName, riderEmail} = req.body;

            const completedAt = new Date();

            const completedDelivery = { parcelName, fare, senderName, senderEmail, senderDistrict, receiverName, receiverEmail, receiverDistrict, riderName, riderEmail, completedAt };

            const afterPost = await completedDeliveriesCollection.insertOne(completedDelivery);

            res.send(afterPost);
        })

        //get all completed deliveries of a rider
        app.get('/rider/my-completed-deliveries/:email',verifyToken, verifyRider,async(req,res)=>{
            const email = req.params.email;
            const completedDeliveries = await completedDeliveriesCollection.find({riderEmail : email}).toArray();
            res.send(completedDeliveries);
        })

        //get a rider's details - admin
        app.get('/riders/:id', verifyToken, verifyAdmin, async (req, res) => {
            const { id } = req.params;
            const rider = await ridersCollection.findOne({ _id: new ObjectId(id) });
            res.send(rider);
        })

        //update rider status --approve or reject - admin
        app.patch('/riders/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const email = req.body.email;

            const afterUpdate = await ridersCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    status: status
                }
            })

            let updateRole = {};

            if (status === "approved") {
                updateRole = await usersCollection.updateOne({ email: email }, {
                    $set: {
                        currentRole: "rider"
                    }
                })
            }
            else {
                updateRole = await usersCollection.updateOne({ email: email }, {
                    $set: {
                        currentRole: "user"
                    }
                })
            }

            res.send({
                afterUpdate: afterUpdate,
                updateRole: updateRole
            })
        })

        //get all users - admin
        app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
            const searchText = req.query.searchText;
            const query = {};

            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: 'i' } },
                    { email: { $regex: searchText, $options: 'i' } }
                ]
            }

            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        //get one user - admin
        app.get('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const user = await usersCollection.findOne({ _id: new ObjectId(id) });
            res.send(user);
        })

        //get one user but send only their role
        app.get('/users/:email/role', verifyToken, async (req, res) => {
            const email = req.params.email;
            const user = await usersCollection.findOne({ email: email });
            res.send({ currentRole: user?.currentRole || 'user' });
        })

        //update user role -admin
        app.patch('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const roleInfo = req.body;

            //find this user to check their previousRole to make it thier currentRole
            const thisUser = await usersCollection.findOne({ _id: new ObjectId(id) });

            //if currentRole comes '' from front-end, that means he is getting removed from admin, so set their previousRole to their currentRole,
            /* this will update the roleInfo object that has come from front-end,
            where the currentRole was empty, now it will be whatever their previousRole was
            */
            if (roleInfo.currentRole === '') {
                roleInfo.currentRole = thisUser.previousRole;
            }

            const afterUpdate = await usersCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    currentRole: roleInfo.currentRole, //roleInfo updated here in backend, from '' to whatever their previousRole was
                    previousRole: roleInfo.previousRole //previousRole being set to whatever their currentRole was, which has come from front-end
                }
            });

            res.send(afterUpdate);
        })

        //Dashboard home page apis --user
        app.get('/count-sent-parcel/:email',verifyToken, async (req,res)=>{
            const email = req.params.email;
            const yourSentParcels = await parcelCollection.countDocuments({senderEmail : email});
            res.send(yourSentParcels);
        })

        //Dashboard home page apis --rider
        app.get('/count-deliveries/:email',verifyToken, verifyRider,async (req,res)=>{
            const email = req.params.email;
            const yourDeliveriesCount = await completedDeliveriesCollection.countDocuments({riderEmail : email});
            res.send(yourDeliveriesCount);
        })

        //get total income of a rider
        app.get("/total-income/:email",verifyToken, verifyRider, async (req,res)=>{
            const email = req.params.email;
            const result = await completedDeliveriesCollection.aggregate([
                {$match : {riderEmail : email}},
                {
                    $group : {
                        _id : null,
                        totalIncome : {$sum : {$toDouble : "$fare"}}
                    }
                }
            ]).toArray();

            const totalIncome = result[0]?.totalIncome || 0;

            res.send(totalIncome);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Zap shift server is running on port localhost:${port}`);
})