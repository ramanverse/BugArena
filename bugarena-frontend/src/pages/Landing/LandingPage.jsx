import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import Avatar from '../../components/ui/Avatar'
import { getStats } from '../../api/admin.api'
import { getPrograms } from '../../api/program.api'
import { getLeaderboard } from '../../api/leaderboard.api'

const FAQ_ITEMS = [
  {
    q: 'How are payments processed?',
    a: 'All bounty payments are processed via Stripe or bank transfer within 14 business days of report acceptance. Tax documents are provided automatically.',
  },
  {
    q: 'Is my data encrypted?',
    a: 'Yes. All data is encrypted at rest with AES-256 and in transit via TLS 1.3. Reports are end-to-end encrypted between hunter and program owner.',
  },
  {
    q: 'Can I hunt if I\'m under 18?',
    a: 'You must be 18+ to receive payments. Hunters under 18 may participate with parental consent but earnings are held until they reach legal age.',
  },
  {
    q: 'What defines a \'Critical\' bug?',
    a: 'Critical bugs have a CVSS score of 9.0+. These typically include RCE, full auth bypass, or vulnerabilities exposing PII of 1M+ users.',
  },
  {
    q: 'How do I join private programs?',
    a: 'Private programs are invite-only based on your reputation score, past submissions, and skill certifications. Build your profile to unlock invitations.',
  },
]

const STEPS = [
  { num: '01', title: 'Create Your Operator Profile', desc: 'Register, verify your identity, and set up your hunter profile with skills and certifications.' },
  { num: '02', title: 'Select Your Target', desc: 'Browse approved programs, review scope definitions, and identify high-value attack surfaces.' },
  { num: '03', title: 'Submit Your Report', desc: 'Document your findings with our structured template. Include PoC, CVSS score, and remediation advice.' },
  { num: '04', title: 'Collect Your Bounty', desc: 'Reports are triaged within 104ms average. Approved bugs earn rewards up to $100k+.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getStats().then((r) => r.data),
    staleTime: 60000,
  })

  const { data: programsData } = useQuery({
    queryKey: ['featured-programs'],
    queryFn: () => getPrograms({ limit: 6, isApproved: true }).then((r) => r.data),
    staleTime: 60000,
  })

  const { data: leaderboardData } = useQuery({
    queryKey: ['top-hunters'],
    queryFn: () => getLeaderboard({ limit: 5 }).then((r) => r.data),
    staleTime: 60000,
  })

  const stats = statsData?.stats || {}
  const programs = programsData?.programs || []
  const hunters = leaderboardData?.users || []

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-on-surface">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="min-h-[921px] flex flex-col items-center justify-center text-center px-6 pt-[52px] relative overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(164,255,185,0.05) 0%, transparent 70%)',
          }}
        >
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-white/5 text-primary text-[0.68rem] font-mono tracking-widest uppercase mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            System Status: Operational // Signal Found
          </div>

          {/* H1 */}
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-on-surface leading-[0.9] glitch-text mb-8 max-w-4xl">
            Hunt Bugs.
            <br />
            Earn Rewards.
            <br />
            <span className="text-primary italic">Build Your Career.</span>
          </h1>

          {/* Terminal line */}
          <div className="flex items-center gap-2 font-mono text-on-surface-variant text-lg mb-10">
            <span className="text-primary">&gt;</span>
            <span>Initializing hunting protocols</span>
            <span className="border-r-2 border-primary pr-1 animate-pulse">...</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-3.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform duration-200">terminal</span>
              Start Hunting
            </Link>
            <Link
              to="/programs"
              className="px-8 py-3.5 border border-outline-variant text-on-surface hover:bg-white/5 font-bold uppercase tracking-widest text-sm transition-all duration-200"
            >
              View Bounties
            </Link>
          </div>

          {/* Live Stats Bar */}
          <div className="mt-24 max-w-6xl w-full grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {[
              { value: stats.totalBounties ? `$${(stats.totalBounties / 1000000).toFixed(1)}M` : '$4.2M', label: 'Total Bounties Paid' },
              { value: stats.criticalBugs || '12,842', label: 'Critical Bugs Patched' },
              { value: stats.activePrograms ? `${stats.activePrograms}+` : '850+', label: 'Active Programs' },
              { value: stats.avgTriageMs ? `${stats.avgTriageMs}ms` : '104ms', label: 'Avg Triage Time' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-surface-dim p-6 text-center">
                <div className="font-mono text-primary text-3xl font-bold mb-1">{value}</div>
                <div className="text-on-surface-variant text-xs uppercase tracking-widest font-mono">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Programs ─────────────────────────────────── */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">High-Yield Programs</p>
                <h2 className="text-4xl font-headline font-bold tracking-tighter text-on-surface">
                  Active Target Pool
                </h2>
                <p className="font-mono text-on-surface-variant text-sm mt-2">
                  Top-paying programs accepting submissions right now
                </p>
              </div>
              <Link
                to="/programs"
                className="text-primary font-mono text-sm border-b border-primary/20 hover:border-primary transition-colors pb-0.5 hidden md:block"
              >
                VIEW ALL TARGETS &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 — Feature hero */}
              <div className="md:col-span-2 h-[450px] relative overflow-hidden bg-surface-container-high group border border-white/5">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: 'url("/images/landing/techcorp-bg.png")',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="w-20 h-20 bg-[#121212] rounded-sm p-1 mb-6 flex items-center justify-center border border-white/10 shadow-2xl">
                    <img 
                      src="/images/landing/techcorp-logo.png" 
                      alt="TechCorp Global Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                      {programs[0]?.name || 'TechCorp Global'}
                    </h3>
                    <span className="text-[#a4ffb9] font-mono text-[10px] font-bold tracking-widest uppercase py-0.5 px-2 bg-[#a4ffb9]/10 border border-[#a4ffb9]/20">
                      Top Tier Partner
                    </span>
                  </div>
                  
                  <p className="text-on-surface-variant font-mono text-sm mb-8 max-w-xl leading-relaxed">
                    {programs[0]?.description || 'Enterprise vulnerability disclosure program covering all production assets and customer-facing infrastructure. Focus on edge computing vulnerabilities and data isolation leaks.'}
                  </p>
                  
                  <div className="flex items-center gap-12 pt-6 border-t border-white/10">
                    <div>
                      <div className="font-mono text-[#a4ffb9] font-bold text-2xl tracking-tight">
                        UP TO ${programs[0]?.maxReward ? (programs[0].maxReward).toLocaleString() : '100,000'}
                      </div>
                      <div className="font-mono text-on-surface-variant text-[10px] uppercase tracking-[0.2em] mt-1">
                        Max Critical Bounty
                      </div>
                    </div>
                    
                    <div className="w-px h-10 bg-white/5" />
                    
                    <div>
                      <div className="font-mono text-on-surface font-bold text-2xl tracking-tight">
                        24H
                      </div>
                      <div className="font-mono text-on-surface-variant text-[10px] uppercase tracking-[0.2em] mt-1">
                        Avg Response
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards 2-3 */}
              {[programs[1], programs[2]].map((p, i) => (
                <div
                  key={i}
                  className="h-[350px] relative overflow-hidden bg-surface-container-high group border border-white/5"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url("/images/landing/security-corp-${i + 2}-bg.png")`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-headline font-bold text-xl text-on-surface">
                        {p?.name || `Security Corp ${i + 2}`}
                      </h3>
                      <span className="text-secondary font-mono text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 bg-secondary/10 border border-secondary/20">
                        {p?.difficulty || 'Advanced'}
                      </span>
                    </div>
                    <p className="font-mono text-[#a4ffb9] font-bold text-lg mb-6">
                      UP TO ${p?.maxReward ? (p.maxReward / 1000).toFixed(0) : '50'}k
                    </p>
                    <Link
                      to={`/programs/${p?.slug || '#'}`}
                      className="block w-full py-2.5 text-center border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all"
                    >
                      HUNT TARGET
                    </Link>
                  </div>
                </div>
              ))}

              {/* Cards 4-5 */}
              {[programs[3], programs[4]].map((p, i) => (
                <div
                  key={i + 3}
                  className="h-[350px] relative overflow-hidden bg-surface-container-high group border border-white/5"
                >
                  {i === 0 ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ 
                        backgroundImage: 'url("/images/landing/bounty-target-4-bg.png")',
                      }}
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-[#ff5252]/20 via-background to-background transition-transform duration-700 group-hover:scale-110"
                      style={{ 
                        background: 'radial-gradient(circle at top left, rgba(255, 82, 82, 0.15), transparent 70%)',
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-headline font-bold text-xl text-on-surface">
                        {p?.name || `BountyTarget ${i + 4}`}
                      </h3>
                      <span className="text-primary font-mono text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 bg-primary/10 border border-primary/20">
                        {p?.difficulty || 'Entry'}
                      </span>
                    </div>
                    <p className="font-mono text-[#a4ffb9] font-bold text-lg mb-6">
                      UP TO ${p?.maxReward ? (p.maxReward / 1000).toFixed(0) : '25'}k
                    </p>
                    <Link
                      to={`/programs/${p?.slug || '#'}`}
                      className="block w-full py-2.5 text-center border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest transition-all"
                    >
                      HUNT TARGET
                    </Link>
                  </div>
                </div>
              ))}

              {/* Elite Invitation Pool card */}
              <div className="md:col-span-2 bg-gradient-to-br from-primary/20 via-surface-container-high to-surface-container-high border-l-2 border-primary p-8 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">Exclusive Access</p>
                  <h3 className="font-headline font-bold text-3xl text-on-surface mb-3">Elite Invitation Pool</h3>
                  <p className="text-on-surface-variant font-mono text-sm mb-6 max-w-sm">
                    Reserved for top-ranked hunters. Programs with $100k+ rewards and classified scope definitions.
                  </p>
                  <Link
                    to="/register"
                    className="inline-block px-6 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all"
                  >
                    REQUEST ADMISSION
                  </Link>
                </div>
                <div className="hidden lg:flex items-center justify-center w-32 h-32 bg-primary/10">
                  <span className="material-symbols-outlined text-primary text-6xl">security</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Protocol Overview</p>
              <h2 className="text-5xl font-headline font-bold tracking-tighter text-on-surface mb-12 leading-tight">
                The Pipeline To
                <br />
                Professional{' '}
                <span className="text-primary italic">Discovery</span>
              </h2>
              <div className="space-y-10">
                {STEPS.map(({ num, title, desc }) => (
                  <div key={num} className="group flex gap-6 cursor-default">
                    <span className="text-4xl font-mono font-bold text-outline-variant group-hover:text-primary transition-colors duration-300 shrink-0 leading-none pt-1">
                      {num}
                    </span>
                    <div>
                      <h3 className="font-headline font-bold text-lg text-on-surface mb-1">{title}</h3>
                      <p className="text-on-surface-variant text-sm font-mono leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Terminal mockup */}
            <div className="bg-surface-container-high border border-white/5 p-4">
              {/* Traffic lights */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-error/50" />
                <div className="w-3 h-3 rounded-full bg-secondary/50" />
                <div className="w-3 h-3 rounded-full bg-primary/50" />
                <span className="ml-4 font-mono text-[0.6rem] uppercase tracking-widest text-on-surface-variant">
                  Report_Terminal_v2.0
                </span>
              </div>

              <div className="bg-surface-container-lowest p-4 space-y-3">
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="text-primary">hunter@bugarena</span>
                  <span className="text-on-surface-variant">:</span>
                  <span className="text-secondary">~/reports</span>
                  <span className="text-on-surface-variant">$</span>
                  <span className="text-on-surface ml-1">submit --target paypal.com</span>
                </div>

                <div className="bg-surface-container p-3 border-l-2 border-primary space-y-2 font-mono text-xs">
                  <p className="text-primary font-bold">⚠ CRITICAL severity detected</p>
                  <p className="text-on-surface-variant">CVSS Score: 9.8 // RCE via deserialization</p>
                  <p className="text-on-surface-variant">Affected: api.paypal.com/v2/checkout</p>
                  <p className="text-secondary">Estimated Reward: $25,000 – $50,000</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Attach PoC', 'Preview Report', 'CVSS Calculator', 'Submit Encrypted'].map((item) => (
                    <div
                      key={item}
                      className="bg-surface-container p-2.5 flex items-center gap-2 cursor-pointer hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-secondary text-sm">add_circle</span>
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hall of Fame ─────────────────────────────────────── */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Top Operators</p>
              <h2 className="text-5xl font-headline font-bold tracking-tighter text-on-surface">Hall of Fame</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5">
              {(hunters.length ? hunters : Array(5).fill(null)).map((hunter, i) => (
                <div
                  key={i}
                  className="bg-surface-dim p-8 space-y-4 group cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <div className="relative inline-block mb-4">
                    {i === 0 && (
                      <div className="absolute inset-0 bg-primary/20 blur-md group-hover:blur-xl transition-all duration-500 rounded-xl" />
                    )}
                    <Avatar
                      name={hunter?.name || `Hunter_${String.fromCharCode(65 + i)}`}
                      src={`/images/avatars/hunter${i + 1}.jpg`}
                      size={i === 0 ? 'xl' : 'lg'}
                      className={i === 0 ? 'border-2 border-primary' : 'border-2 border-outline-variant grayscale group-hover:grayscale-0 transition-all'}
                    />
                  </div>

                  <div>
                    <h3 className={`font-headline font-bold ${i === 0 ? 'text-xl' : 'text-lg'} text-on-surface`}>
                      {hunter?.name || `Hunter_${String.fromCharCode(65 + i)}`}
                    </h3>
                    {i === 0 ? (
                      <>
                        <p className="text-primary font-mono text-xs mt-1">RANK #1 GLOBAL</p>
                        <div className="flex gap-1 mt-2">
                          {[0, 1, 2].map((j) => (
                            <span key={j} className="material-symbols-outlined text-primary text-sm">military_tech</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-on-surface-variant font-mono text-xs mt-1">
                          RANK #{i + 1} GLOBAL
                        </p>
                        <p className="text-outline-variant font-mono text-xs mt-1">
                          {hunter?.totalBounties
                            ? `$${(hunter.totalBounties / 1000).toFixed(0)}k earned`
                            : `${(5 - i) * 12}k earned`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20">
            {/* Left — sticky */}
            <div className="md:w-1/3 md:sticky md:top-24 self-start">
              <p className="font-mono text-sm text-primary uppercase tracking-widest mb-4">Support Docs</p>
              <h2 className="text-5xl font-headline font-bold tracking-tighter text-on-surface mb-4">
                Common
                <br />
                Interrogations
              </h2>
              <p className="text-on-surface-variant font-mono text-sm mb-8">
                Frequently asked questions about the platform, payouts, and security protocols.
              </p>
              <button className="group flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all">
                OPEN TERMINAL SUPPORT
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Right — accordion */}
            <div className="md:w-2/3 space-y-4">
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <div
                  key={i}
                  className={`bg-surface-container p-6 border-l-2 cursor-pointer transition-all duration-300 ${
                    openFaq === i ? 'border-primary' : 'border-transparent hover:border-outline-variant'
                  }`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-on-surface pr-4">{q}</h3>
                    <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                      {openFaq === i ? 'remove' : 'add'}
                    </span>
                  </div>
                  {openFaq === i && (
                    <p className="mt-4 text-on-surface-variant text-sm font-mono leading-relaxed">{a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  )
}
