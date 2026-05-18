'use client'

// ── Registers the service worker for offline/PWA support ──
import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  // Register sw.js on mount if the browser supports service workers
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  return null
}
