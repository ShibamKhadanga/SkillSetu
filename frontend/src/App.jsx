import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

// Pages
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Student Pages
import StudentDashboard from '@/pages/student/StudentDashboard'
import StudentProfile from '@/pages/student/StudentProfile'
import Roadmap from '@/pages/student/Roadmap'
import ResumeBuilder from '@/pages/student/ResumeBuilder'
import ResumeScore from '@/pages/student/ResumeScore'
import SalaryInsights from '@/pages/student/SalaryInsights'
import GovtJobs from '@/pages/student/GovtJobs'
import JobExplorer from '@/pages/student/JobExplorer'
import Applications from '@/pages/student/Applications'
import StudentMessages from '@/pages/student/StudentMessages'
import Portfolio from '@/pages/student/Portfolio'
import MockInterview from '@/pages/student/MockInterview'
import SkillGap from '@/pages/student/SkillGap'
import Achievements from '@/pages/student/Achievements'
import CareerCompare from '@/pages/student/CareerCompare'
import Scholarships from '@/pages/student/Scholarships'
import SkillQuiz from '@/pages/student/SkillQuiz'
import IndustryTrends from '@/pages/student/IndustryTrends'

// Recruiter Pages
import RecruiterDashboard from '@/pages/recruiter/RecruiterDashboard'
import PostJob from '@/pages/recruiter/PostJob'
import Candidates from '@/pages/recruiter/Candidates'
import RecruiterApplications from '@/pages/recruiter/RecruiterApplications'
import RecruiterMessages from '@/pages/recruiter/RecruiterMessages'
import Analytics from '@/pages/recruiter/Analytics'

// Layout
import StudentLayout from '@/components/layouts/StudentLayout'
import RecruiterLayout from '@/components/layouts/RecruiterLayout'

// Guards
const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute role="student">
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="resume" element={<ResumeBuilder />} />
        <Route path="resume-score" element={<ResumeScore />} />
        <Route path="salary-insights" element={<SalaryInsights />} />
        <Route path="govt-jobs" element={<GovtJobs />} />
        <Route path="jobs" element={<JobExplorer />} />
        <Route path="applications" element={<Applications />} />
        <Route path="mock-interview" element={<MockInterview />} />
        <Route path="skill-gap" element={<SkillGap />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="career-compare" element={<CareerCompare />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="skill-quiz" element={<SkillQuiz />} />
        <Route path="industry-trends" element={<IndustryTrends />} />
      </Route>

      {/* Recruiter Routes */}
      <Route path="/recruiter" element={
        <ProtectedRoute role="recruiter">
          <RecruiterLayout />
        </ProtectedRoute>
      }>
        <Route index element={<RecruiterDashboard />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="applications" element={<RecruiterApplications />} />
        <Route path="messages" element={<RecruiterMessages />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Public Portfolio */}
      <Route path="/portfolio/:username" element={<Portfolio isPublic />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
