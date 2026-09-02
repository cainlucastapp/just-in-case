// client/src/context/AuthContext.jsx

import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '../services/auth'
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

  // the api client dispatches this when a request is rejected for an expired token
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
    // save the jwt so future requests and page reloads stay authenticated
    const { access_token: accessToken, user: loggedInUser } = await loginRequest(credentials)
    localStorage.setItem('accessToken', accessToken)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function register(details) {
    // registering also logs the new user in, same token handling as login
    const { access_token: accessToken, user: newUser } = await registerRequest(details)
    localStorage.setItem('accessToken', accessToken)
    setUser(newUser)
    return newUser
  }

  function logout() {
    // jwt auth is stateless, logging out is a client-side clear
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  function dismissSessionExpired() {
    setSessionExpired(false)
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    sessionExpired,
    dismissSessionExpired,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
