import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Receiving Homes', to: '/#homes' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-haze-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-forest-700">
          NourishConnect
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-ink/70 transition hover:text-forest-700"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={open}
              className="text-sm font-medium text-ink/80 transition hover:text-forest-700"
            >
              Login
            </button>
            {open && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
                <Link
                  to="/login/donor"
                  className="block px-4 py-3 text-sm font-medium text-ink hover:bg-forest-50"
                  onClick={() => setOpen(false)}
                >
                  <span className="block text-forest-700">Donor sign in</span>
                  <span className="text-xs text-ink/50">Track your donations</span>
                </Link>
                <div className="h-px bg-forest-100" />
                <Link
                  to="/login/admin"
                  className="block px-4 py-3 text-sm font-medium text-ink hover:bg-forest-50"
                  onClick={() => setOpen(false)}
                >
                  <span className="block text-forest-700">Administrator sign in</span>
                  <span className="text-xs text-ink/50">Manage the pantry network</span>
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/signup"
            className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-clay-700"
          >
            Donate Food
          </Link>
        </div>
      </nav>
    </header>
  )
}
