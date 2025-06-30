import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTestUser } from '@/lib/test-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { problemId: string } }
) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        problemId: params.problemId,
        userId: user.id, // Only show user's own submissions for this problem
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
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 