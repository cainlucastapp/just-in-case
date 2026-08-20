// client/src/services/items.js

import { api } from './client'

// list all items for a case
export function listItems(caseId) {
  return api.get(`/cases/${caseId}/items`)
}


// get a single item by id
export function getItem(caseId, itemId) {
  return api.get(`/cases/${caseId}/items/${itemId}`)
}


// create, update, and delete items
export function createItem(caseId, fields) {
  return api.post(`/cases/${caseId}/items`, fields)
}

export function updateItem(caseId, itemId, updates) {
  return api.put(`/cases/${caseId}/items/${itemId}`, updates)
}

export function deleteItem(caseId, itemId) {
  return api.delete(`/cases/${caseId}/items/${itemId}`)
}
