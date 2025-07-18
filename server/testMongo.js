// testMongo.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env file.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  tls: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000,
  tlsAllowInvalidCertificates: false // זמנית true אם יש בעיות אבטחה בסביבה מקומית
});

async function run() {
  try {
    console.log("🔍 Trying to connect to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("\n❌ Connection failed!");
    console.error("📛 Error name:", err.name);
    console.error("🧾 Error message:", err.message);
    if (err.cause) {
      console.error("💣 Root cause:", err.cause.message || err.cause);
    }

    if (err.message.includes("tls") || err.name.includes("SSL")) {
      console.warn("\n🛡️ TLS/SSL Error detected!");
      console.warn("➡️ נסי להוריד לגרסת Node 20, או להוסיף tlsAllowInvalidCertificates: true לבדיקה מקומית.");
    }

    if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
      console.warn("\n🌐 Network or DNS issue detected!");
      console.warn("➡️ בדקי חיבור לאינטרנט, VPN, או הגדרת DNS.");
    }
  } finally {
    await client.close();
  }
}

run();
