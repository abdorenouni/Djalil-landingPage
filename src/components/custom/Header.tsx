import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const navItems = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À Propos', href: '#about' },
  { label: 'Projets', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const heroHeight = window.innerHeight

      // Show/hide based on scroll position
      if (currentY > heroHeight * 0.8) {
        setIsScrolled(true)
        setIsVisible(true)
      } else {
        setIsScrolled(false)
        setIsVisible(false)
      }

      // Hide on scroll down, show on scroll up (after hero)
      if (currentY > heroHeight) {
        if (currentY > lastScrollY.current && currentY - lastScrollY.current > 10) {
          setIsVisible(false)
        } else if (currentY < lastScrollY.current && lastScrollY.current - currentY > 10) {
          setIsVisible(true)
        }
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    gsap.to(header, {
      y: isVisible ? 0 : -100,
      duration: 0.5,
      ease: 'power3.out',
    })
  }, [isVisible])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
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
        transform: 'translateY(-100%)',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, '#hero')}
        className="cursor-hover"
        style={{ textDecoration: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            className="font-display"
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#f3f4f1',
              letterSpacing: '0.1em',
            }}
          >
            DJALIL
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 9,
              fontWeight: 400,
              letterSpacing: '0.3em',
              color: '#d4af37',
              textTransform: 'uppercase',
            }}
          >
            Promotion
          </span>
        </div>
      </a>

      {/* Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
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
    </header>
  )
}
