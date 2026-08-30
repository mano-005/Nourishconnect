import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useData } from '../context/DataContext.jsx'

const SETTINGS_KEY = 'nc_admin_settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { notifyPending: true, weeklySummary: false }
  } catch {
    return { notifyPending: true, weeklySummary: false }
  }
}

export default function AdminSettings() {
  const { resetToSeed } = useData()
  const [settings, setSettings] = useState(loadSettings)
  const [confirmReset, setConfirmReset] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(t)
  }, [settings])

  function toggle(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }))
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-semibold text-forest-900">Settings</h1>
      <p className="mt-1 text-sm text-ink/60">Preferences are saved automatically to this browser.</p>

      <div className="mt-6 max-w-xl space-y-6">
        <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-forest-800">Notifications</h2>
          <div className="mt-4 space-y-4">
            <SettingRow
              label="Alert me about new pending donations"
              description="Shows the reminder banner on your dashboard."
              checked={settings.notifyPending}
              onChange={() => toggle('notifyPending')}
            />
            <SettingRow
              label="Weekly summary report"
              description="A rundown of donations, meals, and homes reached each week."
              checked={settings.weeklySummary}
              onChange={() => toggle('weeklySummary')}
            />
          </div>
          {saved && <p className="mt-4 text-sm font-medium text-forest-600">Preferences saved ✓</p>}
        </div>

        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-red-600">Danger zone</h2>
          <p className="mt-1 text-sm text-ink/60">
            Reset all homes, donors, and donations back to the original demo dataset. This cannot be undone.
          </p>
          <button
            onClick={() => setConfirmReset(true)}
            className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Reset demo data
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetToSeed}
        title="Reset all data?"
        message="Every home, donor, and donation you've added or edited will be replaced with the original demo dataset."
      />
    </AdminLayout>
  )
}

function SettingRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink/50">{description}</span>
      </span>
      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-haze-200 transition peer-checked:bg-forest-600" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
