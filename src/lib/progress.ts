/** LocalStorage-based progress tracking for lessons. */
const STORAGE_KEY = 'sql-progress'

/** Tracks which questions a user has solved in a lesson. */
export interface LessonProgress {
  solved: number[]
}

/** Load all saved progress from localStorage. */
export function loadProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Mark a question as solved for a given lesson. */
export function saveSolved(lessonId: string, questionIndex: number): void {
  const progress = loadProgress()
  const entry = progress[lessonId] ?? { solved: [] }
  if (!entry.solved.includes(questionIndex)) {
    entry.solved = [...entry.solved, questionIndex].sort()
  }
  progress[lessonId] = entry
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch {}
}

/** Check whether a specific question has been solved. */
export function isSolved(lessonId: string, questionIndex: number): boolean {
  const progress = loadProgress()
  return progress[lessonId]?.solved.includes(questionIndex) ?? false
}

/** Get solved/total counts for a single lesson. */
export function getLessonProgress(lessonId: string, totalQuestions: number): { solved: number; total: number; completed: boolean } {
  const progress = loadProgress()
  const entry = progress[lessonId]
  if (!entry) return { solved: 0, total: totalQuestions, completed: false }
  return {
    solved: entry.solved.length,
    total: totalQuestions,
    completed: entry.solved.length >= totalQuestions,
  }
}

/** Get solved/total counts for multiple lessons at once. */
export function getAllProgress(lessonIds: string[], questionCounts: Record<string, number>): Record<string, { solved: number; total: number; completed: boolean }> {
  const progress = loadProgress()
  const result: Record<string, { solved: number; total: number; completed: boolean }> = {}
  for (const id of lessonIds) {
    const entry = progress[id]
    const total = questionCounts[id] ?? 0
    result[id] = {
      solved: entry?.solved.length ?? 0,
      total,
      completed: (entry?.solved.length ?? 0) >= total,
    }
  }
  return result
}
