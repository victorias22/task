// db/statsdb.js
import mongoose from 'mongoose';

// ✅ הגדרה בטוחה שלא תזרוק OverwriteModelError
const Feed = mongoose.models.Feed || mongoose.model('Feed', new mongoose.Schema({}, { strict: false }));

export async function aggregateStats(pipeline) {
  return await Feed.aggregate(pipeline);
}
