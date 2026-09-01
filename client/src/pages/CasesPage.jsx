// client/src/pages/CasesPage.jsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { createCase, deleteCase, listCases } from '../services/cases'

export function CasesPage() {
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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
    } catch (err) {
      setError(err.message || 'unable to create case')
      throw err
    }
  }

  // delete case
  async function handleDelete(caseId) {
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
    <div>
      <h1>Your cases</h1>
      {error && <p role="alert">{error}</p>}

      <CaseForm submitLabel="Add Case" onSubmit={handleCreate} resetOnSubmit />

      <ul>
        {cases.map((item) => (
          <li key={item.id}>
            <Link to={`/cases/${item.id}`}>{item.title}</Link>
            <button type="button" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
