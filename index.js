const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// MIDDLEWARE //
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yy4jwyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const craftCollection = client.db("craftItemDB").collection("craftItem");
    const canvasCollection = client
      .db("craftItemDB")
      .collection("popularCategories");
    const artcraftCollection = client
      .db("craftItemDB")
      .collection("ArtAndCraftCategories");

    app.get("/craftitem", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/artandcraft", async (req, res) => {
      const cursor = artcraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/canvas", async (req, res) => {
      const cursor = canvasCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/craftitem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });
    
    app.get("/craftitem", async (req, res) => {
      const email = req.query.email;
      if (email) {
        const result = await craftCollection.find({ email: email }).toArray();
        res.send(result);
      } else {
        const result2 = await craftCollection.find().toArray();
        res.send(result2);
      }
    });

    app.post("/craftitem", async (req, res) => {
      const newCraftItem = req.body;
      const result = await craftCollection.insertOne(newCraftItem);
      res.send(result);
    });

    app.put("/craftitemupdate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const updatedProductItem = {
        $set: {
          image: updatedProduct.image,
          name: updatedProduct.name,
          price: updatedProduct.price,
          processing_time: updatedProduct.processing_time,
          rating: updatedProduct.rating,
          shortdescription: updatedProduct.shortdescription,
          stockStatus: updatedProduct.stockStatus,
          subcategory_Name: updatedProduct.subcategory_Name,
          customization: updatedProduct.customization,
        },
      };
      const result = await craftCollection.updateOne(
        filter,
        updatedProductItem,
        options
      );
      res.send(result);
    });

    app.delete("/craftitem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
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
