import { Navigate, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './context/auth-context'
import { CaseDetailPage } from './pages/CaseDetailPage'
import { CasesPage } from './pages/CasesPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

// decides where "/" goes once the session-restore check finishes
function HomeRedirect() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p>Loading…</p>
  }

  return <Navigate to={user ? '/cases' : '/login'} replace />
}

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <CasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cases/:caseId"
          element={
            <ProtectedRoute>
              <CaseDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
