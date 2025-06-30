import { redis } from '../redis';
import { prisma } from '../db';
import { Judge0Client } from './judge0-client';
import { calculateContestScore } from '../contest-utils';

export class ContestExecutor {
  private judge0Client: Judge0Client;
  private isRunning = false;

  constructor() {
    this.judge0Client = new Judge0Client(
      process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
      process.env.JUDGE0_API_KEY
    );
  }

  public async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Contest executor started');

    while (this.isRunning) {
      try {
        // Get next submission from queue
        const submissionData = await redis.brpop('execution:queue', 1);
        
        if (submissionData) {
          const submission = JSON.parse(submissionData[1]);
          await this.processSubmission(submission);
        }
      } catch (error) {
        console.error('Error in contest executor:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  public stop() {
    this.isRunning = false;
    console.log('Contest executor stopped');
  }

  private async processSubmission(submission: any) {
    try {
      console.log(`Processing submission ${submission.submissionId}`);

      // Update status to processing
      await prisma.submission.update({
        where: { id: submission.submissionId },
        data: { status: 'PROCESSING' },
      });

      // Get problem details
      const problem = await prisma.problem.findUnique({
        where: { id: submission.problemId },
      });

      if (!problem) {
        throw new Error('Problem not found');
      }

      // Execute code
      const result = await this.judge0Client.createSubmission(
        submission.code,
        { judge0Id: this.getLanguageId(submission.language) },
        problem.examples[0]?.input || '',
        problem.examples[0]?.expectedOutput || ''
      );

      // Get execution result
      const executionResult = await this.judge0Client.getSubmission(result);

      // Calculate score
      const score = calculateContestScore(
        { ...submission, status: executionResult.status },
        'ACM' // Default to ACM scoring
      );

      // Update submission
      await prisma.submission.update({
        where: { id: submission.submissionId },
        data: {
          status: executionResult.status,
          score,
          runtime: executionResult.runtime,
          memory: executionResult.memory,
          feedback: executionResult.error || executionResult.output,
          completedAt: new Date(),
        },
      });

      // Update participant score
      await this.updateParticipantScore(submission.contestId, submission.userId);

      // Publish execution status
      await redis.publish('execution:status', JSON.stringify({
        contestId: submission.contestId,
        submissionId: submission.submissionId,
        status: executionResult.status,
        score,
        runtime: executionResult.runtime,
        memory: executionResult.memory,
        feedback: executionResult.error || executionResult.output,
      }));

      console.log(`Submission ${submission.submissionId} processed: ${executionResult.status}`);
    } catch (error) {
      console.error(`Error processing submission ${submission.submissionId}:`, error);
      
      // Update submission with error
      await prisma.submission.update({
        where: { id: submission.submissionId },
        data: {
          status: 'SYSTEM_ERROR',
          feedback: error.message,
          completedAt: new Date(),
        },
      });
    }
  }

  private async updateParticipantScore(contestId: string, userId: string) {
    // Get all user's submissions for this contest
    const submissions = await prisma.submission.findMany({
      where: {
        contestId,
        userId,
        status: 'ACCEPTED',
      },
      include: {
        problem: true,
      },
    });

    // Calculate total score
    let totalScore = 0;
    for (const submission of submissions) {
      totalScore += calculateContestScore(submission, 'ACM');
    }

    // Update participant score
    await prisma.contestParticipant.updateMany({
      where: {
        contestId,
        userId,
      },
      data: {
        score: totalScore,
      },
    });
  }

  private getLanguageId(language: string): number {
    const languageMap: Record<string, number> = {
      'javascript': 63,
      'python': 71,
      'java': 62,
      'cpp': 54,
      'c': 50,
      'csharp': 51,
      'php': 68,
      'ruby': 72,
      'swift': 83,
      'go': 60,
      'rust': 73,
      'kotlin': 78,
    };

    return languageMap[language.toLowerCase()] || 63; // Default to JavaScript
  }
} 