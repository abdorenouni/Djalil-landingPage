import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useSiteSettings } from '@/lib/useSiteSettings'

const HERO_IMAGE = '/images/hero-home.jpg'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Hero() {
  const settings = useSiteSettings()
  const textRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  // The title reveal originally waited ~4.5s for the intro curtain. Returning
  // visitors and reduced-motion users skip that curtain, so shorten the delay
  // (and drop the motion entirely under reduced-motion) to avoid a blank hero.
  const reduce = prefersReducedMotion()
  const introSkipped = reduce || (typeof window !== 'undefined' && (() => {
    try { return sessionStorage.getItem('introSeen') === '1' } catch { return false }
  })())
  const titleDelay = introSkipped ? 0.25 : 4.5
  const subtitleDelay = introSkipped ? 0.45 : 4.8

  useEffect(() => {
    if (!textRef.current) return
    const chars = textRef.current.querySelectorAll('.char')
    if (chars.length === 0) return
    if (reduce) { gsap.set(chars, { opacity: 1, y: 0, rotateX: 0 }); return }
    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotateX: -90 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.02, ease: 'power4.out', delay: titleDelay }
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!subtitleRef.current) return
    const subtitleChars = subtitleRef.current.querySelectorAll('.sub-char')
    if (reduce) { gsap.set(subtitleChars, { opacity: 0.8, y: 0 }); return }
    gsap.fromTo(
      subtitleChars,
      { opacity: 0, y: 10 },
      { opacity: 0.8, y: 0, duration: 0.4, stagger: 0.01, ease: 'power3.out', delay: subtitleDelay }
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const title = (settings?.heroHeadline && settings.heroHeadline !== "L'EXCELLENCE" ? settings.heroHeadline : "").toUpperCase()
  const subtitle = (settings?.heroSubtext || 'IMMOBILIÈRE EN ALGÉRIE').toUpperCase()

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Full-bleed hero video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={HERO_IMAGE}
        className="hero-video"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark cinematic overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero content */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          pointerEvents: 'none',
          perspective: 1000,
        }}
      >
        {title && (
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(32px, 8vw, 130px)',
              fontWeight: 700,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              margin: 0,
              textShadow: '0 2px 40px rgba(0,0,0,0.5)',
            }}
          >
            {title.split('').map((char, i) => (
              <span key={i} className="char" style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        )}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(10px, 1.5vw, 20px)',
            fontWeight: 400,
            letterSpacing: '0.3em',
            color: '#2bbdb0',
            textTransform: 'uppercase',
            marginTop: 16,
            opacity: 0,
          }}
        >
          {subtitle.split('').map((char, i) => (
            <span key={i} className="sub-char" style={{ display: 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </p>
      </div>

      {/* Scroll hint — reveal is coupled to the same intro-skip state as the
          title so returning / reduced-motion visitors don't wait ~5s for it. */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: reduce ? 1 : 0,
          animation: reduce ? 'none' : `fadeInUpCentered 0.8s ease-out ${introSkipped ? 0.6 : 5.2}s forwards`,
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(43, 189, 176, 0.6)',
          }}
        >
          Défiler
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background: 'linear-gradient(to bottom, #2bbdb0, transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Gold accent line at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 1,
          background: 'linear-gradient(to right, transparent, #2bbdb0, transparent)',
          zIndex: 4,
          opacity: 0.3,
        }}
      />
    </section>
  )
}
