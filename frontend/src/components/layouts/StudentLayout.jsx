import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Map, FileText, Briefcase,
  ClipboardList, MessageSquare, Globe, Mic, Sun, Moon,
  LogOut, Bell, Menu, X, ChevronRight, Star, Trash2,
  IndianRupee, Landmark, FileSearch, GitBranch, Target, CheckCheck,
  Trophy, ArrowLeftRight, GraduationCap, Brain, TrendingUp, Languages
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useLanguageStore, LANGUAGES } from '@/store/languageStore'
import FeedbackModal from '@/components/common/FeedbackModal'
import api from '@/services/api'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/student',                label: 'dashboard',      icon: LayoutDashboard, exact: true },
  { path: '/student/profile',        label: 'myProfile',      icon: User },
  { path: '/student/roadmap',        label: 'careerRoadmap',  icon: GitBranch },
  { path: '/student/resume',         label: 'resumeBuilder',  icon: FileText },
  { path: '/student/resume-score',   label: 'resumeScore',    icon: FileSearch },
  { path: '/student/jobs',           label: 'jobExplorer',    icon: Briefcase },
  { path: '/student/applications',   label: 'applications',   icon: ClipboardList },
  { section: 'aiTools' },
  { path: '/student/skill-gap',      label: 'skillGap',       icon: Target },
  { path: '/student/salary-insights',label: 'salaryInsights',  icon: IndianRupee },
  { path: '/student/govt-jobs',      label: 'govtJobs',       icon: Landmark },
  { path: '/student/mock-interview', label: 'mockInterview',  icon: Mic },
  { path: '/student/skill-quiz',     label: 'skillQuiz',      icon: Brain },
  { section: 'other' },
  { path: '/student/career-compare', label: 'careerCompare',  icon: ArrowLeftRight },
  { path: '/student/scholarships',   label: 'scholarships',   icon: GraduationCap },
  { path: '/student/industry-trends',label: 'industryTrends', icon: TrendingUp },
  { path: '/student/achievements',   label: 'achievements',   icon: Trophy },
  { path: '/student/messages',       label: 'messages',       icon: MessageSquare },
  { path: '/student/portfolio',      label: 'myPortfolio',    icon: Globe },
]

export default function StudentLayout() {
  const { user, logout }        = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const { lang, setLang, t }    = useLanguageStore()
  const location                = useLocation()
  const navigate                = useNavigate()
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting]             = useState(false)
  const [notifCount, setNotifCount]        = useState(0)
  const [notifOpen, setNotifOpen]          = useState(false)
  const [notifs, setNotifs]                = useState([])
  const [notifLoading, setNotifLoading]    = useState(false)
  const notifRef                           = useRef(null)

  const fetchNotifCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count')
      setNotifCount(res.data?.data?.count || 0)
    } catch { /* ignore */ }
  }

  const fetchNotifs = async () => {
    setNotifLoading(true)
    try {
      const res = await api.get('/notifications/')
      setNotifs(res.data?.data || [])
      setNotifCount(0)
    } catch {
      // Demo notifications for new users
      setNotifs([
        { id: 'n1', title: 'Welcome to SkillSetu! 🎉', body: 'Complete your profile to get matched with top jobs.', type: 'info', is_read: false, created_at: new Date().toISOString(), link: '/student/profile' },
        { id: 'n2', title: 'New AI Feature Available', body: 'Try our Salary Insights tool to benchmark your expected CTC.', type: 'feature', is_read: false, created_at: new Date(Date.now() - 86400000).toISOString(), link: '/student/salary-insights' },
        { id: 'n3', title: 'Complete your Roadmap', body: 'Your AI career roadmap is ready. Explore your learning path!', type: 'action', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString(), link: '/student/roadmap' },
      ])
    } finally { setNotifLoading(false) }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Fetch notification count
  useEffect(() => {
    fetchNotifCount()
    const interval = setInterval(fetchNotifCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await api.delete('/feedback/account')
      logout()
      toast.success('Account deleted successfully')
      navigate('/')
    } catch {
      toast.error('Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-white"
            style={{ background: 'var(--accent)' }}>S</div>
          <div>
            <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Skill<span style={{ color: 'var(--accent)' }}>Setu</span>
            </span>
            <p className="text-xs font-body leading-none" style={{ color: 'var(--text-muted)' }}>
              Kaushal se Rojgar tak
            </p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 mx-3 my-3 rounded-xl" style={{ background: 'var(--accent-light)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
            style={{ background: 'var(--accent)' }}>
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'Student'}
            </p>
            <p className="font-body text-xs truncate" style={{ color: 'var(--accent)' }}>
              @{user?.username || 'username'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <p key={item.section} className="text-xs font-body font-semibold uppercase tracking-wider px-3 pt-4 pb-1"
                style={{ color: 'var(--text-muted)' }}>{t(item.section)}</p>
            )
          }
          const { path, label, icon: Icon } = item
          const active = isActive({ path, exact: path === '/student' })
          return (
            <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200"
              style={active ? { background: 'var(--accent)', color: 'white', boxShadow: '0 4px 12px var(--shadow)' }
                : { color: 'var(--text-secondary)' }}
              onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
              onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}>
              <Icon size={17} />
              <span className="flex-1">{t(label)}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions — compact */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        {/* Feedback */}
        <FeedbackModal />

        {/* Theme + Language — single row */}
        <div className="flex items-center gap-1 px-1 py-1">
          <button onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-input)' }}
            title={isDark ? t('lightMode') : t('darkMode')}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div className="flex items-center gap-1.5 flex-1 px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-input)' }}>
            <Languages size={14} style={{ color: 'var(--text-muted)' }} />
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="flex-1 bg-transparent font-body text-xs outline-none cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}>
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Delete + Logout — single row */}
        <div className="flex items-center gap-1 px-1 py-1">
          <button onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
            title="Delete Account"
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}>
            <Trash2 size={15} />
          </button>
          <button onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-body text-xs font-semibold transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}>
            <LogOut size={14} /> {t('logout')}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'dark' : ''}`} style={{ background: 'var(--bg-primary)' }}>

      {/* ✅ Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
              Delete Account?
            </h3>
            <p className="font-body text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              This will permanently delete your account, profile, applications, and all data. This action <strong>cannot be undone</strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-outline py-2.5 text-sm">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleting}
                className="flex-1 py-2.5 text-sm rounded-xl font-body font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: '#ef4444' }}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r"
        style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-subtle)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col border-r"
            style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-subtle)' }}>
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b flex-shrink-0"
          style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border-subtle)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                {t(navItems.find(i => isActive(i))?.label || 'dashboard')}
              </h1>
              <p className="font-body text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                {t('welcome')}, {user?.name?.split(' ')[0] || 'Student'} 👋
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(o => !o); if (!notifOpen) fetchNotifs() }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                <Bell size={17} />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-body font-bold"
                    style={{ background: 'var(--accent)', fontSize: '10px' }}>
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>🔔 Notifications</span>
                    <button
                      onClick={async () => {
                        try { await api.patch('/notifications/read-all') } catch { /* ignore */ }
                        setNotifs(n => n.map(x => ({ ...x, is_read: true })))
                        setNotifCount(0)
                        toast.success('All marked as read')
                      }}
                      className="flex items-center gap-1 text-xs font-body"
                      style={{ color: 'var(--accent)' }}>
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifLoading ? (
                      <div className="p-6 text-center">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--accent)' }} />
                      </div>
                    ) : notifs.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell size={28} className="mx-auto mb-2" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>All caught up! 🎉</p>
                      </div>
                    ) : notifs.map(n => (
                      <Link key={n.id} to={n.link || '/student'}
                        onClick={async () => {
                          setNotifOpen(false)
                          if (!n.is_read) {
                            try { await api.patch(`/notifications/${n.id}/read`) } catch { /* ignore */ }
                            setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x))
                          }
                        }}
                        className="flex items-start gap-3 p-4 transition-all duration-150 border-b"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          background: n.is_read ? 'transparent' : 'var(--accent-light)',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-input)' }}
                        onMouseOut={e => { e.currentTarget.style.background = n.is_read ? 'transparent' : 'var(--accent-light)' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                          style={{ background: 'var(--accent-light)' }}>
                          {n.type === 'message' ? '💬' : n.type === 'job' ? '💼' : n.type === 'feature' ? '✨' : n.type === 'action' ? '🚀' : '🔔'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                          <p className="font-body text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                          <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.is_read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: 'var(--accent)' }} />}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/student/profile"
              className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
              style={{ background: 'var(--accent)' }}>
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}