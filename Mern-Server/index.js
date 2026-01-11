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

//middleware

const uri =
  "mongodb+srv://chamara:chamara@cluster0.zfw6cvk.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  family: 4,
});

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();

    //create a database collection

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}
run();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
