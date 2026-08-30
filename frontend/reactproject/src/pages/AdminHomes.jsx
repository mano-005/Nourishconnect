import { useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useData } from '../context/DataContext.jsx'

const emptyForm = { name: '', region: '', capacity: '' }

export default function AdminHomes() {
  const { homes, addHome, updateHome, deleteHome } = useData()
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = homes.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.region.toLowerCase().includes(query.toLowerCase())
  )

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }
  function openEdit(home) {
    setEditingId(home.id)
    setForm({ name: home.name, region: home.region, capacity: String(home.capacity) })
    setModalOpen(true)
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.region) return
    const payload = { name: form.name, region: form.region, capacity: Number(form.capacity) || 0 }
    if (editingId) updateHome(editingId, payload)
    else addHome(payload)
    setModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900">Receiving Homes</h1>
          <p className="mt-1 text-sm text-ink/60">{homes.length} homes in the network. Add, edit, or remove any of them.</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-clay-700"
        >
          + Add home
        </button>
      </div>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or region…"
          className="w-full max-w-sm rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-forest-400 sm:max-w-xs"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">No receiving homes match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Home</th>
                  <th className="px-6 py-3 font-medium">Region</th>
                  <th className="px-6 py-3 font-medium">Capacity used</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.id} className="border-t border-forest-100">
                    <td className="px-6 py-4 font-medium text-ink">{h.name}</td>
                    <td className="px-6 py-4 text-ink/70">{h.region}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-haze-200">
                          <div
                            className="h-full rounded-full bg-forest-600"
                            style={{ width: `${Math.min(100, Math.max(0, h.capacity))}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink/60">{h.capacity}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEdit(h)}
                          className="rounded-full border border-forest-200 px-3.5 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmId(h.id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit home' : 'Add receiving home'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Maple Street Pantry"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Region</label>
            <input
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
              placeholder="North district"
              className="w-full rounded-xl border border-forest-100 bg-haze-50 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/80">Capacity used (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
              placeholder="70"
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
              {editingId ? 'Save changes' : 'Add home'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteHome(confirmId)}
        title="Remove this receiving home?"
        message="This can't be undone. Any donations already linked to it will keep the reference but the home will no longer be selectable."
      />
    </AdminLayout>
  )
}
