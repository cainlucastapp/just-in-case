// client/src/components/cases/CaseForm.jsx

import { useState } from 'react'

// shared by the create-case form and the case edit form
export function CaseForm({
  initialValues = {},
  onSubmit,
  submitLabel,
  onCancel,
  resetOnSubmit = false,
}) {
  const [title, setTitle] = useState(initialValues.title ?? '')
  const [description, setDescription] = useState(initialValues.description ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // submit case
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({ title, description })
      if (resetOnSubmit) {
        setTitle('')
        setDescription('')
      }
    } catch {
      // caller already surfaced the error, just leave the fields as typed
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>
      <label>
        Description
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
