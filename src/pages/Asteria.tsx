import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router'
import { Waves, Plane, GraduationCap, ShoppingBag, Stethoscope, UtensilsCrossed, Maximize, BedDouble, Bath, Building2, Compass, Sun, MessageCircle, TreePine, Landmark } from 'lucide-react'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { MagneticCTA, StatMarquee, WordReveal, Marquee, useIsMobile } from '@/components/custom/lux'
import { Seo, residenceLd, breadcrumbLd } from '@/lib/seo'
import { fetchAsteria } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import { useSiteSettings } from '@/lib/useSiteSettings'

const TEAL = '#2bbdb0'
const GOLD = '#2bbdb0'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ── Reusable scroll reveal ── */
function Reveal({ children, delay = 0, y = 44 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.95, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ── Lazy-play video: loads & plays only when scrolled into view ── */
function LazyVideo({ src, poster, style }: { src: string; poster?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" style={style} />
  )
}

/* ── Eyebrow label ── */
function Eyebrow({ children, color = TEAL }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <div style={{ width: 38, height: 1, background: color }} />
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color }}>
        {children}
      </span>
    </div>
  )
}

/* ── Parallax image ── */
function ParallaxImage({ src, alt, aspect = '3/4', range = 14 }: { src: string; alt: string; aspect?: string; range?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`])
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden', borderRadius: 4, background: 'var(--bg-2)' }}>
      <motion.img
        src={src}
        alt={alt}
        style={{ position: 'absolute', top: '-15%', left: 0, width: '100%', height: '130%', objectFit: 'cover', y }}
      />
    </div>
  )
}

const FALLBACK_WHATSAPP = '213779527948'

/* ASTERIA F3 residences. */
const PLANS = [
  { ref: 'A-103', surface: '103.88', img: '/images/asteria/plan-103.jpg', pieces: 'F3 · 3 pièces', chambres: 2, sdb: 2, etage: '3ᵉ au 6ᵉ étage', orientation: "Sud · Baie d'Alger", terrasse: '16 m²', exposition: 'Double exposition' },
  { ref: 'A-104', surface: '104.93', img: '/images/asteria/plan-104.jpg', pieces: 'F3 · 3 pièces', chambres: 2, sdb: 2, etage: '4ᵉ au 7ᵉ étage', orientation: 'Sud-Est', terrasse: '18 m²', exposition: 'Traversant' },
  { ref: 'A-109', surface: '109.42', img: '/images/asteria/plan-109.jpg', pieces: 'F3 · 3 pièces', chambres: 2, sdb: 2, etage: '8ᵉ au 10ᵉ étage', orientation: 'Sud-Ouest · Couchant', terrasse: '22 m²', exposition: 'Traversant' },
  { ref: 'A-110', surface: '110.48', img: '/images/asteria/plan-110.jpg', pieces: 'F3 · 3 pièces', chambres: 3, sdb: 2, etage: '11ᵉ au 12ᵉ étage', orientation: 'Panoramique · Baie et ville', terrasse: '26 m²', exposition: 'Angle premium' },
]

/* F4 residences */
const PLANS_F4 = [
  { ref: 'A-154', surface: '154.55', img: '/images/asteria/plan-f4-154.png', pieces: 'F4 · 4 pièces', chambres: 3, sdb: 2, etage: '2ᵉ au 6ᵉ étage', orientation: "Sud · Baie d'Alger", terrasse: '30 m²', exposition: 'Double exposition' },
  { ref: 'A-171', surface: '171.76', img: '/images/asteria/plan-f4-171.png', pieces: 'F4 · 4 pièces', chambres: 3, sdb: 2, etage: '7ᵉ au 11ᵉ étage', orientation: 'Panoramique · Baie et ville', terrasse: '40 m²', exposition: 'Angle premium' },
]

/* Les 4 Villas ASTERIA */
const VILLAS_PLANS = [
  {
    ref: 'V-01', pieces: 'Villa · Duplex', chambres: 4, sdb: 3, piscine: 'Piscine privée 36 m²', exposition: 'Plein sud',
    levels: [
      { label: 'Niveau 8', sub: 'Séjour · Cuisine · Piscine', img: '/images/asteria/plan-villa-1-n8.png' },
      { label: 'Niveau 9', sub: 'Chambres · Dressing · Hammam', img: '/images/asteria/plan-villa-1-n9.png' },
      { label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Jardin', img: '/images/asteria/plan-villa-1-terrasse.png' },
    ],
  },
  {
    ref: 'V-02', pieces: 'Villa · Duplex', chambres: 4, sdb: 3, piscine: 'Piscine privée 15 m²', exposition: 'Plein ouest',
    levels: [
      { label: 'Niveau 8', sub: 'Séjour · Cuisine · Aquarium mural', img: '/images/asteria/plan-villa-2-n8.jpg' },
      { label: 'Niveau 9', sub: 'Chambres · Dressing · Home Cinéma', img: '/images/asteria/plan-villa-2-n9.png' },
      { label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Sport', img: '/images/asteria/plan-villa-2-terrasse.png' },
    ],
  },
  {
    ref: 'V-03', pieces: 'Villa · Duplex', chambres: 4, sdb: 3, piscine: 'Piscine privée panoramique', exposition: 'Multi-exposition',
    levels: [
      { label: 'Niveau 8', sub: 'Séjour · Cuisine · Cheminée', img: '/images/asteria/plan-villa-3-n8.png' },
      { label: 'Niveau 9', sub: 'Chambres · Sauna · Hammam · Home Cinéma', img: '/images/asteria/plan-villa-3-n9.png' },
      { label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Sport', img: '/images/asteria/plan-villa-3-terrasse.png' },
    ],
  },
  {
    ref: 'V-04', pieces: 'Villa · Duplex', chambres: 4, sdb: 3, piscine: "Piscine privée Baie d'Alger", exposition: 'Angle premium',
    levels: [
      { label: 'Niveau 8', sub: 'Séjour · Cuisine · Aquarium mural', img: '/images/asteria/plan-villa-4-n8.png' },
      { label: 'Niveau 9', sub: 'Chambres · Sauna · Hammam · Home Cinéma', img: '/images/asteria/plan-villa-4-n9.png' },
      { label: 'Terrasse', sub: 'Toit-terrasse · Piscine · Sport', img: '/images/asteria/plan-villa-4-terrasse.png' },
    ],
  },
]

const cleanWaNumber = (n: string) => { const d = n.replace(/\D/g, ''); return (d.startsWith('0') && d.length === 10) ? '213' + d.slice(1) : d }

const waResidence = (whatsapp: string, ref: string, surface: string) =>
  `https://wa.me/${cleanWaNumber(whatsapp)}?text=${encodeURIComponent(`Bonjour Elite, je suis intéressé par la résidence ASTERIA F3 — réf ${ref} (${surface} m²). Pourriez-vous me communiquer les disponibilités et conditions ?`)}`

const waResidenceF4 = (whatsapp: string, ref: string, surface: string) =>
  `https://wa.me/${cleanWaNumber(whatsapp)}?text=${encodeURIComponent(`Bonjour Elite, je suis intéressé par la résidence ASTERIA F4 — réf ${ref} (${surface} m²). Pourriez-vous me communiquer les disponibilités et conditions ?`)}`

const waVilla = (whatsapp: string, ref: string) =>
  `https://wa.me/${cleanWaNumber(whatsapp)}?text=${encodeURIComponent(`Bonjour Elite, je suis intéressé par la Villa ASTERIA — réf ${ref}. Pourriez-vous me communiquer la surface, les disponibilités et les conditions ?`)}`

/* Points of interest around ASTERIA. */
const POIS = [
  { icon: <ShoppingBag size={18} />, label: 'Garden City Mall', time: '5 min', x: 64, y: 22 },
  { icon: <GraduationCap size={18} />, label: 'Écoles internationales', time: '5 min', x: 26, y: 20 },
  { icon: <Stethoscope size={18} />, label: 'Cliniques privées', time: '8 min', x: 78, y: 52 },
  { icon: <TreePine size={18} />, label: 'Parc de Ben Aknoun', time: '10 min', x: 16, y: 62 },
  { icon: <Building2 size={18} />, label: 'Hydra, quartier d\'affaires', time: '10 min', x: 68, y: 72 },
  { icon: <Landmark size={18} />, label: 'Monument des Martyrs', time: '18 min', x: 14, y: 36 },
  { icon: <Plane size={18} />, label: 'Aéroport Int. Houari Boumediene', time: '25 min', x: 48, y: 88 },
]

/* Single spec row in the residence explorer. */
function Spec({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ color: TEAL, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.45)' }}>{label}</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: 'var(--text)', marginTop: 3, lineHeight: 1.35 }}>{value}</div>
      </div>
    </div>
  )
}

/* Bespoke radial "location" graphic */
function QuartierMap() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: 520, margin: '0 auto' }}>
      {[1, 0.68, 0.36].map((scale, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
          style={{
            position: 'absolute', top: '50%', left: '50%', width: `${scale * 100}%`, height: `${scale * 100}%`,
            transform: 'translate(-50%, -50%)', borderRadius: '50%',
            border: `1px solid rgba(43,189,176,${0.22 - i * 0.05})`,
          }}
        />
      ))}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: '60%', height: '60%', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: `radial-gradient(circle, ${TEAL}1a 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
        <span style={{ position: 'relative', width: 14, height: 14 }}>
          <motion.span animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: TEAL }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: TEAL, boxShadow: `0 0 16px ${TEAL}` }} />
        </span>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, letterSpacing: '0.2em', color: 'var(--text)', marginTop: 10, whiteSpace: 'nowrap' }}>ASTERIA</span>
      </div>
      {POIS.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.1 }}
          style={{ position: 'absolute', top: `${p.y}%`, left: `${p.x}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, zIndex: 2 }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, boxShadow: `0 0 10px ${GOLD}99` }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9.5, letterSpacing: '0.08em', color: 'rgba(var(--text-rgb),0.6)', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{p.time}</span>
        </motion.div>
      ))}
    </div>
  )
}

/* ── Type selector items ── */
const TYPE_ITEMS = [
  { id: 'f3', label: 'F3', sub: '103–110 m² · 3 Pièces', detail: '4 résidences' },
  { id: 'f4', label: 'F4', sub: '154–171 m² · 4 Pièces', detail: '2 résidences' },
  { id: 'villas', label: 'Villas', sub: 'Duplex · Piscine privée', detail: '4 villas' },
]

export default function Asteria() {
  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.18])
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '24%'])
  const heroTextY = useTransform(heroProgress, [0, 1], ['0%', '60%'])
  const heroOverlay = useTransform(heroProgress, [0, 1], [0.45, 0.85])

  const [plan, setPlan] = useState(0)
  const [planF4, setPlanF4] = useState(0)
  const [villa, setVilla] = useState(0)
  const [villaLevel, setVillaLevel] = useState(0)
  const [doc, setDoc] = useState<any>(null)
  const [activeType, setActiveType] = useState<string>('f3')

  useEffect(() => { fetchAsteria().then((d) => d && setDoc(d)) }, [])

  const settings = useSiteSettings()
  const whatsapp = settings?.whatsapp || FALLBACK_WHATSAPP

  const img = (i: any, w = 1800) => (i?.asset ? urlFor(i).width(w).url() : '')
  const heroEyebrow = doc?.heroEyebrow || 'Élite Promotion Immobilière présente'
  const heroTitle = doc?.heroTitle || 'ASTERIA'
  const heroSubtitle = doc?.heroSubtitle || 'Luxury Living'
  const heroImgSrc = img(doc?.heroImage, 2000) || '/images/asteria/building-hero.jpg'

  const introStats = doc?.stats?.length
    ? doc.stats.map((s: any) => ({ n: s.number, l: s.label }))
    : [
        { n: '12', l: 'Étages signature' },
        { n: 'F3·F4', l: 'Résidences 103–171 m²' },
        { n: '4', l: 'Villas avec piscine' },
        { n: '24/7', l: 'Conciergerie privée' },
      ]

  const ctaTitle = doc?.ctaTitle || ''
  const ctaLabel = doc?.ctaLabel || ''
  const ctaLink = doc?.ctaLink || '/#contact'

  /* Smooth scroll to a section, accounting for sticky header + type bar */
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 84 + 72 // header height + type selector bar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveType(id)
  }

  /* Highlight active type on scroll via IntersectionObserver */
  useEffect(() => {
    const sections = TYPE_ITEMS.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveType(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}
    >
      <Seo
        title="ASTERIA — Résidence de prestige à Alger"
        description="ASTERIA, la résidence signature d'Elite Promotion à Alger : balcons ondulants, cascades suspendues, piscines à débordement et finitions haut standing. F3 de 103 à 110 m²."
        path="/projets/asteria"
        image="/images/asteria/building-hero.jpg"
        jsonLd={[
          residenceLd({ name: 'ASTERIA', description: "Résidence de prestige à Alger signée Elite Promotion Immobilière.", image: '/images/asteria/building-hero.jpg', location: 'Alger', path: '/projets/asteria' }),
          breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Nos Projets', path: '/projets' }, { name: 'ASTERIA', path: '/projets/asteria' }]),
        ]}
      />
      <Header />

      {/* ── HERO ── */}
      <div ref={heroRef} className="force-dark" style={{ position: 'relative', height: '100dvh', overflow: 'hidden' }}>
        {isMobile ? (
          <img
            src={heroImgSrc}
            alt="ASTERIA Tour résidentielle de luxe"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <motion.img
            src={heroImgSrc}
            alt="ASTERIA Tour résidentielle de luxe"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }}
          />
        )}
        {!isMobile && <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: heroOverlay }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.5) 0%, transparent 30%, transparent 55%, rgba(6,6,6,0.95) 100%)' }} />

        <motion.div style={{
          position: 'absolute', inset: 0, ...(isMobile ? {} : { y: heroTextY }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
        }}>
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 0.7, letterSpacing: '0.42em' }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(10px, 1.3vw, 14px)', color: TEAL, textTransform: 'uppercase', marginBottom: 24 }}
          >
            {heroEyebrow}
          </motion.span>
          <h1 style={{
            position: 'relative', display: 'flex', justifyContent: 'center',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
            fontSize: 'clamp(64px, 16vw, 240px)', lineHeight: 0.92,
            letterSpacing: '0.04em', margin: 0, color: '#fff', textShadow: '0 8px 60px rgba(0,0,0,0.6)',
          }}>
            {heroTitle.split('').map((c: string, i: number) => (
              <span key={i} style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 0.92 }}>
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.07 }}
                  style={{ display: 'inline-block' }}
                >
                  {c}
                </motion.span>
              </span>
            ))}
            <span className="ast-hero-shine" aria-hidden="true" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 2vw, 22px)', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.85)', margin: '20px 0 0' }}
          >
            {heroSubtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          style={{ position: 'absolute', bottom: 34, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.5)' }}>Défiler</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${TEAL}, transparent)` }} />
        </motion.div>
      </div>

      {/* ── SIGNATURE FEATURES — kinetic band ── */}
      <div style={{ padding: 'clamp(24px, 4vw, 44px) 0', borderTop: '1px solid rgba(var(--line-rgb),0.06)', borderBottom: '1px solid rgba(var(--line-rgb),0.06)' }}>
        <Marquee
          items={['Cascades suspendues', 'Piscines à débordement', 'Plafonds étoilés', 'Terrasses privatives', 'Conciergerie 24/7', 'Façade ondulante']}
          speed={44}
          color="rgba(var(--text-rgb),0.7)"
        />
      </div>

      {/* ── TYPE SELECTOR — sticky bar ── */}
      <div
        style={{
          position: 'sticky', top: 83, zIndex: 90,
          background: 'rgba(var(--header-rgb),0.96)',
          backdropFilter: 'blur(20px) saturate(140%)',
          borderBottom: '1px solid rgba(var(--line-rgb),0.08)',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {TYPE_ITEMS.map((item) => {
            const active = activeType === item.id
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  padding: 'clamp(14px,2vw,22px) 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${active ? TEAL : 'transparent'}`,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'border-color 0.3s ease',
                }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(16px, 2vw, 24px)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  color: active ? TEAL : 'var(--text)',
                  transition: 'color 0.3s ease',
                }}>
                  {item.label}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(var(--text-rgb),0.4)',
                  marginTop: 4,
                }}>
                  {item.sub}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── F3 FLOOR PLANS ── */}
      <section id="f3" style={{ padding: 'clamp(60px, 10vw, 140px) clamp(24px, 5vw, 64px)', background: 'var(--bg-2)', borderBottom: '1px solid rgba(var(--line-rgb),0.04)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
              <Eyebrow color={GOLD}>Les Résidences F3</Eyebrow>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: 0 }}>
                Choisissez votre F3
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 'clamp(36px, 4vw, 56px)' }}>
              {PLANS.map((p, i) => (
                <button
                  key={p.ref}
                  onClick={() => setPlan(i)}
                  style={{
                    padding: '12px 24px', cursor: 'pointer', textAlign: 'left',
                    background: plan === i ? GOLD : 'transparent',
                    border: `1px solid ${plan === i ? GOLD : 'rgba(var(--line-rgb),0.15)'}`,
                    color: plan === i ? 'var(--bg)' : 'rgba(var(--text-rgb),0.7)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", borderRadius: 2, transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>{p.ref}</span>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em', marginTop: 2 }}>{p.surface} m²</span>
                </button>
              ))}
            </div>

            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center', maxWidth: 1180, margin: '0 auto' }}
              className="ast-residences"
            >
              <div style={{ padding: 'clamp(16px, 3vw, 40px)', background: '#fff', borderRadius: 4 }}>
                <img src={PLANS[plan].img} alt={`Plan ${PLANS[plan].ref} — F3 ${PLANS[plan].surface} m²`} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>Résidence {PLANS[plan].ref}</span>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1, margin: '10px 0 4px' }}>
                  {PLANS[plan].surface} <span style={{ fontSize: '0.45em', fontWeight: 400, color: 'rgba(var(--text-rgb),0.6)' }}>m²</span>
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(var(--text-rgb),0.55)', letterSpacing: '0.04em' }}>{PLANS[plan].pieces} · {PLANS[plan].exposition}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', margin: 'clamp(26px, 3vw, 36px) 0', paddingTop: 'clamp(22px, 3vw, 30px)', borderTop: '1px solid rgba(var(--line-rgb),0.08)' }}>
                  <Spec icon={<Maximize size={17} />} label="Surface habitable" value={`${PLANS[plan].surface} m²`} />
                  <Spec icon={<BedDouble size={17} />} label="Chambres" value={String(PLANS[plan].chambres)} />
                  <Spec icon={<Bath size={17} />} label="Salles de bain" value={String(PLANS[plan].sdb)} />
                  <Spec icon={<Sun size={17} />} label="Terrasse privative" value={PLANS[plan].terrasse} />
                  <Spec icon={<Building2 size={17} />} label="Étage" value={PLANS[plan].etage} />
                  <Spec icon={<Compass size={17} />} label="Orientation" value={PLANS[plan].orientation} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.45)' }}>Prix</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: 'var(--text)' }}>Sur demande</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <a
                    href={waResidence(whatsapp, PLANS[plan].ref, PLANS[plan].surface)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 26px', background: TEAL, color: '#04211e', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3, boxShadow: `0 8px 26px ${TEAL}33`, transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 34px ${TEAL}55` }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 26px ${TEAL}33` }}
                  >
                    <MessageCircle size={17} /> Demander cette résidence
                  </a>
                  <Link
                    to="/contact"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', border: '1px solid rgba(var(--line-rgb),0.18)', color: 'rgba(var(--text-rgb),0.85)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3, transition: 'border-color 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.18)' }}
                  >
                    Visite privée
                  </Link>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── F4 SECTION ── */}
      <section id="f4" style={{ padding: 'clamp(60px, 10vw, 140px) clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(var(--line-rgb),0.04)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center', marginBottom: 'clamp(60px, 8vw, 100px)' }} className="ast-split">
            <Reveal>
              <ParallaxImage src="/images/asteria/balcony-f4.png" alt="Terrasse F4 avec vue panoramique" aspect="4/3" />
            </Reveal>
            <Reveal delay={0.15}>
              <Eyebrow>F4 · 4 Pièces</Eyebrow>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 28px' }}>
                Des espaces<br /><span style={{ color: TEAL }}>amplifiés</span>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(var(--text-rgb),0.65)', maxWidth: 480 }}>
                Les résidences F4 d'ASTERIA offrent un espace de vie exceptionnel de 154 à 171 m².
                Trois chambres généreuses, double séjour et vaste terrasse panoramique font de ces
                appartements une référence absolue du luxe résidentiel algérois.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 48px)' }}>
              <Eyebrow color={TEAL}>Les Résidences F4</Eyebrow>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 4vw, 52px)', fontWeight: 400, margin: 0 }}>
                Choisissez votre F4
              </h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 'clamp(36px, 4vw, 56px)' }}>
              {PLANS_F4.map((p, i) => (
                <button
                  key={p.ref}
                  onClick={() => setPlanF4(i)}
                  style={{
                    padding: '12px 24px', cursor: 'pointer', textAlign: 'left',
                    background: planF4 === i ? TEAL : 'transparent',
                    border: `1px solid ${planF4 === i ? TEAL : 'rgba(var(--line-rgb),0.15)'}`,
                    color: planF4 === i ? 'var(--bg)' : 'rgba(var(--text-rgb),0.7)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", borderRadius: 2, transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>{p.ref}</span>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, letterSpacing: '0.02em', marginTop: 2 }}>{p.surface} m²</span>
                </button>
              ))}
            </div>
            <motion.div
              key={`f4-${planF4}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center', maxWidth: 1180, margin: '0 auto' }}
              className="ast-residences"
            >
              <div style={{ padding: 'clamp(16px, 3vw, 40px)', background: '#fff', borderRadius: 4 }}>
                <img src={PLANS_F4[planF4].img} alt={`Plan ${PLANS_F4[planF4].ref} — ${PLANS_F4[planF4].surface} m²`} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>Résidence {PLANS_F4[planF4].ref}</span>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1, margin: '10px 0 4px' }}>
                  {PLANS_F4[planF4].surface} <span style={{ fontSize: '0.45em', fontWeight: 400, color: 'rgba(var(--text-rgb),0.6)' }}>m²</span>
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(var(--text-rgb),0.55)', letterSpacing: '0.04em' }}>{PLANS_F4[planF4].pieces} · {PLANS_F4[planF4].exposition}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', margin: 'clamp(26px, 3vw, 36px) 0', paddingTop: 'clamp(22px, 3vw, 30px)', borderTop: '1px solid rgba(var(--line-rgb),0.08)' }}>
                  <Spec icon={<Maximize size={17} />} label="Surface habitable" value={`${PLANS_F4[planF4].surface} m²`} />
                  <Spec icon={<BedDouble size={17} />} label="Chambres" value={String(PLANS_F4[planF4].chambres)} />
                  <Spec icon={<Bath size={17} />} label="Salles de bain" value={String(PLANS_F4[planF4].sdb)} />
                  <Spec icon={<Sun size={17} />} label="Terrasse privative" value={PLANS_F4[planF4].terrasse} />
                  <Spec icon={<Building2 size={17} />} label="Étage" value={PLANS_F4[planF4].etage} />
                  <Spec icon={<Compass size={17} />} label="Orientation" value={PLANS_F4[planF4].orientation} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.45)' }}>Prix</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: 'var(--text)' }}>Sur demande</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <a
                    href={waResidenceF4(whatsapp, PLANS_F4[planF4].ref, PLANS_F4[planF4].surface)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 26px', background: TEAL, color: '#04211e', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3, boxShadow: `0 8px 26px ${TEAL}33`, transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 34px ${TEAL}55` }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 26px ${TEAL}33` }}
                  >
                    <MessageCircle size={17} /> Demander cette résidence
                  </a>
                  <Link
                    to="/contact"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', border: '1px solid rgba(var(--line-rgb),0.18)', color: 'rgba(var(--text-rgb),0.85)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3, transition: 'border-color 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.18)' }}
                  >
                    Visite privée
                  </Link>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── VILLAS ── */}
      <section id="villas" style={{ background: 'var(--bg-2)', borderTop: '1px solid rgba(var(--line-rgb),0.04)', borderBottom: '1px solid rgba(var(--line-rgb),0.04)' }}>

        {/* Hero intro: exterior render + text */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520 }} className="ast-split">
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <img
              src="/images/asteria/villa-exterior.png"
              alt="Les Villas ASTERIA, piscines privées aux niveaux 8 et 9"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, var(--bg-2))' }} />
          </div>
          <Reveal>
            <div style={{ padding: 'clamp(48px, 7vw, 100px) clamp(28px, 5vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Eyebrow color={TEAL}>Exclusivité Totale</Eyebrow>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 24px' }}>
                Les Villas<br /><span style={{ color: TEAL }}>ASTERIA</span>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(var(--text-rgb),0.65)', maxWidth: 460, margin: '0 0 32px' }}>
                Quatre villas d'exception aux niveaux 8 et 9 d'ASTERIA. Chacune s'étend sur deux niveaux
                avec un toit-terrasse privatif, piscine à débordement, home cinéma et entrée indépendante.
              </p>
              <div style={{ display: 'flex', gap: 32 }}>
                {[['4', 'Villas'], ['3', 'Niveaux'], ['4+', 'Chambres']].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: TEAL, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.5)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Villa selector + level plans */}
        <div style={{ padding: 'clamp(48px, 7vw, 96px) clamp(24px, 5vw, 64px)', maxWidth: 1300, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(36px, 4vw, 52px)' }}>
              {VILLAS_PLANS.map((v, i) => (
                <button
                  key={v.ref}
                  onClick={() => { setVilla(i); setVillaLevel(0) }}
                  style={{
                    padding: '12px 26px', cursor: 'pointer', textAlign: 'center',
                    background: villa === i ? TEAL : 'transparent',
                    border: `1px solid ${villa === i ? TEAL : 'rgba(var(--line-rgb),0.15)'}`,
                    color: villa === i ? '#04211e' : 'rgba(var(--text-rgb),0.7)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", borderRadius: 2, transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.75 }}>{v.ref}</span>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v.pieces}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 'clamp(28px, 3vw, 40px)', borderBottom: '1px solid rgba(var(--line-rgb),0.1)' }}>
              {VILLAS_PLANS[villa].levels.map((lv, li) => (
                <button
                  key={lv.label}
                  onClick={() => setVillaLevel(li)}
                  style={{
                    padding: '12px 28px', cursor: 'pointer', background: 'transparent', border: 'none',
                    borderBottom: `2px solid ${villaLevel === li ? TEAL : 'transparent'}`,
                    color: villaLevel === li ? TEAL : 'rgba(var(--text-rgb),0.5)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontWeight: villaLevel === li ? 600 : 400,
                    transition: 'all 0.25s ease', marginBottom: -1,
                  }}
                >
                  {lv.label}
                </button>
              ))}
            </div>

            <motion.div
              key={`villa-${villa}-${villaLevel}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'clamp(28px, 4vw, 64px)', alignItems: 'center', maxWidth: 1180, margin: '0 auto' }}
              className="ast-residences"
            >
              <div style={{ padding: 'clamp(16px, 3vw, 36px)', background: '#fff', borderRadius: 4, boxShadow: '0 4px 32px rgba(0,0,0,0.08)' }}>
                <img
                  src={VILLAS_PLANS[villa].levels[villaLevel].img}
                  alt={`${VILLAS_PLANS[villa].ref} · ${VILLAS_PLANS[villa].levels[villaLevel].label}`}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>
                  Villa {VILLAS_PLANS[villa].ref} · {VILLAS_PLANS[villa].levels[villaLevel].label}
                </span>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.1, margin: '10px 0 6px' }}>
                  {VILLAS_PLANS[villa].pieces}
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(var(--text-rgb),0.5)', fontStyle: 'italic' }}>
                  {VILLAS_PLANS[villa].levels[villaLevel].sub}
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', margin: 'clamp(22px, 3vw, 32px) 0', paddingTop: 'clamp(20px, 2.5vw, 28px)', borderTop: '1px solid rgba(var(--line-rgb),0.08)' }}>
                  <Spec icon={<BedDouble size={17} />} label="Chambres" value={String(VILLAS_PLANS[villa].chambres)} />
                  <Spec icon={<Bath size={17} />} label="Salles de bain" value={String(VILLAS_PLANS[villa].sdb)} />
                  <Spec icon={<Waves size={17} />} label="Piscine privée" value={VILLAS_PLANS[villa].piscine} />
                  <Spec icon={<Sun size={17} />} label="Exposition" value={VILLAS_PLANS[villa].exposition} />
                  <Spec icon={<Building2 size={17} />} label="Niveaux" value="8 · 9 · Terrasse" />
                  <Spec icon={<Maximize size={17} />} label="Surface et prix" value="Sur demande" />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <a
                    href={waVilla(whatsapp, VILLAS_PLANS[villa].ref)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 26px', background: TEAL, color: '#04211e', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3, boxShadow: `0 8px 26px ${TEAL}33`, transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 34px ${TEAL}55` }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 26px ${TEAL}33` }}
                  >
                    <MessageCircle size={17} /> Demander cette villa
                  </a>
                  <Link
                    to="/contact"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', border: '1px solid rgba(var(--line-rgb),0.18)', color: 'rgba(var(--text-rgb),0.85)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 3, transition: 'border-color 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = TEAL }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(var(--line-rgb),0.18)' }}
                  >
                    Visite privée
                  </Link>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── ARCHITECTURE FEATURE ── */}
      <section style={{ padding: 'clamp(40px, 8vw, 100px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="ast-split">
          <Reveal>
            <Eyebrow>L'Architecture</Eyebrow>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 28px', letterSpacing: '-0.01em' }}>
              Des courbes<br /><span style={{ color: TEAL }}>vivantes</span>
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(var(--text-rgb),0.65)', maxWidth: 480 }}>
              La façade d'ASTERIA défie la ligne droite. Ses balcons ondulants, baignés de
              lumière dorée, encadrent des cascades suspendues et des bassins infinis. Une
              prouesse d'ingénierie où l'eau, le verre et la végétation composent un paysage
              vertical inédit en Algérie.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ParallaxImage src="/images/asteria/building-front.jpg" alt="Façade ondulante d'ASTERIA" aspect="3/4" />
          </Reveal>
        </div>
      </section>

      {/* ── ESPACES COMMUNS ── */}
      <section style={{ padding: 'clamp(40px, 8vw, 100px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
              <Eyebrow color={TEAL}>Espaces Communs</Eyebrow>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: 0 }}>
                Un art de recevoir
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ParallaxImage src="/images/asteria/common-pool.jpg" alt="Piscine intérieure sous plafond étoilé" aspect="16/9" range={8} />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 2.5vw, 32px)', marginTop: 'clamp(16px, 2.5vw, 32px)' }} className="ast-gallery">
            <Reveal>
              <ParallaxImage src="/images/asteria/common-1.jpg" alt="Hall de réception" aspect="4/3" range={10} />
            </Reveal>
            <Reveal delay={0.12}>
              <ParallaxImage src="/images/asteria/common-2.jpg" alt="Lounge résidents" aspect="4/3" range={10} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── LE QUARTIER ── */}
      <section style={{ position: 'relative', padding: 'clamp(70px, 11vw, 150px) clamp(24px, 5vw, 64px)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '45%', height: '60%', background: `radial-gradient(ellipse, ${TEAL}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <div style={{ width: 38, height: 1, background: TEAL }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Le Quartier</span>
                <div style={{ width: 38, height: 1, background: TEAL }} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: '0 auto', maxWidth: 820, lineHeight: 1.12 }}>
                Une adresse au cœur<br /><span style={{ color: GOLD }}>de tout</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 100px)', alignItems: 'center' }} className="ast-quartier">
            <Reveal>
              <QuartierMap />
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(var(--text-rgb),0.65)', margin: '0 0 36px', maxWidth: 480 }}>
                  Située au cœur d'El Achour, ASTERIA vous place au centre d'un quartier où tout est à
                  portée de quelques minutes. Établissements scolaires, commerces, cliniques, restaurants
                  et principaux axes de la capitale composent un cadre de vie aussi pratique que privilégié.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(var(--line-rgb),0.07)', border: '1px solid rgba(var(--line-rgb),0.07)', borderRadius: 6, overflow: 'hidden' }} className="ast-poi-grid">
                  {POIS.map((p, i) => (
                    <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(16px, 1.6vw, 22px)', background: 'var(--bg)', gridColumn: i === POIS.length - 1 && POIS.length % 2 !== 0 ? '1 / -1' : undefined }}>
                      <span style={{ color: TEAL, flexShrink: 0 }}>{p.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: 'var(--text)', lineHeight: 1.3 }}>{p.label}</div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD, marginTop: 3 }}>{p.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="force-dark" style={{ position: 'relative', height: '70vh', minHeight: 460, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/asteria/building-detail.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.7)' }} />
        <Reveal>
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(34px, 6vw, 84px)', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.05 }}>
              {ctaTitle || 'Vivez ASTERIA'}
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.2vw, 18px)', color: 'rgba(var(--text-rgb),0.7)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Les résidences sont disponibles sur rendez vous privé. Notre équipe vous accueille
              pour une visite exclusive.
            </p>
            <MagneticCTA label={ctaLabel || 'Réserver une visite privée'} to={ctaLink} variant="solid" />
          </div>
        </Reveal>
      </section>

      <SiteFooter />

      <style>{`
        @keyframes astHeroShine {
          0% { transform: translateX(-160%) skewX(-16deg); }
          55%, 100% { transform: translateX(320%) skewX(-16deg); }
        }
        .ast-hero-shine {
          position: absolute; top: 0; left: 0; width: 34%; height: 100%; pointer-events: none;
          background: linear-gradient(100deg, transparent, rgba(var(--line-rgb),0.5) 50%, transparent);
          animation: astHeroShine 4s ease-in-out 1.8s infinite;
        }
        @media (max-width: 860px) {
          .ast-split { grid-template-columns: 1fr !important; }
          .ast-gallery { grid-template-columns: 1fr !important; }
          .ast-gallery figure { margin-top: 0 !important; }
          .ast-quartier { grid-template-columns: 1fr !important; }
          .ast-residences { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 460px) {
          .ast-poi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}
