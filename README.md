# 🧠 CodeNote – Your AI-Powered DSA Practice and Note-Taking Companion

![CodeNote Banner](https://your-image-url.com/banner.png) <!-- Optional: Add banner illustration or GIF -->

> **CodeNote** is an intelligent DSA platform that combines real-time coding, smart note-taking, AI-powered optimization, and custom coding competitions. Built with cutting-edge technologies like **Next.js 15**, **LangChainJS**, and **tRPC**, it transforms your data structures and algorithms prep into a personalized, interactive journey.

---

## 📦 Tech Stack

| Layer         | Technologies                                                                |
| ------------- | --------------------------------------------------------------------------- |
| Frontend      | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Editor        | Monaco Editor                                                               |
| API Layer     | tRPC (type-safe), Gemini API, LangChainJS                                   |
| Database      | Prisma ORM, PostgreSQL + pgvector (via Supabase/PlanetScale)                |
| Vector Search | pgvector / Pinecone / Weaviate (modular)                                    |
| Deployment    | Vercel (frontend), Railway (backend/AI runner)                              |
| CI/CD         | GitHub Actions                                                              |

---

## 🚀 Live Demo

🔗 **Production App:** [https://codenote.ai](https://codenote.ai)
📐 **Figma UI Design:** [Figma Link](https://www.figma.com/file/your-file-id/CodeNote?type=design)
📚 **Docs & Architecture:** [https://codenote.ai/docs](https://codenote.ai/docs)

---

## ✨ Features

* ✅ AI-powered note generation from code, videos, files, or raw text
* ✅ Time and space complexity analysis with Big-O visualizer
* ✅ Real-time coding environment with side-by-side notes
* ✅ Custom coding competitions with live leaderboard and analysis
* ✅ Code replay, plagiarism detection, and AI feedback post-contest
* ✅ Multimodal inputs: text, voice, diagrams, video
* ✅ Smart tagging, ELI5 explanations, and company-specific roadmaps
* ✅ AI-optimized solutions and progress tracking

---

## 🧱 Folder Structure (Best Practices)

```
/codenote
├── app/                      # Next.js App Router pages and layouts
├── components/               # Reusable UI components (shadcn, Framer)
├── lib/                      # Utility functions and LangChain agent configs
├── server/                   # Backend logic, tRPC routers, Gemini tools
├── db/                       # Prisma schema and DB seeds
├── public/                   # Static files (images, logos, etc.)
├── styles/                   # Tailwind + global CSS
├── vector/                   # Embedding + RAG utils (pgvector/Pinecone)
├── scripts/                  # CI/CD, setup, and maintenance scripts
├── .github/                  # GitHub Actions workflows
└── README.md
```

---

## ⚙️ Setup & Installation

### 🖥️ Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/codenote.git
cd codenote

# Install dependencies
pnpm install

# Generate environment file
cp .env.example .env.local

# Setup DB (using Supabase or PostgreSQL)
npx prisma migrate dev --name init
npx prisma generate

# Start dev server
pnpm dev
```

---

### 🛠️ Environment Variables

Add the following to `.env.local`:

```env
Gemini_API_KEY=your-key
DATABASE_URL=postgresql://user:password@host:port/db
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
PINECONE_API_KEY=...      # optional
```

---

## 🧠 LangChain Agent Setup

LangChain is integrated via `LangChainJS` in `lib/agents.ts`.
It supports:

* Retrieval-Augmented Generation (RAG)
* Tool calling (code analysis, optimization, summarization)
* Chat memory and function calling

---

## 🚀 Deployment

### ✅ Frontend on Vercel

* Push to GitHub → Connect repo to [vercel.com](https://vercel.com)
* Vercel auto-builds with `.env.production`

### ✅ Backend / API on Railway

* [Create project](https://railway.app)
* Add PostgreSQL + deploy backend routes under `/server`
* Link `.env` with secrets manager

---

## 🔍 Testing & Quality

* ✅ **Type Safety:** Full-stack with TypeScript & tRPC
* ✅ **CI/CD:** GitHub Actions for linting, build, and tests
* ✅ **Unit + Integration Testing:** Vitest, Playwright (optional setup)
* ✅ **Security:** Rate limiting, auth guards, safe code execution (Judge0 sandbox or Docker)

---

## 📈 Analytics & Monitoring

* **Sentry** for error tracking
* **Vercel Analytics** for user interaction
* **LogRocket / PostHog** (optional) for session replay

---

## 🧩 Upcoming Enhancements

* [ ] Collaborative pair coding mode
* [ ] Plugin system for AI tools and editors
* [ ] Voice-based problem solving + dictation
* [ ] Chrome extension for highlight-to-note
* [ ] Local Ollama agent fallback (offline use)

---

## 💼 Author & Maintainers

Built by [Aman Agrawal](https://your-portfolio.com) —
Open to contributions, internships, and collaborative projects. ✨

---

## 🙌 Contributing

1. Fork the repo
2. Create a new branch: `feature/your-feature`
3. Submit a PR with a detailed description
4. All PRs go through review + CI before merge
