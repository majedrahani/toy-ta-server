const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())


// mongoDB

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zael0vm.mongodb.net/?retryWrites=true&w=majority`;

const uri = 'mongodb://0.0.0.0:27017'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCategoryCollection = client.db('toyTa').collection('shopByCategoryData')
    const uploadCollection = client.db('toyTa').collection('uploads')




    app.get('/categoryToys', async (req, res) => {
      const cursor = toysCategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/categoryToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCategoryCollection.findOne(query);
      res.send(result)
    })

    // uploads
    app.post('/uploads', async (req, res) => {
      const upload = req.body;
      console.log(upload);
      const result = await uploadCollection.insertOne(upload);
      res.send(result)
    })

    app.get('/uploads', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await uploadCollection.find(query).limit(20).toArray();
      res.send(result)
    })

    app.get('/uploads/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await uploadCollection.findOne(query);
      res.send(result)
    })

    app.put('/uploads/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // const options = { upsert: true }
      const updatedToy = req.body;
      const toy = {
        $set: {
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description
        }
      }
      const result = await uploadCollection.updateOne(filter,  toy)
      res.send(result)
    })

    app.delete('/uploads/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await uploadCollection.deleteOne(query);
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send('toy ta is running')
})

app.listen(port, () => {
  console.log(`Toy ta is running on port ${port}`);
})