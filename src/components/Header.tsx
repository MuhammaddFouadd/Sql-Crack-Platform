'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from './ThemeProvider'
import { useAuth } from '@/context/AuthContext'
import { Sun, Moon, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/playground', label: 'Playground' },
]

export default function Header() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

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
                  aria-current={isActive ? 'page' : undefined}
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

            <div className="w-px h-6 bg-border mx-1" />

            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-cream-dark/50 transition-all"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center hover:opacity-80 transition-opacity"
                  title={user.email}
                >
                  {user.email[0].toUpperCase()}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-10 z-20 bg-card border-2 border-border rounded-xl p-2 min-w-[160px] shadow-lg">
                      <p className="px-3 py-1.5 text-xs text-text-muted truncate">{user.email}</p>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={() => { logout(); setMenuOpen(false) }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-rose hover:bg-rose-light/50 transition-colors"
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-muted hover:text-accent hover:bg-cream-dark/50 border border-transparent hover:border-accent transition-all"
              >
                <LogIn size={14} />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
