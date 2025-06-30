import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTestUser } from '@/lib/test-auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = { userId: user.id };
    if (problemId) where.problemId = problemId;
    if (status) where.status = status;

    const submissions = await prisma.submission.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const total = await prisma.submission.count({ where });

    return NextResponse.json({ 
      submissions, 
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, code, language, status, contestId } = body;

    if (!problemId || !code || !language) {
      return NextResponse.json({ error: 'Problem ID, code, and language are required' }, { status: 400 });
    }

    // Verify problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Create a default contest if none provided
    let finalContestId = contestId;
    if (!finalContestId) {
      const defaultContest = await prisma.contest.findFirst({
        where: { title: 'Default Contest' },
      });
      
      if (!defaultContest) {
        const newContest = await prisma.contest.create({
          data: {
            title: 'Default Contest',
            description: 'Default contest for standalone submissions',
            startTime: new Date(),
            endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            userId: user.id,
          },
        });
        finalContestId = newContest.id;
      } else {
        finalContestId = defaultContest.id;
      }
    }

    const submission = await prisma.submission.create({
      data: {
        problemId,
        contestId: finalContestId,
        userId: user.id,
        code,
        language,
        status: status || 'PENDING',
        submittedAt: new Date(),
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 