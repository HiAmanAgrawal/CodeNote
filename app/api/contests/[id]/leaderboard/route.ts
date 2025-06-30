import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const participants = await prisma.contestParticipant.findMany({
      where: { contestId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: [
        { score: 'desc' },
        { joinedAt: 'asc' },
      ],
    });

    return NextResponse.json({ leaderboard: participants });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 });
  }
} 