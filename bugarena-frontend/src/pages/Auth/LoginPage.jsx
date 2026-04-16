import { useState, useEffect } from 'react'
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
  const [rememberMe, setRememberMe] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const savedPassword = localStorage.getItem('rememberedPassword')
    if (savedEmail && savedPassword) {
      setValue('email', savedEmail)
      setValue('password', savedPassword)
      setRememberMe(true)
    }
  }, [setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email)
        localStorage.setItem('rememberedPassword', data.password)
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedPassword')
      }
      const res = await loginApi(data)
      const { user, accessToken } = res.data.data
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 bg-surface-container border-outline-variant/20 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-[10px] font-mono text-secondary uppercase tracking-[0.1em] cursor-pointer">
                  Save Credentials
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : 'Execute Login'}
              </button>
            </form>

            {/* Test Credentials Set */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                className="group flex items-center justify-center bg-surface-container-low border border-outline-variant/20 p-2.5 hover:border-secondary/50 transition-all"
                onClick={() => {
                  setValue('email', 'hunter1@bugarena.com')
                  setValue('password', 'Hunter@123')
                }}
              >
                <span className="font-mono text-[10px] uppercase font-bold text-secondary">Demo Hunter</span>
              </button>
              <button
                type="button"
                className="group flex items-center justify-center bg-surface-container-low border border-outline-variant/20 p-2.5 hover:border-secondary/50 transition-all"
                onClick={() => {
                  setValue('email', 'owner1@bugarena.com')
                  setValue('password', 'Owner@123')
                }}
              >
                <span className="font-mono text-[10px] uppercase font-bold text-secondary">Demo Owner</span>
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
