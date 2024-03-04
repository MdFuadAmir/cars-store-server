const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

// ~~~~~~~~~~~~~~~~~~ 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sldyvva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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

    // collections
    const carCollection = client.db('carDB').collection('car');
    // read
    app.get('/car', async(req,res) =>{
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // upeate
    app.get('/car/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await carCollection.findOne(query);
      res.send(result);
    })
    // creat
    app.post('/car', async(req,res)=>{
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    })
    // delete
    app.delete('/car/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await carCollection.deleteOne(query);
      res.send(result);
    })
    // update
    app.put('/car/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true};
      const updatedCar = req.body;
      const car ={
        $set:{
          carName: updatedCar.carName,
          engineName: updatedCar.engineName,
          cubicCC:updatedCar.cubicCC,
          price:updatedCar.price,
          photo:updatedCar.photo
        }
      }
      const result = await carCollection.updateOne(filter,car,options);
      res.send(result);
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

// ~~~~~~~~~~~~~~~~~~













app.get('/', (req,res)=>{
    res.send('Cars Making server is running');
})

app.listen(port, () =>{
    console.log(`Cars server is running on port: ${port}`);
})

