import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Phase = 'in' | 'out' | 'done'

const CINEMA: [number, number, number, number] = [0.76, 0, 0.24, 1]
const SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 5000)
    const t2 = setTimeout(() => setPhase('done'), 6200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null
  const isOut = phase === 'out'

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      animate={{ y: isOut ? '-100%' : '0%' }}
      transition={{ duration: 1.3, ease: CINEMA }}
      style={{ background: '#060606', willChange: 'transform', pointerEvents: isOut ? 'none' : 'all' }}
    >
      {/* ── SOFT INTERIOR — gradually revealed ── */}
      <motion.img
        src="/images/asteria/bedroom-1.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.14 }}
        animate={{ opacity: isOut ? 0 : 0.5, scale: 1 }}
        transition={{ duration: 2.6, ease: SOFT, delay: 0.2 }}
        style={{ objectPosition: '72% center', filter: 'brightness(0.7) saturate(1.05)' }}
      />

      {/* ── Cinematic dark gradient — keeps the left readable ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(6,6,6,0.97) 0%, rgba(6,6,6,0.82) 32%, rgba(6,6,6,0.4) 62%, rgba(6,6,6,0.15) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(6,6,6,0.5) 0%, transparent 35%, rgba(6,6,6,0.6) 100%)' }}
      />

      {/* ── WARM RADIAL GLOW behind the lamp ── */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOut ? 0 : 1 }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        style={{
          right: 'clamp(20px, 11vw, 190px)',
          top: '50%',
          transform: 'translate(40%, -50%)',
          width: 'min(60vw, 620px)',
          height: 'min(80vh, 780px)',
          background: 'radial-gradient(ellipse at center, rgba(245,185,95,0.20) 0%, rgba(212,160,70,0.07) 38%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── VERTICAL NEON LAMP — turns on ── */}
      <motion.div
        className="absolute rounded-full"
        initial={{ opacity: 0, scaleY: 0.15 }}
        animate={{ opacity: isOut ? 0 : 1, scaleY: 1 }}
        transition={{ opacity: { duration: 1.1, ease: 'easeOut', delay: 0.35 }, scaleY: { duration: 1.4, ease: SOFT, delay: 0.35 } }}
        style={{
          right: 'clamp(28px, 13vw, 230px)',
          top: '17%',
          height: '66%',
          width: 'clamp(5px, 0.55vw, 9px)',
          transformOrigin: 'center',
          background: 'linear-gradient(to bottom, rgba(255,210,130,0) 0%, #ffd98a 14%, #f6b85a 50%, #ffd98a 86%, rgba(255,210,130,0) 100%)',
          boxShadow: '0 0 28px 5px rgba(245,190,100,0.6), 0 0 80px 22px rgba(238,170,70,0.28)',
        }}
      >
        {/* subtle living flicker */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.85, 1, 0.9, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,240,210,0.5) 50%, transparent)' }}
        />
      </motion.div>

      {/* ── LEFT CONTENT ── */}
      <motion.div
        className="absolute flex flex-col"
        animate={{ opacity: isOut ? 0 : 1, y: isOut ? -12 : 0 }}
        transition={{ duration: 0.4, ease: 'easeIn' }}
        style={{ left: 'clamp(24px, 8vw, 140px)', top: '50%', transform: 'translateY(-50%)', maxWidth: '74vw' }}
      >
        {/* Signature — written on */}
        <motion.h1
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          transition={{ clipPath: { duration: 2, ease: SOFT, delay: 0.9 }, opacity: { duration: 0.4, delay: 0.9 } }}
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(52px, 9.5vw, 168px)',
            lineHeight: 1.05,
            margin: 0,
            color: '#f6d68f',
            whiteSpace: 'nowrap',
            textShadow:
              '0 0 14px rgba(246,210,140,0.55), 0 0 36px rgba(212,175,55,0.4), 0 0 70px rgba(212,175,55,0.2)',
          }}
        >
          Elite Real Estate
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 2.7 }}
          style={{
            height: 1,
            width: 'clamp(120px, 22vw, 320px)',
            transformOrigin: 'left',
            margin: 'clamp(14px, 2vw, 28px) 0 clamp(16px, 1.6vw, 22px) 6px',
            background: 'linear-gradient(90deg, rgba(212,175,55,0.9), rgba(212,175,55,0.1))',
          }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10, letterSpacing: '0.55em' }}
          animate={{ opacity: 0.85, y: 0, letterSpacing: '0.42em' }}
          transition={{ duration: 1.2, ease: SOFT, delay: 2.9 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1.3vw, 16px)',
            fontWeight: 300,
            textTransform: 'uppercase',
            color: '#e8d9b0',
            margin: '0 0 0 8px',
          }}
        >
          For Elite Work
        </motion.p>
      </motion.div>

      {/* ── thin progress hairline ── */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 1, background: 'rgba(255,255,255,0.04)' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, rgba(246,184,90,0.5), rgba(212,175,55,0.3))', transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  )
}
