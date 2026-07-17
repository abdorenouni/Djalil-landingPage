import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'
import { TEAL, GOLD, EASE, Reveal, MagneticCTA } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { PROJECTS, featuredProject, type Project } from '@/data/projects'
import { fetchProjects } from '@/lib/queries'
import { Seo, breadcrumbLd } from '@/lib/seo'

function statusColor(s: Project['status']) {
  return s === 'En cours' ? TEAL : s === 'Livré' ? GOLD : '#9fb0ae'
}

export default function Projets() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  useEffect(() => { fetchProjects().then((p) => p?.length && setProjects(p)) }, [])

  const featured = projects.find((p) => p.featured) || projects[0] || featuredProject()
  const rest = projects.filter((p) => p.slug !== featured.slug)

  const featRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: featRef, offset: ['start end', 'end start'] })
  const featY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const featScale = useTransform(scrollYProgress, [0, 1], [1.12, 1])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', overflowX: 'hidden' }}
    >
      <Seo
        title="Nos Projets"
        description="Découvrez les résidences de prestige signées Elite Promotion Immobilière — d'ASTERIA à nos projets à venir en Algérie."
        path="/projets"
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Nos Projets', path: '/projets' }])}
      />
      <Header />

      {/* HEADER */}
      <section style={{ padding: 'clamp(120px, 15vw, 195px) clamp(24px, 5vw, 80px) clamp(36px, 5vw, 56px)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 38, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Nos Réalisations</span>
            <div style={{ width: 38, height: 1, background: TEAL }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(40px, 8vw, 110px)', fontWeight: 700, margin: 0, lineHeight: 1 }}>
            Nos Projets
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(15px, 2vw, 21px)', color: 'rgba(var(--text-rgb),0.6)', margin: 'clamp(24px, 4vw, 36px) auto 0', maxWidth: 640, lineHeight: 1.6 }}>
            Des adresses pensées comme des signatures, d'ASTERIA aux résidences à venir.
          </p>
        </motion.div>
      </section>

      {/* FEATURED PROJECT — cinematic banner */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(40px, 5vw, 70px)' }}>
        <Reveal>
          <Link to={featured.to} style={{ display: 'block', textDecoration: 'none' }}>
            <div ref={featRef} className="prj-feat prj-feat-banner force-dark" style={{ position: 'relative', maxWidth: 1400, margin: '0 auto', aspectRatio: '21/9', overflow: 'hidden', borderRadius: 6 }}>
              <motion.img src={featured.cover} alt={featured.name} className="prj-feat-img" style={{ position: 'absolute', inset: '-8% 0', width: '100%', height: '116%', objectFit: 'cover', y: featY, scale: featScale }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.25) 55%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(28px, 4vw, 60px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                  <span style={{ padding: '6px 14px', borderRadius: 2, background: `${statusColor(featured.status)}26`, border: `1px solid ${statusColor(featured.status)}66`, color: statusColor(featured.status), fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {featured.status}
                  </span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>{featured.year} · {featured.location}</span>
                </div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(36px, 7vw, 96px)', color: '#fff', margin: '0 0 6px', lineHeight: 0.98 }}>{featured.name}</h2>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.6vw, 17px)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.8)', margin: 0 }}>{featured.tagline}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 22, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>
                  Découvrir la résidence <Arrow />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* OTHER PROJECTS + invitation */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(80px, 12vw, 160px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(18px, 2.5vw, 32px)' }} className="proj-cat-grid">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <ProjectCard project={p} />
            </Reveal>
          ))}

          {/* Invitation card */}
          <Reveal delay={(rest.length % 2) * 0.08}>
            <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 5, border: '1px solid rgba(var(--line-rgb),0.1)', background: 'rgba(var(--line-rgb),0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(28px, 4vw, 56px)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${TEAL}0e 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: TEAL, marginBottom: 18 }}>Prochainement</span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 400, color: 'var(--text)', margin: '0 0 18px', lineHeight: 1.2 }}>De nouvelles<br />adresses signées Elite</h3>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, lineHeight: 1.7, color: 'rgba(var(--text-rgb),0.55)', maxWidth: 360, margin: '0 0 28px' }}>
                Restez informé des prochaines résidences en avant-première.
              </p>
              <MagneticCTA label="Nous contacter" to="/contact" variant="outline" />
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .prj-feat:hover .prj-feat-img { filter: brightness(1.05); }
        .prj-card:hover .prj-card-img { transform: scale(1.06); }
        @media (max-width: 760px){
          .proj-cat-grid{ grid-template-columns:1fr !important; }
          .prj-feat-banner { aspect-ratio: 3/4 !important; }
        }
      `}</style>
    </motion.div>
  )
}

function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link to={p.to} className="prj-card" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 5 }}>
        <img src={p.cover} alt={p.name} loading="lazy" decoding="async" className="prj-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.12) 55%, transparent 100%)', pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', top: 18, left: 18, padding: '5px 13px', borderRadius: 2, background: `${statusColor(p.status)}26`, border: `1px solid ${statusColor(p.status)}66`, color: statusColor(p.status), fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {p.status}
        </span>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px, 3vw, 40px)', pointerEvents: 'none' }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 400, color: '#fff', margin: '0 0 4px' }}>{p.name}</h3>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, letterSpacing: '0.04em', color: 'rgba(var(--text-rgb),0.6)' }}>{p.tagline}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL }}>
            Découvrir <Arrow />
          </span>
        </div>
      </div>
    </Link>
  )
}

function Arrow() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
}
