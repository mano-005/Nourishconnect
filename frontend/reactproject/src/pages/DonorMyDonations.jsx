import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { isOwnDonation } from '../utils/ownership.js'
import DonorLayout from '../components/DonorLayout.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const CATEGORIES = ['Cooked Food', 'Produce', 'Dry Goods']

function statusPill(status) {
  const map = {
    pending: 'bg-haze-200 text-ink/60',
    delivered: 'bg-forest-100 text-forest-700',
    declined: 'bg-red-100 text-red-600',
  }
  return `rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || map.pending}`
}

export default function DonorMyDonations() {
  const { user } = useAuth()
  const { donations, homes, updateDonation, deleteDonation } = useData()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const mine = useMemo(
    () => donations.filter((d) => isOwnDonation(d, user)).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [donations, user]
  )

  function openEdit(d) {
    setEditing(d.id)
    setForm({ food: d.food, category: d.category, tag: d.tag, home: d.home, meals: String(d.meals) })
  }

  function handleSubmit(e) {
    e.preventDefault()
    updateDonation(editing, { ...form, meals: Number(form.meals) || 0 })
    setEditing(null)
    setForm(null)
  }

  return (
    <DonorLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-800">My Donations</h1>
          <p className="mt-1 text-sm text-ink/60">
            {mine.length} donation{mine.length === 1 ? '' : 's'} logged. You can edit or cancel anything still pending.
          </p>
        </div>
        <Link
          to="/donor/donate"
          className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-clay-700"
        >
          + New donation
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {mine.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">You haven&apos;t logged any donations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Food</th>
                  <th className="px-6 py-3 font-medium">Home</th>
                  <th className="px-6 py-3 font-medium">Meals</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((d) => (
                  <tr key={d.id} className="border-t border-forest-100">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{d.food}</p>
                      <p className="text-xs text-ink/50">{d.tag}</p>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{d.home}</td>
                    <td className="px-6 py-4 text-ink/70">{d.meals}</td>
                    <td className="px-6 py-4">
                      <span className={statusPill(d.status)}>{d.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {d.status === 'pending' ? (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(d)}
                            className="rounded-full border border-forest-200 px-3.5 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmId(d.id)}
                            className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-ink/40">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit donation">
        {form && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Food details</label>
              <input
                value={form.food}
                onChange={(e) => setForm((f) => ({ ...f, food: e.target.value }))}
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                required
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
                <label className="mb-1.5 block text-sm font-medium text-ink/80">Meals</label>
                <input
                  type="number"
                  min="1"
                  value={form.meals}
                  onChange={(e) => setForm((f) => ({ ...f, meals: e.target.value }))}
                  className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Target home</label>
              <select
                value={form.home}
                onChange={(e) => setForm((f) => ({ ...f, home: e.target.value }))}
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              >
                {homes.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Notes</label>
              <input
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-forest-100 px-5 py-2.5 text-sm font-semibold text-ink/70 hover:bg-haze-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-clay-700"
              >
                Save changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteDonation(confirmId)}
        title="Cancel this donation?"
        message="This removes it from the pending queue permanently."
      />
    </DonorLayout>
  )
}
