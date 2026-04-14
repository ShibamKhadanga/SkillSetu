import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Briefcase, ClipboardList, TrendingUp,
  ArrowRight, Eye, MessageSquare, PlusCircle, Building2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'

const Skeleton = ({ className }) => (
  <div className={`skeleton rounded-xl ${className}`} />
)

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="glass-card-hover rounded-2xl p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
        <Icon size={18} style={{ color: 'var(--accent)' }} />
      </div>
      {trend > 0 && (
        <span className="text-xs font-body px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
          +{trend}%
        </span>
      )}
    </div>
    <p className="font-display font-black text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
    <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
  </div>
)

// ── Empty states ──────────────────────────────────────────
const EmptyApplications = () => (
  <div className="glass-card rounded-2xl p-8 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
      style={{ background: 'var(--accent-light)' }}>
      <Users size={28} style={{ color: 'var(--accent)' }} />
    </div>
    <h4 className="font-display font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
      No applications yet
    </h4>
    <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
      Post a job and candidates will start applying!
    </p>
    <Link to="/recruiter/post-job" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2">
      <PlusCircle size={15} /> Post Your First Job
    </Link>
  </div>
)

const EmptyJobs = () => (
  <div className="glass-card rounded-2xl p-8 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
      style={{ background: 'var(--accent-light)' }}>
      <Briefcase size={28} style={{ color: 'var(--accent)' }} />
    </div>
    <h4 className="font-display font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
      No active job postings
    </h4>
    <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
      Post your first job and let AI find the best candidates!
    </p>
    <Link to="/recruiter/post-job" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2">
      <PlusCircle size={15} /> Post a Job
    </Link>
  </div>
)

export default function RecruiterDashboard() {
  const { user } = useAuthStore()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs/my-jobs'),
          api.get('/applications/recruiter'),
        ])
        const jobs = jobsRes.data?.data || []
        const apps = appsRes.data?.data || []

        const activeJobs    = jobs.filter(j => j.is_active)
        const totalApps     = apps.length
        const shortlisted   = apps.filter(a => a.status === 'shortlisted' || a.status === 'interview').length
        const interviews    = apps.filter(a => a.status === 'interview').length
        const recentApps    = apps.slice(0, 5)

        setData({ activeJobs, totalApps, shortlisted, interviews, recentApps, jobs: activeJobs.slice(0, 3) })

        if (activeJobs.length === 0 && totalApps === 0) setIsNewUser(true)
      } catch {
        // API failed — show empty state, NOT fake data
        setIsNewUser(true)
        setData({ activeJobs: [], totalApps: 0, shortlisted: 0, interviews: 0, recentApps: [], jobs: [] })
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
          <Building2 size={36} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <div className="flex-1">
            <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              👋 Welcome to SkillSetu, {user?.name?.split(' ')[0]}!
            </p>
            <p className="font-body text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Post your first job and AI will instantly match you with the best candidates on the platform.
            </p>
          </div>
          <Link to="/recruiter/post-job" className="btn-primary text-sm px-4 py-2 flex-shrink-0">
            Post First Job →
          </Link>
        </div>
      )}

      {/* ── Banner ── */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
        <div className="relative">
          <p className="font-body text-white/80 text-sm mb-1">Welcome back 👋</p>
          <h2 className="font-display font-black text-2xl text-white mb-1">
            {user?.company || user?.name || 'Recruiter'}
          </h2>
          <p className="font-body text-white/80 text-sm">
            {data?.activeJobs?.length > 0
              ? <>You have <strong className="text-white">{data.activeJobs.length} active job posting{data.activeJobs.length !== 1 ? 's' : ''}</strong> with <strong className="text-white">{data.totalApps} total applicants</strong>.</>
              : 'Post your first job to start receiving applications!'}
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase}     label="Active Jobs"        value={data?.activeJobs?.length ?? 0} trend={0} />
        <StatCard icon={ClipboardList} label="Total Applications" value={data?.totalApps    ?? 0}       trend={0} />
        <StatCard icon={Users}         label="Shortlisted"        value={data?.shortlisted  ?? 0}       trend={0} />
        <StatCard icon={TrendingUp}    label="Interviews Set"     value={data?.interviews   ?? 0}       trend={0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              🆕 Latest Applications
            </h3>
            <Link to="/recruiter/applications" className="flex items-center gap-1 text-sm font-body" style={{ color: 'var(--accent)' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {data?.recentApps?.length > 0 ? (
            <div className="space-y-3">
              {data.recentApps.map(app => (
                <div key={app.id} className="glass-card-hover rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
                    style={{ background: 'var(--accent)' }}>
                    {app.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{app.name}</p>
                    <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                      Applied · {new Date(app.applied_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  {app.match_score > 0 && (
                    <span className="text-xs px-2 py-1 rounded-lg font-body font-semibold"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                      {app.match_score}% match
                    </span>
                  )}
                  <div className="flex gap-1">
                    <Link to="/recruiter/applications"
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      <Eye size={13} />
                    </Link>
                    <Link to="/recruiter/messages"
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      <MessageSquare size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyApplications />
          )}
        </div>

        {/* Active Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              📋 Active Postings
            </h3>
            <Link to="/recruiter/post-job" className="btn-primary text-sm py-2 px-4">+ Post Job</Link>
          </div>
          {data?.jobs?.length > 0 ? (
            <>
              <div className="space-y-3">
                {data.jobs.map(job => (
                  <div key={job.id} className="glass-card-hover rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{job.title}</p>
                      <span className="text-xs px-2 py-1 rounded-full font-body"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        Active
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Users size={11} /> {job.applicants_count ?? 0} applicants</span>
                      <span className="flex items-center gap-1"><Eye size={11} /> {job.views ?? 0} views</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/recruiter/post-job" className="btn-outline w-full flex items-center justify-center gap-2 mt-3 py-3">
                + Post New Job
              </Link>
            </>
          ) : (
            <EmptyJobs />
          )}
        </div>
      </div>
    </div>
  )
}