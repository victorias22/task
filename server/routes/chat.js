// server/routes/chat.js
import express from 'express';
import { askQuestion } from '../controllers/chatController.js';

const router = express.Router();
router.post('/', askQuestion);

export default router;
