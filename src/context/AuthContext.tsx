'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthUser {
  email: string
  userId: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
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
    const { getCurrentUser } = require('@/lib/auth')
    setUser(getCurrentUser())
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { signIn: authSignIn, getCurrentUser } = await import('@/lib/auth')
    const result = authSignIn(email, password)
    if (result.success) {
      setUser(getCurrentUser())
      return null
    }
    return result.error || 'Failed to sign in.'
  }

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const { signUp: authSignUp, getCurrentUser } = await import('@/lib/auth')
    const result = authSignUp(email, password)
    if (result.success) {
      setUser(getCurrentUser())
      return null
    }
    return result.error || 'Failed to create account.'
  }

  const signInWithGoogle = async () => {}

  const logout = async () => {
    const { signOut } = await import('@/lib/auth')
    signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
