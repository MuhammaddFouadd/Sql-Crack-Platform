'use client'

import { useState } from 'react'
import { hackerrankExercises } from '@/lib/data/hackerrank'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/ui/CodeBlock'
import SqlRunner from '@/components/SqlRunner'

const diffConfig: Record<string, { label: string; classes: string }> = {
  easy: { label: 'Easy', classes: 'bg-green-light text-green border-green/30' },
  medium: { label: 'Medium', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  hard: { label: 'Hard', classes: 'bg-rose-light text-rose border-rose/30' },
}

export default function HackerRankPage() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const groups = {
    easy: hackerrankExercises.filter((e) => e.difficulty === 'easy'),
    medium: hackerrankExercises.filter((e) => e.difficulty === 'medium'),
    hard: hackerrankExercises.filter((e) => e.difficulty === 'hard'),
  }

  const active = activeId ? hackerrankExercises.find((e) => e.id === activeId) : null

  if (active) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
        <button
          onClick={() => setActiveId(null)}
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-6"
        >
          ← Back to exercises
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-text">{active.title}</h1>
          <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full border', diffConfig[active.difficulty].classes)}>
            {diffConfig[active.difficulty].label}
          </span>
          <span className="text-xs text-text-muted px-2 py-0.5 rounded-md bg-cream-dark border border-border">
            {active.category}
          </span>
        </div>

        <div className="space-y-6">
          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Problem</h2>
            <div className="text-text leading-relaxed whitespace-pre-wrap text-sm font-mono">
              {active.problemStatement}
            </div>
          </div>

          <CodeBlock code={active.solution} title="sql" />

          <div className="bg-green-light border-2 border-green/20 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-green uppercase tracking-wider mb-2">Explanation</h2>
            <p className="text-sm text-text leading-relaxed">{active.explanation}</p>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✍</span>
              <h2 className="font-bold text-text">Try It Yourself</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Write your solution below and run it against the sample database.
            </p>
            <SqlRunner defaultQuery={`-- Write your solution here\nSELECT ...`} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-light border-2 border-rose/30 text-rose text-sm font-medium mb-4">
          ⭐ HackerRank Prep
        </div>
        <h1 className="text-4xl font-bold text-text mb-3">HackerRank Preparation</h1>
        <p className="text-lg text-text-secondary max-w-xl">
          Categorized SQL exercises to prepare for HackerRank challenges and earn the 5-star SQL badge.
        </p>
      </div>

      {(['easy', 'medium', 'hard'] as const).map((level) => {
        const items = groups[level]
        if (items.length === 0) return null
        const config = diffConfig[level]
        return (
          <div key={level} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', config.classes)}>
                {config.label}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-2">
              {items.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setActiveId(ex.id)}
                  className="group bg-card border-2 border-border rounded-xl p-4 text-left card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn('w-2 h-2 rounded-full', {
                        'bg-green': ex.difficulty === 'easy',
                        'bg-yellow': ex.difficulty === 'medium',
                        'bg-rose': ex.difficulty === 'hard',
                      })} />
                      <h3 className="font-semibold text-text group-hover:text-accent transition-colors">{ex.title}</h3>
                    </div>
                    <span className="text-xs text-text-muted">{ex.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
