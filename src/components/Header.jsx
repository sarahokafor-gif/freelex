import { Link, useLocation } from 'react-router-dom'
import { Scale, Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Header.css'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

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
