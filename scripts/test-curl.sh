#!/bin/bash

# Test Authentication System with curl commands
# Make sure the development server is running: npm run dev

BASE_URL="http://localhost:3000"
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_NAME="Test User"

echo "🚀 Testing Authentication System with curl commands"
echo "=================================================="
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

# Test 2: Valid Signup
echo "🧪 Test 2: Valid Signup"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$TEST_NAME\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"SecurePass123!\"
    }")

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "201" ]; then
    print_result "Valid Signup" "success"
    echo "   User created: $TEST_EMAIL"
else
    print_result "Valid Signup" "failed" "HTTP $http_code - $response_body"
fi

# Test 3: Invalid Signup (Validation)
echo "🧪 Test 3: Invalid Signup Validation"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test",
        "email": "invalid-email",
        "password": "weak"
    }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "400" ]; then
    print_result "Invalid Signup Validation" "success"
else
    print_result "Invalid Signup Validation" "failed" "HTTP $http_code - $response_body"
fi

# Test 4: Duplicate Signup
echo "🧪 Test 4: Duplicate Signup Prevention"
# First signup
curl -s -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test User 1\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"SecurePass123!\"
    }" > /dev/null

# Second signup with same email
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"Test User 2\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"SecurePass123!\"
    }")

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "409" ]; then
    print_result "Duplicate Signup Prevention" "success"
else
    print_result "Duplicate Signup Prevention" "failed" "HTTP $http_code - $response_body"
fi

# Test 5: Password Reset Request
echo "🧪 Test 5: Password Reset Request"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/reset-password" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "nonexistent@example.com"
    }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_result "Password Reset Request" "success"
else
    print_result "Password Reset Request" "failed" "HTTP $http_code - $response_body"
fi

# Test 6: Invalid Password Reset
echo "🧪 Test 6: Invalid Password Reset"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/reset-password" \
    -H "Content-Type: application/json" \
    -d '{
        "token": "invalid-token",
        "password": "NewPass123!"
    }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "400" ]; then
    print_result "Invalid Password Reset" "success"
else
    print_result "Invalid Password Reset" "failed" "HTTP $http_code - $response_body"
fi

# Test 7: NextAuth Session Endpoint
echo "🧪 Test 7: NextAuth Session Endpoint"
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/auth/session")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_result "NextAuth Session Endpoint" "success"
else
    print_result "NextAuth Session Endpoint" "failed" "HTTP $http_code - $response_body"
fi

# Test 8: NextAuth Providers Endpoint
echo "🧪 Test 8: NextAuth Providers Endpoint"
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/auth/providers")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    print_result "NextAuth Providers Endpoint" "success"
else
    print_result "NextAuth Providers Endpoint" "failed" "HTTP $http_code - $response_body"
fi

# Test 9: Rate Limiting (simulate multiple requests)
echo "🧪 Test 9: Rate Limiting"
echo "   Sending 6 requests to trigger rate limiting..."

for i in {1..6}; do
    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"Rate Limit Test $i\",
            \"email\": \"ratelimit-$i-$(date +%s)@example.com\",
            \"password\": \"SecurePass123!\"
        }")
    
    http_code="${response: -3}"
    
    if [ "$i" -eq 6 ] && [ "$http_code" = "429" ]; then
        print_result "Rate Limiting" "success"
    elif [ "$i" -eq 6 ] && [ "$http_code" != "429" ]; then
        print_result "Rate Limiting" "failed" "HTTP $http_code - Expected 429"
    fi
done

echo ""
echo "📊 Test Summary:"
echo "================"
echo "✅ All curl tests completed!"
echo ""
echo "💡 Next Steps:"
echo "   1. Check the results above for any failed tests"
echo "   2. Run the TypeScript test suite: npx tsx scripts/test-auth.ts"
echo "   3. Set up your database and update DATABASE_URL in .env.local"
echo "   4. Configure OAuth providers for full functionality"
echo ""
echo "🔧 Manual Testing:"
echo "   - Visit http://localhost:3000/api/auth/signin for NextAuth.js signin page"
echo "   - Use the curl commands above to test specific endpoints"
echo "   - Check your database for created users and verification tokens" 