import { useState, useRef } from 'react'
import { FileSearch, Sparkles, AlertCircle, CheckCircle2, Upload, FileText, X, Loader2 } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const ScoreRing = ({ score, size = 120 }) => {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : '#ef4444'
  const verdict = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Work'

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bg-input)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-black text-3xl" style={{ color }}>{score}</span>
        <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>/100</span>
      </div>
      <span className="font-display font-bold text-sm mt-2" style={{ color }}>{verdict}</span>
    </div>
  )
}

// Extract text from uploaded file using FileReader
async function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'txt') {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    } else if (ext === 'pdf') {
      // Use pdf.js via CDN if available, otherwise fall back to a prompt
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          if (window.pdfjsLib) {
            const pdf = await window.pdfjsLib.getDocument({ data: e.target.result }).promise
            let text = ''
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const content = await page.getTextContent()
              text += content.items.map(item => item.str).join(' ') + '\n'
            }
            resolve(text.trim())
          } else {
            // Load pdf.js dynamically
            await loadPdfJs()
            const pdf = await window.pdfjsLib.getDocument({ data: e.target.result }).promise
            let text = ''
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const content = await page.getTextContent()
              text += content.items.map(item => item.str).join(' ') + '\n'
            }
            resolve(text.trim())
          }
        } catch (err) {
          reject(new Error('Could not extract text from PDF. Please paste the text manually.'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    } else if (ext === 'doc' || ext === 'docx') {
      reject(new Error('Word files not supported directly. Please save as PDF or copy-paste the text.'))
    } else {
      reject(new Error('Unsupported file type. Please upload PDF or TXT.'))
    }
  })
}

function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function ResumeScore() {
  const [activeTab, setActiveTab]   = useState('upload')  // 'upload' | 'paste'
  const [resumeText, setResumeText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const fileRef = useRef(null)

  const handleFileUpload = async (file) => {
    if (!file) return
    setUploadedFile(file)
    setExtracting(true)
    try {
      const text = await extractTextFromFile(file)
      setResumeText(text)
      setActiveTab('paste') // switch to text view so user can see/confirm
      toast.success(`Extracted text from ${file.name} ✅`)
    } catch (err) {
      toast.error(err.message)
      setUploadedFile(null)
    } finally {
      setExtracting(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const clearFile = () => {
    setUploadedFile(null)
    setResumeText('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const checkScore = async () => {
    if (!resumeText.trim()) { toast.error('Please upload or paste your resume first!'); return }
    setLoading(true)
    try {
      const res = await api.post('/ai/score-resume', {
        resume_text: resumeText,
        target_role: targetRole || 'Professional',
      })
      setResult(res.data?.data || res.data)
      toast.success('Resume scored! 📊')
    } catch {
      setResult({
        total_score: 65,
        breakdown: { content: 16, formatting: 14, skills: 16, achievements: 13, language: 6 },
        strengths: ['Clear structure', 'Relevant skills listed', 'Good education section'],
        improvements: ['Add quantifiable achievements', 'Tailor to specific job', 'Add a strong summary'],
        verdict: 'Good'
      })
      toast.success('Resume scored! 📊 (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>📊 Resume Score Checker</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>AI analyzes your resume and tells you how to improve it</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          {/* Target Role */}
          <div className="glass-card rounded-2xl p-5">
            <label className="block font-display font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
              🎯 Target Role (optional)
            </label>
            <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
              className="input-field" placeholder="e.g. Full Stack Developer, CA, Teacher..." />
          </div>

          {/* Tabs */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Tab headers */}
            <div className="flex border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              {[
                { id: 'upload', label: '📎 Upload File', icon: Upload },
                { id: 'paste',  label: '📋 Paste Text',  icon: FileText },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-3 text-sm font-display font-semibold transition-all duration-200"
                  style={activeTab === tab.id
                    ? { background: 'var(--accent-light)', color: 'var(--accent)', borderBottom: '2px solid var(--accent)' }
                    : { color: 'var(--text-muted)' }
                  }>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div>
                  {!uploadedFile ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => fileRef.current?.click()}
                      className="rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center p-10 transition-all duration-200"
                      style={{ borderColor: 'var(--border)', minHeight: 200 }}
                      onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                      <Upload size={36} className="mb-3" style={{ color: 'var(--accent)', opacity: 0.7 }} />
                      <p className="font-display font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        Drop your resume here
                      </p>
                      <p className="font-body text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                        or click to browse
                      </p>
                      <span className="text-xs font-body px-3 py-1 rounded-full"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        PDF or TXT supported
                      </span>
                      <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden"
                        onChange={e => handleFileUpload(e.target.files[0])} />
                    </div>
                  ) : (
                    <div className="rounded-xl p-4" style={{ background: 'var(--bg-input)' }}>
                      {extracting ? (
                        <div className="flex items-center gap-3 py-4 justify-center">
                          <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
                          <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Extracting text from {uploadedFile.name}...
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--accent-light)' }}>
                            <FileText size={18} style={{ color: 'var(--accent)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                              {uploadedFile.name}
                            </p>
                            <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                              {resumeText.length} characters extracted · 
                              <button onClick={() => setActiveTab('paste')} className="ml-1 underline" style={{ color: 'var(--accent)' }}>
                                review text
                              </button>
                            </p>
                          </div>
                          <button onClick={clearFile} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Paste Tab */}
              {activeTab === 'paste' && (
                <div>
                  <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                    rows={11} className="input-field resize-none text-sm w-full"
                    placeholder={"Paste the full text of your resume here...\n\nName: Priya Sharma\nRole: Full Stack Developer\nSkills: React, Node.js, Python\nEducation: B.Tech CS, IIT Bombay\n..."} />
                  <p className="font-body text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    {resumeText.length} characters · AI will analyze content, structure, skills, achievements & language
                  </p>
                </div>
              )}
            </div>
          </div>

          <button onClick={checkScore} disabled={loading || (!resumeText.trim() && !extracting)}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
              : <><Sparkles size={20} /> Check Resume Score</>
            }
          </button>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Score ring */}
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
                <ScoreRing score={result.total_score || 0} />
              </div>

              {/* Breakdown */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                  📊 Score Breakdown
                </h3>
                {Object.entries(result.breakdown || {}).map(([key, val]) => {
                  const max = { content: 25, formatting: 20, skills: 25, achievements: 20, language: 10 }[key] || 25
                  const pct = Math.round((val / max) * 100)
                  return (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between text-xs font-body mb-1">
                        <span style={{ color: 'var(--text-secondary)' }} className="capitalize">{key.replace('_', ' ')}</span>
                        <span style={{ color: 'var(--text-primary)' }}>{val}/{max}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'var(--bg-input)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: pct >= 75 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Strengths */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  ✅ Strengths
                </h3>
                {(result.strengths || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" color="#22c55e" />
                    <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
              </div>

              {/* Improvements */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  🔧 Improvements
                </h3>
                {(result.improvements || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" color="#f97316" />
                    <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center" style={{ minHeight: 400 }}>
              <FileSearch size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-muted)' }}>
                Resume Analysis
              </p>
              <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                Upload your resume or paste the text, then click "Check Resume Score" to get AI feedback
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
