import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!textRef.current) return
    const chars = textRef.current.querySelectorAll('.char')
    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power4.out',
        delay: 4.5,
      }
    )
  }, [])

  useEffect(() => {
    if (!subtitleRef.current) return
    const subtitleChars = subtitleRef.current.querySelectorAll('.sub-char')
    gsap.fromTo(
      subtitleChars,
      { opacity: 0, y: 10 },
      {
        opacity: 0.8,
        y: 0,
        duration: 0.4,
        stagger: 0.01,
        ease: 'power3.out',
        delay: 4.8,
      }
    )
  }, [])

  const title = "L'EXCELLENCE"
  const subtitle = 'IMMOBILIÈRE EN ALGÉRIE'

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
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
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
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
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1.5vw, 20px)',
            fontWeight: 300,
            letterSpacing: '0.3em',
            color: '#d4af37',
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

      {/* Scroll hint */}
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
          opacity: 0,
          animation: 'fadeInUp 0.8s ease-out 5.2s forwards',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(212, 175, 55, 0.6)',
          }}
        >
          Défiler
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            background: 'linear-gradient(to bottom, #d4af37, transparent)',
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
          background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
          zIndex: 4,
          opacity: 0.3,
        }}
      />
    </section>
  )
}
