// AI chat API — Gemini/OpenAI streaming with system prompt, problem DB, and fallback logic
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import { NextRequest } from 'next/server'
import { leetcodeProblems } from '@/lib/data/leetcode'
import { hackerrankExercises } from '@/lib/data/hackerrank'

// All lesson topics for the system prompt context
const lessonTopics = [
  'SELECT — column selection, aliases, DISTINCT, LIMIT',
  'WHERE — filtering with comparison operators, AND/OR/NOT, BETWEEN, IN, LIKE, IS NULL',
  'ORDER BY — sorting ascending/descending, multiple columns',
  'GROUP BY — aggregation with COUNT, SUM, AVG, MIN, MAX',
  'HAVING — filtering aggregated groups',
  'JOINs — INNER, LEFT, RIGHT, FULL OUTER, CROSS, self-joins',
  'Subqueries — scalar, row, table subqueries, correlated subqueries, EXISTS, ANY, ALL',
  'CASE WHEN — conditional expressions in SELECT, ORDER BY, GROUP BY',
  'CTEs — WITH clause, recursive CTEs',
  'Window Functions — OVER, PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE',
  'String Functions — CONCAT, SUBSTR, LENGTH, UPPER, LOWER, TRIM, INSTR, REPLACE',
  'Pattern Matching — LIKE, glob patterns',
  'Set Operations — UNION, UNION ALL, INTERSECT, EXCEPT',
  'Date/Time Functions — formatting, extraction, arithmetic',
]

// Practice schema reference injected into the system prompt
const practiceTables = `
Tables available for practice:
- customers(id, name, email, phone, city, signup_date)
- departments(id, name, budget, city)
- employees(id, name, email, phone, salary, department, department_id, manager_id, hire_date, city)
- products(id, name, category, price, stock, units_sold)
- orders(id, customer_id, customer_name, product_id, quantity, total, order_date)
- order_items(id, order_id, product_id, quantity)
`

// Combined LeetCode + HackerRank problem database for the system prompt
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

// Build the system prompt with lesson list, tables, problem DB, and mentoring rules
function buildSystemPrompt(language: string) {
  return `You are an expert SQL mentor on Sql Craker, a SQL learning platform.

AVAILABLE LESSONS ON THIS PLATFORM:
${lessonTopics.map((t) => `- ${t}`).join('\n')}

${practiceTables}

PROBLEM DATABASE (LeetCode SQL 50 + HackerRank SQL):
${JSON.stringify(problemsContext, null, 2)}

YOUR ROLE:
You are a patient, encouraging SQL tutor. Your goal is to help users learn SQL deeply, not just give answers.

RULES:
1. When a user describes a problem or uploads a screenshot, identify which problem or lesson topic it relates to.
2. Let the user drive — only give hints when they ask or are stuck.
3. Provide hints in graduated levels:
   - Level 1 (indirect hint): Ask a guiding question about the SQL concept or suggest which clause to think about.
   - Level 2 (direct hint): Tell them the specific SQL clause, function, or technique to use.
   - Level 3 (solution): Only provide the full SQL solution if the user explicitly asks.
4. Always end each response with a suggestion for which topic they should revise or a related concept to explore next.
5. Respond in ${language === 'ar' ? 'Arabic' : 'English'}.
6. Be encouraging. Use phrases like "Great question!", "You're on the right track!", "Think about what happens when...".
7. If the user uploads a screenshot of a problem, analyze the image to understand the question, tables, and requirements.
8. Format responses with proper markdown. Use \`\`\`sql for SQL code blocks. Use **bold** for emphasis, and bullet points for lists.
9. If the user asks about a specific function or concept, explain it with a simple example first, then relate it to their problem.
10. When explaining solutions, break down the logic step by step — what each clause does and why it's needed.
11. If a user seems confused, ask clarifying questions rather than jumping to the solution.`
}

interface Attachment { mimeType: string; data: string }

// Build Gemini content parts from text and optional image attachments
function buildParts(text: string, images?: Attachment[]) {
  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = []
  if (images) for (const img of images) parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
  if (text) parts.push({ text })
  return parts
}

const encoder = new TextEncoder()

// Stream response from Gemini with chat history and system instruction
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

// Stream response from OpenAI as fallback when Gemini is unavailable
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

// POST handler — parse request, try Gemini, fallback to OpenAI, return SSE stream
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
        const isQuota = msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('429') || msg.toLowerCase().includes('safety')
        if (isQuota && process.env.OPENAI_API_KEY) {
          usedFallback = true
          try {
            await openaiStream(controller, message, history, language)
          } catch (openaiErr) {
            const omsg = openaiErr instanceof Error ? openaiErr.message : ''
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `AI services unavailable. Gemini: quota. OpenAI: ${omsg}` })}\n\n`))
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
