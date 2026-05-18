'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

const PUBLIC_PATHS = ['/login', '/signup']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user && !PUBLIC_PATHS.includes(pathname)) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-text-muted" />
      </div>
    )
  }

  if (!user && !PUBLIC_PATHS.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
