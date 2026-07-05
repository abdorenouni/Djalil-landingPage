import { Link } from 'react-router'
import { Instagram, MessageCircle, Phone } from 'lucide-react'
import { TEAL } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'
import { GLOBAL_NAV } from '@/lib/nav'
import Logo from '@/components/custom/Logo'

const FALLBACK_WHATSAPP = '213779527948'
const FALLBACK_PHONE = '+213 779 52 79 48'
const FALLBACK_INSTAGRAM = 'https://instagram.com/elite_reallestate'
const FALLBACK_BRAND = 'Elite Promotion Immobilière'
const FALLBACK_ADDRESS = 'Alger · Algérie'

const footLink: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.55)', textDecoration: 'none',
  transition: 'color 0.3s ease',
}

// Footer navigation mirrors the global menu so it stays consistent everywhere.
const NAV = GLOBAL_NAV

/** Shared luxury footer for interior pages. */
export default function SiteFooter() {
  const settings = useSiteSettings()
  // Once settings has loaded, an empty CMS field means the client intentionally
  // cleared it — respect that instead of silently falling back to a hardcoded
  // value. The fallback only applies before the fetch resolves (settings === null).
  const loaded = settings !== null
  const WHATSAPP = loaded ? settings.whatsapp : FALLBACK_WHATSAPP
  const PHONE = loaded ? settings.phone : FALLBACK_PHONE
  const INSTAGRAM = loaded ? settings.instagram : FALLBACK_INSTAGRAM
  const BRAND = settings?.brandName || FALLBACK_BRAND
  const ADDRESS = settings?.address || FALLBACK_ADDRESS
  const TAGLINE = settings?.tagline || 'Une adresse qui reflète votre réussite.'

  const year = new Date().getFullYear()
  const hover = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) =>
    (e.currentTarget.style.color = on ? 'var(--text)' : 'rgba(var(--text-rgb),0.55)')

  return (
    <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid rgba(var(--line-rgb),0.12)', padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px) clamp(32px, 4vw, 48px)' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'flex-start' }}>
          {/* Brand */}
          <div style={{ maxWidth: 360 }}>
            <Logo alt={BRAND} style={{ height: 46 }} />
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 16, lineHeight: 1.6, color: 'rgba(var(--text-rgb),0.45)', margin: '22px 0 0' }}>
              {TAGLINE}
            </p>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} style={footLink} onMouseEnter={(e) => hover(e, true)} onMouseLeave={(e) => hover(e, false)}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: TEAL }}>Nous suivre</span>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                WHATSAPP && { icon: <MessageCircle size={18} />, href: `https://wa.me/${(() => { const d = WHATSAPP.replace(/\D/g,''); return (d.startsWith('0')&&d.length===10)?'213'+d.slice(1):d })()}`, label: 'WhatsApp' },
                INSTAGRAM && { icon: <Instagram size={18} />, href: INSTAGRAM, label: 'Instagram' },
                PHONE && { icon: <Phone size={18} />, href: `tel:${PHONE.replace(/\s/g, '')}`, label: 'Téléphone' },
              ].filter(Boolean).map((s: any) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(var(--line-rgb),0.12)', borderRadius: '50%', color: 'rgba(var(--text-rgb),0.65)', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.12)'; e.currentTarget.style.color = 'rgba(var(--text-rgb),0.65)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            {PHONE && <a href={`tel:${PHONE.replace(/\s/g, '')}`} style={{ ...footLink, fontSize: 13, letterSpacing: '0.06em', textTransform: 'none' }}>{PHONE}</a>}
          </div>
        </div>

        <div style={{ marginTop: 'clamp(40px, 5vw, 64px)', paddingTop: 24, borderTop: '1px solid rgba(var(--line-rgb),0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.3)' }}>
            © {year} {BRAND}
          </span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.3)' }}>
            {ADDRESS}
          </span>
        </div>
      </div>
    </footer>
  )
}
