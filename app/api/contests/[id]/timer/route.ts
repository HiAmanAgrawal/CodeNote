import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getContestTimer } from '@/lib/contest-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timer = await getContestTimer(params.id);
    return NextResponse.json(timer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get timer' }, { status: 500 });
  }
} 