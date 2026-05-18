const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const

export function validateEnv() {
  const missing: string[] = []
  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    console.warn(
      `[SqlCraker] Firebase env vars missing: ${missing.join(', ')}\n` +
      'Sign-in/sign-up will be unavailable. Copy env.example to .env.local and fill in values to enable authentication.'
    )
  }
}
