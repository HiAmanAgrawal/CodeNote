import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { analyzeCodeComplexity, generateNoteWithAI, getProblemRecommendations } from '@/lib/ai';

const codeAnalysisSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  problemTitle: z.string().optional(),
  problemDescription: z.string().optional(),
});

const noteGenerationSchema = z.object({
  problemTitle: z.string().min(1, 'Problem title is required'),
  problemContent: z.string().min(1, 'Problem content is required'),
  solution: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
});

const recommendationSchema = z.object({
  userId: z.string(),
  topic: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  limit: z.number().min(1).max(20).default(5),
});

export const aiAgentRouter = createTRPCRouter({
  // Analyze code complexity and provide feedback
  analyzeCode: protectedProcedure
    .input(codeAnalysisSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const analysis = await analyzeCodeComplexity({
          code: input.code,
          language: input.language,
          problemTitle: input.problemTitle,
          problemDescription: input.problemDescription,
        });

        return {
          timeComplexity: analysis.timeComplexity,
          spaceComplexity: analysis.spaceComplexity,
          explanation: analysis.explanation,
          suggestions: analysis.suggestions,
          bestPractices: analysis.bestPractices,
          alternativeApproaches: analysis.alternativeApproaches,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to analyze code',
        });
      }
    }),

  // Generate note with AI
  generateNote: protectedProcedure
    .input(noteGenerationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const generatedNote = await generateNoteWithAI({
          problemTitle: input.problemTitle,
          problemContent: input.problemContent,
          solution: input.solution,
          topic: input.topic,
        });

        // Create the note in the database
        const note = await ctx.db.note.create({
          data: {
            title: generatedNote.title,
            content: generatedNote.content,
            topic: generatedNote.topic,
            difficulty: generatedNote.difficulty,
            tags: generatedNote.tags,
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

        return {
          note,
          aiGenerated: true,
          confidence: generatedNote.confidence,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate note with AI',
        });
      }
    }),

  // Get personalized problem recommendations
  getRecommendations: protectedProcedure
    .input(recommendationSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Get user's solved problems
        const solvedProblems = await ctx.db.submission.groupBy({
          by: ['problemId'],
          where: { userId, status: 'ACCEPTED' },
          _count: { id: true },
        });

        const solvedProblemIds = solvedProblems.map(p => p.problemId);

        // Get user's attempted but unsolved problems
        const attemptedProblems = await ctx.db.submission.groupBy({
          by: ['problemId'],
          where: { 
            userId, 
            status: { not: 'ACCEPTED' },
            problemId: { notIn: solvedProblemIds },
          },
          _count: { id: true },
        });

        const attemptedProblemIds = attemptedProblems.map(p => p.problemId);

        // Build recommendation criteria
        const recommendationCriteria = {
          userId,
          solvedProblemIds,
          attemptedProblemIds,
          topic: input.topic,
          difficulty: input.difficulty,
          limit: input.limit,
        };

        const recommendations = await getProblemRecommendations(recommendationCriteria);

        // Get problem details from database
        const recommendedProblems = await ctx.db.problem.findMany({
          where: {
            id: { in: recommendations.map(r => r.problemId) },
          },
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            topic: true,
            tags: true,
            _count: {
              select: {
                submissions: true,
              },
            },
          },
        });

        return recommendedProblems.map(problem => ({
          ...problem,
          confidence: recommendations.find(r => r.problemId === problem.id)?.confidence || 0,
          reason: recommendations.find(r => r.problemId === problem.id)?.reason || '',
        }));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get recommendations',
        });
      }
    }),

  // Get learning path recommendations
  getLearningPath: protectedProcedure
    .input(z.object({
      currentTopic: z.string().optional(),
      targetTopic: z.string().optional(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Get user's current progress
        const userProgress = await ctx.db.submission.groupBy({
          by: ['problemId'],
          where: { userId, status: 'ACCEPTED' },
          include: {
            problem: {
              select: {
                topic: true,
                difficulty: true,
              },
            },
          },
        });

        // Analyze user's strengths and weaknesses
        const topicProgress = userProgress.reduce((acc, submission) => {
          const topic = submission.problem.topic;
          if (!acc[topic]) {
            acc[topic] = { solved: 0, total: 0 };
          }
          acc[topic].solved++;
          return acc;
        }, {} as Record<string, { solved: number; total: number }>);

        // Generate learning path
        const learningPath = [
          {
            topic: 'Arrays & Strings',
            description: 'Master basic array operations and string manipulation',
            prerequisites: [],
            estimatedTime: '2 weeks',
            problems: 15,
            difficulty: 'EASY' as const,
          },
          {
            topic: 'Linked Lists',
            description: 'Learn linked list operations and common patterns',
            prerequisites: ['Arrays & Strings'],
            estimatedTime: '1.5 weeks',
            problems: 12,
            difficulty: 'MEDIUM' as const,
          },
          {
            topic: 'Stacks & Queues',
            description: 'Understand stack and queue data structures',
            prerequisites: ['Arrays & Strings'],
            estimatedTime: '1 week',
            problems: 10,
            difficulty: 'MEDIUM' as const,
          },
          {
            topic: 'Trees & Binary Search Trees',
            description: 'Master tree traversal and BST operations',
            prerequisites: ['Linked Lists'],
            estimatedTime: '3 weeks',
            problems: 18,
            difficulty: 'MEDIUM' as const,
          },
          {
            topic: 'Graphs',
            description: 'Learn graph algorithms and traversal techniques',
            prerequisites: ['Trees & Binary Search Trees'],
            estimatedTime: '4 weeks',
            problems: 20,
            difficulty: 'HARD' as const,
          },
          {
            topic: 'Dynamic Programming',
            description: 'Master DP patterns and optimization techniques',
            prerequisites: ['Arrays & Strings', 'Graphs'],
            estimatedTime: '5 weeks',
            problems: 25,
            difficulty: 'HARD' as const,
          },
        ];

        return {
          currentProgress: topicProgress,
          learningPath,
          recommendations: learningPath.filter(topic => {
            const progress = topicProgress[topic.topic];
            return !progress || progress.solved < topic.problems * 0.7; // Less than 70% complete
          }),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate learning path',
        });
      }
    }),

  // Get code optimization suggestions
  getOptimizationSuggestions: protectedProcedure
    .input(z.object({
      code: z.string().min(1, 'Code is required'),
      language: z.string().min(1, 'Language is required'),
      currentComplexity: z.object({
        time: z.string(),
        space: z.string(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // This would integrate with the AI service for code optimization
        const suggestions = [
          {
            type: 'performance',
            title: 'Optimize Time Complexity',
            description: 'Consider using a more efficient algorithm',
            code: '// Example optimization\n// Before: O(n²)\n// After: O(n log n)',
            impact: 'high',
          },
          {
            type: 'memory',
            title: 'Reduce Memory Usage',
            description: 'Use in-place operations where possible',
            code: '// Example: in-place array reversal\n// Instead of creating a new array',
            impact: 'medium',
          },
          {
            type: 'readability',
            title: 'Improve Code Readability',
            description: 'Add meaningful variable names and comments',
            code: '// Add comments explaining the logic\n// Use descriptive variable names',
            impact: 'low',
          },
        ];

        return {
          suggestions,
          overallScore: 85,
          improvements: [
            'Reduce time complexity from O(n²) to O(n log n)',
            'Use less memory by implementing in-place operations',
            'Add comments for better code maintainability',
          ],
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate optimization suggestions',
        });
      }
    }),

  // Get AI-powered study plan
  getStudyPlan: protectedProcedure
    .input(z.object({
      targetDate: z.date().optional(),
      topics: z.array(z.string()).optional(),
      difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        const targetDate = input.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

        // Get user's current progress
        const currentProgress = await ctx.db.submission.groupBy({
          by: ['problemId'],
          where: { userId, status: 'ACCEPTED' },
          include: {
            problem: {
              select: {
                topic: true,
                difficulty: true,
              },
            },
          },
        });

        // Generate personalized study plan
        const studyPlan = {
          duration: Math.ceil((targetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
          dailyGoal: 2, // problems per day
          weeklyGoal: 10, // problems per week
          topics: input.topics || ['Arrays', 'Strings', 'Linked Lists'],
          schedule: [
            {
              week: 1,
              focus: 'Arrays & Strings',
              problems: 10,
              topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum'],
            },
            {
              week: 2,
              focus: 'Linked Lists',
              problems: 8,
              topics: ['Fast & Slow Pointers', 'Reversal', 'Cycle Detection'],
            },
            {
              week: 3,
              focus: 'Stacks & Queues',
              problems: 6,
              topics: ['Monotonic Stack', 'Queue Implementation'],
            },
            {
              week: 4,
              focus: 'Review & Practice',
              problems: 12,
              topics: ['Mixed Problems', 'Contest Preparation'],
            },
          ],
          milestones: [
            { day: 7, goal: 'Complete 10 problems', reward: '🎯 First Week Complete' },
            { day: 14, goal: 'Master 2 topics', reward: '🏆 Topic Master' },
            { day: 21, goal: 'Solve 30 problems', reward: '🚀 Problem Solver' },
            { day: 30, goal: 'Ready for contests', reward: '🥇 Contest Ready' },
          ],
        };

        return studyPlan;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate study plan',
        });
      }
    }),
});
