import { useState } from 'react'
import { IndianRupee, TrendingUp, Building2, MapPin, Sparkles, Search } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function SalaryInsights() {
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('Fresher')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchInsights = async () => {
    if (!role.trim()) { toast.error('Enter a job role first!'); return }
    setLoading(true)
    try {
      const res = await api.post('/ai/salary-insights', { role, location, experience })
      setResult(res.data?.data || res.data)
      toast.success('Salary insights ready! 💰')
    } catch {
      setResult({
        role, location: location || 'India',
        fresher: '₹3 - ₹6 LPA', mid_level: '₹8 - ₹15 LPA', senior: '₹15 - ₹30 LPA',
        top_companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra'],
        top_cities: ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'],
        growth_trend: 'Growing',
        tip: 'Build a strong portfolio and get certified to stand out.'
      })
      toast.success('Salary insights ready! 💰 (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const trendColor = { Growing: '#22c55e', Stable: '#f97316', Declining: '#ef4444' }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>💰 Salary Insights</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>AI-powered salary data for any role in the Indian job market</p>
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Job Role *</label>
            <input value={role} onChange={e => setRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchInsights()}
              className="input-field" placeholder="e.g. Full Stack Developer, CA, Teacher..." />
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)}
              className="input-field" placeholder="e.g. Bangalore, Mumbai..." />
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Experience Level</label>
            <select value={experience} onChange={e => setExperience(e.target.value)} className="input-field">
              <option>Fresher</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5-10 years</option>
              <option>10+ years</option>
            </select>
          </div>
        </div>
        <button onClick={fetchInsights} disabled={loading || !role.trim()}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Search size={16} />}
          Get Salary Insights
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Salary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Fresher', value: result.fresher, icon: '🌱' },
              { label: 'Mid Level', value: result.mid_level, icon: '📈' },
              { label: 'Senior', value: result.senior, icon: '🏆' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="glass-card-hover rounded-2xl p-5 text-center">
                <span className="text-2xl">{icon}</span>
                <p className="font-body text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="font-display font-black text-xl mt-1" style={{ color: 'var(--accent)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Trend */}
          <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${trendColor[result.growth_trend] || '#22c55e'}15` }}>
              <TrendingUp size={20} style={{ color: trendColor[result.growth_trend] || '#22c55e' }} />
            </div>
            <div>
              <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Market Trend: <span style={{ color: trendColor[result.growth_trend] || '#22c55e' }}>{result.growth_trend}</span>
              </p>
              <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                Demand for {result.role} in {result.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top Companies */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={16} style={{ color: 'var(--accent)' }} />
                <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Top Companies</h3>
              </div>
              <div className="space-y-2">
                {(result.top_companies || []).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: 'var(--bg-input)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-display font-bold text-xs"
                      style={{ background: 'var(--accent)' }}>{c[0]}</div>
                    <span className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cities */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} style={{ color: 'var(--accent)' }} />
                <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Top Cities</h3>
              </div>
              <div className="space-y-2">
                {(result.top_cities || []).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: 'var(--bg-input)' }}>
                    <MapPin size={14} style={{ color: 'var(--accent)' }} />
                    <span className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tip */}
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
          <IndianRupee size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <p className="font-display font-semibold" style={{ color: 'var(--text-muted)' }}>Enter a role to see salary data</p>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Works for any field — tech, finance, teaching, law, medicine, and more
          </p>
        </div>
      )}
    </div>
  )
}
