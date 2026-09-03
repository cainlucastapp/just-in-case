// client/src/pages/ItemsPage.jsx

import { useEffect, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ItemForm } from '../components/items/ItemForm'
import { Modal } from '../components/Modal'
import { createItem, deleteItem, listItems, updateItem } from '../services/items'
import itemsIcon from '../assets/images/items.png'
import '../styles/items.css'

export function ItemsPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  // item | null - which item is open in the edit modal
  const [editingItem, setEditingItem] = useState(null)
  // { id, title } | null - which item is pending delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')

  // load items
  useEffect(() => {
    listItems()
      .then(setItems)
      .catch((err) => setError(err.message || 'unable to load items'))
      .finally(() => setIsLoading(false))
  }, [])

  // create item
  async function handleCreate(values) {
    setError('')
    try {
      const newItem = await createItem(values)
      setItems((current) => [newItem, ...current])
      setIsCreating(false)
    } catch (err) {
      setError(err.message || 'unable to create item')
      throw err
    }
  }

  // save item
  async function handleSave(values) {
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

  // delete item forever
  async function handleConfirmDelete() {
    const itemId = confirmDelete.id
    setConfirmDelete(null)
    setError('')
    try {
      await deleteItem(itemId)
      setItems((current) => current.filter((item) => item.id !== itemId))
    } catch (err) {
      setError(err.message || 'unable to delete item')
    }
  }

  if (isLoading) {
    return <p>Loading…</p>
  }

  return (
    <div className="container">
      <div className="page-header">
        <img src={itemsIcon} alt="" className="page-header-icon" />
        <div>
          <h1>Your Items</h1>
          <p>Accounts, instructions, and everything else you've recorded.</p>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary new-item-btn"
        onClick={() => setIsCreating(true)}
      >
        + New Item
      </button>

      {isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <div className="item-form-card card">
            <h2>New Item</h2>
            <ItemForm
              submitLabel="Add Item"
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
              resetOnSubmit
            />
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
              onSubmit={handleSave}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </Modal>
      )}

      {items.length === 0 ? (
        <p className="empty-state">You have no items, click New Item to create one.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card card">
              <h2>{item.title}</h2>
              <span className="item-card-category">{item.category}</span>
              <p className="item-card-content">{item.content}</p>

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
                  className="item-card-delete"
                  aria-label="Delete item"
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
              </div>
            </div>
          ))}
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
