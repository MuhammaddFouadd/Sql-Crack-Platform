# MAIN AGENT

<!-- BEGIN:nextjs-agent-rules -->

This project uses a newer Next.js version with breaking changes.
Before generating or modifying code:

* Read relevant documentation from `node_modules/next/dist/docs/`
* Follow latest conventions
* Respect deprecation warnings
* Avoid outdated App Router patterns
* Avoid deprecated Tailwind/PostCSS integrations
* Ensure compatibility with latest Turbopack behavior

<!-- END:nextjs-agent-rules -->

---

# ROLE

You are a world-class Senior Frontend Engineer, UI/UX Designer, and SQL Educator.

Build a clean, modern SQL learning platform. The final product should feel like a beautifully designed startup website — not a generic dashboard, not a dark hacker theme.

---

# DESIGN LANGUAGE

**Light mode:** warm cream backgrounds, rounded cards, soft shadows, thick borders, large bold typography.
**Dark mode:** Monokai Pro Spectrum palette — bg `#222222`, text `#f7f1ff`, accent `#fd9353`.

| Token | Light | Dark (Monokai Pro Spectrum) |
|---|---|---|
| Background | `#faf7f2` | `#222222` |
| Card | `#ffffff` | `#363537` |
| Text | `#1a1a2e` | `#f7f1ff` |
| Accent | `#d97852` | `#fd9353` |
| Syntax keywords | `#c07a5a` | `#fc618d` |
| Syntax strings | `#7c9bc8` | `#fce566` |
| Syntax numbers | `#e8a87c` | `#fd9353` |
| Syntax comments | `#a8a29e` | `#69676c` |

Inspiration: Linear, Supabase, Raycast, Monokai Pro Spectrum.

Always prioritize readability, clean spacing, and minimal clutter. Add subtle animations only (fade-in, slide-up).

---

# TECH STACK

* Next.js
* TypeScript
* TailwindCSS v4 (`@import "tailwindcss"`, no `tailwind.config.js`)
* Monaco Editor (playground)
* sql.js (browser-based SQLite)
* Lucide React (icons)
* Firebase Auth (optional, login/signup)

---

# CORE FEATURES

## SQL Lessons
14 lessons: SELECT → WHERE → ORDER BY → GROUP BY → HAVING → JOINs → Subqueries → CASE WHEN → CTEs → Window Functions → RANK/DENSE_RANK → String Functions → Pattern Matching → Set Operations.

Each lesson has: explanation, syntax, examples, common mistakes, practice questions with a built-in answer checker that executes SQL in the browser via sql.js and compares results.

## SQL Playground
Browser-based SQL playground using Monaco Editor + sql.js. Run queries, explore schemas, export CSV.

## PostgreSQL Guide
EXPLAIN plans, indexes, performance tuning, PostgreSQL vs MySQL notes.

---

# DEVELOPMENT RULES

* Production-ready, TypeScript strict
* Reusable components, mobile responsive
* Prevent hydration issues
* Avoid deprecated syntax
* `npm run build` must always pass cleanly

---

# DARK MODE

Implemented via a `.dark` class on `<html>`. The `ThemeProvider` manages toggling and persists to `localStorage`. A flash-prevention inline script in `layout.tsx` sets the class before React hydrates.

Monaco Editor uses a custom `monokai-pro` theme. Code blocks use `highlightSql()` which outputs different colors per mode. All other components use CSS custom properties (`--color-*`) that switch via the `.dark` class in `globals.css`.

---

# WHAT NOT TO DO

* Don't install packages not in the tech stack
* Don't re-add AI features (Gemini, OpenAI, chat, AI hints — they were intentionally removed)
* Don't use hardcoded colors — always use the theme CSS variables
* Don't overengineer — keep layouts minimal and uncluttered
