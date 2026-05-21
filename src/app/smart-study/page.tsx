'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import SpacedRepetition from '@/components/smart-study/SpacedRepetition'
import ActiveRecall from '@/components/smart-study/ActiveRecall'
import InterleavedPractice from '@/components/smart-study/InterleavedPractice'
import MasteryGraph from '@/components/smart-study/MasteryGraph'
import SyncProvider from '@/components/smart-study/SyncProvider'
import { useSmartStudyStore } from '@/lib/smart-study/store'
import { flashcards } from '@/lib/smart-study/flashcards'
import { cn } from '@/lib/utils'
import {
  Brain,
  Sparkles,
  BarChart3,
  TrendingUp,
  Cloud,
  CloudOff,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react'

const statsCards = [
  {
    key: 'recall',
    icon: Brain,
    label: 'Flashcards Reviewed',
    color: 'text-purple',
    bg: 'bg-purple-light border-purple/30',
    iconBg: 'bg-purple',
    getValue: (reviewed: number, total: number) => `${reviewed}`,
    getSub: (_: number, total: number) => `of ${total} total`,
  },
  {
    key: 'accuracy',
    icon: CheckCircle2,
    label: 'Practice Accuracy',
    color: 'text-green',
    bg: 'bg-green-light border-green/30',
    iconBg: 'bg-green',
    getValue: (_: number, __: number, correct: number, total: number) =>
      total > 0 ? `${Math.round((correct / total) * 100)}%` : '--',
    getSub: (_: number, __: number, correct: number, total: number) =>
      total > 0 ? `${correct}/${total} correct` : 'No practice yet',
  },
  {
    key: 'interval',
    icon: TrendingUp,
    label: 'Memory Strength',
    color: 'text-yellow',
    bg: 'bg-yellow-light border-yellow/30',
    iconBg: 'bg-yellow',
    getValue: (reviewed: number, _: number) => {
      if (reviewed === 0) return '--'
      return reviewed < 5 ? 'Building' : reviewed < 15 ? 'Growing' : 'Strong'
    },
    getSub: (reviewed: number) =>
      reviewed > 0 ? `${reviewed} cards learned` : 'Start reviewing!',
  },
  {
    key: 'sync',
    icon: Cloud,
    label: 'Sync Status',
    color: 'text-blue',
    bg: 'bg-blue-light border-blue/30',
    iconBg: 'bg-blue',
    getValue: () => '',
    getSub: () => '',
    custom: true,
  },
]

export default function SmartStudyPage() {
  const { user } = useAuth()
  const { cards, mastery, syncStatus, lastSyncedAt, syncToServer } = useSmartStudyStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const reviewed = useMemo(
    () => cards.filter((c) => c.repetitions > 0).length,
    [cards]
  )
  const totalPractice = useMemo(
    () => mastery.reduce((s, m) => s + m.total, 0),
    [mastery]
  )
  const correctPractice = useMemo(
    () => mastery.reduce((s, m) => s + m.correct, 0),
    [mastery]
  )

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
        <div className="text-center py-20">
          <div className="animate-pulse text-text-muted">Loading smart study tools...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <SyncProvider />

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple to-purple-light border-2 border-purple/40 flex items-center justify-center shadow-md">
            <Brain size={28} className="text-purple" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight">Smart Study</h1>
            <p className="text-text-secondary">Research-backed SQL learning with spaced repetition & active recall</p>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border-2 border-border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-light border-2 border-purple/30 flex items-center justify-center">
              <Brain size={18} className="text-purple" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text tabular-nums">{reviewed}</p>
          <p className="text-xs text-text-muted mt-0.5">of {cards.length} flashcards reviewed</p>
        </div>
        <div className="bg-card border-2 border-border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-light border-2 border-green/30 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text tabular-nums">
            {totalPractice > 0 ? `${Math.round((correctPractice / totalPractice) * 100)}%` : '--'}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            {totalPractice > 0 ? `${correctPractice}/${totalPractice} correct` : 'No practice yet'}
          </p>
        </div>
        <div className="bg-card border-2 border-border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-light border-2 border-yellow/30 flex items-center justify-center">
              <TrendingUp size={18} className="text-yellow" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text tabular-nums">
            {reviewed === 0 ? '--' : reviewed < 5 ? 'Building' : reviewed < 15 ? 'Growing' : 'Strong'}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            {reviewed > 0 ? `${reviewed} cards learned` : 'Start reviewing!'}
          </p>
        </div>
        <div className={cn(
          'bg-card border-2 rounded-2xl p-5 card-hover',
          user
            ? syncStatus === 'synced' ? 'border-green/30' : syncStatus === 'error' ? 'border-rose/30' : 'border-border'
            : 'border-border'
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-10 h-10 rounded-xl border-2 flex items-center justify-center',
              user ? 'bg-blue-light border-blue/30' : 'bg-cream-dark border-border'
            )}>
              {user ? <Cloud size={18} className="text-blue" /> : <CloudOff size={18} className="text-text-muted" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {syncStatus === 'syncing' ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue animate-pulse" />
                    <span className="text-xs font-semibold text-blue">Syncing...</span>
                  </div>
                ) : syncStatus === 'synced' ? (
                  <span className="text-xs font-semibold text-green flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Synced
                  </span>
                ) : syncStatus === 'error' ? (
                  <button onClick={() => user && syncToServer(user.userId)} className="text-xs font-semibold text-rose hover:underline flex items-center gap-1">
                    Sync failed — tap to retry
                  </button>
                ) : (
                  <span className="text-xs text-text-muted">Ready to sync</span>
                )}
                {lastSyncedAt && (
                  <span className="text-[10px] text-text-muted ml-2">
                    {new Date(lastSyncedAt).toLocaleTimeString()}
                  </span>
                )}
              </>
            ) : (
              <Link href="/login" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                <CloudOff size={12} />
                Sign in to sync
              </Link>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            {user ? 'Progress saved to cloud' : 'Saving locally only'}
          </p>
        </div>
      </div>

      {/* Research Banner */}
      <div className="bg-gradient-to-r from-purple-light/60 via-card to-accent-light/60 border-2 border-purple/20 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-card border-2 border-purple/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={18} className="text-purple" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-text mb-1">Built on cognitive science research</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Techniques adapted from <span className="font-semibold text-text">Stanford, MIT, CMU, Berkeley, and Harvard</span> —{' '}
              Active Recall (60% better retention), Spaced Repetition (SM-2 algorithm),
              Interleaving (mix topics), and Deliberate Practice.
            </p>
          </div>
        </div>
      </div>

      {/* Main tools grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <SpacedRepetition />
        <ActiveRecall />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <InterleavedPractice />
        <MasteryGraph />
      </div>

      {/* How-to guide */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-accent-light border-2 border-accent/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent" />
          </div>
          <h2 className="font-bold text-text">How to use this page</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Spaced Repetition', desc: 'Review flashcards daily. Rate your recall honestly — the SM-2 algorithm schedules optimal review times.', icon: '🔄', color: 'text-purple' },
            { step: '2', title: 'Active Recall', desc: 'Test yourself by topic. Always try to answer before revealing. Struggle is part of learning!', icon: '💡', color: 'text-yellow' },
            { step: '3', title: 'Interleaved Practice', desc: 'Mixed-topic problems force your brain to choose the right technique — better than blocked practice.', icon: '🎯', color: 'text-blue' },
            { step: '4', title: 'Track Mastery', desc: 'Monitor your progress. Focus on weak areas (low % topics) and celebrate your strong ones.', icon: '📊', color: 'text-green' },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-xl bg-cream-dark border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <span className={cn('text-xs font-bold', item.color)}>Step {item.step}</span>
              </div>
              <p className="font-semibold text-text text-sm mb-1">{item.title}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
