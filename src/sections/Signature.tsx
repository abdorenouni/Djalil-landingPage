import { Link } from 'react-router'
import { Reveal, ParallaxImage, TEAL, GOLD } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'
import { urlFor } from '@/lib/sanity'

const FALLBACK_FEATURES = [
  {
    img: '/images/asteria/building-front.jpg',
    title: 'Cascades Suspendues',
    text: "Des rideaux d'eau glissent entre les étages, transformant la façade en une œuvre vivante.",
  },
  {
    img: '/images/asteria/balcony-1.jpg',
    title: 'Piscines à Débordement',
    text: "Chaque terrasse supérieure s'ouvre sur son propre bassin infini, suspendu au-dessus de la ville.",
  },
  {
    img: '/images/asteria/bedroom-1.jpg',
    title: 'Plafonds Étoilés',
    text: 'Une voûte de fibres optiques recrée un ciel nocturne dans chaque espace de vie.',
  },
]

export default function Signature() {
  const settings = useSiteSettings()
  const eyebrow = settings?.signatureEyebrow || 'La Signature ASTERIA'
  const title = settings?.signatureTitle || "L'exception, par le détail"
  const features = settings?.signatureItems?.length
    ? settings.signatureItems.map((s) => ({
        img: s.image?.asset ? urlFor(s.image).width(900).url() : FALLBACK_FEATURES[0].img,
        title: s.title || '',
        text: s.text || '',
      }))
    : FALLBACK_FEATURES

  return (
    <section
      style={{ background: 'var(--bg)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '50%', background: `radial-gradient(ellipse, ${TEAL}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 90px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>{eyebrow}</span>
              <div style={{ width: 38, height: 1, background: TEAL }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
              {title}
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${features.length}, 1fr)`, gap: 'clamp(16px, 2.5vw, 32px)' }} className="sig-grid">
          {features.map((f, i) => (
            <Reveal key={f.title + i} delay={i * 0.12}>
              <div>
                <ParallaxImage src={f.img} alt={f.title} aspect="4/5" range={12} />
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(19px, 1.8vw, 24px)', fontWeight: 400, color: 'var(--text)', margin: '24px 0 12px' }}>
                  <span style={{ color: GOLD, fontSize: '0.7em', marginRight: 10 }}>{String(i + 1).padStart(2, '0')}</span>
                  {f.title}
                </h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: 'rgba(var(--text-rgb),0.55)', margin: 0 }}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Découvrir CTA */}
      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
        <Reveal delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 'clamp(48px, 7vw, 80px)' }}>
            <Link
              to="/projets/asteria"
              className="sig-discover"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 38px', border: `1px solid ${TEAL}66`, color: TEAL,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <span>Découvrir ASTERIA</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </Link>
          </div>
        </Reveal>
      </div>

      <style>{`
        .sig-discover:hover { background: ${TEAL} !important; color: var(--bg) !important; border-color: ${TEAL} !important; }
        @media (max-width: 860px){ .sig-grid{ grid-template-columns:1fr !important; max-width:440px; margin:0 auto; } }
      `}</style>
    </section>
  )
}
