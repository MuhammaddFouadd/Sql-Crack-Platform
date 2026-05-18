'use client'

// ── Dropdown showing recent SQL queries saved to localStorage ──
import { useState } from 'react'
import { Clock, ChevronDown, Trash2 } from 'lucide-react'

const HISTORY_KEY = 'sql-playground-history'
const MAX_ENTRIES = 20

interface QueryHistoryProps {
  onSelect: (query: string) => void
}

// Save a query to localStorage history (deduped, most recent first)
export function addToHistory(query: string) {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    const history: string[] = saved ? JSON.parse(saved) : []
    const filtered = history.filter((q) => q !== query)
    filtered.unshift(query)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_ENTRIES)))
  } catch {}
}

export default function QueryHistory({ onSelect }: QueryHistoryProps) {
  const [open, setOpen] = useState(false) // Dropdown visibility
  const [queries, setQueries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Clear all history from localStorage and state
  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY)
    setQueries([])
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={queries.length === 0}
        aria-label="Open query history"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Clock size={13} />
        History
        <ChevronDown size={12} />
      </button>

      {open && queries.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 w-80 bg-card border-2 border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-border bg-cream-dark/50">
              <span className="text-xs font-bold text-text">Recent Queries</span>
              <button
                onClick={clearHistory}
                aria-label="Clear query history"
                className="flex items-center gap-1 text-[10px] text-text-muted hover:text-rose transition-colors"
              >
                <Trash2 size={11} />
                Clear
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
              {queries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(q)
                    setOpen(false)
                  }}
                  aria-label={`Load query: ${q.substring(0, 60)}`}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-text hover:bg-cream-dark transition-colors border border-transparent hover:border-border"
                >
                  <span className="block truncate">{q}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
