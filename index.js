const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Java Bakery Shop Server is Running')
})

// MongoDB Connection //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vhdpi0m.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// MongoDB Collection //
async function run() {
const categoryCollection = client.db('javabakeryshop').collection('category');
    const allcategoriesCollection = client.db('javabakeryshop').collection('allcategories');
    try {
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });
    }

    finally {

    }
}
run().catch(err => console.error(err));
app.listen(port, () => {
    console.log(`Java Bakery Shop Server is Running on ${port}`);
})