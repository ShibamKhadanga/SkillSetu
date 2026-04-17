import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import {
  Zap, Map, FileText, Briefcase, Bell, Users, BarChart3,
  ChevronRight, Star, ArrowRight, Sun, Moon, Menu, X,
  GraduationCap, Building2, CheckCircle2, Sparkles, Globe,
  MessageSquare, Shield, TrendingUp, Award, Play
} from 'lucide-react'

// Particle component
function Particles({ isDark }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 10,
  }))

  if (!isDark) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full opacity-40"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-20px',
            background: '#00ffff',
            boxShadow: '0 0 6px #00ffff',
            animation: `particleFloat ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

// Animated counter
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = Date.now()
          const step = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const features = [
  {
    icon: Map,
    title: 'AI Career Roadmap',
    desc: 'Get a personalized learning path — courses, degrees, exams, and platforms tailored to your dream career.',
    color: 'from-orange-400 to-orange-600',
    darkColor: 'from-cyan-400 to-cyan-600',
  },
  {
    icon: FileText,
    title: 'Smart Resume Builder',
    desc: 'AI extracts your skills from projects, degrees, and certificates to auto-generate a professional resume.',
    color: 'from-orange-500 to-red-500',
    darkColor: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Briefcase,
    title: 'One-Click Apply',
    desc: 'Apply to jobs instantly. Our AI auto-fills every application form — no more repetitive data entry.',
    color: 'from-amber-400 to-orange-500',
    darkColor: 'from-teal-400 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'Skill Gap Analyzer',
    desc: 'Compare your current skills vs job requirements. Know exactly what to learn next.',
    color: 'from-orange-400 to-amber-500',
    darkColor: 'from-cyan-400 to-blue-400',
  },
  {
    icon: MessageSquare,
    title: 'AI Mock Interviews',
    desc: 'Practice with role-specific AI interviews. Get instant feedback to ace the real thing.',
    color: 'from-red-400 to-orange-500',
    darkColor: 'from-blue-400 to-cyan-400',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Get WhatsApp & SMS alerts when recruiters message you. Never miss an opportunity.',
    color: 'from-orange-600 to-red-600',
    darkColor: 'from-cyan-600 to-teal-600',
  },
]

const steps = [
  { step: '01', title: 'Create Profile', desc: 'Upload your documents, projects, and achievements. Google Sign-In supported.' },
  { step: '02', title: 'AI Builds Your Profile', desc: 'Our AI extracts your skills, generates your resume, and builds a career roadmap.' },
  { step: '03', title: 'Discover Opportunities', desc: 'Get matched with companies actively hiring for your skill set.' },
  { step: '04', title: 'Apply in One Click', desc: 'AI fills every application form. Review, edit, and send in seconds.' },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at TCS', avatar: 'PS', text: 'SkillSetu helped me land my dream job! The roadmap feature showed me exactly what skills I needed and the one-click apply saved me hours.', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Analyst at Infosys', avatar: 'RV', text: 'The AI resume builder is incredible. It found skills in my projects I didn\'t even know were marketable. Got 3 interview calls in a week!', rating: 5 },
  { name: 'Anjali Singh', role: 'HR Manager, StartupXYZ', avatar: 'AS', text: 'As a recruiter, finding qualified candidates used to take weeks. SkillSetu\'s AI matching sends us perfect candidates in hours.', rating: 5 },
]

const stats = [
  { value: 50000, suffix: '+', label: 'Students Placed' },
  { value: 2500, suffix: '+', label: 'Partner Companies' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  { value: 15, suffix: 'x', label: 'Faster Hiring' },
]

export default function Landing() {
  const { isDark, toggleTheme } = useThemeStore()
  const navigate                = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`} style={{ background: 'var(--bg-primary)' }}>
      <Particles isDark={isDark} />

      {/* ===== NAVBAR ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--navbar-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-lg transition-all duration-300 group-hover:scale-110"
                style={{ background: 'var(--accent)', boxShadow: '0 4px 15px var(--shadow)', color: 'var(--neon-box-text)' }}
              >
                S
              </div>
              <div>
                <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  Skill<span style={{ color: 'var(--accent)' }}>Setu</span>
                </span>
                <p className="text-xs font-body leading-none" style={{ color: 'var(--text-muted)' }}>
                  Kaushal se Rojgar tak
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How it Works', 'For Recruiters', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-body text-sm transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseOver={e => e.target.style.color = 'var(--accent)'}
                  onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link to="/login" className="hidden md:block btn-ghost text-sm">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              <button
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t" style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border-subtle)' }}>
            <div className="px-4 py-4 flex flex-col gap-4">
              {['Features', 'How it Works', 'For Recruiters', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-body text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <Link to="/login" className="flex-1 btn-outline text-sm text-center py-2">Sign In</Link>
                <Link to="/register" className="flex-1 btn-primary text-sm text-center py-2">Register</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
            style={{
              background: isDark ? 'radial-gradient(circle, #00ffff, transparent)' : 'radial-gradient(circle, #f97316, transparent)',
              top: '10%',
              right: '10%',
            }}
          />
          <div
            className="absolute w-72 h-72 rounded-full opacity-15 blur-3xl animate-float"
            style={{
              background: isDark ? 'radial-gradient(circle, #06b6d4, transparent)' : 'radial-gradient(circle, #ea580c, transparent)',
              bottom: '20%',
              left: '5%',
              animationDelay: '3s',
            }}
          />
          {isDark && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-medium mb-8 animate-on-load"
            style={{
              background: 'var(--accent-light)',
              border: '1px solid var(--border)',
              color: 'var(--accent)',
            }}
          >
            <Sparkles size={12} />
            <span>AI-Powered Career Platform for Bharat</span>
            <Sparkles size={12} />
          </div>

          <h1 className="font-display font-black leading-tight mb-6 animate-on-load delay-100"
            style={{ color: 'var(--text-primary)' }}>
            <span className="block text-4xl sm:text-5xl md:text-7xl">Kaushal se</span>
            <span
              className="block text-5xl sm:text-6xl md:text-8xl mt-2"
              style={{ color: 'var(--accent)', textShadow: isDark ? '0 0 40px rgba(0,255,255,0.5)' : '0 4px 20px rgba(249,115,22,0.3)' }}
            >
              Rojgar tak
            </span>
          </h1>

          <p
            className="max-w-2xl mx-auto text-lg md:text-xl font-body leading-relaxed mb-10 animate-on-load delay-200"
            style={{ color: 'var(--text-secondary)' }}
          >
            India's smartest career bridge. AI builds your roadmap, crafts your resume,
            matches you to dream jobs, and fills application forms — automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-on-load delay-300">
            <Link to="/register?role=student" className="btn-primary flex items-center gap-2 text-base px-8 py-4 rounded-2xl">
              <GraduationCap size={20} />
              I'm a Student
              <ArrowRight size={16} />
            </Link>
            <Link to="/register?role=recruiter" className="btn-outline flex items-center gap-2 text-base px-8 py-4 rounded-2xl">
              <Building2 size={20} />
              I'm a Recruiter
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 animate-on-load delay-400">
            {[
              { icon: Shield, text: '100% Free for Students' },
              { icon: Globe, text: 'Pan-India Platform' },
              { icon: Award, text: 'SIH Winner' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-body" style={{ color: 'var(--text-muted)' }}>
                <Icon size={14} style={{ color: 'var(--accent)' }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 border-y" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map(({ value, suffix, label }) => (
              <div key={label} className="text-center px-2">
                <div
                  className="font-display font-black text-2xl sm:text-3xl md:text-5xl mb-2 leading-none"
                  style={{ color: 'var(--accent)' }}
                >
                  <Counter target={value} suffix={suffix} />
                </div>
                <p className="font-body text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-body font-medium mb-3 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Everything you need
            </p>
            <h2 className="section-title mb-4">Packed with AI Superpowers</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From roadmap to resume to placement — SkillSetu handles every step of your career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, darkColor }, i) => (
              <div
                key={title}
                className="glass-card-hover rounded-2xl p-6 cursor-pointer group animate-on-load"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isDark ? darkColor : color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} style={{ color: 'var(--neon-box-text)' }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-body font-medium mb-3 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Simple process
            </p>
            <h2 className="section-title mb-4">From Zero to Hired in 4 Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 left-full w-full h-px z-10"
                    style={{ background: 'var(--border)', transform: 'translateX(-50%)' }}
                  />
                )}
                <div className="glass-card rounded-2xl p-6 relative z-20">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl mb-4"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1.5px solid var(--border)' }}
                  >
                    {step}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR RECRUITERS ===== */}
      <section id="for-recruiters" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-body font-medium mb-3 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                For Recruiters
              </p>
              <h2 className="section-title mb-6">Find Perfect Candidates, Faster</h2>
              <p className="section-subtitle mb-8">
                Post a job in minutes. Our AI instantly shortlists matching candidates ranked by compatibility score.
              </p>
              {[
                'Post jobs with detailed requirements',
                'AI ranks candidates 1-100 by match score',
                'View complete resumes and portfolios',
                'Message candidates within the platform',
                'Schedule interviews with built-in calendar',
                'Track all applications in one dashboard',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
              <Link to="/register?role=recruiter" className="btn-primary inline-flex items-center gap-2 mt-8">
                Start Hiring Free
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'AI Candidate Ranking', value: '98% match accuracy' },
                { icon: BarChart3, label: 'Analytics Dashboard', value: 'Real-time insights' },
                { icon: MessageSquare, label: 'In-platform Chat', value: 'Instant messaging' },
                { icon: TrendingUp, label: 'Hiring Analytics', value: 'Conversion tracking' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass-card-hover rounded-2xl p-5 text-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                    {label}
                  </p>
                  <p className="font-body text-xs" style={{ color: 'var(--accent)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Loved by Students & Recruiters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, avatar, text, rating }) => (
              <div key={name} className="glass-card-hover rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-current" style={{ color: 'var(--accent)' }} />
                  ))}
                </div>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                    style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</p>
                    <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,180,216,0.05))'
                : 'linear-gradient(135deg, #fff7ed, #ffedd5)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              className="absolute inset-0 opacity-30 rounded-3xl"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at 50% 0%, rgba(0,255,255,0.2), transparent 70%)'
                  : 'radial-gradient(circle at 50% 0%, rgba(249,115,22,0.2), transparent 70%)',
              }}
            />
            <div className="relative">
              <h2 className="font-display font-black text-4xl md:text-5xl mb-4" style={{ color: 'var(--text-primary)' }}>
                Your career starts here
              </h2>
              <p className="section-subtitle mb-8 max-w-xl mx-auto">
                Join 50,000+ students who found their dream jobs through SkillSetu.
                It's free for students — forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register?role=student" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl">
                  <Zap size={18} />
                  Start Your Journey — Free
                </Link>
                <Link to="/register?role=recruiter" className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-4 rounded-2xl">
                  <Building2 size={18} />
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black"
                style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}
              >
                S
              </div>
              <div>
                <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  Skill<span style={{ color: 'var(--accent)' }}>Setu</span>
                </span>
                <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>Kaushal se Rojgar tak</p>
              </div>
            </div>
            <p className="font-body text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              © SkillSetu. Made with ❤️ in Bharat. Built for SIH 2026.
            </p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-body text-sm transition-colors duration-200"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseOver={e => e.target.style.color = 'var(--accent)'}
                  onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}