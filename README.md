# SQL Helper

A modern SQL learning platform with interactive lessons, an AI mentor, and a browser-based SQL playground.

Master SQL from `SELECT` to window functions, learn PostgreSQL internals, and practice with an AI tutor trained on LeetCode SQL 50 and HackerRank SQL problems.

## Features

### 📚 Interactive Lessons
14 structured lessons covering the full SQL spectrum:
`SELECT` → `WHERE` → `ORDER BY` → `GROUP BY` → `HAVING` → `JOINs` → `Subqueries` → `CASE WHEN` → `CTEs` → `Window Functions` → `RANK / DENSE_RANK / ROW_NUMBER`

Each lesson includes explanations, syntax references, examples, common mistakes, and practice questions with an interactive answer checker that auto-formats SQL and validates correctness.

### 🤖 AI Mentor
A bilingual (English / Arabic) SQL tutor that:
- Identifies problems from screenshots or descriptions (trained on LeetCode SQL 50 + HackerRank problems)
- Provides graduated hints (indirect → direct → full solution)
- Suggests topics to revise
- Supports image attachments via file picker or paste
- Streams responses token-by-token
- Renders SQL code blocks with syntax highlighting
- Falls back to OpenAI GPT-4o-mini when Gemini quota is exhausted

### 🎮 SQL Playground
A full-featured browser-based SQL playground powered by `sql.js`:
- Schema browser sidebar with table/column details, PK/NN badges, and row counts
- Monaco Editor with SQL syntax highlighting
- Example queries dropdown (Basic / Aggregation / Joins / Window Functions / Set Operations)
- Query history (last 20, persisted to localStorage)
- SQL formatter (keyword capitalisation + indentation)
- Sortable result tables with click-to-sort headers
- CSV export (copy to clipboard)
- Keyboard shortcut: `⌘⏎` to run

### 🐘 PostgreSQL Section
PostgreSQL-specific content: `EXPLAIN` / `ANALYZE`, indexes, performance basics, and PostgreSQL vs MySQL notes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router + Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org/) strict mode |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| SQL Engine | [sql.js](https://sql.js.org/) (SQLite via WebAssembly) |
| AI Provider | [Gemini 2.0 Flash](https://ai.google.dev/gemini-api) + OpenAI [GPT-4o-mini](https://openai.com/) fallback |
| Markdown | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) |
| Icons | [Lucide](https://lucide.dev/) |
| Diagrams | [Mermaid](https://mermaid.js.org/) |

## Getting Started

### Prerequisites
- Node.js 20+
- A Google Gemini API key (free: https://aistudio.google.com/apikey)
- (Optional) An OpenAI API key for fallback when Gemini quota is exhausted

### Setup

```bash
npm install
```

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here    # optional fallback
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build    # production build
npm run lint     # lint all files
```

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # AI mentor API (Gemini + OpenAI fallback, SSE streaming)
│   ├── chat/                # AI mentor chat page
│   ├── lessons/[slug]/      # SQL lesson pages
│   ├── playground/          # SQL playground with Monaco Editor
│   ├── postgres/            # PostgreSQL section
│   └── page.tsx             # Landing page
├── components/
│   ├── chat/                # ChatInput, ChatMessage, LanguageToggle, MarkdownMessage
│   ├── lessons/             # PracticeAnswer (interactive SQL answer checker)
│   ├── playground/          # SchemaPanel, ExampleQueries, QueryHistory
│   ├── ui/                  # CodeBlock (SQL syntax highlighting + copy button)
│   └── viz/                 # SQL visualisation components (joins, indexes, etc.)
├── lib/
│   ├── data/                # Problem database (LeetCode + HackerRank), lesson content
│   ├── sql-format.ts        # SQL formatter + normalizer shared utility
│   └── utils.ts             # General utilities
└── app/globals.css          # Design palette (warm cream, terracotta accent, etc.)
```

## Design

Light mode only. Warm cream backgrounds (`#faf7f2`), terracotta accent (`#d97852`), rounded cards with thick subtle borders, large bold typography, and soft shadows.

Inspired by Linear, Supabase, and Raycast — modern startup aesthetics with an editorial, playful feel.

## API

### `POST /api/chat`

Sends a message to the AI mentor. Returns an SSE stream of text chunks.

**Request body:**
```json
{
  "message": "string",
  "history": [{ "role": "user|assistant", "text": "string" }],
  "language": "en|ar",
  "images": [{ "mimeType": "image/png", "data": "base64..." }]
}
```

**Response:** SSE stream (`text/event-stream`)
```
data: {"text":"partial response chunk"}
data: {"text":"next chunk"}
data: [DONE]
```

Error format:
```
data: {"error":"error message"}
data: [DONE]
```
