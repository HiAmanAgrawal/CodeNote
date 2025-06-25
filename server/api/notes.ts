import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { generateNoteWithAI } from '@/lib/ai';

const noteInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  topic: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

const noteUpdateSchema = noteInputSchema.partial().extend({
  id: z.string(),
});

const noteSearchSchema = z.object({
  query: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const notesRouter = createTRPCRouter({
  // Get all notes for the current user
  getAll: protectedProcedure
    .input(noteSearchSchema)
    .query(async ({ ctx, input }) => {
      const { query, topic, difficulty, tags, limit, offset } = input;
      const userId = ctx.session.user.id;

      const whereClause: any = {
        userId,
        ...(query && {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        }),
        ...(topic && { topic }),
        ...(difficulty && { difficulty }),
        ...(tags && tags.length > 0 && {
          tags: { hasSome: tags },
        }),
      };

      const [notes, total] = await Promise.all([
        ctx.db.note.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        ctx.db.note.count({ where: whereClause }),
      ]);

      return {
        notes,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get a single note by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findFirst({
        where: {
          id: input.id,
          OR: [
            { userId: ctx.session.user.id },
            { isPublic: true },
          ],
        },
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

      if (!note) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found',
        });
      }

      return note;
    }),

  // Create a new note
  create: protectedProcedure
    .input(noteInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const note = await ctx.db.note.create({
        data: {
          ...input,
          userId,
          tags: input.tags || [],
        },
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

  // Update an existing note
  update: protectedProcedure
    .input(noteUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = ctx.session.user.id;

      // Check if note exists and user owns it
      const existingNote = await ctx.db.note.findFirst({
        where: { id, userId },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found or you do not have permission to edit it',
        });
      }

      const note = await ctx.db.note.update({
        where: { id },
        data: updateData,
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

  // Delete a note
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if note exists and user owns it
      const existingNote = await ctx.db.note.findFirst({
        where: { id: input.id, userId },
      });

      if (!existingNote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Note not found or you do not have permission to delete it',
        });
      }

      await ctx.db.note.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Generate note with AI
  generateWithAI: protectedProcedure
    .input(z.object({
      problemTitle: z.string(),
      problemContent: z.string(),
      solution: z.string().optional(),
      topic: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const aiGeneratedNote = await generateNoteWithAI({
          problemTitle: input.problemTitle,
          problemContent: input.problemContent,
          solution: input.solution,
          topic: input.topic,
        });

        // Create the note in the database
        const note = await ctx.db.note.create({
          data: {
            title: aiGeneratedNote.title,
            content: aiGeneratedNote.content,
            topic: aiGeneratedNote.topic,
            difficulty: aiGeneratedNote.difficulty,
            tags: aiGeneratedNote.tags,
            userId: ctx.session.user.id,
            isPublic: false,
          },
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
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate note with AI',
        });
      }
    }),

  // Get public notes (for discovery)
  getPublic: publicProcedure
    .input(noteSearchSchema)
    .query(async ({ ctx, input }) => {
      const { query, topic, difficulty, tags, limit, offset } = input;

      const whereClause: any = {
        isPublic: true,
        ...(query && {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        }),
        ...(topic && { topic }),
        ...(difficulty && { difficulty }),
        ...(tags && tags.length > 0 && {
          tags: { hasSome: tags },
        }),
      };

      const [notes, total] = await Promise.all([
        ctx.db.note.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        }),
        ctx.db.note.count({ where: whereClause }),
      ]);

      return {
        notes,
        total,
        hasMore: offset + limit < total,
      };
    }),

  // Get note statistics for the current user
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const [totalNotes, publicNotes, privateNotes, recentNotes] = await Promise.all([
        ctx.db.note.count({ where: { userId } }),
        ctx.db.note.count({ where: { userId, isPublic: true } }),
        ctx.db.note.count({ where: { userId, isPublic: false } }),
        ctx.db.note.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      return {
        totalNotes,
        publicNotes,
        privateNotes,
        recentNotes,
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
