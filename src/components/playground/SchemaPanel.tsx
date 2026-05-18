'use client'

// ── Sidebar panel showing database schema tables and columns ──
import { useState, useEffect } from 'react'
import { Database } from 'sql.js'
import { ChevronDown, ChevronRight, Table as TableIcon, Eye } from 'lucide-react'

interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  pk: number
}

interface TableInfo {
  name: string
  columns: ColumnInfo[]
  rowCount: number
}

interface SchemaPanelProps {
  db: Database | null
  onPreview: (tableName: string) => void
}

// Queries sqlite_master + PRAGMA table_info to build a table list with columns and row counts
function loadSchema(db: Database): TableInfo[] {
  const tableNames: string[] = []
  const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  while (stmt.step()) {
    const row = stmt.get() as unknown[]
    tableNames.push(String(row[0]))
  }
  stmt.free()

  return tableNames.map((name) => {
    const cols: ColumnInfo[] = []
    const colStmt = db.prepare(`PRAGMA table_info('${name}')`)
    while (colStmt.step()) {
      const row = colStmt.get() as unknown[]
      cols.push({
        cid: Number(row[0]),
        name: String(row[1]),
        type: String(row[2]),
        notnull: Number(row[3]),
        pk: Number(row[4]),
      })
    }
    colStmt.free()

    let rowCount = 0
    try {
      const countStmt = db.prepare(`SELECT COUNT(*) FROM '${name}'`)
      if (countStmt.step()) rowCount = Number(countStmt.get()[0])
      countStmt.free()
    } catch {}

    return { name, columns: cols, rowCount }
  })
}

export default function SchemaPanel({ db, onPreview }: SchemaPanelProps) {
  const [tables, setTables] = useState<TableInfo[]>([]) // Parsed tables from the database
  const [expanded, setExpanded] = useState<Set<string>>(new Set()) // Track which tables are expanded
  const [collapsed, setCollapsed] = useState(false) // Whether the sidebar is hidden

  // Reload schema whenever the db instance changes
  useEffect(() => {
    if (!db) return
    setTables(loadSchema(db))
    setExpanded(new Set())
  }, [db])

  // Toggle a table's expanded/collapsed state
  const toggleTable = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text border-b-2 border-border w-full"
      >
        <TableIcon size={14} />
        <span>Schema</span>
      </button>
    )
  }

  return (
    <div className="w-64 border-r-2 border-border bg-cream-dark/50 flex-shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
        <div className="flex items-center gap-2">
          <TableIcon size={14} className="text-text-muted" />
          <span className="text-xs font-bold text-text uppercase tracking-wide">Schema</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-xs text-text-muted hover:text-text transition-colors"
        >
          Hide
        </button>
      </div>

      <div className="p-2 space-y-1">
        {tables.map((table) => (
          <div key={table.name}>
            <button
              onClick={() => toggleTable(table.name)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-card transition-colors text-left group"
            >
              {expanded.has(table.name) ? <ChevronDown size={14} className="text-text-muted flex-shrink-0" /> : <ChevronRight size={14} className="text-text-muted flex-shrink-0" />}
              <span className="text-sm font-semibold text-text flex-1 truncate">{table.name}</span>
              <span className="text-[10px] text-text-muted font-mono">{table.rowCount}</span>
            </button>

            {expanded.has(table.name) && (
              <div className="ml-6 pl-2 border-l-2 border-border space-y-0.5 mb-1">
                {table.columns.map((col) => (
                  <div key={col.cid} className="flex items-center gap-2 px-2 py-1">
                    <span className="text-xs font-mono text-text flex-1 truncate">{col.name}</span>
                    <span className="text-[10px] font-mono text-text-muted truncate max-w-[80px]">{col.type}</span>
                    {col.pk === 1 && <span className="text-[9px] font-semibold text-yellow bg-yellow-light px-1 rounded border border-yellow/30">PK</span>}
                    {col.notnull === 1 && col.pk === 0 && <span className="text-[9px] font-semibold text-rose bg-rose-light px-1 rounded border border-rose/30">NN</span>}
                  </div>
                ))}
                <button
                  onClick={() => onPreview(table.name)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-text-muted hover:text-text transition-colors"
                >
                  <Eye size={12} />
                  Preview data
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
