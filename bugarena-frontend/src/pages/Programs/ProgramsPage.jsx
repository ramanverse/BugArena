import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import ProgramCard from '../../components/ui/ProgramCard'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import { getPrograms } from '../../api/program.api'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'

export default function ProgramsPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [reward, setReward] = useState('')
  const { page, limit, nextPage, prevPage, goToPage } = usePagination(1, 9)
  const debouncedSearch = useDebounce(search)

  const { data, isLoading } = useQuery({
    queryKey: ['programs', debouncedSearch, difficulty, reward, page],
    queryFn: () =>
      getPrograms({ search: debouncedSearch, difficulty, reward, page, limit, isApproved: true }).then((r) => r.data),
    staleTime: 60000,
  })

  const programs = data?.programs || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] pointer-events-none" />

        <PageTransition>
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-primary uppercase mb-2">
              Active Targets
            </h1>
            <p className="text-on-surface-variant font-body leading-relaxed">
              Browse and hunt across our approved vulnerability disclosure programs.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="mb-10 bg-surface-container-low">
            <div className="flex flex-col lg:flex-row gap-4 p-4 items-center justify-between">
              {/* Search */}
              <div className="w-full lg:w-1/3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-base">search</span>
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary text-sm pl-12 pr-4 py-3 font-mono placeholder:text-outline text-on-surface focus:outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Difficulty */}
                <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 border border-white/5">
                  <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">Difficulty</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-transparent border-none text-sm font-bold focus:ring-0 focus:outline-none text-on-surface cursor-pointer"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry">Entry</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Reward */}
                <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 border border-white/5">
                  <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">Reward</span>
                  <select
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="bg-transparent border-none text-sm font-bold focus:ring-0 focus:outline-none text-on-surface cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="1k-50k">$1k–$50k</option>
                    <option value="50k-100k">$50k–$100k</option>
                    <option value="100k+">$100k+</option>
                  </select>
                </div>

                {/* Filter icon */}
                <button className="p-2.5 bg-surface-container-highest hover:bg-primary/10 hover:text-primary border border-white/5 text-on-surface-variant transition-all">
                  <span className="material-symbols-outlined text-base">tune</span>
                </button>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <SkeletonLoader variant="card" count={6} />
            </div>
          ) : programs.length === 0 ? (
            <EmptyState icon="travel_explore" message="No programs match your filters" cta="Clear Filters" onCta={() => { setSearch(''); setDifficulty(''); setReward('') }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard key={program._id} program={program} />
              ))}

              {/* Elite Invite Card */}
              <div className="xl:col-span-1 bg-gradient-to-br from-secondary/20 to-primary/5 p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px]" />
                <div className="relative z-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Exclusive</p>
                  <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-3">
                    Elite Pool
                  </h2>
                  <p className="text-on-surface-variant font-mono text-xs mb-6 leading-relaxed">
                    Private programs with $100k+ rewards. Invite-only based on reputation score.
                  </p>
                  <button className="px-6 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all">
                    Request Invite
                  </button>
                </div>
              </div>
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} onPage={goToPage} />
        </PageTransition>
      </main>
    </div>
  )
}
