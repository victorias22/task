// server/services/logService.js
import { countLogs, getLogs } from '../db/logsdb.js';

export async function fetchLogsWithFilter({ page=1, limit=100, filters={} }) {
  const skip  = (page - 1) * limit;
  const total = await countLogs(filters);
  const data  = await getLogs({ filter: filters, skip, limit });
  return { total, data };
}
