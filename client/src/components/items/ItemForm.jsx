// client/src/components/items/ItemForm.jsx

import { useState } from 'react'

// shared by the create-item form and the item edit form
export function ItemForm({
  initialValues = {},
  onSubmit,
  submitLabel,
  onCancel,
  resetOnSubmit = false,
}) {
  const [title, setTitle] = useState(initialValues.title ?? '')
  const [category, setCategory] = useState(initialValues.category ?? '')
  const [content, setContent] = useState(initialValues.content ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // submit item
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({ title, category, content })
      if (resetOnSubmit) {
        setTitle('')
        setCategory('')
        setContent('')
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
        Category
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        />
      </label>
      <label>
        Content
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
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
