import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import PageTransition from '../../components/layout/PageTransition'
import { login as loginApi } from '../../api/auth.api'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await loginApi(data)
      const { user, accessToken } = res.data
      login(user, accessToken)
      toast.success('Authentication successful')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">shield_with_heart</span>
            <span className="text-2xl font-bold text-primary uppercase tracking-tighter font-headline">BugArena</span>
          </Link>

          <div className="bg-surface-container-low p-10 border border-outline-variant/10">
            <h1 className="font-headline font-bold text-2xl text-on-surface mb-1">Authenticate Operator</h1>
            <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">
              Enter credentials to access the platform
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                {errors.email && (
                  <p className="mt-1 text-error font-mono text-[10px]">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em]">
                    Cipher (Password)
                  </label>
                  <Link to="/forgot-password" className="text-secondary text-xs hover:underline font-mono">
                    Forgot cipher?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    className="input-field pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-error font-mono text-[10px]">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : 'Execute Login'}
              </button>
            </form>

            {/* OAuth divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="font-mono text-[10px] text-outline-variant uppercase">Or Federate Via</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="group flex items-center justify-center gap-2 bg-surface-container-low border border-outline-variant/20 p-3 hover:bg-white/5 transition-all">
                <svg className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">Google</span>
              </button>
              <button className="group flex items-center justify-center gap-2 bg-surface-container-low border border-outline-variant/20 p-3 hover:bg-white/5 transition-all">
                <svg className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-mono text-[10px] uppercase font-bold text-on-surface-variant group-hover:text-primary transition-colors">GitHub</span>
              </button>
            </div>

            <p className="mt-6 text-center text-[10px] text-on-surface-variant font-mono">
              No account?{' '}
              <Link to="/register" className="text-secondary hover:underline">
                Register →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
