const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
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

        //post a parcel 
        app.post('/parcels',async (req,res)=>{
            const newParcel = req.body;
            const afterPost = await parcelCollection.insertOne(newParcel);
            res.send(afterPost)
        })


        //get all my parcels
        app.get('/parcels',async (req,res)=>{
            const {email} = req.query;
            const query = {};

            if(email){
                query.senderEmail = email;
            }

            const parcels = await parcelCollection.find(query).toArray();
            res.send(parcels);
        })

        //get one parcel by id
        app.get('/parcels/:id',async (req,res)=>{
            const id = req.params.id;
            const parcel = await parcelCollection.findOne({_id : new ObjectId(id)});
            res.send(parcel);
        })

        //delete a parcel
        app.delete('/parcels/:id',async (req,res)=>{
            const {id} = req.params;
            const afterDelete = await parcelCollection.deleteOne({_id : new ObjectId(id)});
            res.send(afterDelete);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Zap shift server is running on port localhost:${port}`);
})