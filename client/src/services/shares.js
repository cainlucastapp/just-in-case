// client/src/services/shares.js

import { api } from './client'

// list who a case is shared with
export function listShares(caseId) {
  return api.get(`/cases/${caseId}/shares`)
}

// share access to a case
export function createShare(caseId, email) {
  return api.post(`/cases/${caseId}/shares`, { email })
}

// revoke access to a case
export function deleteShare(caseId, userId) {
  return api.delete(`/cases/${caseId}/shares/${userId}`)
}
