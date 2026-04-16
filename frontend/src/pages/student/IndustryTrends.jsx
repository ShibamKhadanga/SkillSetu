import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, BarChart3, Briefcase, MapPin, Zap, RefreshCcw } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const DEMO_TRENDS = {
  lastUpdated: 'April 2026',
  topSkills: [
    { name: 'Artificial Intelligence / ML', demand: 94, change: +18, trend: 'up', icon: '🤖' },
    { name: 'React / Next.js', demand: 89, change: +12, trend: 'up', icon: '⚛️' },
    { name: 'Python', demand: 92, change: +8, trend: 'up', icon: '🐍' },
    { name: 'Cloud (AWS/Azure/GCP)', demand: 87, change: +15, trend: 'up', icon: '☁️' },
    { name: 'Data Science & Analytics', demand: 85, change: +10, trend: 'up', icon: '📊' },
    { name: 'Cybersecurity', demand: 82, change: +22, trend: 'up', icon: '🔒' },
    { name: 'DevOps / CI-CD', demand: 80, change: +9, trend: 'up', icon: '🔄' },
    { name: 'Blockchain / Web3', demand: 45, change: -15, trend: 'down', icon: '⛓️' },
    { name: 'Java (Enterprise)', demand: 70, change: -3, trend: 'stable', icon: '☕' },
    { name: 'PHP / WordPress', demand: 35, change: -12, trend: 'down', icon: '🐘' },
  ],
  topRoles: [
    { title: 'AI/ML Engineer', avgSalary: '₹12-30 LPA', openings: '45,000+', growth: '+32%', color: '#8b5cf6' },
    { title: 'Full Stack Developer', avgSalary: '₹6-20 LPA', openings: '85,000+', growth: '+18%', color: '#3b82f6' },
    { title: 'Data Scientist', avgSalary: '₹10-25 LPA', openings: '35,000+', growth: '+25%', color: '#22c55e' },
    { title: 'Cloud Architect', avgSalary: '₹15-40 LPA', openings: '20,000+', growth: '+28%', color: '#f59e0b' },
    { title: 'Cybersecurity Analyst', avgSalary: '₹8-22 LPA', openings: '25,000+', growth: '+35%', color: '#ef4444' },
  ],
  topCities: [
    { city: 'Bangalore', jobs: '2,50,000+', growth: '+15%', speciality: 'Startups & Product' },
    { city: 'Hyderabad', jobs: '1,80,000+', growth: '+20%', speciality: 'AI & Cloud' },
    { city: 'Pune', jobs: '1,20,000+', growth: '+12%', speciality: 'IT Services' },
    { city: 'Mumbai', jobs: '1,50,000+', growth: '+8%', speciality: 'Fintech & Banking' },
    { city: 'Delhi NCR', jobs: '2,00,000+', growth: '+10%', speciality: 'E-commerce & SaaS' },
    { city: 'Chennai', jobs: '1,00,000+', growth: '+14%', speciality: 'Manufacturing & IT' },
  ],
  insights: [
    '🚀 AI/ML demand has grown 3x in India since 2024 — learn Python + TensorFlow to capitalize',
    '📱 Remote work is stabilizing at 35% of tech jobs — cloud skills are essential',
    '🏛️ Government is hiring 1 lakh+ IT professionals under Digital India 2.0',
    '💡 Tier-2 cities (Jaipur, Indore, Kochi) are seeing 25%+ growth in tech hiring',
  ]
}

export default function IndustryTrends() {
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrends()
  }, [])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const res = await api.get('/ai/industry-trends')
      setTrends(res.data?.data || DEMO_TRENDS)
    } catch {
      setTrends(DEMO_TRENDS)
    } finally { setLoading(false) }
  }

  const TrendIcon = ({ trend, size = 14 }) => {
    if (trend === 'up') return <TrendingUp size={size} style={{ color: '#22c55e' }} />
    if (trend === 'down') return <TrendingDown size={size} style={{ color: '#ef4444' }} />
    return <Minus size={size} style={{ color: '#f59e0b' }} />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📈 Industry Trends</h2>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Indian job market trends — updated {trends?.lastUpdated}
          </p>
        </div>
        <button onClick={fetchTrends} className="p-2 rounded-lg transition-all" style={{ background: 'var(--bg-input)' }}>
          <RefreshCcw size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Key Insights Banner */}
      <div className="glass-card rounded-2xl p-5">
        <p className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--accent)' }}>💡 Key Insights</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {trends.insights.map((ins, i) => (
            <p key={i} className="font-body text-sm p-2 rounded-lg" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
              {ins}
            </p>
          ))}
        </div>
      </div>

      {/* Skills Demand Chart */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>Top Skills — Demand Index</h3>
        </div>
        <div className="space-y-3">
          {trends.topSkills.map((skill, i) => (
            <div key={skill.name} className="flex items-center gap-3">
              <span className="text-lg w-8 text-center">{skill.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <TrendIcon trend={skill.trend} />
                    <span className="font-body text-xs font-semibold" style={{ color: skill.change > 0 ? '#22c55e' : skill.change < 0 ? '#ef4444' : '#f59e0b' }}>
                      {skill.change > 0 ? '+' : ''}{skill.change}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${skill.demand}%`,
                      background: skill.trend === 'up' ? 'linear-gradient(90deg, #22c55e, #06b6d4)' :
                        skill.trend === 'down' ? 'linear-gradient(90deg, #ef4444, #f97316)' :
                          'linear-gradient(90deg, #f59e0b, #eab308)',
                    }} />
                </div>
              </div>
              <span className="font-display font-bold text-sm w-10 text-right" style={{ color: 'var(--text-secondary)' }}>{skill.demand}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Roles & Top Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Roles */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} style={{ color: 'var(--accent)' }} />
            <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>🔥 Hottest Roles</h3>
          </div>
          <div className="space-y-3">
            {trends.topRoles.map((role, i) => (
              <div key={role.title} className="rounded-xl p-3" style={{ background: `${role.color}08`, border: `1px solid ${role.color}25` }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-display font-bold text-sm" style={{ color: role.color }}>{role.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-body font-semibold" style={{ background: '#22c55e20', color: '#22c55e' }}>
                    {role.growth}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>💰 {role.avgSalary}</span>
                  <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>📋 {role.openings} openings</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} style={{ color: 'var(--accent)' }} />
            <h3 className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>📍 Top Hiring Cities</h3>
          </div>
          <div className="space-y-3">
            {trends.topCities.map((city, i) => (
              <div key={city.city} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'var(--bg-input)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-sm"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{city.city}</p>
                  <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{city.speciality}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{city.jobs}</p>
                  <span className="font-body text-xs font-semibold" style={{ color: '#22c55e' }}>{city.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
