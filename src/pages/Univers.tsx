import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useParams, Navigate } from 'react-router'
import { Reveal, WordReveal, StatMarquee, MagneticCTA, TEAL, EASE, useIsMobile } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { getUnivers, UNIVERS, type Univers as UniversType } from '@/data/univers'
import { fetchUnivers, fetchUniversList } from '@/lib/queries'
import { Seo, breadcrumbLd } from '@/lib/seo'

export default function Univers() {
  const { slug } = useParams<{ slug: string }>()
  const [u, setU] = useState<UniversType | undefined>(() => getUnivers(slug))
  const [all, setAll] = useState<UniversType[]>(UNIVERS)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (slug) fetchUnivers(slug).then((data) => data && setU(data))
    fetchUniversList().then((list) => list?.length && setAll(list))
  }, [slug])

  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])

  if (!u) return <Navigate to="/" replace />

  const others = all.filter((x) => x.slug !== u.slug)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      <Seo
        title={`${u.title} — ${u.tagline}`}
        description={u.intro[0]}
        path={`/univers/${u.slug}`}
        image={u.hero}
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: u.title, path: `/univers/${u.slug}` }])}
      />
      <Header />

      {/* ── HERO ── */}
      <div ref={heroRef} className="force-dark" style={{ position: 'relative', height: '92dvh', minHeight: 560, overflow: 'hidden', background: 'var(--bg)' }}>
        {isMobile ? (
          <img src={u.hero} alt={u.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <motion.img src={u.hero} alt={u.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.5) 0%, transparent 35%, transparent 55%, rgba(6,6,6,0.95) 100%)' }} />
        <motion.div style={{ position: 'absolute', inset: 0, ...(isMobile ? {} : { y: heroTextY }), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.2 }} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: TEAL }}>{u.kicker}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.4 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(48px, 11vw, 150px)', lineHeight: 0.95, margin: 0, color: '#fff', textShadow: '0 8px 60px rgba(0,0,0,0.6)' }}>
            {u.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 1.1, delay: 0.85 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 2vw, 20px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.85)', margin: '20px 0 0' }}>
            {u.tagline}
          </motion.p>
        </motion.div>
      </div>

      {/* ── INTRO — word reveal ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px, 13vw, 170px) clamp(24px, 5vw, 64px)', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(22px, 3.4vw, 44px)', lineHeight: 1.45, color: 'var(--text)', margin: 0, fontWeight: 400 }}>
          <WordReveal segments={[{ t: u.intro[0] }]} />
        </p>
      </section>

      {/* ── STAT MARQUEE ── */}
      <div style={{ padding: 'clamp(18px, 3.5vw, 40px) 0', borderTop: '1px solid rgba(var(--line-rgb),0.06)', borderBottom: '1px solid rgba(var(--line-rgb),0.06)' }}>
        <StatMarquee items={u.stats} speed={36} numberSize="clamp(38px, 5.5vw, 70px)" />
      </div>

      {/* ── FEATURES — sequential storytelling ── */}
      <section style={{ padding: 'clamp(70px, 11vw, 150px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          {u.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} y={60}>
              <div style={{ padding: 'clamp(26px, 4vw, 44px) 0', borderTop: i === 0 ? 'none' : '1px solid rgba(var(--line-rgb),0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }} className="uni-feat-row">
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: 400, color: 'var(--text)', margin: 0 }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.2vw, 18px)', lineHeight: 1.8, color: 'rgba(var(--text-rgb),0.6)', margin: 0, maxWidth: 620 }}>{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── GALLERY — layout varies by variant ── */}
      <Gallery u={u} onOpen={(i) => setLightboxIndex(i)} />

      {/* ── LIGHTBOX ── */}
      <Lightbox items={u.gallery} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onIndex={setLightboxIndex} />

      {/* ── 3D block (only where flagged) ── */}
      {/* ── QUOTE ── */}
      <section style={{ position: 'relative', padding: 'clamp(80px, 13vw, 180px) clamp(24px, 5vw, 64px)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '120%', background: `radial-gradient(ellipse, ${TEAL}0c 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal><div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(70px, 11vw, 150px)', lineHeight: 0.5, color: TEAL, opacity: 0.25, marginBottom: 10 }}>“</div></Reveal>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(24px, 4vw, 50px)', lineHeight: 1.4, color: 'var(--text)', margin: 0, fontWeight: 400 }}>
              <WordReveal segments={[{ t: u.quote, accent: false }]} />
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── CONTINUE: other universes ── */}
      <section style={{ padding: 'clamp(60px, 9vw, 120px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(var(--line-rgb),0.05)' }}>
        <Reveal>
          <p style={{ textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: TEAL, margin: '0 0 clamp(32px, 4vw, 48px)' }}>Poursuivez la visite</p>
        </Reveal>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(16px, 2.5vw, 28px)' }} className="uni-others">
          {others.map((o, i) => (
            <Reveal key={o.slug} delay={i * 0.08}>
              <a href={`/univers/${o.slug}`} className="uni-other-card" style={{ display: 'block', position: 'relative', aspectRatio: '16/10', borderRadius: 5, overflow: 'hidden', textDecoration: 'none' }}>
                <img src={o.hero} alt={o.title} loading="lazy" className="uni-other-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.9), transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 'clamp(20px, 3vw, 36px)' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>{o.num}</span>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 2.6vw, 34px)', fontWeight: 400, color: 'var(--text)', margin: '6px 0 0' }}>{o.title}</h3>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="force-dark" style={{ position: 'relative', minHeight: 420, height: '56dvh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={u.hero} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.74)' }} />
        <Reveal>
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5.5vw, 72px)', fontWeight: 700, margin: '0 0 28px', lineHeight: 1.05 }}>Découvrez ASTERIA</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MagneticCTA label="Réserver une visite" to="/contact" variant="solid" />
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />

      <style>{`
        .uni-other-card:hover .uni-other-img { transform: scale(1.06); }
        @media (max-width: 760px){
          .uni-others { grid-template-columns: 1fr !important; }
          .uni-feat-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}

/* Clickable gallery tile — opens the lightbox. Includes hover scale + zoom cursor. */
function GalleryTile({ src, caption, aspect, onClick, eager = false }: { src: string; caption: string; aspect: string; onClick: () => void; eager?: boolean }) {
  return (
    <figure style={{ margin: 0 }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Agrandir : ${caption}`}
        className="uni-tile"
        style={{
          appearance: 'none', border: 'none', padding: 0, margin: 0, background: 'var(--bg-2)',
          position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4,
          cursor: 'zoom-in', display: 'block',
        }}
      >
        <img
          src={src}
          alt={caption}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="uni-tile-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease', display: 'block' }}
        />
        <div className="uni-tile-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,0.78) 0%, rgba(6,6,6,0) 45%)', opacity: 0, transition: 'opacity 0.35s ease' }} />
        <div className="uni-tile-caption" style={{ position: 'absolute', left: 16, right: 16, bottom: 14, textAlign: 'left', opacity: 0, transform: 'translateY(8px)', transition: 'opacity 0.35s ease, transform 0.4s ease' }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text)' }}>{caption}</span>
        </div>
        <span className="uni-tile-zoom" aria-hidden="true" style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(6,6,6,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.35s ease' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={TEAL} strokeWidth="1.6" strokeLinecap="round"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3M5 7h4M7 5v4" /></svg>
        </span>
      </button>
      <figcaption style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.5)', marginTop: 14, display: 'block' }}>{caption}</figcaption>
    </figure>
  )
}

/* Gallery layout changes per variant — asymmetric editorial grids per universe. */
function Gallery({ u, onOpen }: { u: ReturnType<typeof getUnivers>; onOpen: (i: number) => void }) {
  if (!u) return null
  const g = u.gallery

  const styleBlock = (
    <style>{`
      .uni-tile:hover .uni-tile-img { transform: scale(1.05); }
      .uni-tile:hover .uni-tile-overlay { opacity: 1; }
      .uni-tile:hover .uni-tile-caption { opacity: 1; transform: translateY(0); }
      .uni-tile:hover .uni-tile-zoom { opacity: 1; }
      .uni-tile:focus-visible { outline: 2px solid ${TEAL}; outline-offset: 4px; }
      @media (hover: none) {
        .uni-tile-overlay, .uni-tile-caption, .uni-tile-zoom { opacity: 0 !important; }
      }
      @media (max-width: 760px){
        .uni-grid-2, .uni-grid-3, .uni-grid-4 { grid-template-columns: 1fr !important; }
      }
    `}</style>
  )

  if (u.variant === 'cinematic') {
    // Magazine layout: hero spread, alternating large + side stack
    const hero = g[0]
    const second = g[1]
    const third = g[2]
    const rest = g.slice(3)
    return (
      <section style={{ padding: 'clamp(40px, 6vw, 90px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {hero && <Reveal><GalleryTile src={hero.src} caption={hero.caption} aspect="21/9" onClick={() => onOpen(0)} eager /></Reveal>}
          {(second || third) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'clamp(16px, 2.5vw, 28px)', marginTop: 'clamp(16px, 2.5vw, 28px)' }} className="uni-grid-2">
              {second && <Reveal delay={0.05}><GalleryTile src={second.src} caption={second.caption} aspect="4/3" onClick={() => onOpen(1)} /></Reveal>}
              {third && <Reveal delay={0.1}><GalleryTile src={third.src} caption={third.caption} aspect="3/4" onClick={() => onOpen(2)} /></Reveal>}
            </div>
          )}
          {rest.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(rest.length, 4)}, 1fr)`, gap: 'clamp(16px, 2.5vw, 28px)', marginTop: 'clamp(16px, 2.5vw, 28px)' }} className="uni-grid-4">
              {rest.map((item, i) => (
                <Reveal key={item.src} delay={i * 0.07}>
                  <GalleryTile src={item.src} caption={item.caption} aspect="1/1" onClick={() => onOpen(3 + i)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        {styleBlock}
      </section>
    )
  }

  if (u.variant === 'editorial') {
    // Offset two-column editorial grid with mixed aspect ratios
    return (
      <section style={{ padding: 'clamp(40px, 6vw, 90px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 32px)' }} className="uni-grid-2">
          {g.map((item, i) => {
            const aspects = ['4/5', '4/3', '3/4', '16/10', '1/1', '4/5', '4/3']
            const aspect = aspects[i % aspects.length]
            return (
              <Reveal key={item.src} delay={(i % 2) * 0.08}>
                <div style={{ marginTop: i % 2 === 1 ? 'clamp(0px, 6vw, 80px)' : 0 }}>
                  <GalleryTile src={item.src} caption={item.caption} aspect={aspect} onClick={() => onOpen(i)} eager={i < 2} />
                </div>
              </Reveal>
            )
          })}
        </div>
        {styleBlock}
      </section>
    )
  }

  // 'gallery' — big lead image, then 3-up grid, then more in 2-up
  const first = g[0]
  const triple = g.slice(1, 4)
  const rest = g.slice(4)
  return (
    <section style={{ padding: 'clamp(40px, 6vw, 90px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {first && <Reveal><GalleryTile src={first.src} caption={first.caption} aspect="16/9" onClick={() => onOpen(0)} eager /></Reveal>}
        {triple.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${triple.length}, 1fr)`, gap: 'clamp(16px, 2.5vw, 28px)', marginTop: 'clamp(16px, 2.5vw, 28px)' }} className="uni-grid-3">
            {triple.map((item, i) => (
              <Reveal key={item.src} delay={i * 0.07}>
                <GalleryTile src={item.src} caption={item.caption} aspect="3/4" onClick={() => onOpen(1 + i)} />
              </Reveal>
            ))}
          </div>
        )}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(16px, 2.5vw, 28px)', marginTop: 'clamp(16px, 2.5vw, 28px)' }} className="uni-grid-2">
            {rest.map((item, i) => (
              <Reveal key={item.src} delay={i * 0.07}>
                <GalleryTile src={item.src} caption={item.caption} aspect="4/3" onClick={() => onOpen(4 + i)} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      {styleBlock}
    </section>
  )
}

/* Fullscreen lightbox — keyboard (Esc, ←, →) and touch-swipe navigation. */
function Lightbox({
  items, index, onClose, onIndex,
}: {
  items: { src: string; caption: string }[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}) {
  const open = index !== null
  const next = useCallback(() => onIndex(((index ?? 0) + 1) % items.length), [index, items.length, onIndex])
  const prev = useCallback(() => onIndex(((index ?? 0) - 1 + items.length) % items.length), [index, items.length, onIndex])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose, next, prev])

  const item = index !== null ? items[index] : null
  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          role="dialog" aria-modal="true" aria-label={item.caption}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(6,6,6,0.96)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(16px, 3vw, 40px)',
          }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            type="button" aria-label="Fermer" onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(var(--line-rgb),0.08)', border: '1px solid rgba(var(--line-rgb),0.12)',
              color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m3 3 10 10M13 3 3 13" /></svg>
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              type="button" aria-label="Image précédente"
              onClick={(e) => { e.stopPropagation(); prev() }}
              style={{
                position: 'absolute', left: 'clamp(8px, 2vw, 24px)', top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%', background: 'rgba(var(--line-rgb),0.06)',
                border: '1px solid rgba(var(--line-rgb),0.1)', color: 'var(--text)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m10 3-5 5 5 5" /></svg>
            </button>
          )}

          {/* Next */}
          {items.length > 1 && (
            <button
              type="button" aria-label="Image suivante"
              onClick={(e) => { e.stopPropagation(); next() }}
              style={{
                position: 'absolute', right: 'clamp(8px, 2vw, 24px)', top: '50%', transform: 'translateY(-50%)',
                width: 48, height: 48, borderRadius: '50%', background: 'rgba(var(--line-rgb),0.06)',
                border: '1px solid rgba(var(--line-rgb),0.1)', color: 'var(--text)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          )}

          {/* Image — swipe to nav */}
          <motion.img
            key={item.src}
            src={item.src} alt={item.caption}
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) next()
              else if (info.offset.x > 80) prev()
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw', maxHeight: '82vh', objectFit: 'contain',
              borderRadius: 4, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', cursor: 'grab', touchAction: 'pan-y',
            }}
          />

          {/* Caption + counter */}
          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 18, textAlign: 'center', color: 'var(--text)' }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, margin: 0, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{item.caption}</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontVariantNumeric: 'tabular-nums', fontSize: 11, letterSpacing: '0.2em', color: TEAL, margin: '8px 0 0' }}>
              {String((index ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
