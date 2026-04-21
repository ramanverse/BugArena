import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import ReportCard from '../../components/ui/ReportCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import EmptyState from '../../components/ui/EmptyState'
import { getReports } from '../../api/report.api'

export default function MyReportsPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['my-reports-full'],
    queryFn: () => getReports().then((r) => r.data),
  })
  const reports = data?.reports || []

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase">
                My <span className="text-primary">Reports</span>
              </h1>
              <p className="text-on-surface-variant font-mono text-xs mt-1 uppercase tracking-widest">
                All submitted vulnerability reports
              </p>
            </div>
            <Link
              to="/submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Report
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <SkeletonLoader variant="row" count={6} />
            </div>
          ) : reports.length === 0 ? (
            <EmptyState 
              icon="description" 
              message="No reports submitted yet" 
              cta="Submit Your First Report" 
              onCta={() => navigate('/submit')}
            />
          ) : (
            <div className="space-y-4">
              {reports.map((r) => <ReportCard key={r._id} report={r} />)}
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  )
}
