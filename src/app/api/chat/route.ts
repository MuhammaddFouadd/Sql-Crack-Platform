import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { leetcodeProblems } from '@/lib/data/leetcode'
import { hackerrankExercises } from '@/lib/data/hackerrank'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

const problemsContext = [
  ...leetcodeProblems.map((p) => ({
    source: 'LeetCode',
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    problemStatement: p.problemStatement,
    keyConcept: p.keyConcept,
    hint: p.hint,
    solution: p.solution,
    optimizedSolution: p.optimizedSolution,
    explanation: p.explanation,
  })),
  ...hackerrankExercises.map((e) => ({
    source: 'HackerRank',
    id: e.id,
    title: e.title,
    difficulty: e.difficulty,
    category: e.category,
    problemStatement: e.problemStatement,
    solution: e.solution,
    explanation: e.explanation,
  })),
]

function buildSystemPrompt(language: string) {
  return `You are an expert SQL mentor. You have access to a database of LeetCode and HackerRank SQL problems with their solutions.

PROBLEM DATABASE:
${JSON.stringify(problemsContext, null, 2)}

RULES:
1. When a user describes a problem or uploads a screenshot, identify which problem it is from the database above.
2. Let the user drive — only give hints when they ask or are stuck.
3. Provide hints in graduated levels:
   - Level 1 (indirect hint): Ask a guiding question about the SQL concept.
   - Level 2 (direct hint): Tell them the specific SQL clause or function to use.
   - Level 3 (solution): Only provide the full SQL solution if the user explicitly asks.
4. Always end each response with a suggestion for which topic they should revise (e.g., "You should revise: LEFT JOIN and NULL filtering").
5. Respond in ${language === 'ar' ? 'Arabic' : 'English'}.
6. Be encouraging and act like a patient mentor. Never just give the answer without making them think first.
7. If the user uploads a screenshot of a problem, analyze the image to understand the question, tables, and requirements.`
}

interface Attachment {
  mimeType: string
  data: string
}

function buildParts(text: string, images?: Attachment[]) {
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = []
  if (images && images.length > 0) {
    for (const img of images) {
      parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
    }
  }
  if (text) {
    parts.push({ text })
  }
  return parts
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], language = 'en', images = [] } = await req.json()

    if ((!message || typeof message !== 'string') && (!images || images.length === 0)) {
      return NextResponse.json({ error: 'Message or image is required' }, { status: 400 })
    }

    const contents = history.map((msg: { role: string; text: string; images?: Attachment[] }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: buildParts(msg.text, msg.images),
    }))

    contents.push({ role: 'user', parts: buildParts(message, images) })

    const chat = model.startChat({
      systemInstruction: buildSystemPrompt(language),
      history: contents.slice(0, -1),
    })

    const lastParts = buildParts(message, images)
    const result = await chat.sendMessage(lastParts)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Chat API error:', msg)

    const isQuota = msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('429')
    const isSafety = msg.toLowerCase().includes('safety') || msg.toLowerCase().includes('blocked')

    let userMsg: string
    if (isQuota) {
      userMsg = 'The AI service is currently rate-limited. Please wait a moment and try again.'
    } else if (isSafety) {
      userMsg = 'The content was blocked by safety filters. Please rephrase your question.'
    } else {
      userMsg = 'Something went wrong. Please try again.'
    }

    return NextResponse.json(
      { error: userMsg },
      { status: 500 }
    )
  }
}
