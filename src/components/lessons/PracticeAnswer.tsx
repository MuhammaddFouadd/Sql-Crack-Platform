'use client'

import { useState, useRef, useEffect } from 'react'
import { formatSQL, normalizeSQL } from '@/lib/sql-format'
import { saveSolved, isSolved } from '@/lib/progress'
import { Check, X, Wand2, Eye, EyeOff, HelpCircle } from 'lucide-react'

interface PracticeAnswerProps {
  lessonId: string
  question: string
  hint: string
  solution: string
  index: number
}

type CheckStatus = 'idle' | 'correct' | 'wrong'

export default function PracticeAnswer({ lessonId, question, hint, solution, index }: PracticeAnswerProps) {
  const [userSql, setUserSql] = useState('')
  const [status, setStatus] = useState<CheckStatus>(isSolved(lessonId, index) ? 'correct' : 'idle')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const formatTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (value: string) => {
    setUserSql(value)
    setStatus('idle')
    if (formatTimer.current) clearTimeout(formatTimer.current)
    formatTimer.current = setTimeout(() => {
      setUserSql((prev) => formatSQL(prev))
    }, 600)
  }

  const handleFormat = () => {
    if (userSql.trim()) {
      setUserSql(formatSQL(userSql))
    }
  }

  const checkAnswer = () => {
    if (!userSql.trim()) return
    const user = normalizeSQL(userSql)
    const expected = normalizeSQL(solution)
    const correct = user === expected
    setStatus(correct ? 'correct' : 'wrong')
    if (correct) saveSolved(lessonId, index)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      checkAnswer()
    }
  }

  return (
    <details className="bg-card border-2 border-border rounded-2xl overflow-hidden group">
      <summary className="px-6 py-4 text-sm font-semibold text-text cursor-pointer hover:bg-border/20 transition-colors">
        Question {index + 1}
      </summary>
      <div className="px-6 pb-6 space-y-4">
        <p className="text-text-secondary leading-relaxed text-sm">{question}</p>

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

            <span className="text-[10px] text-text-muted">Auto-formats after typing</span>
          </div>
        </div>

        {status === 'correct' && (
          <div className="flex items-center gap-2 bg-green-light border-2 border-green/30 rounded-xl px-4 py-3">
            <Check size={16} className="text-green shrink-0" />
            <p className="text-sm text-text font-semibold">Correct! Great job.</p>
          </div>
        )}

        {status === 'wrong' && (
          <div className="flex items-center gap-2 bg-rose-light border-2 border-rose/30 rounded-xl px-4 py-3">
            <X size={16} className="text-rose shrink-0" />
            <p className="text-sm text-text font-semibold">Not quite right. Check your query and try again.</p>
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
