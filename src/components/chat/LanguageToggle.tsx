'use client'

interface LanguageToggleProps {
  language: 'en' | 'ar'
  onChange: (lang: 'en' | 'ar') => void
}

export default function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-cream-dark border-2 border-border rounded-xl p-0.5">
      <button
        onClick={() => onChange('en')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-card text-text shadow-sm border border-border'
            : 'text-text-muted hover:text-text'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange('ar')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          language === 'ar'
            ? 'bg-card text-text shadow-sm border border-border'
            : 'text-text-muted hover:text-text'
        }`}
      >
        AR
      </button>
    </div>
  )
}
