import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useData } from '../context/DataContext.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const RANGE_MONTHS = { '3M': 3, '6M': 6, '12M': 12 }

function buildSeries(donations, monthCount) {
  const now = new Date()
  const buckets = []
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTHS[d.getMonth()], donations: 0 })
  }
  const bucketIndex = new Map(buckets.map((b, i) => [b.key, i]))

  donations.forEach((d) => {
    const submitted = new Date(d.submittedAt)
    const key = `${submitted.getFullYear()}-${submitted.getMonth()}`
    const idx = bucketIndex.get(key)
    if (idx !== undefined) buckets[idx].donations += 1
  })

  return buckets
}

export default function DonationTrendsChart() {
  const { donations } = useData()
  const [range, setRange] = useState('6M')
  const data = useMemo(() => buildSeries(donations, RANGE_MONTHS[range]), [donations, range])

  const first = data[0]?.donations ?? 0
  const last = data[data.length - 1]?.donations ?? 0
  const growth = first === 0 ? (last > 0 ? '100.0' : '0.0') : (((last - first) / first) * 100).toFixed(1)
  const totalInPeriod = data.reduce((sum, d) => sum + d.donations, 0)

  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-forest-800">Donation Trends</h2>
          <p className="mt-0.5 text-xs text-ink/50">
            {totalInPeriod.toLocaleString()} donations this period ·{' '}
            <span className="font-semibold text-forest-600">
              {last >= first ? '+' : ''}
              {growth}%
            </span>
          </p>
        </div>
        <div className="flex overflow-hidden rounded-full border border-forest-100 text-xs font-semibold">
          {Object.keys(RANGE_MONTHS).map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1.5 transition ${
                range === key ? 'bg-forest-700 text-white' : 'text-ink/60 hover:bg-haze-100'
              }`}
            >
              {key === '3M' ? '3 Months' : key === '6M' ? '6 Months' : '12 Months'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="donationFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d6a4f" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2d6a4f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2ddf2" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#12181f99' }}
              axisLine={{ stroke: '#e2ddf2' }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12, fill: '#12181f99' }} axisLine={false} tickLine={false} width={40} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #dcebe1',
                fontSize: 13,
              }}
              formatter={(value) => [`${value} donations`, '']}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="donations"
              stroke="#2d6a4f"
              strokeWidth={2.5}
              fill="url(#donationFill)"
              dot={{ r: 3, stroke: '#2d6a4f', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
