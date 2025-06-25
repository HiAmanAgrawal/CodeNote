import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/trpc';
import { TRPCError } from '@trpc/server';

const ContestCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  maxParticipants: z.number().min(1).optional(),
  problemIds: z.array(z.string()).optional().default([]),
});

const ContestUpdateSchema = ContestCreateSchema.partial();

export const contestsRouter = createTRPCRouter({
  // Get all contests
  getAll: publicProcedure
    .input(z.object({
      isActive: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { isActive, limit, offset } = input;

      const where = {
        ...(isActive !== undefined && { isActive }),
      };

      const [contests, total] = await Promise.all([
        ctx.db.contest.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                image: true,
              },
            },
            problems: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                topic: true,
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
        ctx.db.contest.count({ where }),
      ]);

      return {
        contests,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get contest by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const contest = await ctx.db.contest.findUnique({
        where: { id: input.id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              image: true,
            },
          },
          problems: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              topic: true,
              constraints: true,
              examples: true,
              starterCode: true,
              tags: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  image: true,
                },
              },
            },
            orderBy: { score: 'desc' },
          },
          _count: {
            select: {
              participants: true,
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

  // Create a new contest
  create: protectedProcedure
    .input(ContestCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const { problemIds, ...contestData } = input;

      const contest = await ctx.db.contest.create({
        data: {
          ...contestData,
          createdBy: ctx.session.user.id,
          startTime: contestData.startDate,
          endTime: contestData.endDate,
          problems: {
            connect: problemIds.map(id => ({ id })),
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              image: true,
            },
          },
          problems: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              topic: true,
            },
          },
        },
      });

      return contest;
    }),

  // Update a contest
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: ContestUpdateSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, data } = input;

      // Check if contest exists and user owns it
      const existingContest = await ctx.db.contest.findUnique({
        where: { id },
      });

      if (!existingContest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contest not found',
        });
      }

      if (existingContest.createdBy !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this contest',
        });
      }

      const { problemIds, ...contestData } = data;

      const contest = await ctx.db.contest.update({
        where: { id },
        data: {
          ...contestData,
          ...(contestData.startDate && { startTime: contestData.startDate }),
          ...(contestData.endDate && { endTime: contestData.endDate }),
          ...(problemIds && {
            problems: {
              set: problemIds.map(id => ({ id })),
            },
          }),
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              image: true,
            },
          },
          problems: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              topic: true,
            },
          },
        },
      });

      return contest;
    }),

  // Delete a contest
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      // Check if contest exists and user owns it
      const existingContest = await ctx.db.contest.findUnique({
        where: { id },
      });

      if (!existingContest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contest not found',
        });
      }

      if (existingContest.createdBy !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this contest',
        });
      }

      await ctx.db.contest.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Join a contest
  join: protectedProcedure
    .input(z.object({ contestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { contestId } = input;
      const userId = ctx.session.user.id;

      // Check if contest exists and is active
      const contest = await ctx.db.contest.findUnique({
        where: { id: contestId },
      });

      if (!contest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contest not found',
        });
      }

      if (!contest.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Contest is not active',
        });
      }

      // Check if user is already a participant
      const existingParticipant = await ctx.db.contestParticipant.findUnique({
        where: {
          contestId_userId: {
            contestId,
            userId,
          },
        },
      });

      if (existingParticipant) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already a participant in this contest',
        });
      }

      // Check if contest is full
      if (contest.maxParticipants) {
        const participantCount = await ctx.db.contestParticipant.count({
          where: { contestId },
        });

        if (participantCount >= contest.maxParticipants) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Contest is full',
          });
        }
      }

      const participant = await ctx.db.contestParticipant.create({
        data: {
          contestId,
          userId,
          name: ctx.session.user.name || 'Anonymous',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              image: true,
            },
          },
        },
      });

      return participant;
    }),

  // Leave a contest
  leave: protectedProcedure
    .input(z.object({ contestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { contestId } = input;
      const userId = ctx.session.user.id;

      const participant = await ctx.db.contestParticipant.findUnique({
        where: {
          contestId_userId: {
            contestId,
            userId,
          },
        },
      });

      if (!participant) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'You are not a participant in this contest',
        });
      }

      await ctx.db.contestParticipant.delete({
        where: {
          contestId_userId: {
            contestId,
            userId,
          },
        },
      });

      return { success: true };
    }),

  // Get user's contests
  getMyContests: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input;
      const userId = ctx.session.user.id;

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
                email: true,
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

  // Get contest leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ contestId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { contestId } = input;

      const participants = await ctx.db.contestParticipant.findMany({
        where: { contestId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              image: true,
            },
          },
        },
        orderBy: [
          { score: 'desc' },
          { joinedAt: 'asc' },
        ],
      });

      return participants;
    }),
});

