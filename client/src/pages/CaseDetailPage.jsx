// client/src/pages/CaseDetailPage.jsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { CaseShares } from '../components/cases/CaseShares'
import { ItemForm } from '../components/items/ItemForm'
import { ItemRow } from '../components/items/ItemRow'
import { useAuth } from '../context/auth-context'
import { getCase, updateCase } from '../services/cases'
import { createItem, deleteItem, listItems, updateItem } from '../services/items'
import { createShare, deleteShare, listShares } from '../services/shares'

export function CaseDetailPage() {
  const { caseId } = useParams()
  const { user } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [items, setItems] = useState([])
  const [shares, setShares] = useState([])
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

  // shares are owner-only
  useEffect(() => {
    if (!isOwner) return
    listShares(caseId)
      .then(setShares)
      .catch((err) => setError(err.message || 'unable to load shares'))
  }, [caseId, isOwner])

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

  // share case
  async function handleCreateShare(email) {
    setError('')
    try {
      const newShare = await createShare(caseId, email)
      setShares((current) => [...current, newShare])
    } catch (err) {
      setError(err.message || 'unable to share case')
      throw err
    }
  }

  // revoke access
  async function handleDeleteShare(userId) {
    setError('')
    try {
      await deleteShare(caseId, userId)
      setShares((current) => current.filter((share) => share.user.id !== userId))
    } catch (err) {
      setError(err.message || 'unable to revoke access')
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

      {/* owner-only access management */}
      {isOwner && (
        <CaseShares
          shares={shares}
          onCreate={handleCreateShare}
          onDelete={handleDeleteShare}
        />
      )}
    </div>
  )
}
