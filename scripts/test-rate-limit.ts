import dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function testRateLimit() {
  console.log('🧪 Testing Rate Limiting...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  
  // Valid payloads for each endpoint
  const endpoints = [
    {
      path: '/api/auth/signup',
      method: 'POST',
      getBody: (i: number) => ({
        name: `Test User ${i}`,
        email: `testuser${i}_${Date.now()}@example.com`,
        password: 'TestPassword1!'
      })
    },
    {
      path: '/api/auth/reset-password',
      method: 'POST',
      getBody: (i: number) => ({
        email: `testuser${i}_${Date.now()}@example.com`
      })
    },
    {
      path: '/api/auth/verify',
      method: 'POST',
      getBody: (i: number) => ({
        token: 'invalid-token-for-test'
      })
    }
  ];

  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing endpoint: ${endpoint.path}`);
    
    // Send 10 requests (should trigger rate limit after 3 for auth routes)
    for (let i = 1; i <= 10; i++) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(endpoint.getBody(i))
        });

        const status = response.status;
        const headers = Object.fromEntries(response.headers.entries());
        
        console.log(`  Request ${i}: ${status} - ${response.statusText}`);
        
        if (status === 429) {
          console.log(`  ✅ Rate limit triggered! Headers:`, {
            'x-ratelimit-limit': headers['x-ratelimit-limit'],
            'x-ratelimit-remaining': headers['x-ratelimit-remaining'],
            'x-ratelimit-reset': headers['x-ratelimit-reset'],
            'retry-after': headers['retry-after']
          });
        } else if (status === 400 || status === 422) {
          console.log(`  ⚠️  Expected validation error (${status})`);
        } else if (status === 200 || status === 201) {
          console.log(`  ✅ Request succeeded (${status})`);
        } else {
          console.log(`  ❌ Unexpected status: ${status}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`  ❌ Request ${i} failed:`, error);
      }
    }
  }
}

async function testRedisConnection() {
  console.log('\n🔍 Testing Redis Connection...');
  
  try {
    const { redis } = await import('../lib/redis');
    
    // Test basic Redis operations
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    await redis.del('test-key');
    
    if (value === 'test-value') {
      console.log('  ✅ Redis connection working');
    } else {
      console.log('  ❌ Redis connection failed');
    }
  } catch (error) {
    console.log('  ❌ Redis connection error:', error);
  }
}

async function main() {
  console.log('🚀 Starting Rate Limit Tests...\n');
  
  await testRedisConnection();
  await testRateLimit();
  
  console.log('\n✅ Rate limit testing completed!');
}

main().catch(console.error); 