// client/src/components/NavBar.jsx

import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export function NavBar() {
  const { user, logout } = useAuth()

  return (
    <nav>
      {user ? (
        <>
          <Link to="/cases">Cases</Link>
          <span>{user.first_name}</span>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
