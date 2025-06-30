import { NextRequest, NextResponse } from 'next/server';
import { ExecutionService } from './execution-service';
import { logger } from '../utils/logger';

export class ExecutionMiddleware {
  private executionService: ExecutionService;

  constructor(executionService: ExecutionService) {
    this.executionService = executionService;
  }

  async handleExecutionRequest(req: NextRequest) {
    try {
      const body = await req.json();
      
      // Validate request
      if (!body.code || !body.language) {
        return NextResponse.json(
          { error: 'Missing required fields: code, language' },
          { status: 400 }
        );
      }

      // Rate limiting check (implement based on your rate limiting strategy)
      const userId = req.headers.get('x-user-id');
      if (!userId) {
        return NextResponse.json(
          { error: 'User authentication required' },
          { status: 401 }
        );
      }

      const request = {
        id: `exec-${Date.now()}-${Math.random()}`,
        code: body.code,
        language: body.language,
        input: body.input,
        expectedOutput: body.expectedOutput,
        timeLimit: body.timeLimit,
        memoryLimit: body.memoryLimit,
        userId,
        problemId: body.problemId,
        contestId: body.contestId,
        createdAt: new Date(),
      };

      const executionId = await this.executionService.submitExecution(request);

      return NextResponse.json({
        executionId,
        status: 'queued',
        message: 'Execution request submitted successfully',
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Execution request failed', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  async handleExecutionStatus(req: NextRequest, executionId: string) {
    try {
      // Implement status checking logic
      // This would typically query your database for execution results
      
      return NextResponse.json({
        executionId,
        status: 'processing', // This would be the actual status
        message: 'Status check not implemented yet',
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Status check failed', {
        executionId,
        error: errorMessage,
      });

      return NextResponse.json(
        { error: 'Failed to check execution status' },
        { status: 500 }
      );
    }
  }
} 