const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middle Wares //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Java Bakery Shop Server is Running')
})

app.listen(port, () => {
    console.log(`Java Bakery Shop Server is Running on ${port}`);
})