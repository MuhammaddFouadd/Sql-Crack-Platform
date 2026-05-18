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

const STORAGE_KEY = 'sql-mentor-chat'
const LANGUAGE_KEY = 'sql-mentor-lang'

const greetings: Record<'en' | 'ar', string> = {
  en: "Hi! I'm your SQL mentor. Describe a problem you're working on and I'll help you step by step with hints and guidance.",
  ar: 'مرحباً! أنا مرشدك في SQL. صف لي المشكلة التي تعمل عليها وسأساعدك خطوة بخطوة بالتلميحات والتوجيه.',
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_KEY)
      if (saved === 'en' || saved === 'ar') return saved
    }
    return 'en'
  })
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string, images?: Attachment[]) => {
    const userMsg: Message = { role: 'user', text, images }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
        images: m.images,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, images, history, language }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

      const assistantMsg: Message = { role: 'assistant', text: data.response }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e) {
      console.error('Chat error:', e)
      const serverMsg = e instanceof Error ? e.message : ''
      const errText =
        language === 'ar'
          ? 'عذراً، حدث خطأ. حاول مرة أخرى.'
          : 'Sorry, something went wrong. Please try again.'
      const errorMsg: Message = {
        role: 'assistant',
        text: serverMsg || errText,
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang)
  }

  const handleClear = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
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

      <div className="flex-1 overflow-y-auto px-6 py-4 bg-cream/50">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-card border-2 border-border text-text">
                <p className="text-sm leading-relaxed">
                  {greetings[language]}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
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

      <ChatInput onSend={handleSend} disabled={loading} language={language} />
    </div>
  )
}
