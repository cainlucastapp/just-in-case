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

// clears the refresh cookie
export function logoutRequest() {
  return api.post('/auth/logout')
}

export function getCurrentUser() {
  return api.get('/auth/me')
}

export function updateProfile({ firstName, lastName, email }) {
  return api.put('/auth/me', {
    first_name: firstName,
    last_name: lastName,
    email,
  })
}

export function changePassword({ currentPassword, newPassword }) {
  return api.put('/auth/me/password', {
    current_password: currentPassword,
    new_password: newPassword,
  })
}

export function deleteAccount(currentPassword) {
  return api.delete('/auth/me', { current_password: currentPassword })
}
