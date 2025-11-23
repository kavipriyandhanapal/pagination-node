import { connectDB } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.method === "GET") {
      const totalItems = await usersCollection.countDocuments();
      const users = await usersCollection
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();

      return res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        users,
      });
    }

    if (req.method === "PATCH") {
      return res.status(200).json({ message: "PATCH working!" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
