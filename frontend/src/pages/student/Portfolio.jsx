import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Globe, Github, Linkedin, Mail, MapPin, ExternalLink, Award, Code, GraduationCap, Edit, Share2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function Portfolio({ isPublic = false }) {
  const { username } = useParams()
  const { user } = useAuthStore()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isPublic) {
          // Authenticated view — fetch own profile
          const res = await api.get('/student/profile')
          const d = res.data?.data || res.data
          setProfileData({
            name: d.name || user?.name,
            title: d.suggested_role || d.career_goal || 'Student',
            bio: d.bio || '',
            location: d.location || 'India',
            email: d.email || user?.email,
            github_url: d.github_url,
            linkedin_url: d.linkedin_url,
            portfolio_url: d.portfolio_url,
            skills: d.skills || [],
            education: d.education || [],
            projects: d.projects || [],
            achievements: d.achievements?.filter(Boolean) || [],
            certificates: d.certificates || [],
          })
        } else {
          // Public portfolio — for now, use demo  
          setProfileData(null)
        }
      } catch {
        setProfileData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [isPublic, username, user])

  const data = profileData || {
    name: user?.name || 'Rahul Sharma',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with expertise in modern web technologies. Building innovative solutions that make a difference.',
    location: 'Mumbai, Maharashtra',
    email: user?.email || 'rahul@example.com',
    github_url: null,
    linkedin_url: null,
    portfolio_url: null,
    skills: ['Python', 'React', 'Node.js', 'MongoDB', 'Machine Learning', 'SQL', 'Docker', 'AWS'],
    education: [{ degree: 'B.Tech Computer Science', institution: 'Example University', year: '2025', cgpa: '8.5' }],
    projects: [
      { name: 'SkillSetu Platform', description: 'AI-powered career bridge platform connecting students to opportunities. Built with React and Python FastAPI.', tech: 'React, Python, AI', link: '#' },
      { name: 'ML Price Predictor', description: 'Machine learning model to predict house prices with 94% accuracy using regression algorithms.', tech: 'Python, Scikit-learn, Pandas', link: '#' },
    ],
    achievements: ['Winner - Smart India Hackathon 2023', 'Top 10 - Google Code Jam 2023', 'Best Project Award - College Tech Fest 2022'],
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => toast.success('Portfolio link copied!')).catch(() => toast.error('Copy failed'))
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="h-60 skeleton" />
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8 relative">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center font-display font-black text-5xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'var(--neon-box-text)' }}>
            {data.name[0]}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-display font-black text-4xl mb-2" style={{ color: 'var(--neon-box-text)' }}>{data.name}</h1>
            <p className="font-body text-xl mb-3" style={{ color: 'var(--neon-box-text)', opacity: 0.8 }}>{data.title || 'Student'}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm font-body" style={{ color: 'var(--neon-box-text)', opacity: 0.7 }}>
              {data.location && <span className="flex items-center gap-1"><MapPin size={14} /> {data.location}</span>}
              {data.email && <a href={`mailto:${data.email}`} className="flex items-center gap-1" style={{ color: 'var(--neon-box-text)' }}><Mail size={14} /> {data.email}</a>}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0 flex-wrap justify-center">
            {data.github_url && (
              <a href={data.github_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--neon-box-text)' }}>
                <Github size={18} />
              </a>
            )}
            {data.linkedin_url && (
              <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--neon-box-text)' }}>
                <Linkedin size={18} />
              </a>
            )}
            {data.portfolio_url && (
              <a href={data.portfolio_url} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--neon-box-text)' }}>
                <Globe size={18} />
              </a>
            )}
            <button onClick={handleShare}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--neon-box-text)' }}
              title="Share portfolio">
              <Share2 size={18} />
            </button>
            {!isPublic && (
              <Link to="/student/profile"
                className="flex items-center gap-2 px-4 h-10 rounded-xl transition-colors text-sm font-body"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--neon-box-text)' }}>
                <Edit size={15} /> Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Bio */}
        {data.bio && (
          <div className="glass-card rounded-2xl p-6">
            <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.bio}</p>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code size={18} style={{ color: 'var(--accent)' }} />
              <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-full text-sm font-body font-medium"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code size={18} style={{ color: 'var(--accent)' }} />
              <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.projects.map((p, i) => (
                <div key={i} className="glass-card-hover rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                    {p.link && p.link !== '#' && <a href={p.link} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} style={{ color: 'var(--accent)' }} /></a>}
                  </div>
                  <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
                  {p.tech && <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>🛠 {p.tech}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
              <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Education</h2>
            </div>
            <div className="space-y-3">
              {data.education.filter(e => e.degree || e.institution).map((e, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                    <GraduationCap size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{e.degree}</p>
                    <p className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>{e.institution}{e.year ? ` · ${e.year}` : ''}</p>
                    {e.cgpa && <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>CGPA: {e.cgpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(Boolean).length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} style={{ color: 'var(--accent)' }} />
              <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Achievements</h2>
            </div>
            <div className="space-y-2">
              {data.achievements.filter(Boolean).map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                  <span className="text-lg">🏆</span>
                  <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for new profiles */}
        {!data.bio && data.skills.length === 0 && data.projects.length === 0 && !isPublic && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-light)' }}>
              <Edit size={28} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Your portfolio is empty</h3>
            <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Complete your profile to build a stunning portfolio that showcases your skills to recruiters!</p>
            <Link to="/student/profile" className="btn-primary inline-flex items-center gap-2">
              <Edit size={16} /> Complete Profile
            </Link>
          </div>
        )}

        {/* SkillSetu badge */}
        <div className="text-center">
          <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
            Portfolio powered by{' '}
            <a href="/" className="font-semibold" style={{ color: 'var(--accent)' }}>SkillSetu</a>
            {' '}— Kaushal se Rojgar tak
          </p>
        </div>
      </div>
    </div>
  )
}
