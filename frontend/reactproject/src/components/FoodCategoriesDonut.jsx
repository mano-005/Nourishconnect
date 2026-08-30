import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useData } from '../context/DataContext.jsx'

const COLORS = {
  'Cooked Food': '#df9c4f',
  Produce: '#1b4332',
  'Dry Goods': '#7c5a24',
}

export default function FoodCategoriesDonut() {
  const { donations } = useData()

  const categories = useMemo(() => {
    const counts = { 'Cooked Food': 0, Produce: 0, 'Dry Goods': 0 }
    donations.forEach((d) => {
      if (counts[d.category] !== undefined) counts[d.category] += 1
    })
    const total = donations.length || 1
    return Object.entries(counts)
      .map(([name, count]) => ({ name, value: Math.round((count / total) * 100), color: COLORS[name] }))
      .sort((a, b) => b.value - a.value)
  }, [donations])

  const lead = categories[0] ?? { name: '—', value: 0 }

  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-forest-800">Food Categories</h2>

      <div className="relative mx-auto mt-4 h-52 w-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {categories.map((c) => (
                <Cell key={c.name} fill={c.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-forest-900">{lead.value}%</span>
          <span className="text-xs text-ink/50">{lead.name}</span>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {categories.map((c) => (
          <li key={c.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink/70">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}
            </span>
            <span className="font-semibold text-ink">{c.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
