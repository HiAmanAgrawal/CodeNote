#!/usr/bin/env tsx

import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  response?: any;
}

async function runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
  try {
    console.log(`🧪 Running test: ${name}`);
    const result = await testFn();
    console.log(`✅ ${name} - PASSED`);
    return { name, success: true, response: result };
  } catch (error) {
    console.log(`❌ ${name} - FAILED: ${error instanceof Error ? error.message : error}`);
    return { name, success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function checkServerHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session`);
    return response.status;
  } catch (error) {
    throw new Error(`Server not running at ${BASE_URL}. Please start the development server with 'npm run dev'`);
  }
}

async function testSignup() {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'SecurePass123!',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Signup failed: ${error.error || response.statusText}`);
  }

  return await response.json();
}

async function testInvalidSignup() {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test',
      email: 'invalid-email',
      password: 'weak',
    }),
  });

  if (response.ok) {
    throw new Error('Invalid signup should have failed');
  }

  const error = await response.json();
  if (!error.error) {
    throw new Error('Error response should contain error message');
  }

  return error;
}

async function testDuplicateSignup() {
  const email = `duplicate-${Date.now()}@example.com`;
  
  // First signup
  await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User 1',
      email,
      password: 'SecurePass123!',
    }),
  });

  // Second signup with same email
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User 2',
      email,
      password: 'SecurePass123!',
    }),
  });

  if (response.ok) {
    throw new Error('Duplicate signup should have failed');
  }

  const error = await response.json();
  if (!error.error || !error.error.includes('already exists')) {
    throw new Error('Should return duplicate user error');
  }

  return error;
}

async function testPasswordResetRequest() {
  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'nonexistent@example.com',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Password reset request failed: ${error.error || response.statusText}`);
  }

  return await response.json();
}

async function testInvalidPasswordReset() {
  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: 'invalid-token',
      password: 'NewPass123!',
    }),
  });

  if (response.ok) {
    throw new Error('Invalid password reset should have failed');
  }

  const error = await response.json();
  if (!error.error) {
    throw new Error('Error response should contain error message');
  }

  return error;
}

async function testNextAuthEndpoints() {
  // Test session endpoint
  const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`);
  if (!sessionResponse.ok) {
    throw new Error(`Session endpoint failed: ${sessionResponse.statusText}`);
  }

  // Test providers endpoint
  const providersResponse = await fetch(`${BASE_URL}/api/auth/providers`);
  if (!providersResponse.ok) {
    throw new Error(`Providers endpoint failed: ${providersResponse.statusText}`);
  }

  return {
    session: await sessionResponse.json(),
    providers: await providersResponse.json(),
  };
}

async function testRateLimiting() {
  const requests = Array.from({ length: 6 }, (_, i) => 
    fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Rate Limit Test ${i}`,
        email: `ratelimit-${i}-${Date.now()}@example.com`,
        password: 'SecurePass123!',
      }),
    })
  );

  const responses = await Promise.all(requests);
  const lastResponse = responses[responses.length - 1];
  
  // The 6th request should be rate limited (limit is 5 for auth routes)
  if (lastResponse.status !== 429) {
    throw new Error('Rate limiting not working - should return 429');
  }

  return { status: lastResponse.status };
}

async function main() {
  console.log('🚀 Starting Authentication System Tests\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL is required. Please create a .env.local file with your database connection string.');
    console.log('💡 Run: npx tsx scripts/test-env.ts to create a template .env.local file');
    process.exit(1);
  }

  const tests = [
    { name: 'Server Health Check', test: checkServerHealth },
    { name: 'Valid Signup', test: testSignup },
    { name: 'Invalid Signup Validation', test: testInvalidSignup },
    { name: 'Duplicate Signup Prevention', test: testDuplicateSignup },
    { name: 'Password Reset Request', test: testPasswordResetRequest },
    { name: 'Invalid Password Reset', test: testInvalidPasswordReset },
    { name: 'NextAuth Endpoints', test: testNextAuthEndpoints },
    { name: 'Rate Limiting', test: testRateLimiting },
  ];

  const results: TestResult[] = [];

  for (const { name, test } of tests) {
    const result = await runTest(name, test);
    results.push(result);
    console.log(''); // Add spacing between tests
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
    
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Make sure the development server is running: npm run dev');
    console.log('   2. Check your DATABASE_URL in .env.local');
    console.log('   3. Ensure your database is running and accessible');
    console.log('   4. Run: npx prisma db push --schema=./db/schema.prisma');
    
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 