import { NextRequest, NextResponse } from 'next/server';
import { ExecutionService } from '@/lib/execution/execution-service';
import { ExecutionMiddleware } from '@/lib/execution/middleware';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getExecutionConfig } from '@/lib/execution/config';

// Initialize execution service
const executionService = new ExecutionService(getExecutionConfig());
const middleware = new ExecutionMiddleware(executionService);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user ID to headers for middleware
    const modifiedReq = new NextRequest(req.url, {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers.entries()),
        'x-user-id': session.user.id,
      },
      body: req.body,
    });

    return middleware.handleExecutionRequest(modifiedReq);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Execution API error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Return queue stats
    const stats = executionService.getQueueStats();
    return NextResponse.json({
      stats,
      message: 'Queue statistics retrieved successfully',
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Queue stats API error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 