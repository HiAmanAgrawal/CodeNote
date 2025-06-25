import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { RAGService } from './rag';
import { AIServices } from './services';
import { z } from 'zod';
import { createLLM } from './config';

export interface AgentTool {
  name: string;
  description: string;
  schema: z.ZodSchema;
  func: (input: any) => Promise<string>;
}

export class CodeNoteAgent {
  private memory: BufferMemory;
  private ragService: RAGService;
  private aiServices: AIServices;
  private tools: DynamicStructuredTool[];

  constructor() {
    this.ragService = new RAGService();
    this.aiServices = new AIServices();
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
      inputKey: 'input',
    });
    
    this.tools = [];
    this.initializeTools();
  }

  private initializeTools() {
    this.tools = [
      // Search Tools
      new DynamicStructuredTool({
        name: 'search_notes',
        description: 'Search for notes by topic, difficulty, or content',
        schema: z.object({
          query: z.string().describe('Search query for notes'),
          k: z.number().optional().describe('Number of results to return'),
        }),
        func: async ({ query, k = 5 }: { query: string; k?: number }) => {
          const results = await this.ragService.search(query, k);
          return JSON.stringify(results.map(r => ({
            title: r.metadata.title,
            topic: r.metadata.topic,
            difficulty: r.metadata.difficulty,
            content: r.content.substring(0, 200) + '...',
          })));
        },
      }),

      new DynamicStructuredTool({
        name: 'search_problems',
        description: 'Search for coding problems by topic, difficulty, or content',
        schema: z.object({
          query: z.string().describe('Search query for problems'),
          k: z.number().optional().describe('Number of results to return'),
        }),
        func: async ({ query, k = 5 }: { query: string; k?: number }) => {
          const results = await this.ragService.search(`problem: ${query}`, k);
          return JSON.stringify(results.map(r => ({
            title: r.metadata.title,
            topic: r.metadata.topic,
            difficulty: r.metadata.difficulty,
            description: r.content.substring(0, 200) + '...',
          })));
        },
      }),

      // AI Service Tools
      new DynamicStructuredTool({
        name: 'generate_note',
        description: 'Generate comprehensive notes from given content',
        schema: z.object({
          title: z.string().describe('Title of the note'),
          content: z.string().describe('Content to generate notes from'),
          topic: z.string().describe('Topic of the note'),
          difficulty: z.string().describe('Difficulty level'),
          style: z.enum(['detailed', 'concise', 'visual']).optional().describe('Note style'),
        }),
        func: async ({ title, content, topic, difficulty, style }: { 
          title: string; 
          content: string; 
          topic: string; 
          difficulty: string; 
          style?: string; 
        }) => {
          return await this.aiServices.generateNote({
            title,
            content,
            topic,
            difficulty,
            style: style as 'detailed' | 'concise' | 'visual' | undefined,
          });
        },
      }),

      new DynamicStructuredTool({
        name: 'analyze_code',
        description: 'Analyze code for complexity, optimization, and best practices',
        schema: z.object({
          code: z.string().describe('Code to analyze'),
          language: z.string().describe('Programming language'),
          focus: z.enum(['complexity', 'optimization', 'best-practices', 'all']).optional().describe('Focus area'),
        }),
        func: async ({ code, language, focus }: { 
          code: string; 
          language: string; 
          focus?: string; 
        }) => {
          return await this.aiServices.analyzeCode({
            code,
            language,
            focus: focus as 'complexity' | 'optimization' | 'best-practices' | 'all' | undefined,
          });
        },
      }),

      new DynamicStructuredTool({
        name: 'explain_eli5',
        description: 'Explain complex concepts in simple terms',
        schema: z.object({
          concept: z.string().describe('Concept to explain'),
          context: z.string().describe('Context for the explanation'),
          level: z.enum(['beginner', 'intermediate', 'advanced']).describe('Explanation level'),
        }),
        func: async ({ concept, context, level }: { 
          concept: string; 
          context: string; 
          level: string; 
        }) => {
          return await this.aiServices.explainELI5({
            concept,
            context,
            level: level as 'beginner' | 'intermediate' | 'advanced',
          });
        },
      }),

      // Multimodal Tools
      new DynamicStructuredTool({
        name: 'analyze_image',
        description: 'Analyze images containing code, diagrams, or DSA content',
        schema: z.object({
          image: z.string().describe('Base64 encoded image'),
          context: z.string().optional().describe('Context for the analysis'),
        }),
        func: async ({ image, context }: { 
          image: string; 
          context?: string; 
        }) => {
          return await this.aiServices.analyzeImage(image, context);
        },
      }),

      new DynamicStructuredTool({
        name: 'analyze_diagram',
        description: 'Analyze diagrams and visual representations of algorithms',
        schema: z.object({
          image: z.string().describe('Base64 encoded diagram image'),
          diagramType: z.string().optional().describe('Type of diagram'),
        }),
        func: async ({ image, diagramType }: { 
          image: string; 
          diagramType?: string; 
        }) => {
          return await this.aiServices.analyzeDiagram(image, diagramType);
        },
      }),

      // Recommendation Tools
      new DynamicStructuredTool({
        name: 'get_recommendations',
        description: 'Get personalized learning recommendations based on user history',
        schema: z.object({
          userHistory: z.array(z.string()).describe('User learning history'),
          k: z.number().optional().describe('Number of recommendations'),
        }),
        func: async ({ userHistory, k = 5 }: { 
          userHistory: string[]; 
          k?: number; 
        }) => {
          const results = await this.ragService.getRecommendations(userHistory, k);
          return JSON.stringify(results.map(r => ({
            title: r.metadata.title,
            topic: r.metadata.topic,
            difficulty: r.metadata.difficulty,
            type: r.metadata.type,
            content: r.content.substring(0, 200) + '...',
          })));
        },
      }),

      new DynamicStructuredTool({
        name: 'find_similar_problems',
        description: 'Find problems similar to a given problem',
        schema: z.object({
          problemId: z.string().describe('ID of the problem to find similar ones for'),
          k: z.number().optional().describe('Number of similar problems'),
        }),
        func: async ({ problemId, k = 5 }: { 
          problemId: string; 
          k?: number; 
        }) => {
          const results = await this.ragService.findSimilarProblems(problemId, k);
          return JSON.stringify(results.map(r => ({
            title: r.metadata.title,
            topic: r.metadata.topic,
            difficulty: r.metadata.difficulty,
            content: r.content.substring(0, 200) + '...',
          })));
        },
      }),
    ];
  }

  // Main conversation method
  async chat(input: string): Promise<string> {
    try {
      const llm = createLLM();
      
      // Get conversation history
      const history = await this.memory.chatHistory.getMessages();
      
      // Check if we have a mock LLM (no real API key)
      const isMockLLM = !('lc_serializable' in llm);
      
      if (isMockLLM) {
        // Mock LLM - call directly
        const result = await llm.invoke() as { content: string; type: string };
        
        // Add to memory
        await this.memory.saveContext(
          { input },
          { output: result.content }
        );

        return result.content;
      }
      
      // Real LLM - use the full pipeline
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', `You are CodeNote, an expert AI assistant for Data Structures and Algorithms learning.

Your capabilities include:
- Searching and retrieving notes and problems
- Generating comprehensive notes from content
- Analyzing code for complexity and optimization
- Explaining complex concepts in simple terms (ELI5)
- Analyzing images and diagrams
- Providing personalized learning recommendations

Always be helpful, educational, and encouraging. Focus on helping users understand DSA concepts better.
Use the available tools to provide the most relevant and helpful responses.`],
        ...history,
        ['human', '{input}'],
      ]);

      const response = await prompt.pipe(llm as any).invoke({ input }) as { content: string };
      
      // Add to memory
      await this.memory.saveContext(
        { input },
        { output: response.content }
      );

      return response.content;
    } catch (error) {
      console.error('Agent error:', error);
      return 'I apologize, but I encountered an error. Please try rephrasing your question or try again later.';
    }
  }

  // Initialize RAG with data
  async initializeRAG() {
    await this.ragService.initialize();
  }

  // Add notes to RAG
  async addNotesToRAG(notes: Array<{ id: string; title: string; content: string; topic: string; difficulty: string }>) {
    await this.ragService.addNotes(notes);
  }

  // Add problems to RAG
  async addProblemsToRAG(problems: Array<{ id: string; title: string; description: string; topic: string; difficulty: string }>) {
    await this.ragService.addProblems(problems);
  }

  // Get conversation history
  async getConversationHistory(): Promise<any[]> {
    return await this.memory.chatHistory.getMessages();
  }

  // Clear conversation history
  async clearConversationHistory() {
    await this.memory.clear();
  }

  // Get agent memory
  getMemory() {
    return this.memory;
  }

  // Get available tools
  getTools() {
    return this.tools.map(tool => ({
      name: tool.name,
      description: tool.description,
    }));
  }
} 