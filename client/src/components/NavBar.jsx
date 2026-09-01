// client/src/components/NavBar.jsx

import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import logo from '../assets/images/menu-logo.png'
import '../styles/nav.css'

export function NavBar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Just In Case" className="navbar-logo" />
        </Link>

        {user ? (
          <div className="navbar-actions">
            <Link to="/cases">Cases</Link>
            <Link to="/items">Items</Link>
            <span className="navbar-user">{user.first_name}</span>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Log Out
            </button>
          </div>
        ) : (
          <div className="navbar-actions">
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
