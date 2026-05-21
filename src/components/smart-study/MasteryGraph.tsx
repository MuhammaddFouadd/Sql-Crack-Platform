'use client'

import { useMemo, useState } from 'react'
import { useSmartStudyStore } from '@/lib/smart-study/store'
import { flashcards } from '@/lib/smart-study/flashcards'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

export default function MasteryGraph() {
  const { cards, mastery } = useSmartStudyStore()
  const [showAll, setShowAll] = useState(false)

  const topicStats = useMemo(() => {
    const map = new Map<string, { correct: number; total: number; reviewed: number; avgInterval: number }>()
    for (const card of cards) {
      if (!map.has(card.topic)) {
        const m = mastery.find((x) => x.topic === card.topic)
        map.set(card.topic, { correct: m?.correct ?? 0, total: m?.total ?? 0, reviewed: 0, avgInterval: 0 })
      }
    }
    const reviewedCards = cards.filter((c) => c.repetitions > 0)
    for (const card of reviewedCards) {
      const stat = map.get(card.topic)
      if (stat) {
        stat.reviewed += 1
        stat.avgInterval = (stat.avgInterval * (stat.reviewed - 1) + card.interval) / stat.reviewed
      }
    }
    return Array.from(map.entries()).map(([topic, stats]) => ({
      topic,
      ...stats,
      practiceScore: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      flashcardProgress: cards.filter((c) => c.topic === topic).length > 0
        ? Math.round((stats.reviewed / cards.filter((c) => c.topic === topic).length) * 100)
        : 0,
    })).sort((a, b) => b.practiceScore - a.practiceScore)
  }, [cards, mastery])

  const displayStats = showAll ? topicStats : topicStats.slice(0, 6)

  const overallScore = useMemo(() => {
    if (topicStats.length === 0) return 0
    const avg = topicStats.reduce((s, t) => s + t.practiceScore, 0) / topicStats.length
    return Math.round(avg)
  }, [topicStats])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green'
    if (score >= 50) return 'text-yellow'
    return 'text-rose'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-green'
    if (score >= 50) return 'bg-yellow'
    return 'bg-rose'
  }

  const totalReviewed = cards.filter((c) => c.repetitions > 0).length
  const totalCards = cards.length
  const totalPractice = mastery.reduce((s, m) => s + m.total, 0)

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-light border-2 border-green/30 flex items-center justify-center">
            <BarChart3 size={20} className="text-green" />
          </div>
          <div>
            <h2 className="font-bold text-text">Mastery Graph</h2>
            <p className="text-xs text-text-muted">Track your progress across topics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-green" />
          <span className={cn('text-lg font-bold', getScoreColor(overallScore))}>{overallScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-cream-dark border border-border rounded-xl px-3 py-2.5 text-center">
          <p className="text-xs text-text-muted">Flashcards</p>
          <p className="text-lg font-bold text-text">{totalReviewed}/{totalCards}</p>
        </div>
        <div className="bg-cream-dark border border-border rounded-xl px-3 py-2.5 text-center">
          <p className="text-xs text-text-muted">Practice</p>
          <p className="text-lg font-bold text-text">{totalPractice}</p>
        </div>
        <div className="bg-cream-dark border border-border rounded-xl px-3 py-2.5 text-center">
          <p className="text-xs text-text-muted">Topics</p>
          <p className="text-lg font-bold text-text">{topicStats.length}</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {displayStats.map((stat) => (
          <div key={stat.topic}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-text">{stat.topic}</span>
              <span className={cn('text-xs font-bold tabular-nums', getScoreColor(stat.practiceScore))}>
                {stat.practiceScore}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-cream-dark border border-border overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-700', getBarColor(stat.practiceScore))}
                style={{ width: `${stat.practiceScore}%` }}
              />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-text-muted">flashcards: {stat.reviewed}</span>
              <span className="text-[10px] text-text-muted">practice: {stat.total}</span>
              {stat.avgInterval > 0 && (
                <span className="text-[10px] text-text-muted">interval: {stat.avgInterval < 1 ? '<1d' : `${Math.round(stat.avgInterval)}d`}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {topicStats.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors mx-auto"
        >
          {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showAll ? 'Show less' : `Show all ${topicStats.length} topics`}
        </button>
      )}
    </div>
  )
}
