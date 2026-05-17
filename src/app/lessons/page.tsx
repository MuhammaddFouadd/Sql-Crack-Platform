'use client'

import Link from 'next/link'
import { lessons } from '@/lib/data/lessons'
import { cn } from '@/lib/utils'

const difficultyConfig = {
  beginner: { label: 'Beginner', classes: 'bg-green-light text-green border-green/30' },
  intermediate: { label: 'Intermediate', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  advanced: { label: 'Advanced', classes: 'bg-rose-light text-rose border-rose/30' },
}

export default function LessonsPage() {
  const groups = {
    beginner: lessons.filter((l) => l.difficulty === 'beginner'),
    intermediate: lessons.filter((l) => l.difficulty === 'intermediate'),
    advanced: lessons.filter((l) => l.difficulty === 'advanced'),
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-text mb-3">SQL Lessons</h1>
        <p className="text-lg text-text-secondary max-w-xl">
          A structured path from beginner to advanced. Each lesson includes explanation, examples, common mistakes, and practice questions.
        </p>
      </div>

      {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
        const items = groups[level]
        if (items.length === 0) return null
        const config = difficultyConfig[level]
        return (
          <div key={level} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', config.classes)}>
                {config.label}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3">
              {items.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="group bg-card border-2 border-border rounded-2xl p-5 card-hover"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{lesson.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-text-secondary">{lesson.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {lesson.topics.map((topic) => (
                          <span key={topic} className="text-xs text-text-muted px-2 py-0.5 rounded-md bg-cream-dark border border-border">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-text-muted group-hover:text-text transition-colors text-lg mt-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
