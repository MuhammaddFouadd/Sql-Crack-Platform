import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'SQL Playground — Interactive Browser-Based SQL Editor | Sql Craker',
  description: 'Write and run SQL queries in your browser. Practice with multiple schemas, export results, and explore database concepts interactively.',
}

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return children
}
