import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'
import { ShieldCheck, Gem, Handshake, Compass } from 'lucide-react'
import { Reveal, Eyebrow, ParallaxImage, TEAL, GOLD, EASE } from '@/components/custom/lux'

const VALUES = [
  { icon: <Gem size={26} />, title: 'Excellence', text: 'Des finitions et matériaux sélectionnés sans compromis, du gros œuvre à la dernière poignée de porte.' },
  { icon: <Compass size={26} />, title: 'Vision', text: 'Une architecture qui anticipe les modes de vie de demain et redéfinit le standing en Algérie.' },
  { icon: <ShieldCheck size={26} />, title: 'Confiance', text: 'Des délais respectés et une transparence totale, de la réservation à la remise des clés.' },
  { icon: <Handshake size={26} />, title: 'Accompagnement', text: 'Un conseiller dédié à chaque étape de votre projet, pour une expérience sereine et privée.' },
]

const STATS = [
  { n: '10+', l: "Années d'expertise" },
  { n: '100%', l: 'Projets livrés' },
  { n: '5.7K', l: 'Communauté' },
  { n: '24/7', l: 'Accompagnement' },
]

export default function APropos() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#060606', color: '#f3f4f1', overflowX: 'hidden' }}
    >
      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 70,
        padding: '0 clamp(20px, 5vw, 64px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,6,6,0.4)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/elite-logo.png" alt="Elite" style={{ height: 38, width: 'auto', mixBlendMode: 'screen' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 36px)' }}>
          <Link to="/" style={navLink}>← Accueil</Link>
          <Link to="/projets/asteria" style={navLink}>ASTERIA</Link>
          <Link to="/#contact" style={{ padding: '9px 22px', border: `1px solid ${GOLD}55`, color: GOLD, fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>Contact</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: 'relative', height: '70vh', minHeight: 480, overflow: 'hidden' }}>
        <motion.img src="/images/asteria/building-hero.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.45) 50%, rgba(6,6,6,0.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <motion.span initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 0.7, letterSpacing: '0.4em' }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.3vw, 14px)', color: TEAL, textTransform: 'uppercase', marginBottom: 22 }}>
            À Propos
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: EASE, delay: 0.4 }}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(40px, 8vw, 110px)', lineHeight: 1, margin: 0, color: '#fff' }}>
            Elite Promotion
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: 1.2, delay: 0.8 }}
            style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(12px, 1.8vw, 18px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.8)', margin: '18px 0 0' }}>
            Immobilière
          </motion.p>
        </div>
      </div>

      {/* ── STORY ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(70px, 12vw, 150px) clamp(24px, 5vw, 64px)', textAlign: 'center' }}>
        <Reveal>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(22px, 3.6vw, 46px)', lineHeight: 1.45, color: '#f3f4f1', margin: 0, fontWeight: 400 }}>
            Nous ne construisons pas seulement des résidences — nous façonnons des adresses
            qui <span style={{ color: TEAL }}>reflètent la réussite</span> de ceux qui les habitent.
          </p>
        </Reveal>
      </section>

      {/* ── MISSION split ── */}
      <section style={{ padding: 'clamp(20px, 5vw, 60px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="ap-split">
          <Reveal>
            <ParallaxImage src="/images/asteria/common-1.jpg" alt="Espaces signés Elite Promotion" aspect="4/5" />
          </Reveal>
          <Reveal delay={0.15}>
            <Eyebrow>Notre Mission</Eyebrow>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px, 4.2vw, 56px)', fontWeight: 400, lineHeight: 1.12, margin: '0 0 26px' }}>
              Redéfinir l'art<br /><span style={{ color: GOLD }}>de vivre</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(243,244,241,0.65)', marginBottom: 20, maxWidth: 480 }}>
              Elite Promotion Immobilière est née d'une conviction : l'Algérie mérite un standing
              à la hauteur des plus grandes capitales. De la conception architecturale à la
              livraison clé en main, chaque détail est pensé pour l'exception.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(243,244,241,0.5)', maxWidth: 480 }}>
              Avec ASTERIA, nous signons une première : une résidence où l'eau, la lumière et la
              végétation composent un paysage vertical inédit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: 'clamp(70px, 11vw, 150px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
              <Eyebrow color={GOLD}>Nos Valeurs</Eyebrow>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: 0 }}>Ce qui nous distingue</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(16px, 2vw, 28px)' }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div style={{ height: '100%', padding: 'clamp(28px, 3vw, 40px)', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6 }}>
                  <div style={{ color: GOLD, marginBottom: 22 }}>{v.icon}</div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 400, margin: '0 0 14px', color: '#f3f4f1' }}>{v.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, lineHeight: 1.75, color: 'rgba(243,244,241,0.55)', margin: 0 }}>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS band ── */}
      <section style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: 'clamp(60px, 9vw, 110px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(28px, 4vw, 56px)', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 700, color: GOLD, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.5)', marginTop: 14 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', height: '60vh', minHeight: 420, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/asteria/balcony-1.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.68)' }} />
        <Reveal>
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5.5vw, 72px)', fontWeight: 700, margin: '0 0 28px', lineHeight: 1.05 }}>
              Découvrez ASTERIA
            </h2>
            <Link to="/projets/asteria" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '17px 46px', background: GOLD, color: '#060606', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>
              Visiter la résidence
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: 'clamp(40px, 6vw, 70px) clamp(24px, 5vw, 64px)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <img src="/images/elite-logo.png" alt="Elite Promotion Immobilière" style={{ height: 44, width: 'auto', mixBlendMode: 'screen', opacity: 0.8 }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.2em', color: 'rgba(243,244,241,0.3)', textTransform: 'uppercase', marginTop: 24 }}>
          © {new Date().getFullYear()} Elite Promotion Immobilière
        </p>
      </footer>

      <style>{`@media (max-width: 860px){ .ap-split{ grid-template-columns:1fr !important; } }`}</style>
    </motion.div>
  )
}

const navLink: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.2em',
  textTransform: 'uppercase', color: 'rgba(243,244,241,0.6)', textDecoration: 'none',
}
