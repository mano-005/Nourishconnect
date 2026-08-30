import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import DonorLayout from '../components/DonorLayout.jsx'

const CATEGORIES = ['Cooked Food', 'Produce', 'Dry Goods']

const emptyForm = { food: '', category: 'Cooked Food', tag: '', home: '', meals: '' }

export default function DonorDonate() {
  const { user } = useAuth()
  const { homes, ensureDonor, addDonation } = useData()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.food || !form.home || !form.meals) {
      setError('Fill in the food details, target home, and meal estimate.')
      return
    }
    setError('')

    const donorName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Donor'

    // Register the donor in the shared donor directory the first time they give.
    if (user?.email) {
      ensureDonor(donorName, user.email)
    }

    addDonation({
      donor: donorName,
      donorEmail: user?.email,
      food: form.food,
      category: form.category,
      tag: form.tag || form.category,
      home: form.home,
      meals: Number(form.meals) || 0,
      status: 'pending',
    })

    setSubmitted(true)
    setTimeout(() => navigate('/donor/my-donations'), 900)
  }

  return (
    <DonorLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-800">Donate food</h1>
      <p className="mt-1 text-sm text-ink/60">
        Tell us what you have — it goes straight to the admin queue for matching with a receiving home.
      </p>

      <div className="mt-6 max-w-xl rounded-2xl border border-forest-100 bg-white p-6 shadow-card sm:p-8">
        {submitted ? (
          <div className="py-6 text-center">
            <p className="font-display text-xl font-semibold text-forest-700">Thank you!</p>
            <p className="mt-2 text-sm text-ink/60">Your donation was submitted and is now pending review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">What are you donating?</label>
              <input
                value={form.food}
                onChange={(e) => setForm((f) => ({ ...f, food: e.target.value }))}
                placeholder="e.g. 30x Boxed Lunches"
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/80">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/80">Estimated meals</label>
                <input
                  type="number"
                  min="1"
                  value={form.meals}
                  onChange={(e) => setForm((f) => ({ ...f, meals: e.target.value }))}
                  placeholder="20"
                  className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Preferred receiving home</label>
              <select
                value={form.home}
                onChange={(e) => setForm((f) => ({ ...f, home: e.target.value }))}
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              >
                <option value="">Let NourishConnect choose</option>
                {homes.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Notes (shelf life, storage, etc.)</label>
              <input
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                placeholder="Needs cooling, 2 day shelf life…"
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-clay-500 py-3.5 text-sm font-semibold text-forest-900 shadow-card transition hover:bg-clay-300"
            >
              Submit donation
            </button>
          </form>
        )}
      </div>
    </DonorLayout>
  )
}
