'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSmartStudyStore } from '@/lib/smart-study/store'
import { flashcards } from '@/lib/smart-study/flashcards'

export default function SyncProvider() {
  const { user } = useAuth()
  const seedCards = useSmartStudyStore((s) => s.seedCards)
  const loadFromServer = useSmartStudyStore((s) => s.loadFromServer)
  const syncToServer = useSmartStudyStore((s) => s.syncToServer)
  const syncStatus = useSmartStudyStore((s) => s.syncStatus)
  const initialized = useRef(false)

  useEffect(() => {
    seedCards(flashcards)
  }, [seedCards])

  useEffect(() => {
    if (!user) return
    if (initialized.current) return
    initialized.current = true
    loadFromServer(user.userId)
  }, [user?.userId])

  useEffect(() => {
    if (!user || syncStatus !== 'idle') return
    const interval = setInterval(() => {
      syncToServer(user.userId)
    }, 30000)
    return () => clearInterval(interval)
  }, [user, syncStatus])

  return null
}
