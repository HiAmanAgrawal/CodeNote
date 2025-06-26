import { NextRequest, NextResponse } from 'next/server';
import { ExecutionService } from '@/lib/execution/execution-service';
import { ExecutionMiddleware } from '@/lib/execution/middleware';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getExecutionConfig } from '@/lib/execution/config';

const executionService = new ExecutionService(getExecutionConfig());
const middleware = new ExecutionMiddleware(executionService);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return middleware.handleExecutionStatus(req, params.id);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Execution status API error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 