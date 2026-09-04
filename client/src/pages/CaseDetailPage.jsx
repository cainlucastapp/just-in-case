// client/src/pages/CaseDetailPage.jsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CaseForm } from '../components/cases/CaseForm'
import { CaseShares } from '../components/cases/CaseShares'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ItemForm } from '../components/items/ItemForm'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Modal } from '../components/Modal'
import { useAuth } from '../context/auth-context'
import { attachItem, detachItem, listCaseItems } from '../services/caseItems'
import { getCase, updateCase } from '../services/cases'
import { listItems, updateItem } from '../services/items'
import { createShare, deleteShare, listShares } from '../services/shares'
import openCaseIcon from '../assets/images/open-case.webp'
import '../styles/case-detail.css'

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
  const [isEditingCase, setIsEditingCase] = useState(false)
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false)
  // item | null - which item is open in the edit modal
  const [editingItem, setEditingItem] = useState(null)
  // { id, title } | null - which item is pending remove-from-case confirmation
  const [confirmRemove, setConfirmRemove] = useState(null)

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
      setIsEditingCase(false)
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
      setIsAttachModalOpen(false)
    } catch (err) {
      setError(err.message || 'unable to attach item')
    } finally {
      setIsAttaching(false)
    }
  }

  // save item
  async function handleSaveItem(values) {
    setError('')
    try {
      const updated = await updateItem(editingItem.id, values)
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setEditingItem(null)
    } catch (err) {
      setError(err.message || 'unable to update item')
      throw err
    }
  }

  // remove item from case - item itself is untouched
  async function handleConfirmRemove() {
    const itemId = confirmRemove.id
    setConfirmRemove(null)
    setError('')
    try {
      await detachItem(caseId, itemId)
      setItems((current) => current.filter((item) => item.id !== itemId))
    } catch (err) {
      setError(err.message || 'unable to remove item from case')
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
    return <LoadingSpinner />
  }

  if (!caseData) {
    return <p role="alert">{error || 'case not found'}</p>
  }

  return (
    <div className="container">
      <div className="page-header">
        <img src={openCaseIcon} alt="" className="page-header-icon" />
        <div>
          <h1>{caseData.title}</h1>
          {caseData.description && <p>{caseData.description}</p>}
        </div>
        {isOwner && (
          <button
            type="button"
            className="page-header-edit"
            aria-label="Edit case"
            onClick={() => setIsEditingCase(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="M15 5l4 4" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {isEditingCase && (
        <Modal onClose={() => setIsEditingCase(false)}>
          <div className="case-form-card card">
            <h2>Edit Case</h2>
            <CaseForm
              initialValues={caseData}
              submitLabel="Save Case"
              onSubmit={handleSaveCase}
              onCancel={() => setIsEditingCase(false)}
            />
          </div>
        </Modal>
      )}

      <div className="section-header">
        <h2>Items</h2>
        {isOwner && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAttachModalOpen(true)}
          >
            + Attach Item
          </button>
        )}
      </div>

      {isAttachModalOpen && (
        <Modal onClose={() => setIsAttachModalOpen(false)}>
          <div className="attach-form-card card">
            <h2>Attach Item</h2>
            {attachableItems.length === 0 ? (
              <p className="empty-state">
                All your items are already attached, or you haven't created any yet.
              </p>
            ) : (
              <form onSubmit={handleAttach}>
                <label>
                  Item
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
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isAttaching || !selectedItemId}
                  >
                    {isAttaching ? 'Attaching…' : 'Attach'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAttachModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      )}

      {editingItem && (
        <Modal onClose={() => setEditingItem(null)}>
          <div className="item-form-card card">
            <h2>Edit Item</h2>
            <ItemForm
              initialValues={editingItem}
              submitLabel="Save Item"
              onSubmit={handleSaveItem}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </Modal>
      )}

      {items.length === 0 ? (
        <p className="empty-state">No items attached to this case yet.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card card">
              <h2>{item.title}</h2>
              <span className="item-card-category">{item.category}</span>
              <p className="item-card-content">{item.content}</p>

              {isOwner && (
                <div className="item-card-actions">
                  <button
                    type="button"
                    className="item-card-edit"
                    aria-label="Edit item"
                    onClick={() => setEditingItem(item)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="M15 5l4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="item-card-remove"
                    aria-label="Remove from case"
                    onClick={() => setConfirmRemove({ id: item.id, title: item.title })}
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <>
          <div className="section-header">
            <h2>Shared With</h2>
          </div>
          <CaseShares shares={shares} onCreate={handleCreateShare} onDelete={handleDeleteShare} />
        </>
      )}

      {confirmRemove && (
        <ConfirmDialog
          message={`Remove "${confirmRemove.title}" from this case? The item itself won't be deleted.`}
          confirmLabel="Remove From Case"
          onConfirm={handleConfirmRemove}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  )
}
