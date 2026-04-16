import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Eye, Briefcase, Target } from 'lucide-react'
import api from '@/services/api'

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className="glass-card-hover rounded-2xl p-5">
    <div className="flex items-start justify-between mb-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color || 'var(--accent)'}15` }}>
          <Icon size={18} style={{ color: color || 'var(--accent)' }} />
        </div>
      )}
    </div>
    <p className="font-display font-black text-4xl mb-1" style={{ color: color || 'var(--accent)' }}>{value}</p>
    <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
    {sub && <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
  </div>
)

const PIE_COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#22c55e', '#ef4444', '#eab308']

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/recruiter/analytics')
        setData(res.data.data)
      } catch {
        // demo fallback
        setData({
          total_views: 456,
          total_applications: 87,
          avg_match: 82,
          active_jobs: 4,
          funnel: {
            views: 456,
            applications: 87,
            shortlisted: 24,
            interviewed: 10,
            offered: 3,
          },
          status_breakdown: {
            new: 45,
            reviewing: 22,
            interview: 10,
            offered: 3,
            rejected: 7,
          },
        })
      } finally { setLoading(false) }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  const funnel = data?.funnel || {}
  const funnelData = [
    { name: 'Views', value: funnel.views || 0 },
    { name: 'Applications', value: funnel.applications || 0 },
    { name: 'Shortlisted', value: funnel.shortlisted || 0 },
    { name: 'Interviewed', value: funnel.interviewed || 0 },
    { name: 'Offered', value: funnel.offered || 0 },
  ]

  const statusBreakdown = data?.status_breakdown || {}
  const pieData = Object.entries(statusBreakdown)
    .filter(([key]) => key !== 'rejected')
    .map(([key, val], i) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: val,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📊 Analytics</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Real-time hiring insights for your postings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Views" value={data?.total_views ?? 0} sub="Across all jobs" color="#3b82f6" />
        <StatCard icon={Users} label="Applications" value={data?.total_applications ?? 0} sub="Total received" color="#22c55e" />
        <StatCard icon={Target} label="Avg Match Score" value={`${data?.avg_match ?? 0}%`} sub="AI match average" />
        <StatCard icon={Briefcase} label="Active Jobs" value={data?.active_jobs ?? 0} sub="Currently posted" color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring funnel */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Hiring Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((item) => {
              const pct = funnelData[0].value > 0 ? Math.round((item.value / funnelData[0].value) * 100) : 0
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--bg-input)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status pie chart */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Application Status Breakdown</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                    <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>No application data yet</p>
            </div>
          )}
        </div>

        {/* Conversion rates */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Conversion Rates</h3>
          <div className="space-y-4">
            {[
              { label: 'View → Apply', from: funnel.views, to: funnel.applications },
              { label: 'Apply → Shortlist', from: funnel.applications, to: funnel.shortlisted },
              { label: 'Shortlist → Interview', from: funnel.shortlisted, to: funnel.interviewed },
              { label: 'Interview → Offer', from: funnel.interviewed, to: funnel.offered },
            ].map(({ label, from, to }) => {
              const rate = from > 0 ? Math.round((to / from) * 100) : 0
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="font-body text-xs flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <div className="w-24 h-2 rounded-full" style={{ background: 'var(--bg-input)' }}>
                    <div className="h-full rounded-full" style={{ width: `${rate}%`, background: rate >= 50 ? '#22c55e' : rate >= 20 ? '#f97316' : '#ef4444' }} />
                  </div>
                  <span className="font-display font-bold text-sm w-10 text-right" style={{ color: rate >= 50 ? '#22c55e' : rate >= 20 ? '#f97316' : '#ef4444' }}>
                    {rate}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary card */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>📈 Quick Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)' }}>
              <TrendingUp size={18} style={{ color: '#22c55e' }} />
              <div>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {data?.total_applications || 0} total applications
                </p>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                  across {data?.active_jobs || 0} active job postings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
              <Target size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {data?.avg_match || 0}% average AI match
                </p>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                  Quality of candidates applying
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)' }}>
              <Eye size={18} style={{ color: '#8b5cf6' }} />
              <div>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {data?.total_views || 0} total job views
                </p>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                  How many people saw your postings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
