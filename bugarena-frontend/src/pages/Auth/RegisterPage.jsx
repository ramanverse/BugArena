import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import PageTransition from '../../components/layout/PageTransition'
import { register as registerApi } from '../../api/auth.api'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  college: z.string().optional(),
  role: z.enum(['hunter', 'owner']),
})

function getPasswordStrength(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const STRENGTH_LABELS = ['', 'Weak', 'Decent', 'Strong', 'Elite']
const STRENGTH_COLORS = ['', 'bg-error', 'bg-secondary', 'bg-tertiary', 'bg-primary']

export default function RegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [passwordVal, setPasswordVal] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'hunter' },
  })

  const strength = getPasswordStrength(passwordVal)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        fullName: data.name,
        email: data.email,
        password: data.password,
        collegeName: data.college,
        role: data.role === 'owner' ? 'PROGRAM_OWNER' : 'HUNTER'
      }
      await registerApi(payload)
      toast.success('Account initialized. Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-surface-container-low border border-outline-variant/10 overflow-hidden">

          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-surface-container-high p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(135deg,rgba(164,255,185,0.1),rgba(175,136,255,0.1))' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-surface-container-high/80 to-transparent" />

            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-2 mb-10">
                <span className="material-symbols-outlined text-primary text-2xl">shield_with_heart</span>
                <span className="text-xl font-bold text-primary uppercase tracking-tighter font-headline">BugArena</span>
              </Link>
              <h1 className="text-4xl font-headline text-primary tracking-tighter font-bold leading-tight">
                JOIN THE<br />VANGUARD.
              </h1>
              <p className="text-on-surface-variant text-sm font-mono mt-4 leading-relaxed">
                Elite security researchers hunting real vulnerabilities for real rewards. 
                Your skills have value — we make sure companies know it.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {[
                { icon: 'terminal', label: 'SEC_LEVEL: ALPHA' },
                { icon: 'shield', label: 'ENCRYPT_PROTO: AES-256' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-sm">{icon}</span>
                  </div>
                  <span className="font-mono text-xs text-secondary tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7 bg-surface-container p-8 md:p-12 relative">
            {/* Bottom-left decoration */}
            <div className="absolute bottom-4 left-4 hidden xl:block space-y-1 pointer-events-none">
              {['// SYS_AUTH_REQUEST_TOKEN: 0x82A1...', '// LATENCY: 24ms', '// STATUS: AWAITING_INPUT'].map((line) => (
                <p key={line} className="font-mono text-[10px] text-primary/30">{line}</p>
              ))}
            </div>

            <h2 className="font-headline font-bold text-2xl text-on-surface mb-1">Create Operator Account</h2>
            <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">
              Initialize your operator credentials
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Role selector */}
              <div>
                <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-2">
                  Operator Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'hunter', icon: 'radar', label: 'Hunter' },
                    { value: 'owner', icon: 'corporate_fare', label: 'Owner' },
                  ].map(({ value, icon, label }) => (
                    <label
                      key={value}
                      className="relative cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={value}
                        className="peer sr-only"
                        {...register('role')}
                      />
                      <div className="p-4 border border-outline-variant/20 flex items-center gap-3 peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all">
                        <span className={`material-symbols-outlined ${value === 'hunter' ? 'text-secondary' : 'text-outline'} peer-checked:text-secondary`}>
                          {icon}
                        </span>
                        <span className="font-mono text-sm font-bold">{label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">
                  Legal Name / Alias
                </label>
                <input
                  type="text"
                  placeholder="John 'ZeroDay' Doe"
                  className="input-field"
                  {...register('name')}
                />
                {errors.name && <p className="mt-1 text-error font-mono text-[10px]">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">
                  Communication Node (Email)
                </label>
                <input
                  type="email"
                  placeholder="operator@bugarena.io"
                  className="input-field"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-error font-mono text-[10px]">{errors.email.message}</p>}
              </div>

              {/* Password + Strength */}
              <div>
                <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">
                  Cipher (Password)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="input-field"
                  {...register('password')}
                  onChange={(e) => setPasswordVal(e.target.value)}
                />
                {/* Strength bar */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 transition-all duration-300 ${
                        i <= strength ? STRENGTH_COLORS[strength] : 'bg-surface-container-highest'
                      }`}
                    />
                  ))}
                </div>
                {strength > 0 && (
                  <p className="mt-1 font-mono text-[10px] text-on-surface-variant">
                    Strength: <span className="text-primary">{STRENGTH_LABELS[strength]}</span>
                  </p>
                )}
                {errors.password && <p className="mt-1 text-error font-mono text-[10px]">{errors.password.message}</p>}
              </div>

              {/* College */}
              <div>
                <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">
                  Affiliation (College/University)
                </label>
                <input
                  type="text"
                  placeholder="Institute of Cyber Intelligence"
                  className="input-field"
                  {...register('college')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              >
                {loading ? 'Initializing...' : 'Initialize Registration'}
              </button>
            </form>

            {/* OAuth */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="font-mono text-[10px] text-outline-variant uppercase">Or Federate Via</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )},
                { label: 'GitHub', icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                )},
              ].map(({ label, icon }) => (
                <button key={label} className="group flex items-center justify-center gap-2 bg-surface-container-low border border-outline-variant/20 p-3 hover:bg-white/5 transition-all">
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">{icon}</span>
                  <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-[10px] text-on-surface-variant font-mono text-center">
              By registering you agree to our{' '}
              <Link to="#" className="text-secondary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-secondary hover:underline">Privacy Policy</Link>
            </p>

            <p className="mt-2 text-center text-[10px] text-on-surface-variant font-mono">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:underline">Login →</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
