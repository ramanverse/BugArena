import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import useNotificationStore from '../../stores/notificationStore'

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const { unreadCount } = useNotificationStore()
  const [searchVal, setSearchVal] = useState('')

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e13]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-[52px] flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">shield_with_heart</span>
              <span className="text-2xl font-bold text-primary uppercase tracking-tighter font-headline">
                BugArena
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/programs"
                className={({ isActive }) =>
                  isActive
                    ? 'px-3 py-1 text-sm text-primary font-bold border-b-2 border-primary pb-1 font-mono'
                    : 'px-3 py-1 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 font-mono transition-all duration-200'
                }
              >
                Programs
              </NavLink>
              <NavLink
                to="/learn"
                className={({ isActive }) =>
                  isActive
                    ? 'px-3 py-1 text-sm text-primary font-bold border-b-2 border-primary pb-1 font-mono'
                    : 'px-3 py-1 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 font-mono transition-all duration-200'
                }
              >
                Learning Hub
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  isActive
                    ? 'px-3 py-1 text-sm text-primary font-bold border-b-2 border-primary pb-1 font-mono'
                    : 'px-3 py-1 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 font-mono transition-all duration-200'
                }
              >
                Leaderboard
              </NavLink>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none font-mono w-32 focus:w-48 transition-all duration-300"
              />
            </div>

            {/* Notifications */}
            <button className="relative text-on-surface-variant hover:text-primary transition-colors p-1">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-on-error text-[9px] font-bold font-mono flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-outline-variant hidden md:block" />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-1.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all font-mono"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors font-mono hidden md:block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all font-mono"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Gradient line below navbar */}
      <div className="fixed top-[52px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-50 pointer-events-none" />
    </>
  )
}
