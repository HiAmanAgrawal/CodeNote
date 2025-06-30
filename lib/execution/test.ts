// Simple test to verify the execution service can be instantiated
import { ExecutionService } from './execution-service';
import { getExecutionConfig } from './config';

export function testExecutionService() {
  try {
    const config = getExecutionConfig();
    const service = new ExecutionService(config);
    console.log('Execution service created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create execution service:', error);
    return false;
  }
} 