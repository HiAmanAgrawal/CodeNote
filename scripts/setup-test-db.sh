#!/bin/bash

# Setup test database for authentication system
echo "🗄️  Setting up test database..."

# Load environment variables
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env.local"
    echo "💡 Please update .env.local with your database connection string"
    exit 1
fi

echo "✅ DATABASE_URL: $DATABASE_URL"

# Push schema
echo "📋 Pushing database schema..."
npx prisma db push --schema=./db/schema.prisma

if [ $? -eq 0 ]; then
    echo "✅ Database schema pushed successfully"
else
    echo "❌ Failed to push database schema"
    echo "💡 Make sure your database is running and accessible"
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --schema=./db/schema.prisma

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "🎉 Database setup completed!" 