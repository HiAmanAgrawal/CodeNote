import { createVectorStore, createLLM } from './config';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import { RetrievalQAChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

export interface SearchResult {
  content: string;
  metadata: {
    source: string;
    type: 'note' | 'problem';
    id: string;
    title?: string;
    topic?: string;
    difficulty?: string;
    score: number;
  };
}

export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
}

export class RAGService {
  private vectorStore: any;
  private llm: any;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', ' ', ''],
    });
  }

  async initialize() {
    this.vectorStore = await createVectorStore();
    this.llm = createLLM();
  }

  // Add documents to vector store
  async addDocuments(documents: Array<{ content: string; metadata: any }>) {
    if (!this.vectorStore) await this.initialize();

    const docs = documents.map(
      (doc) =>
        new Document({
          pageContent: doc.content,
          metadata: doc.metadata,
        })
    );

    const splitDocs = await this.textSplitter.splitDocuments(docs);
    await this.vectorStore.addDocuments(splitDocs);
  }

  // Add notes to vector store
  async addNotes(notes: Array<{ id: string; title: string; content: string; topic: string; difficulty: string }>) {
    const documents = notes.map((note) => ({
      content: `Title: ${note.title}\nTopic: ${note.topic}\nDifficulty: ${note.difficulty}\nContent: ${note.content}`,
      metadata: {
        source: 'note',
        type: 'note',
        id: note.id,
        title: note.title,
        topic: note.topic,
        difficulty: note.difficulty,
      },
    }));

    await this.addDocuments(documents);
  }

  // Add problems to vector store
  async addProblems(problems: Array<{ id: string; title: string; description: string; topic: string; difficulty: string }>) {
    const documents = problems.map((problem) => ({
      content: `Title: ${problem.title}\nTopic: ${problem.topic}\nDifficulty: ${problem.difficulty}\nDescription: ${problem.description}`,
      metadata: {
        source: 'problem',
        type: 'problem',
        id: problem.id,
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
      },
    }));

    await this.addDocuments(documents);
  }

  // Semantic search
  async search(query: string, k: number = 5): Promise<SearchResult[]> {
    if (!this.vectorStore) await this.initialize();

    const results = await this.vectorStore.similaritySearchWithScore(query, k);
    
    return results.map(([doc, score]: [any, number]) => ({
      content: doc.pageContent,
      metadata: {
        ...doc.metadata,
        score: score,
      },
    }));
  }

  // RAG query with context
  async query(query: string, k: number = 5): Promise<RAGResponse> {
    if (!this.vectorStore) await this.initialize();

    const promptTemplate = PromptTemplate.fromTemplate(`
You are an expert coding assistant specializing in Data Structures and Algorithms. 
Use the following context to answer the user's question. If you cannot find the answer in the context, say so.

Context:
{context}

Question: {question}

Answer the question based on the context provided. Be concise but thorough.
`);

    const chain = RunnableSequence.from([
      {
        context: async () => {
          const results = await this.search(query, k);
          return results.map(r => r.content).join('\n\n');
        },
        question: () => query,
      },
      promptTemplate,
      this.llm,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke({});
    const sources = await this.search(query, k);

    return {
      answer,
      sources,
      confidence: sources.length > 0 ? Math.min(0.9, 1 - sources[0].metadata.score) : 0.5,
    };
  }

  // Search by topic
  async searchByTopic(topic: string, k: number = 10): Promise<SearchResult[]> {
    return this.search(`topic: ${topic}`, k);
  }

  // Search by difficulty
  async searchByDifficulty(difficulty: string, k: number = 10): Promise<SearchResult[]> {
    return this.search(`difficulty: ${difficulty}`, k);
  }

  // Search similar problems
  async findSimilarProblems(problemId: string, k: number = 5): Promise<SearchResult[]> {
    // First get the problem content
    const problemResults = await this.search(`id: ${problemId}`, 1);
    if (problemResults.length === 0) return [];

    const problemContent = problemResults[0].content;
    return this.search(problemContent, k);
  }

  // Get recommendations based on user history
  async getRecommendations(userHistory: string[], k: number = 5): Promise<SearchResult[]> {
    const historyText = userHistory.join(' ');
    return this.search(historyText, k);
  }
} 