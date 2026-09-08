// client/src/pages/CasesPage.jsx

import { LogOut, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Modal } from '../components/Modal'
import { useAuth } from '../context/auth-context'
import { createCase, deleteCase, listCases } from '../services/cases'
import { deleteShare } from '../services/shares'
import casesIcon from '../assets/images/cases.webp'
import '../styles/cases.css'

export function CasesPage() {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  // { id, title } | null - which case is pending delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null)
  // { id, title } | null - which shared case is pending drop confirmation
  const [confirmDrop, setConfirmDrop] = useState(null)
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
    const newCase = await createCase(values)
    setCases((current) => [newCase, ...current])
    setIsCreating(false)
  }

  // delete case
  async function handleConfirmDelete() {
    const caseId = confirmDelete.id
    setError('')
    try {
      await deleteCase(caseId)
      setCases((current) => current.filter((item) => item.id !== caseId))
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || 'unable to delete case')
      setConfirmDelete(null)
    }
  }

  // drop a case shared with you
  async function handleConfirmDrop() {
    const caseId = confirmDrop.id
    setError('')
    try {
      await deleteShare(caseId, user.id)
      setCases((current) => current.filter((item) => item.id !== caseId))
      setConfirmDrop(null)
    } catch (err) {
      setError(err.message || 'unable to drop case')
      setConfirmDrop(null)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
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
        <Modal onClose={() => setIsCreating(false)} label="New Case">
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
                </Link>

                <div className="case-card-footer">
                  {!isOwner && <span className="case-card-badge">Shared With You</span>}

                  {isOwner && (
                    <button
                      type="button"
                      className="case-card-delete"
                      aria-label="Delete case"
                      onClick={() => setConfirmDelete({ id: item.id, title: item.title })}
                    >
                      <Trash2 />
                    </button>
                  )}
                  {!isOwner && (
                    <button
                      type="button"
                      className="case-card-drop"
                      aria-label="Drop case"
                      onClick={() => setConfirmDrop({ id: item.id, title: item.title })}
                    >
                      <LogOut />
                    </button>
                  )}
                </div>
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

      {confirmDrop && (
        <ConfirmDialog
          message={`Drop "${confirmDrop.title}" Case? This Case will need to be shared with you again to regain access.`}
          confirmLabel="Drop Case"
          onConfirm={handleConfirmDrop}
          onCancel={() => setConfirmDrop(null)}
        />
      )}
    </div>
  )
}
