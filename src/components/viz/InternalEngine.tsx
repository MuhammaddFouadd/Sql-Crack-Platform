'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

interface EngineStep {
  id: string
  label: string
  icon: string
  operation: string
  detail: string
  dataBefore: { title: string; columns: string[]; data: (string | number | null)[][] }
  dataAfter: { title: string; columns: string[]; data: (string | number | null)[][] }
  highlightBefore?: { rows?: number[]; cols?: number[] }
  highlightAfter?: { rows?: number[]; cols?: number[] }
  sqlNote?: string
}

interface InternalEngineProps {
  title?: string
  query: string
  steps: EngineStep[]
  className?: string
}

export default function InternalEngine({ title, query, steps, className }: InternalEngineProps) {
  const [activeStep, setActiveStep] = useState(-1)
  const [playing, setPlaying] = useState(false)

  const next = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  useEffect(() => {
    if (!playing) return
    if (activeStep >= steps.length - 1) { setPlaying(false); return } // eslint-disable-line react-hooks/set-state-in-effect
    const timer = setTimeout(next, 2200)
    return () => clearTimeout(timer)
  }, [playing, activeStep, next, steps.length])

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <h3 className="text-sm font-bold text-text mb-2">{title || 'Inside the Database Engine'}</h3>
        <pre className="text-xs font-mono text-text bg-cream border-2 border-border rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">
          {query}
        </pre>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 bg-cream-dark border-b-2 border-border">
        <button onClick={() => { setPlaying(false); setActiveStep(-1) }} className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all">
          ↺ Reset
        </button>
        <button onClick={() => setPlaying(!playing)} className={cn(
          'px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all',
          playing ? 'bg-rose-light text-rose border-rose/30' : 'bg-accent text-white border-accent'
        )}>
          {playing ? '⏸' : '▶ Play'}
        </button>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setActiveStep(Math.max(-1, activeStep - 1))} disabled={activeStep < 0} className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all">
            ← Prev
          </button>
          <button onClick={next} disabled={activeStep >= steps.length - 1} className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all">
            Next →
          </button>
        </div>
      </div>

      <div className="p-5">
        {activeStep < 0 ? (
          <div className="text-center py-10 text-text-muted">
            <div className="text-3xl mb-3">⚙️</div>
            <p className="text-sm font-medium mb-1">Watch how the database processes this query</p>
            <p className="text-xs">Press ▶ Play to see each internal operation</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in" key={activeStep}>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center text-sm border-2 font-bold',
                'bg-accent text-white border-accent'
              )}>
                {(activeStep + 1).toString()}
              </div>
              <div>
                <div className="text-sm font-bold text-text">{steps[activeStep].operation}</div>
                <div className="text-xs text-text-muted">{steps[activeStep].label}</div>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed bg-cream-dark border-2 border-border rounded-xl p-4">
              {steps[activeStep].detail}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-text-muted mb-2">Input to this step:</div>
                <TableViz
                  {...steps[activeStep].dataBefore}
                  highlightRows={steps[activeStep].highlightBefore?.rows}
                  highlightCols={steps[activeStep].highlightBefore?.cols}
                  compact
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-text-muted mb-2">After this step:</div>
                <TableViz
                  {...steps[activeStep].dataAfter}
                  highlightRows={steps[activeStep].highlightAfter?.rows}
                  highlightCols={steps[activeStep].highlightAfter?.cols}
                  compact
                />
              </div>
            </div>

            {steps[activeStep].sqlNote && (
              <div className="text-xs font-mono text-blue bg-blue-light border-2 border-blue/20 rounded-xl p-3">
                {steps[activeStep].sqlNote}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-cream-dark border-t-2 border-border flex items-center justify-between">
        <span className="text-xs text-text-muted font-mono">
          {activeStep < 0 ? 'Ready' : `Step ${activeStep + 1} of ${steps.length}`}
        </span>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setPlaying(false); setActiveStep(i) }}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                i === activeStep ? 'bg-accent scale-150' : i < activeStep ? 'bg-green' : 'bg-border'
              )}
            />
          ))}
        </div>
        <span className="text-xs text-text-muted">{activeStep >= 0 ? steps[activeStep].operation : ''}</span>
      </div>
    </div>
  )
}

export function createSelectInternal(query: string): { steps: EngineStep[] } {
  return {
    steps: [
      {
        id: 'parser', label: 'SQL text → parse tree', icon: '📝',
        operation: 'Parser',
        detail: 'PostgreSQL parses the SQL text into a parse tree. It checks syntax — keywords, identifiers, operators. If the SQL is malformed, it stops here with a syntax error.',
        dataBefore: { title: 'SQL text (input)', columns: ['character stream'], data: [[query]] },
        dataAfter: { title: 'parse tree (internal)', columns: ['node type', 'value'], data: [
          ['RawStmt', 'SELECT query'],
          ['TargetEntry', 'column: name'],
          ['RangeVar', 'relation: employees'],
        ]},
      },
      {
        id: 'planner', label: 'Parse tree → query plan', icon: '📐',
        operation: 'Query Planner',
        detail: 'The planner transforms the parse tree into one or more execution plans. It considers different strategies: sequential scan vs index scan, different join orders, etc. PostgreSQL\'s cost-based optimizer estimates the cost of each plan.',
        dataBefore: { title: 'parse tree', columns: ['node', 'value'], data: [
          ['SELECT', 'name'], ['FROM', 'employees'], ['WHERE', 'salary > 60000'],
        ]},
        dataAfter: { title: 'candidate plans', columns: ['plan', 'est. cost'], data: [
          ['Seq Scan (filter: salary > 60000)', '24.5'],
          ['Index Scan (idx_salary)', '8.3'],
        ]},
        highlightAfter: { rows: [1] },
      },
      {
        id: 'executor', label: 'Plan → execution', icon: '⚡',
        operation: 'Executor',
        detail: 'The executor runs the chosen plan. It opens the relation (table), reads tuples, evaluates filter conditions, projects columns, and returns results. PostgreSQL uses a "volcano" iterator model — each plan node pulls tuples from its children.',
        dataBefore: { title: 'chosen plan', columns: ['operation', 'detail'], data: [
          ['Seq Scan', 'table: employees'],
          ['Filter', 'salary > 60000'],
          ['Project', 'output: name'],
        ]},
        dataAfter: { title: 'execution state', columns: ['buffer', 'status'], data: [
          ['shared hit 3', '3 pages found in cache'],
          ['tuples out: 3', 'rows passed filter'],
          ['tuples removed: 2', 'rows failed filter'],
        ]},
      },
    ],
  }
}

export function createGroupByInternal(): { steps: EngineStep[] } {
  return { steps: [
    {
      id: 'scan-input', label: 'Scan all rows into memory', icon: '📡',
      operation: 'Scan + Sort',
      detail: 'PostgreSQL first scans all rows from the employees table. For Hash Aggregation, rows are hashed into buckets by the GROUP BY key. For Sort Aggregation (used here), rows are sorted by department first, then aggregated. The planner chooses based on memory limits and data size.',
      dataBefore: { title: 'employees (disk)', columns: ['name', 'department', 'salary'], data: [
        ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'],
        ['Carol', 'Sales', '75000'], ['Dave', 'Sales', '68000'],
        ['Eve', 'Marketing', '55000'],
      ]},
      dataAfter: { title: 'sorted by department', columns: ['name', 'department', 'salary'], data: [
        ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'],
        ['Eve', 'Marketing', '55000'], ['Carol', 'Sales', '75000'],
        ['Dave', 'Sales', '68000'],
      ]},
      highlightAfter: { cols: [1] },
    },
    {
      id: 'group-buckets', label: 'Create group buckets', icon: '📦',
      operation: 'Hash Aggregation',
      detail: 'PostgreSQL creates a hash table where each unique department becomes a bucket. As each row is processed, it is added to the appropriate bucket. The department value is the hash key. If work_mem is exceeded, the hash table spills to disk.',
      dataBefore: { title: 'sorted input stream', columns: ['row', 'department', 'action'], data: [
        ['Alice', 'Engineering', '→ bucket #hash(Eng)'], ['Bob', 'Engineering', '→ bucket #hash(Eng)'],
        ['Eve', 'Marketing', '→ bucket #hash(Mkt)'], ['Carol', 'Sales', '→ bucket #hash(Sls)'],
        ['Dave', 'Sales', '→ bucket #hash(Sls)'],
      ]},
      dataAfter: { title: 'hash table (memory)', columns: ['bucket', 'department', 'rows', 'running count'], data: [
        ['#hash(Eng)', 'Engineering', 'Alice, Bob', '2'],
        ['#hash(Mkt)', 'Marketing', 'Eve', '1'],
        ['#hash(Sls)', 'Sales', 'Carol, Dave', '2'],
      ]},
    },
    {
      id: 'aggregate', label: 'Compute aggregates per group', icon: '🧮',
      operation: 'Aggregation',
      detail: 'PostgreSQL evaluates aggregate functions for each group. AVG(salary) sums all salaries in the bucket and divides by the count. The aggregation state is maintained in memory as rows are added to buckets.',
      dataBefore: { title: 'hash table with raw values', columns: ['department', 'salaries'], data: [
        ['Engineering', '[95000, 82000]'], ['Marketing', '[55000]'], ['Sales', '[75000, 68000]'],
      ]},
      dataAfter: { title: 'aggregated result', columns: ['department', 'avg(salary)', 'count(*)'], data: [
        ['Engineering', '88500', '2'], ['Marketing', '55000', '1'], ['Sales', '71500', '2'],
      ]},
    },
  ]
  }
}

export function createWindowInternal(): { steps: EngineStep[] } {
  return { steps: [
    {
      id: 'scan-partition', label: 'Sort rows into partitions', icon: '📊',
      operation: 'Partition Sort',
      detail: 'PostgreSQL sorts the data by the PARTITION BY columns first. Each unique department forms a partition. Within each partition, rows are ordered by the ORDER BY clause in the window definition.',
      dataBefore: { title: 'employees (unsorted)', columns: ['name', 'department', 'salary'], data: [
        ['Alice', 'Engineering', '95000'], ['Bob', 'Engineering', '82000'],
        ['Carol', 'Sales', '75000'], ['Dave', 'Sales', '68000'],
        ['Eve', 'Marketing', '55000'],
      ]},
      dataAfter: { title: 'sorted by department, then salary DESC', columns: ['name', 'department', 'salary', 'partition'], data: [
        ['Alice', 'Engineering', '95000', '→ P1'], ['Bob', 'Engineering', '82000', '→ P1'],
        ['Eve', 'Marketing', '55000', '→ P2'], ['Carol', 'Sales', '75000', '→ P3'],
        ['Dave', 'Sales', '68000', '→ P3'],
      ]},
      highlightAfter: { cols: [3] },
    },
    {
      id: 'window-eval', label: 'Evaluate window function per row', icon: '📈',
      operation: 'Window Function Evaluation',
      detail: 'For each row, PostgreSQL looks at the window frame (all rows in the same partition within the frame boundary). RANK() counts how many rows have a higher salary within the partition. The window function is evaluated for each row as the executor iterates through the sorted data.',
      dataBefore: { title: 'partition P1 (Engineering)', columns: ['name', 'salary', 'RANK() logic'], data: [
        ['Alice', '95000', '→ highest salary → rank 1'],
        ['Bob', '82000', '→ second highest → rank 2'],
      ]},
      dataAfter: { title: 'final result with window function', columns: ['name', 'department', 'salary', 'rank'], data: [
        ['Alice', 'Engineering', '95000', '1'],
        ['Bob', 'Engineering', '82000', '2'],
        ['Carol', 'Sales', '75000', '1'],
        ['Dave', 'Sales', '68000', '2'],
        ['Eve', 'Marketing', '55000', '1'],
      ]},
      highlightAfter: { cols: [3] },
      sqlNote: 'RANK() OVER (PARTITION BY department ORDER BY salary DESC) — The PARTITION BY creates separate windows per department. ORDER BY salary DESC defines the ranking order within each window.',
    },
  ]}
}

export function createSubqueryInternal(): { steps: EngineStep[] } {
  return { steps: [
    {
      id: 'inner-exec', label: 'Inner subquery executes first', icon: '🪆',
      operation: 'Subquery Execution (inner → outer)',
      detail: 'PostgreSQL executes the inner subquery first (initPlan). The result is materialized as a temporary result set. For correlated subqueries, the inner query is re-executed for each row of the outer query.',
      dataBefore: { title: 'inner query text', columns: ['component'], data: [['SELECT id FROM departments WHERE budget > 200000']] },
      dataAfter: { title: 'inner query result (temporary)', columns: ['id'], data: [['1'], ['2']] },
    },
    {
      id: 'outer-filter', label: 'Outer query filters using inner result', icon: '🔎',
      operation: 'Hash Semi Join (or IN lookup)',
      detail: 'PostgreSQL can convert IN (subquery) into a semi-join. It builds a hash table from the subquery result (1, 2). Then, for each row in employees, it probes the hash table to check if department_id is in the set.',
      dataBefore: { title: 'employees (probing)', columns: ['name', 'department_id', 'in {1,2}?'], data: [
        ['Alice', '1', '✓'], ['Bob', '1', '✓'], ['Carol', '2', '✓'], ['Dave', '3', '✗'], ['Eve', '3', '✗'],
      ]},
      dataAfter: { title: 'final result', columns: ['name', 'department_id'], data: [
        ['Alice', '1'], ['Bob', '1'], ['Carol', '2'],
      ]},
      highlightAfter: { rows: [0, 1, 2] },
    },
  ]}
}
