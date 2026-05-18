'use client'

// ── Renders a single chat bubble (user or assistant) with optional images ──
import MarkdownMessage from './MarkdownMessage'

interface Attachment {
  mimeType: string
  data: string
}

interface ChatMessageProps {
  role: 'user' | 'assistant'
  text: string
  language: 'en' | 'ar'
  images?: Attachment[]
}

export default function ChatMessage({ role, text, language, images }: ChatMessageProps) {
  const isUser = role === 'user'
  const isArabic = language === 'ar'

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-yellow border-2 border-yellow-dark text-text'
            : 'bg-card border-2 border-border text-text'
        }`}
      >
        {images && images.length > 0 && images[0].data && (
          <div className={`flex gap-2 flex-wrap ${text ? 'mb-3' : ''}`}>
            {images.map((img, i) => (
              <img
                key={i}
                src={`data:${img.mimeType};base64,${img.data}`}
                alt={`Image ${i + 1}`}
                className="max-w-full rounded-xl border border-border object-contain"
                style={{ maxHeight: '12rem' }}
              />
            ))}
          </div>
        )}
        {images && images.length > 0 && !images[0].data && (
          <div className={`flex gap-2 flex-wrap ${text ? 'mb-3' : ''}`}>
            {images.map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 rounded-xl bg-cream-dark border-2 border-border flex items-center justify-center text-xs text-text-muted"
              >
                📷
              </div>
            ))}
          </div>
        )}
        {text && (
          isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          ) : (
            <MarkdownMessage content={text} />
          )
        )}
      </div>
    </div>
  )
}
