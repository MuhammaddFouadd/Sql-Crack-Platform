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
} from 'lucide-react'
import { formatSQL } from '@/lib/sql-format'

const SCHEMA_SQL = `
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL
);

INSERT INTO departments VALUES (1, 'Engineering', 500000);
INSERT INTO departments VALUES (2, 'Sales', 300000);
INSERT INTO departments VALUES (3, 'Marketing', 200000);
INSERT INTO departments VALUES (4, 'HR', 150000);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  salary REAL,
  department_id INTEGER REFERENCES departments(id),
  hire_date TEXT
);

INSERT INTO employees VALUES (1, 'Alice Johnson', 'alice@company.com', 95000, 1, '2022-03-15');
INSERT INTO employees VALUES (2, 'Bob Smith', 'bob@company.com', 82000, 1, '2023-01-10');
INSERT INTO employees VALUES (3, 'Carol Williams', 'carol@company.com', 75000, 2, '2022-06-20');
INSERT INTO employees VALUES (4, 'Dave Brown', 'dave@company.com', 68000, 2, '2024-02-01');
INSERT INTO employees VALUES (5, 'Eve Davis', 'eve@company.com', 90000, 1, '2021-11-01');
INSERT INTO employees VALUES (6, 'Frank Miller', 'frank@company.com', 55000, 3, '2023-09-15');
INSERT INTO employees VALUES (7, 'Grace Wilson', 'grace@company.com', 62000, 3, '2024-01-20');
INSERT INTO employees VALUES (8, 'Henry Taylor', 'henry@company.com', 48000, 4, '2023-04-10');
INSERT INTO employees VALUES (9, 'Ivy Anderson', 'ivy@company.com', 72000, 4, '2022-08-05');
INSERT INTO employees VALUES (10, 'Jack Thomas', 'jack@company.com', 88000, 1, '2023-06-12');

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  stock INTEGER
);

INSERT INTO products VALUES (1, 'Laptop Pro', 'Electronics', 1299.99, 50);
INSERT INTO products VALUES (2, 'Wireless Mouse', 'Electronics', 29.99, 200);
INSERT INTO products VALUES (3, 'Desk Chair', 'Furniture', 349.99, 30);
INSERT INTO products VALUES (4, 'Notebook Set', 'Stationery', 12.99, 500);
INSERT INTO products VALUES (5, 'Monitor 27"', 'Electronics', 449.99, 75);
INSERT INTO products VALUES (6, 'Standing Desk', 'Furniture', 899.99, 15);
INSERT INTO products VALUES (7, 'USB-C Hub', 'Electronics', 49.99, 150);
INSERT INTO products VALUES (8, 'Coffee Mug', 'Kitchen', 14.99, 300);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_name TEXT,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  order_date TEXT
);

INSERT INTO orders VALUES (1, 'Alice', 1, 1, '2024-01-15');
INSERT INTO orders VALUES (2, 'Bob', 2, 3, '2024-01-16');
INSERT INTO orders VALUES (3, 'Alice', 3, 1, '2024-02-01');
INSERT INTO orders VALUES (4, 'Charlie', 4, 10, '2024-02-10');
INSERT INTO orders VALUES (5, 'Bob', 5, 2, '2024-02-15');
INSERT INTO orders VALUES (6, 'Alice', 2, 1, '2024-03-01');
INSERT INTO orders VALUES (7, 'Diana', 6, 1, '2024-03-05');
INSERT INTO orders VALUES (8, 'Charlie', 7, 5, '2024-03-10');
`

interface Result {
  columns: string[]
  values: string[][]
}

type SortDir = 'asc' | 'desc' | null

export default function PlaygroundPage() {
  const [db, setDb] = useState<Database | null>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [queryTime, setQueryTime] = useState<number | null>(null)
  const [sortCol, setSortCol] = useState<number | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [copied, setCopied] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      try {
        const SQL = await initSqlJs({
          locateFile: () => '/sql-wasm.wasm',
        })
        const database = new SQL.Database()
        database.run(SCHEMA_SQL)
        setDb(database)
        setLoading(false)
      } catch (err) {
        setError('Failed to init SQL engine: ' + (err as Error).message)
        setLoading(false)
      }
    }
    init()
  }, [])

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

  const resetDb = useCallback(() => {
    if (!db) return
    try {
      db.run('DROP TABLE IF EXISTS orders')
      db.run('DROP TABLE IF EXISTS products')
      db.run('DROP TABLE IF EXISTS employees')
      db.run('DROP TABLE IF EXISTS departments')
      db.run(SCHEMA_SQL)
      setResults(null)
      setError(null)
      setQueryTime(null)
    } catch (err) {
      setError('Failed to reset: ' + (err as Error).message)
    }
  }, [db])

  const selectExample = (q: string) => {
    setQuery(q)
    setResults(null)
    setError(null)
  }

  const previewTable = (tableName: string) => {
    const q = `SELECT * FROM ${tableName} LIMIT 20;`
    setQuery(q)
    runQuery(q)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      runQuery()
    }
  }

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

  const toggleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null) }
    } else {
      setSortCol(colIdx)
      setSortDir('asc')
    }
  }

  const copyAsCsv = async () => {
    if (!results) return
    const header = results.columns.join(',')
    const rows = results.values.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))
    const csv = [header, ...rows].join('\n')
    await navigator.clipboard.writeText(csv)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="h-[calc(100vh-4rem)] flex animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-5 py-2.5 bg-card border-b-2 border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">▶</span>
              <h2 className="font-bold text-text text-sm">SQL Playground</h2>
            </div>
            <span className="text-[10px] text-text-muted bg-cream-dark border border-border px-2 py-0.5 rounded-full hidden sm:inline">
              {loading ? 'Loading...' : 'Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ExampleQueries onSelect={selectExample} />
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

      <SchemaPanel db={db} onPreview={previewTable} />
    </div>
  )
}
