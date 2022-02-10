const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkmic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('rooftop'); 
    const productCollection = database.collection('product');

    // GET API
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product);

    })

    // POST API 
    app.post('/product', async(req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log('got new product', req.body);
      console.log('added product', result)
      res.json(result);
    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Rooftop-Farm Server Site')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})