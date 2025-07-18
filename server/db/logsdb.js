// db/logsdb.js
// הקובץ שמדבר עם בסיס הנתונים
// "לך למסד הנתונים ותביא לי 100 שורות שמתחילות מהשורה ה-200, לפי התנאים הבאים…"
// db/logsdb.js
import mongoose from 'mongoose';

const Feed = mongoose.model('Feed', new mongoose.Schema({}, { strict: false }));

export async function countLogs(filter = {}) {
    
  return await Feed.countDocuments(filter);
}

export async function getLogs({ filter = {}, skip = 0, limit = 100 }) {
  return await Feed.find(filter)
    .sort({ timestamp: +1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

