import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const client = new MongoClient(process.env.MONGODB_URI);

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db("job_indexing");
    const collection = db.collection("feeds");

    const total = await collection.countDocuments();
    const data = await collection.find()
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();

    res.json({ total, data });
  } catch (err) {
    console.error('שגיאה בשליפה:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
