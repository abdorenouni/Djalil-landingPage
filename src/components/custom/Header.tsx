import { useState, useEffect, useRef } from 'react'


const navItems = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À Propos', href: '#about' },
  { label: 'Projets', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setIsScrolled(currentY > 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 clamp(24px, 5vw, 80px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isScrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.1)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease',

        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="cursor-hover"
          style={{ textDecoration: 'none', zIndex: 1001 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* House icon — solid fill with evenodd cutout */}
            <svg
              viewBox="0 0 200 240"
              width="30"
              height="36"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M 100 8 L 188 78 L 188 172 L 125 172 L 125 232 L 12 232 L 12 78 Z M 100 52 L 148 88 L 148 135 L 95 135 L 95 100 L 52 100 L 52 88 Z"
                fill="#2bbdb0"
                fillRule="evenodd"
              />
            </svg>
            {/* ELITE + subtitle stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span
                className="font-display"
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#f3f4f1',
                  letterSpacing: '0.1em',
                  lineHeight: 1,
                }}
              >
                ELITE
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 7,
                  fontWeight: 300,
                  letterSpacing: '0.28em',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                Promotion Immobilière
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="cursor-hover"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(243, 244, 241, 0.7)',
                textDecoration: 'none',
                position: 'relative',
                transition: 'color 0.3s ease',
                paddingBottom: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#d4af37'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(243, 244, 241, 0.7)'
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="cursor-hover"
            style={{
              padding: '10px 24px',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 3,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4af37'
              e.currentTarget.style.color = '#050505'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#d4af37'
            }}
          >
            Contact
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            zIndex: 1001,
          }}
        >
          <div style={{ width: 24, height: 18, position: 'relative' }}>
            <span
              style={{
                display: 'block',
                width: '100%',
                height: 1.5,
                background: '#d4af37',
                position: 'absolute',
                left: 0,
                transition: 'all 0.3s ease',
                top: isMobileMenuOpen ? '50%' : 0,
                transform: isMobileMenuOpen ? 'rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '100%',
                height: 1.5,
                background: '#d4af37',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: isMobileMenuOpen ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '100%',
                height: 1.5,
                background: '#d4af37',
                position: 'absolute',
                left: 0,
                transition: 'all 0.3s ease',
                bottom: isMobileMenuOpen ? 'auto' : 0,
                top: isMobileMenuOpen ? '50%' : 'auto',
                transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'none',
              }}
            />
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className="mobile-menu-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(5, 5, 5, 0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        {navItems.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(24px, 6vw, 36px)',
              fontWeight: 400,
              color: '#f3f4f1',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
            }}
          >
            {item.label}
          </a>
        ))}
        <div
          style={{
            width: 40,
            height: 1,
            background: '#d4af37',
            opacity: 0.3,
            margin: '8px 0',
          }}
        />
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          style={{
            padding: '14px 40px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#d4af37',
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 3,
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.4s ease ${navItems.length * 0.08}s, transform 0.4s ease ${navItems.length * 0.08}s`,
          }}
        >
          Nous Contacter
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
