import { useState } from 'react'
import { Landmark, Search, ExternalLink, Calendar, GraduationCap, Sparkles } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function GovtJobs() {
  const [field, setField] = useState('')
  const [education, setEducation] = useState('')
  const [state, setState] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchJobs = async () => {
    if (!field.trim()) { toast.error('Enter your field/background!'); return }
    setLoading(true)
    try {
      const res = await api.post('/ai/govt-jobs', { field, education, state })
      setResult(res.data?.data || res.data)
      toast.success('Government jobs found! 🏛️')
    } catch {
      setResult({
        exams: [
          { name: 'SSC CGL', body: 'Staff Selection Commission', eligibility: 'Graduate in any stream', posts: 'Assistant, Inspector, Auditor', link: 'https://ssc.nic.in', frequency: 'Annual' },
          { name: 'IBPS PO', body: 'Institute of Banking Personnel Selection', eligibility: 'Graduate in any stream', posts: 'Probationary Officer', link: 'https://ibps.in', frequency: 'Annual' },
          { name: 'UPSC CSE', body: 'Union Public Service Commission', eligibility: 'Graduate in any stream', posts: 'IAS, IPS, IFS', link: 'https://upsc.gov.in', frequency: 'Annual' },
        ],
        tip: 'Start with SSC and State PSC exams while preparing for field-specific exams.'
      })
      toast.success('Government jobs found! 🏛️ (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>🏛️ Government Job Finder</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Find government exams & jobs matching your background</p>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Field / Background *</label>
            <input value={field} onChange={e => setField(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              className="input-field" placeholder="e.g. Engineering, Commerce, Law..." />
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Education Level</label>
            <select value={education} onChange={e => setEducation(e.target.value)} className="input-field">
              <option value="">Select education</option>
              <option>10th Pass</option>
              <option>12th Pass</option>
              <option>Graduate</option>
              <option>Post Graduate</option>
              <option>B.Tech / B.E.</option>
              <option>MBBS / BDS</option>
              <option>LLB</option>
              <option>B.Ed</option>
              <option>CA / CS</option>
              <option>Diploma</option>
              <option>PhD</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>State</label>
            <input value={state} onChange={e => setState(e.target.value)}
              className="input-field" placeholder="e.g. Maharashtra, All India..." />
          </div>
        </div>
        <button onClick={fetchJobs} disabled={loading || !field.trim()}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Search size={16} />}
          Find Government Jobs
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Found {result.exams?.length || 0} relevant government exams
          </p>

          {(result.exams || []).map((exam, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-light)' }}>
                  <Landmark size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{exam.name}</h3>
                    {exam.link && (
                      <a href={exam.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-body px-3 py-1 rounded-lg flex-shrink-0"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        Visit <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="font-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{exam.body}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <GraduationCap size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Eligibility</p>
                        <p className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{exam.eligibility}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Landmark size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Posts</p>
                        <p className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{exam.posts}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Frequency</p>
                        <p className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{exam.frequency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {result.tip && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--accent-light)', border: '1px solid var(--border)' }}>
              <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--accent)' }}>💡 Preparation Tip</p>
              <p className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{result.tip}</p>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Landmark size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <p className="font-display font-semibold" style={{ color: 'var(--text-muted)' }}>Find your perfect government job</p>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            UPSC, SSC, IBPS, Railway, State PSC, GATE, NEET, TET, and more
          </p>
        </div>
      )}
    </div>
  )
}
