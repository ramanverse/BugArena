import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'
import LevelBadge from '../ui/LevelBadge'
import { getLevelProgress } from '../../utils/getLevelProgress'

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/reports', icon: 'description', label: 'Reports' },
  { to: '/programs', icon: 'verified_user', label: 'Programs' },
  { to: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
  { to: '/learn', icon: 'school', label: 'Learning Hub' },
  { to: '/certificates', icon: 'military_tech', label: 'Certificates' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { level } = getLevelProgress(user?.points || 0)

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-50 bg-[#0e0e13] border-r border-white/5 font-mono text-sm">
      {/* Top: Avatar + Info */}
      <div className="p-8 flex flex-col items-center border-b border-white/5">
        <div className="relative group cursor-pointer mb-4">
          <Avatar
            src={user?.avatarUrl}
            name={user?.name || 'Operator'}
            size="lg"
            className="border-2 border-surface-container-highest"
          />
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-sm">edit</span>
          </div>
        </div>
        <p className="text-primary font-black tracking-widest text-lg uppercase font-headline">
          {user?.name ? user.name.split(' ')[0].toUpperCase() : 'OPERATOR'}
        </p>
        <LevelBadge level={level} className="mt-1" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 mt-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-4 py-3 bg-secondary/10 text-secondary border-r-2 border-secondary'
                : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1 transition-all duration-300'
            }
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
        
        {/* Signout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-error hover:translate-x-1 transition-all duration-300 w-full text-left"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Sign Out</span>
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          to="/submit"
          className="block w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs text-center hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          Submit Report
        </Link>
        <div className="flex items-center justify-center gap-6 pt-2">
          <button className="text-on-surface-variant text-[10px] font-mono uppercase tracking-widest hover:text-primary transition-colors">
            Support
          </button>
          <div className="h-3 w-[1px] bg-outline-variant" />
          <button className="text-on-surface-variant text-[10px] font-mono uppercase tracking-widest hover:text-primary transition-colors">
            Terminal
          </button>
        </div>
      </div>
    </aside>
  )
}
