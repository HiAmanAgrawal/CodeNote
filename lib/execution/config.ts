export interface ExecutionEnvironment {
  JUDGE0_URL?: string;
  JUDGE0_API_KEY?: string;
  MAX_CONCURRENT_EXECUTIONS?: string;
  DEFAULT_TIME_LIMIT?: string;
  DEFAULT_MEMORY_LIMIT?: string;
  ENABLE_DOCKER_FALLBACK?: string;
  DOCKER_TIMEOUT?: string;
  QUEUE_TIMEOUT?: string;
}

export function getExecutionConfig(): {
  judge0Url: string;
  judge0ApiKey?: string;
  maxConcurrentExecutions: number;
  defaultTimeLimit: number;
  defaultMemoryLimit: number;
  enableDockerFallback: boolean;
  dockerTimeout: number;
  queueTimeout: number;
} {
  return {
    judge0Url: process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com',
    judge0ApiKey: process.env.JUDGE0_API_KEY,
    maxConcurrentExecutions: parseInt(process.env.MAX_CONCURRENT_EXECUTIONS || '5'),
    defaultTimeLimit: parseInt(process.env.DEFAULT_TIME_LIMIT || '5'),
    defaultMemoryLimit: parseInt(process.env.DEFAULT_MEMORY_LIMIT || '512'),
    enableDockerFallback: process.env.ENABLE_DOCKER_FALLBACK === 'true',
    dockerTimeout: parseInt(process.env.DOCKER_TIMEOUT || '30000'),
    queueTimeout: parseInt(process.env.QUEUE_TIMEOUT || '30000'),
  };
} 