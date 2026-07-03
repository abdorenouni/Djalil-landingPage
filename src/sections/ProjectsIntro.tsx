import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'
import { TEAL } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'

const SCENES = [
  { num: '01', word: 'Nos Intérieurs', sub: "L'art de l'espace et de la lumière", img: '/images/asteria/living-1.jpg', to: '/univers/interieurs' },
  { num: '02', word: 'Nos Design', sub: 'Le détail comme signature', img: '/images/asteria/bathroom-1.jpg', to: '/univers/design' },
]

function CategoryScene({ scene }: { scene: (typeof SCENES)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-16%', '16%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1.02])
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.78, 0.55, 0.78])
  const wordOpacity = useTransform(scrollYProgress, [0.12, 0.42, 0.62, 0.9], [0, 1, 1, 0])
  const wordY = useTransform(scrollYProgress, [0.12, 0.5], [70, 0])

  return (
    <section ref={ref} className="force-dark" style={{ position: 'relative', height: 'clamp(440px, 78vh, 760px)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.img
        src={scene.img}
        alt={scene.word}
        loading="lazy"
        style={{ position: 'absolute', inset: '-16% 0', width: '100%', height: '132%', objectFit: 'cover', y: imgY, scale: imgScale, filter: 'grayscale(15%)' }}
      />
      <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: overlay }} />

      <motion.div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', opacity: wordOpacity, y: wordY }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(44px, 9vw, 130px)', lineHeight: 0.98, margin: 0, color: '#fff', letterSpacing: '-0.01em', textShadow: '0 8px 50px rgba(0,0,0,0.5)' }}>
          {scene.word}
        </h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.8vw, 19px)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.82)', margin: '20px 0 0' }}>
          {scene.sub}
        </p>

        <Link
          to={scene.to}
          className="scene-discover"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 'clamp(28px, 4vw, 44px)',
            padding: '14px 34px',
            border: `1px solid ${TEAL}88`,
            color: TEAL,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 3,
            backdropFilter: 'blur(12px)',
            background: 'rgba(6,6,6,0.3)',
            transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <span>Découvrir</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
        </Link>
      </motion.div>
    </section>
  )
}

export default function ProjectsIntro() {
  const settings = useSiteSettings()
  const eyebrow = settings?.projectsIntroEyebrow || "Découvrez l'univers Elite"
  const title1 = settings?.projectsIntroTitle1 || "Au delà de l'adresse,"
  const title2 = settings?.projectsIntroTitle2 || "l'expérience"

  return (
    <div style={{ position: 'relative', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', padding: 'clamp(70px, 11vw, 150px) 24px clamp(20px, 4vw, 50px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 38, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>{eyebrow}</span>
            <div style={{ width: 38, height: 1, background: TEAL }} />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.15 }}>
            {title1}<br /><span style={{ color: TEAL }}>{title2}</span>
          </h2>
        </motion.div>
      </div>

      {SCENES.map((scene) => (
        <CategoryScene key={scene.num} scene={scene} />
      ))}

      <style>{`
        .scene-discover:hover {
          background: ${TEAL} !important;
          color: var(--bg) !important;
          border-color: ${TEAL} !important;
          box-shadow: 0 12px 40px ${TEAL}44;
        }
      `}</style>
    </div>
  )
}
