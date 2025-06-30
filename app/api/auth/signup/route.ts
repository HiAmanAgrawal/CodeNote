import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityUtils } from '@/lib/middleware';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';
import { checkAuthRateLimit } from '@/lib/rateLimit';
import { createTestSession } from '@/lib/test-auth';
import { Role } from '@prisma/client';

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
  role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
});

export async function POST(request: NextRequest) {
  const isTestMode = request.headers.get('X-Test-Mode') === 'true';
  
  // Rate limit check (skip for test mode)
  if (!isTestMode) {
    const clientId = request.headers.get('x-forwarded-for') || request.ip || request.headers.get('user-agent') || 'unknown';
    const rate = await checkAuthRateLimit(clientId);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: rate.retryAfter }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rate.limit.toString(),
            'X-RateLimit-Remaining': rate.remaining.toString(),
            'X-RateLimit-Reset': new Date(rate.reset).toISOString(),
            'Retry-After': rate.retryAfter.toString(),
          }
        }
      );
    }
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Sanitize inputs
    const sanitizedData = {
      name: securityUtils.sanitizeInput(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      password: validatedData.password,
      role: validatedData.role as Role,
    };
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await securityUtils.hashPassword(sanitizedData.password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        password: hashedPassword,
        role: sanitizedData.role,
        isVerified: isTestMode ? true : false, // Auto-verify test users
        isActive: true,
      },
    });
    
    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        theme: 'light',
        language: 'en',
        notifications: true,
        emailNotifications: true,
      },
    });
    
    // Send verification email (skip for test mode)
    if (!isTestMode) {
      try {
        await sendVerificationEmail(sanitizedData.email);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail the signup if email fails
      }
    }
    
    // Return success response (without password)
    const { password, ...userWithoutPassword } = user;
    
    // Create session token for test mode
    let sessionToken = null;
    if (isTestMode) {
      sessionToken = await createTestSession({
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
      });
    }
    
    return NextResponse.json(
      { 
        message: isTestMode ? 'Test user created successfully' : 'User created successfully. Please check your email to verify your account.',
        user: userWithoutPassword,
        sessionToken,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 