import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTestUser } from '@/lib/test-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: params.id },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, difficulty, topic, examples, constraints, starterCode, solutionCode, tags } = body;

    // Check if problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id: params.id },
    });

    if (!existingProblem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const problem = await prisma.problem.update({
      where: { id: params.id },
      data: {
        title: title || existingProblem.title,
        description: description || existingProblem.description,
        difficulty: difficulty || existingProblem.difficulty,
        topic: topic || existingProblem.topic,
        examples: examples || existingProblem.examples,
        constraints: constraints || existingProblem.constraints,
        starterCode: starterCode || existingProblem.starterCode,
        solutionCode: solutionCode || existingProblem.solutionCode,
        tags: tags || existingProblem.tags,
      },
    });

    return NextResponse.json({ problem });
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getTestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id: params.id },
    });

    if (!existingProblem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    await prisma.problem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 