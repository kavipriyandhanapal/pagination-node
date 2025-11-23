import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let cachedDb = null;

export async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  await client.connect();

  // If your URL has NO DB name, MongoDB uses "test" DB by default
  const dbName = "pagination"; // your DB name
  const db = client.db(dbName);

  cachedDb = db;
  return db;
}
