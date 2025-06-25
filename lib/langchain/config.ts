import { ChatOpenAI } from '@langchain/openai';
import { ChatCohere } from '@langchain/cohere';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { CohereEmbeddings } from '@langchain/cohere';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export interface LangChainConfig {
  openai: {
    apiKey: string;
    model: string;
    temperature: number;
  };
  cohere: {
    apiKey: string;
    model: string;
  };
  gemini: {
    apiKey: string;
    model: string;
    temperature: number;
  };
  pinecone: {
    apiKey: string;
    indexName: string;
  };
  embeddings: {
    provider: 'openai' | 'cohere' | 'gemini';
    model: string;
  };
}

export const langChainConfig: LangChainConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.7,
  },
  cohere: {
    apiKey: process.env.COHERE_API_KEY || '',
    model: process.env.COHERE_MODEL || 'command',
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-pro',
    temperature: 0.7,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || '',
    indexName: process.env.PINECONE_INDEX_NAME || 'codenote-embeddings',
  },
  embeddings: {
    provider: (process.env.EMBEDDINGS_PROVIDER as 'openai' | 'cohere' | 'gemini') || 'openai',
    model: process.env.EMBEDDINGS_MODEL || 'text-embedding-3-small',
  },
};

// Initialize LLM instances
export const createLLM = (provider: 'openai' | 'cohere' | 'gemini' = 'openai') => {
  if (provider === 'openai' && langChainConfig.openai.apiKey && langChainConfig.openai.apiKey !== 'your-key') {
    return new ChatOpenAI({
      openAIApiKey: langChainConfig.openai.apiKey,
      modelName: langChainConfig.openai.model,
      temperature: langChainConfig.openai.temperature,
    });
  }
  if (provider === 'cohere' && langChainConfig.cohere.apiKey && langChainConfig.cohere.apiKey !== 'your-key') {
    return new ChatCohere({
      apiKey: langChainConfig.cohere.apiKey,
      model: langChainConfig.cohere.model,
    });
  }
  if (provider === 'gemini' && langChainConfig.gemini.apiKey && langChainConfig.gemini.apiKey !== 'your-key') {
    return new ChatGoogleGenerativeAI({
      apiKey: langChainConfig.gemini.apiKey,
      model: langChainConfig.gemini.model,
      temperature: langChainConfig.gemini.temperature,
    });
  }
  // Fallback: try any available provider
  if (langChainConfig.openai.apiKey && langChainConfig.openai.apiKey !== 'your-key') {
    console.warn('[LangChain] Using OpenAI LLM as fallback.');
    return new ChatOpenAI({
      openAIApiKey: langChainConfig.openai.apiKey,
      modelName: langChainConfig.openai.model,
      temperature: langChainConfig.openai.temperature,
    });
  }
  if (langChainConfig.cohere.apiKey && langChainConfig.cohere.apiKey !== 'your-key') {
    console.warn('[LangChain] Using Cohere LLM as fallback.');
    return new ChatCohere({
      apiKey: langChainConfig.cohere.apiKey,
      model: langChainConfig.cohere.model,
    });
  }
  if (langChainConfig.gemini.apiKey && langChainConfig.gemini.apiKey !== 'your-key') {
    console.warn('[LangChain] Using Gemini LLM as fallback.');
    return new ChatGoogleGenerativeAI({
      apiKey: langChainConfig.gemini.apiKey,
      model: langChainConfig.gemini.model,
      temperature: langChainConfig.gemini.temperature,
    });
  }
  // If no valid API key, return a mock LLM
  console.warn('[LangChain] No valid LLM provider API key found. Using mock LLM.');
  return {
    invoke: async (): Promise<{ content: string; type: string }> => ({ 
      content: '[MOCK LLM] No valid LLM API key configured.', 
      type: 'ai' 
    }),
  };
};

// Initialize embeddings
export const createEmbeddings = () => {
  const provider = langChainConfig.embeddings.provider;
  if (provider === 'openai' && langChainConfig.openai.apiKey && langChainConfig.openai.apiKey !== 'your-key') {
    return new OpenAIEmbeddings({
      openAIApiKey: langChainConfig.openai.apiKey,
      modelName: langChainConfig.embeddings.model,
    });
  }
  if (provider === 'cohere' && langChainConfig.cohere.apiKey && langChainConfig.cohere.apiKey !== 'your-key') {
    return new CohereEmbeddings({
      apiKey: langChainConfig.cohere.apiKey,
      model: langChainConfig.embeddings.model,
    });
  }
  if (provider === 'gemini' && langChainConfig.gemini.apiKey && langChainConfig.gemini.apiKey !== 'your-key') {
    return new GoogleGenerativeAIEmbeddings({
      apiKey: langChainConfig.gemini.apiKey,
      model: langChainConfig.embeddings.model,
    });
  }
  // Fallback: try any available provider
  if (langChainConfig.openai.apiKey && langChainConfig.openai.apiKey !== 'your-key') {
    console.warn('[LangChain] Using OpenAI embeddings as fallback.');
    return new OpenAIEmbeddings({
      openAIApiKey: langChainConfig.openai.apiKey,
      modelName: langChainConfig.embeddings.model,
    });
  }
  if (langChainConfig.cohere.apiKey && langChainConfig.cohere.apiKey !== 'your-key') {
    console.warn('[LangChain] Using Cohere embeddings as fallback.');
    return new CohereEmbeddings({
      apiKey: langChainConfig.cohere.apiKey,
      model: langChainConfig.embeddings.model,
    });
  }
  if (langChainConfig.gemini.apiKey && langChainConfig.gemini.apiKey !== 'your-key') {
    console.warn('[LangChain] Using Gemini embeddings as fallback.');
    return new GoogleGenerativeAIEmbeddings({
      apiKey: langChainConfig.gemini.apiKey,
      model: langChainConfig.embeddings.model,
    });
  }
  // If no valid API key, use a mock embedding
  console.warn('[LangChain] No valid embedding provider API key found. Using mock embedding.');
  return {
    embedQuery: async (input: string) => Array(1536).fill(0),
    embedDocuments: async (inputs: string[]) => inputs.map(() => Array(1536).fill(0)),
  };
};

// Initialize Pinecone
export const createPineconeClient = () => {
  return new Pinecone({
    apiKey: langChainConfig.pinecone.apiKey,
  });
};

// Initialize vector store
export const createVectorStore = async () => {
  const pineconeApiKey = langChainConfig.pinecone.apiKey;
  if (!pineconeApiKey || pineconeApiKey === 'your-key') {
    console.warn('[LangChain] Pinecone API key missing or invalid. Using in-memory vector store for RAG.');
    const embeddings = createEmbeddings();
    return new MemoryVectorStore(embeddings);
  }
  const pinecone = createPineconeClient();
  const embeddings = createEmbeddings();
  const index = pinecone.index(langChainConfig.pinecone.indexName);
  return new PineconeStore(embeddings, {
    pineconeIndex: index,
  });
}; 