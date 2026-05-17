'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

type JoinAlgorithm = 'nested-loop' | 'hash' | 'merge'

interface JoinStepData {
  title: string
  columns: string[]
  data: (string | number | null)[][]
  highlightRows?: number[]
}

const stepsData: Record<JoinAlgorithm, {
  label: string
  complexity: string
  bestFor: string
  steps: JoinStepData[]
  explanation: string
}> = {
  'nested-loop': {
    label: 'Nested Loop Join',
    complexity: 'O(n × m)',
    bestFor: 'Small tables or when one table is very small',
    steps: [
      { title: 'employees (outer loop)', columns: ['name', 'dept_id'], data: [['Alice', '1'], ['Bob', '2'], ['Carol', '1']] },
      { title: 'departments (inner loop)', columns: ['id', 'name'], data: [['1', 'Engineering'], ['2', 'Sales'], ['3', 'Marketing']] },
      { title: 'comparisons made', columns: ['outer', 'outer.dept_id', 'inner.id', 'match?'], data: [
        ['Alice', '1', '1', '✓ JOIN'],
        ['Alice', '1', '2', '✗'],
        ['Alice', '1', '3', '✗'],
        ['Bob', '2', '1', '✗'],
        ['Bob', '2', '2', '✓ JOIN'],
        ['Bob', '2', '3', '✗'],
        ['Carol', '1', '1', '✓ JOIN'],
        ['Carol', '1', '2', '✗'],
        ['Carol', '1', '3', '✗'],
      ], highlightRows: [0, 4, 6] },
    ],
    explanation: 'For each row in the outer table (employees), PostgreSQL scans the ENTIRE inner table (departments). 3 outer rows × 3 inner rows = 9 total comparisons. The join condition (employees.dept_id = departments.id) is checked for every pair.'
  },
  hash: {
    label: 'Hash Join',
    complexity: 'O(n + m)',
    bestFor: 'Large tables, equi-joins, no index needed',
    steps: [
      { title: 'Phase 1: Build hash table', columns: ['departments (build input)', 'hash(id)', 'bucket'], data: [
        ['Engineering', 'hash(1)→0xA3', '#1'],
        ['Sales', 'hash(2)→0xB7', '#2'],
        ['Marketing', 'hash(3)→0xC1', '#3'],
      ]},
      { title: 'Phase 2: Probe with employees', columns: ['name', 'dept_id', 'hash(dept_id)', 'hash lookup', 'result'], data: [
        ['Alice', '1', '0xA3', '→ #1 Engineering', '✓ MATCH'],
        ['Bob', '2', '0xB7', '→ #2 Sales', '✓ MATCH'],
        ['Carol', '1', '0xA3', '→ #1 Engineering', '✓ MATCH'],
      ]},
      { title: 'final joined result', columns: ['name', 'department'], data: [
        ['Alice', 'Engineering'], ['Bob', 'Sales'], ['Carol', 'Engineering'],
      ]},
    ],
    explanation: 'Hash Join has two phases: BUILD and PROBE. First, PostgreSQL builds an in-memory hash table from the smaller table (departments), hashing the join key (id). Then it scans the larger table (employees) and for each row, computes the hash of dept_id and looks it up. Hash lookups are O(1), making this very fast.'
  },
  merge: {
    label: 'Merge Join',
    complexity: 'O(n + m)',
    bestFor: 'Pre-sorted data, range joins, large tables',
    steps: [
      { title: 'Step 1: Sort employees by dept_id', columns: ['name', 'dept_id'], data: [['Alice', '1'], ['Carol', '1'], ['Bob', '2']] },
      { title: 'Step 2: Sort departments by id', columns: ['id', 'name'], data: [['1', 'Engineering'], ['2', 'Sales'], ['3', 'Marketing']] },
      { title: 'Step 3: Merge — advance pointers', columns: ['pointer A', 'dept_id', 'pointer B', 'id', 'match?'], data: [
        ['Alice', '1', 'Engineering', '1', '✓ (advance both)'],
        ['Carol', '1', 'Engineering', '1', '✓ (advance both)'],
        ['Bob', '2', 'Sales', '2', '✓ (advance both)'],
        ['—', '—', 'Marketing', '3', '✗ (no more employees)'],
      ]},
    ],
    explanation: 'Both inputs are sorted on the join key. Two pointers advance through each sorted list. When keys match, a joined row is emitted. When keys differ, the smaller pointer advances. Each row is read only once per table — very efficient for large sorted datasets.'
  }
}

export default function JoinEngine({ className }: { className?: string }) {
  const [algo, setAlgo] = useState<JoinAlgorithm>('nested-loop')
  const [step, setStep] = useState(0)

  const data = stepsData[algo]

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <h3 className="text-sm font-bold text-text mb-3">Join Algorithm Internals</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(stepsData) as [JoinAlgorithm, typeof data][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setAlgo(key); setStep(0) }}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all',
                algo === key ? 'bg-card text-text border-accent shadow-sm' : 'bg-cream-dark text-text-muted border-border hover:border-accent/50'
              )}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4 px-1">
          <span className={cn(
            'text-[10px] font-mono font-bold px-2 py-0.5 rounded',
            algo === 'nested-loop' ? 'bg-rose-light text-rose' : algo === 'hash' ? 'bg-blue-light text-blue' : 'bg-purple-light text-purple'
          )}>
            {data.complexity}
          </span>
          <span className="text-xs text-text-muted">{data.bestFor}</span>
        </div>

        <div className="space-y-3">
          {data.steps.slice(0, step + 1).map((s, i) => (
            <div key={i} className={cn(
              'border-2 rounded-xl overflow-hidden transition-all duration-300',
              i === step ? 'border-accent shadow-sm' : 'border-border opacity-70'
            )}>
              <div className={cn(
                'px-4 py-2 text-xs font-semibold font-mono border-b-2',
                i === step ? 'bg-accent/10 text-accent border-accent/20' : 'bg-cream-dark text-text-muted border-border'
              )}>
                {s.title}
              </div>
              <TableViz columns={s.columns} data={s.data} highlightRows={s.highlightRows} compact />
            </div>
          ))}
        </div>

        {step >= data.steps.length - 1 && (
          <div className="mt-4 bg-green-light border-2 border-green/20 rounded-xl p-4 animate-fade-in">
            <div className="text-xs font-bold text-green mb-1">How {data.label} works</div>
            <p className="text-xs text-text-secondary leading-relaxed">{data.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all"
          >
            ← Prev Step
          </button>
          <span className="text-xs text-text-muted font-mono">Step {step + 1} of {data.steps.length}</span>
          <button
            onClick={() => setStep(Math.min(data.steps.length - 1, step + 1))}
            disabled={step >= data.steps.length - 1}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  )
}
