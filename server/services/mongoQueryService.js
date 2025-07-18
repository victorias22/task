// services/mongoQueryService.js
import { aggregateStats } from '../db/statsdb.js';

export async function runMongoQuery(interpreted) {
  const pipeline = interpreted.query; // דוגמת pipeline מ־GPT
  return await aggregateStats(pipeline);
}
