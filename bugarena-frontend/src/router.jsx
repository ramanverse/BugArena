import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './pages/Landing/LandingPage.jsx'
import LoginPage from './pages/Auth/LoginPage.jsx'
import RegisterPage from './pages/Auth/RegisterPage.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'
import ProgramsPage from './pages/Programs/ProgramsPage.jsx'
import ProgramDetailPage from './pages/Programs/ProgramDetailPage.jsx'
import MyReportsPage from './pages/Reports/MyReportsPage.jsx'
import ReportDetailPage from './pages/Reports/ReportDetailPage.jsx'
import BugSubmitPage from './pages/Submit/BugSubmitPage.jsx'
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage.jsx'
import LearningHubPage from './pages/Learn/LearningHubPage.jsx'
import ProfilePage from './pages/Profile/ProfilePage.jsx'
import CertificatesPage from './pages/Certificates/CertificatesPage.jsx'
import SettingsPage from './pages/Settings/SettingsPage.jsx'
import AdminPage from './pages/Admin/AdminPage.jsx'
import AdminReportsPage from './pages/Admin/AdminReportsPage.jsx'
import AdminUsersPage from './pages/Admin/AdminUsersPage.jsx'
import AdminProgramsPage from './pages/Admin/AdminProgramsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/:slug', element: <ProgramDetailPage /> },
      { path: 'reports', element: <MyReportsPage /> },
      { path: 'reports/:id', element: <ReportDetailPage /> },
      { path: 'submit', element: <BugSubmitPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'learn', element: <LearningHubPage /> },
      { path: 'profile/:username', element: <ProfilePage /> },
      { path: 'certificates', element: <CertificatesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'admin/reports', element: <AdminReportsPage /> },
      { path: 'admin/users', element: <AdminUsersPage /> },
      { path: 'admin/programs', element: <AdminProgramsPage /> },
    ],
  },
])

export default router
