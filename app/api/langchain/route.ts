import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CodeNoteAgent } from '@/lib/langchain/agent';
import { RAGService } from '@/lib/langchain/rag';
import { AIServices } from '@/lib/langchain/services';
import { z } from 'zod';

// Request schemas
const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  type: z.enum(['notes', 'problems', 'all']).optional().default('all'),
  k: z.number().min(1).max(20).optional().default(5),
});

const NoteGenerationRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  style: z.enum(['detailed', 'concise', 'visual']).optional().default('detailed'),
});

const CodeAnalysisRequestSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  focus: z.enum(['complexity', 'optimization', 'best-practices', 'all']).optional().default('all'),
});

const ELI5RequestSchema = z.object({
  concept: z.string().min(1, 'Concept is required'),
  context: z.string().min(1, 'Context is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

const MultimodalRequestSchema = z.object({
  text: z.string().optional(),
  image: z.string().optional(), // base64 encoded
  audio: z.string().optional(), // base64 encoded
});

// Initialize services
let agent: CodeNoteAgent | null = null;
let ragService: RAGService | null = null;
let aiServices: AIServices | null = null;

const initializeServices = async () => {
  if (!agent) {
    agent = new CodeNoteAgent();
    await agent.initializeRAG();
  }
  if (!ragService) {
    ragService = new RAGService();
    await ragService.initialize();
  }
  if (!aiServices) {
    aiServices = new AIServices();
  }
};

// Route protection middleware
const requireAuth = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
};

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (session instanceof NextResponse) return session;

    await initializeServices();

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'chat':
        return await handleChat(data);
      case 'search':
        return await handleSearch(data);
      case 'generate_note':
        return await handleNoteGeneration(data);
      case 'analyze_code':
        return await handleCodeAnalysis(data);
      case 'explain_eli5':
        return await handleELI5(data);
      case 'multimodal':
        return await handleMultimodal(data);
      case 'analyze_image':
        return await handleImageAnalysis(data);
      case 'analyze_diagram':
        return await handleDiagramAnalysis(data);
      case 'get_recommendations':
        return await handleRecommendations(data);
      case 'find_similar':
        return await handleSimilarProblems(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('LangChain API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Chat with the agent
async function handleChat(data: any) {
  const { message } = ChatRequestSchema.parse(data);
  const response = await agent!.chat(message);
  
  return NextResponse.json({
    response,
    timestamp: new Date().toISOString(),
  });
}

// Search notes and problems
async function handleSearch(data: any) {
  const { query, type, k } = SearchRequestSchema.parse(data);
  
  let results;
  if (type === 'notes') {
    results = await ragService!.search(`note: ${query}`, k);
  } else if (type === 'problems') {
    results = await ragService!.search(`problem: ${query}`, k);
  } else {
    results = await ragService!.search(query, k);
  }

  return NextResponse.json({
    results,
    query,
    type,
    count: results.length,
  });
}

// Generate notes
async function handleNoteGeneration(data: any) {
  const request = NoteGenerationRequestSchema.parse(data);
  const note = await aiServices!.generateNote(request);
  
  return NextResponse.json({
    note,
    metadata: {
      title: request.title,
      topic: request.topic,
      difficulty: request.difficulty,
      style: request.style,
    },
  });
}

// Analyze code
async function handleCodeAnalysis(data: any) {
  const request = CodeAnalysisRequestSchema.parse(data);
  const analysis = await aiServices!.analyzeCode(request);
  
  return NextResponse.json({
    analysis,
    metadata: {
      language: request.language,
      focus: request.focus,
      codeLength: request.code.length,
    },
  });
}

// ELI5 explanation
async function handleELI5(data: any) {
  const request = ELI5RequestSchema.parse(data);
  const explanation = await aiServices!.explainELI5(request);
  
  return NextResponse.json({
    explanation,
    metadata: {
      concept: request.concept,
      level: request.level,
    },
  });
}

// Multimodal processing
async function handleMultimodal(data: any) {
  const request = MultimodalRequestSchema.parse(data);
  const result = await aiServices!.processMultimodalInput(request);
  
  return NextResponse.json({
    result,
    metadata: {
      hasImage: !!request.image,
      hasAudio: !!request.audio,
      hasText: !!request.text,
    },
  });
}

// Image analysis
async function handleImageAnalysis(data: any) {
  const { image, context } = data;
  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 });
  }
  
  const analysis = await aiServices!.analyzeImage(image, context);
  
  return NextResponse.json({
    analysis,
    metadata: {
      hasContext: !!context,
    },
  });
}

// Diagram analysis
async function handleDiagramAnalysis(data: any) {
  const { image, diagramType } = data;
  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 });
  }
  
  const analysis = await aiServices!.analyzeDiagram(image, diagramType);
  
  return NextResponse.json({
    analysis,
    metadata: {
      diagramType,
    },
  });
}

// Get recommendations
async function handleRecommendations(data: any) {
  const { userHistory, k = 5 } = data;
  if (!userHistory || !Array.isArray(userHistory)) {
    return NextResponse.json({ error: 'User history is required' }, { status: 400 });
  }
  
  const recommendations = await ragService!.getRecommendations(userHistory, k);
  
  return NextResponse.json({
    recommendations,
    count: recommendations.length,
  });
}

// Find similar problems
async function handleSimilarProblems(data: any) {
  const { problemId, k = 5 } = data;
  if (!problemId) {
    return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
  }
  
  const similarProblems = await ragService!.findSimilarProblems(problemId, k);
  
  return NextResponse.json({
    similarProblems,
    originalProblemId: problemId,
    count: similarProblems.length,
  });
}

// GET method for getting conversation history
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (session instanceof NextResponse) return session;

    await initializeServices();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'history':
        const history = await agent!.getConversationHistory();
        return NextResponse.json({ history });
      
      case 'tools':
        const tools = agent!.getTools();
        return NextResponse.json({ tools });
      
      case 'memory':
        const memory = agent!.getMemory();
        return NextResponse.json({ memory });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('LangChain API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE method for clearing conversation history
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (session instanceof NextResponse) return session;

    await initializeServices();
    await agent!.clearConversationHistory();
    
    return NextResponse.json({ message: 'Conversation history cleared' });
  } catch (error) {
    console.error('LangChain API DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 