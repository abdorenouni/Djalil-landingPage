import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'in' | 'out' | 'done'

const TAGLINE = 'ELITE PROMOTIONS FOR ELITE WORK'
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
const CINEMA: [number, number, number, number] = [0.76, 0, 0.24, 1]

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 5200)
    const t2 = setTimeout(() => setPhase('done'), 6600)
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
      {/* ── ASTERIA CINEMATIC BACKGROUND — more visible this time ── */}
      <motion.img
        src="/images/asteria/building-hero.png"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: isOut ? 0 : 0.5, scale: 1 }}
        transition={{ duration: 3, ease: 'easeOut', delay: 0.1 }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.62) saturate(0.75)',
          pointerEvents: 'none',
        }}
      />
      {/* Cinematic gradient overlay — dark center for readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: [
          'radial-gradient(ellipse 70% 70% at center, rgba(6,6,6,0.60) 0%, rgba(6,6,6,0.92) 100%)',
          'linear-gradient(to bottom, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.1) 40%, rgba(6,6,6,0.75) 100%)',
        ].join(', '),
        pointerEvents: 'none',
      }} />

      {/* ── CONTENT — fades + lifts on exit ── */}
      <motion.div
        animate={{ opacity: isOut ? 0 : 1, y: isOut ? -16 : 0, filter: isOut ? 'blur(6px)' : 'blur(0px)' }}
        transition={{ duration: 0.25, ease: 'easeIn' }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >

        {/* ── LOGO BLOCK: SVG icon + text ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 2.2vw, 32px)',
        }}>

          {/*
            SVG ICON — single continuous path tracing the actual Elite logo mark.
            The path traces: bottom-left → up left wall → roof peak →
            down outer right wall → step inward → down inner right wall →
            left along inner bottom → down to base → close along bottom.
            This creates the teal C/E-in-house silhouette.
          */}
          <svg
            viewBox="0 0 202 232"
            fill="none"
            style={{
              width: 'clamp(58px, 8.5vw, 108px)',
              height: 'auto',
              flexShrink: 0,
              overflow: 'visible',
            }}
          >
            <motion.path
              d="M 10 222 L 10 98 L 100 10 L 192 98 L 192 148 L 135 148 L 135 192 L 50 192 L 50 222 L 10 222"
              stroke="#2bbdb0"
              strokeWidth="22"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 2.0, ease: [0.4, 0, 0.2, 1], delay: 0.3 },
                opacity: { duration: 0.01, delay: 0.3 },
              }}
            />
          </svg>

          {/* ── TEXT BLOCK ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* ELITE — slides up from below */}
            <div style={{ overflow: 'hidden', lineHeight: 1 }}>
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 2.45 }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(42px, 7vw, 94px)',
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

            {/* Gold separator — scales in from left */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 3.0 }}
              style={{
                height: 1,
                background: 'linear-gradient(90deg, rgba(212,175,55,0.8), rgba(212,175,55,0.15))',
                margin: 'clamp(8px, 1.2vw, 14px) 0',
                transformOrigin: 'left',
              }}
            />

            {/* PROMOTION IMMOBILIÈRE — slides up */}
            <div style={{ overflow: 'hidden' }}>
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.75, ease: EASE_OUT, delay: 3.1 }}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(9px, 1.1vw, 15px)',
                  fontWeight: 400,
                  color: '#d4af37',
                  margin: 0,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                PROMOTION IMMOBILIÈRE
              </motion.p>
            </div>
          </div>
        </div>

        {/* ── TAGLINE — character by character ── */}
        <div style={{
          marginTop: 'clamp(32px, 5vh, 56px)',
          display: 'flex',
          justifyContent: 'center',
        }}>
          {TAGLINE.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: char === ' ' ? 0 : 0.35 }}
              transition={{ duration: 0.18, ease: 'easeOut', delay: 3.6 + i * 0.028 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(7px, 0.72vw, 10px)',
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

      {/* ── SCROLL HOOK — appears near end, exits with curtain ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOut ? 0 : 1 }}
        transition={{ duration: 0.6, delay: isOut ? 0 : 4.8 }}
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 8,
          letterSpacing: '0.42em',
          color: 'rgba(212,175,55,0.45)',
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 26,
            background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), transparent)',
          }}
        />
      </motion.div>

      {/* ── GOLD CUTTING EDGE at bottom of curtain ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, transparent 0%, #d4af37 25%, #d4af37 75%, transparent 100%)',
        zIndex: 4,
      }} />

      {/* ── PROGRESS BAR ── */}
      <div style={{
        position: 'absolute',
        bottom: 2, left: 0, right: 0,
        height: 1,
        background: 'rgba(255,255,255,0.04)',
        zIndex: 4,
      }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5.2, ease: 'linear' }}
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
