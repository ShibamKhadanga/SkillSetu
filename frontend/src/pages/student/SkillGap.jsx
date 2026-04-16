import { useState, useEffect } from 'react'
import { Search, Zap, Target, CheckCircle, XCircle, BookOpen, Clock, ExternalLink, ArrowRight, Briefcase, TrendingUp } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function SkillGap() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Load available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs')
        setJobs(res.data.data || [])
      } catch {
        // demo fallback
        setJobs([
          { id: 'd1', title: 'Full Stack Developer', company: 'TechCorp', required_skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Docker', 'AWS'], location: 'Bangalore', salary: '₹8-15 LPA' },
          { id: 'd2', title: 'Data Scientist', company: 'DataVerse', required_skills: ['Python', 'TensorFlow', 'SQL', 'Statistics', 'Machine Learning'], location: 'Hyderabad', salary: '₹10-20 LPA' },
          { id: 'd3', title: 'Frontend Developer', company: 'WebStudio', required_skills: ['React', 'TypeScript', 'CSS', 'Figma', 'Next.js'], location: 'Remote', salary: '₹6-12 LPA' },
          { id: 'd4', title: 'DevOps Engineer', company: 'CloudNine', required_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'], location: 'Pune', salary: '₹8-18 LPA' },
        ])
      } finally { setLoadingJobs(false) }
    }
    fetchJobs()
  }, [])

  const analyzeGap = async (job) => {
    setSelectedJob(job)
    setAnalysis(null)
    setLoading(true)
    try {
      const res = await api.post('/ai/skill-gap', {
        job_skills: job.required_skills || [],
      })
      setAnalysis(res.data.data)
      toast.success('Skill gap analysis ready! 🎯')
    } catch {
      // demo fallback
      const profileRes = await api.get('/student/profile').catch(() => ({ data: { data: { skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Python'] } } }))
      const userSkills = (profileRes.data?.data?.skills || ['React', 'JavaScript', 'HTML', 'CSS', 'Python']).map(s => s.toLowerCase())
      const jobSkills = job.required_skills || []

      const matching = jobSkills.filter(s => userSkills.includes(s.toLowerCase()))
      const missing = jobSkills.filter(s => !userSkills.includes(s.toLowerCase()))
      const matchPercentage = jobSkills.length > 0 ? Math.round((matching.length / jobSkills.length) * 100) : 0

      setAnalysis({
        matching_skills: matching,
        missing_skills: missing,
        match_percentage: matchPercentage,
        recommendations: missing.map(skill => ({
          skill,
          priority: missing.indexOf(skill) < 2 ? 'high' : 'medium',
          time_to_learn: '2-4 weeks',
          resource: 'YouTube / Coursera',
          link: 'https://coursera.org',
          free: true,
        }))
      })
      toast.success('Skill gap analysis ready! 🎯 (Demo mode)')
    } finally { setLoading(false) }
  }

  const filteredJobs = jobs.filter(j =>
    !searchTerm || j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.required_skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Score ring SVG
  const ScoreRing = ({ score }) => {
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f97316' : '#ef4444'

    return (
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--bg-input)" strokeWidth="8" />
          <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-black text-3xl" style={{ color }}>{score}%</span>
          <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>match</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          🎯 Skill Gap Analyzer
        </h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          Compare your skills with job requirements — see what you need to learn
        </p>
      </div>

      {/* Step 1: Choose a job */}
      <div>
        <p className="font-display font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Target size={15} style={{ color: 'var(--accent)' }} />
          Step 1 — Select a target job
        </p>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-9" placeholder="Search by title, company, or skill..." />
        </div>
        {loadingJobs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredJobs.map(job => (
              <button key={job.id} onClick={() => analyzeGap(job)}
                className="p-4 rounded-2xl text-left transition-all duration-200 border"
                style={selectedJob?.id === job.id
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)', boxShadow: '0 4px 16px var(--shadow)' }
                  : { background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
                onMouseOver={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseOut={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={14} />
                  <p className="font-display font-semibold text-sm truncate">{job.title}</p>
                </div>
                <p className={`font-body text-xs ${selectedJob?.id === job.id ? 'opacity-80' : ''}`}
                  style={selectedJob?.id !== job.id ? { color: 'var(--text-muted)' } : {}}>
                  {job.company} • {job.location} {job.salary ? `• ${job.salary}` : ''}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(job.required_skills || []).slice(0, 4).map(s => (
                    <span key={s} className="text-xs px-1.5 py-0.5 rounded font-body"
                      style={selectedJob?.id === job.id
                        ? { background: 'rgba(255,255,255,0.2)', color: 'white' }
                        : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                      {s}
                    </span>
                  ))}
                  {(job.required_skills || []).length > 4 && (
                    <span className="text-xs opacity-60"
                      style={selectedJob?.id === job.id ? { color: 'white' } : { color: 'var(--text-muted)' }}>
                      +{job.required_skills.length - 4}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Analyzing your skill gap against {selectedJob?.title}...
          </p>
        </div>
      )}

      {/* Step 2: Analysis results */}
      {analysis && !loading && (
        <div className="space-y-5">
          <p className="font-display font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp size={15} style={{ color: 'var(--accent)' }} />
            Step 2 — Your Skill Gap Analysis for <span style={{ color: 'var(--accent)' }}>{selectedJob?.title}</span>
          </p>

          {/* Score overview */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={analysis.match_percentage} />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                {analysis.match_percentage >= 80 ? '🎉 Great Match!' : analysis.match_percentage >= 50 ? '💪 Good Progress!' : '📚 Room to Grow!'}
              </h3>
              <p className="font-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                You match <strong>{analysis.matching_skills?.length || 0}</strong> of{' '}
                <strong>{(analysis.matching_skills?.length || 0) + (analysis.missing_skills?.length || 0)}</strong> required skills.
                {analysis.missing_skills?.length > 0
                  ? ` Learn ${analysis.missing_skills.length} more to become a perfect fit!`
                  : ' You are ready to apply!'}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} style={{ color: '#22c55e' }} />
                  <span className="font-body text-sm font-semibold" style={{ color: '#22c55e' }}>
                    {analysis.matching_skills?.length || 0} Have
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle size={14} style={{ color: '#ef4444' }} />
                  <span className="font-body text-sm font-semibold" style={{ color: '#ef4444' }}>
                    {analysis.missing_skills?.length || 0} Need
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matching */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#22c55e' }}>
                <CheckCircle size={15} /> Skills You Have
              </h4>
              {(analysis.matching_skills || []).length > 0 ? (
                <div className="space-y-2">
                  {analysis.matching_skills.map(skill => (
                    <div key={skill} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <CheckCircle size={13} style={{ color: '#22c55e' }} />
                      <span className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>No matching skills yet — time to start learning!</p>
              )}
            </div>

            {/* Missing */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
                <XCircle size={15} /> Skills to Learn
              </h4>
              {(analysis.missing_skills || []).length > 0 ? (
                <div className="space-y-2">
                  {analysis.missing_skills.map(skill => (
                    <div key={skill} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <XCircle size={13} style={{ color: '#ef4444' }} />
                      <span className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-body text-sm" style={{ color: '#22c55e', fontWeight: 600 }}>🎉 You have all the required skills!</p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="glass-card rounded-2xl p-5">
              <h4 className="font-display font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Zap size={16} style={{ color: 'var(--accent)' }} />
                AI Learning Recommendations
              </h4>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl glass-card-hover">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                      style={{
                        background: rec.priority === 'high' ? 'rgba(239,68,68,0.1)' : rec.priority === 'medium' ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)',
                        color: rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f97316' : '#22c55e',
                      }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          Learn: {rec.skill}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-body capitalize"
                          style={{
                            background: rec.priority === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)',
                            color: rec.priority === 'high' ? '#ef4444' : '#f97316',
                          }}>
                          {rec.priority} priority
                        </span>
                        {rec.free && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                            Free
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1"><BookOpen size={10} /> {rec.resource}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {rec.time_to_learn}</span>
                      </div>
                    </div>
                    {rec.link && (
                      <a href={rec.link} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
