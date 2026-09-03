// client/src/pages/CasesPage.jsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { useAuth } from '../context/auth-context'
import { createCase, deleteCase, listCases } from '../services/cases'
import casesIcon from '../assets/images/cases.png'
import '../styles/cases.css'

export function CasesPage() {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  // { id, title } | null - which case is pending delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')

  // load cases
  useEffect(() => {
    listCases()
      .then(setCases)
      .catch((err) => setError(err.message || 'unable to load cases'))
      .finally(() => setIsLoading(false))
  }, [])

  // create case
  async function handleCreate(values) {
    setError('')
    try {
      const newCase = await createCase(values)
      setCases((current) => [newCase, ...current])
      setIsCreating(false)
    } catch (err) {
      setError(err.message || 'unable to create case')
      throw err
    }
  }

  // delete case
  async function handleConfirmDelete() {
    const caseId = confirmDelete.id
    setConfirmDelete(null)
    setError('')
    try {
      await deleteCase(caseId)
      setCases((current) => current.filter((item) => item.id !== caseId))
    } catch (err) {
      setError(err.message || 'unable to delete case')
    }
  }

  if (isLoading) {
    return <p>Loading…</p>
  }

  return (
    <div className="container">
      <div className="page-header">
        <img src={casesIcon} alt="" className="page-header-icon" />
        <div>
          <h1>Your Cases</h1>
          <p>Everything you've organized for your family, in one place.</p>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary new-case-btn"
        onClick={() => setIsCreating(true)}
      >
        + New Case
      </button>

      {isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <div className="case-form-card card">
            <h2>New Case</h2>
            <CaseForm
              submitLabel="Add Case"
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
              resetOnSubmit
            />
          </div>
        </Modal>
      )}

      {cases.length === 0 ? (
        <p className="empty-state">You have no cases, click New Case to create a case.</p>
      ) : (
        <div className="case-grid">
          {cases.map((item) => {
            const isOwner = item.owner_id === user.id
            return (
              <div key={item.id} className="case-card card">
                <Link to={`/cases/${item.id}`} className="case-card-link">
                  <h2>{item.title}</h2>
                  {item.description && <p>{item.description}</p>}
                  {!isOwner && <span className="case-card-badge">Shared With You</span>}
                </Link>
                {isOwner && (
                  <button
                    type="button"
                    className="case-card-delete"
                    aria-label="Delete case"
                    onClick={() => setConfirmDelete({ id: item.id, title: item.title })}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Delete "${confirmDelete.title}"? This can't be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
