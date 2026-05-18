import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'
import { leetcodeProblems } from '@/lib/data/leetcode'
import { hackerrankExercises } from '@/lib/data/hackerrank'

const problemsContext = [
  ...leetcodeProblems.map((p) => ({
    source: 'LeetCode', id: p.id, title: p.title, difficulty: p.difficulty,
    problemStatement: p.problemStatement, keyConcept: p.keyConcept, hint: p.hint,
    solution: p.solution, optimizedSolution: p.optimizedSolution, explanation: p.explanation,
  })),
  ...hackerrankExercises.map((e) => ({
    source: 'HackerRank', id: e.id, title: e.title, difficulty: e.difficulty,
    category: e.category, problemStatement: e.problemStatement,
    solution: e.solution, explanation: e.explanation,
  })),
]

function buildSystemPrompt(language: string) {
  return `You are an expert SQL mentor. You have access to LeetCode and HackerRank SQL problems.

PROBLEM DATABASE:
${JSON.stringify(problemsContext, null, 2)}

RULES:
1. When a user describes a problem or uploads a screenshot, identify which problem it is from the database above.
2. Let the user drive — only give hints when they ask or are stuck.
3. Provide hints in graduated levels:
   - Level 1 (indirect hint): Ask a guiding question about the SQL concept.
   - Level 2 (direct hint): Tell them the specific SQL clause or function to use.
   - Level 3 (solution): Only provide the full SQL solution if the user explicitly asks.
4. Always end each response with a suggestion for which topic they should revise.
5. Respond in ${language === 'ar' ? 'Arabic' : 'English'}.
6. Be encouraging and act like a patient mentor. Never just give the answer without making them think first.
7. If the user uploads a screenshot of a problem, analyze the image to understand the question, tables, and requirements.
8. Format responses with markdown. Use \`\`\`sql for SQL code blocks, \`\`\` for other code. Use **bold** for emphasis.`
}

interface Attachment { mimeType: string; data: string }

function buildParts(text: string, images?: Attachment[]) {
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = []
  if (images) for (const img of images) parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
  if (text) parts.push({ text })
  return parts
}

const encoder = new TextEncoder()

async function geminiStream(controller: ReadableStreamDefaultController, message: string, history: { role: string; text: string }[], language: string, images: Attachment[]) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const historyContents = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
    parts: [{ text: msg.text }] as ({ text: string } | { inlineData: { mimeType: string; data: string } })[],
  }))
  historyContents.push({ role: 'user' as const, parts: buildParts(message, images) })

  const chat = model.startChat({
    systemInstruction: buildSystemPrompt(language),
    history: historyContents.slice(0, -1),
  })

  const result = await chat.sendMessageStream(buildParts(message, images))
  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
  }
}

async function openaiStream(controller: ReadableStreamDefaultController, message: string, history: { role: string; text: string }[], language: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: buildSystemPrompt(language) },
    ...history.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: msg.text,
    })),
    { role: 'user', content: message },
  ]

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    stream: true,
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || ''
    if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
  }
}

export async function POST(req: NextRequest) {
  const { message, history = [], language = 'en', images = [] } = await req.json()

  if ((!message || typeof message !== 'string') && (!images || images.length === 0)) {
    return new Response(JSON.stringify({ error: 'Message or image is required' }), { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      let usedFallback = false
      try {
        await geminiStream(controller, message, history, language, images)
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        const isQuota = msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('429')
        if (isQuota && process.env.OPENAI_API_KEY) {
          usedFallback = true
          try {
            await openaiStream(controller, message, history, language)
          } catch (openaiErr) {
            const omsg = openaiErr instanceof Error ? openaiErr.message : ''
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `Both AI services unavailable. Gemini: quota exceeded. OpenAI: ${omsg}` })}\n\n`))
          }
        } else {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg || 'AI service error' })}\n\n`))
        }
      }
      if (!usedFallback && process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
        try {
          await openaiStream(controller, message, history, language)
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: (err as Error).message })}\n\n`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}
