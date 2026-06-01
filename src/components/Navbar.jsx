import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Navbar.css'

function Navbar() {
  const { t, i18n } = useTranslation()
  const isEt = i18n.language.startsWith('et')
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Sulge menüü kui route muutub
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  // Blokeeri scroll kui menüü lahti
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleLang = () => {
    i18n.changeLanguage(isEt ? 'en' : 'et')
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/dataviz', label: t('nav.dataviz') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar__logo">
          Marily
        </Link>

        {/* Desktop lingid */}
        <div className="navbar__links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="navbar__right">
          <button onClick={toggleLang} className="btn navbar__lang">
            {isEt ? 'EN' : 'ET'}
          </button>

          {/* Hamburger — ainult mobiilis */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menüü"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobiilmenüü overlay */}
      <div
        className={`navbar__mobile ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="navbar__mobile-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar__mobile-link ${location.pathname === to ? 'navbar__mobile-link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button onClick={toggleLang} className="btn btn-accent navbar__mobile-lang">
          {isEt ? 'EN' : 'ET'}
        </button>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="navbar__backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar