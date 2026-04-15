import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import LevelBadge from '../../components/ui/LevelBadge'
import SeverityBadge from '../../components/ui/SeverityBadge'
import ReportCard from '../../components/ui/ReportCard'
import { getProfile } from '../../api/user.api'
import { getLevelProgress } from '../../utils/getLevelProgress'

export default function ProfilePage() {
  const { username } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username).then((r) => r.data),
  })

  const user = data?.user
  const { level, progress, next, remaining } = getLevelProgress(user?.points || 0)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          {/* Cover Banner */}
          <div className="h-40 bg-gradient-to-r from-primary/20 via-secondary/10 to-transparent relative" />

          <div className="px-6 md:px-10 lg:px-12 pb-12">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-surface-container-high border-4 border-background flex items-center justify-center font-headline font-bold text-3xl text-on-surface-variant">
                  {user?.name?.[0] || '?'}
                </div>
              </div>
              <button className="px-4 py-2 border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-all">
                Edit Profile
              </button>
            </div>

            <h1 className="text-3xl font-headline font-bold text-on-surface mb-1">{user?.name || username}</h1>
            <p className="text-on-surface-variant font-mono text-xs mb-1">{user?.college || 'Independent Researcher'}</p>
            <LevelBadge level={level} className="mb-6" />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Reports', value: user?.totalReports ?? 142, color: 'border-primary' },
                { label: 'Accepted', value: user?.acceptedReports ?? 89, color: 'border-secondary' },
                { label: 'Points', value: user?.points?.toLocaleString() ?? '12,450', color: 'border-tertiary' },
                { label: 'Rank', value: `#${user?.rank ?? 14}`, color: 'border-error' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`bg-surface-container p-6 border-l-2 ${color}`}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{label}</p>
                  <p className="text-2xl font-headline font-bold text-on-surface">{value}</p>
                </div>
              ))}
            </div>

            {/* Level Progress */}
            <div className="bg-surface-container-low p-6 border-t border-white/5 mb-8">
              <div className="flex justify-between mb-3 font-mono text-xs text-on-surface-variant">
                <span>Level Progress: <span className="text-primary">{level}</span></span>
                {next && <span>{remaining?.toLocaleString()} pts to next level</span>}
              </div>
              <div className="bg-surface-container-high h-2 rounded-none">
                <div
                  className="bg-primary h-2 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Badges */}
            {user?.badges?.length > 0 && (
              <div className="mb-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Badges</p>
                <div className="flex flex-wrap gap-3">
                  {user.badges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-white/5">
                      <span className="material-symbols-outlined text-primary text-sm">military_tech</span>
                      <span className="font-mono text-xs text-on-surface">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Recent Reports</p>
              <div className="space-y-3">
                {(user?.recentReports || []).map((r) => (
                  <ReportCard key={r._id} report={r} />
                ))}
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
