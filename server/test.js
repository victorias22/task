import { MongoClient } from "mongodb";

async function testDateFilter() {
  const uri = 'mongodb+srv://victoriasolomtin:zEtgiA2-FjnkaDD@cluster0.8kl1qkj.mongodb.net/job_indexing?retryWrites=true&w=majority&appName=Cluster0';
  const client = await MongoClient.connect(uri);

  const db = client.db('job_indexing');
  const collection = db.collection('feeds');

  const from = "2025-07-13T00:00:00.000Z";
  const to = "2025-07-14T00:00:00.000Z";

  const result = await collection.find({
    timestamp: {
      $gte: from,
      $lt: to
    }
  }).toArray();

  console.log(`🔍 Found ${result.length} documents:`);
  result.forEach(doc => console.log(doc.timestamp));
  
  await client.close();
}

testDateFilter().catch(console.error);
