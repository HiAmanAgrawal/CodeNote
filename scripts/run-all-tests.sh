#!/bin/bash

# Comprehensive Test Runner for Authentication System
# This script runs all tests and provides a complete report

echo "🚀 CodeNote Authentication System - Complete Test Suite"
echo "======================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status="$1"
    local message="$2"
    
    case $status in
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Step 1: Environment Setup
echo "📋 Step 1: Environment Setup"
echo "----------------------------"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_status "warning" ".env.local not found, creating template..."
    npx tsx scripts/test-env.ts
    if [ $? -eq 0 ]; then
        print_status "success" "Created .env.local template"
        print_status "warning" "Please update DATABASE_URL with your actual database connection string"
    else
        print_status "error" "Failed to create .env.local"
        exit 1
    fi
else
    print_status "success" ".env.local exists"
fi

# Check required commands
echo ""
echo "🔧 Checking required tools..."

if command_exists "node"; then
    print_status "success" "Node.js is installed"
else
    print_status "error" "Node.js is not installed"
    exit 1
fi

if command_exists "npm"; then
    print_status "success" "npm is installed"
else
    print_status "error" "npm is not installed"
    exit 1
fi

if command_exists "curl"; then
    print_status "success" "curl is installed"
else
    print_status "error" "curl is not installed"
    exit 1
fi

# Step 2: Database Setup
echo ""
echo "🗄️  Step 2: Database Setup"
echo "-------------------------"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    # Load from .env.local
    if [ -f ".env.local" ]; then
        export $(grep -v '^#' .env.local | xargs)
    fi
fi

if [ -z "$DATABASE_URL" ]; then
    print_status "error" "DATABASE_URL not set. Please update .env.local with your database connection string"
    exit 1
else
    print_status "success" "DATABASE_URL is configured"
fi

# Try to push schema
echo ""
print_status "info" "Pushing database schema..."
npx prisma db push --schema=./db/schema.prisma
if [ $? -eq 0 ]; then
    print_status "success" "Database schema pushed successfully"
else
    print_status "error" "Failed to push database schema"
    print_status "warning" "Make sure your database is running and accessible"
    exit 1
fi

# Step 3: Dependencies Check
echo ""
echo "📦 Step 3: Dependencies Check"
echo "----------------------------"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "warning" "node_modules not found, installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "success" "Dependencies installed"
    else
        print_status "error" "Failed to install dependencies"
        exit 1
    fi
else
    print_status "success" "Dependencies are installed"
fi

# Step 4: Development Server
echo ""
echo "🌐 Step 4: Development Server"
echo "----------------------------"

# Check if server is already running
if port_in_use 3000; then
    print_status "success" "Development server is already running on port 3000"
else
    print_status "warning" "Development server not running"
    print_status "info" "Starting development server in background..."
    
    # Start server in background
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    print_status "info" "Waiting for server to start..."
    for i in {1..30}; do
        if port_in_use 3000; then
            print_status "success" "Development server started successfully"
            break
        fi
        sleep 1
    done
    
    if ! port_in_use 3000; then
        print_status "error" "Failed to start development server"
        exit 1
    fi
fi

# Step 5: Run Tests
echo ""
echo "🧪 Step 5: Running Tests"
echo "-----------------------"

# Run curl tests
echo ""
print_status "info" "Running curl tests..."
./scripts/test-curl.sh
CURL_EXIT_CODE=$?

# Run TypeScript tests
echo ""
print_status "info" "Running TypeScript tests..."
npx tsx scripts/test-auth.ts
TS_EXIT_CODE=$?

# Step 6: Test Summary
echo ""
echo "📊 Test Summary"
echo "==============="

if [ $CURL_EXIT_CODE -eq 0 ]; then
    print_status "success" "Curl tests passed"
else
    print_status "error" "Curl tests failed"
fi

if [ $TS_EXIT_CODE -eq 0 ]; then
    print_status "success" "TypeScript tests passed"
else
    print_status "error" "TypeScript tests failed"
fi

# Overall result
if [ $CURL_EXIT_CODE -eq 0 ] && [ $TS_EXIT_CODE -eq 0 ]; then
    echo ""
    print_status "success" "🎉 All tests passed! Authentication system is working correctly."
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Configure OAuth providers (Google, GitHub) in .env.local"
    echo "   2. Set up email service (SMTP) for verification emails"
    echo "   3. Deploy to production with proper environment variables"
    echo "   4. Set up monitoring and logging"
else
    echo ""
    print_status "error" "❌ Some tests failed. Please check the output above for details."
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check your database connection"
    echo "   2. Ensure all environment variables are set"
    echo "   3. Verify the development server is running"
    echo "   4. Check the logs for specific error messages"
fi

# Cleanup
if [ ! -z "$SERVER_PID" ]; then
    echo ""
    print_status "info" "Cleaning up background server..."
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "🏁 Test suite completed!" 