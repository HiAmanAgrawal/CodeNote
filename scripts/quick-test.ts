#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickTest() {
  console.log('🧪 Running quick tests...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Test 2: Check if test data exists
    console.log('2️⃣ Checking test data...');
    
    const userCount = await prisma.user.count();
    const problemCount = await prisma.problem.count();
    const noteCount = await prisma.note.count();
    const contestCount = await prisma.contest.count();

    console.log(`   Users: ${userCount}`);
    console.log(`   Problems: ${problemCount}`);
    console.log(`   Notes: ${noteCount}`);
    console.log(`   Contests: ${contestCount}`);

    if (userCount > 0 && problemCount > 0) {
      console.log('✅ Test data found\n');
    } else {
      console.log('⚠️  No test data found. Run: npx tsx scripts/test-setup.ts\n');
    }

    // Test 3: Check environment variables
    console.log('3️⃣ Checking environment variables...');
    
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    const optionalVars = [
      'GEMINI_API_KEY',
      'VECTOR_DATABASE_URL',
      'WEBHOOK_SECRET'
    ];

    console.log('   Required variables:');
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        console.log(`   ✅ ${varName}: Set`);
      } else {
        console.log(`   ❌ ${varName}: Missing`);
      }
    });

    console.log('\n   Optional variables:');
    optionalVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        console.log(`   ✅ ${varName}: Set`);
      } else {
        console.log(`   ⚠️  ${varName}: Not set (optional)`);
      }
    });

    console.log('\n4️⃣ Testing API endpoints...');
    
    // Test if server is running
    try {
      const response = await fetch('http://localhost:3001/api/trpc/notes.getAll');
      if (response.ok) {
        console.log('✅ API server is running');
      } else {
        console.log('⚠️  API server responded with error');
      }
    } catch (error) {
      console.log('❌ API server not accessible. Make sure to run: npm run dev');
    }

    console.log('\n🎉 Quick test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. If no test data: npx tsx scripts/test-setup.ts');
    console.log('2. Start server: npm run dev');
    console.log('3. Visit: http://localhost:3001');
    console.log('4. Login with: test@example.com / test123');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest(); 