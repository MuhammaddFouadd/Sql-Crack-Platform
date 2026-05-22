'use client'

import React, { useMemo, useState, useId, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import {
  Lightbulb,
  Route,
  Eye,
  Table2,
  ArrowLeftRight,
  Bookmark,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Terminal,
} from 'lucide-react'

interface Section {
  type: SectionType
  heading: string
  content: string
}

type SectionType = 'analogy' | 'pipeline' | 'visual' | 'reference' | 'decision' | 'summary' | 'warning' | 'syntax' | 'default'

const BOX_CHARS = /[┌─┐│├┤└┘┬┴┼└┘┴┬├─┼┴┬┤┌┐╔╗╚╝║═╠╣╩╦╬╤╧╨╥╙╘╓╒╪╫▐▌▀▄█▇▆▅▄▃▂▁]/

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'AS',
  'ON', 'JOIN', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'INNER', 'CROSS', 'SELF',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'DISTINCT', 'UNION', 'ALL', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'LIKE', 'BETWEEN',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'OVER', 'PARTITION', 'RANK', 'DENSE_RANK', 'ROW_NUMBER', 'LAG', 'LEAD',
  'FIRST_VALUE', 'NTILE', 'WITH', 'RECURSIVE',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CASCADE', 'DEFAULT', 'UNIQUE',
  'CHECK', 'CONSTRAINT', 'TRUE', 'FALSE', 'CAST', 'COALESCE', 'NULLIF',
])

const SQL_KEYWORDS_RE = new RegExp(`\\b(${[...SQL_KEYWORDS].join('|')})\\b`, 'gi')

const sectionConfig: Record<SectionType, { icon: React.ReactNode; label: string; headerClass: string; iconBg: string }> = {
  analogy: { icon: <Lightbulb size={16} />, label: 'Analogy', headerClass: 'text-yellow', iconBg: 'bg-yellow-light border-yellow/30 text-yellow' },
  pipeline: { icon: <Route size={16} />, label: 'Execution', headerClass: 'text-blue', iconBg: 'bg-blue-light border-blue/30 text-blue' },
  visual: { icon: <Eye size={16} />, label: 'Visual', headerClass: 'text-purple', iconBg: 'bg-purple-light border-purple/30 text-purple' },
  reference: { icon: <Table2 size={16} />, label: 'Reference', headerClass: 'text-green', iconBg: 'bg-green-light border-green/30 text-green' },
  decision: { icon: <ArrowLeftRight size={16} />, label: 'Decision Guide', headerClass: 'text-rose', iconBg: 'bg-rose-light border-rose/30 text-rose' },
  summary: { icon: <Bookmark size={16} />, label: 'Key Points', headerClass: 'text-accent', iconBg: 'bg-accent-light border-accent/30 text-accent' },
  warning: { icon: <AlertTriangle size={16} />, label: 'Heads Up', headerClass: 'text-rose', iconBg: 'bg-rose-light border-rose/30 text-rose' },
  syntax: { icon: <Terminal size={16} />, label: 'Syntax', headerClass: 'text-accent', iconBg: 'bg-accent-light border-accent/30 text-accent' },
  default: { icon: <HelpCircle size={16} />, label: 'Info', headerClass: 'text-text-muted', iconBg: 'bg-cream-dark border-border text-text-muted' },
}

function classifyHeading(heading: string): SectionType {
  const h = heading.toLowerCase()
  if (h.includes('analogy') || h.includes('mental model')) return 'analogy'
  if (h.includes('pipeline') || h.includes('execution order') || h.includes('step-by-step') || h.includes('execution')) return 'pipeline'
  if (h.includes('visual') || h.includes('walkthrough')) return 'visual'
  if (h.includes('reference') || h.includes('comparison') || h.includes('syntax') || h.includes('types comparison') || h.includes('operators') || h.includes('truth table') || h.includes('rules') || h.includes('hierarchy') || h.includes('variants') || h.includes('actions') || h.includes('precedence') || h.includes('methods') || h.includes('parts') || h.includes('forms') || h.includes('approaches')) return 'reference'
  if (h.includes('decision guide') || h.includes('when to use') || h.includes('which') || h.includes('translation strategy')) return 'decision'
  if (h.includes('what ') || h.includes('summary') || h.includes('golden rule') || h.includes('key rules') || h.includes('quick tips') || h.includes('quick rule') || h.includes('insight') || h.includes('does') || h.includes('is a') || h.includes('core operations')) return 'summary'
  if (h.includes('golden') || h.includes('trap') || h.includes('safety') || h.includes('caveats') || h.includes('important') || h.includes('mistake') || h.includes('nulls sorting')) return 'warning'
  return 'default'
}

function highlightSQLText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const tokenRe = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|--[^\n]*|\/\*[\s\S]*?\*\/|\b\d+(?:\.\d+)?\b|\b(?:[A-Z_]\w*)\b)/g
  let match: RegExpExecArray | null
  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (SQL_KEYWORDS.has(token.toUpperCase())) {
      parts.push(<span key={match.index} className="text-blue font-semibold">{token}</span>)
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      parts.push(<span key={match.index} className="text-yellow">{token}</span>)
    } else if ((token.startsWith("'") && token.endsWith("'")) || (token.startsWith('"') && token.endsWith('"'))) {
      parts.push(<span key={match.index} className="text-green">{token}</span>)
    } else {
      parts.push(token)
    }
    lastIndex = match.index + token.length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

function highlightInlineSQL(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const keywordRe = /\b([A-Z][A-Z_]{2,})\b/g
  let match: RegExpExecArray | null
  while ((match = keywordRe.exec(text)) !== null) {
    if (SQL_KEYWORDS.has(match[0])) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      parts.push(<code key={match.index} className="text-blue bg-blue-light/50 px-1 rounded text-xs font-semibold">{match[0]}</code>)
      lastIndex = match.index + match[0].length
    }
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length > 0 ? parts : [text]
}

function preprocessContent(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []
  let inBox = false
  let boxLines: string[] = []

  const flushBox = () => {
    if (boxLines.length > 0) {
      result.push('```sql')
      result.push(...boxLines)
      result.push('```')
      boxLines = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const hasBoxChar = BOX_CHARS.test(line) || BOX_CHARS.test(trimmed)
    const isQueryLine = /^(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|ON|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|SET)\b/i.test(trimmed) && trimmed.length > 8
    const isStepArrow = trimmed.startsWith('→') || trimmed.includes('→')

    if (hasBoxChar || isQueryLine || isStepArrow) {
      if (!inBox) {
        flushBox()
        inBox = true
      }
      boxLines.push(line)
    } else {
      if (inBox) {
        if (trimmed === '' && boxLines.length > 0) {
          boxLines.push(line)
        } else if (trimmed === '') {
          flushBox()
          result.push('')
        } else {
          const nextHasBox = lines.indexOf(line) + 1 < lines.length && (BOX_CHARS.test(lines[lines.indexOf(line) + 1]) || /^(SELECT|FROM|WHERE)\b/i.test(lines[lines.indexOf(line) + 1]?.trim() ?? ''))
          if (nextHasBox) {
            boxLines.push(line)
          } else {
            flushBox()
            result.push(line)
          }
        }
      } else {
        result.push(line)
      }
    }
  }
  flushBox()

  return result.map((l) => {
    if (l.includes('⚠') && !l.startsWith('```')) {
      return l.replace(/⚠\s*(.+)/g, '> ⚠ **$1**')
    }
    return l
  }).join('\n')
}

function preprocessDecisionContent(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(/^[‛'""'"'"'"'"'"'"'"'""]?([^'"'""]+?)[""'"'"'"'"'"'"'"]?\s*→\s*(.+)$/)
    if (match && trimmed.length < 120) {
      result.push(`- **“${match[1].trim()}”** → *${match[2].trim()}*`)
      inList = true
    } else {
      if (inList && trimmed === '') { result.push(''); inList = false }
      else result.push(line)
    }
  }
  return result.join('\n')
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <pre className="!bg-cream-darker !border-2 !border-border/80 !rounded-xl !p-4 !my-3 !overflow-x-auto !font-mono !text-sm !leading-relaxed">
      <code className={className}>{children}</code>
    </pre>
  )
}

function StepBadge({ num }: { num: string }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-accent text-white text-xs font-bold shrink-0 mr-2">
      {num}
    </span>
  )
}

const mdComponents: any = {
  table: ({ children }: any) => (
    <div className="overflow-x-auto overflow-y-auto max-h-96 my-3 rounded-xl border-2 border-border/60">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border-b-2 border-border/70 bg-cream-darker/80 px-3 py-2.5 text-left font-semibold text-text text-xs uppercase tracking-wider sticky top-0">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border-b border-border/40 px-3 py-2 text-text-secondary text-sm">{children}</td>
  ),
  p: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : ''
    if (text.startsWith('⚠')) {
      return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-light border border-rose/30 my-3">
          <AlertTriangle size={16} className="text-rose shrink-0 mt-0.5" />
          <p className="text-sm text-text-secondary leading-relaxed">{text.replace(/^⚠\s*/, '')}</p>
        </div>
      )
    }
    const stepMatch = text.match(/^(\d+)\.\s+(.+?)\s*[→➜]\s*(.+)$/)
    if (stepMatch) {
      return (
        <div className="flex items-start gap-2 my-2 py-1">
          <StepBadge num={stepMatch[1]} />
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-text text-sm">{stepMatch[2].trim()}</span>
            <span className="text-accent mx-1.5">→</span>
            <span className="text-text-secondary text-sm">{stepMatch[3].trim()}</span>
          </div>
        </div>
      )
    }
    const hasSQL = /\b[A-Z][A-Z_]{2,}\b/.test(text) && [...text.matchAll(/\b[A-Z][A-Z_]{2,}\b/g)].some((m) => SQL_KEYWORDS.has(m[0]))
    if (hasSQL) {
      return <p className="text-text leading-relaxed my-1.5">{highlightInlineSQL(text)}</p>
    }
    return <p className="text-text leading-relaxed my-1.5">{children}</p>
  },
  strong: ({ children }: any) => <strong className="font-bold text-text">{children}</strong>,
  hr: () => <div className="my-4 h-px bg-border/60" />,
  pre: ({ children }: any) => <CodeBlock>{children}</CodeBlock>,
  code: ({ children, className }: any) => {
    const isBlock = Boolean(className)
    const text = typeof children === 'string' ? children : ''
    if (isBlock || text.length > 40 || text.includes('\n')) {
      return <>{highlightSQLText(text)}</>
    }
    return <code className="text-accent bg-cream-dark/80 px-1.5 py-0.5 rounded-md text-xs font-mono font-semibold border border-border/50">{children}</code>
  },
  blockquote: ({ children }: any) => (
    <div className="border-l-3 border-accent bg-accent-light/50 pl-4 py-2 pr-3 my-3 rounded-r-xl">
      {children}
    </div>
  ),
  li: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : ''
    const arrowMatch = text.match(/^["""'"'"'"'"'"']?(.+?)["""'"'"'"'"'"']?\s*[→➜]\s*(.+)$/)
    if (arrowMatch) {
      return (
        <li className="flex items-start gap-3 py-1.5 px-3 rounded-lg bg-card border border-border/50 my-1">
          <span className="flex-1 text-sm text-text font-medium">{arrowMatch[1].trim()}</span>
          <span className="text-accent font-bold shrink-0">→</span>
          <span className="flex-1 text-sm text-accent font-semibold">{arrowMatch[2].trim()}</span>
        </li>
      )
    }
    const stepMatch = text.match(/^(\d+)\.\s+(.+?)\s*[→➜]\s*(.+)$/)
    if (stepMatch) {
      return (
        <li className="flex items-start gap-2 py-1 my-1">
          <StepBadge num={stepMatch[1]} />
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-text text-sm">{stepMatch[2].trim()}</span>
            <span className="text-accent mx-1.5">→</span>
            <span className="text-text-secondary text-sm">{stepMatch[3].trim()}</span>
          </div>
        </li>
      )
    }
    return <li className="text-text-secondary text-sm leading-relaxed py-0.5">{children}</li>
  },
}

export default function StructuredExplanation({ explanation }: { explanation: string }) {
  const uid = useId()
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const sections = useMemo(() => {
    const parts: Section[] = []
    const lines = explanation.split('\n')
    let currentHeading = ''
    let currentContent: string[] = []
    let intro: string[] = []

    function flush() {
      if (currentContent.length > 0 && currentHeading) {
        parts.push({ type: classifyHeading(currentHeading), heading: currentHeading, content: currentContent.join('\n').trim() })
        currentContent = []
      }
    }

    for (const line of lines) {
      const headingMatch = line.match(/──\s*(.+?)\s*──/)
      if (headingMatch) {
        const heading = headingMatch[1].trim()
        const isBoxArt = heading.length < 3 || BOX_CHARS.test(heading)
        if (!isBoxArt) {
          flush()
          if (!currentHeading && intro.length > 0 && parts.length === 0) {
            parts.push({ type: 'summary', heading: 'Overview', content: intro.join('\n').trim() })
            intro = []
          }
          currentHeading = heading
        } else if (currentHeading) {
          currentContent.push(line)
        } else {
          intro.push(line)
        }
      } else if (currentHeading) {
        currentContent.push(line)
      } else {
        intro.push(line)
      }
    }
    flush()
    if (intro.length > 0 && parts.length === 0) parts.push({ type: 'summary', heading: 'Overview', content: intro.join('\n').trim() })
    else if (intro.length > 0) parts.unshift({ type: 'summary', heading: 'Overview', content: intro.join('\n').trim() })
    return parts.filter((s) => s.content.length > 0)
  }, [explanation])

  const toggle = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  useEffect(() => {
    if (collapsed.size === 0) {
      contentRefs.current.forEach((el) => {
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(-4px)'
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
      })
    }
  }, [sections.length])

  return (
    <div className="space-y-3">
      {sections.map((section, i) => {
        const cfg = sectionConfig[section.type]
        const key = `${uid}-${i}`
        const isCollapsed = collapsed.has(key)
        const processedContent = section.type === 'decision'
          ? preprocessDecisionContent(section.content)
          : preprocessContent(section.content)

        return (
          <div key={key} className={cn('border-2 rounded-2xl overflow-hidden transition-shadow duration-200', isCollapsed ? 'bg-card border-border hover:border-border-dark' : 'bg-card border-border shadow-sm', 'hover:shadow-sm')}>
            <button onClick={() => toggle(key)} className={cn('w-full flex items-center justify-between text-left group transition-colors', isCollapsed ? 'px-5 py-3' : 'px-5 pt-4 pb-2')}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn('w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-transform', cfg.iconBg, isCollapsed ? '' : 'scale-105')}>{cfg.icon}</div>
                <div className="min-w-0">
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider block', cfg.headerClass)}>{cfg.label}</span>
                  <span className="text-sm font-bold text-text truncate block">{section.heading}</span>
                </div>
              </div>
              <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ml-3 transition-colors', isCollapsed ? 'bg-cream-dark border border-border' : 'bg-accent-light border border-accent/30')}>
                {isCollapsed ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronUp size={14} className="text-accent" />}
              </div>
            </button>
            {!isCollapsed && (
              <div ref={(el) => { if (el) contentRefs.current.set(key, el); else contentRefs.current.delete(key) }} className="px-5 pb-4">
                <div className="border-t border-border/40 pt-3">
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {processedContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
