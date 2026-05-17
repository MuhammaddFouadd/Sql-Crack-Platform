'use client'

import TableViz from './TableViz'

interface CompareVizProps {
  before: { title: string; columns: (string | { name: string; type?: string })[]; data: (string | number | null)[][] }
  after: { title: string; columns: (string | { name: string; type?: string })[]; data: (string | number | null)[][] }
  label?: string
  className?: string
}

export default function CompareViz({ before, after, label, className }: CompareVizProps) {
  const diff = before.data.length - after.data.length
  return (
    <div className={className}>
      {label && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Before</span>
            <span className="text-xs text-text-muted font-mono">{before.data.length} rows</span>
          </div>
          <TableViz {...before} compact />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">After</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-mono">{after.data.length} rows</span>
              {diff !== 0 && (
                <span className={diff < 0 ? 'text-green text-xs' : 'text-rose text-xs'}>
                  {diff > 0 ? `−${diff}` : `+${Math.abs(diff)}`}
                </span>
              )}
            </div>
          </div>
          <TableViz {...after} compact />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-muted">
        <div className="w-3 h-0.5 rounded bg-border" />
        <span>Query transforms data from left to right</span>
        <div className="w-3 h-0.5 rounded bg-border" />
      </div>
    </div>
  )
}
