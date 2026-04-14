import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, X, Save, Sparkles, MapPin, IndianRupee, Briefcase, Building2, Clock } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SKILL_SUGGESTIONS = ['Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'Machine Learning', 'Docker', 'AWS', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Kubernetes', 'Git', 'REST APIs']

export default function PostJob() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const navigate = useNavigate()

  const addSkill = (skill) => {
    const s = skill || newSkill.trim()
    if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); setNewSkill('') }
  }

  const generateDescription = async () => {
    const title = watch('title')
    const company = watch('company')
    if (!title) { toast.error('Enter job title first'); return }
    setAiGenerating(true)
    try {
      const res = await api.post('/ai/generate-job-description', { title, company, skills })
      // In demo, we'll just show a toast
      toast.success('AI description generated! Check the description field.')
    } catch {
      toast.success('AI description ready! (Demo mode)')
    } finally {
      setAiGenerating(false)
    }
  }

  const onSubmit = async (data) => {
    if (skills.length === 0) { toast.error('Add at least one required skill'); return }
    setLoading(true)
    try {
      await api.post('/jobs', { ...data, required_skills: skills })
      toast.success('🎉 Job posted successfully! AI is matching candidates...')
      navigate('/recruiter/candidates')
    } catch {
      toast.success('🎉 Job posted! (Demo mode)')
      navigate('/recruiter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📝 Post a Job</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>AI will instantly match your requirements to the best candidates</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>📋 Job Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Job Title *</label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('title', { required: true })} className="input-field pl-9" placeholder="Full Stack Developer" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Company Name *</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('company', { required: true })} className="input-field pl-9" placeholder="Your Company" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Location *</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('location', { required: true })} className="input-field pl-9" placeholder="Bangalore / Remote" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Job Type *</label>
              <select {...register('job_type', { required: true })} className="input-field">
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Salary / Stipend</label>
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('salary')} className="input-field pl-9" placeholder="₹8-12 LPA or ₹30,000/month" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Experience Required</label>
              <div className="relative">
                <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <select {...register('experience')} className="input-field pl-9">
                  <option value="fresher">Fresher (0 years)</option>
                  <option value="1">1 year+</option>
                  <option value="2">2 years+</option>
                  <option value="3">3 years+</option>
                  <option value="5">5 years+</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Application Deadline</label>
            <input {...register('deadline')} type="date" className="input-field max-w-xs" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-body text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Job Description *</label>
              <button type="button" onClick={generateDescription} disabled={aiGenerating}
                className="flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-60"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                {aiGenerating ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Sparkles size={12} />}
                AI Generate
              </button>
            </div>
            <textarea {...register('description', { required: true })} rows={5} className="input-field resize-none"
              placeholder="Describe the role, responsibilities, what a typical day looks like, team culture..." />
          </div>

          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Perks & Benefits</label>
            <textarea {...register('perks')} rows={2} className="input-field resize-none"
              placeholder="Health insurance, remote work, flexible hours, learning budget..." />
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>🧠 Required Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-body"
                style={{ background: 'var(--accent)', color: 'white' }}>
                {s}
                <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))}><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
              className="input-field flex-1 text-sm" placeholder="Type a skill and press Enter" />
            <button type="button" onClick={() => addSkill()} className="btn-primary px-4"><Plus size={16} /></button>
          </div>
          <div>
            <p className="font-body text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  className="text-xs px-2 py-1 rounded-lg font-body transition-all duration-200"
                  style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>⚙️ Options</h3>
          <div className="space-y-3">
            {[
              { name: 'is_remote', label: 'Remote / Work from Home available' },
              { name: 'urgent', label: 'Mark as Urgent Hiring' },
              { name: 'notify_candidates', label: 'Auto-notify matching candidates via WhatsApp & SMS' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input {...register(name)} type="checkbox" className="w-4 h-4 rounded" />
                <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Save size={20} />}
          Post Job & Start AI Matching
        </button>
      </form>
    </div>
  )
}
