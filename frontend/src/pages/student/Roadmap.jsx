import { useState, useEffect } from 'react'
import { ExternalLink, Check, Lock, Play, RefreshCw, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'
import toast from 'react-hot-toast'

// ── Empty state shown to fresh users ────────────────────────
const EmptyRoadmap = ({ goalInput, setGoalInput, generateRoadmap, generating }) => (
  <div className="glass-card rounded-2xl p-12 text-center">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-5xl"
      style={{ background: 'var(--accent-light)' }}>
      🗺️
    </div>
    <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
      No roadmap yet
    </h3>
    <p className="font-body text-sm mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
      Tell us your dream career and we'll build a personalized step-by-step learning path just for you.
    </p>
    <div className="flex gap-3 max-w-md mx-auto">
      <input
        value={goalInput}
        onChange={e => setGoalInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && generateRoadmap()}
        className="input-field flex-1"
        placeholder="e.g. Full Stack Developer, Data Scientist..." />
      <button onClick={generateRoadmap} disabled={generating || !goalInput.trim()}
        className="btn-primary px-5 flex items-center gap-2 disabled:opacity-50">
        {generating
          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <Sparkles size={16} />}
        Generate
      </button>
    </div>
  </div>
)

// ── Single step card ─────────────────────────────────────────
const StepCard = ({ step, onToggle }) => {
  const done      = step.status === 'done'
  const inProgress= step.status === 'in-progress'
  const typeColor = {
    course:        { bg: 'rgba(249,115,22,0.1)',  color: '#f97316', label: 'Course'  },
    project:       { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e', label: 'Project' },
    degree:        { bg: 'rgba(168,85,247,0.1)',  color: '#a855f7', label: 'Degree'  },
    certification: { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', label: 'Cert'    },
    exam:          { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', label: 'Exam'    },
  }[step.type] || { bg: 'var(--accent-light)', color: 'var(--accent)', label: step.type }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 glass-card-hover"
      style={{ opacity: step.status === 'pending' ? 0.75 : 1 }}>
      {/* Checkbox */}
      <button onClick={() => onToggle(step.id)}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
        style={done
          ? { background: '#22c55e', color: 'white' }
          : inProgress
          ? { background: 'var(--accent)', color: 'white' }
          : { background: 'var(--bg-input)', border: '2px solid var(--border)', color: 'transparent' }}>
        {done && <Check size={14} />}
        {inProgress && <Play size={12} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{step.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: typeColor.bg, color: typeColor.color }}>
            {typeColor.label}
          </span>
          {step.free && (
            <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              Free
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
          {step.platform && <span>📚 {step.platform}</span>}
          {step.exam     && <span>📝 Exam: {step.exam}</span>}
          {step.duration && <span>⏱ {step.duration}</span>}
        </div>
      </div>

      {/* External link */}
      {step.link && (
        <a href={step.link} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  )
}

export default function Roadmap() {
  const { user } = useAuthStore()
  const [roadmap,    setRoadmap]    = useState(null)
  const [generating, setGenerating] = useState(false)
  const [goalInput,  setGoalInput]  = useState('')
  const [loading,    setLoading]    = useState(true)

  // ── Load saved roadmap from backend on mount ──────────────
  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const res = await api.get('/student/profile')
        const savedRoadmap = res.data.data?.ai_roadmap
        const savedGoal    = res.data.data?.career_goal
        if (savedRoadmap && savedRoadmap.phases) {
          setRoadmap(savedRoadmap)
          if (savedGoal) setGoalInput(savedGoal)
        }
        // else: no roadmap yet — show empty state
      } catch {
        // network error — show empty state
      } finally {
        setLoading(false)
      }
    }
    loadRoadmap()
  }, [])

  const generateRoadmap = async () => {
    if (!goalInput.trim()) {
      toast.error('Please enter your career goal first!')
      return
    }
    setGenerating(true)
    try {
      const profileRes = await api.get('/student/profile')
      const profile    = profileRes.data.data || {}
      const res = await api.post('/ai/generate-roadmap', {
        goal:           goalInput.trim(),
        current_skills: profile.skills     || [],
        education:      profile.education  || [],
      })
      const newRoadmap = res.data.data
      setRoadmap(newRoadmap)
      toast.success('🗺️ Your personalized roadmap is ready!')
    } catch {
      // Demo fallback when AI is not configured
      const demo = {
        goal: goalInput,
        totalSteps: 8,
        phases: [
          {
            phase: 1, title: 'Foundation', status: 'in-progress',
            steps: [
              { id: 1, title: 'HTML & CSS Basics',       type: 'course', platform: 'FreeCodeCamp', link: 'https://freecodecamp.org', duration: '2 weeks', status: 'in-progress', free: true },
              { id: 2, title: 'JavaScript Fundamentals', type: 'course', platform: 'The Odin Project', link: 'https://theodinproject.com', duration: '3 weeks', status: 'pending', free: true },
            ],
          },
          {
            phase: 2, title: 'Core Skills', status: 'locked',
            steps: [
              { id: 3, title: `${goalInput} — Main Course`, type: 'course', platform: 'Coursera', link: 'https://coursera.org', duration: '4 weeks', status: 'pending', free: false },
              { id: 4, title: 'Build 2 Real Projects', type: 'project', platform: 'Self', duration: '3 weeks', status: 'pending', free: true },
            ],
          },
          {
            phase: 3, title: 'Degree & Certification', status: 'locked',
            steps: [
              { id: 5, title: 'B.Tech / BCA CS (Recommended)', type: 'degree', exam: 'JEE Mains / CUET', duration: '3-4 years', status: 'pending', free: false },
              { id: 6, title: 'Relevant Certification',        type: 'certification', platform: 'Coursera', link: 'https://coursera.org', duration: '1 month', status: 'pending', free: false },
            ],
          },
          {
            phase: 4, title: 'Job Ready', status: 'locked',
            steps: [
              { id: 7, title: 'Build Portfolio Website',  type: 'project', platform: 'Self', duration: '1 week', status: 'pending', free: true },
              { id: 8, title: 'Apply via SkillSetu 🚀',   type: 'project', platform: 'SkillSetu', duration: 'Ongoing', status: 'pending', free: true },
            ],
          },
        ],
      }
      setRoadmap(demo)
      toast.success('🗺️ Roadmap generated! (Demo mode — add Gemini API key for AI roadmap)')
    } finally {
      setGenerating(false)
    }
  }

  const toggleStep = (stepId) => {
    setRoadmap(prev => {
      if (!prev) return prev
      return {
        ...prev,
        phases: prev.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(step => {
            if (step.id !== stepId) return step
            const cycle = { 'pending': 'in-progress', 'in-progress': 'done', 'done': 'pending' }
            return { ...step, status: cycle[step.status] || 'in-progress' }
          }),
        })),
      }
    })
  }

  // Progress calculation
  const allSteps    = roadmap?.phases?.flatMap(p => p.steps) || []
  const doneSteps   = allSteps.filter(s => s.status === 'done').length
  const totalSteps  = allSteps.length
  const progress    = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            🗺️ Career Roadmap
          </h2>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            AI-generated personalized learning path to your dream career
          </p>
        </div>
        {roadmap && (
          <button onClick={() => { setRoadmap(null); setGoalInput('') }}
            className="btn-outline flex items-center gap-2 text-sm py-2">
            <RefreshCw size={14} /> New Roadmap
          </button>
        )}
      </div>

      {/* Goal input (always visible) */}
      {!roadmap && (
        <EmptyRoadmap
          goalInput={goalInput}
          setGoalInput={setGoalInput}
          generateRoadmap={generateRoadmap}
          generating={generating}
        />
      )}

      {/* Goal input bar when roadmap exists */}
      {roadmap && (
        <div className="glass-card rounded-2xl p-4">
          <p className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
            ✨ Generate a different roadmap
          </p>
          <div className="flex gap-3">
            <input value={goalInput} onChange={e => setGoalInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateRoadmap()}
              className="input-field flex-1 text-sm" placeholder="Enter new career goal..." />
            <button onClick={generateRoadmap} disabled={generating || !goalInput.trim()}
              className="btn-primary px-4 flex items-center gap-2 disabled:opacity-50 text-sm">
              {generating
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Sparkles size={14} />}
              Generate
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {roadmap && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Path to: <span style={{ color: 'var(--accent)' }}>{roadmap.goal}</span>
              </h3>
              <p className="font-body text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {doneSteps} of {totalSteps} steps completed
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {progress}%
            </div>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'var(--accent)', boxShadow: '0 0 10px var(--shadow)' }} />
          </div>
        </div>
      )}

      {/* Phases */}
      {roadmap?.phases?.map(phase => (
        <div key={phase.phase} className="glass-card rounded-2xl overflow-hidden">
          {/* Phase header */}
          <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm"
              style={phase.status === 'completed'
                ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' }
                : phase.status === 'in-progress'
                ? { background: 'var(--accent-light)', color: 'var(--accent)' }
                : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
              {phase.status === 'completed' ? <Check size={16} />
                : phase.status === 'locked'    ? <Lock size={14} />
                : `0${phase.phase}`}
            </div>
            <div>
              <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Phase {phase.phase}: {phase.title}
              </p>
              <p className="font-body text-xs capitalize" style={{
                color: phase.status === 'completed' ? '#22c55e'
                  : phase.status === 'in-progress'  ? 'var(--accent)'
                  : 'var(--text-muted)'
              }}>
                {phase.status?.replace('-', ' ')}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="p-4 space-y-2">
            {phase.steps?.map(step => (
              <StepCard key={step.id} step={step} onToggle={toggleStep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}