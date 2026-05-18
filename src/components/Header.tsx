'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/postgres', label: 'PostgreSQL' },
  { href: '/playground', label: 'Playground' },
  { href: '/chat', label: 'Mentor' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b-2 border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-yellow border-2 border-border-dark flex items-center justify-center text-sm font-bold text-text group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-lg text-text hidden sm:block">
            SQL Helper
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-card text-text shadow-sm border-2 border-border'
                    : 'text-text-secondary hover:text-text hover:bg-card/50'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
