🛠️ מסמך תהליך הפיתוח - Botson Dashboard

נושא	החלטה	למה?
Database	MongoDB עם סכימה גמישה	הנתונים משתנים בין לקוחות
גרפים	Recharts + MUI	עיצוב נקי, שילוב פשוט
AI Integration	OpenAI API (GPT-4)	הבנה טובה של שפה טבעית
Prompting	בנוי על keywords ו־templates	שליטה טובה בתוצאה
סרביסים נפרדים	לפי תחום: logsService, statsService	מודולרי, ניתן להרחבה
ניהול קוד	Clean Architecture	נוחות בדיבאג, קריאות


המסמך מתאר את זרימת העבודה והארכיטקטורה של פרויקט Botson, מערכת Dashboard עם יכולות ניתוח לוגים וצ'אט מבוסס GPT.

🧱 ארכיטקטורה כללית

client/ (React + MUI + Recharts)
│
├── components/
│   ├── JobLogsTable.jsx
│   ├── CountryStatsBarChart.jsx
│   ├── CountryPieChart.jsx
│   ├── AnomaliesOverview.jsx
│   └── ChatBox.jsx
│
├── pages/
│   └── HomePage.jsx
│
├── App.jsx
└── main.jsx

server/ (Node.js + Express + Mongoose)
│
├── routes/
│   ├── logs.js
│   ├── stats.js
│   ├── chat.js
│   └── openaiQuery.js
│
├── controllers/
│   ├── logsController.js
│   ├── statsController.js
│   └── chatController.js
│
├── services/
│   ├── logsService.js
│   ├── statsService.js
│   ├── queryPrompts.js
│   └── openaiService.js
│
├── db/
│   ├── logsdb.js
│   └── statsdb.js
│
├── .env
└── server.js

🧠 Chat Assistant - זרימת עבודה

קלט משתמש בצ'אט (לדוגמה: "כמה כשלונות היו בכל מדינה?")

queryPrompts.js מחפש התאמה לשאלה מתוך רשימת מילות מפתח.

אם נמצאה התאמה – נשלפת שאילתת Aggregation מוכנה מראש.

אם לא – השאלה נשלחת ל־OpenAI API עם פרומפט מותאם.

התוצאה מוצגת בטבלה/גרף, לפי displayType שהוחזר מהשרת.

🔍 דוגמאות Prompt (queryPrompts)

{
  question: "כמה כשלונות היו בכל מדינה?",
  keywords: ["כשלונות", "מדינה", "failed"],
  prompt: `חשב את סך כל השגיאות (progress.TOTAL_JOBS_FAIL_INDEXED) לפי country_code`,
  displayType: "bar"
}

🧪 דגש על Clean Architecture

שכבת API → routes

לוגיקה עסקית → services

גישה ל־Mongo → db/

controller מרכז זרימה בין שכבות

כך ניתן להחליף את GPT בקלות, או לעבור ל־SQL בעתיד בלי שינוי מבני.

📈 דגש על ביצועים וסקלאביליות

Mongo Aggregation Pipeline (ולא עיבוד ידני)

שימוש ב־indexes מובנים ב־MongoDB

פיצול פונקציות לפי אחריות ברורה

