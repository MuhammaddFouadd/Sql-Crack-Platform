import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'PostgreSQL Guide — EXPLAIN, Indexes, Performance | Sql Craker',
  description: 'Learn PostgreSQL-specific features: EXPLAIN ANALYZE, B-tree indexes, performance tuning, and PostgreSQL vs MySQL comparisons.',
}

export default function PostgresLayout({ children }: { children: ReactNode }) {
  return children
}
