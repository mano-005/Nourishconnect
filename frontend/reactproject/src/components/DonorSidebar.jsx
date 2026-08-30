import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/donor/dashboard', icon: IconGrid },
  { label: 'Donate Food', to: '/donor/donate', icon: IconGive },
  { label: 'My Donations', to: '/donor/my-donations', icon: IconBox },
  { label: 'Track Donations', to: '/donor/track', icon: IconTruck },
  { label: 'Receiving Homes', to: '/donor/homes', icon: IconHome },
  { label: 'Donation History', to: '/donor/history', icon: IconHistory },
]

function initials(value) {
  if (!value) return 'D'
  const name = value.includes('@') ? value.split('@')[0] : value
  return name.slice(0, 1).toUpperCase()
}

export default function DonorSidebar({ open, onClose, user, onLogout, weeklyFamilies }) {
  const name = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Donor'

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-forest-100 bg-haze-50 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start gap-3 px-6 pb-6 pt-8">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-700 text-base font-semibold text-white">
            {initials(user?.name || user?.email)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Good morning, {name}</p>
            <p className="truncate text-xs text-ink/50">
              Your contributions helped {weeklyFamilies ?? 0} {weeklyFamilies === 1 ? 'family' : 'families'}…
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto shrink-0 rounded-full p-1.5 text-ink/50 hover:bg-haze-100 lg:hidden"
          >
            <IconClose />
          </button>
        </div>

        <div className="px-4">
          <NavLink
            to="/donor/donate"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-xl bg-clay-500 px-4 py-3 text-sm font-semibold text-forest-900 shadow-card transition hover:bg-clay-300"
          >
            <IconPlus />
            New Donation
          </NavLink>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              end={item.to === '/donor/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-700 text-white shadow-card'
                    : 'text-ink/70 hover:bg-haze-100'
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-forest-100 px-4 py-6">
          <NavLink
            to="/donor/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-forest-50 text-forest-700' : 'text-ink/70 hover:bg-haze-100'
              }`
            }
          >
            <IconUser />
            Profile
          </NavLink>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
function IconGive() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10h6l2-2h4l2 2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 8 12 4l8 4-8 4-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 8v9l8 4 8-4V8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 12v9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
function IconTruck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 7h11v9H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="18" r="1.7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}
function IconHistory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 4v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
