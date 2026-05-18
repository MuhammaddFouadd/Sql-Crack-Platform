// Global layout — root HTML shell for the app
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

// Load Inter & JetBrains Mono with CSS variable tokens
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// Page metadata for SEO
export const metadata: Metadata = {
  title: 'Sql Craker — Master SQL. Crack the Interview.',
  description:
    'Interactive SQL learning platform. Master SQL from beginner to advanced with lessons, playground, and an AI mentor.',
}

// Root layout wrapping all pages with header, main, and service worker
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-5.5rem)]">
          {children}
        </main>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
