import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { securityUtils } from '@/lib/middleware';
import { sendPasswordResetEmail, verifyPasswordResetToken } from '@/lib/email';
import { z } from 'zod';
import { checkAuthRateLimit } from '@/lib/rateLimit';

// Validation schemas
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
});

// Request password reset
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
    
    // Check if this is a reset request or password reset
    if (body.token) {
      // This is a password reset with token
      try {
        const validatedData = resetPasswordSchema.parse(body);
        
        // Verify the reset token
        const tokenVerification = await verifyPasswordResetToken(validatedData.token);
        
        if (!tokenVerification.success) {
          return NextResponse.json(
            { error: 'Invalid or expired reset token' },
            { status: 400 }
          );
        }
        
        // Hash the new password
        const hashedPassword = await securityUtils.hashPassword(validatedData.password);
        
        // Update user password
        await prisma.user.update({
          where: { email: tokenVerification.email },
          data: { password: hashedPassword },
        });
        
        // Delete the reset token
        await prisma.verificationToken.delete({
          where: { token: validatedData.token },
        });
        
        return NextResponse.json(
          { message: 'Password reset successfully' },
          { status: 200 }
        );
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return NextResponse.json(
            { error: 'Validation failed', details: validationError.errors },
            { status: 400 }
          );
        }
        throw validationError;
      }
      
    } else {
      // This is a password reset request
      try {
        const validatedData = requestResetSchema.parse(body);
        
        const email = validatedData.email.toLowerCase().trim();
        
        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email },
        });
        
        if (!user) {
          // Don't reveal if user exists or not for security
          return NextResponse.json(
            { message: 'If an account with this email exists, a password reset link has been sent' },
            { status: 200 }
          );
        }
        
        // Send password reset email
        try {
          const result = await sendPasswordResetEmail(email);
          
          if (result.skipped) {
            // Email was skipped due to SMTP configuration
            return NextResponse.json(
              { 
                message: 'Password reset token generated. Check server logs for the token.',
                warning: 'SMTP not configured - email not sent'
              },
              { status: 200 }
            );
          }
          
          return NextResponse.json(
            { message: 'If an account with this email exists, a password reset link has been sent' },
            { status: 200 }
          );
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
          
          // If it's an SMTP configuration issue, return success with warning
          if (emailError instanceof Error && emailError.message.includes('SMTP')) {
            return NextResponse.json(
              { 
                message: 'Password reset token generated. Check server logs for the token.',
                warning: 'SMTP configuration issue - email not sent'
              },
              { status: 200 }
            );
          }
          
          return NextResponse.json(
            { error: 'Failed to send password reset email' },
            { status: 500 }
          );
        }
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          return NextResponse.json(
            { error: 'Validation failed', details: validationError.errors },
            { status: 400 }
          );
        }
        throw validationError;
      }
    }
    
  } catch (error) {
    console.error('Password reset error:', error);
    
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

// Verify reset token (for frontend validation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }
    
    // Verify the token
    const tokenVerification = await verifyPasswordResetToken(token);
    
    if (!tokenVerification.success) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Token is valid' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 