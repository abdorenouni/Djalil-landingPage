import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePos({ x, y })
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!textRef.current) return

    const chars = textRef.current.querySelectorAll('.char')
    gsap.fromTo(
      chars,
      { opacity: 0, y: 100, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.04,
        ease: 'power4.out',
        delay: 0.3,
      }
    )
  }, [])

  useEffect(() => {
    if (!subtitleRef.current) return
    const subtitleChars = subtitleRef.current.querySelectorAll('.sub-char')
    gsap.fromTo(
      subtitleChars,
      { opacity: 0, y: 20 },
      {
        opacity: 0.8,
        y: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        delay: 1.2,
      }
    )
  }, [])

  useEffect(() => {
    if (!glowRef.current) return
    gsap.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  const title = "L'EXCELLENCE"
  const subtitle = 'IMMOBILIÈRE EN ALGÉRIE'

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
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
          transform: `translate(-50%, -50%) scale(1.1)`,
          zIndex: 1,
          opacity: 0.8,
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, transparent 0%, rgba(5,5,5,0.4) 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Animated glow behind text */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.3,
        }}
      />

      {/* Floating particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              position: 'absolute',
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.4)',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `floatParticle ${8 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Text container */}
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
          className="font-display"
          style={{
            fontSize: 'clamp(32px, 8vw, 130px)',
            fontWeight: 900,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            textAlign: 'center',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            margin: 0,
            textShadow: '0 0 80px rgba(212,175,55,0.3)',
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
            fontSize: 'clamp(12px, 1.8vw, 24px)',
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
