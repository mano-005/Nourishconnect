import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { isOwnDonation } from '../utils/ownership.js'
import DonorLayout from '../components/DonorLayout.jsx'
import StatCard from '../components/StatCard.jsx'

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

function statusPill(status) {
  const map = {
    pending: 'bg-haze-200 text-ink/60',
    delivered: 'bg-forest-100 text-forest-700',
    declined: 'bg-red-100 text-red-600',
  }
  return `rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || map.pending}`
}

export default function DonorDashboard() {
  const { user } = useAuth()
  const { donations } = useData()

  const mine = useMemo(() => donations.filter((d) => isOwnDonation(d, user)), [donations, user])

  const stats = useMemo(() => {
    const delivered = mine.filter((d) => d.status === 'delivered')
    const active = mine.filter((d) => d.status === 'pending')
    const meals = delivered.reduce((sum, d) => sum + (Number(d.meals) || 0), 0)
    return [
      { label: 'Total Donations', value: mine.length.toLocaleString(), icon: IconHeart },
      { label: 'Meals Shared', value: meals.toLocaleString(), icon: IconFork },
      { label: 'Successfully Delivered', value: delivered.length.toLocaleString(), icon: IconCheck },
      { label: 'Currently Active', value: active.length.toLocaleString(), icon: IconClock },
    ]
  }, [mine])

  const weeklyFamilies = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000
    return mine.filter((d) => d.status === 'delivered' && new Date(d.submittedAt).getTime() >= weekAgo).length
  }, [mine])

  const recent = [...mine].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5)
  const displayName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'there'

  return (
    <DonorLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-800 sm:text-4xl">
        Good morning, {displayName}.
      </h1>
      <p className="mt-2 text-base text-ink/60">
        Your contributions helped {weeklyFamilies} {weeklyFamilies === 1 ? 'family' : 'families'} this week.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-forest-800">Recent donations</h2>
        <Link to="/donor/donate" className="text-sm font-semibold text-forest-700 hover:underline">
          + New donation
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-ink/50">You haven&apos;t logged a donation yet.</p>
            <Link
              to="/donor/donate"
              className="mt-4 inline-block rounded-full bg-clay-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-clay-700"
            >
              Donate your first meal
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Donation</th>
                  <th className="px-6 py-3 font-medium">Receiving home</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Meals</th>
                  <th className="px-6 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((d) => (
                  <tr key={d.id} className="border-t border-forest-100">
                    <td className="px-6 py-4 font-medium text-ink">{d.food}</td>
                    <td className="px-6 py-4 text-ink/70">{d.home}</td>
                    <td className="px-6 py-4">
                      <span className={statusPill(d.status)}>{d.status}</span>
                    </td>
                    <td className="px-6 py-4 text-ink/70">{d.meals}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-ink/50">{timeAgo(d.submittedAt)}</td>
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

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-forest-600">
      <path
        d="M12 20s-7-4.35-9.5-8.5C.7 8 2 4.5 5.2 4c2-.3 3.3.7 4.3 2 .3.4.9.4 1.2 0 1-1.3 2.3-2.3 4.3-2 3.2.5 4.5 4 2.7 7.5C19 15.65 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function IconFork() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-clay-600">
      <path d="M7 2v8a2 2 0 0 0 2 2v10M7 2v8M10 2v8M4 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 2c-1.5 0-3 1.5-3 4v4a2 2 0 0 0 2 2v10M17 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-forest-600">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8.5 12.5 2.3 2.3L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-700">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
