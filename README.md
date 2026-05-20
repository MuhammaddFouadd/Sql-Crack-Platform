# SQL Master

**Master SQL. Crack the Interview.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://sql-master-five.vercel.app)

👉 **Try it live:** [https://sql-master-five.vercel.app](https://sql-master-five.vercel.app)

Interactive SQL learning platform with a built-in browser SQL engine, 20+ structured lessons, LeetCode-style practice, interactive visualizations (joins, window functions, indexes), and C++ mental model representations for every concept.

---

## Features

### 📚 Structured Lessons
20+ lessons from `SELECT` to Relational Algebra. Each lesson includes:
- **Explanation** — structured reference with comparison tables
- **Syntax Reference** — ready-to-run SQL patterns
- **Interactive Examples** — run SQL live in the browser against pre-loaded schemas
- **C++ Mental Models** — see every SQL operation expressed as intuitive C++ code
- **Common Mistakes** — exam-style trap explanations
- **Practice Questions** — progressive difficulty with built-in answer checker

### 🧠 Interactive Visualizations
- **Join Engine** — step through INNER, LEFT, RIGHT, FULL joins row by row
- **Window Viz** — see how ROW_NUMBER, RANK, DENSE_RANK assign values visually
- **Execution Pipeline** — understand SQL's logical execution order
- **Index Engine** — compare full table scan vs index lookup performance
- **Internal Engine** — watch how SQL operations map to C++ loops

### 🎮 SQL Playground
Browser-based playground powered by `sql.js` (SQLite via WebAssembly):
- Monaco Editor with SQL syntax highlighting
- Schema browser with PK/NN badges and row counts
- Multiple pre-defined schemas (E-Commerce, Library)
- SQL formatter
- Sortable result tables with CSV export
- Query history
- Keyboard shortcut: `⌘⏎` to run

### ✅ Practice Answer Checker
Write SQL, execute it against an in-memory SQLite database, and compare your results side-by-side with expected output.

### 📊 Progress Tracking
Solved questions persist in your account. Track your journey across all lessons with progress bars and completion badges.

### 🔐 Authentication
Supabase-powered auth with email/password. Auto-login after signup, session persistence, and personalized progress tracking.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No backend required — everything works offline (progress uses localStorage when offline).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack, hot reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint all files |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Editor | Monaco Editor |
| SQL Engine | sql.js (SQLite via WebAssembly) |
| Auth | Supabase (SSR) |
| Icons | Lucide |
| Markdown | react-markdown + remark-gfm |

---

## Lesson Map

| # | Lesson | Difficulty |
|---|--------|-----------|
| 1 | SELECT | Beginner |
| 2 | WHERE | Beginner |
| 3 | ORDER BY | Beginner |
| 4 | GROUP BY | Beginner |
| 5 | HAVING | Beginner |
| 6 | JOINs (INNER, LEFT, RIGHT, FULL, CROSS, SELF) | Intermediate |
| 7 | Subqueries | Intermediate |
| 8 | CASE WHEN | Intermediate |
| 9 | CTEs (WITH clause) | Intermediate |
| 10 | Window Functions | Advanced |
| 11 | Ranking Functions (RANK, DENSE_RANK, ROW_NUMBER, NTILE) | Advanced |
| 12 | Pattern Matching (LIKE, ILIKE, Regex) | Intermediate |
| 13 | Set Operations (UNION, INTERSECT, EXCEPT) | Intermediate |
| 14 | DDL — CREATE TABLE | Beginner |
| 15 | Keys in SQL (PK, FK, Composite, Surrogate, Natural) | Intermediate |
| 16 | DML — INSERT, UPDATE, DELETE | Beginner |
| 17 | ALTER TABLE & DROP | Intermediate |
| 18 | EXISTS & NOT EXISTS (Correlated Subqueries) | Intermediate |
| 19 | Division Queries ("for all" pattern) | Advanced |
| 20 | Relational Algebra (σ, π, ⋈, ∪, −, ∩) | Advanced |
| 21 | Exam Prep | Advanced |

---

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
│   ├── data/             # Lesson content (7200+ lines)
│   ├── auth.ts           # Supabase auth helpers
│   ├── progress.ts       # Progress tracker
│   ├── db-schema.ts      # Practice schema DDL
│   ├── playground-schemas.ts
│   └── sql-format.ts     # SQL formatter
└── globals.css           # Design tokens (light + dark)
```

---

## Design

**Light mode:** warm cream backgrounds, rounded cards, thick borders, large bold typography.  
**Dark mode:** Monokai Pro Spectrum palette (`#222222` bg, `#f7f1ff` text, `#fd9353` accent).

Dark mode persists to `localStorage` and respects `prefers-color-scheme`. Flash prevention via inline script in the root layout.
