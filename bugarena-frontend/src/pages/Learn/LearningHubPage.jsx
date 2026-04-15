import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'

const ROADMAP = [
  { label: 'Web Fundamentals', active: true },
  { label: 'OWASP Top 10', active: true },
  { label: 'Bug Hunting Basics', active: true },
  { label: 'Advanced Recon', active: false },
  { label: 'Elite Exploitation', active: false },
]

const RESOURCES = [
  { name: 'PortSwigger Academy', desc: 'Free web security training', icon: 'school', url: 'https://portswigger.net' },
  { name: 'HackTheBox', desc: 'Hands-on cybersecurity labs', icon: 'sports_esports', url: 'https://hackthebox.com' },
  { name: 'TryHackMe', desc: 'Learning paths for all levels', icon: 'route', url: 'https://tryhackme.com' },
]

const WRITEUPS = [
  { title: 'Critical XSS in OAuth Flow', author: 'zerodayx', type: 'XSS', likes: 342, date: '2024-06-15' },
  { title: 'SSRF to RCE via Cloud Metadata', author: 'infosec_alice', type: 'SSRF', likes: 891, date: '2024-07-02' },
  { title: 'SQL Injection via GraphQL', author: 'h4ck3r_bob', type: 'SQL Injection', likes: 567, date: '2024-07-18' },
]

export default function LearningHubPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
            Learning <span className="text-primary">Hub</span>
          </h1>
          <p className="text-on-surface-variant font-mono text-xs mb-10 uppercase tracking-widest">
            Skill roadmaps, resources & community writeups
          </p>

          {/* Roadmap */}
          <div className="bg-surface-container-low p-8 border-t border-white/5 mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-6">Learning Roadmap</p>
            <div className="flex items-center gap-0 overflow-x-auto">
              {ROADMAP.map((step, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      step.active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {step.active ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                    </div>
                    <p className={`font-mono text-[9px] uppercase text-center mt-2 max-w-[80px] ${step.active ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {step.label}
                    </p>
                  </div>
                  {i < ROADMAP.length - 1 && (
                    <div className={`w-16 h-[1px] mx-1 mb-5 ${step.active && ROADMAP[i + 1]?.active ? 'bg-primary/40' : 'bg-white/5'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Curated Resources</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RESOURCES.map(({ name, desc, icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-surface-container-high p-6 border border-white/5 hover:bg-surface-container-highest hover:-translate-y-1 transition-all group block"
                >
                  <span className="material-symbols-outlined text-secondary text-2xl mb-3 block">{icon}</span>
                  <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors mb-1">{name}</h3>
                  <p className="font-mono text-xs text-on-surface-variant mb-4">{desc}</p>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest flex items-center gap-1">
                    Open <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Writeups */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Community Writeups</p>
            <div className="space-y-3">
              {WRITEUPS.map(({ title, author, type, likes, date }) => (
                <div key={title} className="bg-surface-container-high p-6 border border-white/5 hover:bg-surface-container-highest transition-all group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors mb-1">{title}</h4>
                      <div className="flex items-center gap-3 font-mono text-[10px] text-on-surface-variant">
                        <span>@{author}</span>
                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary">{type}</span>
                        <span>{date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-mono text-xs">
                      <span className="material-symbols-outlined text-base">favorite</span>
                      <span>{likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
