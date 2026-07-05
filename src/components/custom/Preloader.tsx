import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type Phase = 'in' | 'out' | 'done'

const CINEMA: [number, number, number, number] = [0.76, 0, 0.24, 1]
const SEEN_KEY = 'introSeen'

/** True if the intro should be skipped entirely (already seen this session, or
 *  the user prefers reduced motion, or storage is unavailable). */
function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    if (sessionStorage.getItem(SEEN_KEY) === '1') return true
  } catch { /* storage blocked — show intro once, safety timer guards it */ }
  return false
}

/**
 * Cinematic video splash.
 * Plays /videos/intro.mp4 fullscreen once per session, then lifts away like a
 * curtain. It is purely decorative: it NEVER gates the header — the header
 * mounts and animates independently, and this overlay always resolves itself
 * (video end, skip, error, or a hard safety timeout) so the menu is never
 * trapped behind a black panel.
 */
export default function Preloader() {
  // Decide synchronously on first render so we never flash the splash when it
  // should be skipped (returning visitor / reduced motion).
  const [skipped] = useState(shouldSkipIntro)
  const [phase, setPhase] = useState<Phase>('in')
  const videoRef = useRef<HTMLVideoElement>(null)
  const exited = useRef(false)

  const markSeen = () => {
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* ignore */ }
  }

  // Trigger the curtain lift exactly once (whichever event fires first).
  const exit = () => {
    if (exited.current) return
    exited.current = true
    markSeen()
    setPhase('out')
  }

  useEffect(() => {
    if (skipped) return
    // Hard safety: if the video gets stuck (autoplay blocked, codec hiccup,
    // network issue), the user must not be trapped on a black panel.
    const safety = setTimeout(exit, 5000)
    return () => clearTimeout(safety)
  }, [skipped]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => setPhase('done'), 1300)
    return () => clearTimeout(t)
  }, [phase])

  // Wire up real <video> events on the element itself.
  useEffect(() => {
    if (skipped) return
    const v = videoRef.current
    if (!v) return
    const onEnd = () => exit()
    const onErr = () => {
      if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || v.error) exit()
    }
    v.addEventListener('ended', onEnd)
    v.addEventListener('error', onErr)
    // Fallback immediately if playback can't start (autoplay blocked, etc).
    v.play().catch(() => exit())
    return () => {
      v.removeEventListener('ended', onEnd)
      v.removeEventListener('error', onErr)
    }
  }, [skipped]) // eslint-disable-line react-hooks/exhaustive-deps

  if (skipped || phase === 'done') return null
  const isOut = phase === 'out'

  return (
    <motion.div
      initial={false}
      animate={{ y: isOut ? '-100%' : '0%' }}
      transition={{ duration: 1.2, ease: CINEMA }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#060606',
        overflow: 'hidden', pointerEvents: isOut ? 'none' : 'all', willChange: 'transform',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        src="/videos/intro.mp4"
        className="pl-video"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          background: '#060606',
        }}
      />
      <style>{`
        /* Portrait phones: show the FULL intro frame (logo not cropped).
           The black letterbox bars are invisible on the var(--bg) backdrop.
           Desktop / landscape keeps object-fit: cover for a full-bleed reveal. */
        @media (max-aspect-ratio: 1/1) {
          .pl-video { object-fit: contain !important; }
        }
      `}</style>

      {/* Skip affordance — user can dismiss the splash at any time */}
      <button
        type="button"
        onClick={exit}
        aria-label="Passer l'introduction"
        style={{
          position: 'absolute', right: 'clamp(16px, 3vw, 32px)', bottom: 'clamp(16px, 3vw, 32px)',
          appearance: 'none', background: 'rgba(6,6,6,0.55)', border: '1px solid rgba(var(--line-rgb),0.22)',
          color: 'rgba(var(--text-rgb),0.85)', borderRadius: 999,
          padding: '10px 18px', cursor: 'pointer', backdropFilter: 'blur(6px)',
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
        }}
      >
        Passer ›
      </button>
    </motion.div>
  )
}
