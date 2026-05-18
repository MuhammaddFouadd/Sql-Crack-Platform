interface StoredUser {
  id: string
  email: string
  passwordHash: string
  createdAt: number
}

interface Session {
  token: string
  email: string
  userId: string
}

const USERS_KEY = 'sqlcraker_users'
const SESSION_KEY = 'sqlcraker_session'

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(36)
}

function generateToken(): string {
  return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function signUp(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'An account with this email already exists.' }
  }

  const user: StoredUser = {
    id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    email,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  }

  users.push(user)
  saveUsers(users)

  const session: Session = {
    token: generateToken(),
    email,
    userId: user.id,
  }
  saveSession(session)

  return { success: true }
}

export function signIn(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers()
  const user = users.find(u => u.email === email)

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Invalid email or password.' }
  }

  const session: Session = {
    token: generateToken(),
    email,
    userId: user.id,
  }
  saveSession(session)

  return { success: true }
}

export function signOut() {
  clearSession()
}

export function getCurrentUser(): { email: string; userId: string } | null {
  const session = getSession()
  return session ? { email: session.email, userId: session.userId } : null
}

export function onAuthChange(callback: (user: { email: string; userId: string } | null) => void): () => void {
  const check = () => callback(getCurrentUser())
  check()
  window.addEventListener('storage', check)
  return () => window.removeEventListener('storage', check)
}
