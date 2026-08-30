import { useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useData } from '../context/DataContext.jsx'

const emptyForm = { name: '', email: '' }

export default function AdminDonors() {
  const { donors, donations, addDonor, updateDonor, deleteDonor } = useData()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)

  const donorStats = useMemo(() => {
    const map = new Map()
    donations.forEach((d) => {
      const entry = map.get(d.donorEmail.toLowerCase()) || { count: 0, meals: 0 }
      entry.count += 1
      entry.meals += Number(d.meals) || 0
      map.set(d.donorEmail.toLowerCase(), entry)
    })
    return map
  }, [donations])

  const filtered = donors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.email.toLowerCase().includes(query.toLowerCase())
  )

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }
  function openEdit(donor) {
    setEditingId(donor.id)
    setForm({ name: donor.name, email: donor.email })
    setModalOpen(true)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email) return
    if (editingId) updateDonor(editingId, form)
    else addDonor(form)
    setModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Donors</h1>
          <p className="mt-1 text-sm text-ink/60">{donors.length} registered donors. Manage records or edit contact info.</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-clay-700"
        >
          + Add donor
        </button>
      </div>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-forest-400"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">No donors match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Donor</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Donations</th>
                  <th className="px-6 py-3 font-medium">Meals provided</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const stat = donorStats.get(d.email.toLowerCase()) || { count: 0, meals: 0 }
                  return (
                    <tr key={d.id} className="border-t border-forest-100">
                      <td className="px-6 py-4 font-medium text-ink">{d.name}</td>
                      <td className="px-6 py-4 text-ink/70">{d.email}</td>
                      <td className="px-6 py-4 text-ink/70">{stat.count}</td>
                      <td className="px-6 py-4 text-ink/70">{stat.meals}</td>
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
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit donor' : 'Add donor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jordan Rivera"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jordan@example.com"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              required
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
              {editingId ? 'Save changes' : 'Add donor'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteDonor(confirmId)}
        title="Remove this donor?"
        message="Their past donation records will stay in the log, but they'll no longer appear in your donor list."
      />
    </AdminLayout>
  )
}
