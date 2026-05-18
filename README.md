# Sql Craker

**Master SQL. Crack the Interview.**

Interactive SQL learning platform with a built-in browser SQL engine, LeetCode-style practice, and interactive lessons.

## Features

### Interactive Lessons
14 structured lessons from `SELECT` to Window Functions. Each lesson includes explanations, syntax references, examples, common mistakes, and practice questions with a built-in answer checker.

### SQL Playground
Browser-based playground powered by `sql.js` (SQLite via WebAssembly):
- Monaco Editor with SQL syntax highlighting
- Schema browser with PK/NN badges and row counts
- Multiple pre-defined schemas (E-Commerce, Library)
- SQL formatter
- Sortable result tables with CSV export
- Keyboard shortcut: `⌘⏎` to run

### Practice Answer Checker
Write SQL, execute it against an in-memory SQLite database, and compare your results side-by-side with expected output.

### Progress Tracking
Solved questions persist in `localStorage`. Track your journey across all lessons with progress bars and completion badges.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No backend required — everything works offline.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack, hot reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint all files |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Editor | Monaco Editor |
| SQL Engine | sql.js (SQLite via WebAssembly) |
| Icons | Lucide |
| Auth | localStorage token auth |

## Project Structure

```
src/
├── app/
│   ├── lessons/          # SQL lesson pages + practice
│   │   └── [slug]/       # Lesson detail pages
│   ├── playground/       # SQL playground with Monaco Editor
│   ├── login/            # Sign-in page
│   ├── signup/           # Sign-up page
│   ├── layout.tsx        # Root layout (theme, auth, header)
│   ├── page.tsx          # Landing page
│   ├── error.tsx         # Error boundary
│   ├── not-found.tsx     # 404 page
│   ├── robots.ts         # SEO
│   └── sitemap.ts        # SEO
├── components/
│   ├── lessons/          # PracticeAnswer, JoinViz, etc.
│   ├── playground/       # SchemaPanel, ExampleQueries, QueryHistory
│   ├── ui/               # CodeBlock, SqlRunner, SqlEditor
│   └── viz/              # Interactive visualizations
├── lib/
│   ├── data/             # Lesson content
│   ├── auth.ts           # localStorage token auth
│   ├── progress.ts       # Progress tracker
│   ├── db-schema.ts      # Practice schema DDL
│   ├── playground-schemas.ts
│   └── sql-format.ts     # SQL formatter
└── globals.css           # Design tokens (light + dark)
```

## Design

**Light mode:** warm cream backgrounds, rounded cards, thick borders, large bold typography.
**Dark mode:** Monokai Pro Spectrum palette (`#222222` bg, `#f7f1ff` text, `#fd9353` accent).

Dark mode persists to `localStorage` and respects `prefers-color-scheme`. Flash prevention via inline script in the root layout.

## Authentication

Simple localStorage-based token auth. Sign up with email/password — credentials are stored in your browser. No backend or third-party services required.
