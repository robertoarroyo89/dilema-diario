import { NavLink } from 'react-router-dom'

// Barra de pestañas flotante de cristal, anclada abajo. Respeta el safe-area.
export default function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)] pointer-events-none">
      <div className="glass-strong pointer-events-auto flex gap-1 rounded-full p-1.5 shadow-float">
        <Tab to="/" end label="Global" icon={<GlobeIcon />} />
        <Tab to="/grupos" label="Grupos" icon={<GroupIcon />} />
      </div>
    </nav>
  )
}

function Tab({ to, end, label, icon }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-600 transition-all duration-200 active:scale-95 ' +
        (isActive ? 'bg-white/15 text-ink' : 'text-ink-muted hover:text-ink')
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}

function GlobeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M16 6a3 3 0 0 1 0 6M17.5 19a5.5 5.5 0 0 0-2.7-4.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
