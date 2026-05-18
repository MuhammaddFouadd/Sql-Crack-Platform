# Sql Craker — Agent Guide

## Quick Reference

```bash
npm run dev        # Start dev server
npm run build      # Production build (must pass cleanly)
npm run lint       # ESLint (no errors allowed)
npm run start      # Serve production build
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 (`@import "tailwindcss"`, no config file) |
| SQL Engine | sql.js (browser-based SQLite via WASM) |
| Editor | Monaco Editor (playground) |
| Icons | Lucide React |
| Auth | Firebase Auth (optional — runtime-gated) |

## Next.js Rules

<!-- BEGIN:nextjs-agent-rules -->
This project uses a newer Next.js version with breaking changes.
Before generating or modifying code:

* Read relevant documentation from `node_modules/next/dist/docs/`
* Follow latest conventions, respect deprecation warnings
* Avoid outdated App Router patterns
* Avoid deprecated Tailwind/PostCSS integrations
* Ensure compatibility with latest Turbopack behavior

**Pages that export `metadata` must NOT have `'use client'`.** If client hooks are needed, split into a server page exporting metadata + a client component.
<!-- END:nextjs-agent-rules -->

## Design System

**Light:** warm cream `#faf7f2`, white cards, rounded cards, thick borders, bold typography.
**Dark:** Monokai Pro Spectrum (`#222222` bg, `#f7f1ff` text, `#fd9353` accent).

All colors use CSS custom properties (`--color-*`) — never hardcode hex values.

Key tokens:

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#faf7f2` | `#222222` |
| `--color-card` | `#ffffff` | `#363537` |
| `--color-text` | `#1a1a2e` | `#f7f1ff` |
| `--color-accent` | `#d97852` | `#fd9353` |
| Syntax keywords | `#c07a5a` | `#fc618d` |
| Syntax strings | `#7c9bc8` | `#fce566` |

Dark mode via `.dark` class on `<html>`. Inline script in `layout.tsx` prevents flash. `ThemeProvider` persists to localStorage.

## Architecture Patterns

### Server / Client Split

Pages needing both `metadata` and client hooks must use this pattern:
```
src/app/lessons/
  page.tsx          ← Server: exports metadata, renders <LessonsClient />
  lessons-client.tsx ← 'use client': all hooks, state, event handlers
```

### Error Boundaries

- `src/app/error.tsx` — catches page errors, surfaces `error.digest`
- `src/app/global-error.tsx` — catches root layout errors
- `src/app/not-found.tsx` — 404 page

### Accessibility

All interactive elements without visible text need `aria-label`. Key components with coverage:
– Playground toolbar (schema, format, reset, run, CSV export)
– SchemaPanel (toggle table, preview, collapse buttons)
– ExampleQueries / QueryHistory (dropdown triggers, category tabs, items)
– CodeBlock copy button

### Env Validation

`src/lib/env.ts` runs at build time in the root layout. Missing `NEXT_PUBLIC_FIREBASE_*` vars produce a warning (not a build failure). Auth consumers gracefully degrade when Firebase is not configured.

## Development Rules

- TypeScript strict, production-ready code
- Prevent hydration issues (use `suppressHydrationWarning`, inline scripts for theme)
- Mobile responsive, reusable components
- `npm run build` and `npm run lint` must pass cleanly before any commit
- Minimal animations only (fade-in, slide-up)

## What NOT to Do

- Don't install packages outside the tech stack
- Don't re-add AI features (Gemini, OpenAI, chat, AI hints — intentionally removed)
- Don't hardcode colors — always use CSS custom properties
- Don't overengineer — keep layouts minimal and uncluttered
- Don't add `'use client'` to pages that export `metadata`
