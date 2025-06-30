import { ExecutionRequest, ExecutionResult, ExecutionConfig, TestCase, SupportedLanguage } from './types';
import { Judge0Client } from './judge0-client';
import { DockerExecutor } from './docker-executor';
import { ExecutionQueue } from './queue';
import { getLanguageByName, isLanguageSupported } from './languages';
import { logger } from '../utils/logger';

export class ExecutionService {
  private judge0Client: Judge0Client;
  private dockerExecutor: DockerExecutor;
  private queue: ExecutionQueue;
  private config: ExecutionConfig;

  constructor(config: ExecutionConfig) {
    this.config = config;
    this.judge0Client = new Judge0Client(config.judge0Url, config.judge0ApiKey);
    this.dockerExecutor = new DockerExecutor();
    this.queue = new ExecutionQueue(config.maxConcurrentExecutions, config.queueTimeout);
    
    // Bind the executeRequest method to this instance
    this.queue.executeRequest = this.executeRequest.bind(this);
  }

  async submitExecution(request: ExecutionRequest): Promise<string> {
    if (!isLanguageSupported(request.language)) {
      throw new Error(`Unsupported language: ${request.language}`);
    }

    logger.info('Submitting execution request', {
      requestId: request.id,
      language: request.language,
      userId: request.userId,
    });

    // Add to queue
    const result = await this.queue.add(request);
    
    logger.info('Execution completed', {
      requestId: request.id,
      status: result.status,
      runtime: result.runtime,
    });

    return request.id;
  }

  async executeRequest(request: ExecutionRequest): Promise<ExecutionResult> {
    const language = getLanguageByName(request.language);
    if (!language) {
      throw new Error(`Unsupported language: ${request.language}`);
    }

    try {
      // Try Judge0 first
      return await this.executeWithJudge0(request, language);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn('Judge0 execution failed, falling back to Docker', {
        requestId: request.id,
        error: errorMessage,
      });

      if (this.config.enableDockerFallback) {
        return await this.executeWithDocker(request, language);
      } else {
        throw error;
      }
    }
  }

  private async executeWithJudge0(
    request: ExecutionRequest,
    language: SupportedLanguage
  ): Promise<ExecutionResult> {
    const token = await this.judge0Client.createSubmission(
      request.code,
      language,
      request.input,
      request.expectedOutput,
      request.timeLimit,
      request.memoryLimit
    );

    // Poll for result
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds with 1s intervals
    const pollInterval = 1000;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      
      const result = await this.judge0Client.getSubmission(token);
      
      if (result.status !== 'PENDING' && result.status !== 'PROCESSING') {
        return result;
      }
      
      attempts++;
    }

    throw new Error('Execution timeout');
  }

  private async executeWithDocker(
    request: ExecutionRequest,
    language: SupportedLanguage
  ): Promise<ExecutionResult> {
    return this.dockerExecutor.execute(request, language);
  }

  async validateTestCases(
    code: string,
    language: string,
    testCases: TestCase[],
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<{
    passed: number;
    total: number;
    results: Array<{
      testCase: TestCase;
      status: string;
      output?: string;
      error?: string;
      runtime?: number;
    }>;
  }> {
    const results = [];
    let passed = 0;

    for (const testCase of testCases) {
      const request: ExecutionRequest = {
        id: `test-${Date.now()}-${Math.random()}`,
        code,
        language,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        timeLimit,
        memoryLimit,
        userId: 'system',
        createdAt: new Date(),
      };

      try {
        const result = await this.executeRequest(request);
        const isCorrect = result.status === 'ACCEPTED';
        
        if (isCorrect) {
          passed++;
        }

        results.push({
          testCase,
          status: result.status,
          output: result.output,
          error: result.error,
          runtime: result.runtime,
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          testCase,
          status: 'SYSTEM_ERROR',
          error: errorMessage,
        });
      }
    }

    return {
      passed,
      total: testCases.length,
      results,
    };
  }

  getQueueStats() {
    return this.queue.getStats();
  }
} 