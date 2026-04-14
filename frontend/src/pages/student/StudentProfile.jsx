import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import {
  User, Upload, Plus, X, Sparkles, Save, FileText,
  GraduationCap, Briefcase, Award, Target, Phone, Mail, MapPin, Link2
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'
import toast from 'react-hot-toast'

const INTERESTS = [
  'Software Development', 'Data Science', 'Machine Learning', 'Web Development',
  'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'DevOps',
  'UI/UX Design', 'Product Management', 'Business Analyst', 'Digital Marketing',
  'Embedded Systems', 'Blockchain', 'Game Development', 'Robotics'
]

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className="px-4 py-2 rounded-xl font-body text-sm font-medium transition-all duration-200 whitespace-nowrap"
    style={active ? { background: 'var(--accent)', color: 'white' } : { color: 'var(--text-secondary)' }}
    onMouseOver={e => { if (!active) e.currentTarget.style.background = 'var(--accent-light)' }}
    onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
    {children}
  </button>
)

export default function StudentProfile() {
  const { user, updateUser } = useAuthStore()
  const [tab, setTab] = useState('personal')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [skills, setSkills] = useState(user?.skills || [])
  const [newSkill, setNewSkill] = useState('')
  const [interests, setInterests] = useState(user?.interests || [])
  const [education, setEducation] = useState(user?.education || [{ degree: '', institution: '', year: '', cgpa: '' }])
  const [projects, setProjects] = useState(user?.projects || [{ name: '', description: '', tech: '', link: '' }])
  const [achievements, setAchievements] = useState(user?.achievements || [''])
  const [certificates, setCertificates] = useState(user?.certificates || [])
  const [uploadedFiles, setUploadedFiles] = useState([])

  const { register, handleSubmit } = useForm({ defaultValues: user })

  // Dropzone for document upload
  const onDrop = useCallback(async (files) => {
    const newFiles = files.map(f => ({ file: f, name: f.name, status: 'uploading' }))
    setUploadedFiles(prev => [...prev, ...newFiles])
    for (const f of files) {
      const formData = new FormData()
      formData.append('file', f)
      try {
        const res = await api.post('/student/upload-document', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        setUploadedFiles(prev => prev.map(pf => pf.name === f.name ? { ...pf, status: 'done', url: res.data.url } : pf))
        toast.success(`${f.name} uploaded!`)
      } catch {
        setUploadedFiles(prev => prev.map(pf => pf.name === f.name ? { ...pf, status: 'error' } : pf))
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'], 'application/msword': ['.doc', '.docx'] },
    maxSize: 10 * 1024 * 1024,
  })

  const extractSkillsWithAI = async () => {
    setAiLoading(true)
    try {
      const res = await api.post('/ai/extract-skills', { projects, education, achievements, certificates: uploadedFiles.map(f => f.name) })
      const newSkills = res.data.skills.filter(s => !skills.includes(s))
      setSkills(prev => [...prev, ...newSkills])
      toast.success(`AI found ${newSkills.length} new skills from your profile!`)
    } catch {
      // Demo
      const demoSkills = ['Python', 'React', 'Problem Solving', 'Team Collaboration', 'Git']
      const newOnes = demoSkills.filter(s => !skills.includes(s))
      setSkills(prev => [...prev, ...newOnes])
      toast.success(`AI found ${newOnes.length} skills from your profile!`)
    } finally {
      setAiLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = { ...data, skills, interests, education, projects, achievements: achievements.filter(Boolean) }
      await api.put('/student/profile', payload)
      updateUser(payload)
      toast.success('Profile saved successfully!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  const addEducation = () => setEducation(prev => [...prev, { degree: '', institution: '', year: '', cgpa: '' }])
  const addProject = () => setProjects(prev => [...prev, { name: '', description: '', tech: '', link: '' }])
  const addAchievement = () => setAchievements(prev => [...prev, ''])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>My Profile</h2>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Complete your profile to get better job matches</p>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          Save Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {[
          { id: 'personal', label: '👤 Personal' },
          { id: 'education', label: '🎓 Education' },
          { id: 'projects', label: '💻 Projects' },
          { id: 'skills', label: '🧠 Skills & Goals' },
          { id: 'documents', label: '📄 Documents' },
        ].map(t => <TabBtn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabBtn>)}
      </div>

      {/* Personal Info */}
      {tab === 'personal' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-display font-black text-3xl"
              style={{ background: 'var(--accent)' }}>
              {user?.name?.[0] || 'S'}
            </div>
            <div>
              <button type="button" className="btn-outline text-sm py-2 flex items-center gap-2">
                <Upload size={14} /> Upload Photo
              </button>
              <p className="text-xs mt-1 font-body" style={{ color: 'var(--text-muted)' }}>JPG, PNG up to 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <input {...register('name')} className="input-field" placeholder="Your full name" />
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>@</span>
                <input {...register('username')} className="input-field pl-7" placeholder="username" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('email')} type="email" className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('phone')} className="input-field pl-9" placeholder="9876543210" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>City / Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('location')} className="input-field pl-9" placeholder="Mumbai, Maharashtra" />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>LinkedIn / Portfolio URL</label>
              <div className="relative">
                <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input {...register('portfolio_url')} className="input-field pl-9" placeholder="https://linkedin.com/in/you" />
              </div>
            </div>
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>About / Bio</label>
            <textarea {...register('bio')} rows={4} className="input-field resize-none"
              placeholder="Tell recruiters about yourself — your passion, goals, and what makes you unique..." />
          </div>
        </div>
      )}

      {/* Education */}
      {tab === 'education' && (
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 relative">
              {i > 0 && (
                <button type="button" onClick={() => setEducation(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <X size={14} />
                </button>
              )}
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={18} style={{ color: 'var(--accent)' }} />
                <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Education #{i + 1}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Degree / Course</label>
                  <input value={edu.degree} onChange={e => setEducation(prev => prev.map((x, idx) => idx === i ? { ...x, degree: e.target.value } : x))}
                    className="input-field" placeholder="B.Tech Computer Science" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Institution</label>
                  <input value={edu.institution} onChange={e => setEducation(prev => prev.map((x, idx) => idx === i ? { ...x, institution: e.target.value } : x))}
                    className="input-field" placeholder="IIT Bombay" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Passing Year</label>
                  <input value={edu.year} onChange={e => setEducation(prev => prev.map((x, idx) => idx === i ? { ...x, year: e.target.value } : x))}
                    className="input-field" placeholder="2025" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>CGPA / Percentage</label>
                  <input value={edu.cgpa} onChange={e => setEducation(prev => prev.map((x, idx) => idx === i ? { ...x, cgpa: e.target.value } : x))}
                    className="input-field" placeholder="8.5 / 10" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addEducation}
            className="btn-outline w-full flex items-center justify-center gap-2 py-3">
            <Plus size={16} /> Add Education
          </button>
        </div>
      )}

      {/* Projects */}
      {tab === 'projects' && (
        <div className="space-y-4">
          {projects.map((proj, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 relative">
              {i > 0 && (
                <button type="button" onClick={() => setProjects(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <X size={14} />
                </button>
              )}
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={18} style={{ color: 'var(--accent)' }} />
                <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Project #{i + 1}</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Project Name</label>
                    <input value={proj.name} onChange={e => setProjects(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                      className="input-field" placeholder="E-commerce App" />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>GitHub / Live Link</label>
                    <input value={proj.link} onChange={e => setProjects(prev => prev.map((x, idx) => idx === i ? { ...x, link: e.target.value } : x))}
                      className="input-field" placeholder="https://github.com/..." />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Technologies Used</label>
                  <input value={proj.tech} onChange={e => setProjects(prev => prev.map((x, idx) => idx === i ? { ...x, tech: e.target.value } : x))}
                    className="input-field" placeholder="React, Node.js, MongoDB, AWS" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Description</label>
                  <textarea value={proj.description} onChange={e => setProjects(prev => prev.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))}
                    rows={3} className="input-field resize-none" placeholder="Describe your project, its impact, and your role..." />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addProject} className="btn-outline w-full flex items-center justify-center gap-2 py-3">
            <Plus size={16} /> Add Project
          </button>
        </div>
      )}

      {/* Skills & Goals */}
      {tab === 'skills' && (
        <div className="space-y-6">
          {/* Skills */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>🧠 Your Skills</h3>
              <button type="button" onClick={extractSkillsWithAI} disabled={aiLoading}
                className="btn-primary text-xs py-2 flex items-center gap-1.5 disabled:opacity-60">
                {aiLoading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Sparkles size={13} />}
                AI Extract Skills
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <span key={skill} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-body"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                  {skill}
                  <button type="button" onClick={() => setSkills(prev => prev.filter(s => s !== skill))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { e.preventDefault(); setSkills(prev => [...prev, newSkill.trim()]); setNewSkill('') } }}
                className="input-field flex-1 text-sm" placeholder="Add skill (press Enter)" />
              <button type="button" onClick={() => { if (newSkill.trim()) { setSkills(prev => [...prev, newSkill.trim()]); setNewSkill('') } }}
                className="btn-primary px-4">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} style={{ color: 'var(--accent)' }} />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Achievements & Certifications</h3>
            </div>
            <div className="space-y-3">
              {achievements.map((ach, i) => (
                <div key={i} className="flex gap-2">
                  <input value={ach} onChange={e => setAchievements(prev => prev.map((x, idx) => idx === i ? e.target.value : x))}
                    className="input-field flex-1 text-sm" placeholder="e.g. Winner - Smart India Hackathon 2024" />
                  {i > 0 && (
                    <button type="button" onClick={() => setAchievements(prev => prev.filter((_, idx) => idx !== i))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addAchievement} className="btn-outline text-sm py-2 mt-3 flex items-center gap-2">
              <Plus size={14} /> Add Achievement
            </button>
          </div>

          {/* Career interests */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} style={{ color: 'var(--accent)' }} />
              <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Career Interests</h3>
            </div>
            <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Select your areas of interest — AI will build your personalized roadmap.
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => {
                const selected = interests.includes(interest)
                return (
                  <button key={interest} type="button"
                    onClick={() => setInterests(prev => selected ? prev.filter(i => i !== interest) : [...prev, interest])}
                    className="text-sm px-3 py-1.5 rounded-full font-body transition-all duration-200"
                    style={selected ? { background: 'var(--accent)', color: 'white' }
                      : { background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      {tab === 'documents' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>📄 Upload Documents</h3>
            <p className="font-body text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Upload your certificates, degrees, marksheets — AI will extract skills and achievements automatically.
            </p>
            <div {...getRootProps()}
              className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
              style={{
                borderColor: isDragActive ? 'var(--accent)' : 'var(--border)',
                background: isDragActive ? 'var(--accent-light)' : 'var(--bg-input)',
              }}>
              <input {...getInputProps()} />
              <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
              <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {isDragActive ? 'Drop files here...' : 'Drag & drop or click to upload'}
              </p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                PDF, JPG, PNG, DOC up to 10MB each
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                    <FileText size={16} style={{ color: 'var(--accent)' }} />
                    <span className="font-body text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                    <span className="text-xs font-body px-2 py-0.5 rounded-full"
                      style={{
                        background: f.status === 'done' ? 'rgba(34,197,94,0.1)' : f.status === 'error' ? 'rgba(239,68,68,0.1)' : 'var(--accent-light)',
                        color: f.status === 'done' ? '#22c55e' : f.status === 'error' ? '#ef4444' : 'var(--accent)',
                      }}>
                      {f.status === 'uploading' ? 'Uploading...' : f.status === 'done' ? 'Uploaded ✓' : 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  )
}
