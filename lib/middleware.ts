import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from './auth';
import { redis } from './redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds (for testing)
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window
const AUTH_RATE_LIMIT_MAX_REQUESTS = 3; // 3 auth requests per window (for testing)

const generalLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl_general',
  points: RATE_LIMIT_MAX_REQUESTS,
  duration: RATE_LIMIT_WINDOW,
});

const authLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl_auth',
  points: AUTH_RATE_LIMIT_MAX_REQUESTS,
  duration: RATE_LIMIT_WINDOW,
});

// CSRF token validation
function validateCSRFToken(req: NextRequest): boolean {
  const csrfToken = req.headers.get('x-csrf-token');
  const sessionToken = req.cookies.get('next-auth.csrf-token')?.value;
  
  if (!csrfToken || !sessionToken) {
    return false;
  }
  
  // In production, use a more secure CSRF validation
  return csrfToken === sessionToken;
}

// Get client identifier for rate limiting
function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  
  return response;
}

// Session timeout check
async function checkSessionTimeout(req: NextRequest): Promise<boolean> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return true; // No session, allow request
    }
    
    const tokenExp = token.exp as number;
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (tokenExp && now > tokenExp) {
      return false; // Session expired
    }
    
    return true; // Session valid
  } catch (error) {
    console.error('Error checking session timeout:', error);
    return false; // Error occurred, deny access
  }
}

// Main middleware function
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  console.log(`[Middleware] Called for path: ${pathname}, method: ${req.method}`);
  
  // Skip middleware for static files only
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    console.log(`[Middleware] Skipping static file: ${pathname}`);
    return NextResponse.next();
  }
  
  // CSRF protection for state-changing operations (skip for auth routes)
  if (
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE' ||
    req.method === 'PATCH'
  ) {
    if (!pathname.startsWith('/api/auth') && !validateCSRFToken(req)) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF token validation failed' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  // Session timeout check for protected routes (skip for auth routes)
  if (pathname.startsWith('/dashboard') || (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth'))) {
    const sessionValid = await checkSessionTimeout(req);
    if (!sessionValid) {
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Session expired' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        const loginUrl = new URL('/auth/signin', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  
  // Add security headers
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

// Utility functions for use in API routes
export const securityUtils = {
  // Validate API key for external services
  validateAPIKey: (req: NextRequest, keyName: string = 'x-api-key'): boolean => {
    const apiKey = req.headers.get(keyName);
    const expectedKey = process.env.API_KEY;
    return apiKey === expectedKey;
  },
  
  // Sanitize input
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },
  
  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  },
  
  // Hash password
  hashPassword: async (password: string): Promise<string> => {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  },
  
  // Compare password
  comparePassword: async (password: string, hash: string): Promise<boolean> => {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, hash);
  },
}; 