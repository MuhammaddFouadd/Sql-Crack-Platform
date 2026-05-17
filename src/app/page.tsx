import Link from 'next/link'

const sections = [
  {
    title: 'SQL Lessons',
    description: 'From SELECT to Window Functions — a structured path from beginner to advanced.',
    href: '/lessons',
    icon: '📚',
    color: 'border-blue bg-blue-light',
    count: '14 topics'
  },
  {
    title: 'PostgreSQL',
    description: 'PostgreSQL-specific features: EXPLAIN, indexes, performance, and MySQL differences.',
    href: '/postgres',
    icon: '🐘',
    color: 'border-blue bg-blue-light',
    count: '1 guide'
  },
  {
    title: 'LeetCode SQL 50',
    description: 'Solve real LeetCode SQL problems with hints, solutions, and detailed explanations.',
    href: '/leetcode',
    icon: '⚡',
    color: 'border-yellow bg-yellow-light',
    count: '10 problems'
  },
  {
    title: 'HackerRank Prep',
    description: 'Categorized SQL exercises from easy to hard for HackerRank 5-star preparation.',
    href: '/hackerrank',
    icon: '⭐',
    color: 'border-rose bg-rose-light',
    count: '16 exercises'
  },
  {
    title: 'SQL Playground',
    description: 'Write and execute SQL queries in your browser with Monaco Editor.',
    href: '/playground',
    icon: '▶',
    color: 'border-green bg-green-light',
    count: 'interactive'
  }
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-light border-2 border-yellow text-text text-sm font-medium mb-6">
          ⚡ Master SQL. Ace the Interview.
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight mb-4">
          Learn SQL the<br />
          <span className="text-accent">modern way</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          Interactive lessons, real LeetCode problems, HackerRank prep, and a live SQL playground.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {sections.map((section, i) => (
          <Link
            key={section.href}
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

      <div className="bg-card border-2 border-border rounded-3xl p-8 md:p-10 animate-slide-up">
        <h2 className="text-2xl font-bold text-text mb-4">
          What you&apos;ll learn
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ['SELECT queries', '🔍'],
            ['WHERE & filtering', '🔎'],
            ['GROUP BY & aggregation', '📦'],
            ['JOINs (all types)', '🔗'],
            ['Subqueries & CTEs', '🪆'],
            ['Window functions', '📈'],
            ['RANK / DENSE_RANK', '🏆'],
            ['String Functions', '🔤'],
            ['Pattern Matching & Regex', '🎯'],
            ['Set Operations', '🧩'],
            ['PostgreSQL features', '🐘'],
            ['Interview prep', '💼'],
          ].map(([topic, icon]) => (
            <div key={topic as string} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cream-dark border border-border">
              <span className="text-lg">{icon as string}</span>
              <span className="text-sm font-medium text-text">{topic as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
