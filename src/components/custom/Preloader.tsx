import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

type Phase = 'reveal' | 'split' | 'done'

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('reveal')
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('split'), 4200)
    const t2 = setTimeout(() => setPhase('done'), 5800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'done') return null

  const isSplit = phase === 'split'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#030303',
        pointerEvents: isSplit ? 'none' : 'all',
      }}
    >

      {/* ── VIDEO BACKGROUND ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <motion.video
          autoPlay
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: videoReady ? 1 : 0, scale: videoReady ? 1 : 1.05 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src="/videos/apartment-walkthrough.mp4" type="video/mp4" />
        </motion.video>

        {/* Cinematic dark overlay — darkens video for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(3,3,3,0.55) 0%, rgba(3,3,3,0.35) 50%, rgba(3,3,3,0.7) 100%)',
          }}
        />

        {/* Subtle teal vignette at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 180,
            background:
              'linear-gradient(to top, rgba(43,189,176,0.08) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── TOP CURTAIN ── slides up on split */}
      <motion.div
        animate={{ y: isSplit ? '-100%' : '0%' }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.05 }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '50.5%',
          background: '#030303',
          zIndex: 5,
        }}
      />

      {/* ── BOTTOM CURTAIN ── slides down on split */}
      <motion.div
        animate={{ y: isSplit ? '100%' : '0%' }}
        transition={{ duration: 1.5, ease: EASE }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '50.5%',
          background: '#030303',
          zIndex: 5,
        }}
      />

      {/* ── TEAL SEAM FLASH at the split line ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isSplit ? { scaleX: [0, 1, 1, 0], opacity: [0, 1, 0.7, 0] } : {}}
        transition={{ duration: 1.3, times: [0, 0.1, 0.5, 1], ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%', left: 0, right: 0,
          height: 2,
          background: '#2bbdb0',
          boxShadow: '0 0 24px 6px #2bbdb0, 0 0 80px 20px rgba(43,189,176,0.25)',
          transformOrigin: 'center',
          transform: 'translateY(-50%)',
          zIndex: 6,
        }}
      />

      {/* ── CONTENT LAYER ── fades out just before the split */}
      <motion.div
        animate={{ opacity: isSplit ? 0 : 1, y: isSplit ? -6 : 0 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        {/* "Bienvenue" — large italic, like Aymen but with depth */}
        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(52px, 9vw, 110px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-0.01em',
            textShadow: '0 4px 60px rgba(0,0,0,0.6), 0 0 80px rgba(43,189,176,0.12)',
            lineHeight: 1,
          }}
        >
          Bienvenue
        </motion.h1>

        {/* "DANS L'IMMOBILIER DE LUXE" — staggered lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {['DANS L\'IMMOBILIER', 'DE LUXE'].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 1.4 + i * 0.18 }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(11px, 1.6vw, 18px)',
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Teal separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.9 }}
          style={{
            width: 60,
            height: 1,
            background: 'linear-gradient(to right, transparent, #2bbdb0, transparent)',
            transformOrigin: 'center',
          }}
        />

        {/* Brand tagline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 0.55, letterSpacing: '0.28em' }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 2.1 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(9px, 1vw, 12px)',
            fontWeight: 300,
            color: '#2bbdb0',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Élite Promotion Immobilière
        </motion.p>
      </motion.div>

      {/* ── PROGRESS BAR at bottom ── fills in sync with the reveal phase */}
      <motion.div
        animate={{ opacity: isSplit ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 2,
          background: 'rgba(255,255,255,0.06)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 4.2, ease: 'linear' }}
          style={{
            height: '100%',
            background: 'linear-gradient(to right, #2bbdb0, rgba(43,189,176,0.4))',
            transformOrigin: 'left',
          }}
        />
      </motion.div>

    </div>
  )
}
