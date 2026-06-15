import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export const TEAL = '#2bbdb0'
export const GOLD = '#d4af37'
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* Scroll-triggered reveal */
export function Reveal({ children, delay = 0, y = 44 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* Eyebrow label with rule */
export function Eyebrow({ children, color = TEAL }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <div style={{ width: 38, height: 1, background: color }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color }}>
        {children}
      </span>
    </div>
  )
}

/* Image with subtle parallax drift */
export function ParallaxImage({ src, alt, aspect = '3/4', range = 14 }: { src: string; alt: string; aspect?: string; range?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`])
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4, background: '#0a0a0a' }}>
      <motion.img src={src} alt={alt} style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', y }} />
    </div>
  )
}
