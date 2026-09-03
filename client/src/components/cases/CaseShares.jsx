// client/src/components/cases/CaseShares.jsx

import { useState } from 'react'

// owner-only: who has access to this case, plus add/remove by email
export function CaseShares({ shares, onCreate, onDelete }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // share with a user
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await onCreate(email)
      setEmail('')
    } catch (err) {
      setError(err.message || 'unable to share case')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="shares-card card">
      {shares.length === 0 ? (
        <p className="empty-state">Not shared with anyone yet.</p>
      ) : (
        <ul className="shares-list">
          {shares.map((share) => (
            <li key={share.user.id} className="shares-list-item">
              <span>
                <span className="shares-list-name">
                  {share.user.first_name} {share.user.last_name}
                </span>
                <span className="shares-list-email">{share.user.email}</span>
              </span>
              <button
                type="button"
                className="shares-list-remove"
                aria-label="Revoke access"
                onClick={() => onDelete(share.user.id)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="shares-form">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sharing…' : 'Share'}
        </button>
      </form>
    </div>
  )
}
