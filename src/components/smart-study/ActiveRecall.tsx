'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Lightbulb, Sparkles, Shuffle, ChevronDown, ChevronUp } from 'lucide-react'
import { useSmartStudyStore } from '@/lib/smart-study/store'
import { flashcards } from '@/lib/smart-study/flashcards'

const difficultyOrder = ['beginner', 'intermediate', 'advanced'] as const
type Difficulty = (typeof difficultyOrder)[number]

export default function ActiveRecall() {
  const { seedCards } = useSmartStudyStore()
  const [showAnswer, setShowAnswer] = useState(false)
  const [index, setIndex] = useState(0)
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map<string, typeof flashcards>()
    for (const card of flashcards) {
      const existing = map.get(card.topic) ?? []
      existing.push(card)
      map.set(card.topic, existing)
    }
    return map
  }, [])

  const filtered = useMemo(() => {
    let result = flashcards
    if (topicFilter !== 'all') result = result.filter((c) => c.topic === topicFilter)
    if (difficultyFilter !== 'all') result = result.filter((c) => c.difficulty === difficultyFilter)
    return result
  }, [topicFilter, difficultyFilter])

  const current = filtered[index] ?? null
  const topics = Array.from(grouped.keys()).sort()

  const handleShuffle = () => {
    seedCards(flashcards)
    setIndex(Math.floor(Math.random() * filtered.length))
    setShowAnswer(false)
    setShowHint(false)
  }

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % filtered.length)
    setShowAnswer(false)
    setShowHint(false)
  }

  if (flashcards.length === 0) {
    return (
      <div className="bg-card border-2 border-border rounded-2xl p-6 text-center py-12">
        <p className="text-text-muted">No flashcards available.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-light border-2 border-yellow/30 flex items-center justify-center">
            <Sparkles size={20} className="text-yellow" />
          </div>
          <div>
            <h2 className="font-bold text-text">Active Recall</h2>
            <p className="text-xs text-text-muted">{filtered.length} cards • card {index + 1} of {filtered.length}</p>
          </div>
        </div>
        <button onClick={handleShuffle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all">
          <Shuffle size={13} />
          Shuffle
        </button>
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
              onChange={(e) => { setTopicFilter(e.target.value); setIndex(0); setShowAnswer(false) }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-cream-dark border border-border text-text font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Topics</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => { setDifficultyFilter(e.target.value as Difficulty | 'all'); setIndex(0); setShowAnswer(false) }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-cream-dark border border-border text-text font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        )}
      </div>

      {current ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full border',
              current.difficulty === 'beginner' ? 'bg-green-light text-green border-green/30' :
              current.difficulty === 'intermediate' ? 'bg-yellow-light text-yellow border-yellow/30' :
              'bg-rose-light text-rose border-rose/30'
            )}>
              {current.difficulty}
            </span>
            <span className="text-xs bg-blue-light text-blue font-semibold px-2 py-0.5 rounded-full border border-blue/30">
              {current.topic}
            </span>
          </div>

          <div className="bg-cream-dark border-2 border-border rounded-xl p-5 min-h-[80px] flex items-center">
            <p className="text-base font-medium text-text leading-relaxed">{current.question}</p>
          </div>

          {!showAnswer && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
            >
              <Lightbulb size={13} />
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          )}
          {!showAnswer && showHint && (
            <div className="bg-blue-light border-2 border-blue/30 rounded-xl p-3">
              <p className="text-xs text-blue font-semibold mb-1">Hint</p>
              <p className="text-xs text-text-secondary">Think about which SQL clause(s) this involves, and what the execution order would be.</p>
            </div>
          )}

          {showAnswer ? (
            <div className="bg-green-light border-2 border-green/30 rounded-xl p-5">
              <p className="text-sm text-green font-semibold mb-2">Answer:</p>
              <p className="text-sm text-text leading-relaxed">{current.answer}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
            >
              Reveal Answer
            </button>
          )}

          <div className="flex gap-2">
            {showAnswer && (
              <button
                onClick={nextCard}
                className="flex-1 py-2.5 rounded-xl bg-cream-dark text-text font-semibold text-sm border-2 border-border hover:border-accent hover:text-accent transition-all"
              >
                Next Card
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base font-semibold text-text mb-1">No cards match filters</p>
          <p className="text-sm text-text-muted">Try changing your topic or difficulty filter.</p>
        </div>
      )}
    </div>
  )
}
