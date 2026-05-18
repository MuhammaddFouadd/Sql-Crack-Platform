'use client'

import { useState, useEffect, useCallback } from 'react'
import initSqlJs, { Database } from 'sql.js'
import TableViz from '@/components/viz/TableViz'
import { Play, Download, Clipboard } from 'lucide-react'

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
`;

interface SqlRunnerProps {
  defaultQuery?: string
}

export default function SqlRunner({ defaultQuery = '' }: SqlRunnerProps) {
  const [db, setDb] = useState<Database | null>(null)
  const [query, setQuery] = useState(defaultQuery)
  const [results, setResults] = useState<{ columns: string[]; values: string[][] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let database: Database | null = null
    async function init() {
      try {
        const SQL = await initSqlJs({
          locateFile: () => '/sql-wasm.wasm',
        })
        database = new SQL.Database()
        database.run(SCHEMA_SQL)
        setDb(database)
        setLoading(false)
      } catch (err) {
        setError('Failed to init SQL: ' + (err as Error).message)
        setLoading(false)
      }
    }
    init()
    return () => { database?.close() }
  }, [])

  const runQuery = useCallback(() => {
    if (!db) return
    setError(null)
    setResults(null)

    try {
      const queries = query.split(';').map((q) => q.trim()).filter((q) => q.length > 0)
      if (queries.length === 0) return

      let lastResult: { columns: string[]; values: string[][] } | null = null

      for (const q of queries) {
        const stmt = db.prepare(q)
        const cols = stmt.getColumnNames()
        const rows: string[][] = []
        while (stmt.step()) {
          rows.push(stmt.get().map((v) => (v === null || v === undefined ? 'NULL' : String(v))))
        }
        lastResult = { columns: cols, values: rows }
        stmt.free()
      }

      if (lastResult) setResults(lastResult)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [db, query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      runQuery()
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
    <div className="space-y-3" onKeyDown={handleKeyDown}>
      <div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write your SQL query here..."
          className="w-full font-mono text-sm bg-card border-2 border-border rounded-xl p-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors resize-y min-h-[120px]"
          spellCheck={false}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={runQuery}
              disabled={loading || !db}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-xl border-2 border-accent hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play size={14} />
              Run
              <span className="text-[10px] opacity-60 hidden sm:inline">⌘⏎</span>
            </button>
            {loading && (
              <span className="text-xs text-text-muted">Loading SQL engine...</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <button
                onClick={copyAsCsv}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all"
              >
                {copied ? <Clipboard size={13} /> : <Download size={13} />}
                {copied ? 'Copied!' : 'CSV'}
              </button>
            )}
            <span className="text-xs text-text-muted">Tables: employees, departments, products, orders</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-light border-2 border-rose/30 rounded-xl p-3 text-sm text-text font-mono">
          {error}
        </div>
      )}

      {results && (
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span>{results.values.length} row{results.values.length !== 1 ? 's' : ''}</span>
            <span className="opacity-30">·</span>
            <span>{results.columns.length} columns</span>
          </div>
          <TableViz
            columns={results.columns}
            data={results.values}
            compact
          />
        </div>
      )}
    </div>
  )
}
