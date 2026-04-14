import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, RotateCcw, Star, ChevronRight, Sparkles, User, Bot, Play } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const ROLES = ['Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Android Developer', 'Product Manager']

const DEMO_QA = [
  { q: 'Tell me about yourself.', tip: 'Use the STAR method. Mention your education, projects, and career goals.' },
  { q: 'What are your key technical skills?', tip: 'List relevant skills with brief examples of how you\'ve used them.' },
  { q: 'Describe a challenging project you worked on.', tip: 'Focus on your contribution, the challenge, and the outcome.' },
]

export default function MockInterview() {
  const [role, setRole] = useState('')
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(null)
  const [questionIdx, setQuestionIdx] = useState(0)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async () => {
    if (!role) { toast.error('Please select a role first!'); return }
    setStarted(true)
    setMessages([{
      role: 'ai',
      content: `👋 Welcome! I'm your AI interviewer for the **${role}** position.\n\nLet's begin! I'll ask you 5 questions and provide feedback after each answer.\n\n**Question 1:** Tell me about yourself and why you're interested in the ${role} role.`,
    }])
  }

  const sendAnswer = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post('/ai/mock-interview', { role, answer: input, question_index: questionIdx, history: messages })
      const aiResp = res.data
      setMessages(prev => [...prev, { role: 'ai', content: aiResp.feedback, score: aiResp.score }])
      if (aiResp.next_question) {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', content: `**Question ${questionIdx + 2}:** ${aiResp.next_question}` }])
          setQuestionIdx(qi => qi + 1)
        }, 1000)
      } else {
        setScore(aiResp.final_score)
      }
    } catch {
      // Demo feedback
      const demoFeedbacks = [
        `✅ **Good answer!** You clearly explained your background.\n\n**Score: 8/10**\n\n💡 **Tip:** Add specific metrics or numbers to make your introduction more impactful.\n\n**Question 2:** What are your key technical skills and how have you applied them?`,
        `✅ **Strong technical knowledge!**\n\n**Score: 7/10**\n\n💡 **Tip:** Give concrete examples for each skill — interviewers love specific project mentions.\n\n**Question 3:** Describe your most challenging project.`,
        `🎉 **Interview Complete!**\n\n**Final Score: 75/100** — Good performance!\n\n**Strengths:** Clear communication, good technical depth\n**Improve:** Use STAR method more consistently, add quantifiable results.`,
      ]
      const feedback = demoFeedbacks[Math.min(questionIdx, demoFeedbacks.length - 1)]
      setMessages(prev => [...prev, { role: 'ai', content: feedback }])
      if (questionIdx >= 2) setScore(75)
      else setQuestionIdx(qi => qi + 1)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStarted(false)
    setMessages([])
    setInput('')
    setScore(null)
    setQuestionIdx(0)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>🎤 AI Mock Interview</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Practice with AI. Get real-time feedback on every answer.</p>
      </div>

      {!started ? (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-6">
            <label className="block font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Select Interview Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className="p-3 rounded-xl font-body text-xs text-center transition-all duration-200"
                  style={role === r
                    ? { background: 'var(--accent)', color: 'white' }
                    : { background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>📋 What to Expect</h3>
            <div className="space-y-3">
              {[
                { num: '01', text: '5 role-specific interview questions from AI' },
                { num: '02', text: 'Real-time scoring and feedback after each answer' },
                { num: '03', text: 'Tips to improve your response' },
                { num: '04', text: 'Final performance report with overall score' },
              ].map(({ num, text }) => (
                <div key={num} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{num}</div>
                  <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={startInterview} disabled={!role}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-40">
            <Play size={20} /> Start Interview {role && `— ${role}`}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Score bar */}
          {score && (
            <div className="glass-card rounded-2xl p-5 text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} className={score >= i * 20 ? 'fill-current' : ''} style={{ color: 'var(--accent)' }} />
                ))}
              </div>
              <p className="font-display font-black text-4xl mb-1" style={{ color: 'var(--accent)' }}>{score}/100</p>
              <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>Final Interview Score</p>
              <button onClick={reset} className="btn-outline mt-4 flex items-center gap-2 mx-auto">
                <RotateCcw size={14} /> Try Again
              </button>
            </div>
          )}

          {/* Chat */}
          <div className="glass-card rounded-2xl overflow-hidden" style={{ height: 480 }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  AI Interviewer — {role}
                </span>
              </div>
              <button onClick={reset} className="text-xs font-body flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="h-[350px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--accent-light)' }}>
                      <Bot size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                  )}
                  <div className="max-w-[80%] rounded-2xl px-4 py-3"
                    style={msg.role === 'user'
                      ? { background: 'var(--accent)', color: 'white', borderBottomRightRadius: 4 }
                      : { background: 'var(--bg-input)', color: 'var(--text-primary)', borderBottomLeftRadius: 4 }}>
                    <p className="font-body text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--accent)' }}>
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                    <Bot size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendAnswer()}
                  className="input-field flex-1 text-sm" placeholder="Type your answer..." disabled={loading || !!score} />
                <button onClick={sendAnswer} disabled={!input.trim() || loading || !!score}
                  className="btn-primary w-10 h-10 flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
