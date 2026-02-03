import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Scale, Menu, X, User, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const { currentUser, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      setMobileOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className={`header ${isHome ? 'header--transparent' : 'header--solid'}`}>
      <div className="header-container container">
        <Link to="/" className="header-logo">
          <Scale size={24} />
          <span className="header-logo-text">
            Free<span className="header-logo-accent">Lex</span>
          </span>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'header-nav--open' : ''}`}>
          <Link to="/" className="header-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <a href="#sources" className="header-link" onClick={() => setMobileOpen(false)}>Sources</a>
          <a href="#about" className="header-link" onClick={() => setMobileOpen(false)}>About</a>
          <Link to="/help" className="header-link" onClick={() => setMobileOpen(false)}>Help</Link>

          <div className="header-auth">
            {!loading && currentUser ? (
              <>
                <span className="header-user-email">
                  <User size={16} />
                  {currentUser.email}
                </span>
                <button
                  className="header-link header-link--auth header-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" className="header-link header-link--auth" onClick={() => setMobileOpen(false)}>
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline-light header-register" onClick={() => setMobileOpen(false)}>
                  Register Free
                </Link>
              </>
            ) : null}
          </div>

          <Link to="/search" className="btn btn-primary header-cta" onClick={() => setMobileOpen(false)}>
            Start Searching
          </Link>
        </nav>

        <button
          className="header-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

export default Header
