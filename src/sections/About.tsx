import { useRef, useEffect } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSiteSettings, aboutTextToString } from '@/lib/useSiteSettings'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const settings = useSiteSettings()
  const eyebrow = settings?.aboutEyebrow || 'À Propos'
  const titleText = settings?.aboutTitle1 || 'ELITE'
  const titleText2 = settings?.aboutTitle2 || 'PROMOTION'
  const ctaLabel = settings?.aboutCtaLabel || 'Découvrir À Propos'
  const aboutParas = aboutTextToString(settings?.aboutText)
  const para1 = aboutParas[0] || "Elite Promotion Immobilière façonne le paysage immobilier algérien avec une vision audacieuse : créer des espaces de vie qui transcendent l'ordinaire. Chaque projet est une promesse d'excellence, du choix des matériaux à la remise des clés."
  const para2 = aboutParas[1] || "Notre expertise s'étend de la conception architecturale à la livraison clé en main, en passant par un accompagnement personnalisé à chaque étape de votre projet immobilier."
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const text = textRef.current
    const cta = ctaRef.current
    if (!section || !title || !text || !cta) return

    const ctx = gsap.context(() => {
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

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: 'var(--bg-2)',
        padding: 'clamp(80px, 12vw, 160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient brand glows — teal + gold to match the site vibe */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-15%',
          width: '50%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(43,189,176,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '-18%',
          width: '55%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 920,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          textAlign: 'center',
        }}
        className="about-grid"
      >
        {/* Content (centered, no image) */}
        <div ref={contentRef} className="about-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ width: 40, height: 1, background: '#2bbdb0' }} />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#2bbdb0',
              }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Title with wind-swept effect */}
          <h2
            ref={titleRef}
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              color: 'var(--text)',
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
                color: '#2bbdb0',
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
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.8,
                color: 'rgba(243, 244, 241, 0.7)',
                marginBottom: 24,
                maxWidth: 620,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {para1}
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.8,
                color: 'rgba(243, 244, 241, 0.5)',
                marginBottom: 40,
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: 620,
              }}
            >
              {para2}
            </p>
          </div>

          {/* CTA Button → full À Propos page */}
          <Link
            ref={ctaRef}
            to="/a-propos"
            className="cursor-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 40px',
              border: '1px solid #2bbdb0',
              color: '#2bbdb0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
              el.style.backgroundColor = '#2bbdb0'
              el.style.color = 'var(--bg)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'transparent'
              el.style.color = '#2bbdb0'
            }}
          >
            <span>{ctaLabel}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
      </div>

    </section>
  )
}
