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

    const submission = await prisma.submission.findFirst({
      where: {
        id: params.id,
        userId: user.id,
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

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
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
    const { status, runtime, memory, testCasesPassed, totalTestCases, errorMessage } = body;

    // Check if submission exists and belongs to user
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: {
        status: status || existingSubmission.status,
        runtime: runtime !== undefined ? runtime : existingSubmission.runtime,
        memory: memory !== undefined ? memory : existingSubmission.memory,
        testCasesPassed: testCasesPassed !== undefined ? testCasesPassed : existingSubmission.testCasesPassed,
        totalTestCases: totalTestCases !== undefined ? totalTestCases : existingSubmission.totalTestCases,
        errorMessage: errorMessage || existingSubmission.errorMessage,
      },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error updating submission:', error);
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

    // Check if submission exists and belongs to user
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await prisma.submission.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 