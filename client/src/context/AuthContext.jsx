// client/src/context/AuthContext.jsx

import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  login as loginRequest,
  logoutRequest,
  register as registerRequest,
} from '../services/auth'
import { invalidateSession } from '../services/client'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  // restore the session on first load if a token was already saved
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem('accessToken'))
      .finally(() => setIsLoading(false))
  }, [])

  // request is rejected for an expired token
  useEffect(() => {
    function handleSessionExpired() {
      localStorage.removeItem('accessToken')
      setUser(null)
      setSessionExpired(true)
    }
    window.addEventListener('session-expired', handleSessionExpired)
    return () => window.removeEventListener('session-expired', handleSessionExpired)
  }, [])

  async function login(credentials) {
    // save the jwt
    const { access_token: accessToken, user: loggedInUser } = await loginRequest(credentials)
    localStorage.setItem('accessToken', accessToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(details) {
    // registering also logs the new user in
    const { access_token: accessToken, user: newUser } = await registerRequest(details)
    localStorage.setItem('accessToken', accessToken)
    setUser(newUser)
    return newUser
  }

  function logout() {
    // discard any refresh already in flight before clearing local state
    invalidateSession()
    localStorage.removeItem('accessToken')
    setUser(null)
    logoutRequest().catch(() => {})
  }

  function dismissSessionExpired() {
    setSessionExpired(false)
  }

  // Update user
  function updateUser(updatedUser) {
    setUser(updatedUser)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    sessionExpired,
    dismissSessionExpired,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
