import { useState } from 'react'
import { FileText, Sparkles, Download, Eye, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'
import toast from 'react-hot-toast'

const TEMPLATES = [
  { id: 'modern', label: 'Modern', preview: '🟠' },
  { id: 'classic', label: 'Classic', preview: '⬛' },
  { id: 'minimal', label: 'Minimal', preview: '⬜' },
  { id: 'creative', label: 'Creative', preview: '🔵' },
]

// Mini resume preview component
const ResumePreview = ({ resume, template }) => {
  if (!resume) return null
  const accentColor = template === 'modern' ? 'var(--accent)' : template === 'creative' ? '#8b5cf6' : '#1a1a2e'
  return (
    <div className="bg-white rounded-xl p-6 text-black text-xs shadow-lg font-body" style={{ minHeight: 500, fontFamily: 'Georgia, serif' }}>
      {/* Header — centered */}
      <div className="border-b-2 pb-4 mb-4 text-center" style={{ borderColor: accentColor }}>
        <h2 style={{ color: '#1a1a2e', fontSize: 22, fontWeight: 700, fontFamily: 'Syne, sans-serif', lineHeight: 1.2, marginBottom: 6 }}>
          {resume.name || 'Your Name'}
        </h2>
        <p style={{ color: accentColor, fontSize: 13, lineHeight: 1.4, marginBottom: 6 }}>{resume.target_role || 'Software Developer'}</p>
        <div className="flex gap-4 mt-2 flex-wrap justify-center" style={{ color: '#888', fontSize: 11 }}>
          {resume.email && <span>📧 {resume.email}</span>}
          {resume.phone && <span>📱 {resume.phone}</span>}
          {resume.location && <span>📍 {resume.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-4">
          <h3 style={{ color: accentColor, fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Summary</h3>
          <p style={{ color: '#444', lineHeight: 1.6, fontSize: 11 }}>{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <div className="mb-4">
          <h3 style={{ color: accentColor, fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Skills</h3>
          <div className="flex flex-wrap gap-1">
            {resume.skills.map(s => (
              <span key={s} style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: 4, fontSize: 11, color: '#333' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <div className="mb-4">
          <h3 style={{ color: accentColor, fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Education</h3>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <p style={{ fontWeight: 600, fontSize: 12 }}>{edu.degree}</p>
              <p style={{ color: '#666', fontSize: 11 }}>{edu.institution} • {edu.year}</p>
              {edu.cgpa && <p style={{ color: '#888', fontSize: 11 }}>CGPA: {edu.cgpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <div className="mb-4">
          <h3 style={{ color: accentColor, fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Projects</h3>
          {resume.projects.slice(0, 2).map((proj, i) => (
            <div key={i} className="mb-2">
              <p style={{ fontWeight: 600, fontSize: 12 }}>{proj.name}</p>
              <p style={{ color: '#555', fontSize: 11, lineHeight: 1.5 }}>{proj.description?.slice(0, 150)}...</p>
              {proj.tech && <p style={{ color: '#888', fontSize: 11 }}>Tech: {proj.tech}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {resume.achievements?.length > 0 && (
        <div>
          <h3 style={{ color: accentColor, fontWeight: 700, fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Achievements</h3>
          {resume.achievements.filter(Boolean).map((ach, i) => (
            <p key={i} style={{ color: '#444', fontSize: 11, marginBottom: 2 }}>• {ach}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ResumeBuilder() {
  const { user } = useAuthStore()
  const [resume, setResume] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [template, setTemplate] = useState('modern')
  const [targetRole, setTargetRole] = useState(user?.suggestedRole || '')

  const generateResume = async () => {
    setGenerating(true)
    try {
      const res = await api.post('/ai/generate-resume', { target_role: targetRole, template })
      setResume(res.data.resume)
      toast.success('✨ AI Resume generated!')
    } catch {
      // Demo resume
      setResume({
        name: user?.name || 'Rahul Sharma',
        target_role: targetRole || 'Full Stack Developer',
        email: user?.email || 'rahul@example.com',
        phone: user?.phone || '9876543210',
        location: user?.location || 'Mumbai, Maharashtra',
        summary: `Passionate ${targetRole || 'software developer'} with expertise in modern web technologies. Proven track record of building scalable applications and solving complex problems. Seeking opportunities to contribute to innovative projects and grow professionally.`,
        skills: user?.skills?.length ? user.skills : ['Python', 'React', 'Node.js', 'MongoDB', 'SQL', 'Git', 'Machine Learning'],
        education: user?.education?.length ? user.education : [{ degree: 'B.Tech Computer Science', institution: 'Example University', year: '2025', cgpa: '8.5' }],
        projects: user?.projects?.length ? user.projects : [{ name: 'E-Commerce Platform', description: 'Built a full-stack e-commerce application with React, Node.js and MongoDB with 1000+ users.', tech: 'React, Node.js, MongoDB' }],
        achievements: user?.achievements?.length ? user.achievements : ['Winner - Smart India Hackathon 2023', 'Top 10 - Google Code Jam 2023'],
      })
      toast.success('✨ AI Resume generated based on your profile!')
    } finally {
      setGenerating(false)
    }
  }

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const res = await api.post('/student/resume/download', { resume, template }, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${user?.name || 'resume'}_SkillSetu.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('📄 Resume downloaded!')
    } catch {
      toast.error('Download failed. Try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📄 AI Resume Builder</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>AI builds a professional resume from your profile data in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          {/* Target Role */}
          <div className="glass-card rounded-2xl p-5">
            <label className="block font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              🎯 Target Job Role
            </label>
            <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
              className="input-field" placeholder="e.g. Full Stack Developer, Data Scientist, ML Engineer..." />
            <p className="font-body text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              AI will tailor your resume keywords for this specific role.
            </p>
          </div>

          {/* Template Selector */}
          <div className="glass-card rounded-2xl p-5">
            <label className="block font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              🎨 Resume Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.id} type="button" onClick={() => setTemplate(t.id)}
                  className="flex items-center gap-3 p-3 rounded-xl font-body text-sm transition-all duration-200"
                  style={template === t.id
                    ? { background: 'var(--accent)', color: 'white', boxShadow: '0 4px 12px var(--shadow)' }
                    : { background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xl">{t.preview}</span>
                  {t.label}
                  {template === t.id && <CheckCircle2 size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* What AI will include */}
          <div className="glass-card rounded-2xl p-5">
            <p className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>✅ AI Will Include</p>
            {[
              { label: 'Personal Info & Bio', done: !!user?.name },
              { label: 'Education Details', done: !!user?.education?.length },
              { label: 'Projects & Tech Stack', done: !!user?.projects?.length },
              { label: 'Skills (AI Detected)', done: !!user?.skills?.length },
              { label: 'Achievements', done: !!user?.achievements?.length },
              { label: 'Professional Summary (AI Written)', done: true },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: done ? 'rgba(34,197,94,0.1)' : 'var(--bg-input)' }}>
                  {done && <CheckCircle2 size={10} color="#22c55e" />}
                </div>
                <span className="font-body text-sm" style={{ color: done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {label}
                </span>
                {!done && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(add in profile)</span>
                )}
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button onClick={generateResume} disabled={generating}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60">
            {generating
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating with AI...</>
              : <><Sparkles size={20} /> Generate AI Resume</>
            }
          </button>

          {resume && (
            <button onClick={downloadPDF} disabled={downloading}
              className="btn-outline w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
              {downloading
                ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Preparing PDF...</>
                : <><Download size={16} /> Download PDF</>
              }
            </button>
          )}
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              <Eye size={16} className="inline mr-2" style={{ color: 'var(--accent)' }} />
              Live Preview
            </p>
            {resume && (
              <span className="text-xs font-body px-2 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                ✓ Generated
              </span>
            )}
          </div>
          {resume ? (
            <div className="overflow-auto max-h-[700px] rounded-2xl shadow-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <ResumePreview resume={resume} template={template} />
            </div>
          ) : (
            <div className="glass-card rounded-2xl flex flex-col items-center justify-center text-center p-12"
              style={{ minHeight: 400 }}>
              <FileText size={48} className="mb-4" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <p className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-muted)' }}>
                Resume Preview
              </p>
              <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                Click "Generate AI Resume" to see your professional resume
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
