import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter an administrator email and password.')
      return
    }
    setError('')
    try {
      await login({ email, password, role: 'admin' })
      navigate(location.state?.from || '/admin/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-900 p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] bg-white shadow-soft lg:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 p-10 text-white lg:flex">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)',
              backgroundSize: '30px 30px, 46px 46px',
            }}
          />
          <div className="relative flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30">
              <IconShield />
            </span>
            <span className="font-display text-xl font-semibold">NourishConnect Admin</span>
          </div>

          <div className="relative space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {['Donations', 'Homes', 'Donors'].map((label, i) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <p className="font-display text-2xl">{[35, 320, 8400][i] ?? ''}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              Securely manage the logistics of community care. Your oversight
              ensures resources reach receiving homes efficiently and safely.
            </p>
          </div>

          <div className="relative flex items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2 text-xs font-medium">
            <IconShield small />
            System secured
          </div>
        </div>

        {/* Right panel */}
        <div className="p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">Administrator</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-forest-900">Administrator Login</h1>
          <p className="mt-3 text-sm text-ink/60">
            Manage donations, receiving homes and the people behind every contribution.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-ink/80">
                Administrator Email
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 focus-within:border-forest-400">
                <IconMail />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nourishconnect.org"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="admin-password" className="text-sm font-medium text-ink/80">Password</label>
                <Link to="#" className="text-xs font-medium text-forest-700 hover:underline">Forgot credentials?</Link>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 focus-within:border-forest-400">
                <IconLock />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-ink/40 hover:text-forest-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <IconEye />
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-clay-700">{error}</p>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-clay-500 py-3.5 text-sm font-semibold text-forest-900 shadow-card transition hover:bg-clay-300"
            >
              Secure Sign In
              <IconArrow />
            </button>
          </form>

          <div className="my-7 h-px bg-forest-100" />

          <p className="flex items-center justify-center gap-1.5 text-xs text-ink/40">
            <IconLock small /> Authorized personnel only
          </p>
          <p className="mt-6 text-center text-xs text-ink/40">
            Donating food? <Link to="/login/donor" className="font-semibold text-forest-700 hover:underline">Sign in as a donor</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function IconShield({ small }) {
  const s = small ? 14 : 18
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ink/40">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconLock({ small }) {
  const s = small ? 14 : 18
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="text-ink/40">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
