'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub: (() => void) | undefined
    let mounted = true

    const init = async () => {
      try {
        const { auth } = await import('@/lib/firebase')
        const { onAuthStateChanged } = await import('firebase/auth')
        if (auth) {
          unsub = onAuthStateChanged(auth, (u) => {
            if (mounted) {
              setUser(u)
              setLoading(false)
            }
          })
        } else {
          if (mounted) setLoading(false)
        }
      } catch {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => { mounted = false; unsub?.() }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await import('@/lib/firebase')
      if (!auth || !googleProvider) return
      const { signInWithPopup } = await import('firebase/auth')
      await signInWithPopup(auth, googleProvider)
    } catch {}
  }

  const signIn = async (email: string, password: string) => {
    const { auth } = await import('@/lib/firebase')
    if (!auth) return
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    const { auth } = await import('@/lib/firebase')
    if (!auth) return
    const { createUserWithEmailAndPassword } = await import('firebase/auth')
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    try {
      const { auth } = await import('@/lib/firebase')
      if (!auth) return
      const { signOut } = await import('firebase/auth')
      await signOut(auth)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
