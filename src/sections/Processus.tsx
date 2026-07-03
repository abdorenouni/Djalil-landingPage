import { Reveal, BezelCard, TEAL } from '@/components/custom/lux'
import { MessageSquare, KeyRound, FileSignature, DoorOpen } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSiteSettings } from '@/lib/useSiteSettings'

const ICONS: Record<string, ReactNode> = {
  message: <MessageSquare size={24} />,
  key: <KeyRound size={24} />,
  signature: <FileSignature size={24} />,
  door: <DoorOpen size={24} />,
}

const FALLBACK_STEPS = [
  { icon: 'message', title: 'Prise de contact', text: 'Échangez avec un conseiller dédié sur vos attentes et votre budget.' },
  { icon: 'key', title: 'Visite privée', text: "Découvrez la résidence et ses finitions lors d'un rendez vous exclusif." },
  { icon: 'signature', title: 'Réservation', text: 'Sécurisez votre résidence avec un accompagnement administratif complet.' },
  { icon: 'door', title: 'Remise des clés', text: 'Recevez votre bien clé en main, prêt à vivre, sans aucun compromis.' },
]

export default function Processus() {
  const settings = useSiteSettings()
  const eyebrow = settings?.processusEyebrow || 'Le Parcours'
  const title = settings?.processusTitle || 'De la visite aux clés'
  const ctaLabel = settings?.processusCtaLabel || 'Commencer votre parcours'
  const steps = settings?.processusSteps?.length
    ? settings.processusSteps.map((s) => ({ icon: s.icon || 'message', title: s.title || '', text: s.text || '' }))
    : FALLBACK_STEPS

  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '0%', right: '-10%', width: '45%', height: '60%', background: `radial-gradient(ellipse, ${TEAL}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 90px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>{eyebrow}</span>
              <div style={{ width: 38, height: 1, background: TEAL }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
              {title}
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(steps.length, 4)}, 1fr)`, gap: 'clamp(16px, 2vw, 28px)' }} className="proc-grid">
          {steps.map((s, i) => (
            <Reveal key={s.title + i} delay={i * 0.1}>
              <BezelCard padding="clamp(28px, 2.5vw, 40px) clamp(20px, 2vw, 28px)">
                <div style={{ position: 'absolute', top: 4, right: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 44, fontWeight: 700, color: 'rgba(43,189,176,0.14)', lineHeight: 1 }}>
                  {i + 1}
                </div>
                <div style={{ color: TEAL, marginBottom: 22 }}>{ICONS[s.icon] || ICONS.message}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, fontWeight: 400, color: 'var(--text)', margin: '0 0 12px' }}>{s.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: 'rgba(var(--text-rgb),0.55)', margin: 0 }}>{s.text}</p>
              </BezelCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Découvrir CTA */}
      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
        <Reveal delay={0.4}>
          <div style={{ textAlign: 'center', marginTop: 'clamp(48px, 7vw, 80px)' }}>
            <a
              href="#contact"
              className="proc-discover"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 38px', border: `1px solid ${TEAL}66`, color: TEAL,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              }}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>{ctaLabel}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </a>
          </div>
        </Reveal>
      </div>

      <style>{`
        .proc-discover:hover { background: ${TEAL} !important; color: var(--bg) !important; border-color: ${TEAL} !important; }
        @media (max-width: 880px){ .proc-grid{ grid-template-columns:1fr 1fr !important; } }
        @media (max-width: 520px){ .proc-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  )
}
