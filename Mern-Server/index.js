const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

// ⚠️ Use .env in real projects
const uri =
  "mongodb+srv://chamara:chamara@cluster0.zfw6cvk.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  family: 4,
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");

    const booksCollection = client.db("BookInventory").collection("books");

    // POST: Upload a book
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await booksCollection.insertOne(data);
      res.send(result);
    });

    // GET: Get all books
    app.get("/all-book", async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result);
    });

    // DELETE: Delete a book by ID
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await booksCollection.deleteOne(filter);
      res.send(result);
    });

    // GET: Find books by category
    app.get("/all-books", async (req, res) => {
      let query = {};

      if (req.query.category) {
        query = { category: req.query.category };
      }

      const result = await booksCollection.find(query).toArray();
      res.send(result);
    });

    // PATCH: Update a book
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...updateBookData,
        },
      };

      const result = await booksCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
