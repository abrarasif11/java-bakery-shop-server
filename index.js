const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' })
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(401).send({ message: 'Forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     })
// }
// MongoDB Collection //
async function run() {
    const categoryCollection = client.db('javabakeryshop').collection('category');
    const allcategoriesCollection = client.db('javabakeryshop').collection('allcategories');
    const ordersCollection = client.db('javabakeryshop').collection('orders');
    const itemsCollection = client.db('javabakeryshop').collection('items')
    const userCollection = client.db('javabakeryshop').collection('users')
    try {
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });
        app.get('/allcategories', async (req, res) => {
            const query = {}
            const cursor = allcategoriesCollection.find(query);
            const allcategories = await cursor.toArray();
            res.send(allcategories);
        });
        // choose category //
        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = {};
            const cursor = await allcategoriesCollection.find(query).toArray();
            const categories = cursor.filter((n) => n.category_id === id);
            res.send(categories);
            console.log(categories);
        });
        app.post('/orders', async (req, res) => {
            const order = req.body
            console.log(order);
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });
        app.get("/items", async (req, res) => {
            const query = {};
            const cursor = await itemsCollection.find(query);
            const reviews = await cursor.toArray();
            const reverseArray = reviews.reverse();
            res.send(reverseArray);
        });
        app.post("/items", async (req, res) => {
            const items = req.body;
            const result = await itemsCollection.insertOne(items);
            res.send(result);
        });
        // Email Query //
        app.get("/items", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await itemsCollection.find(query).toArray();;
            res.send(cursor);
        });
        //   JWT TOKen //
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
            console.log(user);
        })
        // user list // 
        app.get("/usersList", async (req, res) => {
            const query = {};
            const cursor = await userCollection.find(query);
            const reviews = await cursor.toArray();
            const reverseArray = reviews.reverse();
            res.send(reverseArray);
        });
        app.post("/usersList", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.put("/usersList/admin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option,);
            console.log(result);
            res.send(result);
        });
        app.get('/usersList/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });
        // admin delete //
        app.delete("/usersList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });
        
    }

    finally {

    }
}
run().catch(err => console.error(err));
app.listen(port, () => {
    console.log(`Java Bakery Shop Server is Running on ${port}`);
})