import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'home_storage', label: 'Home' },
  { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { path: '/add-match', icon: 'add_circle', label: 'Add', primary: true },
  { path: '/matches', icon: 'history', label: 'Matches' },
  { path: '/profile/3', icon: 'person_pin', label: 'Profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center pb-4 px-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full h-16 w-full max-w-md flex justify-around items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path.split('/')[1] ? `/${item.path.split('/')[1]}` : item.path))
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-center w-12 h-12 transition-all active:scale-90 duration-150 ${
                isActive
                  ? 'bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] text-white rounded-full shadow-[0_0_15px_rgba(0,212,255,0.5)]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              aria-label={item.label}
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
