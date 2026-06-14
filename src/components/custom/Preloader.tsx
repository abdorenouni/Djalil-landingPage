import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'in' | 'out' | 'done'

const TAGLINE = 'ELITE PROMOTIONS FOR ELITE WORK'
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
const CINEMA: [number, number, number, number] = [0.76, 0, 0.24, 1]

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 5000)
    const t2 = setTimeout(() => setPhase('done'), 6400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null
  const isOut = phase === 'out'

  return (
    <motion.div
      animate={{ y: isOut ? '-100%' : '0%' }}
      transition={{ duration: 1.3, ease: CINEMA }}
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

      {/* ── ASTERIA CINEMATIC BACKGROUND ── */}
      <motion.img
        src="/images/asteria/building-hero.png"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isOut ? 0 : 0.28, scale: 1 }}
        transition={{ duration: 3.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.45) saturate(0.7)',
          pointerEvents: 'none',
        }}
      />
      {/* Deep vignette — keeps center readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 80% at center, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.93) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── ALL CONTENT ── fades + lifts on exit */}
      <motion.div
        animate={{ opacity: isOut ? 0 : 1, y: isOut ? -14 : 0, filter: isOut ? 'blur(5px)' : 'blur(0px)' }}
        transition={{ duration: 0.28, ease: 'easeIn' }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >

        {/* ── LOGO BLOCK: icon + text side by side ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(18px, 2.5vw, 36px)',
        }}>

          {/* SVG HOUSE ICON — drawn path by path */}
          <svg
            viewBox="0 0 116 128"
            fill="none"
            style={{
              width: 'clamp(52px, 7vw, 92px)',
              height: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Outer house outline — drawn first */}
            <motion.path
              d="M 4 126 L 4 62 L 58 4 L 112 62 L 112 126"
              stroke="#2bbdb0"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.4 }}
            />
            {/* Inner house outline — drawn second */}
            <motion.path
              d="M 24 126 L 24 70 L 58 22 L 92 70 L 92 126"
              stroke="#2bbdb0"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: EASE_OUT, delay: 1.0 }}
            />
            {/* Bottom left connector — closes the E base */}
            <motion.line
              x1="4" y1="126" x2="24" y2="126"
              stroke="#2bbdb0"
              strokeWidth="5.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut', delay: 1.75 }}
            />
          </svg>

          {/* TEXT SIDE */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* ELITE — slides up from below */}
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <motion.h1
                initial={{ y: '108%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 2.0 }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(40px, 6.8vw, 90px)',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: '0.04em',
                }}
              >
                ELITE
              </motion.h1>
            </div>

            {/* Gold separator line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 2.55 }}
              style={{
                height: 1,
                background: 'linear-gradient(90deg, rgba(212,175,55,0.7), rgba(212,175,55,0.2))',
                margin: 'clamp(6px, 1vw, 12px) 0',
                transformOrigin: 'left',
              }}
            />

            {/* PROMOTION IMMOBILIÈRE — slides up */}
            <div style={{ overflow: 'hidden' }}>
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.75, ease: EASE_OUT, delay: 2.65 }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(9px, 1.15vw, 15px)',
                  fontWeight: 400,
                  color: '#d4af37',
                  margin: 0,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                }}
              >
                PROMOTION IMMOBILIÈRE
              </motion.p>
            </div>
          </div>
        </div>

        {/* ── TAGLINE — character by character ── */}
        <div style={{
          marginTop: 'clamp(28px, 4vh, 52px)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {TAGLINE.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: char === ' ' ? 0 : 0.38 }}
              transition={{ duration: 0.2, ease: 'easeOut', delay: 3.3 + i * 0.028 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(7px, 0.75vw, 10px)',
                letterSpacing: '0.38em',
                color: '#f3f4f1',
                display: 'inline-block',
                width: char === ' ' ? '0.7em' : 'auto',
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── GOLD CUTTING EDGE at bottom of curtain ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, transparent 0%, #d4af37 25%, #d4af37 75%, transparent 100%)',
        zIndex: 3,
      }} />

      {/* ── PROGRESS BAR ── */}
      <div style={{
        position: 'absolute',
        bottom: 2, left: 0, right: 0,
        height: 1,
        background: 'rgba(255,255,255,0.04)',
        zIndex: 3,
      }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5.0, ease: 'linear' }}
          style={{
            height: '100%',
            background: 'rgba(212,175,55,0.45)',
            transformOrigin: 'left',
          }}
        />
      </div>
    </motion.div>
  )
}
