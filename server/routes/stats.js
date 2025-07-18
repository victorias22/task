// server/routes/stats.js
import express from 'express';
import {
  getUsersStats,
  getStatsOverview,
  getStatsAnomalies,
  getTimeSeriesStats
} from '../controllers/statsController.js';

const router = express.Router();


router.get('/users', getUsersStats);
router.get('/overview', getStatsOverview);
router.get('/anomalies', getStatsAnomalies);
router.get('/timeSeries', getTimeSeriesStats);  

export default router;
