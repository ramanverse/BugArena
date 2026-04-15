import { Link } from 'react-router-dom'

const HUNTER_LINKS = ['Bug Bounty Programs', 'Hall of Fame', 'Leaderboard', 'Learning Hub', 'Certificates', 'Community Forum']
const BUSINESS_LINKS = ['Launch a Program', 'Pricing', 'Security Audit', 'Enterprise', 'API Access', 'Documentation']
const SOCIAL_ICONS = ['twitter', 'discord', 'github']

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">shield_with_heart</span>
              <span className="text-xl font-bold text-primary uppercase tracking-tighter font-headline">BugArena</span>
            </div>
            <p className="text-on-surface-variant text-xs font-mono leading-relaxed">
              The premier platform for security researchers to hunt bugs, earn rewards, and build their careers in cybersecurity.
            </p>
            <div className="flex gap-2">
              {SOCIAL_ICONS.map((icon) => (
                <button
                  key={icon}
                  className="w-9 h-9 bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-base">
                    {icon === 'github' ? 'code' : icon === 'twitter' ? 'alternate_email' : 'forum'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* For Hunters */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-6">For Hunters</p>
            <ul className="space-y-3">
              {HUNTER_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-on-surface-variant text-xs font-mono hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-6">For Business</p>
            <ul className="space-y-3">
              {BUSINESS_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-on-surface-variant text-xs font-mono hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status block */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-6">System Status</p>
            <div className="bg-surface-container-high p-4 border-l-2 border-primary space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest">All Systems Operational</span>
              </div>
              <div className="border-t border-white/5 pt-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant">API Latency</span>
                  <span className="font-mono text-[10px] text-primary">104ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant">Threat Level</span>
                  <span className="font-mono text-[10px] text-secondary">ELEVATED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.6rem] text-outline-variant uppercase tracking-widest">
            © {new Date().getFullYear()} BugArena Platform. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Responsible Disclosure'].map((link) => (
              <Link
                key={link}
                to="#"
                className="font-mono text-[0.6rem] text-outline-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
