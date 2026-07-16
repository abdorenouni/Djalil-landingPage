import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useParams, Navigate } from 'react-router'
import { Reveal, ParallaxImage, StatMarquee, MagneticCTA, WordReveal, TEAL, GOLD, EASE, useIsMobile } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { getProject, type Project, type GalleryItem } from '@/data/projects'
import { fetchProject } from '@/lib/queries'
import { Seo, residenceLd, breadcrumbLd } from '@/lib/seo'

function statusColor(s: string) {
  return s === 'En cours' ? TEAL : s === 'Livré' ? GOLD : '#9fb0ae'
}

/* ── Rich gallery with captions — used when galleryItems is defined ── */
function RichGallery({ items }: { items: GalleryItem[] }) {
  // Pre-process items into display rows: wide items get their own row,
  // consecutive non-wide items are grouped into pairs.
  type Row =
    | { kind: 'wide'; item: GalleryItem; index: number }
    | { kind: 'pair'; a: GalleryItem; aIdx: number; b: GalleryItem; bIdx: number }
    | { kind: 'single'; item: GalleryItem; index: number }

  const rows: Row[] = []
  let i = 0
  while (i < items.length) {
    const item = items[i]
    if (item.wide) {
      rows.push({ kind: 'wide', item, index: i })
      i++
    } else {
      const next = items[i + 1]
      if (next && !next.wide) {
        rows.push({ kind: 'pair', a: item, aIdx: i, b: next, bIdx: i + 1 })
        i += 2
      } else {
        rows.push({ kind: 'single', item, index: i })
        i++
      }
    }
  }

  return (
    <section style={{ padding: 'clamp(20px, 4vw, 60px) clamp(24px, 5vw, 64px) clamp(70px, 11vw, 150px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>La Galerie</span>
              <div style={{ width: 38, height: 1, background: TEAL }} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4.5vw, 56px)', fontWeight: 400, margin: 0 }}>
              Chaque vue, un privilège
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vw, 56px)' }}>
          {rows.map((row, ri) => {
            if (row.kind === 'wide') {
              return (
                <Reveal key={row.item.src} delay={0.05}>
                  <div>
                    <div style={{ borderRadius: 4, overflow: 'hidden' }}>
                      <ParallaxImage src={row.item.src} alt={row.item.caption} aspect={row.item.aspect || '16/9'} range={10} />
                    </div>
                    {(row.item.caption || row.item.desc) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginTop: 20, paddingBottom: 'clamp(14px, 2vw, 24px)', borderBottom: '1px solid rgba(var(--line-rgb),0.07)' }}>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: TEAL }}>
                          {String(row.index + 1).padStart(2, '0')} — {row.item.caption}
                        </span>
                        {row.item.desc && (
                          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 1.7, color: 'rgba(var(--text-rgb),0.55)', margin: 0, maxWidth: 560, textAlign: 'right' }}>
                            {row.item.desc}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Reveal>
              )
            }

            if (row.kind === 'pair') {
              return (
                <div key={row.a.src} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 36px)', alignItems: 'flex-start' }} className="pd-rich-pair">
                  <Reveal delay={0}>
                    <GalleryCard item={row.a} index={row.aIdx} />
                  </Reveal>
                  <Reveal delay={0.1}>
                    <div style={{ marginTop: ri % 2 === 0 ? 'clamp(32px, 5vw, 64px)' : 0 }}>
                      <GalleryCard item={row.b} index={row.bIdx} />
                    </div>
                  </Reveal>
                </div>
              )
            }

            // single
            return (
              <Reveal key={row.item.src} delay={0.05}>
                <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
                  <GalleryCard item={row.item} index={row.index} />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .pd-rich-pair { grid-template-columns: 1fr !important; }
          .pd-rich-pair > * { margin-top: 0 !important; }
        }
      `}</style>
    </section>
  )
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <figure style={{ margin: 0 }}>
      <div style={{ overflow: 'hidden', borderRadius: 4 }}>
        <ParallaxImage src={item.src} alt={item.caption} aspect={item.aspect || '4/3'} range={12} />
      </div>
      {(item.caption || item.desc) && (
        <figcaption style={{ marginTop: 16 }}>
          <span style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: TEAL, marginBottom: 8 }}>
            {String(index + 1).padStart(2, '0')} — {item.caption}
          </span>
          {item.desc && (
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 1.72, color: 'rgba(var(--text-rgb),0.55)', margin: 0 }}>
              {item.desc}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | undefined>(() => getProject(slug))
  // Projects that only exist in Sanity (not in the static fallback) start with
  // `project` undefined — only redirect once fetchProject() confirms the slug
  // truly doesn't exist anywhere, not before the CMS fetch has had a chance to resolve.
  const [notFound, setNotFound] = useState(!slug)
  useEffect(() => {
    if (slug) fetchProject(slug).then((p) => (p ? setProject(p) : setNotFound(true)))
  }, [slug])

  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.16])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])

  if (!project) return notFound ? <Navigate to="/projets" replace /> : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}
    >
      <Seo
        title={`${project.name} — ${project.tagline}`}
        description={project.description[0]}
        path={project.to}
        image={project.cover}
        jsonLd={[
          residenceLd({ name: project.name, description: project.description[0], image: project.cover, location: project.location, path: project.to }),
          breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Nos Projets', path: '/projets' }, { name: project.name, path: project.to }]),
        ]}
      />
      <Header />

      {/* ── HERO ── */}
      <div ref={heroRef} className="force-dark" style={{ position: 'relative', height: '92dvh', minHeight: 560, overflow: 'hidden' }}>
        {isMobile ? (
          <img src={project.cover} alt={project.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <motion.img src={project.cover} alt={project.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.5) 0%, transparent 35%, transparent 55%, rgba(6,6,6,0.95) 100%)' }} />

        <motion.div style={{ position: 'absolute', inset: 0, ...(isMobile ? {} : { y: heroTextY }), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <motion.span initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 0.8, letterSpacing: '0.4em' }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(10px, 1.3vw, 14px)', color: TEAL, textTransform: 'uppercase', marginBottom: 22 }}>
            Élite Promotion Immobilière
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(56px, 14vw, 200px)', lineHeight: 0.92, letterSpacing: '0.04em', margin: 0, color: '#fff', textShadow: '0 8px 60px rgba(0,0,0,0.6)' }}>
            {project.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.8 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 2vw, 20px)', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.85)', margin: '18px 0 0' }}>
            {project.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ padding: '6px 14px', borderRadius: 2, background: `${statusColor(project.status)}22`, border: `1px solid ${statusColor(project.status)}66`, color: statusColor(project.status), fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{project.status}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── MANIFESTO ── */}
      {project.description.length > 0 && (
        <section style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px, 13vw, 170px) clamp(24px, 5vw, 64px)', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(22px, 3.6vw, 46px)', lineHeight: 1.42, color: 'var(--text)', margin: 0, fontWeight: 400 }}>
            <WordReveal segments={[{ t: project.description[0] }]} />
          </p>
        </section>
      )}

      {/* ── STAT MARQUEE — only when the CMS provides stats ── */}
      {project.stats.length > 0 && (
        <div style={{ padding: 'clamp(20px, 4vw, 44px) 0', borderTop: '1px solid rgba(var(--line-rgb),0.06)', borderBottom: '1px solid rgba(var(--line-rgb),0.06)' }}>
          <StatMarquee items={project.stats} speed={38} numberSize="clamp(38px, 5.5vw, 68px)" />
        </div>
      )}

      {/* ── NARRATIVE + first image ── */}
      <section style={{ padding: 'clamp(70px, 11vw, 150px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="pd-split">
          <Reveal>
            {/* Falls back to the cover when the CMS gallery is empty. */}
            <ParallaxImage src={project.gallery[0] ?? project.cover} alt={`${project.name} — vue`} aspect="4/5" />
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 38, height: 1, background: TEAL }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Le Projet</span>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4.2vw, 56px)', fontWeight: 400, lineHeight: 1.12, margin: '0 0 26px' }}>
              Un art de vivre<br /><span style={{ color: TEAL }}>singulier</span>
            </h2>
            {project.description.map((para, i) => (
              <p key={i} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: i === 0 ? 'rgba(var(--text-rgb),0.65)' : 'rgba(var(--text-rgb),0.5)', marginBottom: i === 0 ? 20 : 0, maxWidth: 480 }}>
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── RICH GALLERY (captioned) — when galleryItems is defined ── */}
      {project.galleryItems && project.galleryItems.length > 0 ? (
        <RichGallery items={project.galleryItems} />
      ) : project.gallery.length > 1 && (
        /* ── PLAIN GALLERY fallback ── */
        <section style={{ padding: 'clamp(20px, 4vw, 60px) clamp(24px, 5vw, 64px) clamp(70px, 11vw, 150px)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4.5vw, 56px)', fontWeight: 400, margin: 0 }}>La Galerie</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 32px)' }} className="pd-gallery">
              {project.gallery.slice(1).map((src, i) => (
                <Reveal key={src} delay={(i % 2) * 0.1}>
                  <figure style={{ margin: 0, marginTop: i % 2 === 1 ? 'clamp(0px, 6vw, 70px)' : 0 }}>
                    <ParallaxImage src={src} alt={`${project.name} — galerie ${i + 1}`} aspect={i % 3 === 2 ? '4/3' : '3/4'} range={12} />
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ position: 'relative', minHeight: 440, height: '60dvh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={project.cover} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.72)' }} />
        <Reveal>
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(32px, 6vw, 80px)', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.05 }}>
              Vivez {project.name}
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.2vw, 18px)', color: 'rgba(var(--text-rgb),0.7)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Les résidences sont disponibles sur rendez vous privé. Notre équipe vous accueille
              pour une visite exclusive.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MagneticCTA label="Réserver une visite privée" to="/contact" variant="solid" />
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />

      <style>{`
        @media (max-width: 860px){
          .pd-split { grid-template-columns: 1fr !important; }
          .pd-gallery { grid-template-columns: 1fr !important; }
          .pd-gallery figure { margin-top: 0 !important; }
        }
      `}</style>
    </motion.div>
  )
}
