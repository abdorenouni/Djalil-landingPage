import { Reveal, TEAL } from '@/components/custom/lux'
import Building3D from '@/components/custom/Building3D'
import { useSiteSettings } from '@/lib/useSiteSettings'

/* Interactive 3D massing showcase — strategically placed after the projects
   carousel so visitors move from the renders into an explorable volume study. */
export default function Showcase3D() {
  const settings = useSiteSettings()
  const eyebrow = settings?.showcase3DEyebrow || 'En 3D'
  const title1 = settings?.showcase3DTitle1 || 'Nos volumes,'
  const title2 = settings?.showcase3DTitle2 || 'en perspective'
  const subtitle = settings?.showcase3DSubtitle || "Des masses sculptées pour la lumière. Explorez la signature architecturale d'Elite."

  return (
    <section style={{ position: 'relative', background: 'var(--bg)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '60%', background: `radial-gradient(ellipse, ${TEAL}0c 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 70px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>{eyebrow}</span>
              <div style={{ width: 38, height: 1, background: TEAL }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, color: 'var(--text)', margin: '0 auto', maxWidth: 820, lineHeight: 1.12 }}>
              {title1}<br /><span style={{ color: TEAL }}>{title2}</span>
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(15px, 2vw, 21px)', color: 'rgba(var(--text-rgb),0.55)', margin: 'clamp(20px, 3vw, 30px) auto 0', maxWidth: 600, lineHeight: 1.6 }}>
              {subtitle}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ position: 'relative', width: '100%', height: 'clamp(360px, 58vh, 620px)', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(var(--line-rgb),0.06)', background: 'var(--surface)' }}>
            <Building3D />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
