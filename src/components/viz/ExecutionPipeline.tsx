'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

interface PipelineStage {
  id: string
  label: string
  icon: string
  description: string
  detail: string
  inputTable?: { title: string; columns: string[]; data: (string | number | null)[][] }
  outputTable?: { title: string; columns: string[]; data: (string | number | null)[][] }
}

interface ExecutionPipelineProps {
  title?: string
  sql?: string
  stages: PipelineStage[]
  className?: string
}

const StageCard = ({ stage, active, completed }: { stage: PipelineStage; active: boolean; completed: boolean }) => (
  <div className={cn(
    'border-2 rounded-xl p-4 transition-all duration-500',
    active ? 'border-accent bg-accent/5 shadow-sm scale-[1.02]' : completed ? 'border-green/30 bg-green-light/30' : 'border-border bg-card'
  )}>
    <div className="flex items-center gap-3 mb-2">
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all',
        active ? 'bg-accent text-white border-accent' : completed ? 'bg-green-light text-green border-green/30' : 'bg-cream-dark text-text-muted border-border'
      )}>
        {completed ? '✓' : stage.icon}
      </div>
      <div>
        <div className="text-sm font-bold text-text">{stage.label}</div>
        <div className="text-xs text-text-muted">{stage.description}</div>
      </div>
    </div>
    {active && (
      <div className="animate-fade-in mt-3 space-y-3">
        <p className="text-xs text-text-secondary leading-relaxed bg-cream-dark rounded-xl p-3 border border-border">
          {stage.detail}
        </p>
        {stage.inputTable && (
          <TableViz {...stage.inputTable} compact />
        )}
        {stage.outputTable && (
          <div className="mt-2">
            <div className="text-xs font-semibold text-text-muted mb-1">Output:</div>
            <TableViz {...stage.outputTable} compact />
          </div>
        )}
      </div>
    )}
  </div>
)

export default function ExecutionPipeline({ title, sql, stages, className }: ExecutionPipelineProps) {
  const [activeIdx, setActiveIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)

  const next = useCallback(() => {
    setActiveIdx((prev) => Math.min(prev + 1, stages.length - 1))
  }, [stages.length])

  const prev = useCallback(() => {
    setActiveIdx((prev) => Math.max(prev - 1, -1))
  }, [])

  useEffect(() => {
    if (!playing) return
    if (activeIdx >= stages.length - 1) { setPlaying(false); return }
    const timer = setTimeout(next, 1800)
    return () => clearTimeout(timer)
  }, [playing, activeIdx, next, stages.length])

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      {title && (
        <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-text">{title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted font-mono px-2 py-0.5 bg-cream border border-border rounded">
                {stages.length} stages
              </span>
            </div>
          </div>
          {sql && (
            <pre className="text-xs font-mono text-text bg-cream border-2 border-border rounded-xl p-3 overflow-x-auto">
              {sql}
            </pre>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 px-5 py-3 bg-cream-dark border-b-2 border-border">
        <button onClick={() => { setPlaying(false); setActiveIdx(-1) }} className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text hover:border-accent/50 transition-all disabled:opacity-30">
          ↺ Reset
        </button>
        <button onClick={() => setPlaying(!playing)} className={cn(
          'px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all',
          playing ? 'bg-rose-light text-rose border-rose/30' : 'bg-accent text-white border-accent hover:opacity-90'
        )}>
          {playing ? '⏸ Pause' : '▶ Play All'}
        </button>
        <div className="flex gap-1 ml-auto">
          <button onClick={prev} disabled={activeIdx < 0} className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all">
            ← Prev
          </button>
          <button onClick={next} disabled={activeIdx >= stages.length - 1} className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all">
            Next →
          </button>
        </div>
      </div>

      <div className="p-5">
        {activeIdx < 0 ? (
          <div className="text-center py-12 text-text-muted">
            <div className="text-3xl mb-3">🎬</div>
            <p className="text-sm font-medium mb-1">Press &quot;Play All&quot; to see the full execution pipeline</p>
            <p className="text-xs">Or step through manually with ← Prev / Next →</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {stages.slice(0, activeIdx + 1).map((stage, i) => (
              <StageCard key={stage.id} stage={stage} active={i === activeIdx} completed={i < activeIdx} />
            ))}
          </div>
        )}
      </div>

      {activeIdx >= 0 && (
        <div className="px-5 py-3 bg-cream-dark border-t-2 border-border flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">Stage {activeIdx + 1} of {stages.length}</span>
          <div className="flex gap-1">
            {stages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setActiveIdx(i) }}
                className={cn(
                  'w-6 h-1.5 rounded-full transition-all duration-300',
                  i === activeIdx ? 'bg-accent w-8' : i < activeIdx ? 'bg-green' : 'bg-border'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">{stages[activeIdx].label}</span>
        </div>
      )}
    </div>
  )
}

export function createWherePipeline(): PipelineStage[] {
  return [
    {
      id: 'scan', label: 'Seq Scan', icon: '📡', description: 'Reads all rows from the table',
      detail: 'PostgreSQL performs a sequential scan on the employees table. It reads every row from disk into memory, one page at a time. For small tables, this is efficient. No index is used.',
      inputTable: { title: 'heap (on disk)', columns: ['page', 'rows'], data: [['1', 'Alice,Bob,Carol'], ['2', 'Dave,Eve']] },
      outputTable: { title: 'all rows read', columns: ['name', 'department', 'salary'], data: [
        ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'], ['Carol', 'Sales', '75000'],
        ['Dave', 'Sales', '68000'], ['Eve', 'Marketing', '55000'],
      ]},
    },
    {
      id: 'filter', label: 'Filter (WHERE)', icon: '🔎', description: 'Evaluates conditions on each row',
      detail: 'The WHERE clause checks each row: department = \'Engineering\'. PostgreSQL evaluates this boolean expression for every row. Rows that return TRUE continue; FALSE and NULL rows are discarded. This is called a "filter" or "qualification" in the plan.',
      inputTable: { title: 'input rows', columns: ['name', 'department', 'salary'], data: [
        ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'], ['Carol', 'Sales', '75000'],
        ['Dave', 'Sales', '68000'], ['Eve', 'Marketing', '55000'],
      ]},
      outputTable: { title: 'filtered rows', columns: ['name', 'department', 'salary'], data: [
        ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'],
      ]},
    },
    {
      id: 'project', label: 'Project (SELECT)', icon: '📐', description: 'Keeps only requested columns',
      detail: 'The projection step removes columns not in the SELECT list. Only "name" passes through. The other columns (department, salary) are discarded. This reduces the row width for subsequent operations.',
      inputTable: { title: 'before projection', columns: ['name', 'department', 'salary'], data: [['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000']] },
      outputTable: { title: 'projected columns', columns: ['name'], data: [['Alice'], ['Bob']] },
    },
    {
      id: 'output', label: 'Result', icon: '✅', description: 'Final result returned to client',
      detail: 'The executor sends the final rows to the client. PostgreSQL streams results row-by-row as they are produced — it does NOT wait for all rows to be ready (pipelined execution).',
      outputTable: { title: 'final result', columns: ['name'], data: [['Alice'], ['Bob']] },
    },
  ]
}

export function createJoinPipeline(joinType: 'Nested Loop' | 'Hash' | 'Merge' = 'Hash'): PipelineStage[] {
  return [
    {
      id: 'scan-a', label: 'Scan Table A', icon: '📡', description: 'Reads all rows from the outer table',
      detail: 'PostgreSQL scans the employees table. If join type is Nested Loop, this is the "outer" table. For Hash Join, this is the build input.',
      outputTable: { title: 'employees', columns: ['id', 'name', 'dept_id'], data: [['1', 'Alice', '1'], ['2', 'Bob', '2'], ['3', 'Carol', '1']] },
    },
    ...(joinType === 'Hash' ? [
      {
        id: 'hash-build', label: 'Hash Build Phase', icon: '🔨', description: 'Builds a hash table from the inner table',
        detail: 'PostgreSQL reads the departments table and builds a hash table in memory. The hash key is dept_id. Each entry maps a hash value to the matching row. This is the "build" phase of a Hash Join.',
        inputTable: { title: 'departments (input)', columns: ['id', 'name'], data: [['1', 'Engineering'], ['2', 'Sales'], ['3', 'Marketing']] },
        outputTable: { title: 'hash table (in memory)', columns: ['bucket', 'key', 'value'], data: [
          ['#0', 'hash(1)→0x4A', 'Engineering'],
          ['#1', 'hash(2)→0xB7', 'Sales'],
          ['#2', 'hash(3)→0x22', 'Marketing'],
        ]},
      },
      {
        id: 'hash-probe', label: 'Hash Probe Phase', icon: '🔍', description: 'Probes hash table for each outer row',
        detail: 'For each row in employees, PostgreSQL computes the hash of dept_id and looks it up in the hash table. If found, the rows are joined. This is O(1) per lookup — much faster than Nested Loop for large tables.',
        inputTable: { title: 'probing employees...', columns: ['id', 'name', 'dept_id', '→ hash'], data: [
          ['1', 'Alice', '1', 'hash(1)→0x4A ✓'], ['2', 'Bob', '2', 'hash(2)→0xB7 ✓'], ['3', 'Carol', '1', 'hash(1)→0x4A ✓'],
        ]},
        outputTable: { title: 'joined result', columns: ['id', 'name', 'department'], data: [
          ['1', 'Alice', 'Engineering'], ['2', 'Bob', 'Sales'], ['3', 'Carol', 'Engineering'],
        ]},
      },
    ] : joinType === 'Nested Loop' ? [
      {
        id: 'nested-loop', label: 'Nested Loop Join', icon: '🔄', description: 'For each outer row, scan inner table',
        detail: 'For EACH row in employees (outer), PostgreSQL scans ALL rows in departments (inner) looking for matches. This is O(n×m) — 3 employees × 3 departments = 9 comparisons. Good for small tables, terrible for large ones.',
        outputTable: { title: 'row-by-row comparison (9 total)', columns: ['outer', 'inner', 'match?'], data: [
          ['Alice', 'Engineering', '✓ (dept_id=1)'],
          ['Alice', 'Sales', '✗ (dept_id=1≠2)'],
          ['Alice', 'Marketing', '✗ (dept_id=1≠3)'],
          ['Bob', 'Engineering', '✗ (dept_id=2≠1)'],
          ['Bob', 'Sales', '✓ (dept_id=2)'],
          ['Bob', 'Marketing', '✗ (dept_id=2≠3)'],
          ['Carol', 'Engineering', '✓ (dept_id=1)'],
          ['Carol', 'Sales', '✗ (dept_id=1≠2)'],
          ['Carol', 'Marketing', '✗ (dept_id=1≠3)'],
        ]},
      },
    ] : [
      {
        id: 'sort-a', label: 'Sort Both Tables', icon: '📊', description: 'Sorts inputs on join key',
        detail: 'Both tables are sorted by the join column (dept_id). This is required for a Merge Join. Sorting is O(n log n) per table.',
        outputTable: { title: 'sorted employees by dept_id', columns: ['id', 'name', 'dept_id'], data: [['1', 'Alice', '1'], ['3', 'Carol', '1'], ['2', 'Bob', '2']] },
      },
      {
        id: 'merge-join', label: 'Merge Join', icon: '🔗', description: 'Walks both sorted inputs simultaneously',
        detail: 'Two pointers advance through the sorted inputs. When keys match, rows are joined. When keys differ, the smaller pointer advances. This is O(n+m) — very efficient for pre-sorted data.',
        outputTable: { title: 'merge join result', columns: ['name', 'department'], data: [
          ['Alice', 'Engineering'], ['Carol', 'Engineering'], ['Bob', 'Sales'],
        ]},
      },
    ]),
    {
      id: 'output-join', label: 'Result', icon: '✅', description: 'Final joined result',
      detail: 'The executor sends joined rows to the client. The join method chosen by the optimizer depends on table sizes, indexes, and available memory.',
      outputTable: { title: 'final result', columns: ['name', 'department'], data: [['Alice', 'Engineering'], ['Bob', 'Sales'], ['Carol', 'Engineering']] },
    },
  ]
}
