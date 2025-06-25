import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
    timezone: z.string().optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      contests: z.boolean().optional(),
      achievements: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          preferences: true,
          _count: {
            select: {
              notes: true,
              submissions: true,
              contests: {
                where: {
                  participants: {
                    some: { id: ctx.session.user.id },
                  },
                },
              },
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
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          role: true,
          preferences: true,
        },
      });

      return user;
    }),

  // Get user statistics
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const [
        totalProblems,
        solvedProblems,
        totalNotes,
        totalContests,
        wonContests,
        recentActivity,
        streakDays,
      ] = await Promise.all([
        // Total problems attempted
        ctx.db.submission.groupBy({
          by: ['problemId'],
          where: { userId },
          _count: { id: true },
        }),
        // Problems solved successfully
        ctx.db.submission.groupBy({
          by: ['problemId'],
          where: { userId, status: 'ACCEPTED' },
          _count: { id: true },
        }),
        // Total notes created
        ctx.db.note.count({ where: { userId } }),
        // Total contests participated
        ctx.db.contest.count({
          where: {
            participants: { some: { id: userId } },
          },
        }),
        // Contests won (1st place)
        ctx.db.submission.groupBy({
          by: ['contestId'],
          where: { userId, status: 'ACCEPTED' },
          _count: { id: true },
        }),
        // Recent activity (last 30 days)
        ctx.db.submission.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        // Calculate streak (simplified)
        ctx.db.submission.groupBy({
          by: ['createdAt'],
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          _count: { id: true },
        }),
      ]);

      const successRate = totalProblems.length > 0 
        ? (solvedProblems.length / totalProblems.length) * 100 
        : 0;

      return {
        totalProblems: totalProblems.length,
        solvedProblems: solvedProblems.length,
        successRate: Math.round(successRate),
        totalNotes,
        totalContests,
        wonContests: wonContests.length,
        recentActivity,
        streakDays: streakDays.length,
      };
    }),

  // Get user activity feed
  getActivity: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { limit, offset } = input;

      const activities = await ctx.db.submission.findMany({
        where: { userId },
        include: {
          problem: {
            select: {
              title: true,
              difficulty: true,
            },
          },
          contest: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return activities.map(activity => ({
        id: activity.id,
        type: 'submission',
        title: `Submitted solution for ${activity.problem.title}`,
        description: `Status: ${activity.status}`,
        timestamp: activity.createdAt,
        metadata: {
          problemTitle: activity.problem.title,
          difficulty: activity.problem.difficulty,
          contestTitle: activity.contest?.title,
          language: activity.language,
        },
      }));
    }),

  // Get user achievements
  getAchievements: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const achievements = [];

      // Check for first problem solved
      const firstProblem = await ctx.db.submission.findFirst({
        where: { userId, status: 'ACCEPTED' },
        orderBy: { createdAt: 'asc' },
      });

      if (firstProblem) {
        achievements.push({
          id: 'first-problem',
          title: 'First Problem Solved',
          description: 'Solved your first coding problem',
          icon: '🎯',
          unlockedAt: firstProblem.createdAt,
        });
      }

      // Check for 10 problems solved
      const solvedProblems = await ctx.db.submission.groupBy({
        by: ['problemId'],
        where: { userId, status: 'ACCEPTED' },
        _count: { id: true },
      });

      if (solvedProblems.length >= 10) {
        achievements.push({
          id: '10-problems',
          title: 'Problem Solver',
          description: 'Solved 10 different problems',
          icon: '🏆',
          unlockedAt: new Date(), // Simplified
        });
      }

      // Check for contest winner
      const contestWins = await ctx.db.submission.groupBy({
        by: ['contestId'],
        where: { userId, status: 'ACCEPTED' },
        _count: { id: true },
      });

      if (contestWins.length > 0) {
        achievements.push({
          id: 'contest-winner',
          title: 'Contest Winner',
          description: 'Won your first contest',
          icon: '🥇',
          unlockedAt: new Date(), // Simplified
        });
      }

      // Check for note creator
      const notesCount = await ctx.db.note.count({ where: { userId } });
      if (notesCount > 0) {
        achievements.push({
          id: 'note-creator',
          title: 'Note Creator',
          description: 'Created your first note',
          icon: '📝',
          unlockedAt: new Date(), // Simplified
        });
      }

      return achievements;
    }),

  // Get public user profile
  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          createdAt: true,
          _count: {
            select: {
              notes: {
                where: { isPublic: true },
              },
              submissions: true,
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

      // Get user's public notes
      const publicNotes = await ctx.db.note.findMany({
        where: {
          userId: input.userId,
          isPublic: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          topic: true,
          difficulty: true,
          createdAt: true,
        },
      });

      return {
        ...user,
        publicNotes,
      };
    }),

  // Delete user account
  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      // Delete all user data
      await ctx.db.$transaction([
        ctx.db.submission.deleteMany({ where: { userId } }),
        ctx.db.note.deleteMany({ where: { userId } }),
        ctx.db.user.delete({ where: { id: userId } }),
      ]);

      return { success: true };
    }),

  // Get user preferences
  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { preferences: true },
      });

      return user?.preferences || {};
    }),

  // Update user preferences
  updatePreferences: protectedProcedure
    .input(z.object({
      preferences: z.object({
        theme: z.enum(['light', 'dark', 'system']).optional(),
        language: z.string().optional(),
        timezone: z.string().optional(),
        notifications: z.object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
          contests: z.boolean().optional(),
          achievements: z.boolean().optional(),
        }).optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          preferences: {
            ...input.preferences,
          },
        },
        select: { preferences: true },
      });

      return user.preferences;
    }),
});
