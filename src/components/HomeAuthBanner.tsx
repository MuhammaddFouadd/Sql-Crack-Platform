'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function HomeAuthBanner() {
  const { user } = useAuth()

  if (user) return null

  return (
    <div className="bg-gradient-to-br from-yellow-light/50 to-card border-2 border-yellow/30 rounded-3xl p-8 md:p-10 mb-24">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-3xl">📝</span>
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">Create a free account</h2>
          <p className="text-sm text-text-secondary max-w-xl">
            Track your progress, save solved questions, and pick up where you left off.
            Your answers persist across sessions — even if you clear your browser data.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          ['Progress tracking', 'Solved questions saved across sessions'],
          ['Personal dashboard', 'See which topics you&apos;ve mastered'],
          ['Sync across devices', 'Login from any browser to pick up where you left off'],
        ].map(([title, desc]) => (
          <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-yellow/20">
            <span className="text-yellow text-lg leading-none mt-0.5">▶</span>
            <div>
              <div className="text-sm font-semibold text-text">{title}</div>
              <div className="text-xs text-text-secondary mt-0.5">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/signup"
          className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
        >
          Create Account
        </Link>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-card text-text font-semibold text-sm border-2 border-border hover:border-accent hover:text-accent transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
