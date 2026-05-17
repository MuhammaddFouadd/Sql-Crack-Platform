'use client'

import { cn } from '@/lib/utils'

interface Column {
  name: string
  type?: string
}

interface TableVizProps {
  title?: string
  columns: (Column | string)[]
  data: (string | number | null)[][]
  highlightRows?: number[]
  fadeRows?: number[]
  highlightCols?: number[]
  fadeCols?: number[]
  colorMap?: Record<number, { bg: string; label: string; color: string }>
  maxRows?: number
  className?: string
  compact?: boolean
}

const typeColors: Record<string, string> = {
  int: 'text-blue bg-blue-light border-blue/20',
  varchar: 'text-green bg-green-light border-green/20',
  text: 'text-green bg-green-light border-green/20',
  boolean: 'text-rose bg-rose-light border-rose/20',
  date: 'text-purple bg-purple-light border-purple/20',
  number: 'text-blue bg-blue-light border-blue/20',
  float: 'text-blue bg-blue-light border-blue/20',
  decimal: 'text-blue bg-blue-light border-blue/20',
}

export default function TableViz({
  title,
  columns,
  data,
  highlightRows = [],
  fadeRows = [],
  highlightCols = [],
  fadeCols = [],
  colorMap,
  maxRows,
  className,
  compact,
}: TableVizProps) {
  const cols = columns.map((c) => (typeof c === 'string' ? { name: c } : c))
  const displayData = maxRows ? data.slice(0, maxRows) : data
  const hasMore = maxRows ? data.length > maxRows : false

  const rowState = (i: number) => {
    if (colorMap && colorMap[i]) return colorMap[i]
    if (fadeRows.includes(i)) return { bg: 'opacity-30', label: 'filtered out', color: 'text-text-muted' }
    if (highlightRows.includes(i)) return { bg: 'bg-yellow/10', label: 'selected', color: 'text-text' }
    return { bg: '', label: '', color: 'text-text' }
  }

  const cellHighlight = (colIdx: number, rowIdx: number) => {
    if (fadeCols.includes(colIdx) || fadeRows.includes(rowIdx)) return 'opacity-30'
    if (highlightCols.includes(colIdx)) return 'bg-yellow/10 font-semibold'
    return ''
  }

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      {title && (
        <div className="px-5 py-3 bg-cream-dark border-b-2 border-border flex items-center justify-between">
          <span className="text-sm font-bold text-text font-mono">{title}</span>
          {compact && <span className="text-xs text-text-muted">{data.length} rows</span>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {!compact && <th className="w-10 px-3 py-2.5 text-xs text-text-muted bg-cream-dark border-b-2 border-border font-mono font-semibold">#</th>}
              {cols.map((col, i) => (
                <th
                  key={col.name}
                  className={cn(
                    'px-4 py-2.5 text-xs font-semibold font-mono border-b-2 border-border text-left transition-colors',
                    highlightCols.includes(i) ? 'bg-yellow/15 text-text' : 'bg-cream-dark text-text-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.name}</span>
                    {col.type && (
                      <span className={cn('text-[9px] px-1.5 py-0.5 rounded border font-medium', typeColors[col.type.toLowerCase()] || 'text-text-muted bg-cream-dark border-border')}>
                        {col.type}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, i) => {
              const state = rowState(i)
              return (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-border/50 last:border-0 transition-all duration-300',
                    state.bg,
                    'hover:bg-cream-dark/80'
                  )}
                >
                  {!compact && (
                    <td className="px-3 py-2.5 text-xs text-text-muted font-mono border-r border-border/30">
                      {i + 1}
                    </td>
                  )}
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cn(
                        'px-4 py-2.5 font-mono text-sm transition-all duration-300',
                        cellHighlight(j, i),
                        cell === null ? 'text-text-muted italic' : state.color
                      )}
                    >
                      {cell === null ? 'NULL' : String(cell)}
                      {j === row.length - 1 && state.label && (
                        <span className="ml-2 text-[10px] font-medium text-text-muted bg-cream-dark px-1.5 py-0.5 rounded border border-border">
                          {state.label}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="px-5 py-3 text-xs text-text-muted bg-cream-dark border-t-2 border-border text-center font-mono">
          ... and {data.length - maxRows!} more rows
        </div>
      )}
    </div>
  )
}
