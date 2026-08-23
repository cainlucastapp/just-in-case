// client/src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  // wait for the session-restore check before deciding to redirect
  if (isLoading) {
    return <p>Loading…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
