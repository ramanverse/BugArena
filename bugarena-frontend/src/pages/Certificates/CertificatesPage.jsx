import { useQuery } from '@tanstack/react-query'
import SeverityBadge from '../../components/ui/SeverityBadge'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import { getCertificates } from '../../api/user.api'
import { useAuth } from '../../hooks/useAuth'
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
  const { user } = useAuth()
  const { data } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => getCertificates().then((r) => r.data),
  })
  const certs = data?.certificates || MOCK_CERTS

  const handleDownloadPDF = (cert) => {
    const printWindow = window.open('', '_blank', 'width=850,height=650')
    if (!printWindow) return

    const researcherName = (user?.fullName || user?.name || 'Hunter Operator').toUpperCase()

    const html = `
      <html>
        <head>
          <title>Certificate - ${cert.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Outfit:wght@400;700;900&display=swap');
            
            @page {
              size: landscape;
              margin: 0;
            }

            body {
              margin: 0;
              padding: 40px;
              background-color: #0b0b0e;
              color: #f9f5fd;
              font-family: 'Courier Prime', monospace;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              box-sizing: border-box;
            }

            .certificate {
              border: 4px solid #a4ffb9;
              padding: 50px;
              background-color: #0e0e13;
              max-width: 850px;
              width: 100%;
              text-align: center;
              position: relative;
              box-shadow: 0 0 35px rgba(164, 255, 185, 0.15);
              box-sizing: border-box;
            }

            .certificate::before {
              content: '';
              position: absolute;
              top: 8px; left: 8px; right: 8px; bottom: 8px;
              border: 1px solid rgba(164, 255, 185, 0.2);
              pointer-events: none;
            }

            .title {
              font-family: 'Outfit', sans-serif;
              font-size: 36px;
              font-weight: 900;
              color: #a4ffb9;
              text-transform: uppercase;
              letter-spacing: 3px;
              margin-bottom: 10px;
            }

            .subtitle {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 5px;
              color: #acaab1;
              margin-bottom: 45px;
            }

            .presented-to {
              font-size: 13px;
              color: #acaab1;
              margin-bottom: 12px;
              letter-spacing: 1px;
            }

            .name {
              font-family: 'Outfit', sans-serif;
              font-size: 32px;
              font-weight: 700;
              color: #f9f5fd;
              text-transform: uppercase;
              margin-bottom: 35px;
              border-bottom: 2px solid rgba(255,255,255,0.08);
              display: inline-block;
              padding-bottom: 8px;
              min-width: 400px;
              letter-spacing: 1px;
            }

            .description {
              font-size: 14px;
              line-height: 1.8;
              color: #acaab1;
              max-width: 680px;
              margin: 0 auto 45px;
            }

            .meta-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 40px;
              margin-top: 30px;
              border-top: 1px solid rgba(255,255,255,0.08);
              padding-top: 35px;
            }

            .meta-item {
              text-align: left;
            }

            .meta-label {
              font-size: 9px;
              text-transform: uppercase;
              color: #76747b;
              letter-spacing: 2.5px;
            }

            .meta-val {
              font-size: 13px;
              color: #f9f5fd;
              margin-top: 6px;
              font-weight: bold;
            }

            .seal {
              position: absolute;
              bottom: 45px;
              right: 60px;
              border: 2px double #af88ff;
              color: #af88ff;
              width: 85px;
              height: 85px;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 9px;
              font-weight: bold;
              text-transform: uppercase;
              transform: rotate(-12deg);
              letter-spacing: 1.5px;
              background-color: rgba(175, 136, 255, 0.03);
            }

            @media print {
              body {
                background: white;
                color: black;
                padding: 40px;
              }
              .certificate {
                border-color: #000;
                background: white;
                color: black;
                box-shadow: none;
              }
              .certificate::before {
                border-color: rgba(0, 0, 0, 0.15);
              }
              .title { color: #000; }
              .name { color: #000; border-bottom-color: #000; }
              .description { color: #222; }
              .meta-val { color: #000; }
              .seal { border-color: #000; color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="title">Security Researcher Certificate</div>
            <div class="subtitle">BUGARENA VERIFIED CREDENTIAL</div>
            
            <div class="presented-to">This credential certifies that the operator</div>
            <div class="name">${researcherName}</div>
            
            <div class="description">
              has successfully discovered, analyzed, and responsibly disclosed the vulnerability 
              <strong>"${cert.title}"</strong> on target program <strong>"${cert.program?.name}"</strong> 
              with a certified severity rating of <strong>"${cert.severity}"</strong>. 
              Their contribution has been validated by core moderators and permanently added to the BugArena registry.
            </div>
            
            <div class="meta-grid">
              <div class="meta-item">
                <div class="meta-label">Credential Verification ID</div>
                <div class="meta-val">SEC-CERT-${cert._id.toUpperCase()}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Date of Validation</div>
                <div class="meta-val">${new Date(cert.issuedAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div class="seal">
              <span>SECURED</span>
              <span style="font-size: 6px; margin-top: 2px;">BUGARENA</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
  }

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
                  <button
                    onClick={() => handleDownloadPDF(cert)}
                    className="flex-1 py-2 border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all"
                  >
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
