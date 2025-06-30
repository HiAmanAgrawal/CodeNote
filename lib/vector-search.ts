import { db } from './db';
import { pool } from './db';
import { OpenAIEmbeddings } from '@langchain/openai';

export class VectorSearchService {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-ada-002',
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embedding = await this.embeddings.embedQuery(text);
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async searchNotes(query: string, limit: number = 10, userId?: string): Promise<any[]> {
    const embedding = await this.generateEmbedding(query);
    
    const result = await pool.query(`
      SELECT 
        n.id,
        n.title,
        n.content,
        n.topic,
        n.difficulty,
        n.tags,
        n."createdAt",
        u.name as "userName",
        1 - (n.embedding <=> $1) as similarity
      FROM "Note" n
      JOIN "User" u ON n."userId" = u.id
      WHERE n."deletedAt" IS NULL
        AND (n."isPublic" = true OR n."userId" = $2)
      ORDER BY n.embedding <=> $1
      LIMIT $3
    `, [embedding, userId || null, limit]);

    return result.rows;
  }

  async searchProblems(query: string, limit: number = 10): Promise<any[]> {
    const embedding = await this.generateEmbedding(query);
    
    const result = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.difficulty,
        p.topic,
        p.tags,
        p."createdAt",
        u.name as "userName",
        1 - (p.embedding <=> $1) as similarity
      FROM "Problem" p
      JOIN "User" u ON p."userId" = u.id
      WHERE p."deletedAt" IS NULL
      ORDER BY p.embedding <=> $1
      LIMIT $2
    `, [embedding, limit]);

    return result.rows;
  }

  async searchContests(query: string, limit: number = 10): Promise<any[]> {
    const embedding = await this.generateEmbedding(query);
    
    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c."startTime",
        c."endTime",
        c."isActive",
        c."maxParticipants",
        c."createdAt",
        u.name as "userName",
        1 - (c.embedding <=> $1) as similarity
      FROM "Contest" c
      JOIN "User" u ON c."userId" = u.id
      WHERE c."deletedAt" IS NULL
      ORDER BY c.embedding <=> $1
      LIMIT $2
    `, [embedding, limit]);

    return result.rows;
  }

  async findSimilarCode(code: string, contestId: string, problemId: string, limit: number = 5): Promise<any[]> {
    const embedding = await this.generateEmbedding(code);
    
    const result = await pool.query(`
      SELECT 
        s.id,
        s.code,
        s.language,
        s.status,
        s."submittedAt",
        u.name as "userName",
        1 - (s.embedding <=> $1) as similarity
      FROM "Submission" s
      JOIN "User" u ON s."userId" = u.id
      WHERE s."deletedAt" IS NULL
        AND s."contestId" = $2
        AND s."problemId" = $3
        AND s."userId" != $4
      ORDER BY s.embedding <=> $1
      LIMIT $5
    `, [embedding, contestId, problemId, null, limit]);

    return result.rows;
  }

  async updateNoteEmbedding(noteId: string): Promise<void> {
    const note = await db.note.findUnique({
      where: { id: noteId },
      select: { title: true, content: true, topic: true },
    });

    if (!note) return;

    const text = `${note.title} ${note.content} ${note.topic}`;
    const embedding = await this.generateEmbedding(text);

    await pool.query(`
      UPDATE "Note" 
      SET embedding = $1 
      WHERE id = $2
    `, [embedding, noteId]);
  }

  async updateProblemEmbedding(problemId: string): Promise<void> {
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { title: true, description: true, topic: true, tags: true },
    });

    if (!problem) return;

    const text = `${problem.title} ${problem.description} ${problem.topic} ${problem.tags.join(' ')}`;
    const embedding = await this.generateEmbedding(text);

    await pool.query(`
      UPDATE "Problem" 
      SET embedding = $1 
      WHERE id = $2
    `, [embedding, problemId]);
  }

  async updateContestEmbedding(contestId: string): Promise<void> {
    const contest = await db.contest.findUnique({
      where: { id: contestId },
      select: { title: true, description: true },
    });

    if (!contest) return;

    const text = `${contest.title} ${contest.description}`;
    const embedding = await this.generateEmbedding(text);

    await pool.query(`
      UPDATE "Contest" 
      SET embedding = $1 
      WHERE id = $2
    `, [embedding, contestId]);
  }

  async updateSubmissionEmbedding(submissionId: string): Promise<void> {
    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      select: { code: true, language: true },
    });

    if (!submission) return;

    const text = `${submission.code} ${submission.language}`;
    const embedding = await this.generateEmbedding(text);

    await pool.query(`
      UPDATE "Submission" 
      SET embedding = $1 
      WHERE id = $2
    `, [embedding, submissionId]);
  }
}

export const vectorSearch = new VectorSearchService(); 