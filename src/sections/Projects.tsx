import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ProjectCard {
  id: number
  title: string
  location: string
  image: string
  year: string
  featured?: boolean
  to: string
}

/* Teaser mix — each card links to its own project detail page */
const projects: ProjectCard[] = [
  { id: 2, title: 'MAGNOLIA', location: 'Boumerdès', image: '/images/magnolia/3A2C0AAE-608F-4B79-90BE-6B92E97E4C1F.png', year: '2026', to: '/projets/magnolia' },
  { id: 3, title: 'ASTERIA · Les Terrasses', location: 'Alger', image: '/images/asteria/corner-balcony-view.jpg', year: '2025', to: '/projets/asteria' },
  { id: 5, title: 'ASTERIA · Les Séjours', location: 'Alger', image: '/images/asteria/living-room-view.jpg', year: '2025', to: '/projets/asteria' },
  { id: 6, title: 'MAGNOLIA · Les Espaces', location: 'Boumerdès', image: '/images/magnolia/rooftop-pool-view.jpg', year: '2026', to: '/projets/magnolia' },
  { id: 7, title: 'ASTERIA · Le Cinéma', location: 'Alger', image: '/images/asteria/cinema-room-view.jpg', year: '2025', to: '/projets/asteria' },
  { id: 8, title: 'MAGNOLIA · Les Chambres', location: 'Boumerdès', image: '/images/magnolia/bedroom-view.jpg', year: '2026', to: '/projets/magnolia' },
  { id: 9, title: 'ASTERIA · Espace Enfants', location: 'Alger', image: '/images/asteria/kids-playroom-view.jpg', year: '2025', to: '/projets/asteria' },
  { id: 10, title: 'ASTERIA · Les Séjours', location: 'Alger', image: '/images/asteria/living-room-view-2.jpg', year: '2025', to: '/projets/asteria' },
]

function ProjectCarousel({
  items,
  direction,
  speed,
}: {
  items: ProjectCard[]
  direction: 'left' | 'right'
  speed: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const animate = () => {
      const track = trackRef.current
      if (!track) return
      const itemWidth = track.children[0]?.clientWidth || 400
      const totalWidth = itemWidth * items.length

      if (direction === 'left') {
        positionRef.current -= speed
        if (Math.abs(positionRef.current) >= totalWidth) positionRef.current = 0
      } else {
        positionRef.current += speed
        if (positionRef.current >= 0) positionRef.current = -totalWidth
      }
      track.style.transform = `translateX(${positionRef.current}px)`
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [direction, speed, items.length])

  const doubledItems = [...items, ...items]

  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div ref={trackRef} style={{ display: 'flex', gap: 'clamp(12px, 2vw, 24px)', willChange: 'transform' }}>
        {doubledItems.map((project, i) => (
          <Link
            to={project.to}
            key={`${project.id}-${i}`}
            className="cursor-hover"
            style={{ flexShrink: 0, width: 'clamp(260px, 45vw, 380px)', position: 'relative', textDecoration: 'none' }}
          >
            <div className="prj-card" style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: 3, position: 'relative' }}>
              <img
                className="prj-card-img"
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.1) 50%, transparent 100%)', pointerEvents: 'none' }} />

              {project.featured && (
                <span style={{
                  position: 'absolute', top: 16, left: 16, padding: '5px 12px',
                  background: 'rgba(43,189,176,0.15)', border: '1px solid rgba(43,189,176,0.5)',
                  borderRadius: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9,
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2bbdb0',
                }}>
                  Signature
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading.querySelectorAll('.reveal-item'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 95%', toggleActions: 'play none none none' } }
      )
    }, section)
    return () => ctx.revert()
  }, [])

  const mid = Math.ceil(projects.length / 2)
  const row1 = projects.slice(0, mid)
  const row2 = projects.slice(mid)

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ background: 'var(--bg)', padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={headingRef} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)', marginBottom: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <div className="reveal-item" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 40, height: 1, background: '#2bbdb0' }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2bbdb0' }}>
              Nos Projets
            </span>
          </div>
          <h2 className="reveal-item font-display" style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            L'Architecture
            <br />
            <span style={{ color: '#2bbdb0' }}>de Demain</span>
          </h2>
        </div>
        <Link
          to="/projets"
          className="reveal-item cursor-hover"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', border: '1px solid rgba(43,189,176,0.4)', color: '#2bbdb0', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3, transition: 'all 0.4s ease', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2bbdb0'; e.currentTarget.style.color = 'var(--bg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#2bbdb0' }}
        >
          <span>Voir tous les projets</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ProjectCarousel items={row1} direction="left" speed={isPaused ? 0.2 : 0.7} />
        <ProjectCarousel items={row2} direction="right" speed={isPaused ? 0.15 : 0.5} />
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, var(--bg), transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <style>{`
        .prj-card {
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.55s ease;
          will-change: transform;
        }
        .prj-card:hover {
          transform: scale(1.02);
          box-shadow: 0 26px 60px rgba(0,0,0,0.55), 0 0 46px rgba(43,189,176,0.24);
        }
        .prj-card:hover .prj-card-img { transform: scale(1.07); }
      `}</style>
    </section>
  )
}
