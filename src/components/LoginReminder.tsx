'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { LogIn, UserPlus, BookOpen, X, CheckCircle } from 'lucide-react'

type Trigger = 'solved' | 'pageviews' | 'engagement'

interface ReminderMessage {
  title: string
  body: string
  action: 'signin' | 'signup'
  actionLabel: string
  actionHref: string
  icon: typeof BookOpen
}

const MESSAGES: Record<Trigger, ReminderMessage> = {
  solved: {
    title: 'Save Your Progress',
    body: "You just solved a question! Sign up to keep your progress synced across all your devices — it only takes a minute.",
    action: 'signup',
    actionLabel: 'Create Free Account',
    actionHref: '/signup',
    icon: CheckCircle,
  },
  pageviews: {
    title: 'Track Your Learning',
    body: 'You\'ve been exploring the lessons. Create an account to save your solved questions and pick up where you left off.',
    action: 'signup',
    actionLabel: 'Create Free Account',
    actionHref: '/signup',
    icon: BookOpen,
  },
  engagement: {
    title: 'Already Learning?',
    body: "You've spent some time on the lessons. Sign in to track your progress and keep it forever.",
    action: 'signin',
    actionLabel: 'Sign In',
    actionHref: '/login',
    icon: LogIn,
  },
}

export function fireSolvedReminder() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sql-reminder-solved'))
  }
}

export default function LoginReminder() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [trigger, setTrigger] = useState<Trigger>('pageviews')
  const dismissedThisSession = useRef(false)
  const pageViewCount = useRef(0)
  const lastPath = useRef(pathname)
  const engagementTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const show = useCallback((t: Trigger) => {
    if (dismissedThisSession.current) return
    setTrigger(t)
    setVisible(true)
  }, [])

  useEffect(() => {
    if (user) return

    const onSolved = () => show('solved')
    window.addEventListener('sql-reminder-solved', onSolved)
    return () => window.removeEventListener('sql-reminder-solved', onSolved)
  }, [user, show])

  useEffect(() => {
    if (user || dismissedThisSession.current) return

    if (pathname.startsWith('/lessons') && pathname !== lastPath.current) {
      pageViewCount.current++
      lastPath.current = pathname

      if (pageViewCount.current >= 2) {
        show('pageviews')
      }
    }

    if (pathname.startsWith('/lessons') && !engagementTimer.current) {
      engagementTimer.current = setTimeout(() => {
        if (!dismissedThisSession.current) show('engagement')
      }, 90000)
    }

    return () => {
      if (engagementTimer.current) clearTimeout(engagementTimer.current)
    }
  }, [user, pathname, show])

  const dismiss = () => {
    setVisible(false)
    dismissedThisSession.current = true
  }

  if (!visible || user) return null

  const msg = MESSAGES[trigger]
  const Icon = msg.icon

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slide-up">
      <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
          <Icon size={18} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-text mb-0.5">{msg.title}</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{msg.body}</p>
          <div className="flex items-center gap-2 mt-3">
            <Link
              href={msg.actionHref}
              onClick={() => setVisible(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {msg.actionLabel}
            </Link>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text hover:bg-cream-dark transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-cream-dark transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
