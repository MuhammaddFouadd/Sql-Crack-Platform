'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { lessons } from '@/lib/data/lessons'
import { cn } from '@/lib/utils'
import { getAllProgress } from '@/lib/progress'
import { Check } from 'lucide-react'

const difficultyConfig = {
  beginner: { label: 'Beginner', classes: 'bg-green-light text-green border-green/30', dot: 'bg-green', labelColor: 'text-green', barColor: 'bg-green' },
  intermediate: { label: 'Intermediate', classes: 'bg-yellow-light text-yellow border-yellow/30', dot: 'bg-yellow', labelColor: 'text-yellow', barColor: 'bg-yellow' },
  advanced: { label: 'Advanced', classes: 'bg-rose-light text-rose border-rose/30', dot: 'bg-rose', labelColor: 'text-rose', barColor: 'bg-rose' },
}

export default function LessonsPage() {
  const [progressMap, setProgressMap] = useState<Record<string, { solved: number; total: number; completed: boolean }>>({})

  const refresh = () => {
    const counts: Record<string, number> = {}
    for (const l of lessons) counts[l.id] = l.practiceQuestions.length
    setProgressMap(getAllProgress(lessons.map((l) => l.id), counts))
  }

  useEffect(() => { refresh() }, [])

  useEffect(() => {
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  const groups = {
    beginner: lessons.filter((l) => l.difficulty === 'beginner'),
    intermediate: lessons.filter((l) => l.difficulty === 'intermediate'),
    advanced: lessons.filter((l) => l.difficulty === 'advanced'),
  }

  const totalSolved = Object.values(progressMap).reduce((s, p) => s + p.solved, 0)
  const totalQuestions = Object.values(progressMap).reduce((s, p) => s + p.total, 0)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-bold text-text">SQL Lessons</h1>
          {totalQuestions > 0 && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="font-semibold text-text">{totalSolved}</span>
              <span>/</span>
              <span>{totalQuestions}</span>
              <span className="hidden sm:inline">solved</span>
            </div>
          )}
        </div>
        <p className="text-lg text-text-secondary max-w-xl">
          A structured path from beginner to advanced. Each lesson includes explanation, examples, common mistakes, and practice questions.
        </p>
        {totalQuestions > 0 && (
          <div className="mt-4 h-2 rounded-full bg-cream-dark border border-border overflow-hidden max-w-md">
            <div
              className="h-full bg-green rounded-full transition-all duration-700"
              style={{ width: `${(totalSolved / totalQuestions) * 100}%` }}
            />
          </div>
        )}
      </div>

      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
        const items = groups[level]
        if (items.length === 0) return null
        const cfg = difficultyConfig[level]
        const levelDone = items.every((l) => progressMap[l.id]?.completed)
        return (
          <div key={level} className="mb-12 last:mb-0">
            <div className="flex items-center gap-3 mb-5">
              <div className={cn('w-3 h-3 rounded-full', cfg.dot)} />
              <span className={cn('text-xs font-bold tracking-wider uppercase', cfg.labelColor)}>
                {cfg.label}
              </span>
              <div className="h-px flex-1 bg-border" />
              {levelDone && (
                <span className="flex items-center gap-1 text-[11px] text-green font-medium">
                  <Check size={12} />
                  Complete
                </span>
              )}
            </div>
            <div className="grid gap-3">
              {items.map((lesson) => {
                const p = progressMap[lesson.id]
                const done = p?.completed
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="group bg-card border-2 border-border rounded-2xl p-5 card-hover flex items-center gap-5"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 text-base font-bold transition-colors',
                        done
                          ? 'bg-green-light border-green/30 text-green'
                          : 'bg-cream-dark border-border text-text-muted group-hover:border-accent/30 group-hover:text-text'
                      )}
                    >
                      {done ? <Check size={16} /> : lesson.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-0.5">{lesson.description}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {p && p.total > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-cream-dark border border-border overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all duration-500', cfg.barColor)}
                              style={{ width: `${(p.solved / p.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-text-muted tabular-nums">{p.solved}/{p.total}</span>
                        </div>
                      )}
                      <span className="text-text-muted group-hover:text-text transition-colors text-lg">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
