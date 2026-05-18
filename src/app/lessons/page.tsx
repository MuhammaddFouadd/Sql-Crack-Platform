'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { lessons } from '@/lib/data/lessons'
import { cn } from '@/lib/utils'
import { getAllProgress } from '@/lib/progress'
import { Check } from 'lucide-react'

const difficultyConfig = {
  beginner: { label: 'Beginner', classes: 'bg-green-light text-green border-green/30' },
  intermediate: { label: 'Intermediate', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  advanced: { label: 'Advanced', classes: 'bg-rose-light text-rose border-rose/30' },
}

export default function LessonsPage() {
  const [progressMap, setProgressMap] = useState<Record<string, { solved: number; total: number; completed: boolean }>>({})

  useEffect(() => {
    const counts: Record<string, number> = {}
    for (const l of lessons) counts[l.id] = l.practiceQuestions.length
    setProgressMap(getAllProgress(lessons.map((l) => l.id), counts))
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
      <div className="mb-10 animate-fade-in">
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
        const config = difficultyConfig[level]
        const levelDone = items.every((l) => progressMap[l.id]?.completed)
        return (
          <div key={level} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', config.classes)}>
                {config.label}
              </span>
              {levelDone && (
                <span className="flex items-center gap-1 text-xs text-green font-medium">
                  <Check size={12} />
                  Complete
                </span>
              )}
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3">
              {items.map((lesson) => {
                const p = progressMap[lesson.id]
                const done = p?.completed
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="group bg-card border-2 border-border rounded-2xl p-5 card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl mt-0.5">{lesson.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                            {lesson.title}
                          </h3>
                          {done && (
                            <span className="flex items-center gap-0.5 text-xs text-green font-medium">
                              <Check size={12} />
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">{lesson.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {lesson.topics.map((topic) => (
                            <span key={topic} className="text-xs text-text-muted px-2 py-0.5 rounded-md bg-cream-dark border border-border">
                              {topic}
                            </span>
                          ))}
                        </div>
                        {p && p.total > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-1.5 rounded-full bg-cream-dark border border-border overflow-hidden max-w-[120px]">
                              <div
                                className="h-full bg-green rounded-full transition-all duration-500"
                                style={{ width: `${(p.solved / p.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-text-muted tabular-nums">
                              {p.solved}/{p.total}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-text-muted group-hover:text-text transition-colors text-lg mt-1">→</span>
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
