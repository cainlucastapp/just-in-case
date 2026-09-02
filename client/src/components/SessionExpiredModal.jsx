// client/src/components/SessionExpiredModal.jsx

import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { Modal } from './Modal'

export function SessionExpiredModal() {
  const { sessionExpired, dismissSessionExpired } = useAuth()

  if (!sessionExpired) {
    return null
  }

  return (
    <Modal onClose={dismissSessionExpired}>
      <div className="confirm-dialog card">
        <p>Your session has expired. Please log in again.</p>
        <div className="form-actions">
          <Link to="/login" className="btn btn-primary" onClick={dismissSessionExpired}>
            Log In
          </Link>
        </div>
      </div>
    </Modal>
  )
}
