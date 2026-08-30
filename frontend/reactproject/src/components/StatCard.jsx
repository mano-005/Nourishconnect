export default function StatCard({ icon: Icon, label, value, tone = 'default', accent }) {
  const toneClasses = {
    default: 'bg-white border-forest-100 text-ink',
    dark: 'bg-forest-700 border-forest-700 text-white',
    alert: 'bg-white border-red-200 text-ink',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-card ${toneClasses[tone]} ${
        tone === 'alert' ? 'border-l-4 border-l-red-500' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <span className={tone === 'dark' ? 'text-white' : accent === 'red' ? 'text-red-500' : 'text-clay-600'}>
            <Icon />
          </span>
        )}
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            tone === 'dark' ? 'text-white/80' : 'text-ink/50'
          }`}
        >
          {label}
        </span>
      </div>
      <p className={`mt-3 font-display text-3xl font-semibold ${tone === 'dark' ? 'text-white' : 'text-forest-900'}`}>
        {value}
      </p>
    </div>
  )
}
