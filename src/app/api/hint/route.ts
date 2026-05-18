// Hint API — compares user SQL to expected SQL and returns a targeted hint via AI
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest } from 'next/server'

const encoder = new TextEncoder()

// POST handler — validate inputs, generate hint via Gemini (fallback to OpenAI)
export async function POST(req: NextRequest) {
  const { userSql, expectedSql, problemStatement } = await req.json()

  if (!userSql || !expectedSql) {
    return new Response(JSON.stringify({ error: 'userSql and expectedSql are required' }), { status: 400 })
  }

  const prompt = `You are a SQL tutor. A student wrote a SQL query that produced the wrong result.

PROBLEM:
${problemStatement || 'A SQL practice problem'}

STUDENT'S QUERY:
${userSql}

EXPECTED QUERY:
${expectedSql}

Compare the two queries. Identify the MOST CRITICAL difference between the student's attempt and the correct solution. Give ONE specific hint about what's wrong — don't rewrite the query, don't give the full answer. Just point out the key issue in 1-2 sentences. Be direct and specific.

Example hints:
- "You're missing a JOIN condition — the employees and departments tables need to be linked on department_id."
- "Your GROUP BY is missing the 'name' column — every non-aggregate column in SELECT must be in GROUP BY."
- "You used WHERE instead of HAVING. The filter on AVG(salary) needs to come after GROUP BY, not before."
- "Check your CASE WHEN syntax — the first condition captures all values above 50, so the second condition never runs. Reorder them from most specific to least specific."`

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return new Response(JSON.stringify({ hint: text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        })
        const text = completion.choices[0]?.message?.content || ''
        return new Response(JSON.stringify({ hint: text }), {
          headers: { 'Content-Type': 'application/json' },
        })
      } catch {
        return new Response(JSON.stringify({ error: 'AI hint unavailable' }), { status: 503 })
      }
    }
    return new Response(JSON.stringify({ error: 'AI hint unavailable' }), { status: 503 })
  }
}
