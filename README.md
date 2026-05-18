# Sql Craker

Master SQL. Crack the Interview.

An interactive SQL learning platform with lessons, a browser-based SQL playground, and an AI mentor.

## Quick Start

```bash
npm install
# Set up .env.local (see below) then:
npm run offline
```

Open [http://localhost:3000](http://localhost:3000).

Everything works **offline** — lessons, playground, progress tracking. Only the AI mentor needs internet.

## Features

### 📚 Interactive Lessons
14 structured lessons from `SELECT` to Window Functions. Each lesson has explanations, syntax references, examples, common mistakes, and practice questions with a LeetCode-style answer checker that executes your SQL and compares results.

### 🤖 AI Mentor
A bilingual (English / Arabic) SQL tutor that:
- Identifies problems from screenshots or descriptions
- Provides graduated hints (indirect → direct → full solution)
- Streams responses token-by-token with SQL syntax highlighting
- Supports image attachments via file picker or paste
- Falls back to OpenAI GPT-4o-mini when Gemini quota is exhausted

### 🎮 SQL Playground
Browser-based SQL playground powered by `sql.js` (SQLite via WebAssembly):
- Monaco Editor with SQL syntax highlighting
- Schema browser sidebar with PK/NN badges and row counts
- Multiple pre-defined schemas (E-Commerce, Library)
- SQL formatter via `sql-formatter`
- Sortable result tables with CSV export
- Keyboard shortcut: `⌘⏎` to run

## Setup

### Prerequisites
- Node.js 20+

### Environment Variables
Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here    # optional fallback
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run offline` | Build + start (ready for offline use) |
| `npm run lint` | Lint all files |

## Offline Usage

1. First visit: run `npm run offline`, visit the site once (all pages are cached by the service worker)
2. Subsequent visits: the site works fully offline — just keep the server running
3. No internet needed for lessons, playground, progress tracking
4. AI mentor requires internet (connects to Gemini/OpenAI APIs)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS v4 |
| Editor | Monaco Editor |
| SQL Engine | sql.js (SQLite via WebAssembly) |
| SQL Formatter | sql-formatter |
| AI Provider | Gemini 2.0 Flash + OpenAI GPT-4o-mini fallback |
| Markdown | react-markdown + remark-gfm |
| Icons | Lucide |

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts     # AI mentor API (SSE streaming)
│   ├── chat/                  # AI mentor chat page
│   ├── lessons/[slug]/        # SQL lesson pages
│   ├── playground/            # SQL playground
│   ├── postgres/              # PostgreSQL section
│   └── page.tsx               # Landing page
├── components/
│   ├── chat/                  # Chat components
│   ├── lessons/               # PracticeAnswer
│   ├── playground/            # SchemaPanel, ExampleQueries, QueryHistory
│   └── ui/                    # CodeBlock
├── lib/
│   ├── data/                  # Lessons, LeetCode, HackerRank problems
│   ├── sql-format.ts          # SQL formatter
│   ├── progress.ts            # localStorage progress tracker
│   ├── db-schema.ts           # Practice database schema
│   └── playground-schemas.ts  # Playground schemas
└── globals.css                # Design palette
```

## Design

Light mode only. Warm cream backgrounds, terracotta accent, rounded cards with thick subtle borders. Inspired by Linear, Supabase, and Raycast.
