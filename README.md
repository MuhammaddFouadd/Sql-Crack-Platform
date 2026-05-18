# SQL Helper

A beautiful, modern SQL learning platform. Master SQL from beginner to advanced, learn PostgreSQL, and practice with an AI mentor trained on LeetCode and HackerRank problems.

## Features

- **SQL Lessons** — Structured path from SELECT to Window Functions, with examples and exercises.
- **PostgreSQL** — EXPLAIN, indexes, performance, and MySQL vs PostgreSQL differences.
- **SQL Playground** — Write and execute SQL queries in your browser with Monaco Editor (powered by sql.js).
- **AI Mentor** — A bilingual (English/Arabic) AI tutor trained on LeetCode SQL 50 and HackerRank SQL problems. Ask for hints, solutions, or topic revisions.

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — SQL playground
- [sql.js](https://sql.js.org/) — In-browser SQL execution
- [Gemini API](https://ai.google.dev/gemini-api) — AI mentor
- [shadcn/ui](https://ui.shadcn.com/) — UI primitives

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── chat/          # AI mentor
│   ├── lessons/       # SQL lessons
│   ├── postgres/      # PostgreSQL section
│   ├── playground/    # SQL playground
│   └── page.tsx       # Landing page
├── components/
│   ├── chat/          # Chat UI components
│   ├── ui/            # Shared UI primitives
│   └── viz/           # Data visualization
└── lib/
    └── data/          # Problem database for the AI mentor
```

## Design

Light mode, rounded cards, soft shadows, warm cream backgrounds, and large typography — inspired by modern startup aesthetics (Linear, Supabase, Raycast).
