import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router'
import { Instagram, MessageCircle, Phone, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { GLOBAL_NAV, isActive } from '@/lib/nav'
import { useSiteSettings } from '@/lib/useSiteSettings'
import ThemeToggle from '@/components/custom/ThemeToggle'
import Logo from '@/components/custom/Logo'

const FALLBACK_WHATSAPP = '213779527948'
const FALLBACK_PHONE = '+213 779 52 79 48'
const FALLBACK_INSTAGRAM = 'https://instagram.com/elite_reallestate'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const overlayRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  // Freeze pathname at mount so the active state doesn't flicker during
  // exit animations (useLocation() updates to the new path while the old
  // page's Header is still visible in AnimatePresence mode="wait").
  const [navPathname] = useState(pathname)
  const [isInteriorPage] = useState(pathname !== '/')

  const handleBack = () => {
    if (window.history.length > 2) navigate(-1)
    else navigate('/')
  }

  const settings = useSiteSettings()
  const whatsapp = settings?.whatsapp || FALLBACK_WHATSAPP
  const phone = settings?.phone || FALLBACK_PHONE
  const instagram = settings?.instagram || FALLBACK_INSTAGRAM
  const cleanWa = (n: string) => { const d = n.replace(/\D/g, ''); return (d.startsWith('0') && d.length === 10) ? '213' + d.slice(1) : d }
  const waLink = `https://wa.me/${cleanWa(whatsapp)}?text=${encodeURIComponent('Bonjour Elite, je suis intéressé par ASTERIA.')}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll + Escape-to-close + focus trap while the menu is open.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    if (isMobileMenuOpen) {
      const focusables = () => Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []
      )
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { setIsMobileMenuOpen(false); return }
        if (e.key !== 'Tab') return
        // Keep keyboard focus inside the dialog (aria-modal contract).
        const items = focusables()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || active === overlayRef.current)) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault(); first.focus()
        }
      }
      document.addEventListener('keydown', onKey)
      overlayRef.current?.focus()
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = ''
      }
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Return focus to the burger only after a real open → close transition
  // (not on initial mount, which would steal focus on mobile page load).
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !isMobileMenuOpen) burgerRef.current?.focus({ preventScroll: true })
    wasOpen.current = isMobileMenuOpen
  }, [isMobileMenuOpen])

  // The "Nous Contacter" CTA on the home page is a shortcut to the #contact
  // section; on any other state it falls back to navigating to /contact.
  const scrollToContact = (e: React.MouseEvent) => {
    const target = document.querySelector('#contact')
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }
    setIsMobileMenuOpen(false)
  }

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: isScrolled ? 70 : 84,
          padding: '0 clamp(24px, 5vw, 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'height 0.45s ease',
          willChange: 'transform, opacity',
        }}
      >
        {/* Background layer — no backdrop-filter. Chromium tiles blur()
            compositing on wide fixed elements, which shows up as a visible
            vertical seam partway across the bar (independent of animation).
            A near-solid background gives the same frosted look without a
            blur layer to tile. */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1,
          background: isScrolled ? 'rgba(var(--header-rgb),0.97)' : 'rgba(var(--header-rgb),0.92)',
          borderBottom: `1px solid ${isScrolled ? 'rgba(43,189,176,0.18)' : 'rgba(var(--line-rgb),0.08)'}`,
          transition: 'background 0.45s ease, border-color 0.45s ease',
        }} />

        {/* ── LOGO + back button ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0, zIndex: 1001 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Logo style={{ height: 'clamp(40px, 4.4vw, 54px)' }} />
          </Link>
          {isInteriorPage && (
            <button onClick={handleBack} className="elite-back-btn" aria-label="Page précédente">
              <ArrowLeft size={13} />
              <span>Retour</span>
            </button>
          )}
        </div>

        {/* ── CENTER NAV ── */}
        <nav className="elite-nav" style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', gap: 'clamp(28px, 3vw, 52px)' }}>
          {GLOBAL_NAV.map((item) => {
            const active = isActive(item.to, navPathname)
            return (
              <Link key={item.label} to={item.to} className={`elite-navlink${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* ── CTA + theme toggle ── */}
        <div className="elite-cta-group" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <ThemeToggle />
          <Link to="/contact" onClick={scrollToContact} className="elite-cta">
            Nous Contacter
          </Link>
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          ref={burgerRef}
          className="elite-burger"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, zIndex: 1001 }}
        >
          <div style={{ width: 26, height: 16, position: 'relative' }}>
            {[
              { top: isMobileMenuOpen ? '50%' : 0, transform: isMobileMenuOpen ? 'rotate(45deg)' : 'none' },
              { top: '50%', transform: 'translateY(-50%)', opacity: isMobileMenuOpen ? 0 : 1 },
              { top: isMobileMenuOpen ? '50%' : 'auto', bottom: isMobileMenuOpen ? 'auto' : 0, transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'none' },
            ].map((s, i) => (
              <span key={i} style={{ display: 'block', position: 'absolute', width: '100%', height: 1.5, background: '#2bbdb0', left: 0, transition: 'all 0.3s ease', ...s }} />
            ))}
          </div>
        </button>
      </motion.header>

      {/* ── MOBILE OVERLAY ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={overlayRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            tabIndex={-1}
            className="elite-mobile-overlay open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', flexDirection: 'column', outline: 'none' }}
          >
            {/* Cinematic backdrop — building image with heavy teal-tinted overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)' }} />
            <motion.img
              src="/images/asteria/building-front.jpg" alt="" aria-hidden="true"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, filter: 'grayscale(40%)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, rgba(var(--bg-rgb),0.93) 0%, rgba(var(--bg-rgb),0.8) 40%, rgba(43,189,176,0.06) 100%)' }} />
            {/* Teal vertical accent line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ position: 'absolute', left: 'clamp(24px, 7vw, 48px)', top: '15%', bottom: '15%', width: 1, background: 'linear-gradient(to bottom, transparent, rgba(43,189,176,0.4) 20%, rgba(43,189,176,0.4) 80%, transparent)', transformOrigin: 'top' }}
            />

            {/* Back button — mobile overlay */}
            {isInteriorPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ position: 'relative', padding: 'clamp(80px, 10vh, 100px) clamp(48px, 12vw, 80px) 0' }}
              >
                <button onClick={() => { closeMenu(); handleBack() }} className="elite-back-btn" style={{ fontSize: 12 }}>
                  <ArrowLeft size={14} />
                  <span>Page précédente</span>
                </button>
              </motion.div>
            )}

            {/* Navigation links — left-aligned editorial */}
            <nav style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 'clamp(48px, 12vw, 80px)', paddingTop: isInteriorPage ? 'clamp(16px, 2vh, 28px)' : 'clamp(80px, 14vh, 120px)', overflowY: 'auto', gap: 0 }}>
              {GLOBAL_NAV.map((item, i) => {
                const active = isActive(item.to, navPathname)
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.08 }}
                  >
                    {/* Top divider line for first item */}
                    {i === 0 && <div style={{ width: '70%', height: 1, background: 'rgba(var(--line-rgb),0.06)', marginBottom: 'clamp(14px, 2.5vh, 22px)' }} />}
                    <div className="emo-item" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 3vw, 22px)', padding: 'clamp(12px, 2.2vh, 20px) 0' }}>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(43,189,176,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 22 }}>{String(i + 1).padStart(2, '0')}</span>
                      <Link to={item.to} className={`elite-navlink-m${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined} onClick={closeMenu}>{item.label}</Link>
                      <ArrowUpRight size={16} style={{ color: 'rgba(43,189,176,0.3)', marginLeft: -6 }} />
                    </div>
                    <div style={{ width: '70%', height: 1, background: 'rgba(var(--line-rgb),0.06)' }} />
                  </motion.div>
                )
              })}

              {/* Tagline below links */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(13px, 3.2vw, 16px)', color: 'rgba(var(--text-rgb),0.28)', margin: 'clamp(20px, 4vh, 36px) 0 0', maxWidth: 280, lineHeight: 1.6 }}
              >
                Une adresse qui reflète votre réussite.
              </motion.p>
            </nav>

            {/* Footer — contact actions */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
              style={{ position: 'relative', padding: '0 clamp(24px, 7vw, 48px) clamp(32px, 6vh, 56px)', display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* WhatsApp CTA — prominent */}
              <a
                href={waLink}
                target="_blank" rel="noopener noreferrer"
                className="emo-wa"
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'rgba(43,189,176,0.1)', border: '1px solid rgba(43,189,176,0.25)', borderRadius: 10, textDecoration: 'none', transition: 'border-color 0.3s ease, background 0.3s ease' }}
              >
                <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: '50%', background: '#2bbdb0', color: '#04211e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={18} /></span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.02em' }}>Discuter sur WhatsApp</span>
                  <span style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(var(--text-rgb),0.45)', marginTop: 2 }}>Réponse en quelques minutes</span>
                </span>
                <ArrowUpRight size={16} color="rgba(43,189,176,0.6)" />
              </a>

              {/* Bottom row — phone + socials */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <Phone size={14} color="rgba(43,189,176,0.5)" />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, letterSpacing: '0.04em', color: 'rgba(var(--text-rgb),0.6)' }}>{phone}</span>
                </a>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <ThemeToggle />
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="emo-social-icon" aria-label="Instagram"><Instagram size={18} /></a>
                  <a href={`https://wa.me/${cleanWa(whatsapp)}`} target="_blank" rel="noopener noreferrer" className="emo-social-icon" aria-label="WhatsApp"><MessageCircle size={18} /></a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .elite-navlink, .elite-navlink-m {
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(var(--text-rgb),0.7);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }
        .elite-navlink {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.22em;
          padding: 6px 0;
        }
        .elite-navlink::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 100%; height: 1px;
          background: #2bbdb0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .elite-navlink:hover { color: var(--text); }
        .elite-navlink:hover::after, .elite-navlink.is-active::after { transform: scaleX(1); }
        .elite-navlink.is-active { color: #2bbdb0; }
        .elite-navlink-m {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(26px, 7vw, 42px);
          letter-spacing: 0.06em;
          color: rgba(var(--text-rgb),0.75);
          transition: color 0.35s ease, letter-spacing 0.35s ease;
          text-transform: uppercase;
        }
        .elite-navlink-m:hover, .elite-navlink-m.is-active {
          color: #2bbdb0;
          letter-spacing: 0.12em;
        }
        .emo-wa:hover { border-color: rgba(43,189,176,0.5) !important; background: rgba(43,189,176,0.15) !important; }
        .emo-social-icon {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid rgba(var(--line-rgb),0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(var(--text-rgb),0.5); text-decoration: none;
          transition: border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .emo-social-icon:hover { border-color: #2bbdb0; color: #2bbdb0; transform: translateY(-2px); }
        .elite-cta {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          text-decoration: none;
          color: #2bbdb0;
          padding: 11px 26px;
          border: 1px solid rgba(43,189,176,0.45);
          border-radius: 2px;
          transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
          white-space: nowrap;
        }
        .elite-cta:hover {
          background: #2bbdb0;
          color: var(--bg);
          border-color: #2bbdb0;
        }
        .elite-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(var(--text-rgb),0.45);
          transition: color 0.3s ease;
        }
        .elite-back-btn:hover { color: #2bbdb0; }
        @media (max-width: 880px) {
          .elite-nav, .elite-cta-group { display: none !important; }
          .elite-burger { display: block !important; }
          .elite-back-btn { display: none !important; }
          .elite-mobile-overlay .elite-back-btn { display: inline-flex !important; }
          .elite-mobile-overlay .elite-cta { display: inline-block !important; }
        }
        @media (min-width: 881px) {
          .elite-mobile-overlay { display: none !important; }
        }
      `}</style>
    </>
  )
}
