import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'reveal' | 'exit' | 'done'

const CINEMATIC: [number, number, number, number] = [0.76, 0, 0.24, 1]

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('reveal')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 3800)
    const t2 = setTimeout(() => setPhase('done'), 5100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null
  const isExit = phase === 'exit'

  return (
    <motion.div
      animate={{ y: isExit ? '-100%' : '0%' }}
      transition={{ duration: 1.2, ease: CINEMATIC }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#050505',
        pointerEvents: isExit ? 'none' : 'all',
        willChange: 'transform',
      }}
    >
      {/* ── VIDEO BACKGROUND ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.video
          autoPlay muted playsInline loop
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.4 }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            minWidth: '100%', minHeight: '100%',
            objectFit: 'cover', transform: 'translate(-50%, -50%)',
          }}
        >
          <source src="/videos/apartment-walkthrough.mp4" type="video/mp4" />
        </motion.video>

        {/* Cinematic vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.55) 100%)',
            'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.2) 40%, rgba(5,5,5,0.9) 100%)',
          ].join(', '),
        }} />
      </div>

      {/* ── TEXT ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 18, pointerEvents: 'none',
      }}>
        {/* Bienvenue */}
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(56px, 10vw, 120px)',
            fontWeight: 400, fontStyle: 'italic',
            color: '#ffffff', margin: 0,
            letterSpacing: '-0.02em', lineHeight: 1,
            textShadow: '0 2px 40px rgba(0,0,0,0.9)',
          }}
        >
          Bienvenue
        </motion.h1>

        {/* Thin gold separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 1.6 }}
          style={{
            width: 80, height: 0.5,
            background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)',
            transformOrigin: 'center',
          }}
        />

        {/* "DANS L'IMMOBILIER DE LUXE" */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {["DANS L'IMMOBILIER", 'DE LUXE'].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14, letterSpacing: '0.5em' }}
              animate={{ opacity: 0.75, y: 0, letterSpacing: '0.3em' }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 1.7 + i * 0.2 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(10px, 1.4vw, 16px)',
                fontWeight: 400, color: '#fff',
                textTransform: 'uppercase', margin: 0,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Brand — teal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 2.4 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(8px, 0.85vw, 11px)',
            fontWeight: 300, color: '#2bbdb0',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            margin: '8px 0 0', textAlign: 'center',
          }}
        >
          Élite Promotion Immobilière
        </motion.p>
      </div>

      {/* ── TEAL CUTTING EDGE at the bottom ──
          Stays at the very bottom of the panel — becomes visible as the
          preloader lifts off, slicing across the screen like a blade  */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(to right, transparent 0%, #2bbdb0 20%, #2bbdb0 80%, transparent 100%)',
        boxShadow: '0 0 18px 3px rgba(43,189,176,0.5)',
      }} />

      {/* ── PROGRESS BAR ── */}
      <div style={{
        position: 'absolute', bottom: 2, left: 0, right: 0, height: 1,
        background: 'rgba(255,255,255,0.04)',
      }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3.8, ease: 'linear' }}
          style={{
            height: '100%',
            background: 'rgba(43,189,176,0.35)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </motion.div>
  )
}
