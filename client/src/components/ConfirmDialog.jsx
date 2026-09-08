// client/src/components/ConfirmDialog.jsx

import { useState } from 'react'
import { Modal } from './Modal'
import '../styles/confirm-dialog.css'

export function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const [isConfirming, setIsConfirming] = useState(false)

  // run the confirm action, stay open with a pending state until it finishes
  async function handleConfirm() {
    setIsConfirming(true)
    try {
      await onConfirm()
    } finally {
      setIsConfirming(false)
    }
  }

  // ignore backdrop/escape while a confirm is in flight
  function handleClose() {
    if (isConfirming) return
    onCancel()
  }

  return (
    <Modal onClose={handleClose} label={confirmLabel}>
      <div className="confirm-dialog card">
        <p>{message}</p>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Removing…' : confirmLabel}
          </button>
          {/* focus cancel, not the destructive button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isConfirming}
            data-autofocus
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
