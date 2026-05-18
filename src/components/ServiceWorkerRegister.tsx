'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    if (isDev) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) =>
          Promise.all(regs.map((r) => r.unregister()))
        )
      }
      return
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
      })
    }
  }, [])

  return null
}
