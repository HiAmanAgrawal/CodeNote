import { db } from './db';
import { pool } from './db';

export interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  userId?: string;
}

export class MetricsService {
  static async record(data: MetricData): Promise<void> {
    try {
      await db.metric.create({
        data: {
          name: data.name,
          value: data.value,
          tags: data.tags,
          userId: data.userId,
        },
      });
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }

  static async getMetrics(name: string, timeRange: { start: Date; end: Date }): Promise<any[]> {
    return db.metric.findMany({
      where: {
        name,
        timestamp: {
          gte: timeRange.start,
          lte: timeRange.end,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  static async getAggregatedMetrics(name: string, interval: string = '1 hour'): Promise<any[]> {
    const result = await pool.query(`
      SELECT 
        date_trunc($2, timestamp) as time_bucket,
        COUNT(*) as count,
        AVG(value) as avg_value,
        MIN(value) as min_value,
        MAX(value) as max_value,
        SUM(value) as sum_value
      FROM "Metric"
      WHERE name = $1
      GROUP BY time_bucket
      ORDER BY time_bucket DESC
      LIMIT 100
    `, [name, interval]);

    return result.rows;
  }

  // Prometheus-compatible metrics
  static async getPrometheusMetrics(): Promise<string> {
    const metrics = await db.metric.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    const metricGroups = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    let prometheusOutput = '';

    for (const [metricName, metricData] of Object.entries(metricGroups)) {
      const latest = metricData[0];
      const tags = latest.tags ? Object.entries(latest.tags).map(([k, v]) => `${k}="${v}"`).join(',') : '';
      
      prometheusOutput += `# HELP ${metricName} ${metricName} metric\n`;
      prometheusOutput += `# TYPE ${metricName} gauge\n`;
      prometheusOutput += `${metricName}{${tags}} ${latest.value} ${latest.timestamp.getTime()}\n`;
    }

    return prometheusOutput;
  }

  // Common metrics
  static async recordUserLogin(userId: string): Promise<void> {
    await this.record({
      name: 'user_login',
      value: 1,
      userId,
    });
  }

  static async recordSubmission(userId: string, status: string): Promise<void> {
    await this.record({
      name: 'submission_created',
      value: 1,
      tags: { status },
      userId,
    });
  }

  static async recordContestJoin(userId: string, contestId: string): Promise<void> {
    await this.record({
      name: 'contest_join',
      value: 1,
      tags: { contest_id: contestId },
      userId,
    });
  }

  static async recordExecutionTime(duration: number, language: string): Promise<void> {
    await this.record({
      name: 'execution_duration_ms',
      value: duration,
      tags: { language },
    });
  }
} 