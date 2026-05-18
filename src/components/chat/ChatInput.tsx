'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ImagePlus, X } from 'lucide-react'

interface Attachment {
  mimeType: string
  data: string
}

interface ChatInputProps {
  onSend: (message: string, images?: Attachment[]) => void
  disabled: boolean
  language: 'en' | 'ar'
}

const MAX_FILE_SIZE = 4 * 1024 * 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

function readFileAsBase64(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      reject(new Error(`Unsupported file type: ${file.type}`))
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File too large (max 4MB)`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve({ mimeType: file.type, data: base64 })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ChatInput({ onSend, disabled, language }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isArabic = language === 'ar'

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleFiles = useCallback(async (files: FileList) => {
    const newAttachments: Attachment[] = []
    const newPreviews: string[] = []
    for (const file of Array.from(files)) {
      try {
        const attachment = await readFileAsBase64(file)
        newAttachments.push(attachment)
        newPreviews.push(`data:${file.type};base64,${attachment.data}`)
      } catch (e) {
        console.error('File error:', e)
      }
    }
    setAttachments((prev) => [...prev, ...newAttachments])
    setPreviews((prev) => [...prev, ...newPreviews])
  }, [])

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const trimmed = input.trim()
    if ((!trimmed && attachments.length === 0) || disabled) return
    onSend(trimmed, attachments.length > 0 ? attachments : undefined)
    setInput('')
    setAttachments([])
    setPreviews([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    const files: File[] = []
    for (const item of Array.from(items)) {
      if (item.kind === 'file' && ACCEPTED_TYPES.includes(item.type)) {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }
    if (files.length > 0) {
      e.preventDefault()
      const dt = new DataTransfer()
      files.forEach((f) => dt.items.add(f))
      await handleFiles(dt.files)
    }
  }, [handleFiles])

  return (
    <div className="border-t-2 border-border bg-cream p-4">
      <div className="max-w-3xl mx-auto">
        {previews.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Attachment ${i + 1}`}
                  className="h-16 w-16 rounded-xl object-cover border-2 border-border"
                />
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose border-2 border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-text" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-3 rounded-2xl border-2 border-border bg-card text-text-muted hover:text-text hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            title={isArabic ? 'إرفاق صورة' : 'Attach image'}
          >
            <ImagePlus size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            dir={isArabic ? 'rtl' : 'ltr'}
            placeholder={
              isArabic
                ? 'اكتب مشكلتك هنا أو الصق صورة...'
                : 'Describe your problem or paste a screenshot...'
            }
            rows={1}
            className="flex-1 resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            disabled={disabled}
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || (!input.trim() && attachments.length === 0)}
            className="px-5 py-3 rounded-2xl bg-yellow border-2 border-yellow-dark text-text font-semibold text-sm hover:bg-yellow-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isArabic ? 'إرسال' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
