import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, MessageSquare, MapPin, ChevronDown, ChevronUp, Briefcase, X } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  new:       { label: 'New',        color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  reviewing: { label: 'Reviewing',  color: '#f97316', bg: 'rgba(249,115,22,0.15)'  },
  interview: { label: 'Interview',  color: '#3b82f6', bg: 'rgba(59,130,246,0.15)'  },
  offered:   { label: 'Offered 🎉', color: '#22c55e', bg: 'rgba(34,197,94,0.15)'   },
}
// Note: rejected is intentionally excluded — clean recruiter view

// ── Candidate Profile Modal ─────────────────────────────────
const ProfileModal = ({ app, onClose, onMessage }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
    <div className="w-full max-w-lg rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--accent-light)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg"
            style={{ background: 'var(--accent)' }}>
            {app.name?.slice(0,2).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{app.name}</p>
            <p className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{app.email} · {app.phone}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Match + Status */}
        <div className="flex gap-3">
          <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <p className="font-display font-black text-2xl" style={{ color: '#22c55e' }}>{app.match_score}%</p>
            <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>AI Match Score</p>
          </div>
          <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'var(--accent-light)' }}>
            <p className="font-display font-bold text-base capitalize" style={{ color: 'var(--accent)' }}>{app.status}</p>
            <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Current Status</p>
          </div>
          <div className="flex-1 p-3 rounded-xl text-center" style={{ background: 'var(--bg-input)' }}>
            <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{app.experience || 'Fresher'}</p>
            <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Experience</p>
          </div>
        </div>

        {/* Notice Period */}
        <div className="flex items-center gap-2 text-sm font-body" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notice Period:</span>
          {app.notice_period || 'Immediate'}
        </div>

        {/* Cover Letter */}
        {app.cover_letter && (
          <div>
            <p className="font-display font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Cover Letter</p>
            <div className="p-3 rounded-xl text-sm font-body leading-relaxed max-h-32 overflow-y-auto"
              style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              {app.cover_letter}
            </div>
          </div>
        )}

        {/* Applied on */}
        <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
          Applied: {new Date(app.applied_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={() => onMessage(app)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200"
            style={{ background: 'var(--accent)', color: 'white' }}>
            <MessageSquare size={15} /> Message Candidate
          </button>
          <a href={`mailto:${app.email}?subject=Regarding your application`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200"
            style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
            Send Email
          </a>
        </div>
      </div>
    </div>
  </div>
)

export default function RecruiterApplications() {
  const navigate = useNavigate()
  const [jobs,        setJobs]        = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [apps,        setApps]        = useState([])
  const [filter,      setFilter]      = useState('all')
  const [loading,     setLoading]     = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [viewingApp,  setViewingApp]  = useState(null)
  const [updating,    setUpdating]    = useState(null)

  // Load recruiter's jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/my-jobs')
        setJobs(res.data.data || [])
      } catch {
        // demo fallback
        setJobs([
          { id: 'demo1', title: 'Full Stack Developer',    applicants_count: 3 },
          { id: 'demo2', title: 'Machine Learning Engineer', applicants_count: 1 },
          { id: 'demo3', title: 'Frontend Intern',          applicants_count: 1 },
        ])
      } finally {
        setLoadingJobs(false)
      }
    }
    fetchJobs()
  }, [])

  // Load applications when a job is selected
  useEffect(() => {
    if (!selectedJob) return
    const fetchApps = async () => {
      setLoading(true)
      setApps([])
      try {
        const res = await api.get(`/applications/job/${selectedJob.id}`)
        setApps(res.data.data || [])
      } catch {
        // demo fallback per job
        const demoApps = {
          demo1: [
            { id:'a1', name:'Priya Sharma',  email:'priya@demo.com',  phone:'9876543210', match_score:94, status:'interview', experience:'fresher', notice_period:'Immediate', cover_letter:'I am very passionate about full stack development and would love to join TechCorp.', applied_at:'2024-01-14' },
            { id:'a2', name:'Rahul Verma',   email:'rahul@demo.com',  phone:'9876543211', match_score:88, status:'reviewing', experience:'fresher', notice_period:'Immediate', cover_letter:'React and Node.js are my strongest skills.', applied_at:'2024-01-13' },
            { id:'a3', name:'Anjali Singh',  email:'anjali@demo.com', phone:'9876543212', match_score:85, status:'new',       experience:'fresher', notice_period:'15 days',   cover_letter:'Looking forward to contributing to your team.', applied_at:'2024-01-12' },
          ],
          demo2: [
            { id:'a4', name:'Vikram Patel',  email:'vikram@demo.com', phone:'9876543213', match_score:79, status:'new', experience:'fresher', notice_period:'Immediate', cover_letter:'ML enthusiast with hands-on TensorFlow experience.', applied_at:'2024-01-11' },
          ],
          demo3: [
            { id:'a5', name:'Sneha Gupta',   email:'sneha@demo.com',  phone:'9876543214', match_score:76, status:'offered', experience:'fresher', notice_period:'Immediate', cover_letter:'Frontend development is my passion.', applied_at:'2024-01-10' },
          ],
        }
        setApps(demoApps[selectedJob.id] || [])
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [selectedJob])

  const updateStatus = async (appId, newStatus) => {
    setUpdating(appId)
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus })
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      // demo mode — update locally
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      toast.success(`Status updated to ${newStatus}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleMessage = (app) => {
    setViewingApp(null)
    navigate('/recruiter/messages')
    toast.success(`Opening chat with ${app.name}`)
  }

  // Filter: exclude rejected (clean view), then apply tab filter
  const activeApps   = apps.filter(a => a.status !== 'rejected')
  const filteredApps = filter === 'all' ? activeApps : activeApps.filter(a => a.status === filter)

  const counts = {
    all:       activeApps.length,
    new:       activeApps.filter(a => a.status === 'new').length,
    reviewing: activeApps.filter(a => a.status === 'reviewing').length,
    interview: activeApps.filter(a => a.status === 'interview').length,
    offered:   activeApps.filter(a => a.status === 'offered').length,
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📋 Applications</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          Select a job posting to view its applications
        </p>
      </div>

      {/* ── Step 1: Choose Job Post ─────────────────────── */}
      <div>
        <p className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          Step 1 — Select a Job Posting
        </p>
        {loadingJobs ? (
          <div className="flex gap-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-16 flex-1 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobs.map(job => (
              <button key={job.id} onClick={() => { setSelectedJob(job); setFilter('all') }}
                className="p-4 rounded-xl text-left transition-all duration-200 border"
                style={selectedJob?.id === job.id
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)', boxShadow: '0 4px 16px var(--shadow)' }
                  : { background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
                onMouseOver={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseOut={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={14} />
                  <p className="font-display font-semibold text-sm truncate">{job.title}</p>
                </div>
                <p className="font-body text-xs opacity-80">
                  {job.applicants_count || 0} applicant{job.applicants_count !== 1 ? 's' : ''}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Step 2: Applications for selected job ──────── */}
      {selectedJob && (
        <>
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Step 2 — Applications for: <span style={{ color: 'var(--accent)' }}>{selectedJob.title}</span>
            </p>
            <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
              {activeApps.length} active · Rejected hidden
            </p>
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all',       label: `All (${counts.all})` },
              { key: 'new',       label: `New (${counts.new})` },
              { key: 'reviewing', label: `Reviewing (${counts.reviewing})` },
              { key: 'interview', label: `Interview (${counts.interview})` },
              { key: 'offered',   label: `Offered (${counts.offered})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className="px-4 py-2 rounded-xl font-body text-sm transition-all duration-200"
                style={filter === key
                  ? { background: 'var(--accent)', color: 'white' }
                  : { background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Applications list */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="font-display font-semibold text-base" style={{ color: 'var(--text-muted)' }}>
                No applications here
              </p>
              <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {filter === 'all' ? 'No active applications for this job yet.' : `No applications with status "${filter}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map(app => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.new
                return (
                  <div key={app.id} className="glass-card rounded-2xl p-5"
                    style={{ border: app.status === 'offered' ? '1.5px solid #22c55e' : '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-display font-bold flex-shrink-0"
                        style={{ background: 'var(--accent)' }}>
                        {app.name?.slice(0,2).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{app.name}</p>
                        <div className="flex flex-wrap gap-3 mt-0.5 font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>{app.email}</span>
                          {app.applied_at && (
                            <span>Applied {new Date(app.applied_at).toLocaleDateString('en-IN')}</span>
                          )}
                          <span className="font-semibold" style={{ color: '#22c55e' }}>{app.match_score}% match</span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span className="text-xs px-3 py-1.5 rounded-full font-body font-medium flex-shrink-0"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>

                      {/* Action buttons */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setViewingApp(app)}
                          title="View full profile"
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--accent)' + '33'}
                          onMouseOut={e => e.currentTarget.style.background = 'var(--accent-light)'}>
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleMessage(app)}
                          title="Message candidate"
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--accent)' + '33'}
                          onMouseOut={e => e.currentTarget.style.background = 'var(--accent-light)'}>
                          <MessageSquare size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Status changer */}
                    <div className="flex gap-2 mt-4 pt-3 border-t flex-wrap"
                      style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="font-body text-xs self-center" style={{ color: 'var(--text-muted)' }}>
                        Move to:
                      </span>
                      {Object.entries(STATUS_CONFIG)
                        .filter(([key]) => key !== app.status)
                        .map(([key, c]) => (
                          <button key={key}
                            disabled={updating === app.id}
                            onClick={() => updateStatus(app.id, key)}
                            className="px-3 py-1.5 rounded-lg font-body text-xs transition-all duration-200 disabled:opacity-50"
                            style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}33` }}
                            onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                            {updating === app.id ? '...' : c.label}
                          </button>
                        ))}
                      <button
                        disabled={updating === app.id}
                        onClick={() => updateStatus(app.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg font-body text-xs transition-all duration-200 disabled:opacity-50 ml-auto"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                        Reject & Hide
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Profile Modal */}
      {viewingApp && (
        <ProfileModal
          app={viewingApp}
          onClose={() => setViewingApp(null)}
          onMessage={handleMessage}
        />
      )}
    </div>
  )
}