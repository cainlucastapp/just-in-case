// client/src/components/account/ProfileForm.jsx

import { useState } from 'react'

// profile fields
export function ProfileForm({ initialValues, onSubmit }) {
  const [firstName, setFirstName] = useState(initialValues.first_name)
  const [lastName, setLastName] = useState(initialValues.last_name)
  const [email, setEmail] = useState(initialValues.email)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // save profile
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({ firstName, lastName, email })
    } catch (err) {
      setError(err.message || 'unable to save changes')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name
        <input
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />
      </label>
      <label>
        Last Name
        <input
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
