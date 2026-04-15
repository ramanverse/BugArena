import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import StatusBadge from '../../components/ui/StatusBadge'
import SeverityBadge from '../../components/ui/SeverityBadge'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import { getReportById, getComments, addComment } from '../../api/report.api'
import { formatDate, formatRelative } from '../../utils/formatDate'

const STEPS = ['Submitted', 'Triaging', 'Accepted', 'Rewarded']

const STATUS_MAP = {
  PENDING: 0,
  TRIAGING: 1,
  ACCEPTED: 2,
  REWARDED: 3,
  REJECTED: 2,
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const qc = useQueryClient()
  const [comment, setComment] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getReportById(id).then((r) => r.data),
  })

  const { data: commentsData } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id).then((r) => r.data),
  })

  const { mutate: postComment, isPending } = useMutation({
    mutationFn: () => addComment(id, comment),
    onSuccess: () => {
      setComment('')
      qc.invalidateQueries(['comments', id])
      toast.success('Comment added')
    },
    onError: () => toast.error('Failed to post comment'),
  })

  const report = data?.report
  const comments = commentsData?.comments || []
  const activeStep = STATUS_MAP[report?.status] ?? 0

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : (
            <div className="max-w-5xl">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <SeverityBadge severity={report?.severity} />
                    <StatusBadge status={report?.status} />
                  </div>
                  <h1 className="text-3xl font-headline font-bold tracking-tighter text-on-surface">
                    {report?.title || 'Report Title'}
                  </h1>
                  <p className="font-mono text-xs text-on-surface-variant mt-2">
                    Submitted {formatDate(report?.createdAt)} · {report?.program?.name}
                  </p>
                </div>
                {report?.reward && (
                  <div className="bg-primary/10 p-4 border border-primary/20 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Reward</p>
                    <p className="text-2xl font-headline font-bold text-primary">${report.reward}</p>
                  </div>
                )}
              </div>

              {/* Status Stepper */}
              <div className="flex items-center mb-10 bg-surface-container-low p-6 border-t border-white/5">
                {STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        i < activeStep ? 'bg-primary/20 text-primary' :
                        i === activeStep ? 'bg-primary text-on-primary' :
                        'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {i < activeStep
                          ? <span className="material-symbols-outlined text-sm">check</span>
                          : i + 1}
                      </div>
                      <p className={`font-mono text-[9px] uppercase tracking-widest mt-1.5 ${
                        i === activeStep ? 'text-primary' : 'text-on-surface-variant'
                      }`}>{step}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-[1px] mx-2 ${i < activeStep ? 'bg-primary/40' : 'bg-white/5'}`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                  {[
                    { label: 'Affected URL', value: report?.affectedUrl || 'https://example.com/api/vuln' },
                    { label: 'CVSS Score', value: report?.cvssScore ? `${report.cvssScore} / 10` : '9.8 / 10' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface-container-low p-6 border-t border-white/5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-2">{label}</p>
                      <p className="font-mono text-sm text-on-surface">{value}</p>
                    </div>
                  ))}

                  <div className="bg-surface-container-low p-6 border-t border-white/5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Steps to Reproduce</p>
                    <div className="prose prose-sm prose-invert max-w-none font-mono text-xs text-on-surface-variant">
                      <ReactMarkdown>{report?.stepsToReproduce || '1. Login to the application\n2. Navigate to the vulnerable endpoint\n3. Send the crafted payload\n4. Observe the response'}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-6 border-t border-white/5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Impact Description</p>
                    <p className="font-mono text-xs text-on-surface-variant leading-relaxed">
                      {report?.impactDescription || 'An attacker could leverage this vulnerability to achieve remote code execution on the target system, potentially allowing full system compromise.'}
                    </p>
                  </div>

                  {/* Comments */}
                  <div className="bg-surface-container-low p-6 border-t border-white/5">
                    <h3 className="font-headline font-bold text-lg mb-6 uppercase tracking-tight">Comments</h3>
                    <div className="space-y-4 mb-6">
                      {comments.map((c) => (
                        <div
                          key={c._id}
                          className={`p-4 border-l-2 ${c.user?.role === 'admin' ? 'border-secondary bg-secondary/5' : 'border-primary bg-primary/5'}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs font-bold text-on-surface">{c.user?.name}</span>
                            <span className={`font-mono text-[9px] ${c.user?.role === 'admin' ? 'text-secondary' : 'text-primary'}`}>
                              [{c.user?.role?.toUpperCase()}]
                            </span>
                            <span className="font-mono text-[9px] text-on-surface-variant ml-auto">{formatRelative(c.createdAt)}</span>
                          </div>
                          <p className="font-mono text-xs text-on-surface-variant">{c.content}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input-field resize-none"
                      />
                      <button
                        onClick={() => comment.trim() && postComment()}
                        disabled={isPending || !comment.trim()}
                        className="px-6 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-50 transition-all"
                      >
                        {isPending ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline sidebar */}
                <div className="space-y-6">
                  <div className="bg-surface-container-high p-6 border border-white/5">
                    <h4 className="font-headline font-bold text-sm uppercase tracking-tight mb-4 border-b border-white/5 pb-4">Timeline</h4>
                    <div className="space-y-4">
                      {(report?.statusHistory || [
                        { status: 'PENDING', date: report?.createdAt, note: 'Report submitted' },
                        { status: 'TRIAGING', date: null, note: 'Under review' },
                      ]).map((h, i) => (
                        <div key={i} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            h.status === 'ACCEPTED' ? 'bg-primary' :
                            h.status === 'REJECTED' ? 'bg-error' :
                            h.status === 'TRIAGING' ? 'bg-tertiary' : 'bg-on-surface-variant'
                          }`} />
                          <div>
                            <p className="font-mono text-[10px] uppercase text-on-surface font-bold">{h.status}</p>
                            <p className="font-mono text-[9px] text-on-surface-variant">{h.note}</p>
                            {h.date && <p className="font-mono text-[9px] text-outline">{formatDate(h.date)}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  )
}
