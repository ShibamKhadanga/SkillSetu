// RecruiterMessages.jsx
import { useState, useRef, useEffect } from 'react'
import { Send, Search } from 'lucide-react'

const CONVOS = [
  { id: 1, name: 'Priya Sharma', role: 'Full Stack Developer', avatar: 'PS', last: 'Thank you! I am available for interview.', time: '1h ago', unread: 1 },
  { id: 2, name: 'Rahul Verma', role: 'Full Stack Developer', avatar: 'RV', last: 'Looking forward to hearing from you!', time: '3h ago', unread: 0 },
  { id: 3, name: 'Anjali Singh', role: 'ML Engineer', avatar: 'AS', last: 'I have submitted the assessment.', time: '5h ago', unread: 2 },
]

const MSGS = {
  1: [
    { sender: 'me', content: 'Hi Priya! We loved your profile for the Full Stack Developer role.', time: '10:00 AM' },
    { sender: 'me', content: 'Are you available for an interview this week?', time: '10:01 AM' },
    { sender: 'them', content: 'Thank you! I am available for interview. Tuesday or Thursday works great for me!', time: '11:30 AM' },
  ],
  2: [{ sender: 'me', content: 'Hi Rahul! Your application is under review. We will get back to you shortly.', time: 'Yesterday' }, { sender: 'them', content: 'Looking forward to hearing from you!', time: 'Yesterday' }],
  3: [{ sender: 'me', content: 'Hi Anjali! We have shortlisted you. Please complete the online assessment.', time: '2d ago' }, { sender: 'them', content: 'I have submitted the assessment.', time: '1d ago' }],
}

export default function RecruiterMessages() {
  const [sel, setSel] = useState(1)
  const [msgs, setMsgs] = useState(MSGS)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, sel])

  const send = () => {
    if (!input.trim()) return
    setMsgs(p => ({ ...p, [sel]: [...(p[sel] || []), { sender: 'me', content: input, time: 'now' }] }))
    setInput('')
  }

  const current = CONVOS.find(c => c.id === sel)
  const currentMsgs = msgs[sel] || []

  return (
    <div className="max-w-5xl">
      <div className="mb-5">
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>💬 Messages</h2>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden flex" style={{ height: 560 }}>
        <div className="w-72 flex-shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} className="input-field text-sm pl-8 py-2" placeholder="Search..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVOS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
              <button key={c.id} onClick={() => setSel(c.id)} className="w-full flex items-start gap-3 p-4 text-left"
                style={sel === c.id ? { background: 'var(--accent-light)', borderRight: '2px solid var(--accent)' } : {}}
                onMouseOver={e => { if (sel !== c.id) e.currentTarget.style.background = 'var(--bg-input)' }}
                onMouseOut={e => { if (sel !== c.id) e.currentTarget.style.background = 'transparent' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
                  style={{ background: 'var(--accent)' }}>{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between"><p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.time}</span></div>
                  <p className="font-body text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.last}</p>
                  {c.unread > 0 && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white font-body font-bold mt-1" style={{ background: 'var(--accent)', fontSize: 10 }}>{c.unread}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold" style={{ background: 'var(--accent)' }}>{current?.avatar}</div>
            <div>
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{current?.name}</p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{current?.role}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMsgs.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[70%] rounded-2xl px-4 py-2.5"
                  style={msg.sender === 'me' ? { background: 'var(--accent)', color: 'white', borderBottomRightRadius: 4 } : { background: 'var(--bg-input)', color: 'var(--text-primary)', borderBottomLeftRadius: 4 }}>
                  <p className="font-body text-sm">{msg.content}</p>
                  <p className="font-body text-xs mt-1 opacity-70">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                className="input-field flex-1 text-sm" placeholder="Type a message..." />
              <button onClick={send} disabled={!input.trim()} className="btn-primary w-10 h-10 flex items-center justify-center flex-shrink-0 disabled:opacity-40">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
