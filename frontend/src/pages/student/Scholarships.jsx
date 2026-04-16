import { useState } from 'react'
import { GraduationCap, Search, ExternalLink, IndianRupee, Calendar, Sparkles, Filter } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function Scholarships() {
  const [category, setCategory] = useState('')
  const [education, setEducation] = useState('')
  const [income, setIncome] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchScholarships = async () => {
    if (!category.trim()) { toast.error('Select a category!'); return }
    setLoading(true)
    try {
      const res = await api.post('/ai/scholarships', { category, education, income })
      setResult(res.data?.data || res.data)
      toast.success('Scholarships found! 🎓')
    } catch {
      // Demo fallback
      setResult({
        scholarships: [
          { name: 'PM Vidya Lakshmi (Central Govt)', provider: 'Ministry of Education', amount: 'Up to ₹10 LPA (Education Loan)', eligibility: 'Any student admitted to approved institution', deadline: 'Year-round', link: 'https://www.vidyalakshmi.co.in', type: 'Loan + Scholarship' },
          { name: 'National Scholarship Portal (NSP)', provider: 'Govt of India', amount: '₹10,000 - ₹50,000/year', eligibility: 'Family income < ₹8 LPA, 60%+ marks', deadline: 'October - November', link: 'https://scholarships.gov.in', type: 'Merit + Means' },
          { name: 'AICTE Pragati (Girls in Tech)', provider: 'AICTE', amount: '₹50,000/year', eligibility: 'Girl students in AICTE colleges, income < ₹8 LPA', deadline: 'December', link: 'https://www.aicte-india.org', type: 'For Women' },
          { name: 'Kishore Vaigyanik Protsahan Yojana (KVPY)', provider: 'DST, Govt of India', amount: '₹5,000 - ₹7,000/month + contingency', eligibility: 'Science stream students, competitive exam', deadline: 'July - August', link: 'http://kvpy.iisc.ac.in', type: 'Research' },
          { name: 'Post Matric Scholarship (SC/ST/OBC)', provider: 'Ministry of Social Justice', amount: 'Full tuition + maintenance', eligibility: 'SC/ST/OBC category, income limit varies by state', deadline: 'State-wise', link: 'https://scholarships.gov.in', type: 'Category-based' },
          { name: 'Sitaram Jindal Foundation', provider: 'Jindal Foundation', amount: '₹1,500 - ₹15,000/month', eligibility: 'Meritorious students, any stream, financial need', deadline: 'June - July', link: 'https://www.sitaramjindalfoundation.org', type: 'Private' },
        ],
        tip: `Focus on NSP (National Scholarship Portal) first — it covers 100+ scholarships in one place. Apply early, many scholarships close by November.`
      })
      toast.success('Scholarships found! 🎓 (Demo mode)')
    } finally { setLoading(false) }
  }

  const typeColors = {
    'Loan + Scholarship': '#3b82f6', 'Merit + Means': '#22c55e', 'For Women': '#ec4899',
    'Research': '#8b5cf6', 'Category-based': '#f97316', 'Private': '#14b8a6',
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>🎓 Scholarship Finder</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>AI finds scholarships matching your background — Central, State & Private</p>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
              <option value="">Select category</option>
              <option>General / Unreserved</option>
              <option>SC (Scheduled Caste)</option>
              <option>ST (Scheduled Tribe)</option>
              <option>OBC (Other Backward Class)</option>
              <option>EWS (Economically Weaker Section)</option>
              <option>Minority</option>
              <option>Women / Girl Student</option>
              <option>Disabled / PwD</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Education Level</label>
            <select value={education} onChange={e => setEducation(e.target.value)} className="input-field">
              <option value="">Select education</option>
              <option>10th Pass</option>
              <option>12th Pass</option>
              <option>Undergraduate (B.Tech/B.Sc/BA/B.Com)</option>
              <option>Postgraduate (M.Tech/MBA/MA)</option>
              <option>Diploma / ITI</option>
              <option>Medical (MBBS/BDS/B.Pharm)</option>
              <option>PhD / Research</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Family Income</label>
            <select value={income} onChange={e => setIncome(e.target.value)} className="input-field">
              <option value="">Select income</option>
              <option>Below ₹2.5 LPA</option>
              <option>₹2.5 - ₹5 LPA</option>
              <option>₹5 - ₹8 LPA</option>
              <option>₹8 - ₹15 LPA</option>
              <option>Above ₹15 LPA</option>
            </select>
          </div>
        </div>
        <button onClick={fetchScholarships} disabled={loading || !category}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Search size={16} />}
          Find Scholarships
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Found {result.scholarships?.length || 0} matching scholarships
          </p>

          {(result.scholarships || []).map((s, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${typeColors[s.type] || '#3b82f6'}15` }}>
                  <GraduationCap size={20} style={{ color: typeColors[s.type] || '#3b82f6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{s.name}</h3>
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-body px-3 py-1 rounded-lg flex-shrink-0"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        Apply <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  <p className="font-body text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{s.provider}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="flex items-start gap-2">
                      <IndianRupee size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Amount</p>
                        <p className="font-body text-sm font-semibold" style={{ color: '#22c55e' }}>{s.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Filter size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</p>
                        <span className="font-body text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${typeColors[s.type] || '#3b82f6'}15`, color: typeColors[s.type] || '#3b82f6' }}>
                          {s.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <GraduationCap size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Eligibility</p>
                        <p className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>{s.eligibility}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                      <div>
                        <p className="font-body text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Deadline</p>
                        <p className="font-body text-xs font-semibold" style={{ color: '#f59e0b' }}>{s.deadline}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {result.tip && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--accent-light)', border: '1px solid var(--border)' }}>
              <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--accent)' }}>💡 Pro Tip</p>
              <p className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{result.tip}</p>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <GraduationCap size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <p className="font-display font-semibold" style={{ color: 'var(--text-muted)' }}>Find scholarships you qualify for</p>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            NSP, AICTE, State Govt, Private Foundations — all in one place
          </p>
        </div>
      )}
    </div>
  )
}
