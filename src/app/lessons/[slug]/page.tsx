'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { lessons } from '@/lib/data/lessons'
import { cn } from '@/lib/utils'
import { getLessonViz, renderLessonViz, getLessonInternalEngine } from '@/components/viz/LessonViz'
import SqlRunner from '@/components/SqlRunner'
import PracticeAnswer from '@/components/lessons/PracticeAnswer'
import ExampleViewer from '@/components/lessons/ExampleViewer'
import CodeBlock from '@/components/ui/CodeBlock'
import { getLessonProgress } from '@/lib/progress'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

const difficultyConfig: Record<string, { label: string; classes: string }> = {
  beginner: { label: 'Beginner', classes: 'bg-green-light text-green border-green/30' },
  intermediate: { label: 'Intermediate', classes: 'bg-yellow-light text-yellow border-yellow/30' },
  advanced: { label: 'Advanced', classes: 'bg-rose-light text-rose border-rose/30' },
}

export default function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const lesson = lessons.find((l) => l.id === slug)
  const allIds = lessons.map((l) => l.id)
  const idx = allIds.indexOf(slug)
  const prev = idx > 0 ? lessons[idx - 1] : null
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null

  const [progressSolved, setProgressSolved] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)

  useEffect(() => {
    if (!lesson) return
    getLessonProgress(lesson.id, lesson.practiceQuestions.length).then((p) => {
      setProgressSolved(p.solved)
      setProgressTotal(p.total)
    })
  }, [lesson])

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-text mb-4">Lesson not found</h1>
        <Link href="/lessons" className="text-accent hover:underline">← Back to lessons</Link>
      </div>
    )
  }

  const allDone = progressSolved >= progressTotal && progressTotal > 0

  const mdComponents: any = {
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="border border-border bg-cream-dark px-3 py-2 text-left font-semibold text-text">{children}</th>
    ),
    td: ({ children }: any) => (
      <td className="border border-border px-3 py-2 text-text-secondary">{children}</td>
    ),
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <Link href="/lessons" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-6">
        ← Back to lessons
      </Link>

      <div className="flex items-center gap-3 mb-3">
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

      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="font-medium text-text">{progressSolved}</span>
          <span>/</span>
          <span>{progressTotal}</span>
          <span>questions solved</span>
        </div>
        {progressTotal > 0 && (
          <div className="flex-1 max-w-[160px] h-2 rounded-full bg-cream-dark border border-border overflow-hidden">
            <div
              className="h-full bg-green rounded-full transition-all duration-500"
              style={{ width: `${(progressSolved / progressTotal) * 100}%` }}
            />
          </div>
        )}
        {allDone && (
          <span className="flex items-center gap-1 text-xs text-green font-semibold">
            <Check size={13} />
            Complete
          </span>
        )}
      </div>

      <div className="space-y-8">
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Explanation</h2>
          <div className="text-text leading-relaxed markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {lesson.explanation}
            </ReactMarkdown>
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
          <ExampleViewer examples={lesson.examples} />
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
              <PracticeAnswer key={i} lessonId={lesson.id} question={q.question} hint={q.hint} solution={q.solution} index={i} />
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

      <div className="mt-12 flex items-center justify-between border-t-2 border-border pt-6">
        {prev ? (
          <Link
            href={`/lessons/${prev.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <div className="text-left">
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Previous</div>
              <div className="text-sm font-semibold text-text">{prev.icon} {prev.title}</div>
            </div>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/lessons/${next.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all group text-right"
          >
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Next</div>
              <div className="text-sm font-semibold text-text">{next.icon} {next.title}</div>
            </div>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
