import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Search, Loader2, RefreshCw, Users } from 'lucide-react'
import api from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

// Demo fallback conversations for recruiters
const DEMO_CONVOS = [
  { conversation_id: 'rdemo_1', other_user: { id: 'ps_demo', name: 'Priya Sharma', role: 'student' }, last_message: 'Thank you! I am available for interview.', last_time: new Date(Date.now() - 3600000).toISOString(), unread_count: 1 },
  { conversation_id: 'rdemo_2', other_user: { id: 'rv_demo', name: 'Rahul Verma', role: 'student' }, last_message: 'Looking forward to hearing from you!', last_time: new Date(Date.now() - 10800000).toISOString(), unread_count: 0 },
  { conversation_id: 'rdemo_3', other_user: { id: 'as_demo', name: 'Anjali Singh', role: 'student' }, last_message: 'I have submitted the assessment.', last_time: new Date(Date.now() - 18000000).toISOString(), unread_count: 2 },
]

const DEMO_MSGS = {
  rdemo_1: [
    { id: 'r1', is_mine: true, content: 'Hi Priya! We loved your profile for the Full Stack Developer role.', time: new Date(Date.now() - 4000000).toISOString() },
    { id: 'r2', is_mine: true, content: 'Are you available for an interview this week?', time: new Date(Date.now() - 3900000).toISOString() },
    { id: 'r3', is_mine: false, content: 'Thank you! I am available for interview. Tuesday or Thursday works great for me!', time: new Date(Date.now() - 3600000).toISOString() },
  ],
  rdemo_2: [
    { id: 'r4', is_mine: true, content: 'Hi Rahul! Your application is under review. We will get back to you shortly.', time: new Date(Date.now() - 11000000).toISOString() },
    { id: 'r5', is_mine: false, content: 'Looking forward to hearing from you!', time: new Date(Date.now() - 10800000).toISOString() },
  ],
  rdemo_3: [
    { id: 'r6', is_mine: true, content: 'Hi Anjali! We have shortlisted you. Please complete the online assessment.', time: new Date(Date.now() - 200000000).toISOString() },
    { id: 'r7', is_mine: false, content: 'I have submitted the assessment.', time: new Date(Date.now() - 100000000).toISOString() },
  ],
}

function fmtTime(isoStr) {
  try {
    const d = new Date(isoStr)
    const diff = (Date.now() - d) / 1000
    if (diff < 60)    return 'Just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

export default function RecruiterMessages() {
  const { user } = useAuthStore()
  const [convos, setConvos]   = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState({})
  const [input, setInput]     = useState('')
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isDemo, setIsDemo]   = useState(false)
  const endRef = useRef(null)

  const loadConversations = useCallback(async () => {
    try {
      const res  = await api.get('/messages/conversations')
      const data = res.data?.data || []
      if (data.length > 0) {
        setConvos(data)
        setIsDemo(false)
        if (!selected) setSelected(data[0]?.conversation_id)
      } else {
        setConvos(DEMO_CONVOS)
        setIsDemo(true)
        if (!selected) setSelected('rdemo_1')
      }
    } catch {
      setConvos(DEMO_CONVOS)
      setIsDemo(true)
      if (!selected) setSelected('rdemo_1')
    } finally { setLoading(false) }
  }, [selected])

  const loadMessages = useCallback(async (convId) => {
    if (!convId) return
    if (isDemo || convId.startsWith('rdemo_')) {
      setMessages(prev => ({ ...prev, [convId]: DEMO_MSGS[convId] || [] }))
      return
    }
    try {
      const res = await api.get(`/messages/${convId}`)
      setMessages(prev => ({ ...prev, [convId]: res.data?.data || [] }))
    } catch { setMessages(prev => ({ ...prev, [convId]: [] })) }
  }, [isDemo])

  useEffect(() => { loadConversations() },                   [])
  useEffect(() => { if (selected) loadMessages(selected) }, [selected, loadMessages])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, selected])

  const sendMessage = async () => {
    if (!input.trim() || !selected) return
    const currentConvo = convos.find(c => c.conversation_id === selected)
    if (!currentConvo) return

    if (isDemo || selected.startsWith('rdemo_')) {
      const newMsg = { id: Date.now().toString(), is_mine: true, content: input, time: new Date().toISOString() }
      setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }))
      setInput('')
      toast.success('Message sent! 💬')
      return
    }
    setSending(true)
    try {
      await api.post('/messages/send', { receiver_id: currentConvo.other_user.id, content: input })
      const newMsg = { id: Date.now().toString(), is_mine: true, content: input, time: new Date().toISOString() }
      setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }))
      setInput('')
      loadConversations()
    } catch { toast.error('Failed to send message') }
    finally { setSending(false) }
  }

  const filtered       = convos.filter(c => !search || c.other_user?.name?.toLowerCase().includes(search.toLowerCase()))
  const currentConvo   = convos.find(c => c.conversation_id === selected)
  const currentMessages = messages[selected] || []

  if (loading) return (
    <div className="max-w-5xl space-y-4">
      <div className="skeleton h-8 w-48 rounded-xl" />
      <div className="skeleton rounded-2xl" style={{ height: 560 }} />
    </div>
  )

  return (
    <div className="max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>💬 Messages</h2>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Chat with candidates directly
            {isDemo && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>Demo conversations</span>}
          </p>
        </div>
        <button onClick={loadConversations} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden flex" style={{ height: 560 }}>
        {/* Left — conversations */}
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} className="input-field text-sm pl-8 py-2" placeholder="Search candidates..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center">
                <Users size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>No conversations yet</p>
              </div>
            ) : filtered.map(c => (
              <button key={c.conversation_id} onClick={() => setSelected(c.conversation_id)}
                className="w-full flex items-start gap-3 p-4 text-left transition-all duration-150"
                style={selected === c.conversation_id ? { background: 'var(--accent-light)', borderRight: '2px solid var(--accent)' } : {}}
                onMouseOver={e => { if (selected !== c.conversation_id) e.currentTarget.style.background = 'var(--bg-input)' }}
                onMouseOut={e => { if (selected !== c.conversation_id) e.currentTarget.style.background = 'transparent' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
                  style={{ background: 'var(--accent)' }}>
                  {(c.other_user?.name || 'S').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{c.other_user?.name}</p>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>{fmtTime(c.last_time)}</span>
                  </div>
                  <p className="font-body text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{c.last_message}</p>
                  {c.unread_count > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-body font-bold mt-1"
                      style={{ background: 'var(--accent)', fontSize: 10 }}>{c.unread_count}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold"
              style={{ background: 'var(--accent)' }}>
              {(currentConvo?.other_user?.name || 'S').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentConvo?.other_user?.name || 'Select a conversation'}</p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Student · SkillSetu Platform</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet</p>
              </div>
            )}
            {currentMessages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                {!msg.is_mine && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--accent)' }}>
                    {(currentConvo?.other_user?.name || 'S')[0].toUpperCase()}
                  </div>
                )}
                <div className="max-w-[70%]">
                  <div className="rounded-2xl px-4 py-2.5"
                    style={msg.is_mine
                      ? { background: 'var(--accent)', color: 'white', borderBottomRightRadius: 4 }
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

          <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
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
