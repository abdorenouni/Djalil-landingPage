import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'reveal' | 'exit' | 'done'

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('reveal')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 4000)
    const t2 = setTimeout(() => setPhase('done'), 5200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null
  const isExit = phase === 'exit'

  return (
    <motion.div
      animate={{
        clipPath: isExit
          ? 'circle(0% at 50% 50%)'
          : 'circle(150% at 50% 50%)',
      }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#030303',
        pointerEvents: isExit ? 'none' : 'all',
        clipPath: 'circle(150% at 50% 50%)',
      }}
    >
      {/* Video background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.video
          autoPlay muted playsInline loop
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut', delay: 0.3 }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            minWidth: '100%', minHeight: '100%',
            objectFit: 'cover', transform: 'translate(-50%, -50%)',
          }}
        >
          <source src="/videos/apartment-walkthrough.mp4" type="video/mp4" />
        </motion.video>

        {/* Dark cinematic overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(3,3,3,0.65) 0%, rgba(3,3,3,0.3) 50%, rgba(3,3,3,0.8) 100%)',
        }} />
      </div>

      {/* Text content */}
      <motion.div
        animate={{ opacity: isExit ? 0 : 1 }}
        transition={{ duration: 0.25, ease: 'easeIn' }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(52px, 9vw, 110px)',
            fontWeight: 400, fontStyle: 'italic', color: '#ffffff',
            margin: 0, letterSpacing: '-0.01em', lineHeight: 1,
            textShadow: '0 4px 60px rgba(0,0,0,0.7), 0 0 80px rgba(43,189,176,0.12)',
          }}
        >
          Bienvenue
        </motion.h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {["DANS L'IMMOBILIER", 'DE LUXE'].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 1.4 + i * 0.18 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(11px, 1.6vw, 18px)',
                fontWeight: 400, color: '#fff',
                letterSpacing: '0.35em', textTransform: 'uppercase', margin: 0,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.9 }}
          style={{
            width: 60, height: 1,
            background: 'linear-gradient(to right, transparent, #2bbdb0, transparent)',
            transformOrigin: 'center',
          }}
        />

        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 0.6, letterSpacing: '0.28em' }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 2.1 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(9px, 1vw, 12px)',
            fontWeight: 300, color: '#2bbdb0',
            textTransform: 'uppercase', margin: 0, textAlign: 'center',
          }}
        >
          Élite Promotion Immobilière
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        animate={{ opacity: isExit ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 4, ease: 'linear' }}
          style={{
            height: '100%',
            background: 'linear-gradient(to right, #2bbdb0, rgba(43,189,176,0.4))',
            transformOrigin: 'left',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
