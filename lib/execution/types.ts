export interface ExecutionRequest {
  id: string;
  code: string;
  language: string;
  input?: string;
  expectedOutput?: string;
  timeLimit?: number; // in seconds
  memoryLimit?: number; // in MB
  userId: string;
  problemId?: string;
  contestId?: string;
  createdAt: Date;
}

export interface ExecutionResult {
  id: string;
  status: ExecutionStatus;
  output?: string;
  error?: string;
  runtime?: number; // in milliseconds
  memory?: number; // in KB
  testCasesPassed?: number;
  totalTestCases?: number;
  completedAt: Date;
}

export type ExecutionStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR'
  | 'SYSTEM_ERROR';

export interface SupportedLanguage {
  id: number;
  name: string;
  extension: string;
  judge0Id: number;
  dockerImage?: string;
  compileCommand?: string;
  runCommand: string;
  timeLimit: number;
  memoryLimit: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ExecutionConfig {
  judge0Url: string;
  judge0ApiKey?: string;
  maxConcurrentExecutions: number;
  defaultTimeLimit: number;
  defaultMemoryLimit: number;
  enableDockerFallback: boolean;
  dockerTimeout: number;
  queueTimeout: number;
}