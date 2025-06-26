import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityUtils } from '@/lib/middleware';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';
import { checkAuthRateLimit } from '@/lib/rateLimit';

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
});

export async function POST(request: NextRequest) {
  // Rate limit check
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

  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Sanitize inputs
    const sanitizedData = {
      name: securityUtils.sanitizeInput(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      password: validatedData.password,
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
        role: 'USER',
        isVerified: false,
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
    
    // Send verification email
    try {
      await sendVerificationEmail(sanitizedData.email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails
    }
    
    // Return success response (without password)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to verify your account.',
        user: userWithoutPassword 
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