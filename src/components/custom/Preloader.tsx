import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'reveal' | 'exit' | 'done'

// Expo ease — slow out, snappy arrival: gives panels a "crashing open" feel
const EXPO: [number, number, number, number] = [0.87, 0, 0.13, 1]

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('reveal')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 3600)
    const t2 = setTimeout(() => setPhase('done'), 5700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  const isExit = phase === 'exit'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: isExit ? 'none' : 'all',
      }}
    >
      {/* ── SOLID BACKGROUND ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#050505' }} />

      {/* ── TOP PANEL — exits upward ── */}
      <motion.div
        animate={{ y: isExit ? '-100%' : '0%' }}
        transition={{ duration: 1.55, ease: EXPO, delay: isExit ? 0.32 : 0 }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '50%',
          background: '#050505',
          zIndex: 2,
        }}
      >
        {/* Gold seam at the split line — stays visible as panel rises */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 20%, rgba(212,175,55,0.8) 50%, rgba(212,175,55,0.55) 80%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* ── BOTTOM PANEL — exits downward ── */}
      <motion.div
        animate={{ y: isExit ? '100%' : '0%' }}
        transition={{ duration: 1.55, ease: EXPO, delay: isExit ? 0.32 : 0 }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '50%',
          background: '#050505',
          zIndex: 2,
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 2,
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 3.6, ease: 'linear' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2bbdb0 0%, #b8a060 50%, #d4af37 100%)',
              transformOrigin: 'left',
            }}
          />
        </div>
        {/* Teal under-glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 2, left: 0, right: 0,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 10%, #2bbdb0 50%, transparent 90%)',
            boxShadow: '0 0 18px 3px rgba(43,189,176,0.3)',
          }}
        />
      </motion.div>

      {/* ── CENTER CONTENT — above both panels, fades first ── */}
      <motion.div
        animate={{
          opacity: isExit ? 0 : 1,
          y: isExit ? -10 : 0,
          filter: isExit ? 'blur(5px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.28, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          pointerEvents: 'none',
        }}
      >
        {/* Corner brackets — precision marker aesthetic */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => (
          <motion.div
            key={corner}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              ...(corner === 'tl' && {
                top: 'clamp(24px, 5vh, 52px)',
                left: 'clamp(24px, 5vw, 64px)',
                borderTop: '1px solid #d4af37',
                borderLeft: '1px solid #d4af37',
              }),
              ...(corner === 'tr' && {
                top: 'clamp(24px, 5vh, 52px)',
                right: 'clamp(24px, 5vw, 64px)',
                borderTop: '1px solid #d4af37',
                borderRight: '1px solid #d4af37',
              }),
              ...(corner === 'bl' && {
                bottom: 'clamp(24px, 5vh, 52px)',
                left: 'clamp(24px, 5vw, 64px)',
                borderBottom: '1px solid #d4af37',
                borderLeft: '1px solid #d4af37',
              }),
              ...(corner === 'br' && {
                bottom: 'clamp(24px, 5vh, 52px)',
                right: 'clamp(24px, 5vw, 64px)',
                borderBottom: '1px solid #d4af37',
                borderRight: '1px solid #d4af37',
              }),
            }}
          />
        ))}

        {/* Official logo — mix-blend-mode:screen removes the black background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.55 }}
        >
          <img
            src="/images/elite-logo.png"
            alt="Elite Promotion Immobilière"
            style={{
              width: 'clamp(220px, 28vw, 420px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </motion.div>

        {/* Gold hairline separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 1.6 }}
          style={{
            width: 56,
            height: 0.5,
            background:
              'linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)',
            transformOrigin: 'center',
          }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.7em' }}
          animate={{ opacity: 0.45, letterSpacing: '0.35em' }}
          transition={{ duration: 1.3, ease: 'easeOut', delay: 1.9 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(8px, 0.85vw, 11px)',
            fontWeight: 400,
            color: '#f3f4f1',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Résidences de Prestige &nbsp;·&nbsp; Algérie
        </motion.p>
      </motion.div>
    </div>
  )
}
