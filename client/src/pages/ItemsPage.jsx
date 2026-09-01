// client/src/pages/ItemsPage.jsx

import { useEffect, useState } from 'react'
import { ItemForm } from '../components/items/ItemForm'
import { ItemRow } from '../components/items/ItemRow'
import { createItem, deleteItem, listItems, updateItem } from '../services/items'

export function ItemsPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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
    } catch (err) {
      setError(err.message || 'unable to create item')
      throw err
    }
  }

  // update item
  async function handleSave(itemId, updates) {
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

  if (isLoading) {
    return <p>Loading…</p>
  }

  return (
    <div>
      <h1>Your items</h1>
      {error && <p role="alert">{error}</p>}

      <ItemForm submitLabel="Add Item" onSubmit={handleCreate} resetOnSubmit />

      <ul>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            isOwner
            onSave={handleSave}
            onDeleteForever={handleDeleteForever}
          />
        ))}
      </ul>
    </div>
  )
}
