'use client'

import { use } from 'react'
import Link from 'next/link'
import { lessons } from '@/lib/data/lessons'
import { cn } from '@/lib/utils'
import CodeBlock from '@/components/ui/CodeBlock'
import { getLessonViz, renderLessonViz, getLessonInternalEngine } from '@/components/viz/LessonViz'
import SqlRunner from '@/components/SqlRunner'

const difficultyConfig: Record<string, { label: string; classes: string }> = {
  beginner: { label: 'Beginner', classes: 'bg-green-light text-green border-green/30' },
  intermediate: { label: 'Intermediate', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  advanced: { label: 'Advanced', classes: 'bg-rose-light text-rose border-rose/30' },
}

function PracticeQuestion({ q, index }: { q: { question: string; hint: string; solution: string }; index: number }) {
  return (
    <details className="bg-cream-dark border-2 border-border rounded-2xl overflow-hidden group">
      <summary className="px-6 py-4 text-sm font-semibold text-text cursor-pointer hover:bg-border/20 transition-colors">
        Question {index + 1}
      </summary>
      <div className="px-6 pb-6 space-y-4">
        <p className="text-text-secondary leading-relaxed">{q.question}</p>
        <details>
          <summary className="text-sm text-blue font-medium cursor-pointer hover:text-blue/80 transition-colors">
            💡 Show hint
          </summary>
          <p className="mt-2 text-sm text-text-secondary bg-blue-light border-2 border-blue/20 rounded-xl p-4">{q.hint}</p>
        </details>
        <details>
          <summary className="text-sm text-green font-medium cursor-pointer hover:text-green/80 transition-colors">
            ✅ Show solution
          </summary>
          <div className="mt-2">
            <CodeBlock code={q.solution} title="sql" />
          </div>
        </details>
      </div>
    </details>
  )
}

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const lesson = lessons.find((l) => l.id === slug)

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Lesson not found</h1>
        <Link href="/lessons" className="text-accent hover:underline">← Back to lessons</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <Link href="/lessons" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-6">
        ← Back to lessons
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{lesson.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-text">{lesson.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full border', difficultyConfig[lesson.difficulty].classes)}>
              {difficultyConfig[lesson.difficulty].label}
            </span>
            <div className="flex gap-1.5">
              {lesson.topics.map((t) => (
                <span key={t} className="text-xs text-text-muted">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Explanation</h2>
          <div className="text-text leading-relaxed whitespace-pre-wrap">
            {lesson.explanation}
          </div>
        </div>

        {(() => {
          const viz = getLessonViz(lesson.id)
          if (viz) {
            return (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Visual Walkthrough</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {viz.label && (
                  <p className="text-xs text-text-muted mb-4">{viz.label}</p>
                )}
                {renderLessonViz(lesson.id)}
              </div>
            )
          }
          return null
        })()}

        {(() => {
          const engine = getLessonInternalEngine(lesson.id)
          if (engine) {
            return (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Inside the Database Engine</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {engine}
              </div>
            )
          }
          return null
        })()}

        {lesson.syntax && (
          <div>
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Syntax</h2>
            <CodeBlock code={lesson.syntax} title="sql" />
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Examples</h2>
          <div className="space-y-6">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="bg-card border-2 border-border rounded-2xl p-6">
                <h3 className="text-base font-bold text-text mb-3">{ex.title}</h3>
                <CodeBlock code={ex.sql} title="sql" />
                <div className="mt-3 text-sm text-text-secondary bg-cream-dark border-2 border-border rounded-xl p-4">
                  {ex.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-rose-light border-2 border-rose/30 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-rose uppercase tracking-wider mb-3">⚠ Common Mistakes</h2>
          <ul className="space-y-2">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-rose mt-0.5">•</span>
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Practice Questions</h2>
          <div className="space-y-3">
            {lesson.practiceQuestions.map((q, i) => (
              <PracticeQuestion key={i} q={q} index={i} />
            ))}
          </div>

          <div className="mt-8 bg-card border-2 border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✍</span>
              <h3 className="font-bold text-text">Try It Yourself</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Write your SQL query below and run it against the sample database.
              Use <code className="text-accent font-mono text-xs">employees</code>,{' '}
              <code className="text-accent font-mono text-xs">departments</code>,{' '}
              <code className="text-accent font-mono text-xs">products</code>, and{' '}
              <code className="text-accent font-mono text-xs">orders</code> tables.
            </p>
            <SqlRunner defaultQuery={`-- Try your solution for the questions above\nSELECT * FROM employees LIMIT 5;`} />
          </div>
        </div>
      </div>
    </div>
  )
}
