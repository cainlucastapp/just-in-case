// client/src/pages/CaseDetailPage.jsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { ItemForm } from '../components/items/ItemForm'
import { ItemRow } from '../components/items/ItemRow'
import { useAuth } from '../context/auth-context'
import { getCase, updateCase } from '../services/cases'
import { createItem, deleteItem, listItems, updateItem } from '../services/items'

export function CaseDetailPage() {
  const { caseId } = useParams()
  const { user } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // load case and items
  useEffect(() => {
    Promise.all([getCase(caseId), listItems(caseId)])
      .then(([fetchedCase, fetchedItems]) => {
        setCaseData(fetchedCase)
        setItems(fetchedItems)
      })
      .catch((err) => setError(err.message || 'unable to load case'))
      .finally(() => setIsLoading(false))
  }, [caseId])

  // current user owns this case
  const isOwner = Boolean(caseData && user && caseData.owner_id === user.id)

  // update case
  async function handleSaveCase(values) {
    setError('')
    try {
      const updated = await updateCase(caseId, values)
      setCaseData(updated)
    } catch (err) {
      setError(err.message || 'unable to update case')
      throw err
    }
  }

  // create item
  async function handleCreateItem(values) {
    setError('')
    try {
      const newItem = await createItem(caseId, values)
      setItems((current) => [newItem, ...current])
    } catch (err) {
      setError(err.message || 'unable to create item')
      throw err
    }
  }

  // update item
  async function handleSaveItem(itemId, updates) {
    setError('')
    try {
      const updated = await updateItem(caseId, itemId, updates)
      setItems((current) =>
        current.map((item) => (item.id === itemId ? updated : item)),
      )
    } catch (err) {
      setError(err.message || 'unable to update item')
      throw err
    }
  }

  // delete item
  async function handleDeleteItem(itemId) {
    setError('')
    try {
      await deleteItem(caseId, itemId)
      setItems((current) => current.filter((item) => item.id !== itemId))
    } catch (err) {
      setError(err.message || 'unable to delete item')
    }
  }

  if (isLoading) {
    return <p>Loading…</p>
  }

  if (!caseData) {
    return <p role="alert">{error || 'case not found'}</p>
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}

      {/* edit case */}
      {isOwner ? (
        <CaseForm
          initialValues={caseData}
          submitLabel="Save case"
          onSubmit={handleSaveCase}
        />
      ) : (
        <>
          <h1>{caseData.title}</h1>
          <p>{caseData.description}</p>
        </>
      )}

      <h2>Items</h2>

      {/* create item */}
      {isOwner && (
        <ItemForm
          submitLabel="Add item"
          onSubmit={handleCreateItem}
          resetOnSubmit
        />
      )}

      <ul>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isOwner={isOwner}
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  )
}
