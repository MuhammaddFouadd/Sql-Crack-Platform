'use client'

import { use } from 'react'
import Link from 'next/link'
import { leetcodeProblems } from '@/lib/data/leetcode'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/ui/CodeBlock'
import TableViz from '@/components/viz/TableViz'
import SqlRunner from '@/components/SqlRunner'

const diffConfig: Record<string, { label: string; classes: string }> = {
  easy: { label: 'Easy', classes: 'bg-green-light text-green border-green/30' },
  medium: { label: 'Medium', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  hard: { label: 'Hard', classes: 'bg-rose-light text-rose border-rose/30' },
}

export default function LeetCodeProblem({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const problem = leetcodeProblems.find((p) => p.id === slug)

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Problem not found</h1>
        <Link href="/leetcode" className="text-accent hover:underline">← Back to LeetCode</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <Link href="/leetcode" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-6">
        ← Back to LeetCode
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-text">{problem.title}</h1>
        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full border', diffConfig[problem.difficulty].classes)}>
          {diffConfig[problem.difficulty].label}
        </span>
      </div>

      <div className="space-y-6">
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Problem Statement</h2>
          <div className="text-text leading-relaxed whitespace-pre-wrap font-mono text-sm">
            {problem.problemStatement}
          </div>
        </div>

        {problem.tables && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Example Data</h2>
            {problem.tables.map((table) => (
              <TableViz
                key={table.name}
                title={table.name}
                columns={table.columns}
                data={table.data}
                compact
              />
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-blue-light border-2 border-blue/20 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-blue uppercase tracking-wider mb-2">Key Concept</h2>
            <p className="text-sm text-text">{problem.keyConcept}</p>
          </div>
          <div className="bg-yellow-light border-2 border-yellow/20 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-yellow uppercase tracking-wider mb-2">💡 Hint</h2>
            <p className="text-sm text-text">{problem.hint}</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Solution</h2>
          <CodeBlock code={problem.solution} title="sql" />
        </div>

        {problem.optimizedSolution && (
          <div>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Optimized Solution</h2>
            <CodeBlock code={problem.optimizedSolution} title="sql" />
          </div>
        )}

        <div className="bg-green-light border-2 border-green/20 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-green uppercase tracking-wider mb-2">Explanation</h2>
          <p className="text-sm text-text leading-relaxed">{problem.explanation}</p>
        </div>

        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✍</span>
            <h2 className="font-bold text-text">Try It Yourself</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Write your solution and run it against the sample tables shown above.
          </p>
          <SqlRunner defaultQuery={`-- Write your solution here\nSELECT ...`} />
        </div>
      </div>
    </div>
  )
}
