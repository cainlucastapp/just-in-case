// client/src/services/items.js

import { api } from './client'

// list all items the current user owns
export function listItems() {
  return api.get('/items')
}

// get a single owned item by id
export function getItem(itemId) {
  return api.get(`/items/${itemId}`)
}

// create, update, and delete items - independent of any case
export function createItem(fields) {
  return api.post('/items', fields)
}

export function updateItem(itemId, updates) {
  return api.put(`/items/${itemId}`, updates)
}

// deletes forever - removes it from every case it's attached to
export function deleteItem(itemId) {
  return api.delete(`/items/${itemId}`)
}
