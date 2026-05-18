const STORAGE_KEY = 'sql-progress'

export interface LessonProgress {
  solved: number[]
  completed: boolean
}

export function loadProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveSolved(lessonId: string, questionIndex: number): void {
  const progress = loadProgress()
  const entry = progress[lessonId] ?? { solved: [], completed: false }
  if (!entry.solved.includes(questionIndex)) {
    entry.solved = [...entry.solved, questionIndex].sort()
  }
  progress[lessonId] = entry
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch {}
}

export function isSolved(lessonId: string, questionIndex: number): boolean {
  const progress = loadProgress()
  return progress[lessonId]?.solved.includes(questionIndex) ?? false
}

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
