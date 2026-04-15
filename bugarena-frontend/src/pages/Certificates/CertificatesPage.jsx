import { useQuery } from '@tanstack/react-query'
import SeverityBadge from '../../components/ui/SeverityBadge'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import { getCertificates } from '../../api/user.api'
import { formatDate } from '../../utils/formatDate'

const MOCK_CERTS = [
  { _id: '1', title: 'Critical RCE Discovery', program: { name: 'PayPal' }, severity: 'CRITICAL', issuedAt: new Date().toISOString() },
  { _id: '2', title: 'Auth Bypass Expert', program: { name: 'GitHub' }, severity: 'HIGH', issuedAt: new Date().toISOString() },
  { _id: '3', title: 'XSS Master', program: { name: 'Google' }, severity: 'MEDIUM', issuedAt: new Date().toISOString() },
]

const SEVERITY_BORDER = {
  CRITICAL: 'border-error',
  HIGH: 'border-secondary',
  MEDIUM: 'border-tertiary',
  LOW: 'border-primary',
  INFO: 'border-outline-variant',
}

export default function CertificatesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => getCertificates().then((r) => r.data),
  })
  const certs = data?.certificates || MOCK_CERTS

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
            <span className="text-primary">Certificates</span>
          </h1>
          <p className="text-on-surface-variant font-mono text-xs mb-10 uppercase tracking-widest">
            Proof-of-skill credentials earned from accepted reports
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => (
              <div
                key={cert._id}
                className={`bg-surface-container-high p-6 border-t-2 ${SEVERITY_BORDER[cert.severity] || 'border-primary'} hover:bg-surface-container-highest transition-all group`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-2xl">military_tech</span>
                  <SeverityBadge severity={cert.severity} />
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-1 group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="font-mono text-xs text-on-surface-variant mb-1">{cert.program?.name}</p>
                <p className="font-mono text-[10px] text-outline mb-6">{formatDate(cert.issuedAt)}</p>
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button className="flex-1 py-2 border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all">
                    Download PDF
                  </button>
                  <button className="flex-1 py-2 font-mono text-[10px] uppercase tracking-widest text-tertiary hover:underline transition-all">
                    Share LinkedIn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
