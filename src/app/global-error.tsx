'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-light border-2 border-rose/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Something went wrong</h1>
          <p className="text-sm text-text-secondary mb-2">
            A critical error occurred. Please try refreshing the page.
          </p>
          {error.digest && (
            <p className="text-xs text-text-muted font-mono mb-8">
              Error ID: {error.digest}
            </p>
          )}
          {!error.digest && <div className="mb-8" />}
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
