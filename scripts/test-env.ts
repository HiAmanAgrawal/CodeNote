#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Create minimal .env.local for testing
const envContent = `# Test Environment Variables
DATABASE_URL="postgresql://postgres:password@localhost:5432/codento"
NEXTAUTH_SECRET="test-secret-key-for-development-only"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional for testing)
GOOGLE_CLIENT_ID="test-google-client-id"
GOOGLE_CLIENT_SECRET="test-google-client-secret"
GITHUB_ID="test-github-client-id"
GITHUB_SECRET="test-github-client-secret"

# Email Configuration (optional for testing)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="test@example.com"
SMTP_PASS="test-password"

# API Keys (optional for testing)
API_KEY="test-api-key"

# LangChain AI Providers (optional for testing)
OPENAI_API_KEY="test-openai-key"
COHERE_API_KEY="test-cohere-key"
GOOGLE_API_KEY="test-google-key"

# Vector Database (optional for testing)
PINECONE_API_KEY="test-pinecone-key"
PINECONE_ENVIRONMENT="test-environment"
PINECONE_INDEX_NAME="test-index"
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file for testing');
  console.log('📝 Please update DATABASE_URL with your actual database connection string');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error);
} 