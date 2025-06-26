import { ExecutionRequest, ExecutionResult } from './types';
import { EventEmitter } from 'events';

interface QueueItem {
  request: ExecutionRequest;
  resolve: (result: ExecutionResult) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

export class ExecutionQueue extends EventEmitter {
  private queue: QueueItem[] = [];
  private processing = false;
  private maxConcurrent: number;
  private activeExecutions = 0;
  private timeout: number;
  public executeRequest!: (request: ExecutionRequest) => Promise<ExecutionResult>;

  constructor(maxConcurrent: number = 5, timeout: number = 30000) {
    super();
    this.maxConcurrent = maxConcurrent;
    this.timeout = timeout;
  }

  async add(request: ExecutionRequest): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      const queueItem: QueueItem = {
        request,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(queueItem);
      this.emit('queued', request.id);
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.activeExecutions >= this.maxConcurrent) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.activeExecutions < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) continue;

      // Check timeout
      if (Date.now() - item.timestamp > this.timeout) {
        item.reject(new Error('Queue timeout exceeded'));
        continue;
      }

      this.activeExecutions++;
      this.emit('processing', item.request.id);

      // Process the execution
      this.executeItem(item).finally(() => {
        this.activeExecutions--;
        this.emit('completed', item.request.id);
        this.process(); // Continue processing
      });
    }

    this.processing = false;
  }

  private async executeItem(item: QueueItem) {
    try {
      // This will be implemented by the execution service
      const result = await this.executeRequest(item.request);
      item.resolve(result);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      item.reject(new Error(errorMessage));
    }
  }

  getStats() {
    return {
      queueLength: this.queue.length,
      activeExecutions: this.activeExecutions,
      maxConcurrent: this.maxConcurrent,
    };
  }

  clear() {
    this.queue.forEach((item) => {
      item.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
} 