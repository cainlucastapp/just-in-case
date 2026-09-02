// client/src/components/ConfirmDialog.jsx

import { Modal } from './Modal'
import '../styles/confirm-dialog.css'

export function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <div className="confirm-dialog card">
        <p>{message}</p>
        <div className="form-actions">
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
