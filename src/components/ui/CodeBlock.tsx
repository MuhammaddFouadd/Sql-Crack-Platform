'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '../ThemeProvider'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

function highlightSql(code: string, dark: boolean): string {
  const keywords = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL|AS|ON|GROUP|BY|ORDER|ASC|DESC|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|CASE|WHEN|THEN|ELSE|END|WITH|RECURSIVE|RETURNING|OVER|PARTITION|ROWS|RANGE|PRECEDING|FOLLOWING|CURRENT|ROW|BETWEEN|LAG|LEAD|ROW_NUMBER|RANK|DENSE_RANK|NTILE|FIRST_VALUE|LAST_VALUE|COUNT|SUM|AVG|MIN|MAX|COALESCE|NULLIF|CAST|EXTRACT|DATE_TRUNC|STRING_AGG|ARRAY_AGG|EXPLAIN|ANALYZE|BEGIN|COMMIT|ROLLBACK|SAVEPOINT|FOR|UPDATE|SHARE|NOWAIT|SKIP|LOCKED|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|CHECK|UNIQUE|DEFAULT|CASCADE|SERIAL|BIGSERIAL|BOOLEAN|INTEGER|INT|BIGINT|VARCHAR|CHAR|TEXT|DATE|TIMESTAMP|TIMESTAMPTZ|NUMERIC|DECIMAL|JSON|JSONB|GENERATED|ALWAYS|IDENTITY|IF|FUNCTION|PROCEDURE|TRIGGER|LANGUAGE|PLPGSQL|RETURNS|RECORD\b)/gi
  const strings = /'[^']*'/g
  const numbers = /\b\d+(\.\d+)?\b/g
  const comments = /(--[^\n]*)/g

  let h = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (dark) {
    h = h.replace(comments, '<span style="color:#69676c;font-style:italic">$1</span>')
    h = h.replace(strings, '<span style="color:#fce566">$&</span>')
    h = h.replace(numbers, '<span style="color:#fd9353">$&</span>')
    h = h.replace(keywords, '<span style="color:#fc618d;font-weight:600">$&</span>')
  } else {
    h = h.replace(comments, '<span style="color:#a8a29e;font-style:italic">$1</span>')
    h = h.replace(strings, '<span style="color:#7c9bc8">$&</span>')
    h = h.replace(numbers, '<span style="color:#e8a87c">$&</span>')
    h = h.replace(keywords, '<span style="color:#c07a5a;font-weight:600">$&</span>')
  }

  return h
}

function highlightCpp(code: string, dark: boolean): string {
  const keywords = /\b(auto|bool|break|case|catch|char|class|const|continue|default|delete|do|double|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|return|short|signed|sizeof|static|struct|switch|template|this|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while|include|define|std|string|vector|map|unordered_map|set|unordered_set|pair|optional|any|variant|tuple|cout|cin|endl|begin|end|push_back|emplace_back|find|insert|erase|clear|size|empty|sort|accumulate|count_if|for_each|transform|copy|make_pair|make_optional|make_shared|make_unique\b)\b/gi
  const strings = /"[^"]*"/g
  const singleStrings = /'[^']*'/g
  const numbers = /\b\d+(\.\d+)?\b/g
  const comments = /(\/\/[^\n]*)/g
  const preprocessor = /^[ \t]*#[^\n]*/gm

  let h = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (dark) {
    h = h.replace(comments, '<span style="color:#69676c;font-style:italic">$1</span>')
    h = h.replace(preprocessor, '<span style="color:#69676c">$&</span>')
    h = h.replace(strings, '<span style="color:#fce566">$&</span>')
    h = h.replace(singleStrings, '<span style="color:#fce566">$&</span>')
    h = h.replace(numbers, '<span style="color:#fd9353">$&</span>')
    h = h.replace(keywords, '<span style="color:#66d9ef;font-weight:600">$&</span>')
  } else {
    h = h.replace(comments, '<span style="color:#a8a29e;font-style:italic">$1</span>')
    h = h.replace(preprocessor, '<span style="color:#a8a29e">$&</span>')
    h = h.replace(strings, '<span style="color:#7c9bc8">$&</span>')
    h = h.replace(singleStrings, '<span style="color:#7c9bc8">$&</span>')
    h = h.replace(numbers, '<span style="color:#e8a87c">$&</span>')
    h = h.replace(keywords, '<span style="color:#7c3aed;font-weight:600">$&</span>')
  }

  return h
}

export default function CodeBlock({ code, title, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const dark = theme === 'dark'
  const isCpp = title === 'cpp'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('group relative', className)}>
      <div className="flex items-center justify-between px-5 py-2.5 bg-cream-dark border-2 border-border border-b-0 rounded-t-2xl">
        <span className="text-xs text-text-muted font-mono font-medium">
          {title || 'sql'}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="text-xs text-text-muted hover:text-text transition-colors px-2 py-0.5 rounded-lg hover:bg-border/50"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={cn('!m-0 !rounded-t-none overflow-x-auto', dark ? '!bg-[#2a2a2a]' : '!bg-[#f8f6f3]', '!border-border')}>
        <code
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: isCpp ? highlightCpp(code, dark) : highlightSql(code, dark) }}
        />
      </pre>
    </div>
  )
}
