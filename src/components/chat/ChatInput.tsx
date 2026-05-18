'use client'

// ── Chat input with textarea, image attachment, and paste handling ──
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
const MAX_DIM = 1200

// Downscale image via canvas if it exceeds MAX_DIM or MAX_FILE_SIZE
function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width <= MAX_DIM && height <= MAX_DIM && file.size <= MAX_FILE_SIZE) {
        resolve(file)
        return
      }
      if (width > height) {
        height = Math.round(height * (MAX_DIM / width))
        width = MAX_DIM
      } else {
        width = Math.round(width * (MAX_DIM / height))
        height = MAX_DIM
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        file.type,
        0.85,
      )
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// Validate, resize, and read a file as a base64 attachment
async function readFileAsBase64(file: File): Promise<Attachment> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }
  const blob = await resizeImage(file)
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (max 4MB)`)
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve({ mimeType: file.type, data: base64 })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function ChatInput({ onSend, disabled, language }: ChatInputProps) {
  const [input, setInput] = useState('') // Current textarea value
  const [attachments, setAttachments] = useState<Attachment[]>([]) // Processed image attachments
  const [previews, setPreviews] = useState<string[]>([]) // Base64 data URLs for preview thumbnails
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Auto-resize textarea
  const fileInputRef = useRef<HTMLInputElement>(null) // Hidden file picker
  const isArabic = language === 'ar'

  // Auto-resize textarea height to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Process selected/pasted files into base64 attachments
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

  // Remove an attachment by index
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Send the message + attachments, then clear input state
  const handleSubmit = () => {
    const trimmed = input.trim()
    if ((!trimmed && attachments.length === 0) || disabled) return
    onSend(trimmed, attachments.length > 0 ? attachments : undefined)
    setInput('')
    setAttachments([])
    setPreviews([])
  }

  // Submit on Enter (Shift+Enter for newline)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Handle pasted images from clipboard
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
