import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AdminPage from './AdminPage'
import SeverityBadge from '../../components/ui/SeverityBadge'
import StatusBadge from '../../components/ui/StatusBadge'
import { getAdminReports } from '../../api/admin.api'
import { changeStatus } from '../../api/report.api'
import { formatDate } from '../../utils/formatDate'
import { Link, NavLink } from 'react-router-dom'

const ADMIN_NAV = [
  { to: '/admin', icon: 'dashboard', label: 'Overview', end: true },
  { to: '/admin/reports', icon: 'description', label: 'Reports' },
  { to: '/admin/users', icon: 'group', label: 'Users' },
  { to: '/admin/programs', icon: 'verified_user', label: 'Programs' },
]

export default function AdminReportsPage() {
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState(-1)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports', sortField, sortDir],
    queryFn: () => getAdminReports({ sort: sortField, dir: sortDir }).then(r => r.data),
  })
  const reports = data?.reports || []

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => changeStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['admin-reports']) },
    onError: () => toast.error('Update failed'),
  })

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d * -1)
    else { setSortField(field); setSortDir(-1) }
  }

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
        <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
          Reports <span className="text-primary">Management</span>
        </h1>
        <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">All submitted vulnerability reports</p>

        <div className="bg-surface-container-low border-t border-white/5 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-on-surface-variant uppercase border-b border-white/5 text-[10px] tracking-widest">
                {[['Report ID', 'id'], ['Title', 'title'], ['Severity', 'severity'], ['Program', 'program'], ['Status', 'status'], ['Date', 'createdAt']].map(([label, field]) => (
                  <th key={field} className="p-4 font-normal cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort(field)}>
                    {label} {sortField === field ? (sortDir === -1 ? '↓' : '↑') : ''}
                  </th>
                ))}
                <th className="p-4 font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(reports.length ? reports : Array(8).fill(null)).map((r, i) => (
                <tr key={r?._id || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-on-surface-variant">#{r?._id?.slice(-6).toUpperCase() || `A${i}B${i}C`}</td>
                  <td className="p-4 text-on-surface max-w-[200px] truncate">{r?.title || 'XSS in login form'}</td>
                  <td className="p-4"><SeverityBadge severity={r?.severity || 'HIGH'} /></td>
                  <td className="p-4 text-on-surface-variant">{r?.program?.name || 'PayPal'}</td>
                  <td className="p-4">
                    <select
                      defaultValue={r?.status || 'PENDING'}
                      onChange={(e) => r && updateStatus({ id: r._id, status: e.target.value })}
                      className="bg-surface-container text-on-surface border-none focus:ring-0 focus:outline-none font-mono text-xs cursor-pointer p-1"
                    >
                      {['PENDING', 'TRIAGING', 'ACCEPTED', 'REJECTED', 'DUPLICATE', 'REWARDED'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-on-surface-variant">{formatDate(r?.createdAt)}</td>
                  <td className="p-4">
                    <Link to={`/reports/${r?._id || '#'}`} className="text-primary hover:underline font-mono text-[10px] uppercase">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
