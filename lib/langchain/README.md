# LangChain.js Setup for CodeNote

This directory contains the complete LangChain.js implementation for CodeNote, providing AI-powered features for DSA learning.

## 🚀 Features

- **Retrieval-Augmented Generation (RAG)** with Pinecone vector database
- **Multi-provider embeddings** (OpenAI, Cohere, Gemini)
- **Semantic search** over notes and problems
- **AI services**: note generation, code analysis, ELI5 explanations
- **Multimodal input processing**: images, diagrams, voice-to-text
- **LangChain agent** with tools and memory
- **Route protection** and authentication

## 📁 Structure

```
lib/langchain/
├── config.ts          # Configuration and initialization
├── rag.ts            # RAG service for semantic search
├── services.ts       # AI services (notes, code analysis, ELI5)
├── agent.ts          # LangChain agent with tools
├── init.ts           # Database integration and initialization
└── README.md         # This file
```

## 🔧 Configuration

### Environment Variables

Add these to your `.env.local` file:

```bash
# OpenAI
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4-turbo-preview"

# Cohere
COHERE_API_KEY="your-cohere-api-key"
COHERE_MODEL="command"

# Google (Gemini)
GOOGLE_API_KEY="your-google-api-key"
GEMINI_MODEL="gemini-pro"

# Pinecone
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_ENVIRONMENT="your-pinecone-environment"
PINECONE_INDEX_NAME="codenote-embeddings"

# Embeddings Configuration
EMBEDDINGS_PROVIDER="openai" # openai, cohere, or gemini
EMBEDDINGS_MODEL="text-embedding-3-small"
```

### Pinecone Setup

1. Create a Pinecone account at [pinecone.io](https://pinecone.io)
2. Create a new index with:
   - Dimensions: 1536 (for OpenAI) or 1024 (for Cohere) or 768 (for Gemini)
   - Metric: cosine
   - Pod type: starter (free tier)
3. Copy your API key and environment

## 🛠️ Usage

### Initialize LangChain

```typescript
import { initializeLangChain } from '@/lib/langchain/init';

// Initialize with database data
const result = await initializeLangChain();
console.log(`Loaded ${result.notesCount} notes and ${result.problemsCount} problems`);
```

### Use the Agent

```typescript
import { CodeNoteAgent } from '@/lib/langchain/agent';

const agent = new CodeNoteAgent();

// Chat with the agent
const response = await agent.chat("Explain binary search to me");
console.log(response);

// Get conversation history
const history = await agent.getConversationHistory();
```

### Use RAG Service

```typescript
import { RAGService } from '@/lib/langchain/rag';

const ragService = new RAGService();
await ragService.initialize();

// Search for content
const results = await ragService.search("dynamic programming", 5);

// RAG query with context
const response = await ragService.query("What is the time complexity of quicksort?");
```

### Use AI Services

```typescript
import { AIServices } from '@/lib/langchain/services';

const aiServices = new AIServices();

// Generate notes
const note = await aiServices.generateNote({
  title: "Binary Search",
  content: "Binary search is a divide and conquer algorithm...",
  topic: "Searching",
  difficulty: "EASY",
  style: "detailed"
});

// Analyze code
const analysis = await aiServices.analyzeCode({
  code: "function binarySearch(arr, target) { ... }",
  language: "javascript",
  focus: "complexity"
});

// ELI5 explanation
const explanation = await aiServices.explainELI5({
  concept: "Binary Search",
  context: "Searching in sorted arrays",
  level: "beginner"
});
```

## 🌐 API Endpoints

### POST /api/langchain

**Chat with Agent:**
```json
{
  "action": "chat",
  "message": "Explain binary search"
}
```

**Search Content:**
```json
{
  "action": "search",
  "query": "dynamic programming",
  "type": "all",
  "k": 5
}
```

**Generate Note:**
```json
{
  "action": "generate_note",
  "title": "Binary Search",
  "content": "Binary search is...",
  "topic": "Searching",
  "difficulty": "EASY",
  "style": "detailed"
}
```

**Analyze Code:**
```json
{
  "action": "analyze_code",
  "code": "function binarySearch(arr, target) { ... }",
  "language": "javascript",
  "focus": "complexity"
}
```

**ELI5 Explanation:**
```json
{
  "action": "explain_eli5",
  "concept": "Binary Search",
  "context": "Searching in sorted arrays",
  "level": "beginner"
}
```

**Multimodal Processing:**
```json
{
  "action": "multimodal",
  "text": "Analyze this diagram",
  "image": "base64-encoded-image"
}
```

### GET /api/langchain

**Get Conversation History:**
```
GET /api/langchain?action=history
```

**Get Available Tools:**
```
GET /api/langchain?action=tools
```

### DELETE /api/langchain

**Clear Conversation History:**
```
DELETE /api/langchain
```

## 🔧 Tools Available

The agent has access to these tools:

1. **search_notes** - Search for notes by topic, difficulty, or content
2. **search_problems** - Search for coding problems
3. **generate_note** - Generate comprehensive notes from content
4. **analyze_code** - Analyze code for complexity and optimization
5. **explain_eli5** - Explain complex concepts in simple terms
6. **analyze_image** - Analyze images containing code or diagrams
7. **analyze_diagram** - Analyze visual representations of algorithms
8. **get_recommendations** - Get personalized learning recommendations
9. **find_similar_problems** - Find problems similar to a given problem

## 🧪 Testing

```typescript
import { getLangChainInitializer } from '@/lib/langchain/init';

const initializer = getLangChainInitializer();
const testResults = await initializer.testRAG();
console.log(testResults);
```

## 🔒 Security

- All API routes are protected with NextAuth authentication
- Input validation using Zod schemas
- Rate limiting (implement in production)
- API key management through environment variables

## 🚀 Production Considerations

1. **Vector Database**: Consider using pgvector for production instead of Pinecone
2. **Caching**: Implement Redis for caching embeddings and search results
3. **Rate Limiting**: Add rate limiting to API endpoints
4. **Monitoring**: Add logging and monitoring for AI service usage
5. **Cost Optimization**: Monitor API usage and implement cost controls
6. **Backup**: Regular backups of vector database and conversation history

## 📚 Additional Resources

- [LangChain.js Documentation](https://js.langchain.com/)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Cohere API Documentation](https://docs.cohere.com/)
- [Google AI Documentation](https://ai.google.dev/) 