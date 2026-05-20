import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import ThemeProvider from '@/components/ThemeProvider'
import ScrollToTop from '@/components/ScrollToTop'
import AuthProvider from '@/context/AuthContext'
import LoginReminder from '@/components/LoginReminder'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://sqlcraker.com'),
  title: 'Sql Craker — Master SQL. Crack the Interview.',
  description:
    'Interactive SQL learning platform. Master SQL from beginner to advanced with lessons, playground, and practice exercises.',
  openGraph: {
    title: 'Sql Craker — Master SQL. Crack the Interview.',
    description:
      'Interactive SQL learning platform. Master SQL from beginner to advanced with lessons, playground, and practice exercises.',
    url: 'https://sqlcraker.com',
    siteName: 'Sql Craker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sql Craker — Master SQL. Crack the Interview.',
    description:
      'Interactive SQL learning platform. Master SQL from beginner to advanced with lessons, playground, and practice exercises.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`}
        </Script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <LoginReminder />
            <main className="min-h-[calc(100vh-5.5rem)]">
              {children}
            </main>
            <ServiceWorkerRegister />
            <ScrollToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
