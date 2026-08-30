import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { isOwnDonation } from '../utils/ownership.js'
import DonorLayout from '../components/DonorLayout.jsx'

const STATUSES = ['pending', 'delivered', 'declined']

function statusPill(status) {
  const map = {
    pending: 'bg-haze-200 text-ink/60',
    delivered: 'bg-forest-100 text-forest-700',
    declined: 'bg-red-100 text-red-600',
  }
  return `rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || map.pending}`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function DonorHistory() {
  const { user } = useAuth()
  const { donations } = useData()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const mine = useMemo(() => donations.filter((d) => isOwnDonation(d, user)), [donations, user])

  const filtered = mine
    .filter((d) => statusFilter === 'all' || d.status === statusFilter)
    .filter(
      (d) =>
        d.food.toLowerCase().includes(query.toLowerCase()) ||
        d.home.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  const totalMeals = mine.filter((d) => d.status === 'delivered').reduce((s, d) => s + (Number(d.meals) || 0), 0)

  return (
    <DonorLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-800">Donation History</h1>
      <p className="mt-1 text-sm text-ink/60">
        Every donation you&apos;ve ever logged — {mine.length} total, {totalMeals.toLocaleString()} meals delivered.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food or home…"
          className="w-full max-w-sm rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-forest-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-400"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Food</th>
                  <th className="px-6 py-3 font-medium">Home</th>
                  <th className="px-6 py-3 font-medium">Meals</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t border-forest-100">
                    <td className="px-6 py-4 whitespace-nowrap text-ink/60">{formatDate(d.submittedAt)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{d.food}</p>
                      <p className="text-xs text-ink/50">{d.tag}</p>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{d.home}</td>
                    <td className="px-6 py-4 text-ink/70">{d.meals}</td>
                    <td className="px-6 py-4">
                      <span className={statusPill(d.status)}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DonorLayout>
  )
}
