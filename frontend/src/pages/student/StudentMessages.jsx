import { useState, useRef, useEffect } from 'react'
import { Send, Search, MessageSquare, Mail, Clock } from 'lucide-react'

const DEMO_CONVERSATIONS = [
  { id: 1, name: 'TechCorp HR', company: 'TechCorp India', avatar: 'T', lastMessage: 'We would like to schedule an interview with you!', time: '2h ago', unread: 2, online: true },
  { id: 2, name: 'AI Solutions', company: 'AI Solutions Pvt', avatar: 'A', lastMessage: 'Thank you for applying. Your profile looks great.', time: '1d ago', unread: 0, online: false },
  { id: 3, name: 'Infosys Recruitment', company: 'Infosys', avatar: 'I', lastMessage: 'Please complete the online assessment by Friday.', time: '3d ago', unread: 1, online: true },
]

const DEMO_MESSAGES = {
  1: [
    { id: 1, sender: 'them', content: 'Hi! We reviewed your application for Full Stack Developer position.', time: '10:00 AM' },
    { id: 2, sender: 'them', content: 'Your profile looks very impressive! We would like to schedule an interview.', time: '10:01 AM' },
    { id: 3, sender: 'me', content: 'Thank you so much! I would love to proceed with the interview.', time: '10:30 AM' },
    { id: 4, sender: 'them', content: 'We would like to schedule an interview with you! Are you available this week?', time: '2h ago' },
  ],
  2: [
    { id: 1, sender: 'them', content: 'Thank you for applying. Your profile looks great.', time: '1d ago' },
  ],
  3: [
    { id: 1, sender: 'them', content: 'Hello! We have shortlisted you for the Data Analyst role.', time: '3d ago' },
    { id: 2, sender: 'them', content: 'Please complete the online assessment by Friday.', time: '3d ago' },
  ],
}

export default function StudentMessages() {
  const [selected, setSelected] = useState(1)
  const [messages, setMessages] = useState(DEMO_MESSAGES)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selected])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = { id: Date.now(), sender: 'me', content: input, time: 'now' }
    setMessages(prev => ({ ...prev, [selected]: [...(prev[selected] || []), newMsg] }))
    setInput('')
  }

  const filteredConvos = DEMO_CONVERSATIONS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase())
  )

  const currentConvo = DEMO_CONVERSATIONS.find(c => c.id === selected)
  const currentMessages = messages[selected] || []

  return (
    <div className="max-w-5xl">
      <div className="mb-5">
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>💬 Messages</h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Chat with recruiters directly on SkillSetu</p>
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
            {filteredConvos.map(convo => (
              <button key={convo.id} onClick={() => setSelected(convo.id)}
                className="w-full flex items-start gap-3 p-4 text-left transition-all duration-150"
                style={selected === convo.id ? { background: 'var(--accent-light)', borderRight: '2px solid var(--accent)' } : {}}
                onMouseOver={e => { if (selected !== convo.id) e.currentTarget.style.background = 'var(--bg-input)' }}
                onMouseOut={e => { if (selected !== convo.id) e.currentTarget.style.background = 'transparent' }}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold"
                    style={{ background: 'var(--accent)' }}>
                    {convo.avatar}
                  </div>
                  {convo.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ background: '#22c55e', borderColor: 'var(--bg-card)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{convo.name}</p>
                    <span className="font-body text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>{convo.time}</span>
                  </div>
                  <p className="font-body text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{convo.lastMessage}</p>
                  {convo.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-body font-bold mt-1"
                      style={{ background: 'var(--accent)', fontSize: 10 }}>
                      {convo.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold"
              style={{ background: 'var(--accent)' }}>
              {currentConvo?.avatar}
            </div>
            <div>
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentConvo?.name}</p>
              <p className="font-body text-xs" style={{ color: currentConvo?.online ? '#22c55e' : 'var(--text-muted)' }}>
                {currentConvo?.online ? '● Online' : 'Offline'} · {currentConvo?.company}
              </p>
            </div>
            <button className="ml-auto flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Mail size={12} /> Send Email
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender !== 'me' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--accent)' }}>
                    {currentConvo?.avatar}
                  </div>
                )}
                <div className="max-w-[70%]">
                  <div className="rounded-2xl px-4 py-2.5"
                    style={msg.sender === 'me'
                      ? { background: 'var(--accent)', color: 'white', borderBottomRightRadius: 4 }
                      : { background: 'var(--bg-input)', color: 'var(--text-primary)', borderBottomLeftRadius: 4 }}>
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                    {msg.time}
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
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="input-field flex-1 text-sm" placeholder="Type a message..." />
              <button onClick={sendMessage} disabled={!input.trim()}
                className="btn-primary w-10 h-10 flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
