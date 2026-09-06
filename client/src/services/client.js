// client/src/services/client.js

// falls back to the vite dev proxy when no absolute api url is configured
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// these never trigger an automatic refresh-and-retry on a 401
const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

// carries the http status
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// reads a plain (non-httponly) cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

// network call
async function rawFetch(path, { headers, ...options } = {}) {
  const token = localStorage.getItem('accessToken')
  const csrfToken = getCookie('csrf_refresh_token')

  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
      ...headers,
    },
    ...options,
  })

  // 204 No Content responses have no body
  if (response.status === 204) {
    return { response, data: null }
  }

  const data = await response.json().catch(() => null)
  return { response, data }
}

// bumped by logout 
let sessionGeneration = 0

export function invalidateSession() {
  sessionGeneration += 1
}

// one refresh in flight at a time
let refreshPromise = null

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = rawFetch('/auth/refresh', { method: 'POST' })
      .then(({ response, data }) => {
        if (!response.ok) {
          throw new ApiError(data?.error || data?.msg || 'refresh failed', response.status)
        }
        return data
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export async function apiFetch(path, options = {}, isRetry = false) {
  const { response, data } = await rawFetch(path, options)

  if (response.ok) {
    return data
  }

  // an expired access token gets one silent refresh-and-retry
  if (response.status === 401 && !isRetry && !NO_REFRESH_PATHS.includes(path)) {
    const generationAtStart = sessionGeneration
    try {
      const { access_token: newAccessToken } = await refreshAccessToken()
      // a logout happened while this refresh was in flight discard it
      if (sessionGeneration !== generationAtStart) {
        throw new ApiError('session ended', 401)
      }
      localStorage.setItem('accessToken', newAccessToken)
      return apiFetch(path, options, true)
    } catch {
      // refresh failed
    }
  }

  // flask-jwt-extended errors
  if (localStorage.getItem('accessToken') && response.status === 401) {
    window.dispatchEvent(new Event('session-expired'))
  }
  throw new ApiError(data?.error || data?.msg || 'request failed', response.status)
}

// export an api object with methods
export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path, body) =>
    apiFetch(path, {
      method: 'DELETE',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
}
