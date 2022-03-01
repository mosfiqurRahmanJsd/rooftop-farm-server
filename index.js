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








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quauy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('rooftop');

    const productCollection = database.collection('product');
    const farmCollection = database.collection('farm');
    const blogCollection = database.collection('blog');
    const paymentCollection = database.collection('payment');
    const entrepreneurCollection = database.collection('email');

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

    // rooftop send to database
    app.get('/blog', async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();
      res.send(blog);
    })

    // GET Single Blog
    app.get(`/blog/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.json(blog);
    })




    // GET Single Service
    app.get(`/rooftop/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const rooftop = await farmCollection.findOne(query);
      res.json(rooftop);
    })


    // Get payment Information
    app.get('/payment', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = paymentCollection.find(query);
      const payment = await cursor.toArray();
      res.send(payment);
    })


    // get entrepreneur
    app.get('/entrepreneur', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = entrepreneurCollection.find(query);
      const entrepreneur = await cursor.toArray();
      res.json(entrepreneur);
    })




    // Product Post
    app.post('/entrepreneur', async (req, res) => {
      const newEntrepreneur = req.body;
      const result = await entrepreneurCollection.insertOne(newEntrepreneur);
      console.log('got new entrepreneur', req.body);
      console.log('added entrepreneur', result);
      res.json(result);
    })








    // POST API 
    // Product Post
    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log('got new product', req.body);
      console.log('added product', result);
      res.json(result);
    })


    // Blog Post
    app.post('/blog', async (req, res) => {
      console.log('Hitting the post');
      const newBlog = req.body;
      const result = await blogCollection.insertOne(newBlog);
      console.log('got new rooftop', req.body);
      console.log('added rooftop', result);
      res.json(result);
    })



    // RooftopFarm Post
    app.post('/rooftop', async (req, res) => {
      console.log('Hitting the post');
      const newRooftop = req.body;
      const result = await farmCollection.insertOne(newRooftop);
      console.log('got new rooftop', req.body);
      console.log('added rooftop', result);
      res.json(result);
    })


    // Payment Post
    app.post('/payment', async (req, res) => {
      console.log('Hitting the payment');
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      console.log('got new payment', req.body);
      console.log('added payment', result);
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