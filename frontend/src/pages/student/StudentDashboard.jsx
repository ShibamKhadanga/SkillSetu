import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, ClipboardList, ArrowRight,
  Zap, Map, FileText, Mic, ChevronRight,
  Target, Clock, CheckCircle2, AlertCircle, Sparkles,
  PlusCircle, UserCircle
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'

const Skeleton = ({ className }) => (
  <div className={`skeleton rounded-xl ${className}`} />
)

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="glass-card-hover rounded-2xl p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
        <Icon size={18} style={{ color: 'var(--accent)' }} />
      </div>
      <span className="text-xs font-body px-2 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
        {sub}
      </span>
    </div>
    <p className="font-display font-black text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
    <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
  </div>
)

const QuickAction = ({ to, icon: Icon, title, desc, badge }) => (
  <Link to={to} className="glass-card-hover rounded-2xl p-5 flex items-center gap-4 group">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
      style={{ background: 'var(--accent-light)' }}>
      <Icon size={20} style={{ color: 'var(--accent)' }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</p>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: 'var(--accent)', color: 'white' }}>
            {badge}
          </span>
        )}
      </div>
      <p className="font-body text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </div>
    <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
      style={{ color: 'var(--text-muted)' }} />
  </Link>
)

const JobMatchCard = ({ job }) => (
  <div className="glass-card-hover rounded-2xl p-4">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
        style={{ background: 'var(--accent)' }}>
        {job.company?.[0] || 'C'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{job.title}</p>
        <p className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{job.company} · {job.location}</p>
      </div>
      <span className="text-xs font-body font-semibold px-2 py-1 rounded-lg flex-shrink-0"
        style={{ background: job.match >= 80 ? 'rgba(34,197,94,0.1)' : 'var(--accent-light)', color: job.match >= 80 ? '#22c55e' : 'var(--accent)' }}>
        {job.match}% match
      </span>
    </div>
    <div className="flex flex-wrap gap-1 mb-3">
      {(job.required_skills || job.skills || []).slice(0, 3).map(s => (
        <span key={s} className="text-xs px-2 py-0.5 rounded-lg font-body"
          style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          {s}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between">
      <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{job.salary || 'Salary not specified'}</span>
      <Link to="/student/jobs" className="text-xs font-body font-medium" style={{ color: 'var(--accent)' }}>
        View & Apply →
      </Link>
    </div>
  </div>
)

// ── Empty state for new accounts ──────────────────────────
const EmptyJobMatches = () => (
  <div className="glass-card rounded-2xl p-8 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
      style={{ background: 'var(--accent-light)' }}>
      <Briefcase size={28} style={{ color: 'var(--accent)' }} />
    </div>
    <h4 className="font-display font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
      No job matches yet
    </h4>
    <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
      Add your skills in your profile and AI will match you with the best jobs!
    </p>
    <Link to="/student/profile" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2">
      <PlusCircle size={15} /> Complete Your Profile
    </Link>
  </div>
)

const EmptyActivity = () => (
  <div className="text-center py-6">
    <Clock size={28} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
    <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
      No activity yet. Start by applying to jobs!
    </p>
  </div>
)

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard')
        const d = res.data?.data || res.data
        setData(d)
        // Detect new/empty account
        if (
          !d?.stats?.applications &&
          !d?.stats?.jobMatches &&
          !(d?.skills?.length) &&
          !(d?.jobMatches?.length)
        ) {
          setIsNewUser(true)
        }
      } catch {
        // API failed — show empty state, NOT fake data
        setIsNewUser(true)
        setData({
          stats: { profileStrength: 0, jobMatches: 0, applications: 0, interviews: 0 },
          skills: [],
          suggestedRole: null,
          roadmapProgress: 0,
          jobMatches: [],
          recentActivity: [],
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── New user welcome banner ── */}
      {isNewUser && (
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'var(--accent-light)', border: '2px dashed var(--accent)' }}>
          <UserCircle size={36} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <div className="flex-1">
            <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              👋 Welcome to SkillSetu, {user?.name?.split(' ')[0]}!
            </p>
            <p className="font-body text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Complete your profile to unlock AI job matching, resume builder, and career roadmap.
            </p>
          </div>
          <Link to="/student/profile" className="btn-primary text-sm px-4 py-2 flex-shrink-0">
            Set Up Profile →
          </Link>
        </div>
      )}

      {/* ── Welcome Banner ── */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', boxShadow: '0 8px 32px var(--shadow)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-white/80 text-sm mb-1">Good morning 👋</p>
            <h2 className="font-display font-black text-2xl text-white mb-1">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h2>
            <p className="font-body text-white/80 text-sm">
              {data?.suggestedRole
                ? <>AI suggests you're best suited for: <strong className="text-white">{data.suggestedRole}</strong></>
                : 'Complete your profile to get AI-powered job suggestions!'}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="text-center bg-white/20 backdrop-blur rounded-2xl p-4">
              <p className="font-display font-black text-3xl text-white">{data?.stats?.profileStrength ?? 0}%</p>
              <p className="font-body text-white/80 text-xs">Profile Complete</p>
              <Link to="/student/profile" className="text-white/90 text-xs underline mt-1 inline-block">
                {(data?.stats?.profileStrength ?? 0) < 50 ? 'Complete now →' : 'View profile →'}
              </Link>
            </div>
          </div>
        </div>
        <div className="relative mt-4">
          <div className="h-2 rounded-full bg-white/20">
            <div className="h-2 rounded-full bg-white transition-all duration-1000"
              style={{ width: `${data?.stats?.profileStrength ?? 0}%` }} />
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target}        label="Job Matches"   value={data?.stats?.jobMatches   ?? 0} sub="AI matched" />
        <StatCard icon={ClipboardList} label="Applications"  value={data?.stats?.applications ?? 0} sub="sent" />
        <StatCard icon={Mic}           label="Interviews"    value={data?.stats?.interviews    ?? 0} sub="scheduled" />
        <StatCard icon={Map}           label="Roadmap"       value={`${data?.roadmapProgress  ?? 0}%`} sub="complete" />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Job Matches */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              🎯 Top Job Matches
            </h3>
            <Link to="/student/jobs" className="flex items-center gap-1 text-sm font-body" style={{ color: 'var(--accent)' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {data?.jobMatches?.length > 0
            ? data.jobMatches.map(job => <JobMatchCard key={job.id} job={job} />)
            : <EmptyJobMatches />}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div>
            <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--text-primary)' }}>
              ⚡ Quick Actions
            </h3>
            <div className="space-y-2">
              <QuickAction to="/student/resume"         icon={FileText} title="Build Resume"    desc="AI generates your resume"       badge="AI" />
              <QuickAction to="/student/roadmap"        icon={Map}      title="Career Roadmap"  desc="View your personalized path" />
              <QuickAction to="/student/mock-interview" icon={Mic}      title="Mock Interview"  desc="Practice with AI"               badge="New" />
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                🧠 Your Skills
              </h3>
              <Sparkles size={14} style={{ color: 'var(--accent)' }} />
            </div>
            {data?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="text-xs px-3 py-1 rounded-full font-body font-medium"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                No skills added yet.
              </p>
            )}
            <Link to="/student/profile" className="flex items-center gap-1 text-xs font-body mt-4" style={{ color: 'var(--accent)' }}>
              <Zap size={12} /> {data?.skills?.length > 0 ? 'Add more skills' : 'Add skills to your profile'}
            </Link>
          </div>

          {/* Recent activity */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
              🕐 Recent Activity
            </h3>
            {data?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.map((act, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: act.status === 'done' ? 'rgba(34,197,94,0.1)' : act.status === 'new' ? 'var(--accent-light)' : 'var(--bg-input)' }}>
                      {act.status === 'done'
                        ? <CheckCircle2 size={12} color="#22c55e" />
                        : act.status === 'new'
                        ? <AlertCircle size={12} style={{ color: 'var(--accent)' }} />
                        : <Clock size={12} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs leading-snug" style={{ color: 'var(--text-primary)' }}>{act.text}</p>
                      <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyActivity />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}