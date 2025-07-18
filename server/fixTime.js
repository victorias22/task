import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = 'job_indexing'; // שימי לב לשם הזה - ודאי שהוא נכון!

async function fixTimestamps() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('logs');

    const cursor = collection.find({ timestamp: { $type: 'string' } });

    let updatedCount = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const date = new Date(doc.timestamp);

      if (!isNaN(date)) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { timestamp: date } }
        );
        updatedCount++;
      } else {
        console.warn(`⛔ שדה timestamp לא תקין במסמך ${doc._id}: ${doc.timestamp}`);
      }
    }

    console.log(`✅ הסתיים. עודכנו ${updatedCount} מסמכים.`);
  } catch (err) {
    console.error('שגיאה במהלך העדכון:', err);
  } finally {
    await client.close();
  }
}

fixTimestamps();
