import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Map, FileText, Briefcase,
  ClipboardList, MessageSquare, Globe, Mic, Sun, Moon,
  LogOut, Bell, Menu, X, ChevronRight, Star, Trash2,
  IndianRupee, Landmark, FileSearch
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import FeedbackModal from '@/components/common/FeedbackModal'
import api from '@/services/api'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/student',                label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { path: '/student/profile',        label: 'My Profile',     icon: User },
  { path: '/student/roadmap',        label: 'Career Roadmap', icon: Map },
  { path: '/student/resume',         label: 'Resume Builder', icon: FileText },
  { path: '/student/resume-score',   label: 'Resume Score',   icon: FileSearch },
  { path: '/student/jobs',           label: 'Job Explorer',   icon: Briefcase },
  { path: '/student/applications',   label: 'Applications',   icon: ClipboardList },
  { section: 'AI Tools' },
  { path: '/student/salary-insights',label: 'Salary Insights', icon: IndianRupee },
  { path: '/student/govt-jobs',      label: 'Govt Jobs',      icon: Landmark },
  { path: '/student/mock-interview', label: 'Mock Interview', icon: Mic },
  { section: 'Other' },
  { path: '/student/messages',       label: 'Messages',       icon: MessageSquare },
  { path: '/student/portfolio',      label: 'My Portfolio',   icon: Globe },
]

export default function StudentLayout() {
  const { user, logout }        = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const location                = useLocation()
  const navigate                = useNavigate()
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting]             = useState(false)
  const [notifCount, setNotifCount]          = useState(0)

  // Fetch notification count
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications/count')
        setNotifCount(res.data?.count || 0)
      } catch { /* ignore */ }
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
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
                style={{ color: 'var(--text-muted)' }}>{item.section}</p>
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
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border-subtle)' }}>
        {/* ✅ Feedback */}
        <FeedbackModal />

        <button onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm w-full transition-all duration-200"
          style={{ color: 'var(--text-secondary)' }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* ✅ Delete Account */}
        <button onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm w-full transition-all duration-200"
          style={{ color: 'var(--text-secondary)' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
          <Trash2 size={17} />
          Delete Account
        </button>

        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm w-full transition-all duration-200"
          style={{ color: 'var(--text-secondary)' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
          <LogOut size={17} />
          Sign Out
        </button>
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
                {navItems.find(i => isActive(i))?.label || 'Dashboard'}
              </h1>
              <p className="font-body text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              <Bell size={17} />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-body font-bold"
                  style={{ background: 'var(--accent)', fontSize: '10px' }}>
                  {notifCount}
                </span>
              )}
            </button>
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