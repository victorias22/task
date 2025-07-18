// test.js
import fs from 'fs';

try {
  const rawText = fs.readFileSync(new URL('./transformedFeeds.json', import.meta.url), 'utf8');
  const records = JSON.parse(rawText);

  console.log('מספר רשומות בקובץ:', records.length);
} catch (err) {
  console.error('שגיאה:', err.message);
}
