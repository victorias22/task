import { interpretUserPrompt } from '../services/openaiService.js'; 
import { runMongoQuery } from '../services/mongoQueryService.js';

export async function askQuestion(req, res) {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const interpreted = await interpretUserPrompt(prompt); // קריאה נכונה לפונקציה
    if (!interpreted.query || interpreted.query.length === 0) {
      return res.status(400).json({ error: 'שאילתת MongoDB ריקה או לא קיימת' });
    }

    const result = await runMongoQuery(interpreted);

    res.json({ interpreted, result });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
