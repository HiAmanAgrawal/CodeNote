# 🧪 CodeNote Testing Guide

## 📋 Prerequisites

Before testing, ensure you have:

1. **Node.js 18+** installed
2. **PostgreSQL** database running
3. **Git** for version control
4. **Code editor** (VS Code recommended)

## 🚀 Quick Start Testing

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codenote"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"

# AI Services (Optional for basic testing)
GEMINI_API_KEY="your-gemini-api-key-here"

# Vector Database (Optional)
VECTOR_DATABASE_URL="postgresql://username:password@localhost:5432/codenote_vector"

# Webhook (Optional)
WEBHOOK_SECRET="your-webhook-secret"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed test data
npx tsx scripts/test-setup.ts
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3001

## 🧪 Testing Scenarios

### **Frontend Testing**

#### 1. Landing Page
- [ ] ✅ Homepage loads without errors
- [ ] ✅ Navigation links work
- [ ] ✅ Responsive design on mobile/desktop
- [ ] ✅ Theme switching works

#### 2. Dashboard
- [ ] ✅ Dashboard layout loads
- [ ] ✅ Sidebar navigation works
- [ ] ✅ All subpages accessible:
  - `/dashboard` - Main dashboard
  - `/dashboard/editor` - Code editor
  - `/dashboard/contests` - Contests page
  - `/dashboard/roadmap` - Learning roadmap
  - `/dashboard/notes` - Notes page
  - `/dashboard/profile` - Profile page
  - `/dashboard/settings` - Settings page

#### 3. Code Editor
- [ ] ✅ Monaco Editor loads
- [ ] ✅ Language switching works
- [ ] ✅ Code syntax highlighting
- [ ] ✅ Auto-completion features
- [ ] ✅ File management (if implemented)

### **Backend Testing**

#### 1. Database Operations
```bash
# Test database connection
npx prisma studio
```

#### 2. API Endpoints Testing

Use tools like **Postman** or **curl** to test:

**Notes API:**
```bash
# Get all notes
curl http://localhost:3001/api/trpc/notes.getAll

# Create note
curl -X POST http://localhost:3001/api/trpc/notes.create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Test content","topic":"ARRAYS"}'
```

**Contests API:**
```bash
# Get all contests
curl http://localhost:3001/api/trpc/contests.getAll

# Get contest by ID
curl http://localhost:3001/api/trpc/contests.getById?id=contest-1
```

**User API:**
```bash
# Get user profile
curl http://localhost:3001/api/trpc/user.getProfile

# Update user settings
curl -X POST http://localhost:3001/api/trpc/user.updateProfile \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

#### 3. AI Integration Testing

**Code Analysis:**
```bash
# Test code complexity analysis
curl -X POST http://localhost:3001/api/trpc/aiAgent.analyzeCode \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) { return [map.get(complement), i]; } map.set(nums[i], i); } return []; }",
    "language": "javascript",
    "problemTitle": "Two Sum"
  }'
```

**Note Generation:**
```bash
# Test AI note generation
curl -X POST http://localhost:3001/api/trpc/aiAgent.generateNote \
  -H "Content-Type: application/json" \
  -d '{
    "problemTitle": "Two Sum",
    "problemContent": "Given an array of integers...",
    "topic": "ARRAYS"
  }'
```

### **Integration Testing**

#### 1. Full User Flow
1. **Landing Page** → Click "Get Started"
2. **Dashboard** → Navigate to different sections
3. **Editor** → Write and test code
4. **Notes** → Create and view notes
5. **Contests** → Browse available contests
6. **Roadmap** → Check learning progress

#### 2. Authentication Flow
1. **Sign Up** → Create new account
2. **Sign In** → Login with credentials
3. **Profile** → Update user information
4. **Settings** → Modify preferences

## 🐛 Common Issues & Solutions

### **Database Connection Issues**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql

# Create database
createdb codenote
```

### **Prisma Issues**
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Check database status
npx prisma db push
```

### **Port Conflicts**
```bash
# Check what's using port 3001
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

### **Environment Variables**
```bash
# Verify .env.local exists
ls -la .env.local

# Check if variables are loaded
echo $DATABASE_URL
```

## 📊 Test Data

After running the setup script, you'll have:

### **Test User**
- **Email:** test@example.com
- **Password:** test123

### **Test Problems**
1. **Two Sum** (Easy - Arrays)
2. **Valid Parentheses** (Easy - Stack)

### **Test Notes**
1. **Two Sum - Hash Map Approach**
2. **Valid Parentheses - Stack Solution**

### **Test Contest**
- **Beginner Array Problems** (7 days duration)

## 🔧 Advanced Testing

### **Performance Testing**
```bash
# Install testing tools
npm install -D @next/bundle-analyzer

# Analyze bundle size
npm run build
npm run analyze
```

### **E2E Testing** (Future)
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

### **API Testing with Jest**
```bash
# Install testing dependencies
npm install -D jest @types/jest ts-jest

# Run tests
npm test
```

## 📝 Testing Checklist

### **Pre-deployment Testing**
- [ ] ✅ All pages load without errors
- [ ] ✅ Database operations work correctly
- [ ] ✅ API endpoints respond properly
- [ ] ✅ Authentication flows work
- [ ] ✅ AI features function (if API key provided)
- [ ] ✅ Responsive design on all devices
- [ ] ✅ No console errors in browser
- [ ] ✅ Build process completes successfully

### **Post-deployment Testing**
- [ ] ✅ Production build works
- [ ] ✅ Environment variables are set correctly
- [ ] ✅ Database migrations run successfully
- [ ] ✅ External services are accessible
- [ ] ✅ Performance is acceptable
- [ ] ✅ Security measures are in place

## 🆘 Getting Help

If you encounter issues:

1. **Check the console** for error messages
2. **Review the logs** in terminal
3. **Verify environment variables** are set correctly
4. **Check database connection** and migrations
5. **Ensure all dependencies** are installed
6. **Restart the development server**

## 🎯 Next Steps

After successful testing:

1. **Set up production database**
2. **Configure environment variables**
3. **Deploy to hosting platform**
4. **Set up monitoring and logging**
5. **Implement additional features**
6. **Add comprehensive test suite**

---

**Happy Testing! 🚀** 