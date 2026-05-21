import { create } from 'zustand'
import { pushToServer, pullFromServer } from './sync'

export interface ReviewCard {
  id: string
  topic: string
  question: string
  answer: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lastReviewed: number | null
  nextReview: number | null
  interval: number
  easeFactor: number
  repetitions: number
}

export interface MasteryTopic {
  topic: string
  correct: number
  total: number
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error'

interface SmartStudyState {
  cards: ReviewCard[]
  mastery: MasteryTopic[]
  syncStatus: SyncStatus
  lastSyncedAt: number | null
  seedCards: (cards: ReviewCard[]) => void
  recordReview: (cardId: string, quality: number) => void
  recordPractice: (topic: string, correct: boolean) => void
  getDueCards: () => ReviewCard[]
  getMasteryScore: (topic: string) => number
  syncToServer: (userId: string) => Promise<void>
  loadFromServer: (userId: string) => Promise<void>
  setSyncStatus: (status: SyncStatus) => void
  mergeServerData: (cards: Partial<ReviewCard>[], mastery: MasteryTopic[]) => void
}

function loadState(): { cards: ReviewCard[]; mastery: MasteryTopic[] } {
  if (typeof window === 'undefined') return { cards: [], mastery: [] }
  try {
    const raw = localStorage.getItem('smart-study-state')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { cards: [], mastery: [] }
}

function saveState(cards: ReviewCard[], mastery: MasteryTopic[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('smart-study-state', JSON.stringify({ cards, mastery }))
  } catch {}
}

export const useSmartStudyStore = create<SmartStudyState>((set, get) => ({
  ...loadState(),
  syncStatus: 'idle',
  lastSyncedAt: null,

  setSyncStatus: (status) => set({ syncStatus: status }),

  seedCards: (cards) => {
    const existing = get().cards
    if (existing.length > 0) return
    const mastery: MasteryTopic[] = [
      ...new Set(cards.map((c) => c.topic)),
    ].map((topic) => ({ topic, correct: 0, total: 0 }))
    set({ cards, mastery })
    saveState(cards, mastery)
  },

  mergeServerData: (serverCards, serverMastery) => {
    const local = get()
    const mergedCards = local.cards.map((localCard) => {
      const serverCard = serverCards.find((c) => c.id === localCard.id)
      if (!serverCard) return localCard
      const localReps = localCard.repetitions
      const serverReps = serverCard.repetitions ?? 0
      return serverReps > localReps ? { ...localCard, ...serverCard } : localCard
    })
    const masteryMap = new Map(local.mastery.map((m) => [m.topic, m]))
    for (const sm of serverMastery) {
      const existing = masteryMap.get(sm.topic)
      if (!existing || sm.total > existing.total) {
        masteryMap.set(sm.topic, sm)
      }
    }
    const mergedMastery = Array.from(masteryMap.values())
    set({ cards: mergedCards, mastery: mergedMastery })
    saveState(mergedCards, mergedMastery)
  },

  syncToServer: async (userId) => {
    const { cards, mastery } = get()
    if (!userId) return
    set({ syncStatus: 'syncing' })
    try {
      await pushToServer(userId, cards, mastery)
      set({ syncStatus: 'synced', lastSyncedAt: Date.now() })
    } catch {
      set({ syncStatus: 'error' })
    }
  },

  loadFromServer: async (userId) => {
    if (!userId) return
    set({ syncStatus: 'syncing' })
    try {
      const data = await pullFromServer(userId)
      if (data && data.cards.length > 0) {
        const fullCards = data.cards.filter((c): c is ReviewCard =>
          c.id != null && c.question != null && c.answer != null
        )
        if (fullCards.length > 0) {
          get().mergeServerData(fullCards, data.mastery)
        }
      }
      set({ syncStatus: 'synced', lastSyncedAt: Date.now() })
    } catch {
      set({ syncStatus: 'error' })
    }
  },

  recordReview: (cardId, quality) => {
    set((state) => {
      const cards = state.cards.map((card) => {
        if (card.id !== cardId) return card
        const now = Date.now()
        let { interval, easeFactor, repetitions } = card
        if (quality < 3) {
          repetitions = 0
          interval = 1
        } else {
          if (repetitions === 0) interval = 1
          else if (repetitions === 1) interval = 3
          else interval = Math.round(interval * easeFactor)
          repetitions += 1
        }
        easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
        const nextReview = now + interval * 86400000
        return { ...card, lastReviewed: now, nextReview, interval, easeFactor, repetitions }
      })
      saveState(cards, state.mastery)
      return { cards, syncStatus: 'idle' as const }
    })
  },

  recordPractice: (topic, correct) => {
    set((state) => {
      const mastery = state.mastery.map((m) =>
        m.topic === topic ? { ...m, total: m.total + 1, correct: m.correct + (correct ? 1 : 0) } : m
      )
      saveState(state.cards, mastery)
      return { mastery, syncStatus: 'idle' as const }
    })
  },

  getDueCards: () => {
    const now = Date.now()
    return get().cards.filter((c) => !c.nextReview || c.nextReview <= now)
  },

  getMasteryScore: (topic) => {
    const m = get().mastery.find((m) => m.topic === topic)
    if (!m || m.total === 0) return 0
    return Math.round((m.correct / m.total) * 100)
  },
}))
