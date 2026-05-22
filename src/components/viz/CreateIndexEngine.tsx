'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CreateIndexEngineProps {
  className?: string
}



const sortedRows = [
  ['106', 'Frank', '39000'],
  ['102', 'Bob', '45000'],
  ['108', 'Henry', '51000'],
  ['104', 'Dave', '55000'],
  ['101', 'Alice', '60000'],
  ['103', 'Carol', '72000'],
  ['105', 'Eve', '82000'],
  ['107', 'Grace', '95000'],
]

const leafPages = [
  { label: 'Leaf 1', values: ['39000', '45000'], names: ['Frank', 'Bob'], range: '39k – 45k' },
  { label: 'Leaf 2', values: ['51000', '55000'], names: ['Henry', 'Dave'], range: '51k – 55k' },
  { label: 'Leaf 3', values: ['60000', '72000'], names: ['Alice', 'Carol'], range: '60k – 72k' },
  { label: 'Leaf 4', values: ['82000', '95000'], names: ['Eve', 'Grace'], range: '82k – 95k' },
]

const internalNodeDefs = [
  { label: 'Internal 1', separator: '51000', leaves: [0, 1] },
  { label: 'Internal 2', separator: '82000', leaves: [2, 3] },
]

interface StepDef {
  id: string; icon: string; title: string; desc: string
}

const steps: StepDef[] = [
  {
    id: 'sort', icon: '📊', title: '1. Scan & Sort Rows',
    desc: 'PostgreSQL scans the employees table and extracts salary values paired with row pointers (TIDs). It then sorts all 8 rows by salary in ascending order — O(n log n) — preparing the data for B-tree packing.',
  },
  {
    id: 'leaves', icon: '📄', title: '2. Build Leaf Pages',
    desc: 'PostgreSQL packs pairs of adjacent entries into leaf pages (disk blocks). Each page stores up to 2 entries in sorted order. Leaf pages at the same level form a sorted linked list — the bottom layer of the B-tree.',
  },
  {
    id: 'internal', icon: '🔗', title: '3. Build Internal Pages',
    desc: 'PostgreSQL builds the internal (non-leaf) level. Each internal page stores separator values — the minimum key of the right subtree — and 2 child pointers that guide searches toward the correct leaf page.',
  },
  {
    id: 'tree', icon: '🌳', title: '4. Complete B-tree Index',
    desc: 'The root page is built from internal page boundaries. The B-tree is now complete — 3 levels deep, height-balanced. Any salary lookup takes O(log n) comparisons instead of scanning all n rows.',
  },
]

const StepDot = ({ active, completed }: { active: boolean; completed: boolean }) => (
  <button
    className={cn(
      'w-2.5 h-2.5 rounded-full transition-all duration-300',
      active ? 'bg-accent scale-125' : completed ? 'bg-green' : 'bg-border'
    )}
  />
)

function TreeConnector({ parentCount, childCount }: { parentCount: number; childCount: number }) {
  return (
    <div className="relative h-10 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        {Array.from({ length: parentCount }).map((_, pi) => {
          const px = (pi + 0.5) / parentCount * 100
          return (
            <line key={`p${pi}`} x1={px} y1="0" x2={px} y2="15" stroke="#d6cec6" strokeWidth="1.5" />
          )
        })}
        {childCount > 1 && (
          <line x1={100 / childCount / 2 * 100 / 100} y1="15" x2={100 - 100 / childCount / 2} y2="15" stroke="#d6cec6" strokeWidth="1.5" />
        )}
        {Array.from({ length: childCount }).map((_, ci) => {
          const cx = (ci + 0.5) / childCount * 100
          return (
            <line key={`c${ci}`} x1={cx} y1="15" x2={cx} y2="40" stroke="#d6cec6" strokeWidth="1.5" />
          )
        })}
      </svg>
    </div>
  )
}

export default function CreateIndexEngine({ className }: CreateIndexEngineProps) {
  const [step, setStep] = useState(-1)

  const current = steps[step]

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-light border-2 border-green/30 text-green text-xs font-medium">
            🗂️ CREATE INDEX
          </div>
          <span className="text-[10px] text-text-muted font-mono px-2 py-0.5 bg-cream border border-border rounded">
            {steps.length} stages
          </span>
        </div>
        <pre className="text-xs font-mono text-text bg-cream border-2 border-border rounded-xl p-3 overflow-x-auto">
          CREATE INDEX idx_salary ON employees(salary);
        </pre>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 bg-cream-dark border-b-2 border-border">
        <button
          onClick={() => setStep(-1)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text transition-all disabled:opacity-30"
        >
          ↺ Reset
        </button>
        <button
          onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
          disabled={step >= steps.length - 1}
          className="px-4 py-1.5 text-xs font-semibold rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all disabled:opacity-30"
        >
          Next →
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          {steps.map((_, i) => (
            <StepDot key={i} active={step === i} completed={step > i} />
          ))}
        </div>
      </div>

      <div className="p-5">
        {step < 0 ? (
          <div className="text-center py-12 text-text-muted">
            <div className="text-3xl mb-3">🌱</div>
            <p className="text-sm font-medium mb-1">Press &quot;Next →&quot; to see how PostgreSQL builds a B-tree index</p>
            <p className="text-xs">Watch CREATE INDEX transform raw data into a balanced search tree</p>
          </div>
        ) : (
          <div className="animate-fade-in space-y-5">
            <div className="bg-cream-dark border-2 border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{current.icon}</span>
                <h4 className="text-sm font-bold text-text">{current.title}</h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{current.desc}</p>
            </div>

            <div>
              {step === 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-mono">Employee table — sorted by salary</div>
                  <div className="border-2 border-border rounded-xl overflow-x-auto overflow-y-auto max-h-96">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-cream-dark border-b-2 border-border">
                          <th className="px-3 py-2 text-xs font-mono text-text-muted font-semibold text-left">#</th>
                          <th className="px-3 py-2 text-xs font-mono text-text-muted font-semibold text-left">id</th>
                          <th className="px-3 py-2 text-xs font-mono text-text-muted font-semibold text-left">name</th>
                          <th className="px-3 py-2 text-xs font-mono text-text-muted font-semibold text-left bg-yellow/15 text-text">salary ← index key</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRows.map((row, i) => (
                          <tr key={i} className="border-b border-border/50 last:border-0 font-mono text-sm">
                            <td className="px-3 py-2 text-text-muted text-xs">{i + 1}</td>
                            <td className="px-3 py-2 text-text">{row[0]}</td>
                            <td className="px-3 py-2 text-text">{row[1]}</td>
                            <td className="px-3 py-2 text-text bg-yellow/10 font-semibold">{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-light text-green rounded border border-green/20 font-mono text-[10px]">
                      O(n log n) sort
                    </span>
                    <span>8 rows sorted by salary ascending</span>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-mono">Leaf pages (2 entries per page)</div>
                  <div className="grid grid-cols-4 gap-3">
                    {leafPages.map((page, i) => (
                      <div key={i} className="border-2 border-border rounded-xl overflow-hidden bg-cream-dark">
                        <div className="px-3 py-1.5 bg-blue-light border-b-2 border-border text-xs font-bold text-blue font-mono text-center">
                          {page.label}
                        </div>
                        <div className="p-3 space-y-2">
                          {page.values.map((v, j) => (
                            <div key={j} className="flex items-center justify-between px-2 py-1.5 bg-card rounded-lg border border-border">
                              <span className="text-xs text-text-muted font-mono">{page.names[j]}</span>
                              <span className="text-sm font-bold text-text font-mono">{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 py-1 text-[10px] text-text-muted font-mono bg-cream border-t-2 border-border text-center">
                          range: {page.range}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-light text-blue rounded border border-blue/20 font-mono text-[10px]">
                      4 leaf pages
                    </span>
                    <span>Each page corresponds to 1 disk block</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-mono">Internal level — routing searches to the right leaf</div>
                  <div className="flex items-center justify-center gap-6 mb-4">
                    {internalNodeDefs.map((node, i) => (
                      <div key={i} className="border-2 border-border rounded-xl overflow-hidden bg-cream-dark w-44">
                        <div className="px-3 py-1.5 bg-purple-light border-b-2 border-border text-xs font-bold text-purple font-mono text-center">
                          {node.label}
                        </div>
                        <div className="p-3 text-center">
                          <div className="text-lg font-bold text-text font-mono">{node.separator}</div>
                          <div className="text-[10px] text-text-muted mt-1">separator value</div>
                          <div className="flex justify-center gap-2 mt-2">
                            {node.leaves.map((li) => (
                              <span key={li} className="text-[10px] px-2 py-0.5 bg-blue-light text-blue rounded border border-blue/20 font-mono">
                                → {leafPages[li].label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-text-secondary bg-cream-dark border-2 border-border rounded-xl p-3">
                    <strong className="text-text">How routing works:</strong> To find salary = 60000, start at the root. 60000 &gt; 51000, go right. At Internal 2, 60000 &lt; 82000, go left to Leaf 3. Scanned only 3 nodes instead of 8 rows.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider font-mono text-center">Complete B-tree — 3 levels, height-balanced</div>
                  <div className="flex flex-col items-center">
                    <div className="border-2 border-border rounded-xl bg-cream-dark px-6 py-3 text-center min-w-[200px]">
                      <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Root</div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="px-3 py-1 bg-card border border-border rounded-lg font-mono text-sm font-bold text-text">51000</span>
                        <span className="text-text-muted text-xs">|</span>
                        <span className="px-3 py-1 bg-card border border-border rounded-lg font-mono text-sm font-bold text-text">82000</span>
                      </div>
                      <div className="flex justify-center gap-4 mt-2">
                        <span className="text-[10px] px-2 py-0.5 bg-purple-light text-purple rounded border border-purple/20 font-mono">→ Internal 1</span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-light text-purple rounded border border-purple/20 font-mono">→ Internal 2</span>
                      </div>
                    </div>

                    <TreeConnector parentCount={1} childCount={2} />

                    <div className="flex items-center justify-center gap-6">
                      {internalNodeDefs.map((node, i) => (
                        <div key={i} className="border-2 border-border rounded-xl bg-cream-dark px-5 py-3 text-center min-w-[160px]">
                          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{node.label}</div>
                          <div className="text-lg font-bold text-text font-mono">{node.separator}</div>
                          <div className="flex justify-center gap-2 mt-1">
                            {node.leaves.map((li) => (
                              <span key={li} className="text-[10px] px-2 py-0.5 bg-blue-light text-blue rounded border border-blue/20 font-mono">
                                {leafPages[li].label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <TreeConnector parentCount={2} childCount={4} />

                    <div className="grid grid-cols-4 gap-3 w-full">
                      {leafPages.map((page, i) => (
                        <div key={i} className="border-2 border-border rounded-xl overflow-hidden bg-cream-dark">
                          <div className="px-2 py-1 bg-blue-light border-b-2 border-border text-[10px] font-bold text-blue font-mono text-center">
                            {page.label}
                          </div>
                          <div className="p-2 space-y-1">
                            {page.values.map((v, j) => (
                              <div key={j} className="flex items-center justify-between px-2 py-1 bg-card rounded-lg border border-border">
                                <span className="text-[10px] text-text-muted font-mono">{page.names[j]}</span>
                                <span className="text-xs font-bold text-text font-mono">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-green-light border-2 border-green/20 rounded-xl p-3">
                      <div className="text-[10px] font-bold text-green mb-0.5">Height</div>
                      <div className="text-lg font-bold text-text">3</div>
                      <div className="text-xs text-text-muted">levels</div>
                    </div>
                    <div className="bg-blue-light border-2 border-blue/20 rounded-xl p-3">
                      <div className="text-[10px] font-bold text-blue mb-0.5">Lookup cost</div>
                      <div className="text-lg font-bold text-text">O(log n)</div>
                      <div className="text-xs text-text-muted">3 comparisons max</div>
                    </div>
                    <div className="bg-yellow-light border-2 border-yellow/30 rounded-xl p-3">
                      <div className="text-[10px] font-bold text-yellow mb-0.5">vs Full Scan</div>
                      <div className="text-lg font-bold text-text">O(n)</div>
                      <div className="text-xs text-text-muted">8 rows checked</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {step >= 0 && (
        <div className="px-5 py-3 bg-cream-dark border-t-2 border-border flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">Stage {step + 1} of {steps.length}</span>
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <button key={s.id} onClick={() => setStep(i)} className={cn(
                'w-6 h-1.5 rounded-full transition-all duration-300',
                i === step ? 'bg-accent w-8' : i < step ? 'bg-green' : 'bg-border'
              )} />
            ))}
          </div>
          <span className="text-xs text-text-muted">{steps[step].title.replace(/^\d+\.\s*/, '')}</span>
        </div>
      )}
    </div>
  )
}
