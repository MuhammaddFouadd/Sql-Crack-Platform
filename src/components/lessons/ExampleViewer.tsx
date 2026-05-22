'use client'

import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import initSqlJs from 'sql.js'
import { EXAMPLE_SCHEMA_SQL } from '@/lib/example-data'
import CodeBlock from '@/components/ui/CodeBlock'
import TableViz from '@/components/viz/TableViz'
import type { Database as SqlJsDatabase } from 'sql.js'
import { ArrowDown, ChevronDown, Database, Play, Table2 } from 'lucide-react'

interface SourceTable {
  columns: string[]
  rows: (string | number | null)[][]
}

interface RunResult {
  columns: string[]
  rows: (string | number | null)[][]
  error?: string
}

export interface ExampleData {
  title: string
  sql: string
  explanation: string
  sourceTables?: string[]
  cppRepresentation?: string
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex items-center gap-2 text-text-muted">
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <ArrowDown size={14} className="text-accent/60 animate-bounce" />
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>
    </div>
  )
}

function CollapseSection({
  open,
  onToggle,
  label,
  icon,
  iconColor,
  children,
}: {
  open: boolean
  onToggle: () => void
  label: string
  icon: React.ReactNode
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 mb-2 group"
      >
        <span className={`${iconColor}`}>{icon}</span>
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
        <div className="h-px flex-1 bg-border" />
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 ${!open ? '-rotate-90' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  )
}

const mdComponents: any = {
  table: ({ children }: any) => (
    <div className="overflow-x-auto overflow-y-auto max-h-96 my-3 rounded-xl border-2 border-border/60 bg-card">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-border bg-cream-dark px-3 py-1.5 text-left font-semibold text-text">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border border-border px-3 py-1.5 text-text-secondary">{children}</td>
  ),
}

export default function ExampleViewer({ examples }: { examples: ExampleData[] }) {
  const dbRef = useRef<SqlJsDatabase | null>(null)
  const [ready, setReady] = useState(false)
  const [sourceCache, setSourceCache] = useState<Record<string, SourceTable>>({})
  const [results, setResults] = useState<RunResult[]>([])
  const [collapsed, setCollapsed] = useState<Set<number>>(() => new Set(examples.map((_, i) => i)))
  const [sections, setSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
      if (cancelled) return
      const db = new SQL.Database()
      db.run(EXAMPLE_SCHEMA_SQL)
      if (cancelled) { db.close(); return }
      dbRef.current = db

      const allTables = [...new Set(examples.flatMap(e => e.sourceTables || []))]
      const cache: Record<string, SourceTable> = {}
      for (const t of allTables) {
        try {
          const r = db.exec(`SELECT * FROM ${t}`)
          if (r.length) cache[t] = { columns: r[0].columns, rows: r[0].values as (string | number | null)[][] }
        } catch { /* ok */ }
      }
      if (!cancelled) setSourceCache(cache)

      const runs: RunResult[] = examples.map(ex => {
        try {
          const r = db.exec(ex.sql)
          if (r.length) {
            const last = r[r.length - 1]
            return { columns: last.columns, rows: last.values as (string | number | null)[][] }
          }
          return { columns: [], rows: [] }
        } catch (e) {
          return { columns: [], rows: [], error: String(e) }
        }
      })
      if (!cancelled) { setResults(runs); setReady(true) }
    })()
    return () => { cancelled = true; dbRef.current?.close() }
  }, [examples])

  const toggleEx = (idx: number) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  const secKey = (exIdx: number, name: string) => `${exIdx}-${name}`

  const toggleSec = (key: string) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const secOpen = (key: string): boolean => sections[key] ?? false

  if (!ready) return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-text-muted">
        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span className="text-sm animate-pulse">Loading examples...</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-10">
      {examples.map((ex, i) => {
        const res = results[i]
        const srcTables = ex.sourceTables || []

        return (
          <div key={i} className="relative">
            <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleEx(i)}
                className="w-full px-5 py-4 bg-cream-dark border-b-2 border-border flex items-center justify-between hover:bg-cream-darker/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent/10 border-2 border-accent/20 text-accent text-xs font-bold font-mono">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-bold text-text text-left">{ex.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {res && !res.error && !collapsed.has(i) && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cream-dark border border-border">
                        <Table2 size={12} />
                        {res.columns.length} cols
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cream-dark border border-border">
                        <Database size={12} />
                        {res.rows.length} rows
                      </span>
                    </div>
                  )}
                  <ChevronDown
                    size={18}
                    className={`text-text-muted transition-transform duration-300 ${collapsed.has(i) ? '-rotate-90' : ''}`}
                  />
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${collapsed.has(i) ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}>
                <div className="p-5 space-y-4">

                  {srcTables.length > 0 && (
                    <CollapseSection
                      open={secOpen(secKey(i, 'source'))}
                      onToggle={() => toggleSec(secKey(i, 'source'))}
                      label="Source Data"
                      icon={<Database size={14} />}
                      iconColor="text-accent"
                    >
                      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(srcTables.length, 2)}, 1fr)` }}>
                        {srcTables.map(t => {
                          const s = sourceCache[t]
                          if (!s) return null
                          return (
                            <div key={t} className="transition-all hover:shadow-sm">
                              <TableViz
                                title={t}
                                columns={s.columns.map(c => ({ name: c }))}
                                data={s.rows}
                                compact
                              />
                            </div>
                          )
                        })}
                      </div>
                    </CollapseSection>
                  )}

                  {secOpen(secKey(i, 'source')) && <FlowArrow />}

                  <CollapseSection
                    open={secOpen(secKey(i, 'query'))}
                    onToggle={() => toggleSec(secKey(i, 'query'))}
                    label="Query"
                    icon={<Play size={14} />}
                    iconColor="text-green"
                  >
                    <div className="border-2 border-border rounded-xl overflow-hidden">
                      <CodeBlock code={ex.sql} title="sql" />
                    </div>
                  </CollapseSection>

                  {secOpen(secKey(i, 'query')) && <FlowArrow />}

                  {ex.cppRepresentation && (
                    <>
                      <CollapseSection
                        open={secOpen(secKey(i, 'cpp'))}
                        onToggle={() => toggleSec(secKey(i, 'cpp'))}
                        label="C++ Intuitive Representation"
                        icon={<span className="text-base leading-none">⚙️</span>}
                        iconColor="text-purple"
                      >
                        <div className="border-2 border-border rounded-xl overflow-hidden">
                          <CodeBlock code={ex.cppRepresentation} title="cpp" />
                        </div>
                      </CollapseSection>
                      {secOpen(secKey(i, 'cpp')) && <FlowArrow />}
                    </>
                  )}

                  <CollapseSection
                    open={secOpen(secKey(i, 'result'))}
                    onToggle={() => toggleSec(secKey(i, 'result'))}
                    label="Result"
                    icon={<Table2 size={14} />}
                    iconColor="text-blue"
                  >
                    {res.error ? (
                      <div className="text-sm text-rose bg-rose-light border-2 border-rose/30 rounded-xl p-4 flex items-start gap-3">
                        <span className="mt-0.5 text-lg">⚠</span>
                        <div>
                          <p className="font-semibold text-rose mb-1">Query Error</p>
                          <p className="font-mono text-xs">{res.error}</p>
                        </div>
                      </div>
                    ) : res.columns.length > 0 ? (
                      <div className="overflow-x-auto overflow-y-auto max-h-96">
                        <TableViz
                          columns={res.columns.map(c => ({ name: c }))}
                          data={res.rows}
                          compact
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-text-muted bg-cream-dark border-2 border-border rounded-xl p-4 flex items-center gap-2">
                        <span>✓</span>
                        Query ran successfully — no rows returned.
                      </div>
                    )}
                  </CollapseSection>

                  <CollapseSection
                    open={secOpen(secKey(i, 'explanation'))}
                    onToggle={() => toggleSec(secKey(i, 'explanation'))}
                    label="Explanation"
                    icon={<span className="text-base leading-none">💡</span>}
                    iconColor="text-yellow"
                  >
                    <div className="text-sm text-text-secondary leading-relaxed markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {ex.explanation}
                      </ReactMarkdown>
                    </div>
                  </CollapseSection>

                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
