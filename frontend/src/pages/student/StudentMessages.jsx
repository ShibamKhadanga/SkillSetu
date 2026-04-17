import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Search, MessageSquare, Loader2, RefreshCw, Users } from 'lucide-react'
import api from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

// ── Demo fallback for when API has no conversations yet ───────────
const DEMO_CONVOS = [
  {
    conversation_id: 'demo_1',
    other_user: { id: 'tc_demo', name: 'TechCorp HR', role: 'recruiter' },
    last_message: 'We would like to schedule an interview with you!',
    last_time: new Date(Date.now() - 7200000).toISOString(),
    unread_count: 2,
    online: true,
  },
  {
    conversation_id: 'demo_2',
    other_user: { id: 'ai_demo', name: 'AI Solutions', role: 'recruiter' },
    last_message: 'Thank you for applying. Your profile looks great.',
    last_time: new Date(Date.now() - 86400000).toISOString(),
    unread_count: 0,
    online: false,
  },
]

const DEMO_MSGS = {
  demo_1: [
    { id: 'd1', sender_id: 'tc_demo', is_mine: false, content: 'Hi! We reviewed your application for Full Stack Developer.', time: new Date(Date.now() - 7400000).toISOString() },
    { id: 'd2', sender_id: 'tc_demo', is_mine: false, content: 'Your profile looks very impressive! We would like to schedule an interview.', time: new Date(Date.now() - 7300000).toISOString() },
    { id: 'd3', sender_id: 'me', is_mine: true, content: 'Thank you so much! I would love to proceed with the interview.', time: new Date(Date.now() - 7200000).toISOString() },
    { id: 'd4', sender_id: 'tc_demo', is_mine: false, content: 'We would like to schedule an interview with you! Are you available this week?', time: new Date(Date.now() - 3600000).toISOString() },
  ],
  demo_2: [
    { id: 'd5', sender_id: 'ai_demo', is_mine: false, content: 'Thank you for applying. Your profile looks great.', time: new Date(Date.now() - 86400000).toISOString() },
  ],
}

function fmtTime(isoStr) {
  try {
    const d = new Date(isoStr)
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

export default function StudentMessages() {
  const { user } = useAuthStore()
  const [convos, setConvos] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState({})
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const endRef = useRef(null)
  const pollRef = useRef(null)

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get('/messages/conversations')
      const data = res.data?.data || []
      if (data.length > 0) {
        setConvos(data)
        setIsDemo(false)
        if (!selected) setSelected(data[0]?.conversation_id)
      } else {
        // No real conversations yet — show demo
        setConvos(DEMO_CONVOS)
        setIsDemo(true)
        if (!selected) setSelected('demo_1')
      }
    } catch {
      setConvos(DEMO_CONVOS)
      setIsDemo(true)
      if (!selected) setSelected('demo_1')
    } finally {
      setLoading(false)
    }
  }, [selected])

  const loadMessages = useCallback(async (convId) => {
    if (!convId) return
    if (isDemo || convId.startsWith('demo_')) {
      setMessages(prev => ({ ...prev, [convId]: DEMO_MSGS[convId] || [] }))
      return
    }
    try {
      const res = await api.get(`/messages/${convId}`)
      setMessages(prev => ({ ...prev, [convId]: res.data?.data || [] }))
    } catch {
      setMessages(prev => ({ ...prev, [convId]: [] }))
    }
  }, [isDemo])

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selected) loadMessages(selected)
  }, [selected, loadMessages])

  // Poll for new messages every 10s
  useEffect(() => {
    pollRef.current = setInterval(() => {
      if (selected && !isDemo) loadMessages(selected)
    }, 10000)
    return () => clearInterval(pollRef.current)
  }, [selected, isDemo, loadMessages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selected])

  const sendMessage = async () => {
    if (!input.trim() || !selected) return
    const currentConvo = convos.find(c => c.conversation_id === selected)
    if (!currentConvo) return

    if (isDemo || selected.startsWith('demo_')) {
      const newMsg = { id: Date.now().toString(), sender_id: user?.id || 'me', is_mine: true, content: input, time: new Date().toISOString() }
      setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }))
      setInput('')
      toast.success('Message sent! 💬')
      return
    }

    setSending(true)
    try {
      await api.post('/messages/send', {
        receiver_id: currentConvo.other_user.id,
        content: input,
      })
      const newMsg = { id: Date.now().toString(), sender_id: user?.id, is_mine: true, content: input, time: new Date().toISOString() }
      setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }))
      setInput('')
      // Refresh conversation list to update last message
      loadConversations()
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const filteredConvos = convos.filter(c =>
    !search || c.other_user?.name?.toLowerCase().includes(search.toLowerCase())
  )
  const currentConvo = convos.find(c => c.conversation_id === selected)
  const currentMessages = messages[selected] || []

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton rounded-2xl" style={{ height: 580 }} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>💬 Messages</h2>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Chat with recruiters directly on SkillSetu
            {isDemo && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>Demo conversations</span>}
          </p>
        </div>
        <button onClick={loadConversations} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden flex" style={{ height: 580 }}>
        {/* Conversations List */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="input-field text-sm pl-8 py-2" placeholder="Search messages..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.length === 0 ? (
              <div className="p-6 text-center">
                <Users size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>No conversations yet</p>
              </div>
            ) : filteredConvos.map(convo => (
              <button key={convo.conversation_id} onClick={() => setSelected(convo.conversation_id)}
                className="w-full flex items-start gap-3 p-4 text-left transition-all duration-150"
                style={selected === convo.conversation_id ? { background: 'var(--accent-light)', borderRight: '2px solid var(--accent)' } : {}}
                onMouseOver={e => { if (selected !== convo.conversation_id) e.currentTarget.style.background = 'var(--bg-input)' }}
                onMouseOut={e => { if (selected !== convo.conversation_id) e.currentTarget.style.background = 'transparent' }}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold"
                    style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}>
                    {(convo.other_user?.name || 'U')[0].toUpperCase()}
                  </div>
                  {convo.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ background: '#22c55e', borderColor: 'var(--bg-card)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{convo.other_user?.name}</p>
                    <span className="font-body text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>{fmtTime(convo.last_time)}</span>
                  </div>
                  <p className="font-body text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{convo.last_message || 'No messages yet'}</p>
                  {convo.unread_count > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-body font-bold mt-1"
                      style={{ background: 'var(--accent)', color: 'var(--neon-box-text)', fontSize: 10 }}>
                      {convo.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold"
              style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}>
              {(currentConvo?.other_user?.name || 'R')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentConvo?.other_user?.name || 'Select a conversation'}</p>
              <p className="font-body text-xs" style={{ color: currentConvo?.online ? '#22c55e' : 'var(--text-muted)' }}>
                {currentConvo?.online ? '● Online' : 'Recruiter'} · SkillSetu Platform
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageSquare size={40} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                <p className="font-body text-sm mt-3" style={{ color: 'var(--text-muted)' }}>No messages yet. Start the conversation!</p>
              </div>
            )}
            {currentMessages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                {!msg.is_mine && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--accent)', color: 'var(--neon-box-text)' }}>
                    {(currentConvo?.other_user?.name || 'R')[0].toUpperCase()}
                  </div>
                )}
                <div className="max-w-[70%]">
                  <div className="rounded-2xl px-4 py-2.5"
                    style={msg.is_mine
                      ? { background: 'var(--accent)', color: 'var(--neon-box-text)', borderBottomRightRadius: 4 }
                      : { background: 'var(--bg-input)', color: 'var(--text-primary)', borderBottomLeftRadius: 4 }}>
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)', textAlign: msg.is_mine ? 'right' : 'left' }}>
                    {fmtTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                className="input-field flex-1 text-sm" placeholder="Type a message..." />
              <button onClick={sendMessage} disabled={!input.trim() || sending}
                className="btn-primary w-10 h-10 flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
