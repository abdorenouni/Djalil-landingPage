import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Building3D from '@/components/custom/Building3D'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const title = titleRef.current
    const text = textRef.current
    const cta = ctaRef.current
    if (!section || !scene || !title || !text || !cta) return

    const ctx = gsap.context(() => {
      // 3D scene reveal with scale and fade
      gsap.fromTo(
        scene,
        { scale: 0.9, opacity: 0, rotateY: -10 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Title wind-swept reveal
      const chars = title.querySelectorAll('.char')
      gsap.fromTo(
        chars,
        { opacity: 0, x: -20, skewX: 10 },
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: 0.4,
          stagger: 0.015,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Text fade in
      gsap.fromTo(
        text,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: text,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      )

      // CTA fade in
      gsap.fromTo(
        cta,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cta,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const titleText = 'ELITE'
  const titleText2 = 'PROMOTION'

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: '#0c1220',
        padding: 'clamp(80px, 12vw, 160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background subtle gold gradient */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-20%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 120px)',
          alignItems: 'center',
        }}
        className="about-grid"
      >
        {/* Left: 3D Building Scene */}
        <div ref={sceneRef} className="about-image-wrapper" style={{ perspective: 1000 }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/4',
              overflow: 'hidden',
              borderRadius: 3,
              background: '#0a0a0a',
              border: '1px solid rgba(212, 175, 55, 0.1)',
            }}
          >
            <Building3D />
            {/* Gold border accent */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30%',
                height: 3,
                background: '#d4af37',
              }}
            />
          </div>
        </div>

        {/* Right: Content */}
        <div ref={contentRef} className="about-content">
          {/* Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ width: 40, height: 1, background: '#d4af37' }} />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#d4af37',
              }}
            >
              À Propos
            </span>
          </div>

          {/* Title with wind-swept effect */}
          <h2
            ref={titleRef}
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              color: '#f3f4f1',
              lineHeight: 1.1,
              marginBottom: 40,
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ display: 'block' }}>
              {titleText.split('').map((char, i) => (
                <span key={i} className="char" style={{ display: 'inline-block' }}>
                  {char}
                </span>
              ))}
            </span>
            <span
              style={{
                display: 'block',
                color: '#d4af37',
                fontWeight: 600,
              }}
            >
              {titleText2.split('').map((char, i) => (
                <span key={i} className="char" style={{ display: 'inline-block' }}>
                  {char}
                </span>
              ))}
            </span>
          </h2>

          {/* Body text */}
          <div ref={textRef}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.8,
                color: 'rgba(243, 244, 241, 0.7)',
                marginBottom: 24,
                maxWidth: 520,
              }}
            >
              Elite Promotion Immobilière façonne le paysage immobilier algérien
              avec une vision audacieuse : créer des espaces de vie qui transcendent l'ordinaire.
              Chaque projet est une promesse d'excellence, du choix des matériaux à la remise des clés.
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.8,
                color: 'rgba(243, 244, 241, 0.5)',
                marginBottom: 40,
                maxWidth: 520,
              }}
            >
              Notre expertise s'étend de la conception architecturale à la livraison clé en main,
              en passant par un accompagnement personnalisé à chaque étape de votre projet immobilier.
            </p>
          </div>

          {/* CTA Button */}
          <a
            ref={ctaRef}
            href="#projects"
            className="cursor-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 40px',
              border: '1px solid #d4af37',
              color: '#d4af37',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 3,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = '#d4af37'
              el.style.color = '#050505'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'transparent'
              el.style.color = '#d4af37'
            }}
          >
            <span>Découvrir nos projets</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .about-image-wrapper {
            order: 2;
          }
          .about-content {
            order: 1;
          }
        }
      `}</style>
    </section>
  )
}
