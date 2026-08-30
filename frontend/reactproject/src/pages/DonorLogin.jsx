import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function DonorLogin() {
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
      setError('Enter your email and password to continue.')
      return
    }
    setError('')
    try {
      await login({ email, password, role: 'donor' })
      navigate(location.state?.from || '/donor/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-haze-50 px-6 py-12">
      <div className="absolute inset-0 bg-grain [background-size:18px_18px] opacity-30" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-forest-100 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-clay-100 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-forest-100 bg-white p-9 shadow-soft">
        <Link to="/" className="mb-8 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-700 text-white">
            <IconHand />
          </span>
        </Link>

        <h1 className="text-center font-display text-3xl font-semibold text-forest-800">Welcome back</h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm text-ink/60">
          Sign in to manage your donations and see where your food is going.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 focus-within:border-forest-400">
              <IconMail />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-ink/80">Password</label>
              <Link to="#" className="text-xs font-medium text-forest-700 hover:underline">Forgot password?</Link>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 focus-within:border-forest-400">
              <IconLock />
              <input
                id="password"
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
                className="text-xs font-medium text-ink/50 hover:text-forest-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-clay-700">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-clay-500 py-3.5 text-sm font-semibold text-forest-900 shadow-card transition hover:bg-clay-300"
          >
            Sign In
            <IconArrow />
          </button>
        </form>

        <div className="my-7 flex items-center gap-3 text-xs text-ink/40">
          <span className="h-px flex-1 bg-forest-100" />
          New to NourishConnect?
          <span className="h-px flex-1 bg-forest-100" />
        </div>

        <Link
          to="/signup"
          className="flex w-full items-center justify-center rounded-xl border border-forest-700 py-3.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
        >
          Create a donor account
        </Link>

        <p className="mt-6 text-center text-xs text-ink/40">
          Managing the pantry network? <Link to="/login/admin" className="font-semibold text-forest-700 hover:underline">Sign in as administrator</Link>
        </p>
      </div>
    </div>
  )
}

function IconHand() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21s-7-4.35-9.5-8.5C.7 9 2 5.5 5.2 5c2-.3 3.3.7 4.3 2 .3.4.9.4 1.2 0 1-1.3 2.3-2.3 4.3-2 3.2.5 4.5 4 2.7 7.5C19 16.65 12 21 12 21z"
        fill="currentColor"
      />
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
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ink/40">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
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
