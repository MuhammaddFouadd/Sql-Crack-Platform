'use client'

import { useState, useCallback, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import initSqlJs, { Database } from 'sql.js'
import TableViz from '@/components/viz/TableViz'

const DEFAULT_QUERY = `-- Try some queries!
-- Tables are pre-loaded with sample data:

-- 1. See what tables are available
SELECT name FROM sqlite_master WHERE type='table';

-- 2. Query employees
SELECT * FROM employees LIMIT 10;

-- 3. Try a JOIN
SELECT 
  e.name,
  d.name AS department,
  e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC
LIMIT 5;

-- 4. Aggregation
SELECT 
  d.name AS department,
  COUNT(*) AS headcount,
  ROUND(AVG(e.salary), 2) AS avg_salary
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.name
HAVING COUNT(*) >= 2;
`

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

export default function PlaygroundPage() {
  const [db, setDb] = useState<Database | null>(null)
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [results, setResults] = useState<{ columns: string[]; values: any[][] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [queryTime, setQueryTime] = useState<number | null>(null)

  useEffect(() => {
    async function init() {
      try {
        const SQL = await initSqlJs({
          locateFile: () => `/sql-wasm.wasm`,
        })
        const database = new SQL.Database()
        database.run(SCHEMA_SQL)
        setDb(database)
        setLoading(false)
      } catch (err) {
        setError('Failed to initialize SQL engine: ' + (err as Error).message)
        setLoading(false)
      }
    }
    init()

    return () => {
      db?.close()
    }
  }, [])

  const runQuery = useCallback(() => {
    if (!db) return
    setError(null)
    setResults(null)
    setQueryTime(null)

    const start = performance.now()
    try {
      const queries = query.split(';').map((q) => q.trim()).filter((q) => q.length > 0)
      let lastResult: { columns: string[]; values: any[][] } | null = null

      for (const q of queries) {
        const stmt = db.prepare(q)
        const cols = stmt.getColumnNames()
        const rows: any[][] = []
        while (stmt.step()) {
          rows.push(stmt.get() as any[])
        }
        lastResult = { columns: cols, values: rows }
        stmt.free()
      }

      setResults(lastResult)
      setQueryTime(performance.now() - start)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [db, query])

  return (
    <div className="h-[calc(100vh-4rem)] flex animate-fade-in">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 bg-card border-b-2 border-border">
          <div className="flex items-center gap-3">
            <span className="text-lg">▶</span>
            <h2 className="font-bold text-text">SQL Playground</h2>
            {loading && (
              <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-cream-dark border border-border">
                Loading engine...
              </span>
            )}
          </div>
          <button
            onClick={runQuery}
            disabled={loading || !db}
            className="px-5 py-2 bg-accent text-white text-sm font-semibold rounded-xl border-2 border-accent hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ▶ Run
          </button>
        </div>

        <div className="flex-1 border-b-2 border-border">
          <Editor
            height="100%"
            defaultLanguage="sql"
            theme="light"
            value={query}
            onChange={(val) => setQuery(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        <div className="flex-1 overflow-auto bg-card">
          {loading && (
            <div className="flex items-center justify-center h-full text-text-muted text-sm">
              Loading SQL engine...
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-rose-light border-2 border-rose/30 rounded-2xl p-4 text-sm text-text font-mono">
                {error}
              </div>
            </div>
          )}

          {results && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-text-muted font-medium">
                  {results.values.length} row{results.values.length !== 1 ? 's' : ''}
                </span>
                {queryTime && (
                  <span className="text-xs text-text-muted">
                    in {queryTime.toFixed(1)}ms
                  </span>
                )}
              </div>
              <TableViz
                columns={results.columns}
                data={results.values}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
