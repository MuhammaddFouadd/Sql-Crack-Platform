import { createClient } from './supabase/client'

export async function signUp(email: string, password: string): Promise<{
  success: boolean
  error?: string
  needsEmailConfirm?: boolean
}> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    return { success: false, error: error.message }
  }
  if (data?.session) {
    return { success: true, needsEmailConfirm: false }
  }
  return { success: true, needsEmailConfirm: true }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { success: false, error: 'Invalid email or password.' }
  }
  return { success: true }
}

export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<{ email: string; userId: string } | null> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) return null
  return { email: data.session.user.email!, userId: data.session.user.id }
}

export function onAuthChange(callback: (user: { email: string; userId: string } | null) => void): () => void {
  const supabase = createClient()
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({ email: session.user.email!, userId: session.user.id })
    } else {
      callback(null)
    }
  })
  return () => data.subscription.unsubscribe()
}
