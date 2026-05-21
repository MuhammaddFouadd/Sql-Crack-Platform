import { createClient } from '@/lib/supabase/client'
import type { ReviewCard, MasteryTopic } from './store'

interface SmartStudyRow {
  card_id: string
  topic: string
  difficulty: string
  question: string
  answer: string
  last_reviewed: number | null
  next_review: number | null
  interval_days: number
  ease_factor: number
  repetitions: number
  practice_correct: number
  practice_total: number
}

export async function pushToServer(
  userId: string,
  cards: ReviewCard[],
  mastery: MasteryTopic[]
): Promise<void> {
  const supabase = createClient()
  const rows: SmartStudyRow[] = cards.map((c) => {
    const m = mastery.find((x) => x.topic === c.topic)
    return {
      card_id: c.id,
      topic: c.topic,
      difficulty: c.difficulty,
      question: c.question,
      answer: c.answer,
      last_reviewed: c.lastReviewed,
      next_review: c.nextReview,
      interval_days: c.interval,
      ease_factor: c.easeFactor,
      repetitions: c.repetitions,
      practice_correct: m?.correct ?? 0,
      practice_total: m?.total ?? 0,
    }
  })

  const batchSize = 50
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await supabase
      .from('smart_study_progress')
      .upsert(
        batch.map((r) => ({ user_id: userId, ...r })),
        { onConflict: 'user_id, card_id', ignoreDuplicates: false }
      )
    if (error) throw error
  }
}

export async function pullFromServer(userId: string): Promise<{
  cards: Partial<ReviewCard>[]
  mastery: MasteryTopic[]
} | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('smart_study_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) return null
  if (!data || data.length === 0) return null

  const rows = data as SmartStudyRow[]
  const masteryMap = new Map<string, { correct: number; total: number }>()

  const cards: Partial<ReviewCard>[] = rows.map((r) => {
    const entry = masteryMap.get(r.topic) ?? { correct: 0, total: 0 }
    entry.correct = r.practice_correct
    entry.total = r.practice_total
    masteryMap.set(r.topic, entry)

    return {
      id: r.card_id,
      topic: r.topic,
      question: r.question,
      answer: r.answer,
      difficulty: r.difficulty as ReviewCard['difficulty'],
      lastReviewed: r.last_reviewed,
      nextReview: r.next_review,
      interval: r.interval_days,
      easeFactor: r.ease_factor,
      repetitions: r.repetitions,
    }
  })

  const mastery: MasteryTopic[] = Array.from(masteryMap.entries()).map(
    ([topic, stats]) => ({ topic, ...stats })
  )

  return { cards, mastery }
}

export async function clearServerData(userId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('smart_study_progress').delete().eq('user_id', userId)
}
