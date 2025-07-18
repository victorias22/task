מערכת ניתוח לוגים AI
היי, אני ויקטוריה – וזה הפרויקט שבניתי במסגרת תהליך למשרת Full-Stack.
המטרה הייתה לפתח מערכת שמציגה לוגים בצורה נוחה, כולל גרפים ו־צ'אט שמבין שאלות בשפה טבעית ויודע לשלוף נתונים מתוך MongoDB.
🚀 איך מריצים את הפרויקט?
git clone https://github.com/viktoria/<repo>
cd <repo>

הגדירו קובץ .env בתיקיית server/:

MONGODB_URI=<ה־URI שלך למונגו>
OPENAI_API_KEY=<המפתח שלך ל־OpenAI>
PORT=5000

התקנה והרצה:

cd server
npm install
npm run dev

> 🛠 חשוב! התקיני גם את `@mui/material`, `@mui/x-date-pickers` ו־`dayjs` בפרונט.
cd client
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-date-pickers dayjs
npm install @vitejs/plugin-react
npm run dev


השרת יאזין ב־http://localhost:5000

הפרונט ירוץ על http://localhost:5173

🧩 מה המערכת יודעת לעשות?

🗂️ טבלת לוגים עם סינון לפי תאריכים, לקוח ומדינה

📊 גרפים: עמודות, עוגות, סרגלים, time-series

💬 צ'אט שמבין שאלות כמו:

"כמה לקוחות יש בכל מדינה?"

"מה הממוצע של TOTAL_JOBS_SENT_TO_INDEX לפי לקוח?"

"כמה כשלונות היו בכל מדינה בחודש האחרון?"

🛠 טכנולוגיות עיקריות

Frontend
React + Vite, Material UI, Recharts, Axios, Day.js

Backend
Node.js + Express, Mongoose, OpenAI SDK, Clean Architecture (routes/controllers/services/db)

AI
OpenAI GPT-4, Prompt Engineering, Aggregation Pipeline Generator

📷 תמונות מסך

דשבורד כללי:
![Dashboard](uploads/צילום מסך 2025-07-17 222116.png)

פילטור לוגים לפי תאריכים, מדינה ולקוח:
![Filters](uploads/צילום מסך 2025-07-17 222129.png)

ממשק צ'אט עם תשובה בטבלה:
![Chat Table](uploads/צילום מסך 2025-07-17 222133.png)

גרף עמודות עם משרות ממוצעות:
![Chart](uploads/צילום מסך 2025-07-17 222052.png)

גרף עוגה לפי מדינה:
![Pie Chart](uploads/צילום מסך 2025-07-17 222057.png)

🧾 מסמך תהליך

1. **עיצוב מבנה הנתונים**
   - עבודה מול מסמכי MongoDB מסוג Feed.
   - נתונים כמו: `TOTAL_JOBS_SENT_TO_INDEX`, `country_code`, `timestamp`, `transactionSourceName`.

2. **הקמת שרת**
   - `Node.js + Express`
   - קובץ `server.js` עם קונפיגורציה בסיסית, `cors`, `dotenv`, חיבור למסד.

3. **יצירת endpoints**
   - `/api/logs` – החזרת לוגים עם סינון
   - `/api/stats` – החזרת ממוצעים / סכומים / group-by
   - `/api/chat` – עיבוד שאלה עם OpenAI והחזרת נתונים מתאימים

4. **פיתוח Chat Assistant**
   - ניתוח כוונה: keywords → prompt → שאילתה מתאימה ל־Mongo
   - שימוש ב־OpenAI לתרגום שפה טבעית ל־Mongo Aggregation Pipeline
   - עיצוב תשובה בטבלה / טקסט / גרף

5. **הוספת גרפים וטבלאות**
   - שימוש ב־Recharts + MUI להצגת גרפים, כולל Pie, Bar, Sparkline.
   - ממשק אינטראקטיבי עם סינון.

---

## 📊 דוגמה ל־Prompting

```js
// queryPrompts.js
{
  question: "מה הממוצע של TOTAL_JOBS_SENT_TO_INDEX לפי לקוח?",
  keywords: ["ממוצע", "index", "לקוח"],
  prompt: `
    אתה עוזר למערכת לוגים.
    צור שאילתה שמחזירה ממוצע של progress.TOTAL_JOBS_SENT_TO_INDEX לפי transactionSourceName.
    החזר JSON עם שדה 'query'.
  `
}


רוצים לראות איך הכל בנוי?
יש גם PROCESS.md עם כל הארכיטקטורה, ההחלטות הטכניות וה־promptים.

