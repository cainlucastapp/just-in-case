// client/src/context/auth-context.js

import { createContext, useContext } from 'react'

// export
export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  // ensure that the hook is used within a provider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
