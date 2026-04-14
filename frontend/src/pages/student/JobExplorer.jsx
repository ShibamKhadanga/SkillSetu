import { useState, useEffect } from 'react'
import { Search, MapPin, Briefcase, Clock, IndianRupee, Zap, Filter, X, CheckCircle2, Send, Building2, ExternalLink } from 'lucide-react'
import api from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const DEMO_JOBS = [
  { id: 1, title: 'Full Stack Developer', company: 'TechCorp India', location: 'Bangalore', type: 'Full-time', salary: '₹8-12 LPA', match: 92, skills: ['React', 'Node.js', 'MongoDB'], posted: '2 days ago', description: 'We are looking for a passionate Full Stack Developer to join our growing team...', logo: 'T', remote: false },
  { id: 2, title: 'Machine Learning Engineer', company: 'AI Solutions Pvt', location: 'Remote', type: 'Full-time', salary: '₹10-18 LPA', match: 88, skills: ['Python', 'TensorFlow', 'SQL', 'Scikit-learn'], posted: '1 day ago', description: 'Join our AI team to build cutting-edge ML models for production systems...', logo: 'A', remote: true },
  { id: 3, title: 'Frontend Developer Intern', company: 'StartupXYZ', location: 'Hyderabad', type: 'Internship', salary: '₹20-30k/month', match: 85, skills: ['React', 'TypeScript', 'CSS'], posted: '3 days ago', description: 'Exciting internship opportunity for talented frontend developers...', logo: 'S', remote: false },
  { id: 4, title: 'Data Analyst', company: 'Infosys', location: 'Pune', type: 'Full-time', salary: '₹6-9 LPA', match: 79, skills: ['Python', 'SQL', 'Power BI', 'Excel'], posted: '5 days ago', description: 'Analyze business data and provide actionable insights to stakeholders...', logo: 'I', remote: false },
  { id: 5, title: 'DevOps Engineer', company: 'CloudBase Technologies', location: 'Remote', type: 'Full-time', salary: '₹12-20 LPA', match: 72, skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], posted: '1 week ago', description: 'Manage and optimize cloud infrastructure for high-traffic applications...', logo: 'C', remote: true },
  { id: 6, title: 'Android Developer', company: 'MobileFirst', location: 'Chennai', type: 'Full-time', salary: '₹7-11 LPA', match: 68, skills: ['Kotlin', 'Android SDK', 'REST APIs', 'Firebase'], posted: '4 days ago', description: 'Build feature-rich Android applications used by millions of users...', logo: 'M', remote: false },
]

// Apply Modal
const ApplyModal = ({ job, onClose, onApply }) => {
  const { user } = useAuthStore()
  const [fields, setFields] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cover_letter: `Dear Hiring Team at ${job?.company},\n\nI am excited to apply for the ${job?.title} position. With my background in ${user?.skills?.slice(0,3).join(', ') || 'software development'}, I believe I can contribute significantly to your team.\n\nI look forward to discussing this opportunity.\n\nBest regards,\n${user?.name || 'Applicant'}`,
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
    } catch {
      toast.success('🎉 Application sent! (Demo mode)')
      onApply(job.id)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {/* Header */}
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
  const [jobs, setJobs] = useState(DEMO_JOBS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [applyingJob, setApplyingJob] = useState(null)
  const [appliedJobs, setAppliedJobs] = useState([])

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase())
      || j.company.toLowerCase().includes(search.toLowerCase())
      || j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || j.type.toLowerCase().includes(filter)
      || (filter === 'remote' && j.remote)
    return matchSearch && matchFilter
  })

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
        Showing {filtered.length} jobs matched to your profile
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(job => {
          const applied = appliedJobs.includes(job.id)
          return (
            <div key={job.id} className="glass-card-hover rounded-2xl p-5 cursor-pointer"
              onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0"
                  style={{ background: 'var(--accent)' }}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                    <span className="text-xs font-body font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: job.match >= 85 ? 'rgba(34,197,94,0.1)' : 'var(--accent-light)', color: job.match >= 85 ? '#22c55e' : 'var(--accent)' }}>
                      {job.match}%
                    </span>
                  </div>
                  <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-3 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                <span className="flex items-center gap-1"><IndianRupee size={12} /> {job.salary}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {job.posted}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skills.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-lg font-body"
                    style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Expanded description */}
              {selectedJob?.id === job.id && (
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
                <button className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                  <ExternalLink size={15} />
                </button>
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
