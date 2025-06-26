import { ExecutionRequest, ExecutionResult, ExecutionStatus, SupportedLanguage } from './types';

export class Judge0Client {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge with existing headers if any
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.apiKey) {
      headers['X-RapidAPI-Key'] = this.apiKey;
      headers['X-RapidAPI-Host'] = new URL(this.baseUrl).hostname;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createSubmission(
    sourceCode: string,
    language: SupportedLanguage,
    input?: string,
    expectedOutput?: string,
    timeLimit?: number,
    memoryLimit?: number
  ): Promise<string> {
    const payload = {
      source_code: sourceCode,
      language_id: language.judge0Id,
      stdin: input || '',
      expected_output: expectedOutput || '',
      cpu_time_limit: timeLimit || language.timeLimit,
      memory_limit: memoryLimit || language.memoryLimit,
      enable_network: false,
    };

    const result = await this.makeRequest('/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return result.token;
  }

  async getSubmission(token: string): Promise<ExecutionResult> {
    const result = await this.makeRequest(`/submissions/${token}`);
    
    const statusMap: Record<number, ExecutionStatus> = {
      1: 'PENDING',
      2: 'PROCESSING',
      3: 'ACCEPTED',
      4: 'WRONG_ANSWER',
      5: 'TIME_LIMIT_EXCEEDED',
      6: 'COMPILATION_ERROR',
      7: 'RUNTIME_ERROR',
      8: 'SYSTEM_ERROR',
      9: 'MEMORY_LIMIT_EXCEEDED',
    };

    return {
      id: token,
      status: statusMap[result.status?.id] || 'SYSTEM_ERROR',
      output: result.stdout,
      error: result.stderr || result.compile_output,
      runtime: result.time ? Math.round(result.time * 1000) : undefined,
      memory: result.memory,
      completedAt: new Date(),
    };
  }

  async getLanguages(): Promise<any[]> {
    return this.makeRequest('/languages');
  }
}