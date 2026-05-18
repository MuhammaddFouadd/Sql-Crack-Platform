'use client'

import { useState } from 'react'
import type { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import { formatSQL } from '@/lib/sql-format'
import { PRACTICE_SCHEMA_SQL } from '@/lib/db-schema'
import { saveSolved, isSolved } from '@/lib/progress'
import { Check, X, Wand2, Eye, EyeOff, HelpCircle, Database } from 'lucide-react'

const SCHEMA_INFO: { table: string; columns: string[] }[] = [
  { table: 'customers', columns: ['id', 'name', 'email', 'phone', 'city', 'signup_date'] },
  { table: 'departments', columns: ['id', 'name', 'budget', 'city'] },
  { table: 'employees', columns: ['id', 'name', 'email', 'phone', 'salary', 'department', 'department_id', 'manager_id', 'hire_date', 'city'] },
  { table: 'products', columns: ['id', 'name', 'category', 'price', 'stock', 'units_sold'] },
  { table: 'orders', columns: ['id', 'customer_id', 'customer_name', 'product_id', 'quantity', 'total', 'order_date'] },
  { table: 'order_items', columns: ['id', 'order_id', 'product_id', 'quantity'] },
]

interface PracticeAnswerProps {
  lessonId: string
  question: string
  hint: string
  solution: string
  index: number
}

type CheckStatus = 'idle' | 'correct' | 'wrong' | 'error'

let sqlInitPromise: Promise<SqlJsStatic> | null = null

async function getSqlJs() {
  if (!sqlInitPromise) {
    const initSqlJs = (await import('sql.js')).default
    sqlInitPromise = initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
  }
  return sqlInitPromise
}

function sortRows(rows: string[][]): string[][] {
  return [...rows].sort((a, b) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const cmp = (a[i] ?? '').localeCompare(b[i] ?? '')
      if (cmp !== 0) return cmp
    }
    return 0
  })
}

function resultsEqual(user: { columns: string[]; values: string[][] }, solution: { columns: string[]; values: string[][] }): boolean {
  if (user.columns.length !== solution.columns.length) return false
  for (let i = 0; i < user.columns.length; i++) {
    if (user.columns[i] !== solution.columns[i]) return false
  }
  const uRows = sortRows(user.values.map((r) => r.map((v) => (v === null || v === undefined ? '' : String(v)))))
  const sRows = sortRows(solution.values.map((r) => r.map((v) => (v === null || v === undefined ? '' : String(v)))))
  if (uRows.length !== sRows.length) return false
  for (let i = 0; i < uRows.length; i++) {
    for (let j = 0; j < uRows[i].length; j++) {
      if (uRows[i][j] !== sRows[i][j]) return false
    }
  }
  return true
}

export default function PracticeAnswer({ lessonId, question, hint, solution, index }: PracticeAnswerProps) {
  const [userSql, setUserSql] = useState('')
  const [status, setStatus] = useState<CheckStatus>(() =>
    isSolved(lessonId, index) ? 'correct' : 'idle'
  )
  const [userResult, setUserResult] = useState<{ columns: string[]; values: string[][] } | null>(null)
  const [expectedResult, setExpectedResult] = useState<{ columns: string[]; values: string[][] } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showSchema, setShowSchema] = useState(false)

  const handleChange = (value: string) => {
    setUserSql(value)
    setStatus('idle')
    setUserResult(null)
    setExpectedResult(null)
    setErrorMsg(null)
  }

  const handleFormat = () => {
    if (userSql.trim()) {
      setUserSql(formatSQL(userSql))
    }
  }

  function execQuery(db: SqlJsDatabase, sql: string): { columns: string[]; values: string[][] } | null {
    try {
      const stmt = db.prepare(sql)
      const columns: string[] = stmt.getColumnNames()
      const values: string[][] = []
      while (stmt.step()) {
        values.push(stmt.get().map((v: unknown) => (v === null || v === undefined ? '' : String(v))))
      }
      stmt.free()
      return { columns, values }
    } catch {
      return null
    }
  }

  const checkAnswer = async () => {
    const trimmed = userSql.trim()
    if (!trimmed) return

    setUserResult(null)
    setExpectedResult(null)
    setErrorMsg(null)

    try {
      const SQL = await getSqlJs()
      const db = new SQL.Database()
      db.run(PRACTICE_SCHEMA_SQL)

      const userRes = execQuery(db, trimmed)
      const solRes = execQuery(db, solution)

      if (!userRes) {
        setErrorMsg('Your query has a syntax error. Check it and try again.')
        setStatus('error')
        db.close()
        return
      }

      if (!solRes) {
        setErrorMsg('Internal error: expected solution failed to execute.')
        setStatus('error')
        db.close()
        return
      }

      setUserResult({
        columns: userRes.columns,
        values: userRes.values.map((r) => r.map((v) => (v === null || v === undefined ? '' : String(v)))),
      })
      setExpectedResult({
        columns: solRes.columns,
        values: solRes.values.map((r) => r.map((v) => (v === null || v === undefined ? '' : String(v)))),
      })

      const correct = resultsEqual(userRes, solRes)
      setStatus(correct ? 'correct' : 'wrong')
      if (correct) saveSolved(lessonId, index)

      db.close()
    } catch (err) {
      setErrorMsg('Failed to check answer: ' + (err as Error).message)
      setStatus('error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      checkAnswer()
    }
  }

  const solved = status === 'correct'

  return (
    <details className={`bg-card border-2 rounded-2xl overflow-hidden group transition-colors ${solved ? 'border-green/40' : 'border-border'}`}>
      <summary className={`px-6 py-4 text-sm cursor-pointer transition-colors flex items-center gap-3 ${solved ? 'bg-green-light/30 text-green' : 'text-text hover:bg-border/20'}`}>
        <span className="font-semibold">Question {index + 1}</span>
        {solved && (
          <span className="flex items-center gap-1 text-[11px] text-green font-medium ml-auto">
            <Check size={13} />
            Solved
          </span>
        )}
      </summary>
      <div className="px-6 pb-6 space-y-4">
        <p className="text-text-secondary leading-relaxed text-sm">{question}</p>

        <button
          onClick={() => setShowSchema(!showSchema)}
          aria-label={showSchema ? 'Hide tables' : 'Show tables'}
          className="flex items-center gap-1.5 text-xs text-accent font-medium hover:opacity-80 transition-opacity"
        >
          <Database size={13} />
          {showSchema ? 'Hide tables' : 'Show tables'}
        </button>

        {showSchema && (
          <div className="bg-cream-dark border-2 border-border rounded-xl p-4 space-y-2 text-xs font-mono">
            {SCHEMA_INFO.map((t) => (
              <div key={t.table}>
                <span className="font-bold text-text">{t.table}</span>
                <span className="text-text-muted">
                  {' ('}
                  {t.columns.map((c, i) => (
                    <span key={c}>
                      {i > 0 && <span className="text-border">, </span>}
                      {c}
                    </span>
                  ))}
                  {')'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <textarea
            value={userSql}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your SQL answer here..."
            rows={4}
            spellCheck={false}
            className="w-full font-mono text-sm bg-cream-dark border-2 border-border rounded-xl p-4 text-text placeholder:text-text-muted/40 focus:outline-none focus:border-accent transition-colors resize-y"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleFormat}
              disabled={!userSql.trim()}
              aria-label="Format SQL"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Wand2 size={13} />
              Format
            </button>

            <button
              onClick={checkAnswer}
              disabled={!userSql.trim()}
              aria-label="Check answer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-accent border-2 border-accent hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check size={13} />
              Check Answer
              <span className="text-[10px] opacity-60 hidden sm:inline">⌘⏎</span>
            </button>
          </div>
        </div>

        {status === 'correct' && (
          <div className="flex items-center gap-2 bg-green-light border-2 border-green/30 rounded-xl px-4 py-3">
            <Check size={16} className="text-green shrink-0" />
            <p className="text-sm text-text font-semibold">Correct! Great job.</p>
          </div>
        )}

        {status === 'wrong' && userResult && expectedResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-rose-light border-2 border-rose/30 rounded-xl px-4 py-3">
              <X size={16} className="text-rose shrink-0" />
              <p className="text-sm text-text font-semibold">Not quite right. Compare your result with the expected output below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-text">Your Result</span>
                  <span className="text-[10px] text-text-muted">({userResult.values.length} rows)</span>
                </div>
                <div className="bg-cream-dark border-2 border-border rounded-xl overflow-hidden">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr>
                        {userResult.columns.map((col, i) => (
                          <th key={i} className="px-3 py-2 text-left font-bold text-text bg-cream-darker border-b border-border">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userResult.values.slice(0, 10).map((row, ri) => (
                        <tr key={ri} className="border-b border-border/50 last:border-0">
                          {row.map((cell, ci) => (
                            <td key={ci} className={`px-3 py-1.5 ${cell === '' ? 'text-text-muted italic' : 'text-text'}`}>{cell || 'NULL'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-text">Expected Result</span>
                  <span className="text-[10px] text-text-muted">({expectedResult.values.length} rows)</span>
                </div>
                <div className="bg-green-light/30 border-2 border-green/20 rounded-xl overflow-hidden">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr>
                        {expectedResult.columns.map((col, i) => (
                          <th key={i} className="px-3 py-2 text-left font-bold text-text bg-green-light/50 border-b border-green/20">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {expectedResult.values.slice(0, 10).map((row, ri) => (
                        <tr key={ri} className="border-b border-green/10 last:border-0">
                          {row.map((cell, ci) => (
                            <td key={ci} className={`px-3 py-1.5 ${cell === '' ? 'text-text-muted italic' : 'text-text'}`}>{cell || 'NULL'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 bg-rose-light border-2 border-rose/30 rounded-xl px-4 py-3">
            <X size={16} className="text-rose shrink-0" />
            <p className="text-sm text-text font-semibold">{errorMsg || 'Error checking answer.'}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHint(!showHint)}
            aria-label={showHint ? 'Hide hint' : 'Show hint'}
            className="flex items-center gap-1.5 text-xs text-blue font-medium hover:text-blue/80 transition-colors"
          >
            <HelpCircle size={13} />
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            aria-label={showSolution ? 'Hide solution' : 'Show solution'}
            className="flex items-center gap-1.5 text-xs text-green font-medium hover:text-green/80 transition-colors"
          >
            {showSolution ? <EyeOff size={13} /> : <Eye size={13} />}
            {showSolution ? 'Hide solution' : 'Show solution'}
          </button>
        </div>

        {showHint && (
          <div className="text-sm text-text-secondary bg-blue-light border-2 border-blue/20 rounded-xl p-4">
            {hint}
          </div>
        )}

        {showSolution && (
          <div className="bg-cream-dark border-2 border-border rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-text whitespace-pre">{solution}</pre>
          </div>
        )}
      </div>
    </details>
  )
}
