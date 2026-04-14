import { useState } from 'react'
import { Search, Filter, Eye, MessageSquare, Star, MapPin, GraduationCap, Code, X, Mail, Phone } from 'lucide-react'

const DEMO_CANDIDATES = [
  { id: 1, name: 'Priya Sharma', role: 'Full Stack Developer', location: 'Bangalore', match: 94, skills: ['React', 'Node.js', 'MongoDB', 'Python'], education: 'B.Tech CS, IIT Bombay 2024', avatar: 'PS', email: 'priya@email.com', phone: '9876543210', bio: 'Passionate developer with 2 years of experience building scalable applications.' },
  { id: 2, name: 'Rahul Verma', role: 'Full Stack Developer', location: 'Remote', match: 88, skills: ['React', 'Django', 'PostgreSQL', 'AWS'], education: 'B.Tech IT, NIT 2024', avatar: 'RV', email: 'rahul@email.com', phone: '9876543211', bio: 'Full stack developer with strong problem-solving skills and open source contributions.' },
  { id: 3, name: 'Anjali Singh', role: 'ML Engineer', location: 'Hyderabad', match: 85, skills: ['Python', 'TensorFlow', 'SQL', 'Scikit-learn'], education: 'M.Tech AI, IIT Delhi 2024', avatar: 'AS', email: 'anjali@email.com', phone: '9876543212', bio: 'ML researcher turned engineer. Published 2 research papers in NLP.' },
  { id: 4, name: 'Vikram Patel', role: 'Frontend Developer', location: 'Mumbai', match: 79, skills: ['React', 'TypeScript', 'CSS', 'Figma'], education: 'B.Sc CS, Mumbai University 2023', avatar: 'VP', email: 'vikram@email.com', phone: '9876543213', bio: 'Creative frontend developer with an eye for beautiful UI/UX design.' },
  { id: 5, name: 'Sneha Gupta', role: 'Backend Developer', location: 'Pune', match: 76, skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'], education: 'B.Tech CS, BITS Pilani 2024', avatar: 'SG', email: 'sneha@email.com', phone: '9876543214', bio: 'Backend specialist with experience in microservices architecture.' },
]

const CandidateDetail = ({ candidate, onClose, onContact }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
    <div className="w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0"
              style={{ background: 'var(--accent)' }}>
              {candidate.avatar}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{candidate.name}</h3>
              <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{candidate.role}</p>
              <p className="font-body text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={11} /> {candidate.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-sm font-display font-bold"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              {candidate.match}% Match
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{candidate.bio}</p>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2"><Code size={15} style={{ color: 'var(--accent)' }} /><span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Skills</span></div>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full font-body"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2"><GraduationCap size={15} style={{ color: 'var(--accent)' }} /><span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Education</span></div>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{candidate.education}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onContact('message', candidate)} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
            <MessageSquare size={16} /> Message
          </button>
          <button onClick={() => onContact('email', candidate)} className="btn-outline flex-1 flex items-center justify-center gap-2 py-2.5">
            <Mail size={16} /> Send Email
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default function Candidates() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [shortlisted, setShortlisted] = useState([])

  const filtered = DEMO_CANDIDATES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const handleContact = (type, candidate) => {
    if (type === 'message') { setSelected(null); alert(`Opening message chat with ${candidate.name}`) }
    else { window.open(`mailto:${candidate.email}?subject=Regarding your application on SkillSetu`) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>👥 AI-Matched Candidates</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Candidates ranked by AI match score for your job postings</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" placeholder="Search by name, skill, location..." />
        </div>
        <button className="btn-outline flex items-center gap-2 px-4"><Filter size={15} /> Filter</button>
      </div>

      <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} candidates matched</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(c => {
          const isShortlisted = shortlisted.includes(c.id)
          return (
            <div key={c.id} className="glass-card-hover rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display font-bold flex-shrink-0"
                  style={{ background: 'var(--accent)' }}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                      <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{c.role}</p>
                      <p className="font-body text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <MapPin size={11} /> {c.location}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="font-display font-black text-xl" style={{ color: c.match >= 90 ? '#22c55e' : c.match >= 80 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {c.match}%
                      </div>
                      <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>match</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.skills.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-lg font-body"
                    style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    {s}
                  </span>
                ))}
              </div>

              <p className="font-body text-xs mb-4 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <GraduationCap size={11} /> {c.education}
              </p>

              <div className="flex gap-2">
                <button onClick={() => setSelected(c)} className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2 text-sm">
                  <Eye size={14} /> View Profile
                </button>
                <button onClick={() => setShortlisted(prev => isShortlisted ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={isShortlisted ? { background: 'var(--accent)', color: 'white' } : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                  <Star size={15} className={isShortlisted ? 'fill-current' : ''} />
                </button>
                <button onClick={() => handleContact('message', c)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <MessageSquare size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selected && <CandidateDetail candidate={selected} onClose={() => setSelected(null)} onContact={handleContact} />}
    </div>
  )
}
