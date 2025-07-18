import express from 'express';
import { handleOpenaiQuery } from '../controllers/openaiController.js';

const router = express.Router();

router.post('/query', handleOpenaiQuery);

export default router;
