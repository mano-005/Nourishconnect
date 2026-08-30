import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function DonorSignup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  function update(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Fill in every field to create your account.')
      return
    }
    setError('')
    try {
      await register(form)
      navigate('/donor/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-haze-50 px-6 py-12">
      <div className="absolute inset-0 bg-grain [background-size:18px_18px] opacity-30" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-clay-100 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-forest-100 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-forest-100 bg-white p-9 shadow-soft">
        <Link to="/" className="mb-8 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-600 text-white">
            <IconLeaf />
          </span>
        </Link>

        <h1 className="text-center font-display text-3xl font-semibold text-forest-800">Share what you have</h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm text-ink/60">
          Create a donor account to list food and follow it to the table it reaches.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink/80">Full name</label>
            <input
              id="name"
              value={form.name}
              onChange={update('name')}
              placeholder="Jordan Rivera"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-forest-400"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-forest-400"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-ink/80">Password</label>
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="Create a password"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-forest-400"
            />
          </div>

          {error && <p className="text-sm text-clay-700">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-clay-500 py-3.5 text-sm font-semibold text-forest-900 shadow-card transition hover:bg-clay-300"
          >
            Create donor account
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink/40">
          Already have an account? <Link to="/login/donor" className="font-semibold text-forest-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" fill="currentColor" />
      <path d="M5 19c3-3 6-7 9-11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
