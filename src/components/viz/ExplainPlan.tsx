'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PlanNode {
  type: string
  strategy: string
  cost: { startup: number; total: number }
  rows: number
  width: number
  actualTime?: { first: number; last: number }
  actualRows?: number
  loops?: number
  condition?: string
  index?: string
  children?: PlanNode[]
}

const samplePlans: { name: string; sql: string; tree: PlanNode }[] = [
  {
    name: 'Simple Filter',
    sql: 'SELECT * FROM employees WHERE salary > 60000',
    tree: {
      type: 'Seq Scan', strategy: 'Sequential',
      cost: { startup: 0, total: 24.5 }, rows: 3, width: 36,
      actualTime: { first: 0.012, last: 0.045 }, actualRows: 3, loops: 1,
      condition: 'salary > 60000',
    },
  },
  {
    name: 'Join Query',
    sql: 'SELECT e.name, d.name FROM employees e JOIN departments d ON e.dept_id = d.id',
    tree: {
      type: 'Hash Join', strategy: 'Hash',
      cost: { startup: 0, total: 48.2 }, rows: 8, width: 24,
      actualTime: { first: 0.023, last: 0.067 }, actualRows: 8, loops: 1,
      condition: 'e.dept_id = d.id',
      children: [
        {
          type: 'Seq Scan', strategy: 'Sequential',
          cost: { startup: 0, total: 18.5 }, rows: 8, width: 12,
          actualTime: { first: 0.008, last: 0.031 }, actualRows: 8, loops: 1,
        },
        {
          type: 'Hash', strategy: 'Hash',
          cost: { startup: 0, total: 18.5 }, rows: 4, width: 12,
          actualTime: { first: 0.015, last: 0.015 }, actualRows: 3, loops: 1,
          children: [{
            type: 'Seq Scan', strategy: 'Sequential',
            cost: { startup: 0, total: 12.3 }, rows: 4, width: 12,
            actualTime: { first: 0.005, last: 0.022 }, actualRows: 3, loops: 1,
          }],
        },
      ],
    },
  },
  {
    name: 'With Index',
    sql: 'SELECT * FROM employees WHERE salary = 72000',
    tree: {
      type: 'Index Scan', strategy: 'Index',
      cost: { startup: 0, total: 8.3 }, rows: 1, width: 36,
      actualTime: { first: 0.004, last: 0.004 }, actualRows: 1, loops: 1,
      condition: 'salary = 72000',
      index: 'idx_employees_salary',
      children: [],
    },
  },
]

const typeColors: Record<string, string> = {
  'Seq Scan': 'bg-blue-light border-blue/30 text-blue',
  'Index Scan': 'bg-green-light border-green/30 text-green',
  'Hash Join': 'bg-purple-light border-purple/30 text-purple',
  'Hash': 'bg-yellow-light border-yellow/30 text-yellow',
  'Nested Loop': 'bg-rose-light border-rose/30 text-rose',
  'Merge Join': 'bg-blue-light border-blue/30 text-blue',
  'Sort': 'bg-yellow-light border-yellow/30 text-yellow',
}

function PlanNodeCard({ node, depth }: { node: PlanNode; depth: number }) {
  const [expanded, setExpanded] = useState(true)
  const colors = typeColors[node.type] || 'bg-cream-dark border-border text-text'

  return (
    <div className={cn('transition-all duration-300', depth > 0 && 'ml-6')}>
      <div className={cn(
        'border-2 rounded-xl overflow-hidden transition-all',
        depth === 0 ? 'border-accent shadow-sm' : 'border-border'
      )}>
        <button
          onClick={() => node.children?.length ? setExpanded(!expanded) : null}
          className={cn(
            'w-full px-4 py-2.5 flex items-center justify-between text-left',
            colors.split(' ')[0]
          )}
        >
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border', colors)}>
              {node.type}
            </span>
            {node.index && (
              <span className="text-[10px] font-mono text-text-muted bg-cream px-2 py-0.5 rounded border border-border">
                using {node.index}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-muted font-mono">
              cost={node.cost.startup}..{node.cost.total}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              rows={node.actualRows || node.rows}
            </span>
            {node.children?.length ? <span className="text-text-muted text-xs">{expanded ? '▼' : '▶'}</span> : null}
          </div>
        </button>

        {expanded && (
          <div className="px-4 py-3 space-y-2 animate-fade-in">
            {node.condition && (
              <div className="text-xs font-mono text-text bg-cream-dark rounded-lg px-3 py-1.5 border border-border">
                Filter: {node.condition}
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-text-muted">
              <span>Startup cost: <strong className="text-text">{node.cost.startup}</strong></span>
              <span>Total cost: <strong className="text-text">{node.cost.total}</strong></span>
              <span>Est. rows: <strong className="text-text">{node.rows}</strong></span>
              <span>Row width: <strong className="text-text">{node.width} bytes</strong></span>
              {node.actualTime && (
                <>
                  <span>Act. time: <strong className="text-text">{node.actualTime.first}..{node.actualTime.last} ms</strong></span>
                  <span>Act. rows: <strong className="text-text">{node.actualRows}</strong></span>
                </>
              )}
            </div>

            {node.children?.map((child, i) => (
              <PlanNodeCard key={i} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ExplainPlan({ className }: { className?: string }) {
  const [activePlan, setActivePlan] = useState(0)
  const plan = samplePlans[activePlan]

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <h3 className="text-sm font-bold text-text mb-3">EXPLAIN ANALYZE — Query Plan Visualizer</h3>
        <div className="flex flex-wrap gap-2">
          {samplePlans.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePlan(i)}
              className={cn('px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all',
                activePlan === i ? 'bg-card text-text border-accent shadow-sm' : 'bg-cream-dark text-text-muted border-border'
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 bg-cream-dark border-2 border-border rounded-xl p-3">
          <pre className="text-xs font-mono text-text overflow-x-auto whitespace-pre-wrap">{plan.sql}</pre>
        </div>

        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          Execution Plan
          <div className="h-px flex-1 bg-border" />
        </div>

        <PlanNodeCard node={plan.tree} depth={0} />

        <div className="mt-4 flex items-center gap-3 text-[10px] text-text-muted bg-cream-dark rounded-xl p-3 border border-border">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-blue-light border border-blue/30" /> Seq Scan</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-green-light border border-green/30" /> Index Scan</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-purple-light border border-purple/30" /> Hash Join</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-yellow-light border border-yellow/30" /> Hash/Sort</div>
        </div>
      </div>
    </div>
  )
}
