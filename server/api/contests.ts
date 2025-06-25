import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const contestInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startTime: z.date(),
  endTime: z.date(),
  maxParticipants: z.number().min(1).optional(),
  prizePool: z.number().min(0).optional(),
  isPublic: z.boolean().default(true),
  problems: z.array(z.string()).optional(), // Problem IDs
});

const contestUpdateSchema = contestInputSchema.partial().extend({
  id: z.string(),
});

const submissionInputSchema = z.object({
  contestId: z.string(),
  problemId: z.string(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
  })).optional(),
});

export const contestsRouter = createTRPCRouter({
  // Get all contests
  getAll: publicProcedure
    .input(z.object({
      status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED']).optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const { status, limit, offset } = input;
      const now = new Date();

      let whereClause: any = {};
      
      if (status === 'UPCOMING') {
        whereClause.startTime = { gt: now };
      } else if (status === 'ONGOING') {
        whereClause.AND = [
          { startTime: { lte: now } },
          { endTime: { gt: now } },
        ];
      } else if (status === 'COMPLETED') {
        whereClause.endTime = { lt: now };
      }

      const [contests, total] = await Promise.all([
        ctx.db.contest.findMany({
          where: whereClause,
          orderBy: { startTime: 'desc' },
          take: limit,
          skip: offset,
          include: {
            problems: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
            participants: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                participants: true,
                problems: true,
              },
            },
          },
        }),
        ctx.db.contest.count({ where: whereClause }),
      ]);

      return {
        contests,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get a single contest by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contest = await ctx.db.contest.findUnique({
        where: { id: input.id },
        include: {
          problems: {
            include: {
              submissions: {
                where: {
                  userId: ctx.session?.user?.id,
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
          participants: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          submissions: {
            where: {
              userId: ctx.session?.user?.id,
            },
            include: {
              problem: {
                select: {
                  title: true,
                  difficulty: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              participants: true,
              problems: true,
              submissions: true,
            },
          },
        },
      });

      if (!contest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contest not found',
        });
      }

      return contest;
    }),

  // Create a new contest (admin only)
  create: adminProcedure
    .input(contestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const contest = await ctx.db.contest.create({
        data: {
          ...input,
          createdBy: ctx.session.user.id,
          problems: input.problems ? {
            connect: input.problems.map(id => ({ id })),
          } : undefined,
        },
        include: {
          problems: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return contest;
    }),

  // Update an existing contest (admin only)
  update: adminProcedure
    .input(contestUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const contest = await ctx.db.contest.update({
        where: { id },
        data: {
          ...updateData,
          problems: input.problems ? {
            set: input.problems.map(problemId => ({ id: problemId })),
          } : undefined,
        },
        include: {
          problems: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return contest;
    }),

  // Delete a contest (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contest.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Join a contest
  join: protectedProcedure
    .input(z.object({ contestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if contest exists and is not full
      const contest = await ctx.db.contest.findUnique({
        where: { id: input.contestId },
        include: {
          participants: true,
        },
      });

      if (!contest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contest not found',
        });
      }

      if (contest.maxParticipants && contest.participants.length >= contest.maxParticipants) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Contest is full',
        });
      }

      // Check if user is already a participant
      const existingParticipation = await ctx.db.contest.findFirst({
        where: {
          id: input.contestId,
          participants: {
            some: { id: userId },
          },
        },
      });

      if (existingParticipation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already participating in this contest',
        });
      }

      // Add user to contest
      await ctx.db.contest.update({
        where: { id: input.contestId },
        data: {
          participants: {
            connect: { id: userId },
          },
        },
      });

      return { success: true };
    }),

  // Leave a contest
  leave: protectedProcedure
    .input(z.object({ contestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db.contest.update({
        where: { id: input.contestId },
        data: {
          participants: {
            disconnect: { id: userId },
          },
        },
      });

      return { success: true };
    }),

  // Submit solution for a problem
  submit: protectedProcedure
    .input(submissionInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if user is participating in the contest
      const contest = await ctx.db.contest.findFirst({
        where: {
          id: input.contestId,
          participants: {
            some: { id: userId },
          },
        },
      });

      if (!contest) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must be a participant to submit solutions',
        });
      }

      // Check if contest is ongoing
      const now = new Date();
      if (now < contest.startTime || now > contest.endTime) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Contest is not currently active',
        });
      }

      // Create submission
      const submission = await ctx.db.submission.create({
        data: {
          code: input.code,
          language: input.language,
          userId,
          contestId: input.contestId,
          problemId: input.problemId,
          status: 'PENDING', // Will be updated by code execution service
          testCases: input.testCases || [],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          problem: {
            select: {
              title: true,
              difficulty: true,
            },
          },
        },
      });

      // TODO: Queue code execution
      // await queueCodeExecution(submission.id);

      return submission;
    }),

  // Get contest leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ contestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const submissions = await ctx.db.submission.groupBy({
        by: ['userId'],
        where: {
          contestId: input.contestId,
          status: 'ACCEPTED',
        },
        _count: {
          id: true,
        },
        _sum: {
          score: true,
        },
        orderBy: {
          _sum: {
            score: 'desc',
          },
        },
      });

      const userIds = submissions.map(s => s.userId);
      const users = await ctx.db.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      const leaderboard = submissions.map((submission, index) => {
        const user = users.find(u => u.id === submission.userId);
        return {
          rank: index + 1,
          userId: submission.userId,
          user,
          problemsSolved: submission._count.id,
          totalScore: submission._sum.score || 0,
        };
      });

      return leaderboard;
    }),

  // Get user's contest submissions
  getUserSubmissions: protectedProcedure
    .input(z.object({ contestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const submissions = await ctx.db.submission.findMany({
        where: {
          contestId: input.contestId,
          userId,
        },
        include: {
          problem: {
            select: {
              title: true,
              difficulty: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return submissions;
    }),

  // Get contest statistics
  getStats: publicProcedure
    .input(z.object({ contestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [participants, submissions, problems] = await Promise.all([
        ctx.db.contest.findUnique({
          where: { id: input.contestId },
          select: {
            _count: {
              select: { participants: true },
            },
          },
        }),
        ctx.db.submission.count({
          where: { contestId: input.contestId },
        }),
        ctx.db.contest.findUnique({
          where: { id: input.contestId },
          select: {
            _count: {
              select: { problems: true },
            },
          },
        }),
      ]);

      return {
        participants: participants?._count.participants || 0,
        submissions: submissions || 0,
        problems: problems?._count.problems || 0,
      };
    }),
});
