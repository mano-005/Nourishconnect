import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import AdminLayout from '../components/AdminLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import DonationTrendsChart from '../components/DonationTrendsChart.jsx'
import FoodCategoriesDonut from '../components/FoodCategoriesDonut.jsx'
import PendingActionsTable from '../components/PendingActionsTable.jsx'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { homes, donors, donations } = useData()

  const stats = useMemo(() => {
    const pending = donations.filter((d) => d.status === 'pending').length
    const delivered = donations.filter((d) => d.status === 'delivered')
    const mealsDistributed = delivered.reduce((sum, d) => sum + (Number(d.meals) || 0), 0)

    return [
      { label: 'Receiving Homes', value: homes.length.toLocaleString(), icon: IconBuilding },
      { label: 'Total Donations', value: donations.length.toLocaleString(), icon: IconClipboard },
      { label: 'Total Donors', value: donors.length.toLocaleString(), icon: IconUsers },
      { label: 'Pending', value: pending.toLocaleString(), icon: IconHourglass, tone: 'alert', accent: 'red' },
      { label: 'Delivered', value: delivered.length.toLocaleString(), icon: IconCheck },
      { label: 'Meals Distributed', value: mealsDistributed.toLocaleString(), icon: IconFork, tone: 'dark' },
    ]
  }, [homes, donors, donations])

  const pendingCount = donations.filter((d) => d.status === 'pending').length
  const firstName = (user?.name || user?.email || 'Admin').split(/[@._\s]/)[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest-900 sm:text-4xl">
            Good morning, {displayName}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink/60">
            <IconBell />
            {pendingCount === 0
              ? 'All donation requests are reviewed.'
              : `${pendingCount} pending donation request${pendingCount === 1 ? '' : 's'} require review.`}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <DonationTrendsChart />
        <FoodCategoriesDonut />
      </div>

      <div className="mt-6">
        <PendingActionsTable />
      </div>
    </AdminLayout>
  )
}

function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-clay-600">
      <path
        d="M12 3a5 5 0 0 0-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 15h14l-1.4-2.1a2.8 2.8 0 0 1-.6-1.7V8a5 5 0 0 0-5-5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 21V10a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v11" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 9h.01M7 12h.01M7 15h.01M16 13h.01M16 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15.5 14.2c2.7.4 4.7 2.6 4.7 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconHourglass() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12M6 21h12M7 3c0 5 5 6.5 5 9s-5 4-5 9M17 3c0 5-5 6.5-5 9s5 4 5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8.5 12.5 2.3 2.3L16 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconFork() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M7 2v8a2 2 0 0 0 2 2v10M7 2v8M10 2v8M4 2v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 2c-1.5 0-3 1.5-3 4v4a2 2 0 0 0 2 2v10M17 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
