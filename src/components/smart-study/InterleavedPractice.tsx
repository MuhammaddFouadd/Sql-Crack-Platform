'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import { practiceProblems, type PracticeProblem } from '@/lib/smart-study/practice-problems'
import { useSmartStudyStore } from '@/lib/smart-study/store'
import { formatSQL } from '@/lib/sql-format'
import { PRACTICE_SCHEMA_SQL } from '@/lib/db-schema'
import { cn } from '@/lib/utils'
import { Shuffle, Lightbulb, CheckCircle2, XCircle, ChevronDown, ChevronUp, Code2, Wand2, Check, X, Database, Eye, EyeOff, HelpCircle, TableIcon } from 'lucide-react'

const SCHEMA_INFO: { table: string; columns: string[] }[] = [
  { table: 'customers', columns: ['id', 'name', 'email', 'phone', 'city', 'signup_date'] },
  { table: 'departments', columns: ['id', 'name', 'budget', 'city'] },
  { table: 'employees', columns: ['id', 'name', 'email', 'phone', 'salary', 'department', 'department_id', 'manager_id', 'hire_date', 'city'] },
  { table: 'products', columns: ['id', 'name', 'category', 'price', 'stock', 'units_sold'] },
  { table: 'orders', columns: ['id', 'customer_id', 'customer_name', 'product_id', 'quantity', 'total', 'order_date'] },
  { table: 'order_items', columns: ['id', 'order_id', 'product_id', 'quantity'] },
]

function parseTables(question: string): string[] {
  const match = question.match(/^Table:\s*(.+)$/m)
  if (!match) return []
  const raw = match[1].toLowerCase().trim()
  if (raw.includes('(no table') || raw.includes('new table') || raw.includes('ddl') || raw.includes('dml') || raw.includes('explanatory') || raw === 'n/a (ddl)' || raw === 'n/a (dml)') return []
  return raw.split(',').map(t => t.trim()).filter(t => SCHEMA_INFO.some(s => s.table === t))
}

function TablePreview({ columns, values }: { columns: string[]; values: string[][] }) {
  if (columns.length === 0) return <p className="text-xs text-text-muted italic">No data</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-2.5 py-1.5 text-left font-bold text-text bg-cream-darker border-b border-border whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, ri) => (
            <tr key={ri} className="border-b border-border/40 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-2.5 py-1 whitespace-nowrap ${cell === '' ? 'text-text-muted italic' : 'text-text'}`}>{cell || 'NULL'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const difficultyOrder = ['easy', 'medium', 'hard'] as const
type Difficulty = (typeof difficultyOrder)[number]
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
  if (user.columns.length === 0 && solution.columns.length === 0) return true
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
    try {
      db.run(sql)
      return { columns: [], values: [] }
    } catch {
      return null
    }
  }
}

export default function InterleavedPractice() {
  const { recordPractice } = useSmartStudyStore()
  const [index, setIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all')
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set())

  const [userSql, setUserSql] = useState('')
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [userResult, setUserResult] = useState<{ columns: string[]; values: string[][] } | null>(null)
  const [expectedResult, setExpectedResult] = useState<{ columns: string[]; values: string[][] } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [rawData, setRawData] = useState<{ table: string; columns: string[]; values: string[][] }[] | null>(null)
  const [loadingRaw, setLoadingRaw] = useState(false)

  const topics = useMemo(() => {
    return [...new Set(practiceProblems.map((p) => p.topic))].sort()
  }, [])

  const filtered = useMemo(() => {
    let result = practiceProblems
    if (topicFilter !== 'all') result = result.filter((p) => p.topic === topicFilter)
    if (difficultyFilter !== 'all') result = result.filter((p) => p.difficulty === difficultyFilter)
    return result
  }, [topicFilter, difficultyFilter])

  const current = filtered[index] ?? null

  const loadRawData = useCallback(async () => {
    if (rawData || loadingRaw || !current) return
    const tables = parseTables(current.question)
    if (tables.length === 0) return
    setLoadingRaw(true)
    try {
      const SQL = await getSqlJs()
      const db = new SQL.Database()
      db.run(PRACTICE_SCHEMA_SQL)
      const results = tables.map((table) => {
        const res = execQuery(db, `SELECT * FROM \`${table}\``)
        return { table, columns: res?.columns ?? [], values: res?.values ?? [] }
      })
      setRawData(results)
      db.close()
    } catch { setRawData([]) }
    setLoadingRaw(false)
  }, [current, rawData, loadingRaw])

  const resetInputs = useCallback(() => {
    setUserSql('')
    setStatus('idle')
    setUserResult(null)
    setExpectedResult(null)
    setErrorMsg(null)
    setShowHint(false)
    setShowSolution(false)
  }, [])

  const shuffleDeck = useCallback(() => {
    const avail = filtered.map((_, i) => i).filter((i) => !usedIndices.has(i))
    if (avail.length === 0) {
      setUsedIndices(new Set())
      setIndex(Math.floor(Math.random() * filtered.length))
    } else {
      setIndex(avail[Math.floor(Math.random() * avail.length)])
    }
    resetInputs()
  }, [filtered, usedIndices, resetInputs])

  const handleFormat = () => {
    if (userSql.trim()) {
      setUserSql(formatSQL(userSql))
    }
  }

  const checkAnswer = async () => {
    const trimmed = userSql.trim()
    if (!trimmed || !current) return

    setUserResult(null)
    setExpectedResult(null)
    setErrorMsg(null)

    try {
      const SQL = await getSqlJs()
      const db = new SQL.Database()
      db.run(PRACTICE_SCHEMA_SQL)

      const userRes = execQuery(db, trimmed)
      const solRes = execQuery(db, current.solution)

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
      recordPractice(current.topic, correct)
      setUsedIndices((prev) => new Set(prev).add(index))

      db.close()
    } catch (err) {
      setErrorMsg('Failed to check answer: ' + (err as Error).message)
      setStatus('error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newVal = userSql.slice(0, start) + '  ' + userSql.slice(end)
      setUserSql(newVal)
      requestAnimationFrame(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2
      })
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      checkAnswer()
    }
  }

  const nextProblem = () => {
    const remaining = filtered.map((_, i) => i).filter((i) => !usedIndices.has(i) && i !== index)
    if (remaining.length > 0) {
      setIndex(remaining[Math.floor(Math.random() * remaining.length)])
    } else {
      setUsedIndices(new Set())
      const next = (index + 1) % filtered.length
      setIndex(next)
      setUsedIndices(new Set())
    }
    resetInputs()
  }

  const totalUsed = usedIndices.size
  const totalFiltered = filtered.length

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-light border-2 border-blue/30 flex items-center justify-center">
            <Code2 size={20} className="text-blue" />
          </div>
          <div>
            <h2 className="font-bold text-text">Interleaved Practice</h2>
            <p className="text-xs text-text-muted">{totalUsed}/{totalFiltered} done this session</p>
          </div>
        </div>
        <button onClick={shuffleDeck} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all">
          <Shuffle size={13} />
          Shuffle
        </button>
      </div>

      <div className="mb-4 h-2 rounded-full bg-cream-dark border border-border overflow-hidden">
        <div className="h-full bg-blue rounded-full transition-all duration-500" style={{ width: `${totalFiltered > 0 ? (totalUsed / totalFiltered) * 100 : 0}%` }} />
      </div>

      <div className="mb-4">
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors">
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Filters
        </button>
        {showFilters && (
          <div className="mt-2 flex flex-wrap gap-2">
            <select
              value={topicFilter}
              onChange={(e) => { setTopicFilter(e.target.value); setIndex(0); setUsedIndices(new Set()); resetInputs() }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-cream-dark border border-border text-text font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Topics</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => { setDifficultyFilter(e.target.value as Difficulty | 'all'); setIndex(0); setUsedIndices(new Set()); resetInputs() }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-cream-dark border border-border text-text font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}
      </div>

      {current ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full border',
              current.difficulty === 'easy' ? 'bg-green-light text-green border-green/30' :
              current.difficulty === 'medium' ? 'bg-yellow-light text-yellow border-yellow/30' :
              'bg-rose-light text-rose border-rose/30'
            )}>
              {current.difficulty}
            </span>
            <span className="text-xs bg-purple-light text-purple font-semibold px-2 py-0.5 rounded-full border border-purple/30">
              {current.topic}
            </span>
          </div>

          <div className="bg-cream-dark border-2 border-border rounded-xl p-5">
            <p className="text-sm font-medium text-text leading-relaxed">{current.question}</p>
          </div>

          <details className="group text-xs">
            <summary className="flex items-center gap-1.5 text-accent font-medium cursor-pointer hover:opacity-80 transition-opacity list-none">
              <Database size={13} className="shrink-0" />
              <span>Schema / Tables</span>
              <ChevronDown size={12} className="ml-auto group-open:rotate-180 transition-transform text-text-muted" />
            </summary>
            <div className="mt-2 bg-cream-dark border-2 border-border rounded-xl p-4 space-y-2 font-mono">
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
          </details>

          <details className="group text-xs" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) loadRawData() }}>
            <summary className="flex items-center gap-1.5 text-green font-medium cursor-pointer hover:opacity-80 transition-opacity list-none">
              <TableIcon size={13} className="shrink-0" />
              <span>Raw Table Data</span>
              <ChevronDown size={12} className="ml-auto group-open:rotate-180 transition-transform text-text-muted" />
            </summary>
            <div className="mt-2 bg-cream-dark border-2 border-green/20 rounded-xl p-4 space-y-4">
              {loadingRaw && <p className="text-xs text-text-muted italic">Loading data...</p>}
              {!loadingRaw && rawData === null && <p className="text-xs text-text-muted italic">Open to view raw data from tables used in this question.</p>}
              {!loadingRaw && rawData !== null && rawData.length === 0 && <p className="text-xs text-text-muted italic">No table data available for this question type.</p>}
              {!loadingRaw && rawData !== null && rawData.map(({ table, columns, values }) => (
                <div key={table}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-text font-mono">{table}</span>
                    <span className="text-[10px] text-text-muted">({values.length} rows)</span>
                  </div>
                  <div className="bg-white/50 dark:bg-black/10 border border-border rounded-lg">
                    <TablePreview columns={columns} values={values} />
                  </div>
                </div>
              ))}
            </div>
          </details>

          <div className="space-y-3">
            <textarea
              value={userSql}
              onChange={(e) => { setUserSql(e.target.value); setStatus('idle'); setUserResult(null); setExpectedResult(null); setErrorMsg(null) }}
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Wand2 size={13} />
                Format
              </button>

              <button
                onClick={checkAnswer}
                disabled={!userSql.trim()}
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
              <CheckCircle2 size={16} className="text-green shrink-0" />
              <p className="text-sm text-text font-semibold">Correct! Great job.</p>
            </div>
          )}

          {status === 'wrong' && userResult && expectedResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-rose-light border-2 border-rose/30 rounded-xl px-4 py-3">
                <XCircle size={16} className="text-rose shrink-0" />
                <p className="text-sm text-text font-semibold">Not quite right. Compare your result with the expected output below.</p>
              </div>

              {userResult.columns.length === 0 ? (
                <div className="bg-cream-dark border-2 border-border rounded-xl px-4 py-3">
                  <p className="text-xs text-text-muted italic">DDL/DML statement executed (no result set to compare).</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-text">Your Result</span>
                      <span className="text-[10px] text-text-muted">({userResult.values.length} rows)</span>
                    </div>
                    <div className="bg-cream-dark border-2 border-border rounded-xl overflow-x-auto">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr>
                            {userResult.columns.map((col, i) => (
                              <th key={i} className="px-3 py-2 text-left font-bold text-text bg-cream-darker border-b border-border whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {userResult.values.slice(0, 10).map((row, ri) => (
                            <tr key={ri} className="border-b border-border/50 last:border-0">
                              {row.map((cell, ci) => (
                                <td key={ci} className={`px-3 py-1.5 whitespace-nowrap ${cell === '' ? 'text-text-muted italic' : 'text-text'}`}>{cell || 'NULL'}</td>
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
                    <div className="bg-green-light/30 border-2 border-green/20 rounded-xl overflow-x-auto">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr>
                            {expectedResult.columns.map((col, i) => (
                              <th key={i} className="px-3 py-2 text-left font-bold text-text bg-green-light/50 border-b border-green/20 whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {expectedResult.values.slice(0, 10).map((row, ri) => (
                            <tr key={ri} className="border-b border-green/10 last:border-0">
                              {row.map((cell, ci) => (
                                <td key={ci} className={`px-3 py-1.5 whitespace-nowrap ${cell === '' ? 'text-text-muted italic' : 'text-text'}`}>{cell || 'NULL'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
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
              className="flex items-center gap-1.5 text-xs text-blue font-medium hover:text-blue/80 transition-colors"
            >
              <HelpCircle size={13} />
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-1.5 text-xs text-green font-medium hover:text-green/80 transition-colors"
            >
              {showSolution ? <EyeOff size={13} /> : <Eye size={13} />}
              {showSolution ? 'Hide solution' : 'Show solution'}
            </button>
          </div>

          {showHint && (
            <div className="text-sm text-text-secondary bg-blue-light border-2 border-blue/20 rounded-xl p-4">
              {current.hint}
            </div>
          )}

          {showSolution && (
            <div className="bg-cream-dark border-2 border-border rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-text whitespace-pre">{current.solution}</pre>
            </div>
          )}

          {status !== 'idle' && (
            <button
              onClick={nextProblem}
              className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
            >
              Next Problem
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base font-semibold text-text mb-1">No problems match filters</p>
          <p className="text-sm text-text-muted">Try changing your topic or difficulty filter.</p>
        </div>
      )}
    </div>
  )
}
