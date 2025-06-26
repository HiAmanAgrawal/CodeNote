import { Submission, Contest, ContestParticipant } from '@prisma/client';
import { redis } from './redis';
import { diffChars } from 'diff';
import { similarity } from 'string-similarity';

export interface PlagiarismResult {
  similarity: number;
  matches: Array<{
    userId: string;
    userName: string;
    similarity: number;
  }>;
}

export function calculateContestScore(
  submission: Submission & { problem: any },
  scoringSystem: string
): number {
  switch (scoringSystem) {
    case 'ACM':
      // ACM style: 1 point per problem, time penalty for wrong submissions
      return submission.status === 'ACCEPTED' ? 1 : 0;
    
    case 'IOI':
      // IOI style: partial scoring based on test cases
      if (submission.status === 'ACCEPTED') {
        return 100; // Full points for accepted
      } else if (submission.testCasesPassed && submission.totalTestCases) {
        return Math.round((submission.testCasesPassed / submission.totalTestCases) * 100);
      }
      return 0;
    
    case 'CUSTOM':
      // Custom scoring based on difficulty
      const baseScore = submission.problem.difficulty === 'EASY' ? 100 :
                       submission.problem.difficulty === 'MEDIUM' ? 200 : 300;
      
      if (submission.status === 'ACCEPTED') {
        return baseScore;
      } else if (submission.testCasesPassed && submission.totalTestCases) {
        return Math.round((submission.testCasesPassed / submission.totalTestCases) * baseScore);
      }
      return 0;
    
    default:
      return submission.status === 'ACCEPTED' ? 1 : 0;
  }
}

export async function checkPlagiarism(
  contestId: string,
  problemId: string,
  code: string,
  currentUserId: string
): Promise<PlagiarismResult> {
  // Get all previous submissions for this problem in the contest
  const submissions = await redis.lrange(`contest:${contestId}:problem:${problemId}:submissions`, 0, -1);
  
  const matches: Array<{
    userId: string;
    userName: string;
    similarity: number;
  }> = [];

  for (const submissionData of submissions) {
    const submission = JSON.parse(submissionData);
    
    if (submission.userId === currentUserId) continue;

    // Calculate similarity using multiple methods
    const exactMatch = code === submission.code;
    const diffSimilarity = calculateDiffSimilarity(code, submission.code);
    const stringSimilarity = similarity(code, submission.code);

    const overallSimilarity = exactMatch ? 1 : 
                             Math.max(diffSimilarity, stringSimilarity);

    if (overallSimilarity > 0.7) {
      matches.push({
        userId: submission.userId,
        userName: submission.userName,
        similarity: overallSimilarity,
      });
    }
  }

  const maxSimilarity = matches.length > 0 
    ? Math.max(...matches.map(m => m.similarity))
    : 0;

  return {
    similarity: maxSimilarity,
    matches,
  };
}

function calculateDiffSimilarity(code1: string, code2: string): number {
  const differences = diffChars(code1, code2);
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (const diff of differences) {
    if (diff.added) {
      added += diff.value.length;
    } else if (diff.removed) {
      removed += diff.value.length;
    } else {
      unchanged += diff.value.length;
    }
  }

  const totalLength = added + removed + unchanged;
  return totalLength > 0 ? unchanged / totalLength : 0;
}

export async function updateLeaderboard(contestId: string) {
  // Get current leaderboard from Redis
  const leaderboard = await redis.zrevrange(`contest:${contestId}:leaderboard`, 0, -1, 'WITHSCORES');
  
  // Publish update to WebSocket clients
  await redis.publish('contest:leaderboard', JSON.stringify({
    contestId,
    leaderboard: leaderboard.reduce((acc, item, index) => {
      if (index % 2 === 0) {
        acc.push({
          userId: item,
          score: parseFloat(leaderboard[index + 1]),
        });
      }
      return acc;
    }, []),
  }));
}

export async function getContestTimer(contestId: string): Promise<{
  status: 'WAITING' | 'ACTIVE' | 'ENDED';
  timeRemaining: number;
  startTime: Date;
  endTime: Date;
}> {
  const contest = await redis.hgetall(`contest:${contestId}:timer`);
  
  if (!contest.startTime || !contest.endTime) {
    throw new Error('Contest timer not found');
  }

  const now = Date.now();
  const startTime = parseInt(contest.startTime);
  const endTime = parseInt(contest.endTime);

  let status: 'WAITING' | 'ACTIVE' | 'ENDED';
  let timeRemaining: number;

  if (now < startTime) {
    status = 'WAITING';
    timeRemaining = startTime - now;
  } else if (now > endTime) {
    status = 'ENDED';
    timeRemaining = 0;
  } else {
    status = 'ACTIVE';
    timeRemaining = endTime - now;
  }

  return {
    status,
    timeRemaining,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  };
} 