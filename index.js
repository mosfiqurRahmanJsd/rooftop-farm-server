const express = require('express')
var cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
    const farmCollection = database.collection('farm');

    // GET API
    // product sent to database
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    })

    // rooftop send to database
    app.get('/rooftop', async (req, res) => {
      const cursor = farmCollection.find({});
      const rooftop = await cursor.toArray();
      res.send(rooftop);
    })

    
     
    // GET Single Service
    app.get(`/rooftop/:id`, async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const rooftop = await farmCollection.findOne(query);
      res.json(rooftop);
    })


   

    // POST API 
    // Product Post
    app.post('/product', async(req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log('got new product', req.body);
      console.log('added product', result)
      res.json(result);
    })

     // RooftopFarm Post
     app.post('/rooftop', async(req, res) => {
      const newProduct = req.body;
      const result = await farmCollection.insertOne(newProduct);
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