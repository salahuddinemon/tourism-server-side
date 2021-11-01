const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfwoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db('travelDb');
        const servicesCollecion = database.collection('services');
        const orderCollection = database.collection('orders');

        //Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollecion.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get Single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting service ', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollecion.findOne(query);
            res.json(service);
        })

        //Post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post api', service);
            const result = await servicesCollecion.insertOne(service);
            console.log(result);
            res.json(result);
        })

        //Get Orders API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            // console.log('order info', order);
            res.json(result);
        })
        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running travel server');
});

app.listen(port, () => {
    console.log('Start travel server', port);
})
