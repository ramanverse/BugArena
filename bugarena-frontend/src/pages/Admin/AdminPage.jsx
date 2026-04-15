import { Link, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import PageTransition from '../../components/layout/PageTransition'
import { getStats, getAdminReports } from '../../api/admin.api'

const ADMIN_NAV = [
  { to: '/admin', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/admin/reports', icon: 'description', label: 'Reports' },
  { to: '/admin/users', icon: 'group', label: 'Users' },
  { to: '/admin/programs', icon: 'verified_user', label: 'Programs' },
]

const PIE_COLORS = ['#a4ffb9', '#ff716c', '#af88ff']

export default function AdminPage() {
  const { data: statsData } = useQuery({ queryKey: ['admin-stats'], queryFn: () => getStats().then(r => r.data) })
  const stats = statsData?.stats || {}

  const pieData = [
    { name: 'Accepted', value: stats.accepted || 340 },
    { name: 'Rejected', value: stats.rejected || 120 },
    { name: 'Pending', value: stats.pending || 85 },
  ]

  const barData = [
    { month: 'JAN', submissions: 42 }, { month: 'FEB', submissions: 68 },
    { month: 'MAR', submissions: 53 }, { month: 'APR', submissions: 91 },
    { month: 'MAY', submissions: 124 }, { month: 'JUN', submissions: 109 },
    { month: 'JUL', submissions: 147 },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-50 bg-[#0e0e13] border-r border-white/5 font-mono text-sm">
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">shield_with_heart</span>
            <span className="font-headline font-bold text-primary uppercase tracking-tighter">BugArena</span>
          </Link>
          <span className="mt-2 block font-mono text-[10px] text-error uppercase tracking-widest">Admin Console</span>
        </div>
        <nav className="flex-1 space-y-1 mt-4">
          {ADMIN_NAV.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link to="/dashboard" className="block text-center font-mono text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors">
            ← Hunter View
          </Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
            Admin <span className="text-primary">Overview</span>
          </h1>
          <p className="text-on-surface-variant font-mono text-xs mb-10 uppercase tracking-widest">Platform health & metrics</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Reports', value: stats.totalReports || 545, color: 'border-primary' },
              { label: 'Total Users', value: stats.totalUsers || 1284, color: 'border-secondary' },
              { label: 'Active Programs', value: stats.activePrograms || 87, color: 'border-tertiary' },
              { label: 'Bounties Paid', value: `$${stats.bountyTotal ? (stats.bountyTotal / 1000).toFixed(0) + 'k' : '4.2M'}`, color: 'border-error' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-surface-container p-6 border-l-2 ${color}`}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{label}</p>
                <p className="text-2xl font-headline font-bold text-on-surface">{value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-container-low p-8 border-t border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2">Submissions Over Time</p>
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface mb-6">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#acaab1' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#acaab1' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#19191f', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'JetBrains Mono', fontSize: 11, borderRadius: 0 }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="submissions" fill="#af88ff" opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface-container-low p-8 border-t border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2">Acceptance Rate</p>
              <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface mb-6">Report Status</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#19191f', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'JetBrains Mono', fontSize: 11, borderRadius: 0 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-4">
                {pieData.map(({ name }, i) => (
                  <div key={name} className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                    <div className="w-2 h-2" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
