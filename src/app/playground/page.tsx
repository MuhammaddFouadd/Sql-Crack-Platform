// Playground page — browser-based SQL engine with Monaco editor, schema browser, and result table
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import initSqlJs, { Database } from 'sql.js'
import SchemaPanel from '@/components/playground/SchemaPanel'
import ExampleQueries from '@/components/playground/ExampleQueries'
import QueryHistory, { addToHistory } from '@/components/playground/QueryHistory'
import {
  Play,
  RotateCcw,
  Download,
  Clipboard,
  Table as TableIcon,
  Wand2,
  Database as DatabaseIcon,
  ChevronDown,
} from 'lucide-react'
import { formatSQL } from '@/lib/sql-format'
import { SCHEMAS, type PlaygroundSchema } from '@/lib/playground-schemas'

interface Result {
  columns: string[]
  values: string[][]
}

type SortDir = 'asc' | 'desc' | null

export default function PlaygroundPage() {
  // State — database, query input, results, error, loading, sorting, schema
  const [db, setDb] = useState<Database | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [queryTime, setQueryTime] = useState<number | null>(null)
  const [sortCol, setSortCol] = useState<number | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [copied, setCopied] = useState(false)
  const [schemaId, setSchemaId] = useState<string>(SCHEMAS[0].id)
  const [schemaOpen, setSchemaOpen] = useState(false)
  // Refs — results scroll, DB instance, schema init guard
  const resultsRef = useRef<HTMLDivElement>(null)
  const dbRef = useRef<Database | null>(null)
  const schemaLoadedRef = useRef(false)

  // Initialize in-memory SQLite database with schema DDL
  const initDatabase = useCallback(async (schema: PlaygroundSchema) => {
    setLoading(true)
    setResults(null)
    setError(null)
    setQueryTime(null)
    try {
      if (dbRef.current) {
        dbRef.current.close()
        dbRef.current = null
      }
      const SQL = await initSqlJs({
        locateFile: () => '/sql-wasm.wasm',
      })
      const database = new SQL.Database()
      database.run(schema.sql)
      dbRef.current = database
      setDb(database)
      setLoading(false)
    } catch (err) {
      setError('Failed to init SQL engine: ' + (err as Error).message)
      setLoading(false)
    }
  }, [])

  // Init SQLite WASM engine on first mount
  useEffect(() => {
    if (!schemaLoadedRef.current) {
      schemaLoadedRef.current = true
      initDatabase(SCHEMAS[0])
    }
  }, [initDatabase])

  // Switch schema — reload DB with new schema DDL
  const switchSchema = useCallback((id: string) => {
    const schema = SCHEMAS.find((s) => s.id === id)
    if (!schema) return
    setSchemaId(id)
    setSchemaOpen(false)
    setQuery('')
    setResults(null)
    setError(null)
    setSortCol(null)
    setSortDir(null)
    schemaLoadedRef.current = false
    initDatabase(schema)
  }, [initDatabase])

  // Execute SQL — split by semicolons, return last result set
  const runQuery = useCallback((q?: string) => {
    const sql = (q ?? query).trim()
    if (!sql || !db) return
    setError(null)
    setResults(null)
    setQueryTime(null)
    setSortCol(null)
    setSortDir(null)

    const start = performance.now()
    try {
      const queries = sql.split(';').map((s) => s.trim()).filter(Boolean)
      let lastResult: Result | null = null

      for (const qs of queries) {
        const stmt = db.prepare(qs)
        const cols = stmt.getColumnNames()
        const rows: string[][] = []
        while (stmt.step()) {
          rows.push(stmt.get().map((v) => (v === null || v === undefined ? 'NULL' : String(v))))
        }
        lastResult = { columns: cols, values: rows }
        stmt.free()
      }

      if (lastResult) {
        setResults(lastResult)
      }
      setQueryTime(performance.now() - start)
      addToHistory(sql)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [db, query])

  // Reset DB — drop all known tables and re-run schema DDL
  const resetDb = useCallback(() => {
    if (!db) return
    const schema = SCHEMAS.find((s) => s.id === schemaId)
    if (!schema) return
    try {
      const tables = ['orders', 'products', 'employees', 'departments', 'order_items', 'customers', 'loans', 'books', 'members', 'authors']
      for (const t of tables) {
        try { db.run(`DROP TABLE IF EXISTS ${t}`) } catch {}
      }
      db.run(schema.sql)
      setResults(null)
      setError(null)
      setQueryTime(null)
    } catch (err) {
      setError('Failed to reset: ' + (err as Error).message)
    }
  }, [db, schemaId])

  // Select example query — populate editor
  const selectExample = (q: string) => {
    setQuery(q)
    setResults(null)
    setError(null)
  }

  // Preview table — run SELECT * FROM table LIMIT 20
  const previewTable = (tableName: string) => {
    const q = `SELECT * FROM ${tableName} LIMIT 20;`
    setQuery(q)
    runQuery(q)
  }

  // Cmd/Ctrl+Enter to run query
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      runQuery()
    }
  }

  // Sort result rows by column index and direction
  const sortedValues = useCallback(() => {
    if (!results || sortCol === null || sortDir === null) return results?.values ?? []
    const sorted = [...results.values]
    sorted.sort((a, b) => {
      const va = a[sortCol] ?? ''
      const vb = b[sortCol] ?? ''
      const na = parseFloat(va)
      const nb = parseFloat(vb)
      if (!isNaN(na) && !isNaN(nb)) {
        return sortDir === 'asc' ? na - nb : nb - na
      }
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
    return sorted
  }, [results, sortCol, sortDir])

  // Toggle sort — asc → desc → none
  const toggleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null) }
    } else {
      setSortCol(colIdx)
      setSortDir('asc')
    }
  }

  // Copy results as CSV to clipboard
  const copyAsCsv = async () => {
    if (!results) return
    const header = results.columns.join(',')
    const rows = results.values.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))
    const csv = [header, ...rows].join('\n')
    await navigator.clipboard.writeText(csv)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentSchema = SCHEMAS.find((s) => s.id === schemaId) || SCHEMAS[0]

  return (
    <div
      className="h-[calc(100vh-5.5rem)] flex animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Toolbar — schema selector, action buttons, run query */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-5 py-2.5 bg-card border-b-2 border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">▶</span>
              <h2 className="font-bold text-text text-sm">SQL Playground</h2>
            </div>

            {/* Schema selector */}
            <div className="relative">
              <button
                onClick={() => setSchemaOpen(!schemaOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent rounded-xl transition-all"
              >
                <DatabaseIcon size={12} />
                {currentSchema.name}
                <ChevronDown size={11} />
              </button>
              {schemaOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSchemaOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 z-20 w-44 bg-card border-2 border-border rounded-2xl shadow-lg overflow-hidden">
                    {SCHEMAS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => switchSchema(s.id)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                          s.id === schemaId
                            ? 'bg-cream-dark text-text'
                            : 'text-text-muted hover:text-text hover:bg-cream-dark/50'
                        }`}
                      >
                        {s.name}
                        <span className="block text-[10px] text-text-muted font-normal mt-0.5">{s.description}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span className="text-[10px] text-text-muted bg-cream-dark border border-border px-2 py-0.5 rounded-full hidden sm:inline">
              {loading ? 'Loading...' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ExampleQueries onSelect={selectExample} schemaId={schemaId} />
            <QueryHistory onSelect={selectExample} />

            <button
              onClick={() => setQuery(formatSQL(query))}
              disabled={!query.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Format SQL"
            >
              <Wand2 size={13} />
              Format
            </button>

            <button
              onClick={resetDb}
              disabled={loading || !db}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={13} />
              Reset
            </button>

            <button
              onClick={() => runQuery()}
              disabled={loading || !db || !query.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-accent border-2 border-accent hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play size={14} />
              Run
              <span className="text-[10px] opacity-60 hidden sm:inline">⌘⏎</span>
            </button>
          </div>
        </div>

        {/* Monaco SQL editor */}
        <div className="h-1/2 border-b-2 border-border min-h-[120px]">
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme="light"
            value={query}
            onChange={(val) => setQuery(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              tabSize: 2,
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* Results panel — loading, empty state, error, or data table */}
        <div ref={resultsRef} className="flex-1 overflow-auto bg-card">
          {loading && (
            <div className="flex items-center justify-center h-full text-text-muted text-sm">
              Loading SQL engine...
            </div>
          )}

          {!loading && !results && !error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-cream-dark border-2 border-border flex items-center justify-center mx-auto mb-4">
                  <TableIcon size={24} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-secondary mb-1">Write a query and hit <span className="font-semibold">Run</span></p>
                <p className="text-xs text-text-muted">Or browse the schema panel to preview tables</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-5">
              <div className="bg-rose-light border-2 border-rose/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-text">Error</span>
                </div>
                <pre className="text-sm text-text font-mono whitespace-pre-wrap">{error}</pre>
              </div>
            </div>
          )}

          {results && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted font-medium">
                    {results.values.length} row{results.values.length !== 1 ? 's' : ''}
                  </span>
                  {queryTime !== null && (
                    <span className="text-xs text-text-muted">
                      in {(queryTime).toFixed(1)}ms
                    </span>
                  )}
                </div>
                <button
                  onClick={copyAsCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all"
                >
                  {copied ? (
                    <>
                      <Clipboard size={13} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      CSV
                    </>
                  )}
                </button>
              </div>

              <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="w-10 px-3 py-2.5 text-xs text-text-muted bg-cream-dark border-b-2 border-border font-mono font-semibold text-center">
                          #
                        </th>
                        {results.columns.map((col, i) => (
                          <th
                            key={col}
                            onClick={() => toggleSort(i)}
                            className="px-4 py-2.5 text-xs font-semibold font-mono border-b-2 border-border text-left bg-cream-dark text-text-muted hover:bg-cream cursor-pointer select-none transition-colors"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{col}</span>
                              <span className="text-[10px] opacity-50">
                                {sortCol === i ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedValues().slice(0, 500).map((row, ri) => (
                        <tr
                          key={ri}
                          className="border-b border-border/50 last:border-0 hover:bg-cream-dark/80 transition-colors"
                        >
                          <td className="px-3 py-2 text-xs text-text-muted font-mono text-center border-r border-border/30">
                            {ri + 1}
                          </td>
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`px-4 py-2 font-mono text-sm transition-all ${
                                cell === 'NULL' ? 'text-text-muted italic' : 'text-text'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {results.values.length > 500 && (
                  <div className="px-5 py-3 text-xs text-text-muted bg-cream-dark border-t-2 border-border text-center font-mono">
                    Showing 500 of {results.values.length} rows — refine your query to see more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schema sidebar — browse tables, preview data */}
      <SchemaPanel db={db} onPreview={previewTable} />
    </div>
  )
}
