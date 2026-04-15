import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import { getProgramBySlug } from '../../api/program.api'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

export default function ProgramDetailPage() {
  const { slug } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['program', slug],
    queryFn: () => getProgramBySlug(slug).then((r) => r.data),
  })
  const program = data?.program

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : (
            <div className="max-w-4xl">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-surface-container-high flex items-center justify-center shrink-0 ring-1 ring-white/5">
                  <span className="material-symbols-outlined text-on-surface-variant text-3xl">verified_user</span>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2">
                    {program?.category || 'Web Security'}
                  </p>
                  <h1 className="text-4xl font-headline font-bold tracking-tighter text-on-surface mb-2">
                    {program?.name || 'Program'}
                  </h1>
                  <p className="text-on-surface-variant font-mono text-sm">
                    {program?.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Max Reward', value: `$${program?.maxReward ? (program.maxReward / 1000).toFixed(0) + 'k' : '50k'}`, color: 'border-primary' },
                  { label: 'Difficulty', value: program?.difficulty || 'Advanced', color: 'border-secondary' },
                  { label: 'Status', value: program?.isApproved ? 'Active' : 'Review', color: 'border-tertiary' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`bg-surface-container p-6 border-l-2 ${color}`}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{label}</p>
                    <p className="text-2xl font-headline font-bold text-on-surface">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-surface-container-low p-8 border-t border-white/5 mb-6">
                <h2 className="font-headline font-bold text-xl mb-4 uppercase tracking-tight">Scope</h2>
                <div className="space-y-2">
                  {(program?.scope || ['*.example.com', 'api.example.com', 'app.example.com']).map((s, i) => (
                    <div key={i} className="flex items-center gap-3 font-mono text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <button className="px-8 py-3.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all">
                Submit Report
              </button>
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  )
}
