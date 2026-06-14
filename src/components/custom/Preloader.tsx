import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LOGO_OUTER = 'M 100 8 L 188 78 L 188 172 L 125 172 L 125 232 L 12 232 L 12 78 Z'
const LOGO_INNER = 'M 100 52 L 148 88 L 148 135 L 95 135 L 95 100 L 52 100 L 52 88 Z'
const phrase = "L'Art de Vivre, Redéfini."
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

type Phase = 'reveal' | 'split' | 'done'

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('reveal')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('split'), 3800)
    const t2 = setTimeout(() => setPhase('done'), 5400)
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
        pointerEvents: isSplit ? 'none' : 'all',
      }}
    >
      {/* ── TOP CURTAIN ── slides up */}
      <motion.div
        animate={{ y: isSplit ? '-100%' : '0%' }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.06 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50.5%',
          background: '#030303',
          zIndex: 2,
        }}
      />

      {/* ── BOTTOM CURTAIN ── slides down */}
      <motion.div
        animate={{ y: isSplit ? '100%' : '0%' }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50.5%',
          background: '#030303',
          zIndex: 2,
        }}
      />

      {/* ── TEAL SEAM FLASH at the split line ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isSplit
            ? { scaleX: [0, 1, 1, 0], opacity: [0, 1, 0.6, 0] }
            : {}
        }
        transition={{ duration: 1.1, times: [0, 0.12, 0.55, 1], ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 2,
          background: '#2bbdb0',
          boxShadow: '0 0 18px 4px #2bbdb0, 0 0 60px 14px rgba(43,189,176,0.3)',
          transformOrigin: 'center',
          transform: 'translateY(-50%)',
          zIndex: 3,
        }}
      />

      {/* ── LOGO + CONTENT ── fades out as curtains start moving */}
      <motion.div
        animate={{ opacity: isSplit ? 0 : 1, y: isSplit ? -10 : 0 }}
        transition={{ duration: 0.28, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        {/* Logo row: house icon + ELITE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 32px)' }}>

          {/* Teal house — stroke draw animation */}
          <svg
            viewBox="0 0 200 240"
            style={{ width: 'clamp(60px, 10vw, 100px)', height: 'auto', overflow: 'visible' }}
          >
            <defs>
              <filter id="teal-glow">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.path
              d={LOGO_OUTER}
              fill="none"
              stroke="#2bbdb0"
              strokeWidth="3"
              strokeLinejoin="miter"
              filter="url(#teal-glow)"
              strokeDasharray="900"
              initial={{ strokeDashoffset: 900 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <motion.path
              d={LOGO_INNER}
              fill="none"
              stroke="#2bbdb0"
              strokeWidth="2.5"
              strokeLinejoin="miter"
              filter="url(#teal-glow)"
              strokeDasharray="500"
              initial={{ strokeDashoffset: 500 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            />
            {/* Subtle teal fill that fades in at the end */}
            <motion.path
              d={`${LOGO_OUTER} ${LOGO_INNER}`}
              fill="#2bbdb0"
              fillRule="evenodd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.13 }}
              transition={{ duration: 1, delay: 2.6 }}
            />
          </svg>

          {/* ELITE — stroke draw then fill */}
          <svg
            viewBox="0 0 300 80"
            style={{ width: 'clamp(180px, 32vw, 360px)', height: 'auto', overflow: 'visible' }}
          >
            <motion.text
              x="150" y="58"
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
            />
            <motion.text
              x="150" y="58"
              textAnchor="middle"
              fontFamily="'Cinzel', serif"
              fontWeight="700"
              fontSize="68"
              letterSpacing="0.12em"
              fill="#ffffff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ duration: 0.8, delay: 2.8 }}
            >
              ELITE
            </motion.text>
          </svg>
        </div>

        {/* Promotion Immobilière */}
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

        {/* Teal separator line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.35 }}
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
                color: 'rgba(243,244,241,0.85)',
                letterSpacing: '0.15em',
                display: 'inline-block',
                whiteSpace: 'pre',
              }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
