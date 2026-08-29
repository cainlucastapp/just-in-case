// client/src/pages/CaseDetailPage.jsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { CaseShares } from '../components/cases/CaseShares'
import { ItemRow } from '../components/items/ItemRow'
import { useAuth } from '../context/auth-context'
import { attachItem, detachItem, listCaseItems } from '../services/caseItems'
import { getCase, updateCase } from '../services/cases'
import { deleteItem, listItems, updateItem } from '../services/items'
import { createShare, deleteShare, listShares } from '../services/shares'

export function CaseDetailPage() {
  const { caseId } = useParams()
  const { user } = useAuth()
  const [caseData, setCaseData] = useState(null)
  const [items, setItems] = useState([])
  const [myItems, setMyItems] = useState([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [shares, setShares] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAttaching, setIsAttaching] = useState(false)

  // load case and its attached items
  useEffect(() => {
    Promise.all([getCase(caseId), listCaseItems(caseId)])
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

  // owner's full item list, for the attach picker
  useEffect(() => {
    if (!isOwner) return
    listItems()
      .then(setMyItems)
      .catch((err) => setError(err.message || 'unable to load your items'))
  }, [isOwner])

  // items the owner has that aren't already attached to this case
  const attachedIds = new Set(items.map((item) => item.id))
  const attachableItems = myItems.filter((item) => !attachedIds.has(item.id))

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

  // attach an existing item
  async function handleAttach(event) {
    event.preventDefault()
    if (!selectedItemId) return
    setError('')
    setIsAttaching(true)
    try {
      const attached = await attachItem(caseId, selectedItemId)
      setItems((current) => [attached, ...current])
      setSelectedItemId('')
    } catch (err) {
      setError(err.message || 'unable to attach item')
    } finally {
      setIsAttaching(false)
    }
  }

  // update item
  async function handleSaveItem(itemId, updates) {
    setError('')
    try {
      const updated = await updateItem(itemId, updates)
      setItems((current) =>
        current.map((item) => (item.id === itemId ? updated : item)),
      )
    } catch (err) {
      setError(err.message || 'unable to update item')
      throw err
    }
  }

  // remove item from case - item itself is untouched
  async function handleRemoveFromCase(itemId) {
    setError('')
    try {
      await detachItem(caseId, itemId)
      setItems((current) => current.filter((item) => item.id !== itemId))
    } catch (err) {
      setError(err.message || 'unable to remove item from case')
    }
  }

  // delete item forever
  async function handleDeleteForever(itemId) {
    setError('')
    try {
      await deleteItem(itemId)
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

      {/* attach an existing item */}
      {isOwner && (
        <form onSubmit={handleAttach}>
          <label>
            Attach an item
            <select
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
            >
              <option value="">Select an item…</option>
              {attachableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={isAttaching || !selectedItemId}>
            {isAttaching ? 'Attaching…' : 'Attach'}
          </button>
        </form>
      )}

      <ul>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isOwner={isOwner}
            onSave={handleSaveItem}
            onRemoveFromCase={handleRemoveFromCase}
            onDeleteForever={handleDeleteForever}
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
