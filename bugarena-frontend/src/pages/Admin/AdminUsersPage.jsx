import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link, NavLink } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar'
import LevelBadge from '../../components/ui/LevelBadge'
import { getAdminUsers, banUser } from '../../api/admin.api'
import { formatDate } from '../../utils/formatDate'
import PageTransition from '../../components/layout/PageTransition'

const ROLE_STYLES = {
  admin: 'bg-secondary-container text-on-secondary-container',
  hunter: 'bg-primary/10 text-primary',
  owner: 'bg-tertiary-container/20 text-tertiary',
}

const ADMIN_NAV = [
  { to: '/admin', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/admin/reports', icon: 'description', label: 'Reports' },
  { to: '/admin/users', icon: 'group', label: 'Users' },
  { to: '/admin/programs', icon: 'verified_user', label: 'Programs' },
]

export default function AdminUsersPage() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['admin-users'], queryFn: () => getAdminUsers().then(r => r.data) })
  const users = data?.users || []

  const { mutate: ban } = useMutation({
    mutationFn: (id) => banUser(id),
    onSuccess: () => { toast.success('User status updated'); qc.invalidateQueries(['admin-users']) },
    onError: () => toast.error('Action failed'),
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
            Users <span className="text-primary">Management</span>
          </h1>
          <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">All registered operators</p>

          <div className="bg-surface-container-low border-t border-white/5 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-on-surface-variant uppercase border-b border-white/5 text-[10px] tracking-widest">
                  <th className="p-4 font-normal">Hunter</th>
                  <th className="p-4 font-normal">Role</th>
                  <th className="p-4 font-normal">Level</th>
                  <th className="p-4 font-normal">Reports</th>
                  <th className="p-4 font-normal">Joined</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(users.length ? users : Array(8).fill(null)).map((u, i) => (
                  <tr key={u?._id || i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u?.name || `User${i}`} size="sm" src={u?.avatarUrl} />
                        <div>
                          <p className="font-bold text-on-surface">{u?.name || `Operator_${i}`}</p>
                          <p className="text-[9px] text-on-surface-variant">{u?.email || `op${i}@bugarena.io`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${ROLE_STYLES[u?.role || (i === 0 ? 'admin' : i % 3 === 0 ? 'owner' : 'hunter')]}`}>
                        {u?.role || (i === 0 ? 'admin' : i % 3 === 0 ? 'owner' : 'hunter')}
                      </span>
                    </td>
                    <td className="p-4"><LevelBadge level={u?.level || 'HUNTER'} /></td>
                    <td className="p-4 text-on-surface">{u?.totalReports || 12 - i}</td>
                    <td className="p-4 text-on-surface-variant">{formatDate(u?.createdAt)}</td>
                    <td className="p-4">
                      <span className={`w-2 h-2 rounded-full inline-block mr-2 ${u?.isBanned ? 'bg-error' : 'bg-primary'}`} />
                      <span className={u?.isBanned ? 'text-error' : 'text-primary'}>{u?.isBanned ? 'Banned' : 'Active'}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => u && ban(u._id)}
                        className={`font-mono text-[10px] uppercase tracking-widest hover:underline transition-colors ${u?.isBanned ? 'text-primary' : 'text-error'}`}
                      >
                        {u?.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </td>
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
