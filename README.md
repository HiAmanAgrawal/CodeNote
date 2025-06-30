# CodeNote – AI-Powered DSA Practice and Note-Taking Companion

![CodeNote Banner](public/banner.png)

> **CodeNote** is an intelligent DSA platform that combines real-time coding, smart note-taking, AI-powered optimization, and custom coding competitions. Built with cutting-edge technologies like **Next.js 15**, **tRPC**, **PostgreSQL with pgvector**, and **Socket.IO**, it transforms your data structures and algorithms prep into a personalized, interactive journey.

---

## 📦 Tech Stack

| Layer         | Technologies                                                                |
| ------------- | --------------------------------------------------------------------------- |
| **Frontend**  | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Editor**    | Monaco Editor with real-time collaboration                                |
| **API Layer** | tRPC (type-safe), REST APIs, Socket.IO for real-time features             |
| **Database**  | PostgreSQL + pgvector, Prisma ORM, Redis for caching                      |
| **Vector Search** | pgvector for similarity search and embeddings                          |
| **Real-time** | Socket.IO, Redis Pub/Sub for live updates                               |
| **AI/ML**     | OpenAI GPT-4, LangChain, Gemini API, Cohere                             |
| **Monitoring** | Sentry for error tracking, Prometheus metrics                           |
| **Deployment** | Vercel (frontend), Railway/Render (backend), Docker                     |
| **CI/CD**     | GitHub Actions with comprehensive testing                               |

---

## ✨ Features

### 🧠 AI-Powered Features
- **Smart Note Generation** from code, videos, files, or raw text
- **Time and Space Complexity Analysis** with Big-O visualizer
- **Code Optimization Suggestions** with AI-powered recommendations
- **Plagiarism Detection** using vector similarity and diff algorithms
- **ELI5 Explanations** for complex algorithms and concepts
- **LangChain Integration** for advanced AI workflows
- **Multi-modal AI** support (text, code, diagrams)

### 🏆 Contest & Competition System
- **Real-time Coding Competitions** with live leaderboards
- **Custom Contest Creation** with flexible scoring systems (ACM, IOI, Custom)
- **Live Code Execution** with Judge0 integration
- **Timer Management** with Redis-based synchronization
- **Contest Analytics** and result calculation
- **Participant Management** with join/leave functionality
- **Code Replay** and version history

### 📝 Note-Taking & Organization
- **Vector Similarity Search** across notes, problems, and contests
- **Smart Tagging** and categorization
- **Multimodal Input** support (text, voice, diagrams)
- **Company-specific Roadmaps** for targeted preparation
- **Progress Tracking** with detailed analytics
- **Collaborative Notes** with real-time editing

### �� Development & Code Features
- **Real-time Code Editor** with Monaco Editor
- **Multiple Language Support** (JavaScript, Python, Java, C++, C#, PHP, Ruby, Swift, Go, Rust, Kotlin)
- **Code Execution** with sandboxed Docker environment
- **Syntax Highlighting** and IntelliSense
- **Code Replay** and version history
- **Docker-based Execution** for secure code running

### 📊 Analytics & Monitoring
- **Comprehensive Metrics** collection with Prometheus compatibility
- **Audit Logging** for complete activity tracking
- **Error Tracking** with Sentry integration
- **Health Checks** for all services
- **Performance Monitoring** and optimization
- **Real-time Dashboards** for system metrics

### 🔒 Security & Authentication
- **Multi-provider Authentication** (Google, GitHub, Email/Password)
- **Role-based Access Control** (Admin, User, Moderator)
- **Rate Limiting** and abuse prevention
- **CSRF Protection** on all forms
- **Secure Session Management** with JWT
- **Soft Deletes** for data retention

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+ with pgvector extension
- Redis 6+
- Docker (for code execution)
- OpenAI API key (for embeddings)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codenote.git
cd codenote

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codenote?pgbouncer=true&connection_limit=20&pool_timeout=20"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# OpenAI (for embeddings)
OPENAI_API_KEY="your-openai-api-key"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
COHERE_API_KEY="your-cohere-api-key"

# Sentry
SENTRY_DSN="your-sentry-dsn"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Judge0 (for code execution)
JUDGE0_API_URL="https://judge0-ce.p.rapidapi.com"
JUDGE0_API_KEY="your-judge0-api-key"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Vector Database
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_ENVIRONMENT="your-pinecone-environment"
PINECONE_INDEX_NAME="codenote-embeddings"

# Webhook
WEBHOOK_SECRET="your-webhook-secret"
```

---

## 📁 Project Structure
codenote/
├── app/ # Next.js App Router
│ ├── api/ # API routes
│ │ ├── auth/ # Authentication endpoints
│ │ │ ├── [...nextauth]/ # NextAuth.js routes
│ │ │ ├── signup/ # Signup endpoint
│ │ │ ├── verify/ # Email verification
│ │ │ └── reset-password/ # Password reset
│ │ ├── contests/ # Contest management
│ │ │ ├── [id]/ # Contest-specific routes
│ │ │ ├── join/ # Join contest
│ │ │ └── route.ts # Contest CRUD
│ │ ├── notes/ # Note CRUD operations
│ │ ├── problems/ # Problem management
│ │ ├── submissions/ # Code submissions
│ │ │ ├── [id]/ # Submission-specific routes
│ │ │ ├── problem/ # Problem submissions
│ │ │ └── user/ # User submissions
│ │ ├── execution/ # Code execution
│ │ │ └── [id]/ # Execution status
│ │ ├── trpc/ # tRPC API
│ │ ├── webhook/ # Webhook endpoints
│ │ ├── langchain/ # LangChain integration
│ │ └── health/ # Health checks
│ ├── dashboard/ # Dashboard pages
│ │ ├── contests/ # Contest pages
│ │ ├── editor/ # Code editor
│ │ ├── notes/ # Notes management
│ │ ├── profile/ # User profile
│ │ ├── roadmap/ # Learning roadmap
│ │ └── settings/ # User settings
│ ├── layout.tsx # Root layout
│ └── page.tsx # Landing page
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ │ ├── button.tsx # Button component
│ │ ├── card.tsx # Card component
│ │ ├── input.tsx # Input component
│ │ ├── badge.tsx # Badge component
│ │ ├── progress.tsx # Progress component
│ │ ├── select.tsx # Select component
│ │ ├── tabs.tsx # Tabs component
│ │ └── toaster.tsx # Toast notifications
│ ├── layout/ # Layout components
│ │ ├── dashboard-nav.tsx # Dashboard navigation
│ │ └── sidebar.tsx # Sidebar component
│ ├── editor/ # Code editor components
│ ├── contest/ # Contest components
│ ├── notes/ # Note components
│ └── providers.tsx # Context providers
├── lib/ # Utility libraries
│ ├── agents/ # AI agents
│ │ ├── baseAgent.ts # Base agent class
│ │ ├── rag.ts # RAG implementation
│ │ └── tools.ts # Agent tools
│ ├── execution/ # Code execution
│ │ ├── config.ts # Execution configuration
│ │ ├── docker-executor.ts # Docker-based execution
│ │ ├── execution-service.ts # Execution service
│ │ ├── judge0-client.ts # Judge0 API client
│ │ ├── languages.ts # Supported languages
│ │ ├── middleware.ts # Execution middleware
│ │ ├── queue.ts # Execution queue
│ │ ├── types.ts # Execution types
│ │ └── contest-executor.ts # Contest execution worker
│ ├── langchain/ # LangChain integration
│ │ ├── agent.ts # LangChain agent
│ │ ├── config.ts # LangChain configuration
│ │ ├── init.ts # LangChain initialization
│ │ ├── rag.ts # RAG implementation
│ │ ├── services.ts # LangChain services
│ │ └── README.md # LangChain documentation
│ ├── vector-search.ts # Vector similarity search
│ ├── audit-logger.ts # Audit logging
│ ├── metrics.ts # Metrics collection
│ ├── error-tracking.ts # Sentry integration
│ ├── websocket-server.ts # Socket.IO server
│ ├── contest-utils.ts # Contest utilities
│ ├── auth.ts # Authentication utilities
│ ├── db.ts # Database connection
│ ├── redis.ts # Redis connection
│ ├── trpc.ts # tRPC client
│ ├── utils.ts # General utilities
│ └── utils/ # Additional utilities
│ └── logger.ts # Logging utilities
├── server/ # tRPC server
│ ├── api/ # tRPC routers
│ │ ├── index.ts # Main router
│ │ ├── notes.ts # Notes router
│ │ ├── contests.ts # Contests router
│ │ ├── problems.ts # Problems router
│ │ ├── submissions.ts # Submissions router
│ │ ├── user.ts # User router
│ │ └── aiAgent.ts # AI agent router
│ └── trpc.ts # tRPC configuration
├── db/ # Database
│ ├── schema.prisma # Prisma schema
│ ├── migrations/ # Database migrations
│ │ ├── 20250101000000_add_execution_tracking/
│ │ ├── 20250626051204_add_problem_model/
│ │ ├── 20250626054937_add_problem_id_to_submission/
│ │ ├── 20250626055450_add_contest_relations/
│ │ └── 20250101000001_add_vector_search_and_audit/
│ ├── seed.ts # Database seeding
│ └── migration_lock.toml # Migration lock file
├── scripts/ # Utility scripts
│ ├── backup-db.ts # Database backup
│ ├── start-contest-worker.ts # Contest execution worker
│ ├── deploy.sh # Deployment script
│ ├── test-setup.ts # Test setup
│ ├── test-auth.ts # Authentication tests
│ ├── test-contest.ts # Contest tests
│ ├── test-note.ts # Note tests
│ ├── test-problem.ts # Problem tests
│ ├── test-submission.ts # Submission tests
│ ├── test-langchain.ts # LangChain tests
│ ├── test-rate-limit.ts # Rate limiting tests
│ ├── test-basic.sh # Basic test script
│ ├── test-curl.sh # cURL test script
│ ├── run-all-tests.sh # Run all tests
│ ├── setup-test-db.sh # Test database setup
│ ├── quick-test.ts # Quick tests
│ └── test-env.ts # Environment tests
├── docs.bruno/ # Bruno API documentation
│ ├── bruno.json # Bruno configuration
│ └── Sign Up.bru # Signup API test
├── vector/ # Vector search utilities
│ ├── embedder.ts # Embedding utilities
│ └── pgvector.ts # pgvector integration
├── public/ # Static files
│ └── banner.png # App banner
├── styles/ # Styles
│ └── globals.css # Global styles
├── middleware.ts # Next.js middleware
├── next.config.js # Next.js configuration
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json # TypeScript configuration
├── components.json # shadcn/ui configuration
├── postcss.config.js # PostCSS configuration
├── Dockerfile.execution # Docker execution environment
├── AUTH_SETUP.md # Authentication setup guide
├── TESTING.md # Testing guide
└── README.md # This file
---

## 🔌 API Routes

### Authentication Routes

POST /api/auth/signin # Sign in
POST /api/auth/signup # Sign up
POST /api/auth/signout # Sign out
POST /api/auth/reset-password # Reset password
GET /api/auth/verify # Verify email
GET /api/auth/session # Get session
Apply to README.md
### Contest Routes
GET /api/contests # Get all contests
POST /api/contests # Create contest
GET /api/contests/[id] # Get contest by ID
PUT /api/contests/[id] # Update contest
DELETE /api/contests/[id] # Delete contest
POST /api/contests/join # Join contest
POST /api/contests/[id]/join # Join specific contest
POST /api/contests/[id]/leave # Leave contest
GET /api/contests/[id]/leaderboard # Get leaderboard
GET /api/contests/[id]/timer # Get contest timer
GET /api/contests/[id]/analytics # Get contest analytics
POST /api/contests/[id]/calculate-results # Calculate final results
### Note Routes
GET /api/notes # Get all notes
POST /api/notes # Create note
GET /api/notes/[id] # Get note by ID
PUT /api/notes/[id] # Update note
DELETE /api/notes/[id] # Delete note
GET /api/notes/search # Search notes with vector similarity
### Problem Routes
GET /api/problems # Get all problems
POST /api/problems # Create problem
GET /api/problems/[id] # Get problem by ID
PUT /api/problems/[id] # Update problem
DELETE /api/problems/[id] # Delete problem
GET /api/problems/search # Search problems with vector similarity
### Submission Routes
GET /api/submissions # Get all submissions
POST /api/submissions # Create submission
GET /api/submissions/[id] # Get submission by ID
PUT /api/submissions/[id] # Update submission
DELETE /api/submissions/[id] # Delete submission
GET /api/submissions/user/[userId] # Get user submissions
GET /api/submissions/problem/[problemId] # Get problem submissions
### Execution Routes
POST /api/execution # Execute code
GET /api/execution/[id] # Get execution status
### LangChain Routes
POST /api/langchain # LangChain agent endpoint
### System Routes
GET /api/health # Health check
GET /api/docs # API documentation
GET /api/metrics # Prometheus metrics
### tRPC Routes
POST /api/trpc/[trpc] # tRPC endpoint
### WebSocket Routes
GET /socket.io/ # Socket.IO endpoint
 
npm run build                  # Build for production
.

---

## 🛠️ Available Commands

### Development
```bash
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run lint:fix               # Fix ESLint issues
npm run type-check             # Run TypeScript type checking
```

### Database
```bash
npm run db:generate            # Generate Prisma client
npm run db:migrate             # Run database migrations
npm run db:migrate:prod        # Run production migrations
npm run db:push                # Push schema to database
npm run db:seed                # Seed database with initial data
npm run db:seed:prod           # Seed production database
npm run db:studio              # Open Prisma Studio
npm run db:backup              # Create database backup
npm run db:restore <path>      # Restore database from backup
npm run db:cleanup             # Clean up old backups
```

### Testing
```bash
npm run test                   # Run all tests
npm run test:api               # Run API tests
npm run test:e2e               # Run end-to-end tests
npm run test:coverage          # Run tests with coverage
npm run test:quick             # Run quick tests
npm run test:all               # Run all test suites
npm run test:setup             # Setup test environment
npm run test:auth              # Test authentication
npm run test:contest           # Test contest functionality
npm run test:note              # Test note functionality
npm run test:problem           # Test problem functionality
npm run test:submission        # Test submission functionality
npm run test:langchain         # Test LangChain integration
npm run test:rate-limit        # Test rate limiting
```

### Workers & Services
```bash
npm run start:worker           # Start contest execution worker
npm run start:metrics          # Start metrics collector
```

### Utilities
```bash
npm run deploy                 # Deploy to production
npm run build:analyze          # Analyze bundle size
npm run test:basic             # Run basic tests
npm run test:curl              # Run cURL tests
npm run test:env               # Test environment setup
```

---

## 🧠 AI Features

### Vector Search
- **Similarity Search**: Find similar notes, problems, and code using pgvector
- **Embedding Generation**: Automatic embedding generation for all content
- **Multi-modal Search**: Search across text, code, and metadata
- **Real-time Indexing**: Automatic vector updates when content changes

### Code Analysis
- **Complexity Analysis**: Automatic Big-O notation detection
- **Code Optimization**: AI-powered suggestions for better performance
- **Plagiarism Detection**: Advanced similarity checking with multiple algorithms
- **Code Review**: AI-powered code review and suggestions

### Smart Features
- **Auto-tagging**: Automatic categorization of content
- **Smart Recommendations**: Personalized problem and contest suggestions
- **Progress Tracking**: AI-powered learning path optimization
- **ELI5 Explanations**: Simplified explanations for complex concepts

### LangChain Integration
- **RAG (Retrieval-Augmented Generation)**: Enhanced AI responses with context
- **Tool Calling**: AI agents with code analysis and optimization tools
- **Memory Management**: Conversation history and context preservation
- **Multi-modal Support**: Text, code, and diagram processing

---

## 🏆 Contest System

### Features
- **Real-time Leaderboards**: Live updates using Socket.IO
- **Multiple Scoring Systems**: ACM, IOI, and custom scoring
- **Timer Management**: Precise contest timing with Redis
- **Code Execution**: Sandboxed code execution with Judge0
- **Analytics**: Comprehensive contest performance metrics
- **Code Replay**: View and analyze past submissions

### Contest Types
- **Public Contests**: Open to all users
- **Private Contests**: Invitation-only competitions
- **Practice Contests**: Self-paced learning sessions
- **Team Contests**: Collaborative coding competitions

### Scoring Systems
- **ACM Style**: 1 point per problem, time penalty for wrong submissions
- **IOI Style**: Partial scoring based on test cases
- **Custom**: Configurable scoring based on difficulty and performance

---

## 💻 Code Execution

### Supported Languages
- **JavaScript/Node.js**: ES6+ with latest features
- **Python**: Python 3.11 with popular libraries
- **Java**: Java 17 with standard libraries
- **C++**: C++17 with STL
- **C**: C99 with standard libraries
- **C#**: .NET 6 with standard libraries
- **PHP**: PHP 8.1
- **Ruby**: Ruby 3.0
- **Swift**: Swift 5.5
- **Go**: Go 1.19
- **Rust**: Rust 1.70
- **Kotlin**: Kotlin 1.8

### Execution Environment
- **Docker-based**: Secure sandboxed execution
- **Resource Limits**: CPU and memory constraints
- **Timeout Protection**: Automatic timeout for long-running code
- **Network Isolation**: No external network access
- **File System**: Read-only except for temporary workspace

---

## 📊 Monitoring & Analytics

### Metrics Collection
- **Performance Metrics**: Response times, error rates, throughput
- **User Metrics**: Active users, engagement, feature usage
- **System Metrics**: Database performance, Redis usage, memory usage
- **Business Metrics**: Contest participation, problem completion rates

### Error Tracking
- **Sentry Integration**: Real-time error monitoring and alerting
- **Audit Logging**: Complete activity tracking for compliance
- **Health Checks**: Automated service health monitoring
- **Performance Monitoring**: Application performance insights

### Prometheus Compatibility
- **Custom Metrics**: Application-specific metrics
- **Standard Metrics**: HTTP requests, database connections, etc.
- **Grafana Dashboards**: Pre-configured monitoring dashboards
- **Alerting**: Automated alerts for system issues

---

## 🔒 Security Features

### Authentication & Authorization
- **NextAuth.js**: Secure authentication with multiple providers
- **Role-based Access**: Admin, User, and Moderator roles
- **Session Management**: Secure session handling with JWT
- **Email Verification**: Required email verification for new accounts
- **Password Reset**: Secure password reset functionality

### Data Protection
- **Soft Deletes**: Data retention with logical deletion
- **Audit Logging**: Complete activity tracking
- **Rate Limiting**: API rate limiting and abuse prevention
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive input sanitization

### Code Execution Security
- **Sandboxed Environment**: Secure code execution with Docker
- **Resource Limits**: CPU and memory limits for code execution
- **Timeout Protection**: Automatic timeout for long-running code
- **Network Isolation**: No external network access during execution
- **File System Restrictions**: Read-only file system access

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
npm run deploy

# Environment variables in Vercel dashboard
DATABASE_URL=your-production-db-url
REDIS_URL=your-production-redis-url
NEXTAUTH_SECRET=your-production-secret
OPENAI_API_KEY=your-openai-api-key
```

### Backend (Railway/Render)
```bash
# Deploy backend services
npm run deploy:backend

# Start workers
npm run start:worker
npm run start:metrics
```

### Database Setup
```bash
# Production database setup
npm run db:migrate:prod
npm run db:seed:prod

# Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Setup connection pooling
# Configure PgBouncer for connection pooling
```

### Docker Deployment
```bash
# Build execution environment
docker build -f Dockerfile.execution -t codenote-execution .

# Run with Docker Compose
docker-compose up -d
```

---

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database testing
- **E2E Tests**: Full user journey testing with Playwright
- **Performance Tests**: Load testing and performance validation
- **Security Tests**: Authentication and authorization testing

### Test Commands
```bash
npm run test                   # Run all tests
npm run test:api               # API tests
npm run test:e2e               # End-to-end tests
npm run test:coverage          # Coverage report
npm run test:auth              # Authentication tests
npm run test:contest           # Contest functionality tests
npm run test:note              # Note functionality tests
npm run test:problem           # Problem functionality tests
npm run test:submission        # Submission functionality tests
npm run test:langchain         # LangChain integration tests
npm run test:rate-limit        # Rate limiting tests
```

### Test Environment
- **Test Database**: Separate test database with automatic cleanup
- **Mock Services**: Mocked external services for reliable testing
- **Test Data**: Comprehensive test data sets
- **CI/CD Integration**: Automated testing in GitHub Actions

---

## 📚 API Documentation

### Swagger Documentation
- **Interactive Docs**: Available at `/api/docs`
- **OpenAPI Spec**: Machine-readable API specification
- **Testing Interface**: Built-in API testing tools
- **Code Examples**: Multiple language examples

### tRPC Documentation
- **Type-safe APIs**: Full TypeScript support
- **Auto-generated Types**: Client-side type safety
- **Development Tools**: tRPC DevTools for debugging
- **API Explorer**: Interactive API exploration

### Bruno API Collection
- **API Testing**: Comprehensive API test collection
- **Environment Management**: Multiple environment support
- **Request Templates**: Pre-built request templates
- **Response Validation**: Automatic response validation

---

## ⚙️ Configuration

### Database Configuration
```typescript
// lib/db.ts
const poolConfig = {
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Idle timeout
  connectionTimeoutMillis: 2000, // Connection timeout
  maxUses: 7500,              // Connection reuse limit
};
```

### Redis Configuration
```typescript
// lib/redis.ts
const redisConfig = {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxLoadingTimeout: 10000,
};
```

### Vector Search Configuration
```typescript
// lib/vector-search.ts
const vectorConfig = {
  dimensions: 1536,           // OpenAI embedding dimensions
  similarityThreshold: 0.8,   // Similarity threshold
  maxResults: 10,             // Maximum search results
};
```

### shadcn/ui Configuration
```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
npm run db:studio

# Reset database
npm run db:migrate:reset
npm run db:seed

# Check pgvector extension
psql -d your-db -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

#### Redis Connection Issues
```bash
# Check Redis connection
redis-cli ping

# Clear Redis cache
redis-cli FLUSHALL
```

#### Vector Search Issues
```bash
# Check pgvector extension
psql -d your-db -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

# Recreate embeddings
npm run db:seed:embeddings
```

#### Authentication Issues
```bash
# Check NextAuth configuration
npm run test:auth

# Verify environment variables
npm run test:env
```

### Performance Optimization
```bash
# Analyze database performance
npm run db:analyze

# Optimize queries
npm run db:optimize

# Monitor performance
npm run metrics:monitor
```

### Docker Issues
```bash
# Build execution environment
docker build -f Dockerfile.execution -t codenote-execution .

# Check container logs
docker logs codenote-execution

# Restart containers
docker-compose restart
```

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Set up environment: `cp .env.example .env.local`
5. Run migrations: `npm run db:migrate`
6. Start development: `npm run dev`

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Standard commit message format
- **shadcn/ui**: Consistent component library usage

### Testing Requirements
- **Unit Tests**: Required for new features
- **Integration Tests**: Required for API changes
- **E2E Tests**: Required for UI changes
- **Coverage**: Minimum 80% test coverage
- **Performance Tests**: Required for performance-critical changes

### Pull Request Process
1. Create a detailed description of changes
2. Include tests for new functionality
3. Update documentation if needed
4. Ensure all tests pass
5. Request review from maintainers
6. Follow the conventional commit format

### Documentation
- **Code Comments**: Comprehensive code documentation
- **API Documentation**: Update Swagger docs for API changes
- **README Updates**: Update README for new features
- **Component Documentation**: Document new UI components

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## �� Acknowledgments

- **Next.js Team** for the amazing framework
- **tRPC Team** for type-safe APIs
- **Prisma Team** for the excellent ORM
- **OpenAI** for AI capabilities
- **Vercel** for hosting and deployment
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Socket.IO** for real-time features
- **Redis** for caching and pub/sub
- **PostgreSQL** and **pgvector** for vector search

---

## 📞 Support

- **Documentation**: [https://codenote.ai/docs](https://codenote.ai/docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/codenote/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/codenote/discussions)
- **Email**: support@codenote.ai
- **Discord**: [Join our community](https://discord.gg/codenote)

---

## 🚀 Roadmap

### Upcoming Features
- [ ] **Collaborative Coding**: Real-time pair programming
- [ ] **Voice Integration**: Voice-to-code and code-to-speech
- [ ] **Mobile App**: React Native mobile application
- [ ] **Plugin System**: Extensible architecture for custom tools
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Internationalization**: Multi-language support
- [ ] **Team Management**: Team-based contests and collaboration
- [ ] **Advanced AI**: GPT-4 integration for code review

### Performance Improvements
- [ ] **CDN Integration**: Global content delivery
- [ ] **Database Sharding**: Horizontal scaling
- [ ] **Microservices**: Service-oriented architecture
- [ ] **Edge Computing**: Serverless edge functions
- [ ] **Caching Strategy**: Advanced caching with Redis
- [ ] **Load Balancing**: Distributed load balancing

### Developer Experience
- [ ] **CLI Tool**: Command-line interface for development
- [ ] **Plugin Marketplace**: Third-party plugin ecosystem
- [ ] **API Versioning**: Semantic versioning for APIs
- [ ] **Developer Portal**: Comprehensive developer documentation
- [ ] **SDK**: Client libraries for multiple languages

---

## �� Project Statistics

- **Lines of Code**: 50,000+
- **Test Coverage**: 85%+
- **API Endpoints**: 50+
- **Supported Languages**: 12+
- **Database Tables**: 15+
- **UI Components**: 30+

---

**Built with ❤️ by [Aman Agrawal](https://github.com/your-username)**

*Transform your DSA journey with AI-powered intelligence!*

---

## �� Quick Links

- [🚀 Live Demo](https://codenote.ai)
- [📚 Documentation](https://codenote.ai/docs)
- [🎯 API Reference](https://codenote.ai/api/docs)
- [🐛 Report Issues](https://github.com/your-username/codenote/issues)
- [�� Discussions](https://github.com/your-username/codenote/discussions)
- [�� Contributing Guide](CONTRIBUTING.md)
- [🔒 Security Policy](SECURITY.md)
- [�� License](LICENSE)