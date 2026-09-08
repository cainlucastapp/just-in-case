// client/src/components/account/DeleteAccountDialog.jsx

import { useState } from 'react'
import { Modal } from '../Modal'

// requires the current password, not just a click-through confirm
// this cascades every case and item the user owns
export function DeleteAccountDialog({ onConfirm, onCancel }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // delete account
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsDeleting(true)
    try {
      await onConfirm(currentPassword)
    } catch (err) {
      setError(err.message || 'unable to delete account')
      setIsDeleting(false)
    }
  }

  function handleClose() {
    if (isDeleting) return
    onCancel()
  }

  return (
    <Modal onClose={handleClose} label="Delete account">
      <div className="confirm-dialog account-form-card card">
        <h2>Delete Account</h2>
        <p>
          This permanently deletes your account, every case you own, and every item
          you own. This can&rsquo;t be undone.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Enter your password to confirm
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete Account'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
