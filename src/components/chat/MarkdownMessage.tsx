'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from '@/components/ui/CodeBlock'

interface MarkdownMessageProps {
  content: string
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="max-w-none text-text leading-relaxed [&_p]:my-1 [&_p]:leading-relaxed [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h1]:mt-4 [&_h2]:mt-3 [&_h3]:mt-2 [&_h1]:mb-2 [&_h2]:mb-1 [&_h3]:mb-1 [&_code]:text-accent [&_code]:bg-cream-dark [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!border-none [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:px-3 [&_th]:py-2 [&_th]:bg-cream-dark [&_td]:px-3 [&_td]:py-1.5 [&_table]:border-collapse [&_tr]:border-b [&_tr]:border-border/50 [&_blockquote]:border-l-4 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_blockquote]:text-text-muted [&_blockquote]:italic [&_blockquote]:my-2 [&_hr]:border-border [&_hr]:my-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : ''
            const code = String(children).replace(/\n$/, '')
            if (match) {
              return <CodeBlock code={code} title={lang} className="my-3" />
            }
            return (
              <code className="text-accent bg-cream-dark px-1 py-0.5 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            )
          },
          pre({ children }) {
            return <div className="my-3">{children}</div>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
