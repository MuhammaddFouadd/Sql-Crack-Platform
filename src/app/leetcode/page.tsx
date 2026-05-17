'use client'

import Link from 'next/link'
import { leetcodeProblems } from '@/lib/data/leetcode'
import { cn } from '@/lib/utils'

const diffConfig: Record<string, { label: string; classes: string }> = {
  easy: { label: 'Easy', classes: 'bg-green-light text-green border-green/30' },
  medium: { label: 'Medium', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  hard: { label: 'Hard', classes: 'bg-rose-light text-rose border-rose/30' },
}

export default function LeetCodePage() {
  const groups = {
    easy: leetcodeProblems.filter((p) => p.difficulty === 'easy'),
    medium: leetcodeProblems.filter((p) => p.difficulty === 'medium'),
    hard: leetcodeProblems.filter((p) => p.difficulty === 'hard'),
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-light border-2 border-yellow/30 text-yellow text-sm font-medium mb-4">
          ⚡ LeetCode SQL 50
        </div>
        <h1 className="text-4xl font-bold text-text mb-3">LeetCode SQL 50</h1>
        <p className="text-lg text-text-secondary max-w-xl">
          Practice with real LeetCode SQL problems. Each problem includes the statement, key concepts, hints, and solutions.
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
            <div className="grid gap-3">
              {items.map((problem) => (
                <Link
                  key={problem.id}
                  href={`/leetcode/${problem.id}`}
                  className="group bg-card border-2 border-border rounded-2xl p-5 card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'w-2 h-2 rounded-full',
                        problem.difficulty === 'easy' ? 'bg-green' : problem.difficulty === 'medium' ? 'bg-yellow' : 'bg-rose'
                      )} />
                      <h3 className="font-bold text-text group-hover:text-accent transition-colors">
                        {problem.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">{problem.keyConcept}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border', config.classes)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
