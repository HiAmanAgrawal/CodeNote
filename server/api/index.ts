import { createTRPCRouter } from '../trpc';
import { notesRouter } from './notes';
import { contestsRouter } from './contests';
import { userRouter } from './user';
import { aiAgentRouter } from './aiAgent';

export const appRouter = createTRPCRouter({
  notes: notesRouter,
  contests: contestsRouter,
  user: userRouter,
  aiAgent: aiAgentRouter,
});

export type AppRouter = typeof appRouter; 