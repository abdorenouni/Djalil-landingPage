import { useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'

const TEAL = '#2bbdb0'
const GOLD = '#d4af37'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Reusable scroll reveal ── */
function Reveal({ children, delay = 0, y = 44 }: { children: ReactNode; delay?: number; y?: number }) {
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

/* ── Eyebrow label ── */
function Eyebrow({ children, color = TEAL }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <div style={{ width: 38, height: 1, background: color }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color }}>
        {children}
      </span>
    </div>
  )
}

/* ── Parallax image ── */
function ParallaxImage({ src, alt, aspect = '3/4', range = 14 }: { src: string; alt: string; aspect?: string; range?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`])
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4, background: '#0a0a0a' }}>
      <motion.img
        src={src}
        alt={alt}
        style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', y }}
      />
    </div>
  )
}

const PLANS = [
  { surface: '103.88', img: '/images/asteria/plan-103.jpg' },
  { surface: '104.93', img: '/images/asteria/plan-104.jpg' },
  { surface: '109.42', img: '/images/asteria/plan-109.jpg' },
  { surface: '110.48', img: '/images/asteria/plan-110.jpg' },
]

export default function Asteria() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.18])
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '24%'])
  const heroTextY = useTransform(heroProgress, [0, 1], ['0%', '60%'])
  const heroOverlay = useTransform(heroProgress, [0, 1], [0.45, 0.85])

  const [plan, setPlan] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#060606', color: '#f3f4f1', overflowX: 'hidden' }}
    >
      {/* ── MINIMAL NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 70, padding: '0 clamp(20px, 5vw, 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,6,6,0.4)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/elite-logo.png" alt="Elite" style={{ height: 38, width: 'auto', mixBlendMode: 'screen' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 36px)' }}>
          <Link to="/" style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.6)', textDecoration: 'none' }}>
            ← Retour
          </Link>
          <Link to="/#contact" style={{
            padding: '9px 22px', border: `1px solid ${GOLD}55`, color: GOLD,
            fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
          }}>
            Réserver
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <motion.img
          src="/images/asteria/building-hero.jpg"
          alt="ASTERIA — Tour résidentielle de luxe"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }}
        />
        <motion.div style={{ position: 'absolute', inset: 0, background: '#060606', opacity: heroOverlay }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.5) 0%, transparent 30%, transparent 55%, rgba(6,6,6,0.95) 100%)' }} />

        <motion.div style={{
          position: 'absolute', inset: 0, y: heroTextY,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
        }}>
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 0.7, letterSpacing: '0.42em' }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.3vw, 14px)', color: TEAL, textTransform: 'uppercase', marginBottom: 24 }}
          >
            Élite Promotion Immobilière présente
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: EASE, delay: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 700,
              fontSize: 'clamp(64px, 16vw, 240px)', lineHeight: 0.92,
              letterSpacing: '0.04em', margin: 0,
              color: '#fff', textShadow: '0 8px 60px rgba(0,0,0,0.6)',
            }}
          >
            ASTERIA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px, 2vw, 22px)', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.85)', margin: '20px 0 0' }}
          >
            Luxury Living
          </motion.p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          style={{ position: 'absolute', bottom: 34, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.5)' }}>Défiler</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
        </motion.div>
      </div>

      {/* ── MANIFESTO + STATS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(80px, 14vw, 180px) clamp(24px, 5vw, 64px)', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(24px, 4vw, 52px)', lineHeight: 1.4, color: '#f3f4f1', margin: 0, fontWeight: 400 }}>
            Une architecture sculptée par la lumière, où chaque balcon ondule comme une vague
            et chaque cascade murmure le luxe. <span style={{ color: TEAL }}>ASTERIA n'est pas une adresse — c'est une signature.</span>
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'clamp(24px, 4vw, 56px)', marginTop: 'clamp(60px, 8vw, 100px)',
          }}>
            {[
              { n: '12', l: 'Étages signature' },
              { n: 'F3', l: 'Résidences 103–110 m²' },
              { n: '∞', l: 'Piscines & cascades' },
              { n: '24/7', l: 'Conciergerie privée' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.5)', marginTop: 12 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── ARCHITECTURE FEATURE ── */}
      <section style={{ padding: 'clamp(40px, 8vw, 100px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="ast-split">
          <Reveal>
            <Eyebrow>L'Architecture</Eyebrow>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(30px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 28px', letterSpacing: '-0.01em' }}>
              Des courbes<br /><span style={{ color: TEAL }}>vivantes</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(243,244,241,0.65)', maxWidth: 480 }}>
              La façade d'ASTERIA défie la ligne droite. Ses balcons ondulants, baignés de
              lumière dorée, encadrent des cascades suspendues et des bassins infinis. Une
              prouesse d'ingénierie où l'eau, le verre et la végétation composent un paysage
              vertical inédit en Algérie.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ParallaxImage src="/images/asteria/building-front.jpg" alt="Façade ondulante d'ASTERIA" aspect="3/4" />
          </Reveal>
        </div>
      </section>

      {/* ── RÉSIDENCES GALLERY ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 140px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 90px)' }}>
              <Eyebrow color={GOLD}>Les Résidences</Eyebrow>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 5vw, 68px)', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
                Intérieurs d'exception
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 32px)' }} className="ast-gallery">
            <Reveal>
              <figure style={{ margin: 0 }}>
                <ParallaxImage src="/images/asteria/living-1.jpg" alt="Séjour avec plafond étoilé" aspect="3/4" />
                <figcaption style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.45)', marginTop: 16 }}>Séjour — Plafond étoilé</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.12}>
              <figure style={{ margin: 0, marginTop: 'clamp(0px, 8vw, 90px)' }}>
                <ParallaxImage src="/images/asteria/bedroom-1.jpg" alt="Chambre principale" aspect="3/4" />
                <figcaption style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.45)', marginTop: 16 }}>Chambre principale</figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 'clamp(16px, 2.5vw, 32px)' }}>
              <ParallaxImage src="/images/asteria/living-3.jpg" alt="Espace de vie ouvert" aspect="16/9" range={10} />
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 32px)', marginTop: 'clamp(16px, 2.5vw, 32px)' }} className="ast-gallery">
            <Reveal>
              <ParallaxImage src="/images/asteria/bathroom-1.jpg" alt="Salle de bain en marbre" aspect="4/3" range={10} />
            </Reveal>
            <Reveal delay={0.12}>
              <ParallaxImage src="/images/asteria/bedroom-2.jpg" alt="Suite avec vue" aspect="4/3" range={10} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TERRASSES — full-bleed ── */}
      <section style={{ position: 'relative', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="ast-split">
          <Reveal>
            <ParallaxImage src="/images/asteria/balcony-1.jpg" alt="Terrasse avec piscine privée au coucher du soleil" aspect="3/4" />
          </Reveal>
          <Reveal delay={0.15}>
            <Eyebrow>Les Terrasses</Eyebrow>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(30px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 28px' }}>
              Le ciel,<br /><span style={{ color: GOLD }}>pour jardin</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(243,244,241,0.65)', maxWidth: 480 }}>
              Chaque résidence supérieure s'ouvre sur une terrasse privative dotée de sa propre
              piscine à débordement. Un salon en plein air suspendu au-dessus de la ville, où le
              coucher de soleil devient un rituel quotidien.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── ESPACES COMMUNS ── */}
      <section style={{ padding: 'clamp(40px, 8vw, 100px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
              <Eyebrow color={TEAL}>Espaces Communs</Eyebrow>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: 0 }}>
                Un art de recevoir
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ParallaxImage src="/images/asteria/common-pool.jpg" alt="Piscine intérieure sous plafond étoilé" aspect="16/9" range={8} />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 32px)', marginTop: 'clamp(16px, 2.5vw, 32px)' }} className="ast-gallery">
            <Reveal>
              <ParallaxImage src="/images/asteria/common-1.jpg" alt="Hall de réception" aspect="4/3" range={10} />
            </Reveal>
            <Reveal delay={0.12}>
              <ParallaxImage src="/images/asteria/common-2.jpg" alt="Lounge résidents" aspect="4/3" range={10} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FLOOR PLANS ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 140px) clamp(24px, 5vw, 64px)', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 70px)' }}>
              <Eyebrow color={GOLD}>Les Plans</Eyebrow>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: 0 }}>
                Choisissez votre F3
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {/* Surface selector */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
              {PLANS.map((p, i) => (
                <button
                  key={p.surface}
                  onClick={() => setPlan(i)}
                  style={{
                    padding: '12px 26px', cursor: 'pointer',
                    background: plan === i ? GOLD : 'transparent',
                    border: `1px solid ${plan === i ? GOLD : 'rgba(255,255,255,0.15)'}`,
                    color: plan === i ? '#060606' : 'rgba(243,244,241,0.7)',
                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                    letterSpacing: '0.05em', borderRadius: 2, transition: 'all 0.3s ease',
                  }}
                >
                  {p.surface} m²
                </button>
              ))}
            </div>

            {/* Plan image */}
            <motion.div
              key={plan}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{
                maxWidth: 760, margin: '0 auto', padding: 'clamp(16px, 3vw, 40px)',
                background: '#fff', borderRadius: 4,
              }}
            >
              <img src={PLANS[plan].img} alt={`Plan F3 ${PLANS[plan].surface} m²`} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </motion.div>
            <p style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(243,244,241,0.4)', marginTop: 24, letterSpacing: '0.1em' }}>
              Type F3 · 3 pièces · {PLANS[plan].surface} m² habitables
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 460, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/asteria/building-detail.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.7)' }} />
        <Reveal>
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(34px, 6vw, 84px)', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.05 }}>
              Vivez ASTERIA
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(14px, 1.2vw, 18px)', color: 'rgba(243,244,241,0.7)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Les résidences sont disponibles sur rendez-vous privé. Notre équipe vous accueille
              pour une visite exclusive.
            </p>
            <Link
              to="/#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 48px',
                background: GOLD, color: '#060606', fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 2,
              }}
            >
              Réserver une visite privée
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: 'clamp(40px, 6vw, 70px) clamp(24px, 5vw, 64px)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <img src="/images/elite-logo.png" alt="Elite Promotion Immobilière" style={{ height: 44, width: 'auto', mixBlendMode: 'screen', opacity: 0.8 }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.2em', color: 'rgba(243,244,241,0.3)', textTransform: 'uppercase', marginTop: 24 }}>
          © {new Date().getFullYear()} Elite Promotion Immobilière — ASTERIA
        </p>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .ast-split { grid-template-columns: 1fr !important; }
          .ast-gallery { grid-template-columns: 1fr !important; }
          .ast-gallery figure { margin-top: 0 !important; }
        }
      `}</style>
    </motion.div>
  )
}
