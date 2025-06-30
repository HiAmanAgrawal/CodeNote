import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/trpc';
import { TRPCError } from '@trpc/server';
import { generateNoteWithAI } from '@/lib/ai';

const NoteCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional().default('MEDIUM'),
  tags: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(false),
});

const NoteUpdateSchema = NoteCreateSchema.partial();

const noteSearchSchema = z.object({
  query: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const notesRouter = createTRPCRouter({
  // Get all public notes
  getAll: publicProcedure
    .input(z.object({
      topic: z.string().optional(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { topic, difficulty, search, limit, offset } = input;

      const where = {
        isPublic: true,
        ...(topic && { topic }),
        ...(difficulty && { difficulty }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { content: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [notes, total] = await Promise.all([
        ctx.db.note.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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

  // Get notes by user
  getByUser: protectedProcedure
    .input(z.object({
      userId: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { userId, limit, offset } = input;
      const currentUserId = userId || ctx.session.user.id;

      const where = {
        userId: currentUserId,
        ...(userId !== ctx.session.user.id && { isPublic: true }),
      };

      const [notes, total] = await Promise.all([
        ctx.db.note.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
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

  // Create a new note
  create: protectedProcedure
    .input(NoteCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const note = await ctx.db.note.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return note;
    }),

  // Get a single note by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const note = await ctx.db.note.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!note) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found',
        });
      }

      // Check if user can access the note
      if (!note.isPublic && note.userId !== ctx.session?.user?.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this note',
        });
      }

      return note;
    }),

  // Update a note
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: NoteUpdateSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, data } = input;

      // Check if note exists and user owns it
      const existingNote = await ctx.db.note.findUnique({
        where: { id },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found',
        });
      }

      if (existingNote.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this note',
        });
      }

      const note = await ctx.db.note.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return note;
    }),

  // Delete a note
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      // Check if note exists and user owns it
      const existingNote = await ctx.db.note.findUnique({
        where: { id },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found',
        });
      }

      if (existingNote.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this note',
        });
      }

      await ctx.db.note.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Generate AI note
  generateAI: protectedProcedure
    .input(z.object({
      problemTitle: z.string(),
      problemContent: z.string(),
      topic: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // This would integrate with your AI service
      // For now, we'll create a basic note
      const note = await ctx.db.note.create({
        data: {
          title: `${input.problemTitle} - AI Generated Note`,
          content: `AI-generated note for: ${input.problemContent}`,
          topic: input.topic || 'GENERAL',
          difficulty: 'MEDIUM',
          tags: ['AI-Generated', 'Study Note'],
          userId: ctx.session.user.id,
          isPublic: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return note;
    }),

  // Get note statistics
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const [totalNotes, publicNotes, privateNotes, topics] = await Promise.all([
        ctx.db.note.count({ where: { userId } }),
        ctx.db.note.count({ where: { userId, isPublic: true } }),
        ctx.db.note.count({ where: { userId, isPublic: false } }),
        ctx.db.note.groupBy({
          by: ['topic'],
          where: { userId },
          _count: { topic: true },
        }),
      ]);

      return {
        totalNotes,
        publicNotes,
        privateNotes,
        topics: topics.map((t: { topic: string; _count: { topic: number } }) => ({ topic: t.topic, count: t._count.topic })),
      };
    }),

  // Toggle note visibility (public/private)
  toggleVisibility: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingNote = await ctx.db.note.findFirst({
        where: { id: input.id, userId },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found or you do not have permission to modify it',
        });
      }

      const note = await ctx.db.note.update({
        where: { id: input.id },
        data: { isPublic: !existingNote.isPublic },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return note;
    }),
});
