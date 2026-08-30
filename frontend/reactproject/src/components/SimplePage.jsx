import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function SimplePage({ eyebrow, title, intro, updated, children }) {
  return (
    <div className="min-h-screen bg-haze-50">
      <Navbar />

      <section className="relative overflow-hidden border-b border-forest-100">
        <div className="absolute inset-0 bg-grain [background-size:18px_18px] opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest-700">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-forest-800 sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-lg text-ink/70">{intro}</p>}
          {updated && <p className="mt-4 text-sm text-ink/45">{updated}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div className="space-y-10">{children}</div>
      </section>

      <Footer />
    </div>
  )
}

export function Block({ title, children }) {
  return (
    <div className="rounded-3xl border border-forest-100 bg-white p-8 shadow-card">
      {title && (
        <h2 className="font-display text-xl font-semibold text-forest-800">{title}</h2>
      )}
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/70">{children}</div>
    </div>
  )
}
