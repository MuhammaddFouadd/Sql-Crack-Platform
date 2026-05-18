'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  placeholder?: string
  minHeight?: string
}

export default function SqlEditor({ value, onChange, onRun, placeholder, minHeight }: SqlEditorProps) {
  const [monacoReady, setMonacoReady] = useState(true)
  const [offline, setOffline] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const checkDone = useRef(false)

  useEffect(() => {
    if (checkDone.current) return
    checkDone.current = true
    const timer = setTimeout(() => {
      if (!document.querySelector('.monaco-editor')) {
        setMonacoReady(false)
        setOffline(!navigator.onLine)
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      onRun()
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newVal)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2
      })
    }
  }, [value, onChange, onRun])

  if (!monacoReady) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Write your SQL here...'}
        spellCheck={false}
        className="w-full h-full font-mono text-sm bg-cream-dark border-0 p-4 text-text placeholder:text-text-muted/40 focus:outline-none resize-none"
        style={{ minHeight: minHeight || '120px' }}
      />
    )
  }

  return (
    <div className="w-full h-full relative">
      <MonacoEditor
        height="100%"
        defaultLanguage="sql"
        theme="light"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          tabSize: 2,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
        }}
      />
      {offline && (
        <div className="absolute bottom-2 right-2 bg-yellow-light border border-yellow/30 rounded-lg px-2.5 py-1 text-[10px] text-yellow-dark font-medium">
          Offline — using text editor
        </div>
      )}
    </div>
  )
}
