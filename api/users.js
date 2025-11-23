const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
  }
  if (!db) {
    db = client.db("pagination");
  }
  return db;
}

module.exports = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const total = await usersCollection.countDocuments();
    const users = await usersCollection.find().skip(skip).limit(limit).toArray();

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
