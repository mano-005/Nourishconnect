import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import DonorLayout from '../components/DonorLayout.jsx'

export default function DonorHomes() {
  const { homes } = useData()
  const [query, setQuery] = useState('')

  const filtered = homes.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.region.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <DonorLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-800">Receiving Homes</h1>
      <p className="mt-1 text-sm text-ink/60">
        {homes.length} homes currently in the network. This list updates live as the admin team adds new ones.
      </p>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or region…"
          className="w-full max-w-sm rounded-xl border border-forest-100 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-ink/40 focus:border-forest-400"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 && (
          <p className="text-sm text-ink/50">No receiving homes match your search.</p>
        )}
        {filtered.map((h) => (
          <div key={h.id} className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
            <p className="font-display text-lg font-semibold text-forest-800">{h.name}</p>
            <p className="mt-1 text-sm text-ink/60">{h.region}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-haze-200">
                <div
                  className="h-full rounded-full bg-forest-600"
                  style={{ width: `${Math.min(100, Math.max(0, h.capacity))}%` }}
                />
              </div>
              <span className="text-xs text-ink/50">{h.capacity}% capacity</span>
            </div>
          </div>
        ))}
      </div>
    </DonorLayout>
  )
}
