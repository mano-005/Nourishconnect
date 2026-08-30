import { useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useData } from '../context/DataContext.jsx'

const CATEGORIES = ['Cooked Food', 'Produce', 'Dry Goods']
const STATUSES = ['pending', 'delivered', 'declined']

const emptyForm = { donor: '', food: '', category: 'Cooked Food', tag: '', home: '', meals: '', status: 'pending' }

function statusPill(status) {
  const map = {
    pending: 'bg-haze-200 text-ink/60',
    delivered: 'bg-forest-100 text-forest-700',
    declined: 'bg-red-100 text-red-600',
  }
  return `rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || map.pending}`
}

export default function AdminDonations() {
  const { donations, homes, donors, addDonation, updateDonation, deleteDonation } = useData()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = donations
    .filter((d) => statusFilter === 'all' || d.status === statusFilter)
    .filter(
      (d) =>
        d.donor.toLowerCase().includes(query.toLowerCase()) ||
        d.food.toLowerCase().includes(query.toLowerCase()) ||
        d.home.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }
  function openEdit(d) {
    setEditingId(d.id)
    setForm({ donor: d.donor, food: d.food, category: d.category, tag: d.tag, home: d.home, meals: String(d.meals), status: d.status })
    setModalOpen(true)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.donor || !form.food || !form.home) return
    const selectedDonor = donors.find((d) => d.name === form.donor)
    if (!selectedDonor) return
    const payload = { ...form, donorEmail: selectedDonor.email, meals: Number(form.meals) || 0 }
    if (editingId) updateDonation(editingId, payload)
    else addDonation(payload)
    setModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Donations</h1>
          <p className="mt-1 text-sm text-ink/60">{donations.length} total records. Log, edit, approve, or remove any donation.</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-clay-700"
        >
          + Log donation
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search donor, food, or home…"
          className="w-full max-w-sm rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-forest-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-400"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">No donations match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Donor</th>
                  <th className="px-6 py-3 font-medium">Food</th>
                  <th className="px-6 py-3 font-medium">Home</th>
                  <th className="px-6 py-3 font-medium">Meals</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t border-forest-100">
                    <td className="px-6 py-4 font-medium text-ink">{d.donor}</td>
                    <td className="px-6 py-4">
                      <p className="text-ink">{d.food}</p>
                      <p className="text-xs text-ink/50">{d.tag}</p>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{d.home}</td>
                    <td className="px-6 py-4 text-ink/70">{d.meals}</td>
                    <td className="px-6 py-4">
                      <span className={statusPill(d.status)}>{d.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit donation' : 'Log a donation'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Donor</label>
              <input
                list="donor-options"
                value={form.donor}
                onChange={(e) => setForm((f) => ({ ...f, donor: e.target.value }))}
                placeholder="Donor name"
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                required
              />
              <datalist id="donor-options">
                {donors.map((d) => (
                  <option key={d.id} value={d.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Target home</label>
              <select
                value={form.home}
                onChange={(e) => setForm((f) => ({ ...f, home: e.target.value }))}
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                required
              >
                <option value="">Select a home</option>
                {homes.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Food details</label>
            <input
              value={form.food}
              onChange={(e) => setForm((f) => ({ ...f, food: e.target.value }))}
              placeholder="50x Boxed Lunches"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
                min="0"
                value={form.meals}
                onChange={(e) => setForm((f) => ({ ...f, meals: e.target.value }))}
                placeholder="30"
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink/80">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm capitalize outline-none focus:border-forest-400"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Note / tag</label>
            <input
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              placeholder="Cooked Food · Perishable"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full border border-forest-100 px-5 py-2.5 text-sm font-semibold text-ink/70 hover:bg-haze-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-clay-700"
            >
              {editingId ? 'Save changes' : 'Log donation'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteDonation(confirmId)}
        title="Delete this donation record?"
        message="This permanently removes the record from all reports and totals."
      />
    </AdminLayout>
  )
}
