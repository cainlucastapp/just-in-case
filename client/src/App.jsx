// client/src/App.jsx

import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { Footer } from './components/Footer'
import { LoadingSpinner } from './components/LoadingSpinner'
import { NavBar } from './components/NavBar'
import { SessionExpiredModal } from './components/SessionExpiredModal'
import { useAuth } from './context/auth-context'
import { CaseDetailPage } from './pages/CaseDetailPage'
import { CasesPage } from './pages/CasesPage'
import { HomePage } from './pages/HomePage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { ItemsPage } from './pages/ItemsPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

// page shell: nav, routed content, footer, and scroll restoration on navigation
function Layout() {
  return (
    <>
      <NavBar />

      <main className="main">
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
      <SessionExpiredModal />
    </>
  )
}

// guards routes that require a logged-in user
function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

// guards routes meant only for logged-out visitors
function GuestRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Navigate to="/cases" replace />
  }

  return <Outlet />
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="/items" element={<ItemsPage />} />
      </Route>
    </Route>,
  ),
)

function App() {
  return <RouterProvider router={router} />
}

export default App
