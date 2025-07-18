import express from 'express';
import { getLogs, countLogs } from '../services/logService.js'; 
const router = express.Router();

router.get('/logs', async (req, res) => {
  const { page = 1, limit = 100, client, country, fromDate, toDate } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};

  if (client) {
    filter.transactionSourceName = client;
  }

  if (country) {
    filter.country_code = country;
  }

  if (fromDate || toDate) {
    filter.timestamp = {};

    if (fromDate) {
        const localFrom = new Date(fromDate);
        from.setDate(from.getDate() + 2); 
        filter.timestamp.$gte = localFrom.toISOString();
    }

    if (toDate) {
        const localTo = new Date(toDate);
        to.setDate(to.getDate() + 2); 
        filter.timestamp.$lt = localTo.toISOString();
  }
  }

  try {
    const total = await countLogs(filter);
    const data = await getLogs({ filter, skip, limit: Number(limit) });

    res.json({ total, data });
  } catch (err) {
    console.error(' שגיאה בעת שליפת לוגים:', err);
    res.status(500).json({ error: 'שגיאה בשרת' });
  }
});

export default router;
