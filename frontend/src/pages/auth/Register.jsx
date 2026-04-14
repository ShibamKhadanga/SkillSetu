import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, Building2, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { signInWithGoogle } from '@/config/firebase'
import toast from 'react-hot-toast'

export default function Register() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'student')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser, googleLogin } = useAuthStore()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await registerUser({ ...data, role })
      toast.success('Account created! Welcome to SkillSetu 🎉')
      navigate(role === 'student' ? '/student' : '/recruiter')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithGoogle()
      const idToken = await result.user.getIdToken()
      const res = await googleLogin(idToken)
      toast.success('Account created with Google!')
      navigate(res.user.role === 'student' ? '/student/profile' : '/recruiter')
    } catch (err) {
      toast.error('Google sign-up failed')
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'dark' : ''}`}
      style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-white text-xl"
            style={{ background: 'var(--accent)' }}>S</div>
          <span className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Skill<span style={{ color: 'var(--accent)' }}>Setu</span>
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Create your account
        </h2>
        <p className="font-body text-sm mb-6 text-center" style={{ color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>

        {/* Role Selector */}
        <div className="flex gap-3 mb-6 p-1 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
          {[
            { id: 'student', label: 'Student / Candidate', icon: GraduationCap },
            { id: 'recruiter', label: 'Recruiter / Company', icon: Building2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setRole(id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-body font-medium text-sm transition-all duration-200"
              style={role === id ? {
                background: 'var(--accent)',
                color: 'white',
                boxShadow: '0 4px 12px var(--shadow)',
              } : {
                color: 'var(--text-muted)',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-body font-medium text-sm transition-all duration-200 mb-5"
          style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border-subtle)', color: 'var(--text-primary)' }}
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

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>or register with email</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('name', { required: 'Name is required' })}
                  placeholder="Rahul Sharma" className="input-field pl-9 text-sm" />
              </div>
              {errors.name && <p className="text-xs mt-1 text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>@</span>
                <input {...register('username', { required: 'Username is required', pattern: { value: /^[a-z0-9_]+$/, message: 'Lowercase, numbers, underscore only' } })}
                  placeholder="rahul_sharma" className="input-field pl-7 text-sm" />
              </div>
              {errors.username && <p className="text-xs mt-1 text-red-500">{errors.username.message}</p>}
            </div>
          </div>

          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                type="email" placeholder="you@example.com" className="input-field pl-9 text-sm" />
            </div>
            {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone (for WhatsApp alerts)</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit Indian number' } })}
                type="tel" placeholder="9876543210" className="input-field pl-9 text-sm" />
            </div>
            {errors.phone && <p className="text-xs mt-1 text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" className="input-field pl-9 pr-10 text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs mt-1 text-red-500">{errors.password.message}</p>}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input {...register('terms', { required: true })} type="checkbox" className="mt-0.5 rounded" />
            <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
              I agree to the <a href="#" style={{ color: 'var(--accent)' }}>Terms of Service</a> and{' '}
              <a href="#" style={{ color: 'var(--accent)' }}>Privacy Policy</a>. I consent to receive WhatsApp and SMS notifications.
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-500">You must agree to terms</p>}

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl disabled:opacity-60">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Zap size={16} />
                Create Account — It's Free
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
