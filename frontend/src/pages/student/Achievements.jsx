import { useState, useEffect } from 'react'
import { Trophy, Star, Award, CheckCircle, Lock, Sparkles, Target, FileText, Briefcase, MessageSquare, Mic, User, Map } from 'lucide-react'
import api from '@/services/api'

const BADGES = [
  { id: 'profile_complete', name: 'Profile Pro', desc: 'Complete your profile to 100%', icon: User, color: '#3b82f6', category: 'Getting Started',
    check: (p) => (p.profile_strength || 0) >= 100 },
  { id: 'skills_added', name: 'Skill Collector', desc: 'Add at least 5 skills to your profile', icon: Star, color: '#f59e0b', category: 'Getting Started',
    check: (p) => (p.skills || []).length >= 5 },
  { id: 'resume_built', name: 'Resume Master', desc: 'Build your first AI resume', icon: FileText, color: '#22c55e', category: 'Career Ready',
    check: (p) => p.has_resume },
  { id: 'first_apply', name: 'Go-Getter', desc: 'Apply to your first job', icon: Briefcase, color: '#8b5cf6', category: 'Career Ready',
    check: (p) => (p.applications_count || 0) >= 1 },
  { id: 'five_apply', name: 'Hustler', desc: 'Apply to 5 or more jobs', icon: Target, color: '#ec4899', category: 'Career Ready',
    check: (p) => (p.applications_count || 0) >= 5 },
  { id: 'interview_done', name: 'Interview Ready', desc: 'Complete an AI mock interview', icon: Mic, color: '#ef4444', category: 'Skill Building',
    check: (p) => p.mock_interviews_done >= 1 },
  { id: 'roadmap_explored', name: 'Path Finder', desc: 'Explore the Career Roadmap', icon: Map, color: '#06b6d4', category: 'Exploration',
    check: (p) => p.roadmap_viewed },
  { id: 'message_sent', name: 'Connector', desc: 'Send your first message to a recruiter', icon: MessageSquare, color: '#14b8a6', category: 'Networking',
    check: (p) => (p.messages_sent || 0) >= 1 },
  { id: 'offered', name: 'Dream Achieved 🏆', desc: 'Receive a job offer!', icon: Trophy, color: '#f97316', category: 'Ultimate',
    check: (p) => p.has_offer },
  { id: 'portfolio_live', name: 'Digital Presence', desc: 'Make your portfolio page live', icon: Sparkles, color: '#a855f7', category: 'Networking',
    check: (p) => p.portfolio_live },
]

export default function Achievements() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/student/profile')
        const p = res.data?.data || {}
        // Derive extra fields
        p.has_resume = !!(p.generated_resume_url || p.resume_data)
        p.mock_interviews_done = p.mock_interviews_done || 0
        p.roadmap_viewed = true // If they're here, they've navigated
        p.has_offer = (p.applications || []).some(a => a.status === 'offered')
        p.messages_sent = p.messages_sent || 0
        p.portfolio_live = !!(p.username)
        p.applications_count = p.applications_count || 0
        setProfile(p)
      } catch {
        // Demo fallback
        setProfile({
          profile_strength: 75,
          skills: ['React', 'Python', 'SQL', 'JavaScript', 'Node.js', 'MongoDB'],
          has_resume: true,
          applications_count: 3,
          mock_interviews_done: 1,
          roadmap_viewed: true,
          has_offer: false,
          messages_sent: 2,
          portfolio_live: true,
        })
      } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const earned = profile ? BADGES.filter(b => b.check(profile)) : []
  const locked = profile ? BADGES.filter(b => !b.check(profile)) : []
  const progress = BADGES.length > 0 ? Math.round((earned.length / BADGES.length) * 100) : 0

  const categories = [...new Set(BADGES.map(b => b.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>🏆 Achievement Badges</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Complete milestones to earn badges and showcase them on your portfolio</p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Trophy size={24} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{earned.length} / {BADGES.length} Badges Earned</p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Keep going — unlock all badges to become a SkillSetu Champion!</p>
            </div>
          </div>
          <span className="font-display font-black text-2xl" style={{ color: 'var(--accent)' }}>{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
          <div className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent), #8b5cf6)' }} />
        </div>
      </div>

      {/* Badges by Category */}
      {categories.map(cat => {
        const catBadges = BADGES.filter(b => b.category === cat)
        return (
          <div key={cat}>
            <h3 className="font-display font-semibold text-sm mb-3 px-1" style={{ color: 'var(--text-secondary)' }}>{cat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catBadges.map(badge => {
                const isEarned = profile && badge.check(profile)
                const Icon = badge.icon
                return (
                  <div key={badge.id}
                    className="rounded-2xl p-4 flex items-center gap-4 transition-all duration-300"
                    style={{
                      background: isEarned ? `${badge.color}12` : 'var(--bg-card)',
                      border: `1.5px solid ${isEarned ? badge.color : 'var(--border-subtle)'}`,
                      opacity: isEarned ? 1 : 0.6,
                      boxShadow: isEarned ? `0 4px 20px ${badge.color}20` : 'none',
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isEarned ? `${badge.color}25` : 'var(--bg-input)' }}>
                      {isEarned
                        ? <Icon size={22} style={{ color: badge.color }} />
                        : <Lock size={18} style={{ color: 'var(--text-muted)' }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-sm" style={{ color: isEarned ? badge.color : 'var(--text-primary)' }}>
                          {badge.name}
                        </p>
                        {isEarned && <CheckCircle size={14} style={{ color: '#22c55e' }} />}
                      </div>
                      <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{badge.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
