const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// MIDDLEWARE //
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yy4jwyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db("craftItemDB").collection("craftItem");
    const artcraftCollection = client.db("craftItemDB").collection("ArtAndCraftCategories");

    app.get("/craftitem", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/artandcraft", async (req, res) => {
      const cursor = artcraftCollection.find();
      const result = await cursor.toArray();
      console.log(result)
      res.send(result);
    });

    // app.get('/craftitem_artandcraft', async(req,res) => {
    //   const cursor = craftCollection.find();
    //   const result = await cursor.toArray();
    //   console.log(result);
      
    // })

    app.get("/craftitem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query); 
      res.send(result);
      console.log(result);
    });
    // app.get(`/craftitem/:subcategory_Name`, async(req, res) => {
    //     console.log(req.params.subcategory_Name);
    //     const query = { subcategory_Name: "Craft" };
    //     const options = {
    //         sort: { "imdb.rating": -1 },
    //         projection: { _id: 0, rating:4.3, title: 1, imdb: 1 },
    //       };
    //     const result = await craftCollection.findOne(query,options);
    //     console.log(result);
    // })


    // app.get("/craftitem_category/:email", async (req, res) => {
    //   // const result = await craftCollection.findOne({email: req.params.email});
    //   // res.send(result);
    //   const email = req.query.email;
    //   const cursor = {email: email}
    //   const result = await craftCollection.find(cursor).toArray();
    //   // console.log(result)
    //   res.send(result)
    // })

    app.get("/craftitem", async(req, res) => {
      const email = req.query.email;
      if(email) {
        const result = await craftCollection.find({email: email}).toArray();
        res.send(result)
      }else {
        const result2 = await craftCollection.find().toArray();
        res.send(result2)
      }
    })

    app.post("/craftitem", async (req, res) => {
      const newCraftItem = req.body;
      console.log(newCraftItem);
      const result = await craftCollection.insertOne(newCraftItem);
      res.send(result);
    });

    app.delete('craftitem/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ROOT //

app.get("/", (req, res) => {
  res.send("Art and Craft is Running!");
});
app.listen(port, () => {
  console.log(`Art and Craft Server is Running on Port ${port} `);
});
