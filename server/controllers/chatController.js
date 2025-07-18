// controllers/chatController.js

import OpenAI from 'openai';
import mongoose from 'mongoose';
import { findMatchingPrompt } from '../services/queryPrompts.js';
import { responseTemplates } from '../services/responseTemplates.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// מודל MongoDB גמיש ללא סכימה קשיחה
const Feed = mongoose.models.Feed ||
  mongoose.model('Feed', new mongoose.Schema({}, { strict: false }));

// מפרש את הפרומפט לשאילתא MongoDB aggregation pipeline
export async function interpretUserPrompt(prompt) {
  const systemMessage = `
    אתה עוזר שמקבל שאלה בעברית ומחזיר שאילתת MongoDB aggregation pipeline מתאימה.
    החזר JSON עם שדה 'query' שמכיל מערך של שלבי pipeline.
    אם לא מצליח לפרש, החזר query ריק.
    כשמודל כותב תשובה, השפה תהיה פשוטה, ברורה וקריאה בעברית.
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ],
  });

  try {
    const responseText = completion.choices[0].message.content;
    return JSON.parse(responseText);
  } catch {
    return { query: [] };
  }
}

// מריץ את שאילתת MongoDB בפייפליין
export async function runMongoQuery(interpreted) {
  if (!interpreted.query || interpreted.query.length === 0) {
    return [];
  }
  return await Feed.aggregate(interpreted.query);
}

// פורמט תוצאה לטבלה טקסטואלית
function formatResultAsTable(result) {
  if (!Array.isArray(result) || result.length === 0) {
    return 'אין נתונים להצגה.';
  }
  const headers = Object.keys(result[0]);
  const headerRow = headers.join(' | ');
  const separatorRow = headers.map(() => '---').join(' | ');
  const rows = result.map(row =>
    headers.map(h => String(row[h] ?? '')).join(' | ')
  );
  return [headerRow, separatorRow, ...rows].join('\n');
}

// בקר ראשי לטיפול ב‑POST /api/chat
export async function askQuestion(req, res) {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // בודקים אם השאלה נתמכת
  const queryPrompt = findMatchingPrompt(prompt);
  if (!queryPrompt) {
    return res
      .status(400)
      .json({ error: 'השאלה לא נתמכת כרגע. נסה שאלה אחרת.' });
  }

  try {
    const displayType = queryPrompt.displayType; // 'table' | 'chart' | undefined

    let rawResult = null;
    let tableText = null;

    // רק אם displayType מוגדר – מריצים aggregation
    if (displayType === 'table' || displayType === 'chart') {
      const interpreted = await interpretUserPrompt(queryPrompt.prompt);
      if (!interpreted.query || interpreted.query.length === 0) {
        return res
          .status(400)
          .json({ error: 'שאילתת MongoDB ריקה או לא קיימת' });
      }
      rawResult = await runMongoQuery(interpreted);
      if (displayType === 'table') {
        tableText = formatResultAsTable(rawResult);
      }
    }

    // בונים את הפרומפט לסיכום בעברית
    const summaryPrompt = `
    יש לך שאלה: "${prompt}"
    ${tableText ? `וזו הטבלה עם הנתונים שהתקבלו:\n${tableText}` : ''}
    ${responseTemplates}

    כתוב תשובה ברורה, קצרה ופשוטה בעברית שמתייחסת ${
        tableText ? 'לנתונים האלו' : 'לשאלה'
        }.
        `;

    // שולחים ל־OpenAI לקבלת התשובה המנוסחת
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: summaryPrompt }],
    });
    const answer = completion.choices[0].message.content;

    // בונים את ה־JSON שמוחזר ל־frontend
    const payload = { answer };
    if (tableText)    payload.table       = tableText;
    if (rawResult)    payload.rawResult   = rawResult;
    if (displayType)  payload.displayType = displayType;

    res.json(payload);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
