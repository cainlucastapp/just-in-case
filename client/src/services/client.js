// client/src/services/client.js

// falls back to the vite dev proxy when no absolute api url is configured
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// carries the http status
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch(path, { headers, ...options } = {}) {
  // attach the saved jwt to every request
  const token = localStorage.getItem('accessToken')

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...options,
  })

  // 204 No Content responses have no body
  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  // flask-jwt-extended errors
  if (!response.ok) {
    // a token was sent and rejected - the session expired
    if (token && response.status === 401) {
      window.dispatchEvent(new Event('session-expired'))
    }
    throw new ApiError(data?.error || data?.msg || 'request failed', response.status)
  }

  return data
}

// export an api object with methods
export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
}
