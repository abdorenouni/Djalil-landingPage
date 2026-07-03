import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { TEAL } from '@/components/custom/lux'
import { GLOBAL_NAV, isActive } from '@/lib/nav'
import ThemeToggle from '@/components/custom/ThemeToggle'
import Logo from '@/components/custom/Logo'

export interface NavLinkItem {
  label: string
  to: string
}

interface InteriorNavProps {
  /** @deprecated kept for call-site compatibility — the global nav is used instead. */
  links?: NavLinkItem[]
  /** @deprecated kept for call-site compatibility — the logo + Accueil link replace it. */
  back?: NavLinkItem
  /** Right-side pill CTA. Defaults to "Contact" → /contact. ASTERIA overrides to "Réserver". */
  pill?: NavLinkItem
}

const linkStyle: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
  textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.6)', textDecoration: 'none',
  transition: 'color 0.3s ease', whiteSpace: 'nowrap',
}

export default function InteriorNav({ pill = { label: 'Contact', to: '/contact' } }: InteriorNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70,
      padding: '0 clamp(20px, 5vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(var(--header-rgb),0.82)' : 'rgba(var(--header-rgb),0.55)',
      backdropFilter: 'blur(18px) saturate(140%)',
      borderBottom: `1px solid ${scrolled ? 'rgba(43,189,176,0.18)' : 'rgba(var(--line-rgb),0.08)'}`,
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Logo style={{ height: 40 }} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 3vw, 34px)' }}>
        {GLOBAL_NAV.map((l) => {
          const active = isActive(l.to, pathname)
          return (
            <Link
              key={l.to}
              to={l.to}
              className="inav-collapse"
              aria-current={active ? 'page' : undefined}
              style={{ ...linkStyle, color: active ? TEAL : 'rgba(var(--text-rgb),0.6)' }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = active ? TEAL : 'rgba(var(--text-rgb),0.6)' }}
            >
              {l.label}
            </Link>
          )
        })}
        <Link
          to={pill.to}
          style={{
            padding: '9px 22px', border: `1px solid ${TEAL}66`, color: TEAL,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
            transition: 'background 0.3s ease, color 0.3s ease', whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = 'var(--bg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = TEAL }}
        >
          {pill.label}
        </Link>
        <ThemeToggle size={36} />
      </div>

      <style>{`@media (max-width: 760px){ .inav-collapse{ display:none !important; } }`}</style>
    </nav>
  )
}
