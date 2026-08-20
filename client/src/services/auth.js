// client/src/services/auth.js

import { api } from './client'

// auth endpoints
export function register({ firstName, lastName, email, password }) {
  return api.post('/auth/register', {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  })
}

export function login({ email, password }) {
  return api.post('/auth/login', { email, password })
}

export function getCurrentUser() {
  return api.get('/auth/me')
}
