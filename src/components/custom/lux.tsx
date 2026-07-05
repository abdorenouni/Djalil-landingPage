import { useRef, useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion, animate } from 'framer-motion'
import { Link } from 'react-router'

export const TEAL = '#2bbdb0'
export const GOLD = '#2bbdb0'
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* Mobile detection — short-circuits heavy scroll-linked transforms on small screens
   where they cause jank and rubber-banding. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function Arrow({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Count-up number that animates once when scrolled into view.
   Parses a leading number and preserves any prefix/suffix (e.g. "5.7K", "100%").
   Non-numeric values (e.g. "F3", "24/7") render statically. */
export function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const animatable = !!match && !value.includes('/')
  const decimals = match && match[1].includes('.') ? 1 : 0
  const suffix = match ? match[2] : ''
  const [display, setDisplay] = useState(() => (animatable ? (0).toFixed(decimals) + suffix : value))

  useEffect(() => {
    if (!inView || !animatable || !match) return
    const controls = animate(0, parseFloat(match[1]), {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v.toFixed(decimals) + suffix),
    })
    return () => controls.stop()
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{display}</span>
}

/* Scroll-LINKED section entrance — opacity/translateY/scale tied to scroll
   position (scrubbed) on desktop. On mobile / reduced-motion, falls back to a
   one-shot whileInView reveal so scroll stays smooth on touch devices. */
export function ScrollSection({ children, y = 80, id }: { children: ReactNode; y?: number; id?: string }) {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()
  if (reduce) return <div id={id}>{children}</div>
  if (isMobile) {
    return (
      <motion.div
        id={id}
        initial={{ opacity: 0, y: y * 0.45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        {children}
      </motion.div>
    )
  }
  return <ScrollSectionDesktop y={y} id={id}>{children}</ScrollSectionDesktop>
}

function ScrollSectionDesktop({ children, y, id }: { children: ReactNode; y: number; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.55'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.985, 1])
  return (
    <motion.div ref={ref} id={id} style={{ opacity, y: ty, scale, willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

/* Scroll-triggered reveal */
export function Reveal({ children, delay = 0, y = 44 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Eyebrow label with rule */
export function Eyebrow({ children, color = TEAL }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <div style={{ width: 38, height: 1, background: color }} />
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color }}>
        {children}
      </span>
    </div>
  )
}

/* Image with subtle parallax drift (desktop only — flat on mobile to save scroll
   perf, and flat under prefers-reduced-motion: the scroll-linked MotionValue is
   NOT covered by <MotionConfig reducedMotion="user">, so gate it explicitly). */
export function ParallaxImage({ src, alt, aspect = '3/4', range = 14 }: { src: string; alt: string; aspect?: string; range?: number }) {
  const isMobile = useIsMobile()
  const reduce = useReducedMotion()
  if (isMobile || reduce) {
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4, background: 'var(--bg-2)' }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return <ParallaxImageDesktop src={src} alt={alt} aspect={aspect} range={range} />
}

function ParallaxImageDesktop({ src, alt, aspect, range }: { src: string; alt: string; aspect: string; range: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`])
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4, background: 'var(--bg-2)' }}>
      <motion.img src={src} alt={alt} loading="lazy" decoding="async" style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', y }} />
    </div>
  )
}

/* ── Stat marquee: an infinite, seamless teal band of big numbers + labels,
      scrolling horizontally. The "moving band" treatment for numbers. ── */
export function StatMarquee({
  items, speed = 40, numberSize = 'clamp(40px, 6vw, 76px)',
}: {
  items: { n: string; l: string }[]
  speed?: number
  numberSize?: string
}) {
  const row = [...items, ...items]
  const fade = 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)'
  return (
    <div style={{ overflow: 'hidden', width: '100%', WebkitMaskImage: fade, maskImage: fade }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(40px, 6vw, 96px)', width: 'max-content' }}
      >
        {row.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(40px, 6vw, 96px)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: numberSize, fontWeight: 600, color: TEAL, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{s.n}</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(11px, 1.1vw, 13px)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.5)' }}>{s.l}</span>
            </span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAL, flexShrink: 0, boxShadow: `0 0 10px ${TEAL}88` }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Word-by-word scroll reveal: each word blurs + rises in, staggered ── */
const WORD_VARIANTS = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(8px)' },
  show: { opacity: 1, y: '0em', filter: 'blur(0px)' },
}
export function WordReveal({
  segments, style, stagger = 0.035,
}: {
  segments: { t: string; accent?: boolean; nowrap?: boolean }[]
  style?: React.CSSProperties
  stagger?: number
}) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ staggerChildren: stagger }}
      style={{ display: 'inline', ...style }}
    >
      {segments.map((seg, si) => {
        // Keep the whole phrase on one line — render as a single animated token.
        if (seg.nowrap) {
          return (
            <motion.span
              key={`${si}-nowrap`}
              variants={WORD_VARIANTS}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ display: 'inline-block', whiteSpace: 'nowrap', color: seg.accent ? TEAL : undefined }}
            >
              {seg.t.trim()}
            </motion.span>
          )
        }
        return seg.t.split(' ').map((w, wi) => (
          <motion.span
            key={`${si}-${wi}`}
            variants={WORD_VARIANTS}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ display: 'inline-block', whiteSpace: 'pre', color: seg.accent ? TEAL : undefined }}
          >
            {w}{' '}
          </motion.span>
        ))
      })}
    </motion.span>
  )
}

/* ── Infinite marquee of tracked keywords (kinetic editorial type) ── */
export function Marquee({ items, speed = 38, color = 'rgba(var(--text-rgb),0.5)' }: { items: string[]; speed?: number; color?: string }) {
  const row = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', width: '100%', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)', maskImage: 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(28px, 5vw, 72px)', width: 'max-content' }}
      >
        {row.map((it, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(28px, 5vw, 72px)' }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(18px, 2.4vw, 34px)', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color, whiteSpace: 'nowrap' }}>{it}</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, flexShrink: 0 }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Double-bezel card: machined-hardware shell + inner core + cursor spotlight ── */
export function BezelCard({ children, padding = 'clamp(28px, 2.6vw, 40px)' }: { children: ReactNode; padding?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div style={{ height: '100%', padding: 6, background: 'rgba(var(--line-rgb),0.035)', border: '1px solid rgba(var(--line-rgb),0.07)', borderRadius: 18 }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        className="bezel-inner"
        style={{
          position: 'relative', height: '100%', padding, borderRadius: 13, overflow: 'hidden',
          background: 'var(--surface)', boxShadow: 'inset 0 1px 1px rgba(var(--line-rgb),0.06)',
        }}
      >
        <div className="bezel-spot" aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.45s ease',
          background: 'radial-gradient(260px circle at var(--mx, 50%) var(--my, -20%), rgba(43,189,176,0.12), transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
      </div>
    </div>
  )
}

/* ── Magnetic CTA: pill with nested "button-in-button" trailing icon + press physics ── */
export function MagneticCTA({
  label, to, href, variant = 'solid', external = false, strength = 0.22,
}: {
  label: string
  to?: string
  href?: string
  variant?: 'solid' | 'outline'
  external?: boolean
  strength?: number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength * 1.3}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0, 0)' }

  const solid = variant === 'solid'
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 14, padding: '11px 12px 11px 28px',
    borderRadius: 999, textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap',
    background: solid ? TEAL : 'transparent', color: solid ? '#04211e' : TEAL,
    border: solid ? '1px solid transparent' : `1px solid ${TEAL}66`,
    boxShadow: solid ? `0 10px 34px ${TEAL}30` : 'none', willChange: 'transform',
  }
  const ico: React.CSSProperties = {
    width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: solid ? 'rgba(4,33,30,0.16)' : 'rgba(43,189,176,0.14)', color: solid ? '#04211e' : TEAL, flexShrink: 0,
  }
  const inner = (
    <>
      <span>{label}</span>
      <span className="cta-ico" style={ico}><Arrow /></span>
    </>
  )

  const cls = `magnetic-cta${solid ? ' is-solid' : ''}`
  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} style={base} onMouseMove={onMove} onMouseLeave={onLeave}>
        {inner}
      </Link>
    )
  }
  return (
    <a
      ref={ref} href={href} className={cls} style={base} onMouseMove={onMove} onMouseLeave={onLeave}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}

/* ── Thin scroll-progress bar pinned to the very top of the viewport ── */
export function ScrollProgress() {
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll()
  if (isMobile) return null
  return (
    <motion.div
      style={{
        position: 'fixed', top: 83, left: 0, right: 0, height: 2, transformOrigin: '0%',
        scaleX: scrollYProgress, zIndex: 999, pointerEvents: 'none',
        background: TEAL,
      }}
    />
  )
}

/* ── Floating "back to top" — appears once the page is scrolled ── */
export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="btt"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Remonter en haut"
          style={{
            position: 'fixed', right: 'clamp(18px, 3vw, 36px)', bottom: 'clamp(18px, 3vw, 36px)', zIndex: 900,
            width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
            background: 'rgba(6,6,6,0.6)', backdropFilter: 'blur(12px)',
            border: `1px solid ${TEAL}55`, color: TEAL,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)', transition: 'background 0.3s ease, border-color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#04211e' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,6,6,0.6)'; e.currentTarget.style.color = TEAL }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
