'use client'

// ── Site navigation header ──
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// Nav link definitions (Home, Lessons, Playground, Mentor)
const links = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/playground', label: 'Playground' },
  { href: '/chat', label: 'Mentor' },
]

export default function Header() {
  const pathname = usePathname() // Current route, used to highlight active link

  return (
    <header className="pt-4 pb-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-card/95 backdrop-blur-lg border-2 border-border rounded-2xl shadow-sm px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow to-yellow-dark border-2 border-yellow-dark flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="font-bold text-lg text-text tracking-tight">
              Sql<span className="text-accent">Craker</span>
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
                    'px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-cream-dark text-text shadow-sm border border-border'
                      : 'text-text-secondary hover:text-text hover:bg-cream-dark/50'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
