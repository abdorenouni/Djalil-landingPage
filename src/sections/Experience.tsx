import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const words = ['Vivre', 'Investir', 'Construire']

const desktopShapes = [
  { width: 300, height: 600, radius: 0, rotate: -5, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
  { width: 450, height: 450, radius: 50, rotate: 5, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
  { width: 400, height: 650, radius: 100, rotate: -2, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
  { width: 600, height: 400, radius: 0, rotate: 0, polygon: '25% 0%, 75% 0%, 100% 100%, 0% 100%' },
  { width: 600, height: 600, radius: 10, rotate: 0, polygon: '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%' },
  { width: 800, height: 500, radius: 0, rotate: 0, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
]

const mobileShapes = [
  { width: 200, height: 350, radius: 0, rotate: -3, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
  { width: 260, height: 260, radius: 30, rotate: 3, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
  { width: 240, height: 380, radius: 60, rotate: -1, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
  { width: 300, height: 220, radius: 0, rotate: 0, polygon: '25% 0%, 75% 0%, 100% 100%, 0% 100%' },
  { width: 280, height: 280, radius: 10, rotate: 0, polygon: '50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%' },
  { width: 320, height: 240, radius: 0, rotate: 0, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const video = videoRef.current
    if (!section || !track || !video) return

    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const shapes = window.innerWidth <= 768 ? mobileShapes : desktopShapes

    const ctx = gsap.context(() => {
      // Set initial video state
      gsap.set(video, {
        width: shapes[0].width,
        height: shapes[0].height,
        borderRadius: shapes[0].radius,
        rotation: shapes[0].rotate,
        clipPath: `polygon(${shapes[0].polygon})`,
      })

      // Hide all words initially
      wordRefs.current.forEach((word) => {
        if (word) gsap.set(word, { opacity: 0, y: 30 })
      })

      // Create master timeline
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: track.querySelector('.sticky-container') as HTMLElement,
        },
      })

      shapes.forEach((shape, index) => {
        // Animate video shape
        masterTL.to(
          video,
          {
            width: shape.width,
            height: shape.height,
            borderRadius: shape.radius,
            rotation: shape.rotate,
            clipPath: `polygon(${shape.polygon})`,
            duration: 1,
            ease: 'power1.inOut',
          },
          index
        )

        // Show current word
        if (wordRefs.current[index]) {
          masterTL.to(
            wordRefs.current[index],
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
            },
            index + 0.1
          )
        }

        // Hide previous word
        if (index > 0 && wordRefs.current[index - 1]) {
          masterTL.to(
            wordRefs.current[index - 1],
            {
              opacity: 0,
              y: -30,
              duration: 0.4,
              ease: 'power3.in',
            },
            index
          )
        }
      })
    }, section)

    return () => {
      ctx.revert()
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="experience"
      style={{
        background: '#050505',
        position: 'relative',
      }}
    >
      {/* Track for scroll */}
      <div
        ref={trackRef}
        style={{ height: `${desktopShapes.length * 100}vh` }}
      >
        <div
          className="sticky-container"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              willChange: 'clip-path, transform',
              objectFit: 'cover',
            }}
          >
            <source src="/videos/apartment-walkthrough.mp4" type="video/mp4" />
          </video>

          {/* Video overlay gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.5) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Words */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          >
            {words.map((word, i) => (
              <span
                key={word}
                ref={(el) => { wordRefs.current[i] = el }}
                className="font-display"
                style={{
                  position: 'absolute',
                  fontSize: 'clamp(48px, 8vw, 120px)',
                  color: '#d4af37',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  textShadow: '0 4px 40px rgba(0,0,0,0.5)',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ width: 40, height: 1, background: '#d4af37', opacity: 0.5 }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#d4af37',
              opacity: 0.6,
            }}
          >
            L'Expérience
          </span>
          <div style={{ width: 40, height: 1, background: '#d4af37', opacity: 0.5 }} />
        </div>
      </div>
    </section>
  )
}
