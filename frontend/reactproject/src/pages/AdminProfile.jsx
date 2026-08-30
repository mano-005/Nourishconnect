import { useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function initialsOf(value) {
  if (!value) return 'A'
  const name = value.includes('@') ? value.split('@')[0] : value
  return name.slice(0, 2).toUpperCase()
}

export default function AdminProfile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    updateProfile({ name: form.name, email: form.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-900">Profile</h1>
      <p className="mt-1 text-sm text-ink/60">Update the details shown across the admin panel.</p>

      <div className="mt-6 max-w-xl rounded-2xl border border-forest-100 bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-forest-700 bg-forest-100 text-lg font-semibold text-forest-700">
            {initialsOf(form.name || form.email)}
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-forest-800">{form.name || 'Administrator'}</p>
            <p className="text-sm text-ink/50">{form.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Display name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="admin@nourishconnect.org"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="rounded-full bg-clay-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-clay-700"
            >
              Save changes
            </button>
            {saved && <span className="text-sm font-medium text-forest-600">Saved ✓</span>}
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
