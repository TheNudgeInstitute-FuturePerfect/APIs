// db.js
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url, { useNewUrlParser: true });

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

export { client, connectToDatabase };
