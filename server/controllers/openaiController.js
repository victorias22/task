import { interpretUserPrompt } from '../services/openaiService.js';
import { aggregateStats } from '../db/statsdb.js';

export async function handleOpenaiQuery(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'חסר טקסט שאלה (prompt)' });
  }

  // מפרש את השאלה עם GPT
  const interpreted = await interpretUserPrompt(prompt);

  if (interpreted.error) {
    return res.status(400).json({ error: interpreted.error });
  }

  if (!interpreted.query) {
    return res.status(400).json({ error: 'לא התקבלה שאילתת Mongo תקינה מה־AI.' });
  }

  try {
    // מריץ את השאילתה על MongoDB
    const result = await aggregateStats(interpreted.query);

    res.json({
      interpreted,
      result,
    });
  } catch (err) {
    console.error('Mongo Aggregation Error:', err.message);
    res.status(500).json({ error: 'שגיאה בהרצת השאילתה על מסד הנתונים' });
  }
}
