// client/src/components/NavBar.jsx

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import logo from '../assets/images/menu-logo.webp'
import '../styles/nav.css'

export function NavBar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Just In Case" className="navbar-logo" />
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        {user ? (
          <div className={isMenuOpen ? 'navbar-actions is-open' : 'navbar-actions'}>
            <Link to="/cases">Cases</Link>
            <Link to="/items">Items</Link>
            <span className="navbar-user">{user.first_name}</span>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Log Out
            </button>
          </div>
        ) : (
          <div className={isMenuOpen ? 'navbar-actions is-open' : 'navbar-actions'}>
            <Link to="/#reasons">Reasons</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/login">Log In</Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
