// Home page — hero, feature cards, topic grid, and how-it-works steps
import Link from 'next/link'

// Feature section cards linking to main areas of the platform
const sections = [
  {
    title: 'SQL Lessons',
    description: '14 structured lessons from SELECT to Window Functions — a complete learning path.',
    href: '/lessons',
    icon: '📚',
    color: 'border-blue bg-blue-light',
    count: '14 topics'
  },
  {
    title: 'SQL Playground',
    description: 'Browser-based SQL engine. Write queries, explore schemas, export results. Multiple schemas available.',
    href: '/playground',
    icon: '▶',
    color: 'border-green bg-green-light',
    count: 'interactive'
  },
  {
    title: 'Practice Questions',
    description: 'LeetCode-style answer checker. Write SQL, execute it, compare results side-by-side.',
    href: '/lessons',
    icon: '✅',
    color: 'border-yellow bg-yellow-light',
    count: '56 exercises'
  },
  {
    title: 'PostgreSQL Guide',
    description: 'EXPLAIN plans, indexes, performance tuning, and MySQL vs PostgreSQL comparisons.',
    href: '/postgres',
    icon: '🐘',
    color: 'border-blue bg-blue-light',
    count: '1 guide'
  },
  {
    title: 'Progress Tracking',
    description: 'Your solved questions persist locally. Track your journey across all lessons.',
    href: '/lessons',
    icon: '📊',
    color: 'border-rose bg-rose-light',
    count: 'saved locally'
  }
]

// Lesson topics grid — all 16 SQL modules offered
const topics = [
  ['SELECT & filtering', '🔍'],
  ['WHERE conditions', '🔎'],
  ['ORDER BY sorting', '📊'],
  ['GROUP BY & aggregation', '📦'],
  ['HAVING group filters', '🔬'],
  ['JOINs (all types)', '🔗'],
  ['Subqueries & EXISTS', '🪆'],
  ['CASE WHEN logic', '🔄'],
  ['CTEs & WITH clause', '📋'],
  ['Window Functions', '📈'],
  ['RANK / DENSE_RANK', '🏆'],
  ['String Functions', '🔤'],
  ['Pattern Matching', '🎯'],
  ['Set Operations', '🧩'],
  ['PostgreSQL features', '🐘'],
  ['Interview prep', '💼'],
]

// Home page component — hero, features, topics, how-it-works
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-20 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-light border-2 border-yellow text-text text-sm font-medium mb-6">
          ⚡ Crack SQL. Ace the Interview.
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight mb-4">
          Master SQL from<br />
          <span className="text-accent">zero to hero</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
          Interactive lessons with a built-in SQL engine and LeetCode-style practice.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/lessons"
            className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
          >
            Start Learning
          </Link>
          <Link
            href="/playground"
            className="px-6 py-3 rounded-xl bg-card text-text font-semibold text-sm border-2 border-border hover:border-accent hover:text-accent transition-all"
          >
            Try Playground
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {sections.map((section, i) => (
          <Link
            key={section.href + section.title}
            href={section.href}
            className="group bg-card border-2 border-border rounded-2xl p-6 card-hover"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{section.icon}</span>
              <span className="text-xs text-text-muted font-medium px-2 py-1 rounded-full bg-cream-dark border border-border">
                {section.count}
              </span>
            </div>
            <h3 className="text-lg font-bold text-text mb-2 group-hover:text-accent transition-colors">
              {section.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      {/* PostgreSQL Callout */}
      <div className="bg-gradient-to-br from-blue-light/50 to-card border-2 border-blue/30 rounded-3xl p-8 md:p-10 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-[120px] leading-none opacity-10 select-none pointer-events-none">🐘</div>
        <div className="flex items-start gap-4 mb-5">
          <span className="text-4xl">🐘</span>
          <div>
            <h2 className="text-2xl font-bold text-text mb-1">PostgreSQL Deep Dive</h2>
            <p className="text-sm text-text-secondary">
              EXPLAIN plans, B-tree construction visualization, indexing strategies, and PostgreSQL vs MySQL comparisons.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {[
            ['EXPLAIN ANALYZE', 'Read query plans and spot performance bottlenecks'],
            ['Index visualization', 'Watch a B-tree being built step by step'],
            ['Postgres vs MySQL', 'Feature comparison across 7 dimensions'],
          ].map(([title, desc]) => (
            <div key={title as string} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-blue/20">
              <span className="text-blue text-lg leading-none mt-0.5">▶</span>
              <div>
                <div className="text-sm font-semibold text-text">{title as string}</div>
                <div className="text-xs text-text-secondary mt-0.5">{desc as string}</div>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/postgres"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue text-white font-semibold text-sm border-2 border-blue hover:opacity-90 transition-opacity"
        >
          Open PostgreSQL Guide
          <span className="text-sm">→</span>
        </Link>
      </div>

      {/* What you'll learn */}
      <div className="bg-card border-2 border-border rounded-3xl p-8 md:p-10 animate-slide-up mb-20">
        <h2 className="text-2xl font-bold text-text mb-2">
          What you&apos;ll learn
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          14 comprehensive lessons covering the full SQL spectrum — from simple SELECT queries to advanced window functions and PostgreSQL internals.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map(([topic, icon]) => (
            <div key={topic as string} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-dark border border-border">
              <span className="text-lg">{icon as string}</span>
              <span className="text-sm font-medium text-text">{topic as string}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border-2 border-border rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-light border-2 border-blue flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-blue">1</span>
          </div>
          <h3 className="font-bold text-text mb-2">Learn</h3>
          <p className="text-sm text-text-secondary">Study each SQL concept with clear explanations, syntax references, and real examples.</p>
        </div>
        <div className="bg-card border-2 border-border rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-light border-2 border-green flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-green">2</span>
          </div>
          <h3 className="font-bold text-text mb-2">Practice</h3>
          <p className="text-sm text-text-secondary">Write SQL queries and get instant feedback. Our LeetCode-style checker validates your solution.</p>
        </div>
        <div className="bg-card border-2 border-border rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-light border-2 border-purple flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-purple">3</span>
          </div>
          <h3 className="font-bold text-text mb-2">Master</h3>
          <p className="text-sm text-text-secondary">Track your progress and revisit tough problems to solidify your understanding.</p>
        </div>
      </div>
    </div>
  )
}
