'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { X, LogIn, BookOpen } from 'lucide-react'

const LS_DISMISSED = 'sql_reminder_dismissed'
const LS_STATE = 'sql_reminder_state'
const INITIAL_DELAY = 25000
const RE_SHOW_DELAY = 45000

function lsGet(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

function lsSet(key: string, val: string) {
  if (typeof window !== 'undefined') localStorage.setItem(key, val)
}

interface ReminderState {
  lastShown: number
  pageViews: number
}

function readState(): ReminderState {
  try {
    return JSON.parse(lsGet(LS_STATE) || 'null') || { lastShown: 0, pageViews: 0 }
  } catch {
    return { lastShown: 0, pageViews: 0 }
  }
}

function writeState(s: ReminderState) {
  lsSet(LS_STATE, JSON.stringify(s))
}

export default function LoginReminder() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (user || lsGet(LS_DISMISSED) === '1') return

    const state = readState()

    if (pathname !== prevPathRef.current) {
      state.pageViews++
      prevPathRef.current = pathname
      writeState(state)
    }

    const now = Date.now()
    const elapsed = now - state.lastShown

    const show = () => {
      setOpen(true)
      state.lastShown = now
      state.pageViews = 0
      writeState(state)
    }

    if (state.lastShown === 0) {
      if (state.pageViews >= 2) {
        show()
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(show, INITIAL_DELAY)
      }
    } else if (elapsed >= RE_SHOW_DELAY && state.pageViews >= 2) {
      show()
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [user, pathname])

  const dismiss = () => {
    setOpen(false)
    const state = readState()
    state.lastShown = Date.now()
    state.pageViews = 0
    writeState(state)
  }

  const dontRemind = () => {
    lsSet(LS_DISMISSED, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-card border-2 border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-cream-dark transition-colors"
        >
          <X size={16} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-13 h-13 rounded-xl bg-accent-light flex items-center justify-center mb-4 p-3">
            <BookOpen size={26} className="text-accent" />
          </div>
          <h3 className="text-lg font-bold text-text mb-1">Track Your Progress</h3>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            Sign in to save your solved questions, track your learning streak, and pick up where you left off across sessions.
          </p>
          <div className="flex flex-col gap-2 w-full">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:bg-accent-hover transition-all"
            >
              <LogIn size={15} />
              Sign In
            </Link>
            <button
              onClick={dontRemind}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-medium text-text-muted hover:text-text hover:bg-cream-dark transition-colors"
            >
              Don&apos;t remind me again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
