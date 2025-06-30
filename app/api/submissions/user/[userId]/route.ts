import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTestUser } from '@/lib/test-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is requesting their own submissions or is admin
    if (user.id !== params.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        userId: params.userId,
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
    console.error('Error fetching user submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 