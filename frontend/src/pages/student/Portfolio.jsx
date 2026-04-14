import { useParams } from 'react-router-dom'
import { Globe, Github, Linkedin, Mail, MapPin, ExternalLink, Award, Code, GraduationCap } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Portfolio({ isPublic = false }) {
  const { username } = useParams()
  const { user } = useAuthStore()

  // In production, fetch user by username for public view
  const profile = isPublic ? null : user
  const data = {
    name: profile?.name || 'Rahul Sharma',
    title: profile?.suggestedRole || 'Full Stack Developer',
    bio: profile?.bio || 'Passionate developer with expertise in modern web technologies. Building innovative solutions that make a difference.',
    location: profile?.location || 'Mumbai, Maharashtra',
    email: profile?.email || 'rahul@example.com',
    skills: profile?.skills || ['Python', 'React', 'Node.js', 'MongoDB', 'Machine Learning', 'SQL', 'Docker', 'AWS'],
    education: profile?.education || [{ degree: 'B.Tech Computer Science', institution: 'Example University', year: '2025', cgpa: '8.5' }],
    projects: profile?.projects || [
      { name: 'SkillSetu Platform', description: 'AI-powered career bridge platform connecting students to opportunities. Built with React and Python FastAPI.', tech: 'React, Python, AI', link: '#' },
      { name: 'ML Price Predictor', description: 'Machine learning model to predict house prices with 94% accuracy using regression algorithms.', tech: 'Python, Scikit-learn, Pandas', link: '#' },
    ],
    achievements: profile?.achievements || ['Winner - Smart India Hackathon 2023', 'Top 10 - Google Code Jam 2023', 'Best Project Award - College Tech Fest 2022'],
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8 relative">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-white font-display font-black text-5xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            {data.name[0]}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display font-black text-4xl text-white mb-2">{data.name}</h1>
            <p className="font-body text-xl text-white/80 mb-3">{data.title}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-white/70 text-sm font-body">
              <span className="flex items-center gap-1"><MapPin size={14} /> {data.location}</span>
              <a href={`mailto:${data.email}`} className="flex items-center gap-1 hover:text-white"><Mail size={14} /> {data.email}</a>
            </div>
          </div>
          <div className="sm:ml-auto flex gap-3">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Github size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Globe size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Bio */}
        <div className="glass-card rounded-2xl p-6">
          <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.bio}</p>
        </div>

        {/* Skills */}
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

        {/* Projects */}
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
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} style={{ color: 'var(--accent)' }} /></a>}
                </div>
                <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>🛠 {p.tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Education</h2>
          </div>
          {data.education.map((e, i) => (
            <div key={i}>
              <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{e.degree}</p>
              <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{e.institution} · Class of {e.year}</p>
              {e.cgpa && <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>CGPA: {e.cgpa}</p>}
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} style={{ color: 'var(--accent)' }} />
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Achievements</h2>
          </div>
          {data.achievements.filter(Boolean).map((a, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <span style={{ color: 'var(--accent)' }}>🏆</span>
              <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{a}</p>
            </div>
          ))}
        </div>

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
