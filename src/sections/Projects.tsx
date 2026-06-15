import { Link } from 'react-router'
import { Reveal, Eyebrow, ParallaxImage, TEAL, GOLD } from '@/components/custom/lux'

const SPECS = [
  { label: 'Typologie', value: 'F3 — 3 pièces' },
  { label: 'Surfaces', value: '103 – 110 m²' },
  { label: 'Standing', value: 'Très haut de gamme' },
  { label: 'Statut', value: 'En commercialisation' },
]

const THUMBS = [
  { src: '/images/asteria/living-1.jpg', label: 'Séjour' },
  { src: '/images/asteria/common-pool.jpg', label: 'Piscine' },
  { src: '/images/asteria/balcony-1.jpg', label: 'Terrasse' },
  { src: '/images/asteria/bedroom-1.jpg', label: 'Chambre' },
]

export default function Projects() {
  return (
    <section
      id="projects"
      style={{ background: '#050505', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '20%', right: '-15%', width: '55%', height: '60%', background: `radial-gradient(circle, ${GOLD}0d 0%, transparent 65%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 90px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 38, height: 1, background: GOLD }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: GOLD }}>Nos Réalisations</span>
              <div style={{ width: 38, height: 1, background: GOLD }} />
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(32px, 5vw, 68px)', fontWeight: 400, color: '#f3f4f1', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
              Le Projet Signature
            </h2>
          </div>
        </Reveal>

        {/* Featured ASTERIA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center' }} className="proj-feature">
          <Reveal>
            <Link to="/projets/asteria" style={{ display: 'block', textDecoration: 'none' }}>
              <ParallaxImage src="/images/asteria/building-front.jpg" alt="ASTERIA — résidence de luxe" aspect="4/5" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>Alger, Algérie · En cours</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(48px, 8vw, 110px)', fontWeight: 700, color: '#f3f4f1', lineHeight: 0.95, margin: '14px 0 22px', letterSpacing: '0.02em' }}>
                ASTERIA
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: 1.8, color: 'rgba(243,244,241,0.6)', maxWidth: 460, margin: '0 0 36px' }}>
                Une tour résidentielle d'exception aux balcons ondulants, cascades suspendues et
                piscines à débordement. Le nouveau repère du luxe immobilier algérien.
              </p>

              {/* Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px', marginBottom: 40 }}>
                {SPECS.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(243,244,241,0.4)', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(15px, 1.3vw, 19px)', color: '#f3f4f1' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/projets/asteria"
                className="cursor-hover"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 40px',
                  background: GOLD, color: '#050505', fontFamily: "'Inter', sans-serif",
                  fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: 3, transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                Découvrir la résidence
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Render thumbnails → showroom */}
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(12px, 2vw, 24px)', marginTop: 'clamp(40px, 6vw, 80px)' }} className="proj-thumbs">
            {THUMBS.map((t) => (
              <Link key={t.src} to="/projets/asteria" style={{ textDecoration: 'none', display: 'block' }} className="proj-thumb cursor-hover">
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: 4 }}>
                  <img src={t.src} alt={t.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.07)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.85), transparent 55%)' }} />
                  <span style={{ position: 'absolute', bottom: 16, left: 18, fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f3f4f1' }}>{t.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .proj-feature { grid-template-columns: 1fr !important; }
          .proj-thumbs { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
