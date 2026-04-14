import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const WEEKLY = [
  { day: 'Mon', applications: 12 }, { day: 'Tue', applications: 19 }, { day: 'Wed', applications: 8 },
  { day: 'Thu', applications: 25 }, { day: 'Fri', applications: 22 }, { day: 'Sat', applications: 5 }, { day: 'Sun', applications: 3 },
]

const FUNNEL = [
  { name: 'Views', value: 456 }, { name: 'Applications', value: 87 }, { name: 'Shortlisted', value: 24 },
  { name: 'Interviewed', value: 10 }, { name: 'Offered', value: 3 },
]

const SKILL_DIST = [
  { name: 'React', count: 45 }, { name: 'Python', count: 38 }, { name: 'Node.js', count: 32 },
  { name: 'SQL', count: 28 }, { name: 'AWS', count: 18 }, { name: 'Docker', count: 15 },
]

const PIE_DATA = [
  { name: 'Full Stack', value: 40, color: '#f97316' },
  { name: 'ML/AI', value: 25, color: '#06b6d4' },
  { name: 'Frontend', value: 20, color: '#8b5cf6' },
  { name: 'Backend', value: 15, color: '#22c55e' },
]

const StatCard = ({ label, value, sub, color }) => (
  <div className="glass-card-hover rounded-2xl p-5">
    <p className="font-display font-black text-4xl mb-1" style={{ color: color || 'var(--accent)' }}>{value}</p>
    <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
    {sub && <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
  </div>
)

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📊 Analytics</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Real-time hiring insights for your postings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Views" value="456" sub="This month" />
        <StatCard label="Applications" value="87" sub="87% more than last month" color="#22c55e" />
        <StatCard label="Avg Match Score" value="82%" sub="Across all candidates" />
        <StatCard label="Time to Hire" value="12d" sub="Industry avg: 30d" color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications over week */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Applications This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="applications" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart by role */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Applicants by Role</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={70} dataKey="value" strokeWidth={0}>
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span className="font-body text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiring funnel */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Hiring Funnel</h3>
          <div className="space-y-3">
            {FUNNEL.map((item, i) => {
              const pct = Math.round((item.value / FUNNEL[0].value) * 100)
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

        {/* Top skills */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Top Candidate Skills</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SKILL_DIST} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
