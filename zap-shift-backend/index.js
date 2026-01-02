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
const verifyToken = async (req, res, next) =>{
    if (!req.headers.authorization){
        return res.status(401).send({message : "unauthorized access"});
    }

    const token = req.headers.authorization.split(' ')[1];

    if(!token){
        return res.status(401).send({message : "unauthorized access"});
    }

    try{
        const decode = await admin.auth().verifyIdToken(token);
        req.token_email = decode.email;

        next();
    }
    catch{
        return res.status(401).send({message : "unauthorized access"});
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

        //post a parcel 
        app.post('/parcels', verifyToken, async (req, res) => {
            const newParcel = req.body;
            const afterPost = await parcelCollection.insertOne(newParcel);
            res.send(afterPost)
        })


        //get all my parcels
        app.get('/parcels', verifyToken, async (req, res) => {
            const { email } = req.query;
            const query = {};

            if (email) {

                if(email !== req.token_email){
                    return res.status(403).send({message : "forbidden access"});
                }

                query.senderEmail = email;
            }

            const parcels = await parcelCollection.find(query).toArray();
            res.send(parcels);
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
                        parcelName : paymentInfo.parcelName,
                        receiverName : paymentInfo.receiverName
                    },
                    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
                })

                // console.log(session);

                res.send({ url: session.url });
            } catch (err) {
                res.send({error: err.message})
            }
        })

        //change payment status after successfull payment and post payment information to database and send to client
        app.patch('/payment-success',async (req,res)=>{
            const sessionId = req.query.session_id;
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            // console.log(session);

            const paymentExist = await paymentCollection.findOne({transactionId: session.payment_intent});

            if(paymentExist){
                return res.send({
                    message: "Payment already exists",
                    transactionId : session.payment_intent,
                    trackingId : paymentExist.trackingId
                })
            }

            //update payment status
            if(session.payment_status==='paid'){
                const parcelId = session.metadata.parcelId;
                const paymentDate = new Date();
                const transactionId = session.payment_intent;
                const trackingId = generateTrackingId();

                const afterUpdate = await parcelCollection.updateOne({_id:new ObjectId(parcelId)},{
                    $set : {
                        paymentStatus : 'Paid',
                        paidAt : paymentDate,
                        trackingId : trackingId
                    }
                });

                //payment info to store in the db
                const payment = {
                    parcelName : session.metadata.parcelName,
                    parcelId : session.metadata.parcelId,
                    senderEmail : session.customer_email,
                    receiverName : session.metadata.receiverName,
                    currency : session.currency,
                    amount : (session.amount_total)/100,
                    transactionId : transactionId,
                    trackingId : trackingId,
                    paymentStatus : session.payment_status,
                    paidAt : paymentDate
                }

                //post payment info to db
                const postPayment = await paymentCollection.insertOne(payment);
                res.send({
                    success: true,
                    afterUpdate: afterUpdate,
                    postPayment: postPayment,
                    trackingId: trackingId,
                    transactionId: transactionId
                })
            }
            else{
                res.send({message: "Payment not completed"});
            }
        })

        //get all payments info for payment history
        app.get('/payment-history',async (req,res)=>{
            const {email} = req.query;
            const query = {};

            if(email){
                query.senderEmail = email;
            }

            const allPayments = await paymentCollection.find(query).sort({paidAt : -1}).toArray();
            res.send(allPayments);
        })

        //post user to db
        app.post('/users',async (req,res)=>{
            const newUser = req.body;

            const userExists = await usersCollection.findOne({email : newUser.email});

            if(userExists){
                return res.send({userExists : "user already exists, not posted."});
            }

            const afterPost = await usersCollection.insertOne(newUser);
            res.send(afterPost);
        })

        //save a rider application to db
        app.post('/riders',async (req,res)=>{
            const rider = req.body;
            const postRider = await ridersCollection.insertOne(rider);
            res.send(postRider);
        })

        //get all riders - as admin
        app.get('/riders',async (req,res)=>{
            const status = req.query.status;

            const query = {};

            if(status === "pending"){
                query.status = "pending"
            }
            else if(status === "approved"){
                query.status = "approved"
            }
            else if(status === "rejected"){
                query.status = "rejected"
            }

            const allRiders = await ridersCollection.find(query).toArray();
            res.send(allRiders);
        })

        //get a rider's details
        app.get('/riders/:id',async (req,res)=>{
            const {id} = req.params;
            const rider = await ridersCollection.findOne({_id : new ObjectId(id)});
            res.send(rider);
        })

        //update rider status --approve or reject
        app.patch('/riders/:id',async (req,res)=>{
            const id = req.params.id;
            const status = req.body.status;
            const email = req.body.email;

            const afterUpdate = await ridersCollection.updateOne({_id : new ObjectId(id)},{
                $set : {
                    status : status
                }
            })

            let updateRole = {};

            if(status === "approved"){
                updateRole = await usersCollection.updateOne({email : email},{
                    $set : {
                        role : "rider"
                    }
                })
            }
            else{
                updateRole = await usersCollection.updateOne({ email: email }, {
                    $set: {
                        role: "user"
                    }
                })
            }

            res.send({afterUpdate : afterUpdate,
                updateRole : updateRole
            })
        })


        //get all users
        app.get('/users',async (req,res)=>{
            const users = await usersCollection.find().toArray();
            res.send(users);
        })

        //update user role
        app.patch('/users/:id',async (req,res)=>{
            const id = req.params.id;
            const roleInfo = req.body;

            //find this user to check their previousRole to make it thier currentRole
            const thisUser = await usersCollection.findOne({_id : new ObjectId(id)});

            //if currentRole comes '' from front-end, that means he is getting removed from admin, so set their previousRole to their currentRole,
            /* this will update the roleInfo object that has come from front-end,
            where the currentRole was empty, now it will be whatever their previousRole was
            */
            if(roleInfo.currentRole === ''){
                roleInfo.currentRole = thisUser.previousRole;
            }

            const afterUpdate = await usersCollection.updateOne({_id : new ObjectId(id)},{
                $set : {
                    currentRole : roleInfo.currentRole, //roleInfo updated here in backend, from '' to whatever their previousRole was
                    previousRole : roleInfo.previousRole //previousRole being set to whatever their currentRole was, which has come from front-end
                }
            });

            res.send(afterUpdate);
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