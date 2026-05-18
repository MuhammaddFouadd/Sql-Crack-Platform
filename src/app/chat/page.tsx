// Chat page — AI mentor with SSE streaming, localStorage persistence, bilingual support
'use client'

import { useState, useEffect, useRef } from 'react'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatInput from '@/components/chat/ChatInput'
import LanguageToggle from '@/components/chat/LanguageToggle'

interface Attachment {
  mimeType: string
  data: string
}

interface Message {
  role: 'user' | 'assistant'
  text: string
  images?: Attachment[]
}

interface StoredMessage {
  role: 'user' | 'assistant'
  text: string
  hasImages: boolean
}

const STORAGE_KEY = 'sql-mentor-chat'
const LANGUAGE_KEY = 'sql-mentor-lang'

// Greeting messages in English and Arabic
const greetings: Record<'en' | 'ar', string> = {
  en: "Hi! I'm your SQL mentor. Describe a problem you're working on and I'll help you step by step with hints and guidance.",
  ar: 'مرحباً! أنا مرشدك في SQL. صف لي المشكلة التي تعمل عليها وسأساعدك خطوة بخطوة بالتلميحات والتوجيه.',
}

// Strip images from message for localStorage serialization
function stripImages(m: Message): StoredMessage {
  return { role: m.role, text: m.text, hasImages: !!m.images?.length }
}

export default function ChatPage() {
  // State — messages, language, hydration guard, loading indicator
  const [messages, setMessages] = useState<Message[]>([])
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [hydrated, setHydrated] = useState(false)
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Hydrate messages and language from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: StoredMessage[] = JSON.parse(saved)
        setMessages(parsed.map((m) => ({ role: m.role, text: m.text })))
      }
    } catch {}
    try {
      const lang = localStorage.getItem(LANGUAGE_KEY)
      if (lang === 'en' || lang === 'ar') setLanguage(lang)
    } catch {}
    setHydrated(true)
  }, [])

  // Persist messages to localStorage after hydration
  useEffect(() => {
    if (!hydrated) return
    const trimmed = messages.map(stripImages)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed)) } catch {}
  }, [messages, hydrated])

  // Persist language preference
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(LANGUAGE_KEY, language) } catch {}
  }, [language, hydrated])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message — POST to /api/chat, handle SSE stream or JSON response
  const handleSend = async (text: string, images?: Attachment[]) => {
    const userMsg: Message = { role: 'user', text, images }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    const history = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }))

    // Placeholder for streaming assistant response
    setMessages((prev) => [...prev, { role: 'assistant', text: '' }])

    let res: Response
    try {
      res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, images, history, language }),
      })
    } catch {
      setMessages((prev) => {
        const m = [...prev]
        if (m[m.length - 1]?.role === 'assistant') m[m.length - 1] = { role: 'assistant', text: 'Network error. Check your connection.' }
        return m
      })
      setLoading(false)
      return
    }

    if (!res.ok) {
      let errorMsg = 'AI service error'
      try { const data = await res.json(); errorMsg = data.error || errorMsg } catch {}
      setMessages((prev) => {
        const m = [...prev]
        if (m[m.length - 1]?.role === 'assistant') m[m.length - 1] = { role: 'assistant', text: errorMsg }
        return m
      })
      setLoading(false)
      return
    }

    const isStream = (res.headers.get('Content-Type') || '').includes('text/event-stream')

    // Parse SSE stream — accumulate text chunks and flush per animation frame
    if (isStream) {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let assistantText = ''
      let flushing = false

      // Schedule a RAF flush to batch DOM updates
      const scheduleFlush = () => {
        if (flushing) return
        flushing = true
        requestAnimationFrame(() => {
          flushing = false
          const t = assistantText
          setMessages((prev) => {
            const m = [...prev]
            if (m[m.length - 1]?.role === 'assistant') m[m.length - 1] = { role: 'assistant', text: t }
            return m
          })
        })
      }

      // Read stream chunk by chunk, parse SSE data lines
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const parsed = JSON.parse(payload)
            if (parsed.error) {
              assistantText = parsed.error
              scheduleFlush()
              reader.cancel()
              break
            }
            if (parsed.text) {
              assistantText += parsed.text
              scheduleFlush()
            }
          } catch {}
        }
      }

      // Final flush of accumulated text
      const t = assistantText
      setMessages((prev) => {
        const m = [...prev]
        if (m[m.length - 1]?.role === 'assistant') m[m.length - 1] = { role: 'assistant', text: t }
        return m
      })
    } else {
      // Non-streaming JSON fallback
      try {
        const data = await res.json()
        setMessages((prev) => {
          const m = [...prev]
          if (m[m.length - 1]?.role === 'assistant') m[m.length - 1] = { role: 'assistant', text: data.response || data.error || '' }
          return m
        })
      } catch {}
    }

    setLoading(false)
  }

  // Switch between English and Arabic
  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang)
  }

  // Clear chat messages from state and localStorage
  const handleClear = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)]">
      {/* Header — title, language toggle, clear button */}
      <div className="border-b-2 border-border bg-cream px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text">
            {language === 'ar' ? 'المرشد الذكي' : 'AI Mentor'}
          </h1>
          <p className="text-xs text-text-muted">
            {language === 'ar'
              ? 'حلّ مسائل SQL بتوجيه من الخبير'
              : 'Solve SQL problems with expert guidance'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle language={language} onChange={handleLanguageChange} />
          <button
            onClick={handleClear}
            className="text-xs text-text-muted hover:text-text font-medium transition-colors"
          >
            {language === 'ar' ? 'مسح المحادثة' : 'Clear chat'}
          </button>
        </div>
      </div>

      {/* Message list — greeting, chat bubbles, loading dots */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-cream/50">
        <div className="max-w-3xl mx-auto">
          {(!hydrated || messages.length === 0) && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-card border-2 border-border text-text">
                <p className="text-sm leading-relaxed">
                  {greetings[language]}
                </p>
              </div>
            </div>
          )}

          {hydrated && messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              text={msg.text}
              language={language}
              images={msg.images}
            />
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="rounded-2xl px-4 py-3 bg-card border-2 border-border">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar — text input, image upload, send button */}
      <ChatInput onSend={handleSend} disabled={loading} language={language} />
    </div>
  )
}
