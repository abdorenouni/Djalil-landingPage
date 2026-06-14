import { useState, useEffect, useRef } from 'react'

const navItems = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À Propos', href: '#about' },
  { label: 'Projets', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: '0 clamp(24px, 5vw, 80px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isScrolled ? 'rgba(5,5,5,0.88)' : 'rgba(0,0,0,0.25)',
          backdropFilter: isScrolled ? 'blur(24px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(212,175,55,0.08)' : 'none',
          transition: 'background 0.45s ease, backdrop-filter 0.45s ease, border-bottom 0.45s ease',
        }}
      >
        {/* ── LOGO ── */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          style={{
            textDecoration: 'none',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/images/elite-logo.png"
            alt="Elite Promotion Immobilière"
            style={{
              height: 'clamp(34px, 4.5vw, 52px)',
              width: 'auto',
              display: 'block',
              // real logo is teal+white on pure black — screen blend drops the black
              mixBlendMode: 'screen',
            }}
          />
        </a>

        {/* ── DESKTOP NAV ── */}
        <nav className="header-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(243,244,241,0.65)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(243,244,241,0.65)' }}
            >
              {item.label}
            </a>
          ))}

          {/* CTA button */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            style={{
              padding: '9px 22px',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#d4af37',
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 2,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d4af37'
              e.currentTarget.style.color = '#050505'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#d4af37'
            }}
          >
            Nous Contacter
          </a>
        </nav>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          className="header-mobile-btn"
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
            {[
              { top: isMobileMenuOpen ? '50%' : 0, transform: isMobileMenuOpen ? 'rotate(45deg)' : 'none' },
              { top: '50%', transform: 'translateY(-50%)', opacity: isMobileMenuOpen ? 0 : 1 },
              { top: isMobileMenuOpen ? '50%' : 'auto', bottom: isMobileMenuOpen ? 'auto' : 0, transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'none' },
            ].map((s, i) => (
              <span
                key={i}
                style={{
                  display: 'block', position: 'absolute',
                  width: '100%', height: 1.5,
                  background: '#d4af37', left: 0,
                  transition: 'all 0.3s ease',
                  ...s,
                }}
              />
            ))}
          </div>
        </button>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div
        className="header-mobile-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(5,5,5,0.97)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
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
              fontSize: 'clamp(22px, 5.5vw, 34px)',
              fontWeight: 400,
              color: '#f3f4f1',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(18px)',
              transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
            }}
          >
            {item.label}
          </a>
        ))}

        <div style={{ width: 36, height: 0.5, background: '#d4af37', opacity: 0.3 }} />

        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          style={{
            padding: '13px 40px',
            border: '1px solid rgba(212,175,55,0.35)',
            color: '#d4af37',
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 2,
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(18px)',
            transition: `opacity 0.4s ease ${navItems.length * 0.07}s, transform 0.4s ease ${navItems.length * 0.07}s`,
          }}
        >
          Nous Contacter
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .header-desktop-nav { display: none !important; }
          .header-mobile-btn  { display: block !important; }
        }
        .header-mobile-overlay { display: flex; }
        @media (min-width: 769px) {
          .header-mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}
