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
    const difficulty = searchParams.get('difficulty');
    const topic = searchParams.get('topic');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (topic) where.topic = topic;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    const problems = await prisma.problem.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.problem.count({ where });

    return NextResponse.json({ 
      problems, 
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
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
    const { title, description, difficulty, topic, examples, constraints, starterCode, solutionCode, tags } = body;

    if (!title || !description || !difficulty || !topic) {
      return NextResponse.json({ error: 'Title, description, difficulty, and topic are required' }, { status: 400 });
    }

    // Convert constraints to array if it's a string
    let constraintsArray = constraints;
    if (typeof constraints === 'string') {
      constraintsArray = constraints.split('\n').filter(c => c.trim());
    } else if (!Array.isArray(constraints)) {
      constraintsArray = [];
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        topic,
        examples: examples || [],
        constraints: constraintsArray,
        starterCode: starterCode || {},
        solutionCode: solutionCode || {},
        tags: tags || [],
      },
    });

    return NextResponse.json({ problem }, { status: 201 });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 