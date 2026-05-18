import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SQL Lessons — Learn SQL Step by Step | Sql Craker',
  description: '14 structured SQL lessons from SELECT to Window Functions. Each lesson includes explanations, examples, common mistakes, and practice exercises.',
}

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return children
}
