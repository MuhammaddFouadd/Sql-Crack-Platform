'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from './ThemeProvider'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface MonacoApi {
  editor: {
    defineTheme: (name: string, theme: {
      base: string;
      inherit: boolean;
      rules: Array<{ token: string; foreground?: string; fontStyle?: string }>;
      colors: Record<string, string>;
    }) => void;
  };
}

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  placeholder?: string
  minHeight?: string
}

function defineMonokaiTheme(monaco: MonacoApi) {
  monaco.editor.defineTheme('monokai-pro', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'fc618d', fontStyle: 'bold' },
      { token: 'string.sql', foreground: 'fce566' },
      { token: 'number', foreground: 'fd9353' },
      { token: 'comment', foreground: '69676c', fontStyle: 'italic' },
      { token: 'type', foreground: '7bd88f' },
      { token: 'function', foreground: '5ad4e6' },
      { token: 'identifier', foreground: 'f7f1ff' },
      { token: 'delimiter', foreground: 'f7f1ff' },
      { token: 'variable', foreground: 'f7f1ff' },
      { token: 'operator', foreground: 'f7f1ff' },
    ],
    colors: {
      'editor.background': '#222222',
      'editor.foreground': '#f7f1ff',
      'editor.lineHighlightBackground': '#2a2a2a',
      'editor.selectionBackground': '#525053',
      'editor.inactiveSelectionBackground': '#3a3a3a',
      'editorCursor.foreground': '#f7f1ff',
      'editorLineNumber.foreground': '#525053',
      'editorLineNumber.activeForeground': '#8b888f',
      'editorGutter.background': '#222222',
      'editorWidget.background': '#191919',
      'editorWidget.border': '#525053',
      'input.background': '#363537',
      'input.border': '#525053',
      'input.foreground': '#f7f1ff',
      'focusBorder': '#525053',
      'list.activeSelectionBackground': '#363537',
      'list.hoverBackground': '#2a2a2a',
    },
  })
}

export default function SqlEditor({ value, onChange, onRun, placeholder, minHeight }: SqlEditorProps) {
  const [monacoReady, setMonacoReady] = useState(true)
  const [offline, setOffline] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const checkDone = useRef(false)
  const { theme } = useTheme()

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
        theme={theme === 'dark' ? 'monokai-pro' : 'light'}
        beforeMount={defineMonokaiTheme}
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
