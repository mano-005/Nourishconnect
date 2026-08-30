import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { isOwnDonation } from '../utils/ownership.js'
import DonorLayout from '../components/DonorLayout.jsx'

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

export default function DonorTrack() {
  const { user } = useAuth()
  const { donations } = useData()

  const active = useMemo(
    () =>
      donations
        .filter((d) => isOwnDonation(d, user) && d.status === 'pending')
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [donations, user]
  )

  return (
    <DonorLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-800">Track Donations</h1>
      <p className="mt-1 text-sm text-ink/60">
        Live status for everything still moving through the pipeline. Approved donations move to Donation History.
      </p>

      {active.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-forest-100 bg-white px-6 py-12 text-center shadow-card">
          <p className="text-sm text-ink/50">Nothing in transit right now.</p>
          <Link to="/donor/donate" className="mt-4 inline-block text-sm font-semibold text-forest-700 hover:underline">
            Log a new donation →
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {active.map((d) => (
            <div key={d.id} className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-semibold text-forest-800">{d.food}</p>
                  <p className="text-xs text-ink/50">To {d.home} · submitted {timeAgo(d.submittedAt)}</p>
                </div>
                <span className="rounded-full bg-haze-200 px-3 py-1 text-xs font-semibold text-ink/60">
                  {d.meals} meals
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <TrackStep label="Submitted" done />
                  <TrackConnector done />
                  <TrackStep label="Admin review" active />
                  <TrackConnector />
                  <TrackStep label="Delivered" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DonorLayout>
  )
}

function TrackStep({ label, done, active }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
          done
            ? 'bg-forest-600 text-white'
            : active
            ? 'border-2 border-clay-500 bg-clay-100 text-clay-700'
            : 'border-2 border-haze-200 bg-white text-ink/30'
        }`}
      >
        {done ? '✓' : ''}
      </span>
      <span className={`text-xs font-medium ${done || active ? 'text-ink' : 'text-ink/40'}`}>{label}</span>
    </div>
  )
}
function TrackConnector({ done }) {
  return <span className={`mx-2 h-0.5 flex-1 ${done ? 'bg-forest-600' : 'bg-haze-200'}`} />
}
