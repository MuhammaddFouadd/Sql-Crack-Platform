'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import TableViz from './TableViz'

interface TableState {
  title: string
  columns: (string | { name: string; type?: string })[]
  data: (string | number | null)[][]
  highlightRows?: number[]
  fadeRows?: number[]
  highlightCols?: number[]
  fadeCols?: number[]
  colorMap?: Record<number, { bg: string; label: string; color: string }>
}

interface VizStep {
  title: string
  description: string
  detail?: string
  tables: TableState[]
}

interface StepFlowProps {
  steps: VizStep[]
  className?: string
  defaultStep?: number
}

export default function StepFlow({ steps, className, defaultStep = 0 }: StepFlowProps) {
  const [activeStep, setActiveStep] = useState(defaultStep)

  const step = steps[activeStep]

  return (
    <div className={cn('bg-card border-2 border-border rounded-2xl overflow-hidden', className)}>
      <div className="px-5 py-4 bg-cream-dark border-b-2 border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text">Query Execution Walkthrough</h3>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={cn(
                  'w-7 h-7 rounded-full text-xs font-bold font-mono transition-all border-2',
                  i === activeStep
                    ? 'bg-accent text-white border-accent'
                    : i < activeStep
                    ? 'bg-green-light text-green border-green/30'
                    : 'bg-cream-dark text-text-muted border-border hover:border-accent/50'
                )}
              >
                {i < activeStep ? '✓' : i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-text">{step.title}</h4>
            <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-border text-text-muted hover:text-text hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 animate-fade-in" key={activeStep}>
        {step.detail && (
          <div className="text-xs text-text-secondary leading-relaxed bg-cream-dark border-2 border-border rounded-xl px-4 py-3">
            {step.detail}
          </div>
        )}

        {step.tables.length === 1 && (
          <TableViz
            {...step.tables[0]}
            compact
          />
        )}

        {step.tables.length === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">Before</div>
              <TableViz {...step.tables[0]} compact />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">After</div>
              <TableViz {...step.tables[1]} compact />
            </div>
          </div>
        )}

        {step.tables.length === 3 && (
          <div className="grid grid-cols-3 gap-3">
            {step.tables.map((t, i) => (
              <div key={i} className="space-y-2">
                <TableViz {...t} compact />
              </div>
            ))}
          </div>
        )}

        {step.tables.length > 3 && (
          <div className="space-y-4">
            {step.tables.map((t, i) => (
              <TableViz key={i} {...t} compact />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-cream-dark border-t-2 border-border flex items-center justify-between text-xs text-text-muted">
        <span>Step {activeStep + 1} of {steps.length}</span>
        {steps.map((s, i) => (
          <span
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === activeStep ? 'bg-accent scale-125' : i < activeStep ? 'bg-green' : 'bg-border'
            )}
          />
        ))}
        <span />
      </div>
    </div>
  )
}
