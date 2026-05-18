import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sign In — Sql Craker',
  description: 'Sign in to your Sql Craker account to track your SQL learning progress.',
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}
