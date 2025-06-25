import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { isAIServiceAvailable } from '@/lib/ai';

export interface AgentConfig {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AgentResponse {
  content: string;
  metadata?: Record<string, any>;
  error?: string;
}

export abstract class BaseAgent {
  protected model: ChatGoogleGenerativeAI;
  protected systemPrompt: string;
  protected memory: (HumanMessage | AIMessage | SystemMessage)[] = [];

  constructor(config: AgentConfig = {}) {
    if (!isAIServiceAvailable()) {
      throw new Error('AI service is not available. Please check your API key.');
    }

    this.model = new ChatGoogleGenerativeAI({
      modelName: config.modelName || 'gemini-pro',
      temperature: config.temperature || 0.7,
      maxOutputTokens: config.maxTokens || 2048,
    });

    this.systemPrompt = config.systemPrompt || this.getDefaultSystemPrompt();
  }

  /**
   * Get the default system prompt for this agent
   */
  protected abstract getDefaultSystemPrompt(): string;

  /**
   * Process a message and return a response
   */
  async processMessage(message: string, context?: Record<string, any>): Promise<AgentResponse> {
    try {
      const messages = this.buildMessages(message, context);
      
      const chain = RunnableSequence.from([
        {
          messages: () => messages,
        },
        this.model,
        new StringOutputParser(),
      ]);

      const response = await chain.invoke({});
      
      // Add to memory
      this.memory.push(new HumanMessage(message));
      this.memory.push(new AIMessage(response));

      return {
        content: response,
        metadata: { model: this.model.modelName },
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Build messages for the agent
   */
  protected buildMessages(message: string, context?: Record<string, any>): (HumanMessage | AIMessage | SystemMessage)[] {
    const messages: (HumanMessage | AIMessage | SystemMessage)[] = [
      new SystemMessage(this.systemPrompt),
    ];

    // Add context if provided
    if (context) {
      const contextMessage = this.formatContext(context);
      messages.push(new SystemMessage(contextMessage));
    }

    // Add conversation history (last 10 messages to avoid token limits)
    const recentMemory = this.memory.slice(-10);
    messages.push(...recentMemory);

    // Add current message
    messages.push(new HumanMessage(message));

    return messages;
  }

  /**
   * Format context for the agent
   */
  protected formatContext(context: Record<string, any>): string {
    return `Context: ${JSON.stringify(context, null, 2)}`;
  }

  /**
   * Clear the agent's memory
   */
  clearMemory(): void {
    this.memory = [];
  }

  /**
   * Get the agent's memory
   */
  getMemory(): (HumanMessage | AIMessage | SystemMessage)[] {
    return [...this.memory];
  }

  /**
   * Set the agent's memory
   */
  setMemory(memory: (HumanMessage | AIMessage | SystemMessage)[]): void {
    this.memory = [...memory];
  }
}

/**
 * Code Analysis Agent
 */
export class CodeAnalysisAgent extends BaseAgent {
  protected getDefaultSystemPrompt(): string {
    return `You are an expert code analyst specializing in Data Structures and Algorithms. 
    Your role is to analyze code, explain algorithms, and provide optimization suggestions.
    
    Always provide:
    1. Clear explanations of the algorithm
    2. Time and space complexity analysis
    3. Optimization suggestions
    4. Best practices recommendations
    5. Alternative approaches when applicable
    
    Be concise but thorough in your analysis.`;
  }

  async analyzeCode(code: string, language: string): Promise<AgentResponse> {
    const message = `Please analyze this ${language} code and provide a comprehensive analysis:
    
    Code:
    ${code}
    
    Please include:
    - Algorithm explanation
    - Time and space complexity
    - Optimization suggestions
    - Best practices
    - Alternative approaches if applicable`;
    
    return this.processMessage(message);
  }
}

/**
 * Note Generation Agent
 */
export class NoteGenerationAgent extends BaseAgent {
  protected getDefaultSystemPrompt(): string {
    return `You are an expert note-taking assistant specializing in Data Structures and Algorithms.
    Your role is to create comprehensive, well-structured notes from various sources.
    
    Always structure your notes with:
    1. Clear headings and subheadings
    2. Key concepts and definitions
    3. Examples and code snippets
    4. Important takeaways
    5. Related topics and connections
    
    Make notes engaging and easy to understand.`;
  }

  async generateNotes(source: string, sourceType: string, context?: string): Promise<AgentResponse> {
    const message = `Please generate comprehensive notes from this ${sourceType}:
    
    Source:
    ${source}
    
    Context: ${context || 'DSA learning'}
    
    Please create well-structured notes with clear headings, key points, and examples.`;
    
    return this.processMessage(message);
  }
}

/**
 * Problem Solving Agent
 */
export class ProblemSolvingAgent extends BaseAgent {
  protected getDefaultSystemPrompt(): string {
    return `You are an expert problem-solving assistant specializing in Data Structures and Algorithms.
    Your role is to help users understand and solve coding problems.
    
    Always provide:
    1. Problem breakdown and understanding
    2. Step-by-step solution approach
    3. Code implementation
    4. Time and space complexity analysis
    5. Key insights and patterns
    6. Similar problems for practice
    
    Be patient and explain concepts clearly.`;
  }

  async solveProblem(problemTitle: string, problemDescription: string, difficulty: string): Promise<AgentResponse> {
    const message = `Please help me solve this ${difficulty.toLowerCase()} problem:
    
    Title: ${problemTitle}
    Description: ${problemDescription}
    
    Please provide:
    1. Problem understanding
    2. Solution approach
    3. Step-by-step solution
    4. Code implementation
    5. Complexity analysis
    6. Key insights`;
    
    return this.processMessage(message);
  }
}

/**
 * Learning Recommendation Agent
 */
export class LearningRecommendationAgent extends BaseAgent {
  protected getDefaultSystemPrompt(): string {
    return `You are an expert learning advisor specializing in Data Structures and Algorithms.
    Your role is to provide personalized learning recommendations based on user progress.
    
    Always consider:
    1. User's current knowledge level
    2. Learning goals and preferences
    3. Weak areas that need improvement
    4. Optimal learning sequence
    5. Practice recommendations
    
    Provide actionable and personalized advice.`;
  }

  async generateRecommendations(
    userNotes: string[],
    completedProblems: string[],
    weakAreas: string[]
  ): Promise<AgentResponse> {
    const message = `Based on my learning history, please provide personalized recommendations:
    
    My Notes: ${userNotes.join(', ')}
    Completed Problems: ${completedProblems.join(', ')}
    Weak Areas: ${weakAreas.join(', ')}
    
    Please provide:
    1. Recommended topics to focus on
    2. Suggested problems to practice
    3. Learning resources
    4. Study plan
    5. Progress tracking suggestions`;
    
    return this.processMessage(message);
  }
}
