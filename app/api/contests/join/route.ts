import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTestUser } from '@/lib/test-auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { contestId } = body;

    if (!contestId) {
      return NextResponse.json({ error: 'Contest ID is required' }, { status: 400 });
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    }

    // Check if user is already a participant
    const existingParticipation = await prisma.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId: contestId,
          userId: user.id,
        },
      },
    });

    if (existingParticipation) {
      return NextResponse.json({ error: 'User is already a participant' }, { status: 409 });
    }

    const participation = await prisma.contestParticipant.create({
      data: {
        userId: user.id,
        contestId: contestId,
        joinedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        contest: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ participation }, { status: 201 });
  } catch (error) {
    console.error('Error joining contest:', error);
    if (error instanceof Error && error.message) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 