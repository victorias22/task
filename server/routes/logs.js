// server/routes/logs.js
import express from 'express';
import { fetchLogsWithFilter } from '../services/logService.js';

const router = express.Router();

router.get('/logs', async (req, res, next) => {
  try {
    const {
      page   = 1,
      limit  = 100,
      client,
      country,
      fromDate,   // YYYY-MM-DD
      toDate      // YYYY-MM-DD
    } = req.query;

    const filters = {};
    if (client)  filters.transactionSourceName = client;
    if (country) filters.country_code         = country;

    if (fromDate || toDate) {
      filters.timestamp = {};
      if (fromDate) {
        filters.timestamp.$gte = `${fromDate}T00:00:00.000Z`;
      }
      if (toDate) {
        const nextDay = new Date(toDate);
        nextDay.setDate(nextDay.getDate() + 1);
        filters.timestamp.$lt = nextDay.toISOString();
      }
    }

    const { total, data } = await fetchLogsWithFilter({
      page:   Number(page),
      limit:  Number(limit),
      filters
    });

    res.json({ total, data });
  } catch (err) {
    next(err);
  }
});

export default router;
