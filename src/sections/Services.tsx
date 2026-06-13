import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  id: number
  title: string
  description: string
  image: string
  number: string
}

const services: Service[] = [
  {
    id: 1,
    title: 'Accompagnement',
    description: 'De la première visite à la signature, notre équipe vous guide à chaque étape de votre projet immobilier avec expertise et transparence.',
    image: '/images/service-1.jpg',
    number: '01',
  },
  {
    id: 2,
    title: 'Construction',
    description: 'Des fondations à la finition, nous maîtrisons chaque phase de construction avec des matériaux premium et un savoir-faire reconnu.',
    image: '/images/service-2.jpg',
    number: '02',
  },
  {
    id: 3,
    title: 'Remise des Clés',
    description: 'La livraison de votre bien est un moment privilégié. Nous assurons une remise impeccable et un suivi post-livraison de qualité.',
    image: '/images/service-3.jpg',
    number: '03',
  },
]

function ServiceItem({
  service,
  isActive,
  onActivate,
  onDeactivate,
}: {
  service: Service
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
}) {
  const itemRef = useRef<HTMLLIElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const item = itemRef.current
    const reveal = revealRef.current
    if (!item || !reveal) return

    const ctx = gsap.context(() => {
      // Initial state: hidden
      gsap.set(reveal, {
        clipPath: 'inset(0% 100% 0% 0%)',
        opacity: 0,
      })

      const tl = gsap.timeline({ paused: true })

      tl.to(reveal, {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 0.8,
        ease: 'power4.inOut',
      })

      tl.to(
        reveal.querySelector('.reveal-img'),
        {
          scale: 1,
          duration: 0.8,
          ease: 'power4.inOut',
        },
        0
      )

      tl.to(
        reveal.querySelector('.reveal-img'),
        {
          filter: 'grayscale(0%)',
          duration: 0.6,
          delay: 0.2,
        },
        0.2
      )

      tlRef.current = tl
    }, item)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    if (isActive) {
      tlRef.current.play()
    } else {
      tlRef.current.reverse()
    }
  }, [isActive])

  return (
    <li
      ref={itemRef}
      style={{
        borderBottom: '1px solid rgba(26, 26, 26, 0.2)',
        position: 'relative',
      }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
    >
      <div
        className="cursor-hover service-item-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 200px',
          alignItems: 'center',
          padding: 'clamp(24px, 4vw, 56px) 0',
          cursor: 'pointer',
          transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
      >
        {/* Hover glow line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: isActive ? '100%' : '0%',
            height: 1,
            background: 'linear-gradient(to right, #d4af37, transparent)',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Number */}
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(18px, 2vw, 28px)',
            fontWeight: 400,
            color: isActive ? '#d4af37' : 'rgba(26, 26, 26, 0.25)',
            transition: 'color 0.4s ease',
          }}
        >
          {service.number}
        </span>

        {/* Title */}
        <h3
          className="font-display"
          style={{
            fontSize: 'clamp(24px, 3.5vw, 48px)',
            fontWeight: 400,
            color: '#1a1a1a',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isActive ? 'translateX(20px)' : 'translateX(0)',
          }}
        >
          {service.title}
        </h3>

        {/* Arrow */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: `1px solid ${isActive ? '#d4af37' : 'rgba(26,26,26,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s ease',
              transform: isActive ? 'rotate(-45deg)' : 'rotate(0deg)',
              boxShadow: isActive ? '0 0 20px rgba(212, 175, 55, 0.15)' : 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke={isActive ? '#d4af37' : '#1a1a1a'}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Description (shows on active) */}
      <div
        className="service-description"
        style={{
          maxHeight: isActive ? 100 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          paddingLeft: 80,
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(13px, 1vw, 16px)',
            lineHeight: 1.7,
            color: 'rgba(26, 26, 26, 0.6)',
            maxWidth: 500,
            paddingBottom: 32,
          }}
        >
          {service.description}
        </p>
      </div>

      {/* Image reveal (hidden on mobile) */}
      <div
        ref={revealRef}
        className="service-image-reveal"
        style={{
          position: 'fixed',
          top: '50%',
          right: '10%',
          width: 360,
          height: 480,
          transform: 'translateY(-50%)',
          zIndex: 10,
          pointerEvents: 'none',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          opacity: 0,
        }}
      >
        <img
          className="reveal-img"
          src={service.image}
          alt={service.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.3)',
            filter: 'grayscale(80%)',
          }}
        />
      </div>
    </li>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading.querySelectorAll('.reveal-anim'),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const handleDeactivate = useCallback(() => {
    setActiveIndex(null)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        background: '#e8e6e0',
        padding: 'clamp(80px, 12vw, 160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
        }}
      >
        {/* Heading */}
        <div
          ref={headingRef}
          style={{ marginBottom: 80 }}
        >
          <div
            className="reveal-anim"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
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
              Nos Services
            </span>
          </div>
          <h2
            className="reveal-anim font-display"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              color: '#1a1a1a',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Notre Processus
            <br />
            <span style={{ color: '#d4af37' }}>de Livraison</span>
          </h2>
        </div>

        {/* Service list */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {services.map((service, index) => (
            <ServiceItem
              key={service.id}
              service={service}
              isActive={activeIndex === index}
              onActivate={() => handleActivate(index)}
              onDeactivate={handleDeactivate}
            />
          ))}
        </ul>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .service-item-grid {
            grid-template-columns: 40px 1fr 48px !important;
          }
          .service-description {
            padding-left: 40px !important;
          }
          .service-image-reveal {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
