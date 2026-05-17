'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

export default function WindowViz({ className }: { className?: string }) {
  const [activeRow, setActiveRow] = useState(0)
  const [func, setFunc] = useState<'RANK' | 'DENSE_RANK' | 'ROW_NUMBER' | 'SUM'>('RANK')

  const data = {
    columns: ['name', 'department', 'salary'],
    rows: [
      ['Alice', 'Engineering', '95000'],
      ['Bob', 'Engineering', '82000'],
      ['Carol', 'Engineering', '95000'],
      ['Dave', 'Sales', '75000'],
      ['Eve', 'Sales', '68000'],
      ['Frank', 'Marketing', '55000'],
    ],
  }

  const computeWindows = () => {
    type DeptGroup = { names: string[]; salaries: number[] }
    const depts: Record<string, DeptGroup> = {}
    for (const row of data.rows) {
      const dept = row[1] as string
      if (!depts[dept]) depts[dept] = { names: [], salaries: [] }
      depts[dept].names.push(row[0] as string)
      depts[dept].salaries.push(Number(row[2]))
    }
    return depts
  }

  const deptWindows = computeWindows()

  const getValues = () => {
    const values: (string | number)[] = []
    for (const row of data.rows) {
      const dept = row[1] as string
      const salary = Number(row[2])
      const deptSalaries = deptWindows[dept].salaries.slice().sort((a, b) => b - a)
      const deptSalariesDense = [...new Set(deptSalaries)]

      switch (func) {
        case 'RANK': {
          const rank = deptSalaries.indexOf(salary) + 1
          values.push(`#${rank}`)
          break
        }
        case 'DENSE_RANK': {
          const rank = deptSalariesDense.indexOf(salary) + 1
          values.push(`#${rank}`)
          break
        }
        case 'ROW_NUMBER': {
          const idx = deptWindows[dept].names.indexOf(row[0] as string)
          values.push(idx + 1)
          break
        }
        case 'SUM': {
          const idx = deptWindows[dept].names.indexOf(row[0] as string)
          const salaries = deptWindows[dept].salaries
          const running = salaries.slice(0, idx + 1).reduce((a: number, b: number) => a + b, 0)
          values.push(running)
          break
        }
      }
    }
    return values
  }

  const values = getValues()

  const funcLabels: Record<string, { desc: string; example: string }> = {
    RANK: { desc: 'Same rank for ties, skips next rank', example: '1, 1, 3' },
    DENSE_RANK: { desc: 'Same rank for ties, no skipping', example: '1, 1, 2' },
    ROW_NUMBER: { desc: 'Unique sequential number each row', example: '1, 2, 3' },
    SUM: { desc: 'Running total within partition', example: '50K, 100K, 150K' },
  }

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <h3 className="text-sm font-bold text-text mb-3">Window Function Visualizer</h3>
        <div className="flex flex-wrap gap-2">
          {(['RANK', 'DENSE_RANK', 'ROW_NUMBER', 'SUM'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFunc(f); setActiveRow(0) }}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all',
                func === f ? 'bg-card text-text border-accent shadow-sm' : 'bg-cream-dark text-text-muted border-border hover:border-accent/50'
              )}
            >
              {f}()
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <div className={cn(
            'border-2 rounded-xl p-3 mb-4 text-xs leading-relaxed',
            'bg-blue-light border-blue/20 text-text-secondary'
          )}>
            <strong className="text-blue block mb-1">{func}() — {funcLabels[func].desc}</strong>
            Example: {funcLabels[func].example} · Partitioned by <strong>department</strong>
          </div>

          <div className="bg-card border-2 border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-dark border-b-2 border-border">
                  <th className="w-8 px-3 py-2.5"></th>
                  {data.columns.map((col) => (
                    <th key={col} className="px-4 py-2.5 text-xs font-semibold text-text-muted font-mono text-left">{col}</th>
                  ))}
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted font-mono text-left">{func}() OVER(...)</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, i) => {
                  const isActive = i === activeRow
                  const partitionRows = data.rows
                    .map((r, idx) => ({ row: r, idx }))
                    .filter((r) => r.row[1] === row[1])
                  const isInPartition = partitionRows.some((r) => r.idx === i)

                  return (
                    <tr
                      key={i}
                      onClick={() => setActiveRow(i)}
                      className={cn(
                        'border-b border-border/50 last:border-0 cursor-pointer transition-all duration-300',
                        isActive ? 'bg-yellow/10' : isInPartition ? 'bg-blue-light/30' : '',
                        'hover:bg-cream-dark/80'
                      )}
                    >
                      <td className="px-3 py-2.5">
                        <div className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          isActive ? 'bg-yellow scale-125' : isInPartition ? 'bg-blue' : 'bg-border'
                        )} />
                      </td>
                      {row.map((cell, j) => (
                        <td key={j} className={cn('px-4 py-2.5 font-mono text-sm', isActive ? 'font-semibold text-text' : 'text-text')}>
                          {cell}
                        </td>
                      ))}
                      <td className={cn(
                        'px-4 py-2.5 font-mono text-sm font-bold',
                        isActive ? 'text-accent' : 'text-text-muted'
                      )}>
                        {values[i]}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow/30 border-2 border-yellow" />
              <span>Selected row</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-light/60 border-2 border-blue/30" />
              <span>Window (partition)</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={data.rows.length - 1}
            value={activeRow}
            onChange={(e) => setActiveRow(Number(e.target.value))}
            className="w-32 h-1.5 accent-accent"
          />
        </div>
      </div>
    </div>
  )
}
