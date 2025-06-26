import { redis } from './redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const AUTH_RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests per minute for auth
const RATE_LIMIT_WINDOW = 60; // 1 minute

const authLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl_auth',
  points: AUTH_RATE_LIMIT_MAX_REQUESTS,
  duration: RATE_LIMIT_WINDOW,
});

export async function checkAuthRateLimit(clientId: string) {
  try {
    const result = await authLimiter.consume(clientId);
    return {
      allowed: true,
      remaining: result.remainingPoints,
      reset: Date.now() + result.msBeforeNext,
      limit: AUTH_RATE_LIMIT_MAX_REQUESTS,
      retryAfter: Math.ceil(result.msBeforeNext / 1000),
    };
  } catch (rejRes: any) {
    return {
      allowed: false,
      remaining: rejRes.remainingPoints,
      reset: Date.now() + rejRes.msBeforeNext,
      limit: AUTH_RATE_LIMIT_MAX_REQUESTS,
      retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
    };
  }
} 