import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'

function initialsOf(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function PendingActionsTable() {
  const { donations, approveDonation, declineDonation } = useData()
  const pending = donations
    .filter((d) => d.status === 'pending')
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  return (
    <div className="rounded-2xl border border-forest-100 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg font-semibold text-forest-800">Pending Actions</h2>
          {pending.length > 0 && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
              {pending.length} New
            </span>
          )}
        </div>
        <Link to="/admin/donations" className="text-sm font-semibold text-forest-700 hover:underline">
          View All
        </Link>
      </div>

      {pending.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-ink/50">Nothing pending — all caught up.</p>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Donor</th>
                  <th className="px-6 py-3 font-medium">Food Details</th>
                  <th className="px-6 py-3 font-medium">Target Home</th>
                  <th className="px-6 py-3 font-medium">Time Submitted</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((a) => (
                  <tr key={a.id} className="border-t border-forest-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-semibold text-forest-700">
                          {initialsOf(a.donor)}
                        </span>
                        <span className="font-medium text-ink">{a.donor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{a.food}</p>
                      <p className="text-xs text-ink/50">{a.tag}</p>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{a.home}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-ink/50">{timeAgo(a.submittedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => approveDonation(a.id)}
                          className="rounded-full bg-forest-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-forest-800"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineDonation(a.id)}
                          className="rounded-full border border-forest-200 px-3.5 py-1.5 text-xs font-semibold text-ink/60 hover:bg-haze-100"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <ul className="divide-y divide-forest-100 md:hidden">
            {pending.map((a) => (
              <li key={a.id} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-semibold text-forest-700">
                    {initialsOf(a.donor)}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{a.donor}</p>
                    <p className="text-xs text-ink/50">{timeAgo(a.submittedAt)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-ink">{a.food}</p>
                <p className="text-xs text-ink/50">{a.tag}</p>
                <p className="mt-1 text-xs text-ink/60">To: {a.home}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approveDonation(a.id)}
                    className="flex-1 rounded-full bg-forest-700 py-2 text-xs font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => declineDonation(a.id)}
                    className="flex-1 rounded-full border border-forest-200 py-2 text-xs font-semibold text-ink/60"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
