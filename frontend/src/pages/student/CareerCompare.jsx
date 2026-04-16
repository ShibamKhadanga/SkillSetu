import { useState } from 'react'
import { ArrowLeftRight, Clock, Award, IndianRupee, TrendingUp, BookOpen, Briefcase, Check, X } from 'lucide-react'

// Comparison data derived from PATHWAY_TREE patterns
const CAREERS = [
  { id: 'btech-cse', name: 'B.Tech CSE', stream: 'Science (PCM)', duration: '4 years', cost: '₹4-20 LPA', avgSalary: '₹6-25 LPA', topExams: 'JEE Main, JEE Advanced, BITSAT', growth: 'High', icon: '⚙️', color: '#3b82f6',
    pros: ['Highest salary potential in tech', 'Global demand', 'Startup-friendly'], cons: ['JEE is highly competitive', 'Expensive in private colleges', '4 year commitment'] },
  { id: 'bca-mca', name: 'BCA → MCA', stream: 'Science (PCM)', duration: '3+2 years', cost: '₹1-6 LPA', avgSalary: '₹4-18 LPA', topExams: 'CUET, NIMCET', growth: 'High', icon: '💻', color: '#8b5cf6',
    pros: ['Easier entrance than JEE', 'Affordable', 'Same CS career outcomes after MCA'], cons: ['Lower starting salary than B.Tech', 'MCA needed for top roles', 'Less brand value initially'] },
  { id: 'mbbs', name: 'MBBS', stream: 'Science (PCB)', duration: '5.5 years', cost: '₹5-75 LPA', avgSalary: '₹8-50 LPA', topExams: 'NEET UG', growth: 'Stable', icon: '🩺', color: '#22c55e',
    pros: ['Respected profession', 'Govt job security', 'High earning after PG'], cons: ['NEET is very competitive', 'Very expensive in private', 'Long study duration'] },
  { id: 'bpharm', name: 'B.Pharm / D.Pharm', stream: 'Science (PCB)', duration: '2-4 years', cost: '₹1-8 LPA', avgSalary: '₹3-10 LPA', topExams: 'State CETs, GPAT', growth: 'Moderate', icon: '💊', color: '#f59e0b',
    pros: ['Shorter duration (D.Pharm)', 'Own pharmacy business option', 'Growing pharma industry'], cons: ['Lower salary vs MBBS', 'Limited growth without M.Pharm', 'Saturated in some states'] },
  { id: 'ca', name: 'CA (Chartered Accountant)', stream: 'Commerce', duration: '3-5 years', cost: '₹0.5-2 LPA', avgSalary: '₹8-30 LPA', topExams: 'CA Foundation, Inter, Final', growth: 'High', icon: '📜', color: '#f97316',
    pros: ['Very affordable', 'High respect in finance', 'Can practice independently'], cons: ['Very low pass rate', 'Long grueling process', 'Requires articleship'] },
  { id: 'bcom', name: 'B.Com → MBA', stream: 'Commerce', duration: '3+2 years', cost: '₹2-25 LPA', avgSalary: '₹5-35 LPA', topExams: 'CUET, CAT, XAT', growth: 'High', icon: '💰', color: '#14b8a6',
    pros: ['Versatile career options', 'MBA from top school = top salary', 'Management roles'], cons: ['MBA is expensive (IIM)', 'CAT is competitive', 'B.Com alone has limited scope'] },
  { id: 'ba-upsc', name: 'BA → UPSC (IAS)', stream: 'Arts', duration: '3+1-3 years prep', cost: '₹0.5-3 LPA', avgSalary: '₹10-20 LPA + perks', topExams: 'UPSC CSE', growth: 'Stable', icon: '🏛️', color: '#dc2626',
    pros: ['Highest prestige in India', 'Power to create change', 'Lifetime job security'], cons: ['Extremely competitive', 'Years of preparation', 'No guarantee of selection'] },
  { id: 'llb', name: 'BA LLB / LLB', stream: 'Arts / Any', duration: '5 / 3 years', cost: '₹2-15 LPA', avgSalary: '₹5-25 LPA', topExams: 'CLAT, AILET', growth: 'High', icon: '⚖️', color: '#8b5cf6',
    pros: ['Growing demand for corporate lawyers', 'Can practice independently', 'NLU = premium placement'], cons: ['Initial years are low-paying', 'Long hours in litigation', 'CLAT is competitive'] },
  { id: 'diploma', name: 'Diploma → Lateral B.Tech', stream: 'After 10th', duration: '3+3 years', cost: '₹1-8 LPA', avgSalary: '₹3-12 LPA', topExams: 'State CET, Lateral Entry', growth: 'Moderate', icon: '🔧', color: '#f97316',
    pros: ['Start earning earlier', 'Skip 12th board pressure', 'Lateral entry saves 1 year'], cons: ['Lower brand than direct B.Tech', 'Limited to state colleges usually', 'Miss out on JEE tier-1'] },
  { id: 'iti', name: 'ITI → Job', stream: 'After 10th', duration: '1-2 years', cost: '₹0.1-1 LPA', avgSalary: '₹2-6 LPA', topExams: 'Direct / ITI Entrance', growth: 'Stable', icon: '🛠️', color: '#ef4444',
    pros: ['Fastest route to employment', 'Cheapest education', 'Govt railway/technical jobs'], cons: ['Lowest salary ceiling', 'Limited career growth', 'Manual/technical work'] },
]

export default function CareerCompare() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const leftCareer = CAREERS.find(c => c.id === left)
  const rightCareer = CAREERS.find(c => c.id === right)

  const growthColor = { High: '#22c55e', Moderate: '#f59e0b', Stable: '#3b82f6', Low: '#ef4444' }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📊 Career Comparison Tool</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Compare any two career paths side-by-side — duration, cost, salary, exams & more</p>
      </div>

      {/* Selectors */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Career Path A</label>
            <select value={left} onChange={e => setLeft(e.target.value)} className="input-field">
              <option value="">Select career...</option>
              {CAREERS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.stream})</option>)}
            </select>
          </div>
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <ArrowLeftRight size={18} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Career Path B</label>
            <select value={right} onChange={e => setRight(e.target.value)} className="input-field">
              <option value="">Select career...</option>
              {CAREERS.filter(c => c.id !== left).map(c => <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.stream})</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {leftCareer && rightCareer && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Header Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[leftCareer, rightCareer].map(c => (
              <div key={c.id} className="rounded-2xl p-5 text-center" style={{ background: `${c.color}12`, border: `2px solid ${c.color}` }}>
                <span className="text-3xl">{c.icon}</span>
                <p className="font-display font-black text-lg mt-2" style={{ color: c.color }}>{c.name}</p>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{c.stream}</p>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          {[
            { label: 'Duration', icon: Clock, key: 'duration' },
            { label: 'Total Cost (approx)', icon: IndianRupee, key: 'cost' },
            { label: 'Avg Salary', icon: IndianRupee, key: 'avgSalary' },
            { label: 'Top Exams', icon: Award, key: 'topExams' },
          ].map(row => (
            <div key={row.key} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <row.icon size={14} style={{ color: 'var(--accent)' }} />
                <span className="font-display font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <p className="font-display font-bold text-sm text-center" style={{ color: leftCareer.color }}>{leftCareer[row.key]}</p>
                <p className="font-display font-bold text-sm text-center" style={{ color: rightCareer.color }}>{rightCareer[row.key]}</p>
              </div>
            </div>
          ))}

          {/* Growth Trend */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
              <span className="font-display font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>Growth Trend</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[leftCareer, rightCareer].map(c => (
                <div key={c.id} className="flex justify-center">
                  <span className="px-3 py-1 rounded-full font-display font-bold text-xs"
                    style={{ background: `${growthColor[c.growth]}20`, color: growthColor[c.growth] }}>
                    {c.growth === 'High' ? '🚀' : c.growth === 'Moderate' ? '📈' : '📊'} {c.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-4">
            {[leftCareer, rightCareer].map(c => (
              <div key={c.id} className="glass-card rounded-xl p-4 space-y-3">
                <p className="font-display font-bold text-sm" style={{ color: c.color }}>{c.icon} {c.name}</p>
                <div>
                  <p className="font-body text-xs font-semibold mb-1.5" style={{ color: '#22c55e' }}>✅ Pros</p>
                  {c.pros.map(p => (
                    <div key={p} className="flex items-start gap-1.5 mb-1">
                      <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                      <span className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-body text-xs font-semibold mb-1.5" style={{ color: '#ef4444' }}>⚠️ Cons</p>
                  {c.cons.map(p => (
                    <div key={p} className="flex items-start gap-1.5 mb-1">
                      <X size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                      <span className="font-body text-xs" style={{ color: 'var(--text-primary)' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!leftCareer || !rightCareer) && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <ArrowLeftRight size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <p className="font-display font-semibold" style={{ color: 'var(--text-muted)' }}>Select two career paths to compare</p>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            B.Tech vs BCA, MBBS vs B.Pharm, CA vs MBA — compare anything!
          </p>
        </div>
      )}
    </div>
  )
}
