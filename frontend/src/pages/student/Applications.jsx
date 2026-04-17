import { useState, useEffect } from 'react'
import { ClipboardList, Clock, CheckCircle2, XCircle, MessageSquare, Calendar, Building2, MapPin, IndianRupee, ChevronDown, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/services/api'

const STATUS_CONFIG = {
  new: { label: 'Applied', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: ClipboardList },
  reviewing: { label: 'Under Review', color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: Clock },
  interview: { label: 'Interview', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: Calendar },
  offered: { label: 'Offered 🎉', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', icon: CheckCircle2 },
  rejected: { label: 'Not Selected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
}

export default function Applications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications/my')
        setApps(res.data?.data || [])
      } catch {
        setApps([])
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, k) => {
    acc[k] = apps.filter(a => a.status === k).length
    return acc
  }, {})

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
        <div className="skeleton h-32 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📋 My Applications</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Track all your job applications in one place</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon
          return (
            <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
              className="glass-card-hover rounded-xl p-3 text-center transition-all duration-200"
              style={filter === key ? { border: `1.5px solid ${cfg.color}` } : {}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: cfg.bg }}>
                <Icon size={14} style={{ color: cfg.color }} />
              </div>
              <p className="font-display font-bold text-xl" style={{ color: cfg.color }}>{statusCounts[key] || 0}</p>
              <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cfg.label}</p>
            </button>
          )
        })}
      </div>

      {/* Applications list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <ClipboardList size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p className="font-display font-semibold" style={{ color: 'var(--text-muted)' }}>
              {apps.length === 0 ? 'No applications yet' : 'No applications in this category'}
            </p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {apps.length === 0 ? 'Start applying to jobs from the Job Explorer!' : 'Try a different filter.'}
            </p>
            {apps.length === 0 && (
              <Link to="/student/jobs" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2 mt-4">
                Explore Jobs →
              </Link>
            )}
          </div>
        )}
        {filtered.map(app => {
          const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.new
          const Icon = cfg.icon
          const isExpanded = expanded === app.id
          return (
            <div key={app.id} className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : app.id)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold flex-shrink-0"
                      style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}>
                      {(app.company || 'C')[0]}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{app.role || 'Position'}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-0.5">
                        <span className="font-body text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <Building2 size={12} /> {app.company || 'Company'}
                        </span>
                        {app.location && (
                          <span className="font-body text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            <MapPin size={11} /> {app.location}
                          </span>
                        )}
                        {app.salary && (
                          <span className="font-body text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            <IndianRupee size={11} /> {app.salary}
                          </span>
                        )}
                        {app.match_score > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-body"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            {app.match_score}% match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 rounded-full font-body font-medium flex items-center gap-1.5 whitespace-nowrap"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                </div>

                <div className="flex gap-4 mt-3 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                  {app.applied_at && <span>Applied: {new Date(app.applied_at).toLocaleDateString('en-IN')}</span>}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="pt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-body mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        <span>Application Progress</span>
                        <span style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'var(--bg-input)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{
                            background: cfg.color,
                            width: { new: '20%', reviewing: '40%', interview: '60%', offered: '100%', rejected: '100%' }[app.status] || '20%',
                            opacity: app.status === 'rejected' ? 0.5 : 1,
                          }} />
                      </div>
                    </div>
                    {app.notes && (
                      <div className="p-3 rounded-xl text-sm font-body" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                        📝 {app.notes}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Link to="/student/messages" className="btn-outline text-xs py-2 flex items-center gap-1.5">
                        <MessageSquare size={13} /> Message Recruiter
                      </Link>
                      {app.status === 'interview' && (
                        <Link to="/student/mock-interview" className="btn-primary text-xs py-2 flex items-center gap-1.5">
                          <Calendar size={13} /> Prepare for Interview
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
