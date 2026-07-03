import { StatMarquee } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'

const FALLBACK_STATS = [
  { n: '10+', l: "Années d'expertise" },
  { n: '100%', l: 'Projets livrés à temps' },
  { n: '5.7K', l: 'Communauté Elite' },
  { n: 'F3', l: 'Résidences 103–110 m²' },
]

export default function Chiffres() {
  const settings = useSiteSettings()
  const stats = settings?.stats?.length
    ? settings.stats.map((s) => ({ n: s.number, l: s.label }))
    : FALLBACK_STATS

  return (
    <section
      style={{
        background: 'var(--bg-2)',
        borderTop: '1px solid rgba(var(--line-rgb),0.04)',
        borderBottom: '1px solid rgba(var(--line-rgb),0.04)',
        padding: 'clamp(56px, 8vw, 110px) 0',
      }}
    >
      <StatMarquee items={stats} speed={40} numberSize="clamp(42px, 6vw, 78px)" />
    </section>
  )
}
