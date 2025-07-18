// services/queryPrompts.js

export const queryPrompts = [
  {
    question: "מהו ממוצע המשרות שנשלחו לאינדוקס לפי כל לקוח?",
    keywords: ["ממוצע", "אינדוקס", "משרות", "average", "jobs", "index"],
    prompt: `
      אתה עוזר למערכת שמנתחת נתונים על לוגים ומשרות במסד MongoDB.
      המשימה שלך היא ליצור שאילתת aggregation pipeline שמחשבת את הממוצע של השדה progress.TOTAL_JOBS_SENT_TO_INDEX לכל לקוח.
      שדה הלקוח הוא 'transactionSourceName'.
      כתוב תשובה בפורמט JSON שמכילה שדה 'query' עם מערך של שלבי pipeline בלבד.
      לדוגמה:
      {
        "query": [
          { "$group": { "_id": "$transactionSourceName", "averageJobsSentToIndex": { "$avg": "$progress.TOTAL_JOBS_SENT_TO_INDEX" } } },
          { "$sort": { "averageJobsSentToIndex": -1 } }
        ]
      }
      החזר רק JSON תקין ללא הסברים נוספים.
    `,
    displayType: "chart"
  },
  {
    question: "כמה רשומות יש לכל לקוח?",
    keywords: ["כמה", "רשומות", "count", "records"],
    prompt: `
      אתה עוזר למערכת שמנתחת נתונים על לוגים ומשרות במסד MongoDB.
      המשימה שלך היא ליצור שאילתת aggregation pipeline כדי לספור את כמות הרשומות עבור כל לקוח.
      שדה הלקוח הוא 'transactionSourceName'.
      כתוב תשובה בפורמט JSON שמכילה שדה 'query' עם מערך של שלבי pipeline בלבד.
      לדוגמה:
      {
        "query": [
          { "$group": { "_id": "$transactionSourceName", "totalRecords": { "$sum": 1 } } },
          { "$sort": { "totalRecords": -1 } }
        ]
      }
      החזר רק JSON תקין ללא הסברים נוספים.
    `,
    displayType: "table"
  },
  {
    question: "כמה לקוחות יש בסך הכל לכל מדינה?",
    keywords: ["כמה", "לקוחות", "מדינה", "countries"],
    prompt: `
      אתה עוזר למערכת שמנתחת נתונים על לוגים ומשרות במסד MongoDB.
      המשימה שלך היא ליצור שאילתת aggregation pipeline שמוצאת את כמות הלקוחות הייחודיים (transactionSourceName) לכל מדינה (country_code).
      כתוב תשובה בפורמט JSON שמכילה שדה 'query' עם מערך של שלבי pipeline בלבד.
      לדוגמה:
      {
        "query": [
          {
            "$group": {
              "_id": { "country": "$country_code", "client": "$transactionSourceName" }
            }
          },
          {
            "$group": {
              "_id": "$_id.country",
              "uniqueClientsCount": { "$sum": 1 }
            }
          },
          {
            "$sort": { "uniqueClientsCount": -1 }
          }
        ]
      }
      החזר רק JSON תקין ללא הסברים נוספים.
    `,
    displayType: "table"
    
  },
  {
    question: "מה החריגה הכי גדולה לפי מדינה?",
    keywords: ["חריגה", "סטיית תקן", "outlier", "anomaly"],
    prompt: `
      השאלה היא: "מה החריגה הכי גדולה לפי מדינה?"
      כתוב שאילתת MongoDB aggregation pipeline שסופרת את כמות הלוגים לכל מדינה,
      ולאחר מכן מזהה חריגות לפי סטיית תקן.
      החזר JSON עם שדה 'query' שמכיל את הפייפליין בלבד.
    `,
    displayType: "table"
  }
];

// מנסה קודם התאמה מדויקת, ורק אחר כך לפי keywords
export function findMatchingPrompt(userQuestion) {
  const trimmed = userQuestion.trim();

  // 1) התאמה מדויקת
  const exact = queryPrompts.find(item => item.question === trimmed);
  if (exact) {
    return { prompt: exact.prompt, displayType: exact.displayType };
  }

  // 2) התאמה לפי keywords
  const lowerQ = trimmed.toLowerCase();
  for (const item of queryPrompts) {
    if (item.keywords.some(kw => lowerQ.includes(kw.toLowerCase()))) {
      return { prompt: item.prompt, displayType: item.displayType };
    }
  }

  return null;
}
