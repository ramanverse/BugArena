import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import LevelBadge from '../../components/ui/LevelBadge'
import Avatar from '../../components/ui/Avatar'
import { getLeaderboard } from '../../api/leaderboard.api'

const TABS = ['Global', 'Monthly', 'College']

const PODIUM_STYLES = [
  { border: 'border-primary', bg: 'bg-primary/10', label: 'gold', rankColor: 'text-primary' },
  { border: 'border-on-surface-variant/30', bg: 'bg-surface-container-high', label: 'silver', rankColor: 'text-on-surface-variant' },
  { border: 'border-error-dim', bg: 'bg-error-container/10', label: 'bronze', rankColor: 'text-error-dim' },
]

export default function LeaderboardPage() {
  const [tab, setTab] = useState('Global')

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', tab.toLowerCase()],
    queryFn: () => getLeaderboard({ type: tab.toLowerCase(), limit: 50 }).then((r) => r.data),
    staleTime: 60000,
  })

  const users = data?.users || []
  const topThree = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <div className="mb-10">
            <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-1">
              <span className="text-primary">Leader</span>board
            </h1>
            <p className="text-on-surface-variant font-mono text-xs uppercase tracking-widest">Top hunters ranked by bounties earned</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-10">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold transition-all ${
                  tab === t ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[1, 0, 2].map((podiumIdx) => {
              const user = topThree[podiumIdx]
              const style = PODIUM_STYLES[podiumIdx]
              return (
                <div key={podiumIdx} className={`p-6 border ${style.border} ${style.bg} text-center ${podiumIdx === 0 ? 'md:-mt-4' : ''}`}>
                  <div className="font-mono text-4xl font-bold mb-3 opacity-20">{podiumIdx + 1 === 1 ? '#1' : podiumIdx + 1 === 2 ? '#2' : '#3'}</div>
                  <Avatar
                    name={user?.name || '?'}
                    src={`/images/avatars/hunter${podiumIdx === 0 ? 1 : podiumIdx === 1 ? 2 : 3}.jpg`}
                    size={podiumIdx === 0 ? 'xl' : 'lg'}
                    className="mx-auto mb-3 border-2 border-current"
                  />
                  <h3 className="font-headline font-bold text-lg text-on-surface">{user?.name || `Hunter ${podiumIdx + 1}`}</h3>
                  <LevelBadge level={user?.level || 'ELITE'} className="justify-center mt-1 mb-3" />
                  <p className={`font-mono text-xl font-bold ${style.rankColor}`}>
                    ${user?.totalBounties ? (user.totalBounties / 1000).toFixed(1) + 'k' : `${(3 - podiumIdx) * 45}k`}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Full Table */}
          <div className="bg-surface-container-low border-t border-white/5">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-on-surface-variant uppercase border-b border-white/5 text-[10px] tracking-widest">
                  <th className="p-4 font-normal">Rank</th>
                  <th className="p-4 font-normal">Hunter</th>
                  <th className="p-4 font-normal hidden md:table-cell">College</th>
                  <th className="p-4 font-normal">Bugs</th>
                  <th className="p-4 font-normal">Points</th>
                  <th className="p-4 font-normal">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(rest.length ? rest : Array(10).fill(null)).map((u, i) => (
                  <tr key={u?._id || i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-on-surface-variant">#{i + 4}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u?.name || `Hunter${i}`} size="sm" />
                        <span className="text-on-surface font-bold">{u?.name || `Hunter_${String.fromCharCode(68 + i)}`}</span>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant hidden md:table-cell">{u?.college || 'MIT'}</td>
                    <td className="p-4 text-on-surface">{u?.totalReports || 10 - i}</td>
                    <td className="p-4 text-primary font-bold">{u?.points?.toLocaleString() || `${(10 - i) * 800}`}</td>
                    <td className="p-4"><LevelBadge level={u?.level || 'HUNTER'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
