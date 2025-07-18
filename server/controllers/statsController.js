// controllers/statsController.js
import { getOverviewStats } from '../services/statsService.js';
import { getAnomalyStats } from '../services/statsService.js';
import { getUsersPerCountry } from '../services/statsService.js';
import { getTimeSeries } from '../services/statsService.js';

 export async function getStatsOverview(req, res) {
  try {
    console.log(' נכנסנו לסטטיסטיקות!');
    const stats = await getOverviewStats();
    res.json(stats || {});
  } catch (err) {
    console.error(' שגיאה בסטטיסטיקות:', err);
    res.status(500).json({ error: 'שגיאה בעת שליפת סטטיסטיקות' });
  }
}
export async function getStatsAnomalies(req, res) {
  try {
    console.log('🚨 בודקים חריגות בלוגים לפי מדינה');
    const anomalies = await getAnomalyStats();
    res.json(anomalies || []);
  } catch (err) {
    console.error('שגיאה בחישוב חריגות:', err);
    res.status(500).json({ error: 'שגיאה בעת שליפת חריגות' });
  }
}

export async function getUsersStats(req, res) {
  try {
    const result = await getUsersPerCountry();
    res.json(result);
  } catch (err) {
    console.error('שגיאה בשליפת לקוחות לפי מדינה:', err);
    res.status(500).json({ error: 'שגיאה בעת שליפת לקוחות' });
  }
}

// Controller for time series data
export async function getTimeSeriesStats(req, res, next) {
  try {
    console.log('📈 Fetching time series statistics');
    const series = await getTimeSeries();
    res.json(series ?? []);
  } catch (err) {
    console.error('Error fetching time series stats:', err);
    next(err);
  }
}