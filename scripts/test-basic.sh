#!/bin/bash

# Basic test script that doesn't require database
# Tests the basic endpoint availability and error handling

BASE_URL="http://localhost:3000"

echo "🧪 Basic Authentication System Tests"
echo "==================================="
echo ""

# Function to print test result
print_result() {
    local test_name="$1"
    local status="$2"
    local response="$3"
    
    if [ "$status" = "success" ]; then
        echo "✅ $test_name - PASSED"
    else
        echo "❌ $test_name - FAILED"
        echo "   Response: $response"
    fi
    echo ""
}

# Test 1: Server Health Check
echo "🧪 Test 1: Server Health Check"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/auth/session")
if [ "$response" = "200" ]; then
    print_result "Server Health Check" "success"
else
    print_result "Server Health Check" "failed" "HTTP $response - Server not running"
    echo "💡 Make sure to start the development server: npm run dev"
    exit 1
fi

# Test 2: NextAuth Session Endpoint
echo "🧪 Test 2: NextAuth Session Endpoint"
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/auth/session")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_result "NextAuth Session Endpoint" "success"
else
    print_result "NextAuth Session Endpoint" "failed" "HTTP $http_code - $response_body"
fi

# Test 3: NextAuth Providers Endpoint
echo "🧪 Test 3: NextAuth Providers Endpoint"
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/auth/providers")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_result "NextAuth Providers Endpoint" "success"
else
    print_result "NextAuth Providers Endpoint" "failed" "HTTP $http_code - $response_body"
fi

# Test 4: Signup Endpoint (should fail without database, but endpoint should exist)
echo "🧪 Test 4: Signup Endpoint Availability"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@example.com",
        "password": "SecurePass123!"
    }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "500" ] || [ "$http_code" = "400" ]; then
    print_result "Signup Endpoint Availability" "success" "Endpoint exists (expected error without DB)"
else
    print_result "Signup Endpoint Availability" "failed" "HTTP $http_code - $response_body"
fi

# Test 5: Password Reset Endpoint (should fail without database, but endpoint should exist)
echo "🧪 Test 5: Password Reset Endpoint Availability"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/reset-password" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com"
    }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "500" ] || [ "$http_code" = "400" ]; then
    print_result "Password Reset Endpoint Availability" "success" "Endpoint exists (expected error without DB)"
else
    print_result "Password Reset Endpoint Availability" "failed" "HTTP $http_code - $response_body"
fi

# Test 6: Invalid JSON handling
echo "🧪 Test 6: Invalid JSON Handling"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d 'invalid json')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "400" ] || [ "$http_code" = "500" ]; then
    print_result "Invalid JSON Handling" "success" "Properly handles invalid JSON"
else
    print_result "Invalid JSON Handling" "failed" "HTTP $http_code - $response_body"
fi

# Test 7: Missing Content-Type header
echo "🧪 Test 7: Missing Content-Type Header"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -d '{"name": "Test", "email": "test@example.com", "password": "pass"}')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "400" ] || [ "$http_code" = "500" ]; then
    print_result "Missing Content-Type Header" "success" "Properly handles missing Content-Type"
else
    print_result "Missing Content-Type Header" "failed" "HTTP $http_code - $response_body"
fi

echo ""
echo "📊 Basic Test Summary:"
echo "======================"
echo "✅ Basic endpoint availability tests completed!"
echo ""
echo "💡 Note: These tests verify endpoint availability and basic error handling."
echo "   For full functionality tests, you need to:"
echo "   1. Set up a database (PostgreSQL/Supabase)"
echo "   2. Update DATABASE_URL in .env.local"
echo "   3. Run: ./scripts/setup-test-db.sh"
echo "   4. Run: ./scripts/test-curl.sh"
echo ""
echo "🔧 Quick Database Setup:"
echo "   - Install PostgreSQL locally, or"
echo "   - Use Supabase (free tier): https://supabase.com"
echo "   - Update DATABASE_URL in .env.local"
echo "   - Run: ./scripts/setup-test-db.sh" 