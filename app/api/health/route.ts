import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pool } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      vectorSearch: 'unknown',
    },
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
  };

  try {
    // Check database
    await db.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Check vector search
    await pool.query('SELECT 1');
    health.services.vectorSearch = 'healthy';
  } catch (error) {
    health.services.vectorSearch = 'unhealthy';
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
} 