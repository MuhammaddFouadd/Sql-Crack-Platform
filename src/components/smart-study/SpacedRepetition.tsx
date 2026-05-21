'use client'

import { useMemo, useState, useEffect } from 'react'
import { useSmartStudyStore, type ReviewCard } from '@/lib/smart-study/store'
import { flashcards } from '@/lib/smart-study/flashcards'
import { cn } from '@/lib/utils'
import { RotateCcw, Brain, ChevronDown, ChevronUp } from 'lucide-react'

const qualityLabels = [
  'Complete blackout',
  'Incorrect, but remembered upon seeing answer',
  'Incorrect, but answer felt familiar',
  'Correct with serious difficulty',
  'Correct after hesitation',
  'Perfect recall',
]

function flashcardDue(card: ReviewCard): boolean {
  if (!card.nextReview) return true
  return Date.now() >= card.nextReview
}

export default function SpacedRepetition() {
  const { cards, recordReview, seedCards } = useSmartStudyStore()
  const [revealed, setRevealed] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [expandedInfo, setExpandedInfo] = useState(false)

  useEffect(() => {
    seedCards(flashcards)
  }, [seedCards])

  const dueCards = useMemo(() => {
    return cards.filter((c) => flashcardDue(c))
  }, [cards])

  const currentCard = useMemo(() => {
    return dueCards.find((c) => !completed.has(c.id)) ?? null
  }, [dueCards, completed])

  const totalDone = completed.size
  const totalDue = dueCards.length
  const total = cards.length

  const totalReviewed = cards.filter((c) => c.repetitions > 0).length

  const handleRate = (quality: number) => {
    if (!currentCard) return
    recordReview(currentCard.id, quality)
    setCompleted((prev) => new Set(prev).add(currentCard.id))
    setRevealed(false)
  }

  const resetSession = () => {
    setCompleted(new Set())
    setRevealed(false)
  }

  const getIntervalSummary = (): string => {
    if (totalReviewed === 0) return 'No cards reviewed yet'
    const avgInterval = cards
      .filter((c) => c.repetitions > 0)
      .reduce((sum, c) => sum + c.interval, 0) / totalReviewed
    if (avgInterval < 1) return 'Most cards are in their first review cycle'
    if (avgInterval < 3) return 'Cards are moving to short-term memory (1-3 day intervals)'
    if (avgInterval < 7) return 'Cards are entering medium-term memory (3-7 day intervals)'
    return 'Cards are in long-term memory (7+ day intervals) — great progress!'
  }

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-light border-2 border-purple/30 flex items-center justify-center">
            <Brain size={20} className="text-purple" />
          </div>
          <div>
            <h2 className="font-bold text-text">Spaced Repetition</h2>
            <p className="text-xs text-text-muted">SM-2 algorithm • {totalDue} due • {totalReviewed} reviewed</p>
          </div>
        </div>
        <button onClick={resetSession} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-cream-dark border border-border hover:border-accent transition-all">
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {totalReviewed > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-blue-light border border-blue/30">
          <p className="text-xs text-blue font-medium">{getIntervalSummary()}</p>
        </div>
      )}

      <div className="mb-4 h-2 rounded-full bg-cream-dark border border-border overflow-hidden">
        <div className="h-full bg-purple rounded-full transition-all duration-500" style={{ width: `${totalDue > 0 ? (totalDone / totalDue) * 100 : 0}%` }} />
      </div>

      {currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full border',
              currentCard.difficulty === 'beginner' ? 'bg-green-light text-green border-green/30' :
              currentCard.difficulty === 'intermediate' ? 'bg-yellow-light text-yellow border-yellow/30' :
              'bg-rose-light text-rose border-rose/30'
            )}>
              {currentCard.difficulty}
            </span>
            <span className="text-xs text-text-muted">{currentCard.topic}</span>
          </div>

          <div className="bg-cream-dark border-2 border-border rounded-xl p-5 min-h-[100px] flex items-center">
            <p className="text-base font-medium text-text leading-relaxed">{currentCard.question}</p>
          </div>

          {revealed ? (
            <>
              <div className="bg-green-light border-2 border-green/30 rounded-xl p-5">
                <p className="text-sm text-green font-semibold mb-2">Answer:</p>
                <p className="text-sm text-text leading-relaxed">{currentCard.answer}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold mb-3">How well did you remember?</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {qualityLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => handleRate(i)}
                      aria-label={label}
                      className={cn(
                        'px-2 py-2 rounded-lg text-[10px] font-semibold border-2 transition-all text-center leading-tight',
                        i < 3 ? 'bg-rose-light text-rose border-rose/30 hover:bg-rose/20' :
                        i < 5 ? 'bg-yellow-light text-yellow border-yellow/30 hover:bg-yellow/20' :
                        'bg-green-light text-green border-green/30 hover:bg-green/20'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
            >
              Show Answer
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-green-light border-2 border-green/30 flex items-center justify-center mx-auto mb-4">
            <Brain size={28} className="text-green" />
          </div>
          <p className="text-base font-semibold text-text mb-1">All caught up!</p>
          <p className="text-sm text-text-muted">No cards due for review. Come back later or reset to practice more.</p>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setExpandedInfo(!expandedInfo)}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
        >
          {expandedInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          How spaced repetition works
        </button>
        {expandedInfo && (
          <div className="mt-2 p-3 rounded-xl bg-cream-dark border border-border text-xs text-text-secondary leading-relaxed space-y-1">
            <p>Using the SM-2 algorithm (SuperMemo):</p>
            <p>• Rate 0-2: Card resets to 1-day interval (re-learn)</p>
            <p>• Rate 3-5: Interval grows: 1d → 3d → interval × easeFactor</p>
            <p>• Higher ratings increase the ease factor (minimum 1.3)</p>
            <p>• Goal: schedule reviews right before you would forget</p>
          </div>
        )}
      </div>
    </div>
  )
}
