import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/email';
import { checkAuthRateLimit } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }
    
    // Verify the token
    await verifyEmailToken(token);
    
    // Redirect to success page or return success response
    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Email verification error:', error);
    
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
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }
    
    // Verify the token
    await verifyEmailToken(token);
    
    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Email verification error:', error);
    
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