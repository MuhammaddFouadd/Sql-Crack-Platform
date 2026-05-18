'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '@/lib/auth'

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
  loading: false,
  signIn: async () => null,
  signUp: async () => null,
  logout: async () => {},
  signInWithGoogle: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const result = authSignIn(email, password)
    if (result.success) {
      setUser(getCurrentUser())
      return null
    }
    return result.error || 'Failed to sign in.'
  }

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const result = authSignUp(email, password)
    if (result.success) {
      setUser(getCurrentUser())
      return null
    }
    return result.error || 'Failed to create account.'
  }

  const signInWithGoogle = async () => {}

  const logout = async () => {
    authSignOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, signIn, signUp, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
