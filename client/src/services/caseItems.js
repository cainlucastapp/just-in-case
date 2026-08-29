// client/src/services/caseItems.js

import { api } from './client'

// list items attached to a case
export function listCaseItems(caseId) {
  return api.get(`/cases/${caseId}/items`)
}

// attach an existing owned item to a case
export function attachItem(caseId, itemId) {
  return api.post(`/cases/${caseId}/items`, { item_id: itemId })
}

// detach an item from a case the item itself is untouched
export function detachItem(caseId, itemId) {
  return api.delete(`/cases/${caseId}/items/${itemId}`)
}
