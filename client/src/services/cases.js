// client/src/services/cases.js

import { api } from './client'

// list all cases for the current user
export function listCases() {
  return api.get('/cases')
}

// get a single case by id
export function getCase(caseId) {
  return api.get(`/cases/${caseId}`)
}


// create, update, and delete cases
export function createCase(fields) {
  return api.post('/cases', fields)
}

export function updateCase(caseId, updates) {
  return api.put(`/cases/${caseId}`, updates)
}

export function deleteCase(caseId) {
  return api.delete(`/cases/${caseId}`)
}
