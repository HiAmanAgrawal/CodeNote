# Authentication System Setup Guide

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/codenote"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
# Google OAuth (get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (get from https://github.com/settings/developers)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Email Configuration (SMTP)
# For Gmail, use App Password: https://support.google.com/accounts/answer/185833
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# API Keys (for external services)
API_KEY="your-api-key-for-external-services"

# LangChain AI Providers
OPENAI_API_KEY="your-openai-api-key"
COHERE_API_KEY="your-cohere-api-key"
GOOGLE_API_KEY="your-google-api-key"

# Vector Database (Pinecone)
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_ENVIRONMENT="your-pinecone-environment"
PINECONE_INDEX_NAME="codenote-embeddings"
```

## 2. Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `codenote`
3. Update DATABASE_URL in `.env.local`

### Option B: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings > Database
4. Update DATABASE_URL in `.env.local`

### Push Schema
```bash
npx prisma db push --schema=./db/schema.prisma
```

## 3. OAuth Provider Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### GitHub OAuth
1. Go to [GitHub Settings > Developers > OAuth Apps](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to `.env.local`

## 4. Email Setup (Gmail Example)

### Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Step Verification

### Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Generate password for "Mail"
3. Use this password as `SMTP_PASS` in `.env.local`

## 5. Testing the Authentication System

### Start the Development Server
```bash
npm run dev
```

### Test Endpoints

#### 1. Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### 2. Email Verification
```bash
# Check your email for verification link
# Or use the token from the database
curl -X GET "http://localhost:3000/api/auth/verify?token=YOUR_TOKEN"
```

#### 3. Password Reset Request
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

#### 4. Password Reset
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "password": "NewSecurePass123!"
  }'
```

#### 5. NextAuth.js Endpoints
- Sign in: `http://localhost:3000/api/auth/signin`
- Sign out: `http://localhost:3000/api/auth/signout`
- Session: `http://localhost:3000/api/auth/session`

## 6. Security Features

### Rate Limiting
- General routes: 100 requests per 15 minutes
- Auth routes: 5 requests per 15 minutes

### CSRF Protection
- All POST/PUT/DELETE/PATCH requests require `x-csrf-token` header
- Token available in `next-auth.csrf-token` cookie

### Session Management
- JWT strategy with 30-day expiry
- Automatic session timeout handling
- Secure cookie settings

### Role-Based Access Control
```typescript
// In API routes
import { requireAuth, requireAdmin } from '@/lib/auth';

// Require any authenticated user
export const GET = requireAuth(async (req) => {
  // Your protected route logic
});

// Require admin role
export const POST = requireAdmin(async (req) => {
  // Your admin-only route logic
});
```

## 7. Production Deployment

### Environment Variables
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Set `NEXTAUTH_URL` to your production domain
- Use production SMTP service (SendGrid, AWS SES, etc.)
- Use production database (Supabase, AWS RDS, etc.)

### Security Headers
- HTTPS only in production
- Secure cookie settings
- Content Security Policy
- Rate limiting with Redis

### Monitoring
- Log authentication events
- Monitor failed login attempts
- Set up alerts for suspicious activity

## 8. Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is running
   - Verify credentials

2. **OAuth Provider Errors**
   - Check redirect URIs match exactly
   - Verify client ID/secret
   - Ensure OAuth app is properly configured

3. **Email Not Sending**
   - Check SMTP credentials
   - Verify 2FA is enabled for Gmail
   - Check spam folder

4. **CSRF Token Errors**
   - Ensure `x-csrf-token` header is set
   - Check cookie settings
   - Verify token matches session

### Debug Mode
Add to `.env.local`:
```bash
DEBUG="next-auth:*"
```

This will show detailed NextAuth.js logs in the console. 