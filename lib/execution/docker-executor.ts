import { ExecutionRequest, ExecutionResult, ExecutionStatus, SupportedLanguage } from './types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

export class DockerExecutor {
  private tempDir: string;

  constructor(tempDir: string = '/tmp/code-execution') {
    this.tempDir = tempDir;
  }

  async execute(
    request: ExecutionRequest,
    language: SupportedLanguage
  ): Promise<ExecutionResult> {
    const executionId = randomUUID();
    const workDir = join(this.tempDir, executionId);
    
    try {
      // Create working directory
      await mkdir(workDir, { recursive: true });

      // Write source code to file
      const sourceFile = join(workDir, `main${language.extension}`);
      await writeFile(sourceFile, request.code);

      // Prepare Docker command
      const dockerCmd = this.buildDockerCommand(
        request,
        language,
        workDir,
        sourceFile
      );

      // Execute in Docker container
      const { stdout, stderr } = await execAsync(dockerCmd, {
        timeout: (request.timeLimit || language.timeLimit) * 1000 + 5000, // Add 5s buffer
      });

      return {
        id: request.id,
        status: 'ACCEPTED',
        output: stdout.trim(),
        error: stderr || undefined,
        runtime: Date.now() - request.createdAt.getTime(),
        completedAt: new Date(),
      };

    } catch (error: unknown) {
      let status: ExecutionStatus = 'SYSTEM_ERROR';
      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check if it's a timeout error
        if ('signal' in error && error.signal === 'SIGTERM') {
          status = 'TIME_LIMIT_EXCEEDED';
          errorMessage = 'Execution timed out';
        } else if ('stderr' in error && error.stderr) {
          status = 'RUNTIME_ERROR';
          errorMessage = error.stderr as string;
        }
      }

      return {
        id: request.id,
        status,
        error: errorMessage,
        completedAt: new Date(),
      };

    } finally {
      // Cleanup
      try {
        await execAsync(`rm -rf ${workDir}`);
      } catch (cleanupError: unknown) {
        const cleanupErrorMessage = cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error';
        console.error('Failed to cleanup execution directory:', cleanupErrorMessage);
      }
    }
  }

  private buildDockerCommand(
    request: ExecutionRequest,
    language: SupportedLanguage,
    workDir: string,
    sourceFile: string
  ): string {
    const containerName = `exec-${request.id}`;
    const timeLimit = request.timeLimit || language.timeLimit;
    const memoryLimit = request.memoryLimit || language.memoryLimit;

    let cmd = `docker run --rm --name ${containerName}`;
    cmd += ` --memory=${memoryLimit}m`;
    cmd += ` --cpus=1`;
    cmd += ` --network=none`;
    cmd += ` --security-opt=no-new-privileges`;
    cmd += ` --user=1000:1000`;
    cmd += ` -v ${workDir}:/workspace`;
    cmd += ` -w /workspace`;
    cmd += ` --ulimit nofile=64:64`;
    cmd += ` --ulimit nproc=64:64`;

    // Language-specific setup
    switch (language.name.toLowerCase()) {
      case 'javascript':
        cmd += ` node:18-alpine sh -c "echo '${request.input || ''}' | node main.js"`;
        break;
      case 'python':
        cmd += ` python:3.11-alpine sh -c "echo '${request.input || ''}' | python3 main.py"`;
        break;
      case 'c++':
        cmd += ` gcc:11 sh -c "g++ -std=c++17 -O2 -o main main.cpp && echo '${request.input || ''}' | ./main"`;
        break;
      case 'java':
        cmd += ` openjdk:17 sh -c "javac Main.java && echo '${request.input || ''}' | java Main"`;
        break;
      default:
        throw new Error(`Unsupported language: ${language.name}`);
    }

    return cmd;
  }
}