//תפקיד:
// מקבל שאלה (prompt)
// שולח אותה ל־OpenAI
// מחזיר את תוצאת הניתוח – כולל שאילתת MongoDB מפורמטת

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
אתה עוזר AI במערכת BI. התפקיד שלך הוא להמיר שאלות מהמשתמש לשאילתות MongoDB.
הנתונים מגיעים מאוסף בשם "feeds", עם מבנה שכולל:
- country_code (מחרוזת)
- transactionSourceName (מחרוזת)
- timestamp (תאריך ISO)
- progress: {
    TOTAL_JOBS_SENT_TO_INDEX,
    TOTAL_JOBS_FAIL_INDEXED,
    TOTAL_JOBS_IN_FEED,
    TOTAL_RECORDS_IN_FEED,
    TOTAL_JOBS_SENT_TO_ENRICH,
    TOTAL_JOBS_DONT_HAVE_METADATA,
    TOTAL_JOBS_DONT_HAVE_METADATA_V2
}
- recordCount (מספר)
- uniqueRefNumberCount (מספר)

עליך להחזיר JSON שמכיל:
{
  "action": "avg | sum | count",
  "field": "progress.TOTAL_JOBS_SENT_TO_INDEX",
  "groupBy": "country_code | transactionSourceName | null",
  "filter": { ... אם יש },
  "query": [...שורת aggregation של MongoDB...]
}

אם השאלה לא מובנת או לא ניתן לתרגם – החזר:
{ "error": "לא הצלחתי להבין את השאלה." }
`;

export async function interpretUserPrompt(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    let reply = completion.choices[0].message.content.trim();

    if (reply.startsWith('```json')) {
      reply = reply.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (reply.startsWith('```')) {
      reply = reply.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(reply);
    return parsed;
  } catch (err) {
    console.error(' OpenAI Error:', err.message);
    return { error: 'שגיאה בעיבוד השאלה' };
  }
}