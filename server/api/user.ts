import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/trpc';
import { TRPCError } from '@trpc/server';

const UserUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  image: z.string().url('Invalid image URL').optional(),
  preferences: z.record(z.any()).optional(),
});

export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          image: true,
          role: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              notes: true,
              contests: true,
              submissions: true,
              contestParticipants: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    }),

  // Get user by ID (public profile)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          avatar: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              notes: {
                where: { isPublic: true },
              },
              contests: true,
              submissions: true,
              contestParticipants: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          image: true,
          role: true,
          preferences: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    }),

  // Get user's notes
  getNotes: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { userId, limit, offset } = input;

      const where = {
        userId,
        isPublic: true,
      };

      const [notes, total] = await Promise.all([
        ctx.db.note.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        ctx.db.note.count({ where }),
      ]);

      return {
        notes,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get user's contests
  getContests: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { userId, limit, offset } = input;

      const [contests, total] = await Promise.all([
        ctx.db.contest.findMany({
          where: {
            OR: [
              { createdBy: userId },
              {
                participants: {
                  some: { userId },
                },
              },
            ],
          },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                avatar: true,
                image: true,
              },
            },
            participants: {
              where: { userId },
              select: {
                id: true,
                score: true,
                rank: true,
              },
            },
            _count: {
              select: {
                participants: true,
                submissions: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        ctx.db.contest.count({
          where: {
            OR: [
              { createdBy: userId },
              {
                participants: {
                  some: { userId },
                },
              },
            ],
          },
        }),
      ]);

      return {
        contests,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get user's submissions
  getSubmissions: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { userId, limit, offset } = input;

      const [submissions, total] = await Promise.all([
        ctx.db.submission.findMany({
          where: { userId },
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                topic: true,
              },
            },
            contest: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        ctx.db.submission.count({ where: { userId } }),
      ]);

      return {
        submissions,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get user statistics
  getStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const [
        totalNotes,
        publicNotes,
        totalContests,
        contestsWon,
        totalSubmissions,
        acceptedSubmissions,
        averageScore,
        recentActivity,
      ] = await Promise.all([
        ctx.db.note.count({ where: { userId } }),
        ctx.db.note.count({ where: { userId, isPublic: true } }),
        ctx.db.contestParticipant.count({ where: { userId } }),
        ctx.db.contestParticipant.count({ 
          where: { 
            userId,
            rank: 1,
          },
        }),
        ctx.db.submission.count({ where: { userId } }),
        ctx.db.submission.count({ 
          where: { 
            userId,
            status: 'ACCEPTED',
          },
        }),
        ctx.db.submission.aggregate({
          where: { userId },
          _avg: { score: true },
        }),
        ctx.db.submission.findMany({
          where: { userId },
          orderBy: { submittedAt: 'desc' },
          take: 5,
          include: {
            problem: {
              select: {
                title: true,
                difficulty: true,
              },
            },
          },
        }),
      ]);

      return {
        totalNotes,
        publicNotes,
        totalContests,
        contestsWon,
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate: totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0,
        averageScore: averageScore._avg.score || 0,
        recentActivity,
      };
    }),

  // Search users
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1, 'Search query is required'),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input, ctx }) => {
      const { query, limit } = input;

      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { email: { contains: query, mode: 'insensitive' as const } },
          ],
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              notes: {
                where: { isPublic: true },
              },
              contests: true,
              submissions: true,
            },
          },
        },
        take: limit,
      });

      return users;
    }),
});
