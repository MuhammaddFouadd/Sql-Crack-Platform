'use client'

import { Suspense, useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Loader2, LogIn } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirect = searchParams.get('redirect') || '/lessons'

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    if (err) {
      setError(err)
    } else {
      router.push(redirect)
    }
    setLoading(false)
  }

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-8">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow to-yellow-dark border-2 border-yellow-dark flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-text mb-1">Welcome back</h1>
        <p className="text-sm text-text-secondary">Sign in to track your progress</p>
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-xs font-semibold text-text-muted block mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full bg-cream-dark border-2 border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-semibold text-text-muted block mb-1.5">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full bg-cream-dark border-2 border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {error && (
          <div className="bg-rose-light border-2 border-rose/30 rounded-xl px-4 py-2.5">
            <p className="text-xs text-rose font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
          Sign In
        </button>
      </form>

      <p className="text-center mt-6 text-xs text-text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-accent font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  )
}

export default function LoginClient() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="bg-card border-2 border-border rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
            <Loader2 size={20} className="animate-spin text-text-muted" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
