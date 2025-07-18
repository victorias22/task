// ====== server.js ======
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// Routes
import logsRouter from './routes/logs.js';
import statsRouter from './routes/stats.js';
import openaiQueryRouter from './routes/openaiQuery.js'; // 👈 הצ'אט החדש
import chatRouter from './routes/chat.js'; // 👈 חדש

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ====== MongoDB connection ======
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// ====== Routes ======
app.use('/api', logsRouter);         // כלומר: /api/logs
app.use('/api/stats', statsRouter);  // כלומר: /api/stats
app.use('/api/openai', openaiQueryRouter); // POST /api/openai/query
app.use('/api/chat', chatRouter);

// ====== Start server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
