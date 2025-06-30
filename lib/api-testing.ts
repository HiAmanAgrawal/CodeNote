import { createTRPCMsw } from 'msw-trpc';
import { http, HttpResponse } from 'msw';
import { appRouter } from '@/server/api';

export const trpcMsw = createTRPCMsw(appRouter);

export const handlers = [
  // tRPC handlers
  trpcMsw.notes.getAll.query(() => {
    return HttpResponse.json({
      notes: [],
      total: 0,
      hasMore: false,
    });
  }),

  trpcMsw.contests.getAll.query(() => {
    return HttpResponse.json({
      contests: [],
      total: 0,
      hasMore: false,
    });
  }),

  // REST API handlers
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: 'healthy',
        vectorSearch: 'healthy',
      },
    });
  }),

  http.post('/api/auth/signin', () => {
    return HttpResponse.json({
      success: true,
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  }),
]; 