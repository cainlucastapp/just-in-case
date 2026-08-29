// client/src/components/items/ItemRow.jsx

import { useState } from 'react'
import { ItemForm } from './ItemForm'

// single item row, editable inline
export function ItemRow({ item, isOwner, onSave, onRemoveFromCase, onDeleteForever }) {
  const [isEditing, setIsEditing] = useState(false)

  // save item
  async function handleSave(values) {
    await onSave(item.id, values)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li>
        <ItemForm
          initialValues={item}
          submitLabel="Save"
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    )
  }

  return (
    <li>
      <strong>{item.title}</strong> ({item.category})
      <p>{item.content}</p>
      {isOwner && (
        <>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          {onRemoveFromCase && (
            <button type="button" onClick={() => onRemoveFromCase(item.id)}>
              Remove from case
            </button>
          )}
          <button type="button" onClick={() => onDeleteForever(item.id)}>
            Delete forever
          </button>
        </>
      )}
    </li>
  )
}
