import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Create Account — Sql Craker',
  description: 'Create your Sql Craker account and start mastering SQL from beginner to advanced.',
}

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children
}
