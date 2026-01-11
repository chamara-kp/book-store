const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

// MongoDB URI
const uri =
  "mongodb+srv://chamara:chamara@cluster0.zfw6cvk.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  family: 4,
});

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();

    // Database & collection
    const booksCollection = client.db("BookInventory").collection("books");

    // POST: upload a book
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await booksCollection.insertOne(data);
      res.send(result);
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
