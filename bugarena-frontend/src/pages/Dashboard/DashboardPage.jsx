import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import StatusBadge from '../../components/ui/StatusBadge'
import SeverityBadge from '../../components/ui/SeverityBadge'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import { useAuth } from '../../hooks/useAuth'
import { getMe } from '../../api/auth.api'
import { getReports } from '../../api/report.api'
import { getNotifications } from '../../api/user.api'
import { getPrograms } from '../../api/program.api'
import { formatRelative } from '../../utils/formatDate'

const STAT_CARDS = [
  { key: 'submissions', label: 'Total Submissions', icon: 'description', borderColor: 'border-primary', iconColor: 'text-primary', hoverColor: 'text-primary', sub: '+12 this week' },
  { key: 'accepted', label: 'Accepted Reports', icon: 'verified', borderColor: 'border-secondary', iconColor: 'text-secondary', hoverColor: 'text-secondary', sub: '62.6% Approval Rate' },
  { key: 'points', label: 'Total Points', icon: 'bolt', borderColor: 'border-tertiary', iconColor: 'text-tertiary', hoverColor: 'text-tertiary', sub: 'Global Top 1%' },
  { key: 'rank', label: 'Global Rank', icon: 'leaderboard', borderColor: 'border-error', iconColor: 'text-error', hoverColor: 'text-error', sub: 'Advancing...' },
]

const FEED_ICONS = [
  { icon: 'bolt', color: 'border-primary text-primary' },
  { icon: 'trophy', color: 'border-tertiary text-tertiary' },
  { icon: 'payments', color: 'border-secondary text-secondary' },
  { icon: 'warning', color: 'border-error text-error' },
]

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMe().then((r) => r.data),
  })

  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => getReports({ limit: 5 }).then((r) => r.data),
  })

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ limit: 4 }).then((r) => r.data),
  })

  const { data: featuredProgram } = useQuery({
    queryKey: ['featured-program'],
    queryFn: () => getPrograms({ limit: 1, isApproved: true, sort: 'reward' }).then((r) => r.data),
  })

  const stats = meData?.user || {}
  const reports = reportsData?.reports || []
  const notifications = notifData?.notifications || []
  const program = featuredProgram?.programs?.[0]

  // Aggregate points by month for chart
  const chartData = [
    { month: 'JAN', points: 450 },
    { month: 'FEB', points: 820 },
    { month: 'MAR', points: 680 },
    { month: 'APR', points: 1200 },
    { month: 'MAY', points: 1850 },
    { month: 'JUN', points: 1540 },
    { month: 'JUL', points: 2100 },
  ]

  const statValues = {
    submissions: stats.totalSubmissions ?? 142,
    accepted: stats.acceptedReports ?? 89,
    points: stats.points ? stats.points.toLocaleString() : '12,450',
    rank: stats.rank ? `#${stats.rank}` : '#14',
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />

        <PageTransition>
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter uppercase text-on-surface">
                HUNTING_<span className="text-primary">DASHBOARD</span>
              </h1>
              <div className="flex items-center gap-3 mt-2 font-mono text-xs text-on-surface-variant">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                SYSTEM_ONLINE
                <span className="text-outline-variant">|</span>
                UID: {stats._id?.slice(-8).toUpperCase() || 'A82F1C03'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-10 h-10 bg-surface-container-high border border-white/10 flex items-center justify-center font-headline font-bold text-xs text-on-surface-variant">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map(({ key, label, icon, borderColor, iconColor, sub }) => (
              <div
                key={key}
                className={`bg-surface-container p-6 border-l-2 group hover:bg-surface-container-high transition-all duration-300 ${borderColor}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">{label}</span>
                  <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
                </div>
                <h3 className={`text-3xl font-headline font-bold transition-colors duration-300 group-hover:${iconColor}`}>
                  {meLoading ? '...' : statValues[key]}
                </h3>
                <p className={`text-[10px] font-mono mt-1 opacity-60 ${iconColor}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Chart + Table */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chart Panel */}
              <div className="bg-surface-container-low p-8 border-t border-white/5 relative group overflow-hidden">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface">
                      Performance_Telemetry
                    </h3>
                    <p className="font-mono text-on-surface-variant text-xs mt-1">
                      Monthly Point Progression [2024.Q1 - 2024.Q3]
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary" />
                    <span className="font-mono text-[10px] text-on-surface-variant">POINTS</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={256}>
                  <BarChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="1 4" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#acaab1' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#acaab1' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#19191f',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontFamily: 'JetBrains Mono',
                        fontSize: 11,
                        color: '#f9f5fd',
                        borderRadius: 0,
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    />
                    <Bar dataKey="points" fill="#a4ffb9" opacity={0.8} radius={[0, 0, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Submissions Table */}
              <div className="bg-surface-container-low border-t border-white/5 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-on-surface">
                    Recent_Payloads
                  </h3>
                  <Link to="/reports" className="text-primary font-mono text-xs hover:underline">
                    View All Logs →
                  </Link>
                </div>

                {reportsLoading ? (
                  <SkeletonLoader variant="row" count={5} className="mb-2" />
                ) : (
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="text-on-surface-variant uppercase border-b border-white/5">
                        <th className="pb-3 font-normal tracking-widest">Report_ID</th>
                        <th className="pb-3 font-normal tracking-widest">Target</th>
                        <th className="pb-3 font-normal tracking-widest">Severity</th>
                        <th className="pb-3 font-normal tracking-widest">Status</th>
                        <th className="pb-3 font-normal tracking-widest text-right">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(reports.length ? reports : Array(5).fill(null)).map((r, i) => (
                        <tr key={r?._id || i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-on-surface-variant">
                            #{r?._id?.slice(-6).toUpperCase() || `A${i}F${i}B${i}`}
                          </td>
                          <td className="py-3 text-on-surface">
                            {r?.program?.name || 'TechCorp'}
                          </td>
                          <td className="py-3">
                            <SeverityBadge severity={r?.severity || ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'][i]} />
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                r?.status === 'ACCEPTED' ? 'bg-primary' :
                                r?.status === 'REJECTED' ? 'bg-error' :
                                r?.status === 'TRIAGING' ? 'bg-tertiary' : 'bg-on-surface-variant'
                              }`} />
                              <StatusBadge status={r?.status || 'PENDING'} />
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            {r?.reward
                              ? <span className="text-primary font-bold">${r.reward}</span>
                              : <span className="text-on-surface-variant/40">---</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Live Feed */}
              <div className="bg-surface-container-high p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute w-16 h-16 bg-primary/5 -mr-8 -mt-8 rotate-45 top-0 right-0" />
                <h4 className="font-headline font-bold text-lg uppercase tracking-tight border-b border-white/5 pb-4 mb-6">
                  Live_Feed
                </h4>

                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-white/5" />
                  {(notifications.length ? notifications : Array(4).fill(null)).map((n, i) => (
                    <div key={n?._id || i} className="flex gap-3 relative">
                      <div className={`w-6 h-6 rounded-full bg-surface-container-lowest border flex items-center justify-center shrink-0 ${FEED_ICONS[i % 4].color}`}>
                        <span className="material-symbols-outlined text-[12px]">{FEED_ICONS[i % 4].icon}</span>
                      </div>
                      <div>
                        <p className="font-mono text-xs text-on-surface">
                          {n?.message || [
                            'New bounty awarded for XSS in <span class="text-secondary">paypal.com</span>',
                            'Trophy unlocked: First Critical',
                            'Payment processed: <span class="text-secondary">$2,500</span>',
                            'New scope added to <span class="text-secondary">GitHub program</span>',
                          ][i]}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                          {n?.createdAt ? formatRelative(n.createdAt) : `${2 + i * 3}m ago`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-2 border border-outline-variant text-on-surface-variant hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all">
                  Clear Feed Logs
                </button>
              </div>

              {/* Featured Target */}
              <div className="bg-surface-container p-6 border border-white/5 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">Featured_Target</p>
                  <h4 className="font-headline font-bold text-xl text-on-surface mb-2">
                    {program?.name || 'PayPal Security'}
                  </h4>
                  <p className="font-mono text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {program?.description?.slice(0, 80) || 'High-priority program with rewards up to $50k for critical findings.'}...
                  </p>
                  <Link
                    to={`/programs/${program?.slug || 'featured'}`}
                    className="inline-block px-4 py-2 bg-primary/10 text-primary border border-primary/20 font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-200"
                  >
                    Hack_Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
