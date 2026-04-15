import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link, NavLink } from 'react-router-dom'
import { getAdminPrograms, approveProgram, rejectProgram } from '../../api/admin.api'
import PageTransition from '../../components/layout/PageTransition'

const ADMIN_NAV = [
  { to: '/admin', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/admin/reports', icon: 'description', label: 'Reports' },
  { to: '/admin/users', icon: 'group', label: 'Users' },
  { to: '/admin/programs', icon: 'verified_user', label: 'Programs' },
]

export default function AdminProgramsPage() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['admin-programs'], queryFn: () => getAdminPrograms().then(r => r.data) })
  const programs = data?.programs || []

  const { mutate: approve } = useMutation({
    mutationFn: (id) => approveProgram(id),
    onSuccess: () => { toast.success('Program approved'); qc.invalidateQueries(['admin-programs']) },
  })

  const { mutate: reject } = useMutation({
    mutationFn: (id) => rejectProgram(id),
    onSuccess: () => { toast.success('Program rejected'); qc.invalidateQueries(['admin-programs']) },
  })

  return (
    <div className="flex min-h-screen bg-background">
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
            <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'flex items-center gap-3 px-4 py-3 bg-secondary/10 text-secondary border-r-2 border-secondary' : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1 transition-all duration-300'}>
              <span className="material-symbols-outlined text-xl">{icon}</span><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link to="/dashboard" className="block text-center font-mono text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors">← Hunter View</Link>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
            Programs <span className="text-primary">Management</span>
          </h1>
          <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">Review and approve bug bounty programs</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(programs.length ? programs : Array(6).fill(null)).map((p, i) => (
              <div key={p?._id || i} className="bg-surface-container-high p-6 border border-white/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface">{p?.name || `Program ${i + 1}`}</h3>
                    <p className="font-mono text-xs text-on-surface-variant">{p?.category || 'Web Security'}</p>
                  </div>
                  <span className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${p?.isApproved ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {p?.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="font-mono text-xs text-on-surface-variant mb-4 line-clamp-2">
                  {p?.description || 'Enterprise vulnerability disclosure program with competitive rewards for critical findings.'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="font-mono text-sm text-primary font-bold">
                    Up to ${p?.maxReward ? (p.maxReward / 1000).toFixed(0) + 'k' : '50k'}
                  </span>
                  {!p?.isApproved ? (
                    <div className="flex gap-2">
                      <button onClick={() => p && approve(p._id)} className="px-4 py-1.5 bg-primary text-on-primary font-mono text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                        Approve
                      </button>
                      <button onClick={() => p && reject(p._id)} className="px-4 py-1.5 bg-error-container text-on-error-container hover:bg-error font-mono text-[10px] uppercase tracking-widest transition-all">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => p && reject(p._id)} className="px-4 py-1.5 border border-outline-variant text-on-surface-variant hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
