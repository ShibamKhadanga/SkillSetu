import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { signInWithGoogle } from '@/config/firebase'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, googleLogin } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await login(data.email, data.password)
      toast.success(`Welcome back, ${res.user.name}!`)
      navigate(res.user.role === 'student' ? '/student' : '/recruiter')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle()
      const idToken = await result.user.getIdToken()
      const res = await googleLogin(idToken)
      toast.success('Logged in with Google!')
      navigate(res.user.role === 'student' ? '/student' : '/recruiter')
    } catch (err) {
      toast.error('Google sign-in failed')
    }
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark' : ''}`} style={{ background: 'var(--bg-primary)' }}>
      {/* Left panel - decorative */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #060b14, #0a0f1e)'
            : 'linear-gradient(135deg, #fff7ed, #ffedd5)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle at 50% 50%, rgba(0,255,255,0.15), transparent 70%)'
              : 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.2), transparent 70%)',
          }}
        />
        <div className="relative text-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center font-display font-black text-5xl mx-auto mb-8 animate-float"
            style={{ background: 'var(--accent)', boxShadow: '0 20px 60px var(--shadow)', color: 'var(--neon-box-text)' }}
          >
            S
          </div>
          <h1 className="font-display font-black text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
            SkillSetu
          </h1>
          <p className="font-body text-lg mb-8" style={{ color: 'var(--accent)' }}>
            Kaushal se Rojgar tak
          </p>
          <p className="font-body text-base max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Your AI-powered career bridge. From skills to your dream job — all in one place.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xl"
              style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}
            >S</div>
            <span className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              Skill<span style={{ color: 'var(--accent)' }}>Setu</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back 👋
          </h2>
          <p className="font-body text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" className="font-medium" style={{ color: 'var(--accent)' }}>Create one free</Link>
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-body font-medium text-sm transition-all duration-200 mb-6"
            style={{
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-body text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
              </label>
              <a href="#" className="font-body text-sm" style={{ color: 'var(--accent)' }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
