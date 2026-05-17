'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

interface IndexEngineProps {
  className?: string
}

const employees = [
  ['101', 'Alice', '60000'],
  ['102', 'Bob', '45000'],
  ['103', 'Carol', '72000'],
  ['104', 'Dave', '55000'],
  ['105', 'Eve', '82000'],
  ['106', 'Frank', '39000'],
  ['107', 'Grace', '95000'],
  ['108', 'Henry', '51000'],
]

interface BTreeNode { value: string; isTarget?: boolean }
const btreeLevels: { label: string; nodes: BTreeNode[] }[] = [
  { label: 'Root', nodes: [{ value: '60000' }] },
  { label: 'Internal', nodes: [{ value: '45000' }, { value: '72000' }] },
  { label: 'Leaf', nodes: [
    { value: '39000' }, { value: '45000' }, { value: '51000' }, { value: '55000' },
    { value: '60000' }, { value: '72000' }, { value: '82000' }, { value: '95000', isTarget: true },
  ]},
]

export default function IndexEngine({ className }: IndexEngineProps) {
  const [mode, setMode] = useState<'full-scan' | 'index'>('full-scan')
  const [scanStep, setScanStep] = useState(0)

  const targetSalary = '95000'

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <h3 className="text-sm font-bold text-text mb-3">Index Visualization</h3>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setMode('full-scan'); setScanStep(0) }}
            className={cn('px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all flex-1',
              mode === 'full-scan' ? 'bg-rose-light text-rose border-rose/30' : 'bg-card text-text-muted border-border'
            )}
          >
            ✗ Full Table Scan
          </button>
          <button
            onClick={() => { setMode('index'); setScanStep(0) }}
            className={cn('px-4 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all flex-1',
              mode === 'index' ? 'bg-green-light text-green border-green/30' : 'bg-card text-text-muted border-border'
            )}
          >
            ✓ B-tree Index Scan
          </button>
        </div>
        <div className="text-xs text-text-muted bg-cream border-2 border-border rounded-xl px-4 py-2 font-mono">
          SELECT * FROM employees WHERE salary = {targetSalary};
        </div>
      </div>

      <div className="p-5">
        {mode === 'full-scan' ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-rose uppercase tracking-wider">Sequential Scan</span>
              <span className="text-xs text-text-muted">— checks every row</span>
            </div>
            <div className="border-2 border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-dark border-b-2 border-border">
                    <th className="px-4 py-2 text-xs font-mono text-text-muted font-semibold text-left">#</th>
                    <th className="px-4 py-2 text-xs font-mono text-text-muted font-semibold text-left">scan</th>
                    <th className="px-4 py-2 text-xs font-mono text-text-muted font-semibold text-left">name</th>
                    <th className="px-4 py-2 text-xs font-mono text-text-muted font-semibold text-left">salary</th>
                    <th className="px-4 py-2 text-xs font-mono text-text-muted font-semibold text-left">salary = {targetSalary}?</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((row, i) => {
                    const isCurrent = i === scanStep && scanStep < employees.length
                    const isPast = i < scanStep
                    const isFound = row[2] === targetSalary
                    const checked = isPast || isCurrent
                    return (
                      <tr key={i} className={cn(
                        'border-b border-border/50 last:border-0 font-mono text-sm transition-all duration-300',
                        isCurrent && !isFound ? 'bg-rose-light/30' : '',
                        isFound && isPast ? 'bg-green-light/50' : '',
                        !checked ? 'opacity-40' : '',
                      )}>
                        <td className="px-4 py-2 text-text-muted">{i + 1}</td>
                        <td className="px-4 py-2">
                          {isCurrent ? <span className="text-rose text-xs font-bold">▼ SCANNING</span> : isPast ? <span className="text-text-muted text-xs">✓</span> : ''}
                        </td>
                        <td className="px-4 py-2 text-text">{row[1]}</td>
                        <td className="px-4 py-2 text-text">{row[2]}</td>
                        <td className="px-4 py-2">
                          {!checked ? (
                            <span className="text-text-muted">—</span>
                          ) : isFound ? (
                            <span className="text-green font-bold">✓ MATCH!</span>
                          ) : (
                            <span className="text-rose/60">✗</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {scanStep < employees.length && (
              <div className="mt-3 text-xs text-text-muted text-center">
                {scanStep < employees.length - 1
                  ? `Scanning row ${scanStep + 1} of ${employees.length}...`
                  : 'Scan complete — found 1 matching row'}
              </div>
            )}
            <div className="mt-4 bg-rose-light border-2 border-rose/20 rounded-xl p-4">
              <div className="text-xs font-bold text-rose mb-1">Cost: O(n) — {employees.length} rows checked</div>
              <p className="text-xs text-text-secondary">Every row is read from disk and checked. For a table with 1 million rows, this means checking all 1 million entries. The entire table is loaded into memory even though only one row matches.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-green uppercase tracking-wider">B-tree Index Scan</span>
              <span className="text-xs text-text-muted">— traverses log₂(n) levels</span>
            </div>

            <div className="space-y-4">
              {btreeLevels.map((level, li) => (
                <div key={li}>
                  <div className="text-[10px] font-mono font-bold text-text-muted mb-2 uppercase tracking-wider">{level.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {level.nodes.map((node, ni) => {
                      const visited = li < 1 || (li === 1 && ni <= scanStep % 2) || (li === 2)
                      const highlighted = li === 1 && ni === scanStep % 2
                      return (
                        <div key={ni} className={cn(
                          'px-3 py-2 rounded-xl border-2 font-mono text-xs transition-all duration-500',
                          node.isTarget ? 'bg-green-light text-green border-green font-bold scale-105' :
                          highlighted ? 'bg-blue-light text-blue border-blue' :
                          visited ? 'bg-cream-dark text-text border-border' : 'bg-cream text-text-muted border-border opacity-30'
                        )}>
                          {node.value}
                          {node.isTarget && <span className="ml-1 text-[9px]">← target</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 justify-center">
              <button
                onClick={() => setScanStep(scanStep + 1)}
                disabled={scanStep >= 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text disabled:opacity-30 transition-all"
              >
                Step Through B-tree →
              </button>
              {scanStep > 0 && (
                <span className="text-xs text-green font-mono">Navigated to correct leaf node (3 comparisons vs {employees.length} full scan)</span>
              )}
            </div>

            <div className="mt-4 bg-green-light border-2 border-green/20 rounded-xl p-4">
              <div className="text-xs font-bold text-green mb-1">Cost: O(log n) — only ~3 comparisons</div>
              <p className="text-xs text-text-secondary">The B-tree index stores sorted salary values in a balanced tree structure. Instead of scanning all 8 rows, PostgreSQL traverses: root (60000) → internal (72000) → leaf (95000). For 1 million rows, this would be about 20 comparisons instead of 1 million.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="font-medium">Searching for: salary = {targetSalary}</span>
          </div>
          <button
            onClick={() => {
              setScanStep(0)
              setMode(mode)
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text transition-all"
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </div>
  )
}
