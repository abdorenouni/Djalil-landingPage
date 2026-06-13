import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const phrase = "L'Art de Vivre, Redéfini."

// Elite logo SVG paths (teal house icon)
const LOGO_OUTER =
  'M 100 8 L 188 78 L 188 172 L 125 172 L 125 232 L 12 232 L 12 78 Z'
const LOGO_INNER =
  'M 100 52 L 148 88 L 148 135 L 95 135 L 95 100 L 52 100 L 52 88 Z'

export default function Preloader() {
  const [phase, setPhase] = useState<'reveal' | 'zoom' | 'done'>('reveal')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('zoom'), 3800)
    const t2 = setTimeout(() => setPhase('done'), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader"
          animate={{ opacity: phase === 'zoom' ? 0 : 1 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#030303',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ scale: phase === 'zoom' ? 30 : 1 }}
            transition={{ scale: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/* Logo + ELITE side by side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 32px)' }}>
              {/* Teal house logo — stroke draw */}
              <svg
                viewBox="0 0 200 240"
                style={{
                  width: 'clamp(60px, 10vw, 100px)',
                  height: 'auto',
                  overflow: 'visible',
                }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer house shape */}
                <motion.path
                  d={LOGO_OUTER}
                  fill="none"
                  stroke="#2bbdb0"
                  strokeWidth="3"
                  strokeLinejoin="miter"
                  filter="url(#glow)"
                  strokeDasharray="900"
                  initial={{ strokeDashoffset: 900 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
                />

                {/* Inner cutout */}
                <motion.path
                  d={LOGO_INNER}
                  fill="none"
                  stroke="#2bbdb0"
                  strokeWidth="2.5"
                  strokeLinejoin="miter"
                  filter="url(#glow)"
                  strokeDasharray="500"
                  initial={{ strokeDashoffset: 500 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                />

                {/* Fill fades in */}
                <motion.path
                  d={LOGO_OUTER}
                  fill="#2bbdb0"
                  stroke="none"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 1, delay: 2.6 }}
                />
              </svg>

              {/* ELITE text — SVG stroke draw */}
              <svg
                viewBox="0 0 300 80"
                style={{
                  width: 'clamp(180px, 32vw, 360px)',
                  height: 'auto',
                  overflow: 'visible',
                }}
              >
                <motion.text
                  x="150"
                  y="58"
                  textAnchor="middle"
                  fontFamily="'Cinzel', serif"
                  fontWeight="700"
                  fontSize="68"
                  letterSpacing="0.12em"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="600"
                  initial={{ strokeDashoffset: 600 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  ELITE
                </motion.text>

                {/* White fill fades in */}
                <motion.text
                  x="150"
                  y="58"
                  textAnchor="middle"
                  fontFamily="'Cinzel', serif"
                  fontWeight="700"
                  fontSize="68"
                  letterSpacing="0.12em"
                  fill="#ffffff"
                  stroke="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ duration: 0.8, delay: 2.8 }}
                >
                  ELITE
                </motion.text>
              </svg>
            </div>

            {/* PROMOTION IMMOBILIÈRE subtitle */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 0.5, letterSpacing: '0.3em' }}
              transition={{ duration: 1, delay: 2.0 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(9px, 1.2vw, 13px)',
                fontWeight: 300,
                color: '#fff',
                textTransform: 'uppercase',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Promotion Immobilière
            </motion.p>

            {/* Gold line separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{ duration: 1, delay: 2.2, ease: 'easeOut' }}
              style={{ width: 60, height: 1, background: '#2bbdb0', transformOrigin: 'center' }}
            />

            {/* Phrase — letter by letter */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px' }}>
              {phrase.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 1.6 + i * 0.05 }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(12px, 1.6vw, 16px)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'rgba(243, 244, 241, 0.85)',
                    letterSpacing: '0.15em',
                    display: 'inline-block',
                    whiteSpace: 'pre',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
