import { aggregateStats } from '../db/statsdb.js';

export async function getOverviewStats() {
  const pipeline = [
    {
      $group: {
        _id: '$country_code',
        avgJobs: { $avg: '$progress.TOTAL_JOBS_SENT_TO_INDEX' },
        totalLogs: { $sum: 1 }
      }
    },
    {
      $sort: { totalLogs: -1 }
    },
    {
      $limit: 10
    }
  ];

  const result = await aggregateStats(pipeline);
  console.log('📦 Aggregation by country:', result);

  return result.map(item => ({
    country: item._id || 'Unknown',
    avgJobs: Math.round(item.avgJobs || 0),
    totalLogs: item.totalLogs || 0
  }));
}


export async function getAnomalyStats() {
  const pipeline = [
    {
      $group: {
        _id: '$country_code',
        totalLogs: { $sum: 1 }
      }
    }
  ];

  const result = await aggregateStats(pipeline);

  const values = result.map(item => item.totalLogs);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const anomalies = result.filter(item =>
    item.totalLogs > avg + stdDev
  );

  return {
    avg: Math.round(avg),
    stdDev: Math.round(stdDev),
    anomalies: anomalies.map(item => ({
      country: item._id || 'Unknown',
      totalLogs: item.totalLogs,
      type: 'above average'
    }))
  };
}



export async function getUsersPerCountry() {
  const pipeline = [
    {
      $group: {
        _id: { country: '$country_code', client: '$transactionSourceName' }
      }
    },
    {
      $group: {
        _id: '$_id.country',
        totalClients: { $sum: 1 }
      }
    },
    {
      $sort: { totalClients: -1 }
    }
  ];

  const result = await aggregateStats(pipeline);
  return result.map(item => ({
    country: item._id || 'Unknown',
    totalClients: item.totalClients
  }));
}

/**
 * Fetch time series of log counts per country by date.
 * Returns an array of objects, each with a date and counts per country.
 */
export async function getTimeSeries() {
  const pipeline = [
    // filter out docs without timestamp
    { $match: { timestamp: { $exists: true, $type: 'string' } } },
    // group by YYYY-MM-DD substring of the timestamp string
    {
      $group: {
        _id: {
          date: { $substrBytes: ['$timestamp', 0, 10] },
          country: '$country_code'
        },
        count: { $sum: 1 }
      }
    },
    // sort by date
    { $sort: { '_id.date': 1 } }
  ];

  const raw = await aggregateStats(pipeline);

  // build pivoted series
  const dates = [...new Set(raw.map(r => r._id.date))];
  const countries = [...new Set(raw.map(r => r._id.country))];

  const series = dates.map(date => {
    const entry = { date };
    countries.forEach(c => (entry[c] = 0));
    return entry;
  });

  raw.forEach(({ _id: { date, country }, count }) => {
    const row = series.find(r => r.date === date);
    if (row) row[country] = count;
  });

  return series;
}

