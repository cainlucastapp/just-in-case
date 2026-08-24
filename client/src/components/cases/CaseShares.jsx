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
    <div>
      <h2>Shared with</h2>
      {error && <p role="alert">{error}</p>}

      <ul>
        {shares.map((share) => (
          <li key={share.user.id}>
            {share.user.email}
            <button type="button" onClick={() => onDelete(share.user.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Share with (email)
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sharing…' : 'Share'}
        </button>
      </form>
    </div>
  )
}
