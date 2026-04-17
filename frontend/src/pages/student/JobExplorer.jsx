import { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, Clock, IndianRupee, Zap, X, CheckCircle2, Send, ExternalLink, Loader2 } from 'lucide-react'
import api from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

// Apply Modal
const ApplyModal = ({ job, onClose, onApply }) => {
  const { user } = useAuthStore()
  const [fields, setFields] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cover_letter: `Dear Hiring Team at ${job?.company},\n\nI am excited to apply for the ${job?.title} position. With my background in ${job?.required_skills?.slice(0, 3).join(', ') || 'this field'}, I believe I can contribute significantly to your team.\n\nI look forward to discussing this opportunity.\n\nBest regards,\n${user?.name || 'Applicant'}`,
    experience: '',
    notice_period: 'Immediate',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleApply = async () => {
    setSubmitting(true)
    try {
      await api.post(`/jobs/${job.id}/apply`, fields)
      toast.success('🎉 Application sent successfully!')
      onApply(job.id)
      onClose()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Application failed'
      if (msg.includes('already applied')) {
        toast.error('You have already applied to this job')
        onApply(job.id)
      } else {
        toast.error(msg)
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Apply to {job?.title}</h3>
            <p className="font-body text-sm" style={{ color: 'var(--accent)' }}>{job?.company}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Zap size={14} color="#22c55e" />
          <p className="font-body text-xs" style={{ color: '#22c55e' }}>
            AI has pre-filled all fields from your profile. Review and send!
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <input value={fields.name} onChange={e => setFields(f => ({ ...f, name: e.target.value }))} className="input-field text-sm" />
            </div>
            <div>
              <label className="block font-body text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Phone</label>
              <input value={fields.phone} onChange={e => setFields(f => ({ ...f, phone: e.target.value }))} className="input-field text-sm" />
            </div>
          </div>
          <div>
            <label className="block font-body text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Email</label>
            <input value={fields.email} onChange={e => setFields(f => ({ ...f, email: e.target.value }))} className="input-field text-sm" />
          </div>
          <div>
            <label className="block font-body text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Years of Experience</label>
            <select value={fields.experience} onChange={e => setFields(f => ({ ...f, experience: e.target.value }))} className="input-field text-sm">
              <option value="">Select experience</option>
              <option value="fresher">Fresher (0 years)</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3+">3+ years</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Notice Period</label>
            <select value={fields.notice_period} onChange={e => setFields(f => ({ ...f, notice_period: e.target.value }))} className="input-field text-sm">
              <option>Immediate</option>
              <option>15 days</option>
              <option>30 days</option>
              <option>60 days</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Cover Letter (AI Generated)</label>
            <textarea value={fields.cover_letter} onChange={e => setFields(f => ({ ...f, cover_letter: e.target.value }))}
              rows={6} className="input-field text-sm resize-none" />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-ghost flex-1 py-2.5">Cancel</button>
          <button onClick={handleApply} disabled={submitting}
            className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send size={15} />}
            Send Application
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JobExplorer() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [applyingJob, setApplyingJob] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState([])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs')
        const data = res.data?.data || res.data || []
        setJobs(Array.isArray(data) ? data : [])
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase())
      || j.company?.toLowerCase().includes(search.toLowerCase())
      || (j.required_skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all'
      || (filter === 'remote' && j.is_remote)
      || j.job_type?.toLowerCase().includes(filter)
    return matchSearch && matchFilter
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-12 rounded-xl" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>💼 Job Explorer</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>AI-matched jobs based on your skills — apply in one click</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" placeholder="Search jobs, companies, skills..." />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'full-time', label: 'Full-time' },
            { id: 'internship', label: 'Internship' },
            { id: 'remote', label: 'Remote' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="px-4 py-2.5 rounded-xl font-body text-sm whitespace-nowrap transition-all duration-200"
              style={filter === f.id ? { background: 'var(--accent)', color: 'white' }
                : { background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing {filtered.length} jobs {filtered.length > 0 && 'matched to your profile'}
      </p>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Briefcase size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
          <p className="font-display font-semibold" style={{ color: 'var(--text-muted)' }}>No jobs found</p>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {jobs.length === 0 ? 'No jobs posted yet. Check back soon!' : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(job => {
          const applied = appliedJobs.includes(job.id)
          const matchColor = (job.match || 0) >= 85 ? '#22c55e' : (job.match || 0) >= 60 ? 'var(--accent)' : 'var(--text-secondary)'
          return (
            <div key={job.id} className="glass-card-hover rounded-2xl p-5 cursor-pointer"
              onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
                  style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}>
                  {job.company?.[0] || 'J'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                    {(job.match || 0) > 0 && (
                      <span className="text-xs font-body font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                        style={{ background: (job.match || 0) >= 85 ? 'rgba(34,197,94,0.1)' : 'var(--accent-light)', color: matchColor }}>
                        {job.match}%
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-3 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={12} /> {job.job_type}</span>
                {job.salary && <span className="flex items-center gap-1"><IndianRupee size={12} /> {job.salary}</span>}
                {job.posted && <span className="flex items-center gap-1"><Clock size={12} /> {job.posted}</span>}
                {job.urgent && <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Urgent</span>}
                {job.is_remote && <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>Remote</span>}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(job.required_skills || []).slice(0, 5).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-lg font-body"
                    style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    {s}
                  </span>
                ))}
              </div>

              {selectedJob?.id === job.id && job.description && (
                <div className="mb-4 p-3 rounded-xl text-sm font-body" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                  {job.description}
                </div>
              )}

              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                {applied ? (
                  <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-body"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                    <CheckCircle2 size={15} /> Applied
                  </div>
                ) : (
                  <button onClick={() => setApplyingJob(job)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
                    <Zap size={15} /> One-Click Apply
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onApply={id => setAppliedJobs(prev => [...prev, id])}
        />
      )}
    </div>
  )
}
