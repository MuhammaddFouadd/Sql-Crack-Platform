'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, onAuthChange } from '@/lib/auth'

interface AuthUser {
  email: string
  userId: string
}

export interface SignUpResult {
  needsEmailConfirm: boolean
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<SignUpResult | string | null>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  logout: async () => {},
  signInWithGoogle: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
    const unsub = onAuthChange((u) => {
      setUser(u)
    })
    return unsub
  }, [])

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const result = await authSignIn(email, password)
    if (result.success) {
      const u = await getCurrentUser()
      setUser(u)
      return null
    }
    return result.error || 'Failed to sign in.'
  }

  const signUp = async (email: string, password: string): Promise<SignUpResult | string | null> => {
    const result = await authSignUp(email, password)
    if (result.success) {
      if (!result.needsEmailConfirm) {
        const u = await getCurrentUser()
        setUser(u)
        return { needsEmailConfirm: false }
      }
      return { needsEmailConfirm: true }
    }
    return result.error || 'Failed to create account.'
  }

  const signInWithGoogle = async () => {
    const supabase = (await import('@/lib/supabase/client')).createClient()
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const logout = async () => {
    await authSignOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
