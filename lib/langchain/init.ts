import { db } from '@/lib/db';
import { RAGService } from './rag';
import { CodeNoteAgent } from './agent';

export class LangChainInitializer {
  private ragService: RAGService;
  private agent: CodeNoteAgent;

  constructor() {
    this.ragService = new RAGService();
    this.agent = new CodeNoteAgent();
  }

  // Initialize RAG with all database data
  async initializeWithDatabaseData() {
    console.log('🔄 Initializing LangChain with database data...');

    try {
      // Initialize services
      await this.ragService.initialize();
      await this.agent.initializeRAG();

      // Get all notes from database
      const notes = await db.note.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          topic: true,
          difficulty: true,
        },
      });

      // Get all problems from database
      const problems = await db.problem.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          topic: true,
          difficulty: true,
        },
      });

      console.log(`📝 Found ${notes.length} notes`);
      console.log(`🧩 Found ${problems.length} problems`);

      // Add notes to RAG
      if (notes.length > 0) {
        await this.ragService.addNotes(notes);
        console.log('✅ Notes added to RAG');
      }

      // Add problems to RAG
      if (problems.length > 0) {
        await this.ragService.addProblems(problems);
        console.log('✅ Problems added to RAG');
      }

      // Add data to agent
      await this.agent.addNotesToRAG(notes);
      await this.agent.addProblemsToRAG(problems);

      console.log('🎉 LangChain initialization complete!');
      
      return {
        notesCount: notes.length,
        problemsCount: problems.length,
        status: 'success',
      };
    } catch (error) {
      console.error('❌ Error initializing LangChain:', error);
      throw error;
    }
  }

  // Add new note to RAG
  async addNoteToRAG(note: {
    id: string;
    title: string;
    content: string;
    topic: string;
    difficulty: string;
  }) {
    await this.ragService.addNotes([note]);
    await this.agent.addNotesToRAG([note]);
  }

  // Add new problem to RAG
  async addProblemToRAG(problem: {
    id: string;
    title: string;
    description: string;
    topic: string;
    difficulty: string;
  }) {
    await this.ragService.addProblems([problem]);
    await this.agent.addProblemsToRAG([problem]);
  }

  // Update note in RAG (remove old, add new)
  async updateNoteInRAG(noteId: string, updatedNote: {
    id: string;
    title: string;
    content: string;
    topic: string;
    difficulty: string;
  }) {
    // For now, we'll just add the updated note
    // In a production system, you'd want to remove the old version first
    await this.addNoteToRAG(updatedNote);
  }

  // Update problem in RAG
  async updateProblemInRAG(problemId: string, updatedProblem: {
    id: string;
    title: string;
    description: string;
    topic: string;
    difficulty: string;
  }) {
    // For now, we'll just add the updated problem
    await this.addProblemToRAG(updatedProblem);
  }

  // Get RAG statistics
  async getRAGStats() {
    // This would return statistics about the RAG system
    // For now, return basic info
    return {
      initialized: true,
      timestamp: new Date().toISOString(),
    };
  }

  // Test RAG functionality
  async testRAG() {
    try {
      // Test search
      const searchResults = await this.ragService.search('array', 3);
      
      // Test RAG query
      const ragResponse = await this.ragService.query('What is a binary search?', 3);
      
      return {
        searchTest: {
          success: searchResults.length > 0,
          resultsCount: searchResults.length,
        },
        ragTest: {
          success: !!ragResponse.answer,
          confidence: ragResponse.confidence,
          sourcesCount: ragResponse.sources.length,
        },
      };
    } catch (error) {
      console.error('RAG test failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Singleton instance
let langChainInitializer: LangChainInitializer | null = null;

export const getLangChainInitializer = () => {
  if (!langChainInitializer) {
    langChainInitializer = new LangChainInitializer();
  }
  return langChainInitializer;
};

// Initialize on module load (optional)
export const initializeLangChain = async () => {
  const initializer = getLangChainInitializer();
  return await initializer.initializeWithDatabaseData();
}; 