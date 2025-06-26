import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './db';
import { sign } from 'jsonwebtoken';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  sessionToken?: string;
}

export async function getTestUser(request: NextRequest): Promise<TestUser | null> {
  // First try to get a real session
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
      };
    }
  }

  // If no session, check for test headers
  const testUserId = request.headers.get('X-Test-User-Id');
  const testUserEmail = request.headers.get('X-Test-User-Email');
  const testSessionToken = request.headers.get('X-Test-Session-Token');

  if (testUserId && testUserEmail) {
    // Verify the test user exists
    const user = await prisma.user.findUnique({
      where: { id: testUserId },
    });

    if (user && user.email === testUserEmail) {
      return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        sessionToken: testSessionToken || undefined,
      };
    }
  }

  return null;
}

export async function createTestSession(user: TestUser): Promise<string> {
  // Create a JWT token for testing
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  const token = sign(payload, process.env.NEXTAUTH_SECRET || 'test-secret');
  return token;
}

export async function createTestUserWithSession(
  emailPrefix: string = 'test',
  role: 'ADMIN' | 'USER' = 'USER'
): Promise<{ user: TestUser; sessionToken: string }> {
  const email = `${emailPrefix}-${Date.now()}@example.com`;
  
  // Create user in database
  const user = await prisma.user.create({
    data: {
      email,
      name: `Test ${emailPrefix} User`,
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8Kj1G', // test123
      role: role as any,
      isVerified: true,
      isActive: true,
    },
  });

  // Create session token
  const sessionToken = await createTestSession({
    id: user.id,
    email: user.email,
    name: user.name || '',
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role,
    },
    sessionToken,
  };
}

export async function cleanupTestUser(userId: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.warn('Failed to cleanup test user:', error);
  }
} 