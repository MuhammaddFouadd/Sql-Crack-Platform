import { createClient } from './supabase/client'

interface ProgressRow {
  lesson_id: string
  solved_question_indices: number[]
}

async function getUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.user?.id ?? null
}

export async function saveSolved(lessonId: string, questionIndex: number): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  const supabase = createClient()
  const { data: existing } = await supabase
    .from('progress')
    .select('solved_question_indices')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  let indices: number[] = existing?.solved_question_indices ?? []
  if (!indices.includes(questionIndex)) {
    indices = [...indices, questionIndex].sort((a, b) => a - b)
  }

  await supabase.from('progress').upsert(
    { user_id: userId, lesson_id: lessonId, solved_question_indices: indices },
    { onConflict: 'user_id, lesson_id' }
  )
}

export async function isSolved(lessonId: string, questionIndex: number): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  const supabase = createClient()
  const { data } = await supabase
    .from('progress')
    .select('solved_question_indices')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  return data?.solved_question_indices?.includes(questionIndex) ?? false
}

export async function getLessonProgress(lessonId: string, totalQuestions: number): Promise<{ solved: number; total: number; completed: boolean }> {
  const userId = await getUserId()
  if (!userId) return { solved: 0, total: totalQuestions, completed: false }

  const supabase = createClient()
  const { data } = await supabase
    .from('progress')
    .select('solved_question_indices')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  const solved = data?.solved_question_indices?.length ?? 0
  return { solved, total: totalQuestions, completed: solved >= totalQuestions }
}

export async function getAllProgress(
  lessonIds: string[],
  questionCounts: Record<string, number>
): Promise<Record<string, { solved: number; total: number; completed: boolean }>> {
  const userId = await getUserId()
  if (!userId) {
    const result: Record<string, { solved: number; total: number; completed: boolean }> = {}
    for (const id of lessonIds) {
      result[id] = { solved: 0, total: questionCounts[id] ?? 0, completed: false }
    }
    return result
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('progress')
    .select('lesson_id, solved_question_indices')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)

  const progressMap: Record<string, ProgressRow> = {}
  for (const row of (data ?? []) as ProgressRow[]) {
    progressMap[row.lesson_id] = row
  }

  const result: Record<string, { solved: number; total: number; completed: boolean }> = {}
  for (const id of lessonIds) {
    const entry = progressMap[id]
    const solved = entry?.solved_question_indices?.length ?? 0
    const total = questionCounts[id] ?? 0
    result[id] = { solved, total, completed: solved >= total }
  }
  return result
}
