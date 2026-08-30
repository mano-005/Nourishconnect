import { useMemo } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import { useData } from '../context/DataContext.jsx'
import DonationTrendsChart from '../components/DonationTrendsChart.jsx'
import FoodCategoriesDonut from '../components/FoodCategoriesDonut.jsx'

export default function AdminReports() {
  const { homes, donations, donors } = useData()

  const topHomes = useMemo(() => {
    const counts = new Map()
    donations.forEach((d) => {
      counts.set(d.home, (counts.get(d.home) || 0) + (Number(d.meals) || 0))
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [donations])

  const topDonors = useMemo(() => {
    const counts = new Map()
    donations.forEach((d) => {
      counts.set(d.donor, (counts.get(d.donor) || 0) + (Number(d.meals) || 0))
    })
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [donations])

  const totalMeals = donations
    .filter((d) => d.status === 'delivered')
    .reduce((sum, d) => sum + (Number(d.meals) || 0), 0)

  const maxHomeMeals = topHomes[0]?.[1] || 1
  const maxDonorMeals = topDonors[0]?.[1] || 1

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-900">Reports</h1>
      <p className="mt-1 text-sm text-ink/60">
        Live analytics computed from {donations.length} donation records across {homes.length} homes and {donors.length} donors.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Meals delivered to date</p>
          <p className="mt-2 font-display text-3xl font-semibold text-clay-600">{totalMeals.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Average meals / donation</p>
          <p className="mt-2 font-display text-3xl font-semibold text-clay-600">
            {donations.length ? Math.round(donations.reduce((s, d) => s + (Number(d.meals) || 0), 0) / donations.length) : 0}
          </p>
        </div>
        <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Approval rate</p>
          <p className="mt-2 font-display text-3xl font-semibold text-clay-600">
            {donations.length
              ? Math.round(
                  (donations.filter((d) => d.status === 'delivered').length /
                    donations.filter((d) => d.status !== 'pending').length || 0) * 100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <DonationTrendsChart />
        <FoodCategoriesDonut />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-forest-800">Top receiving homes by meals</h2>
          <ul className="mt-5 space-y-4">
            {topHomes.length === 0 && <p className="text-sm text-ink/50">No data yet.</p>}
            {topHomes.map(([name, meals]) => (
              <li key={name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{name}</span>
                  <span className="text-ink/60">{meals} meals</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-haze-200">
                  <div
                    className="h-full rounded-full bg-forest-600"
                    style={{ width: `${(meals / maxHomeMeals) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-forest-800">Top donors by meals provided</h2>
          <ul className="mt-5 space-y-4">
            {topDonors.length === 0 && <p className="text-sm text-ink/50">No data yet.</p>}
            {topDonors.map(([name, meals]) => (
              <li key={name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{name}</span>
                  <span className="text-ink/60">{meals} meals</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-haze-200">
                  <div
                    className="h-full rounded-full bg-clay-500"
                    style={{ width: `${(meals / maxDonorMeals) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
