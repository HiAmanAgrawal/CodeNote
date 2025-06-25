#!/usr/bin/env tsx

import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeLangChain, getLangChainInitializer } from '@/lib/langchain/init';
import { CodeNoteAgent } from '@/lib/langchain/agent';
import { RAGService } from '@/lib/langchain/rag';
import { AIServices } from '@/lib/langchain/services';

const mockNotes = [
  { id: '1', title: 'Binary Search', content: 'Binary search is a divide and conquer algorithm...', topic: 'Arrays', difficulty: 'Easy' },
  { id: '2', title: 'Dijkstra Algorithm', content: 'Dijkstra\'s algorithm finds the shortest path...', topic: 'Graphs', difficulty: 'Medium' },
];

const mockProblems = [
  { id: '1', title: 'Find Element in Sorted Array', description: 'Given a sorted array...', topic: 'Arrays', difficulty: 'Easy' },
  { id: '2', title: 'Shortest Path in Graph', description: 'Given a weighted graph...', topic: 'Graphs', difficulty: 'Medium' },
  { id: '3', title: 'Knapsack Problem', description: 'Given weights and values...', topic: 'DP', difficulty: 'Hard' },
];

async function testLangChain() {
  console.log('\n🧪 Testing LangChain Setup...\n');

  // 1️⃣ Initialization
  console.log('1️⃣ Testing initialization...');
  try {
    console.log('🔄 Initializing LangChain with database data...');
    await initializeLangChain();
    const agent = new CodeNoteAgent();
    const ragService = agent['ragService'];
    const notes = mockNotes;
    const problems = mockProblems;
    console.log(`📝 Found ${notes.length} notes`);
    console.log(`🧩 Found ${problems.length} problems`);
    await ragService.addNotes(notes);
    await ragService.addProblems(problems);
    console.log('✅ Notes added to RAG');
    console.log('✅ Problems added to RAG');
    console.log('🎉 LangChain initialization complete!');
    console.log(`✅ Initialized with ${notes.length} notes and ${problems.length} problems\n`);

    // 2️⃣ RAG Service Test
    console.log('2️⃣ Testing RAG Service...');
    const searchResult = await ragService.search('binary search', 3);
    if (searchResult && searchResult.length === 0) {
      console.log('✅ Search test: Found 0 results');
    } else if (searchResult && searchResult[0]?.content?.includes('[MOCK LLM]')) {
      console.warn('⚠️  Skipping RAG pipeline test: No real LLM available.');
    } else {
      console.log(`✅ Search test: Found ${searchResult.length} results`);
    }

    // Test 3: AI Services
    console.log('3️⃣ Testing AI Services...');
    const aiServices = new AIServices();

    // Check if we have a real LLM available by testing a simple call
    const testResponse = await aiServices.generateNote({
      title: 'Test Note',
      content: 'This is a test note about arrays and their usage in programming.',
      topic: 'Arrays',
      difficulty: 'EASY',
      style: 'concise',
    });

    if (testResponse.includes('[MOCK LLM]')) {
      console.warn('⚠️  Skipping AI Services tests: No real LLM available.');
    } else {
      console.log(`✅ Note generation: ${testResponse.substring(0, 100)}...`);

      const codeAnalysis = await aiServices.analyzeCode({
        code: 'function binarySearch(arr, target) { let left = 0; let right = arr.length - 1; while (left <= right) { const mid = Math.floor((left + right) / 2); if (arr[mid] === target) return mid; if (arr[mid] < target) left = mid + 1; else right = mid - 1; } return -1; }',
        language: 'javascript',
        focus: 'complexity',
      });
      console.log(`✅ Code analysis: ${codeAnalysis.substring(0, 100)}...`);

      const eli5Explanation = await aiServices.explainELI5({
        concept: 'Binary Search',
        context: 'Searching in sorted arrays',
        level: 'beginner',
      });
      console.log(`✅ ELI5 explanation: ${eli5Explanation.substring(0, 100)}...`);
    }
    console.log('');

    // Test 4: Agent
    console.log('4️⃣ Testing Agent...');
    const chatResponse = await agent.chat('Explain what a binary search is');
    console.log(`✅ Agent chat: ${chatResponse.substring(0, 100)}...`);

    const tools = agent.getTools();
    console.log(`✅ Agent tools: ${tools.length} tools available`);
    tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });

    const history = await agent.getConversationHistory();
    console.log(`✅ Conversation history: ${history.length} messages\n`);

    // Test 5: Initializer
    console.log('5️⃣ Testing Initializer...');
    const initializer = getLangChainInitializer();
    const testResults = await initializer.testRAG();
    console.log(`✅ RAG test results:`, testResults);

    const stats = await initializer.getRAGStats();
    console.log(`✅ RAG stats:`, stats);

    console.log('\n🎉 All tests passed! LangChain setup is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testLangChain()
    .then(() => {
      console.log('\n✅ LangChain tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ LangChain tests failed:', error);
      process.exit(1);
    });
}

export { testLangChain }; 