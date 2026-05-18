import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-yellow-light border-2 border-yellow/30 flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">?</span>
      </div>
      <h1 className="text-2xl font-bold text-text mb-2">Page not found</h1>
      <p className="text-sm text-text-secondary mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm border-2 border-accent hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  )
}
