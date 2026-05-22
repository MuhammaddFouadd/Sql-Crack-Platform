'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

interface JoinVizProps {
  className?: string
}

export default function JoinViz({ className }: JoinVizProps) {
  const [joinType, setJoinType] = useState<'INNER' | 'LEFT' | 'RIGHT' | 'FULL'>('INNER')

  const tableA = {
    title: 'employees',
    columns: [{ name: 'id', type: 'int' }, { name: 'name', type: 'varchar' }, { name: 'dept_id', type: 'int' }],
    data: [
      ['1', 'Alice', '1'],
      ['2', 'Bob', '2'],
      ['3', 'Carol', '1'],
      ['4', 'Dave', '4'],
    ],
  }

  const tableB = {
    title: 'departments',
    columns: [{ name: 'id', type: 'int' }, { name: 'name', type: 'varchar' }],
    data: [
      ['1', 'Engineering'],
      ['2', 'Sales'],
      ['3', 'Marketing'],
    ],
  }

  const getMatchState = () => {
    const matches: Record<number, number[]> = {}
    for (let i = 0; i < tableB.data.length; i++) {
      const deptId = Number(tableB.data[i][0])
      if (!matches[deptId]) matches[deptId] = []
      matches[deptId].push(i)
    }
    return matches
  }

  const getResult = () => {
    const matches = getMatchState()
    const results: { name: string | null; department: string | null; matched: boolean }[] = []

    for (let i = 0; i < tableA.data.length; i++) {
      const aRow = tableA.data[i]
      const deptId = aRow[2]
      const matchedDepts = matches[Number(deptId)] || []

      if (matchedDepts.length > 0) {
        for (const mIdx of matchedDepts) {
          results.push({ name: aRow[1] as string, department: tableB.data[mIdx][1] as string, matched: true })
        }
      } else if (joinType === 'INNER') {
        continue
      } else if (joinType === 'LEFT' || joinType === 'FULL') {
        results.push({ name: aRow[1] as string, department: null, matched: false })
      }
    }

    if (joinType === 'RIGHT' || joinType === 'FULL') {
      for (let j = 0; j < tableB.data.length; j++) {
        const bRow = tableB.data[j]
        const deptId = j + 1
        const hasMatch = tableA.data.some((r) => Number(r[2]) === deptId)
        if (!hasMatch) {
          results.push({ name: null, department: bRow[1] as string, matched: false })
        }
      }
    }

    return results
  }

  const result = getResult()

  const joinColors = {
    INNER: { border: 'border-blue/40', bg: 'bg-blue-light', text: 'text-blue', dot: 'bg-blue' },
    LEFT: { border: 'border-green/40', bg: 'bg-green-light', text: 'text-green', dot: 'bg-green' },
    RIGHT: { border: 'border-purple/40', bg: 'bg-purple-light', text: 'text-purple', dot: 'bg-purple' },
    FULL: { border: 'border-rose/40', bg: 'bg-rose-light', text: 'text-rose', dot: 'bg-rose' },
  }

  const jc = joinColors[joinType]

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <h3 className="text-sm font-bold text-text mb-3">JOIN Visualizer</h3>
        <div className="flex flex-wrap gap-2">
          {(['INNER', 'LEFT', 'RIGHT', 'FULL'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setJoinType(type)}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all',
                joinType === type
                  ? 'bg-card text-text border-accent shadow-sm'
                  : 'bg-cream-dark text-text-muted border-border hover:border-accent/50'
              )}
            >
              {type} JOIN
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <TableViz {...tableA} compact />
          <TableViz {...tableB} compact />
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className={cn('w-2.5 h-2.5 rounded-full', jc.dot)} />
            <span className="text-xs font-semibold text-text uppercase tracking-wider">{joinType} JOIN Result</span>
            <span className="text-xs text-text-muted font-mono">{result.length} rows</span>
          </div>
          <div className="bg-card border-2 border-border rounded-xl overflow-x-auto overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-dark border-b-2 border-border">
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted font-mono text-left">employee</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted font-mono text-left">department</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-text-muted font-mono text-left w-20">match</th>
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-cream-dark/50 transition-colors">
                    <td className={cn('px-4 py-2.5 font-mono text-sm', r.name === null ? 'italic text-text-muted' : 'text-text')}>
                      {r.name ?? 'NULL'}
                    </td>
                    <td className={cn('px-4 py-2.5 font-mono text-sm', r.department === null ? 'italic text-text-muted' : 'text-text')}>
                      {r.department ?? 'NULL'}
                    </td>
                    <td className="px-4 py-2.5">
                      {r.matched ? (
                        <span className="text-[10px] font-semibold text-green bg-green-light px-2 py-0.5 rounded-full border border-green/30">✓</span>
                      ) : (
                        <span className="text-[10px] font-semibold text-text-muted bg-cream-dark px-2 py-0.5 rounded-full border border-border">NULL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={cn('border-2 rounded-xl p-4', jc.border, jc.bg)}>
          <div className={cn('text-xs font-bold mb-1', jc.text)}>How {joinType} JOIN works</div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {joinType === 'INNER' && 'Only rows with matching keys in both tables are returned. Employees without a department (dept_id=4) and departments without employees (Marketing) are excluded.'}
            {joinType === 'LEFT' && 'All rows from the left (employees) table are kept. Employees without a matching department get NULL for department name. Departments with no employees are NOT added.'}
            {joinType === 'RIGHT' && 'All rows from the right (departments) table are kept. Departments with no matching employees get NULL for employee name. Employees with no department are NOT added.'}
            {joinType === 'FULL' && 'All rows from both tables are kept. Unmatched rows on either side get NULL for the missing values. This is the union of LEFT and RIGHT JOIN.'}
          </p>
        </div>
      </div>
    </div>
  )
}
