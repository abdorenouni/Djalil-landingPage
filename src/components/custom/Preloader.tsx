import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'in' | 'out' | 'done'

const CINEMA: [number, number, number, number] = [0.76, 0, 0.24, 1]

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 4600)
    const t2 = setTimeout(() => setPhase('done'), 6000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null
  const isOut = phase === 'out'

  return (
    <motion.div
      animate={{ y: isOut ? '-100%' : '0%' }}
      transition={{ duration: 1.35, ease: CINEMA }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#060606',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        willChange: 'transform',
        pointerEvents: isOut ? 'none' : 'all',
      }}
    >
      {/* Subtle teal depth glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOut ? 0 : 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '70vw',
          height: '70vw',
          maxWidth: 900,
          maxHeight: 900,
          background: 'radial-gradient(circle, rgba(43,189,176,0.10) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── CONTENT — fades + lifts on exit ── */}
      <motion.div
        animate={{ opacity: isOut ? 0 : 1, y: isOut ? -14 : 0 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ── FULL LOGO — reveal with elegant shine sweep ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            position: 'relative',
            width: 'clamp(280px, 42vw, 560px)',
            overflow: 'hidden',
          }}
        >
          <img
            src="/images/elite-logo.png"
            alt="Elite Promotion Immobilière"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              mixBlendMode: 'screen',
            }}
          />
          {/* Luxury shine sweeping across the logo */}
          <div className="logo-shine" />
        </motion.div>

        {/* ── LUXURY LOADING BAR — light sweeping inside ── */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(160px, 22vw, 240px)',
            height: 3,
            marginTop: 'clamp(36px, 5vh, 60px)',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 99,
            overflow: 'hidden',
            boxShadow: '0 0 22px rgba(43,189,176,0.22)',
          }}
        >
          {/* Base fill — slowly grows */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #2bbdb0 0%, #b8a060 60%, #d4af37 100%)',
              borderRadius: 99,
              transformOrigin: 'left',
              opacity: 0.55,
            }}
          />
          {/* Travelling light — the hook */}
          <div className="bar-light" />
        </div>

        {/* ── TAGLINE ── */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 0.4, letterSpacing: '0.34em' }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 2.2 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(7px, 0.72vw, 10px)',
            color: '#f3f4f1',
            textTransform: 'uppercase',
            margin: 'clamp(22px, 3vh, 34px) 0 0',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          Elite Promotions for Elite Work
        </motion.p>
      </motion.div>

      {/* ── GOLD CUTTING EDGE at bottom of curtain ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, transparent 0%, #d4af37 25%, #d4af37 75%, transparent 100%)',
        zIndex: 3,
      }} />

      <style>{`
        .bar-light {
          position: absolute;
          top: 0;
          height: 100%;
          width: 32%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%);
          border-radius: 99px;
          mix-blend-mode: screen;
          animation: barSweep 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @keyframes barSweep {
          0%   { left: -32%; }
          100% { left: 100%; }
        }
        .logo-shine {
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.18) 55%, transparent 100%);
          transform: skewX(-18deg);
          animation: logoShine 3.2s ease-in-out 1.2s infinite;
          pointer-events: none;
        }
        @keyframes logoShine {
          0%   { left: -120%; }
          55%  { left: 120%; }
          100% { left: 120%; }
        }
      `}</style>
    </motion.div>
  )
}
