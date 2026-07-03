import { useRef, useState, useEffect, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShieldCheck, Gem, Handshake, Compass } from 'lucide-react'
import { Reveal, Eyebrow, ParallaxImage, StatMarquee, BezelCard, MagneticCTA, WordReveal, Marquee, TEAL, GOLD, EASE, useIsMobile } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { Seo, breadcrumbLd } from '@/lib/seo'
import { fetchApropos } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

const VALUE_ICONS: Record<string, ReactNode> = {
  gem: <Gem size={26} />,
  compass: <Compass size={26} />,
  shield: <ShieldCheck size={26} />,
  handshake: <Handshake size={26} />,
}

const FALLBACK_VALUES = [
  { icon: 'gem', title: 'Excellence', text: 'Des finitions et matériaux sélectionnés sans compromis, du gros œuvre à la dernière poignée de porte.' },
  { icon: 'compass', title: 'Recherche et développement', text: "L'excellence n'est jamais le fruit du hasard. Elle est le résultat d'une vision, d'une exigence et d'une quête permanente de perfection." },
  { icon: 'shield', title: 'Confiance', text: 'Des délais respectés et une transparence totale, de la réservation à la remise des clés.' },
  { icon: 'handshake', title: 'Accompagnement', text: 'Un conseiller dédié à chaque étape de votre projet, pour une expérience sereine et privée.' },
]

const FALLBACK_STATS = [
  { n: '10+', l: "Années d'expertise" },
  { n: '100%', l: 'Projets livrés' },
  { n: '5.7K', l: 'Communauté' },
  { n: '24/7', l: 'Accompagnement' },
]

const FALLBACK_KEYWORDS = ['Excellence', 'Vision', 'Confiance', 'Prestige', 'Architecture', 'Art de vivre', 'Sur-mesure']

const FALLBACK_PHILOSOPHY = [
  {
    index: '02',
    eyebrow: 'Notre Signature',
    title1: "L'eau, la lumière,",
    title2: 'le vivant',
    text: "Chez Elite, l'architecture ne s'arrête pas à la structure. Cascades suspendues, bassins à débordement et voûtes étoilées transforment chaque résidence en un paysage sensoriel, une expérience qui se vit autant qu'elle se regarde.",
    img: '/images/asteria/common-2.jpg',
    reverse: false,
  },
  {
    index: '03',
    eyebrow: "L'Exigence",
    title1: 'Le détail comme',
    title2: 'obsession',
    text: "Une adresse d'exception se reconnaît à ce qui ne se voit pas au premier regard : la justesse d'une jonction, la noblesse d'un matériau, la lumière pensée pièce par pièce. Rien n'est laissé au hasard, du premier plan à la remise des clés.",
    img: '/images/asteria/bathroom-1.jpg',
    reverse: true,
  },
]

const FALLBACK_HERO_WORDS = ['Elite', 'Promotion']
const FALLBACK_HERO_SUB = 'Immobilière'
const FALLBACK_HERO_EYEBROW = 'À Propos'
const FALLBACK_HERO_IMG = '/images/asteria/building-hero.jpg'
const FALLBACK_STORY = 'Nous ne construisons pas seulement des résidences. Nous façonnons des adresses qui reflètent la réussite de ceux qui les habitent.'
const FALLBACK_MISSION = {
  eyebrow: 'Notre Mission', title1: "Redéfinir l'art", title2: 'de vivre', img: '/images/asteria/common-1.jpg',
  paras: [
    "Elite Promotion Immobilière est née d'une conviction : l'Algérie mérite un standing à la hauteur des plus grandes capitales. De la conception architecturale à la livraison clé en main, chaque détail est pensé pour l'exception.",
    "Avec ASTERIA, nous signons une première : une résidence où l'eau, la lumière et la végétation composent un paysage vertical inédit.",
  ],
}
const FALLBACK_QUOTE = 'Nous ne livrons pas des appartements. Nous remettons des clés de vie, une promesse tenue, pierre après pierre.'
const FALLBACK_CTA = { title: 'Découvrez nos projets', label: 'Explorer nos résidences', link: '/projets', img: '/images/asteria/balcony-1.jpg' }

export default function APropos() {
  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const [ap, setAp] = useState<any>(null)
  useEffect(() => { fetchApropos().then((d) => d && setAp(d)) }, [])

  const img = (img: any, w = 1200) => (img?.asset ? urlFor(img).width(w).url() : '')
  const heroImg = img(ap?.heroImage, 2000) || FALLBACK_HERO_IMG
  const heroEyebrow = ap?.heroEyebrow || FALLBACK_HERO_EYEBROW
  const heroWords: string[] = (ap?.heroTitle?.length ? ap.heroTitle : FALLBACK_HERO_WORDS) as string[]
  const heroSub = ap?.heroSubtitle || FALLBACK_HERO_SUB
  const keywords: string[] = ap?.marqueeKeywords?.length ? ap.marqueeKeywords : FALLBACK_KEYWORDS
  const storyText = ap?.storyText || FALLBACK_STORY

  const mission = {
    index: ap?.missionIndex || '01',
    eyebrow: ap?.missionEyebrow || FALLBACK_MISSION.eyebrow,
    title1: ap?.missionTitle1 || FALLBACK_MISSION.title1,
    title2: ap?.missionTitle2 || FALLBACK_MISSION.title2,
    img: img(ap?.missionImage, 1200) || FALLBACK_MISSION.img,
    paras: ap?.missionParagraphs?.length ? ap.missionParagraphs : FALLBACK_MISSION.paras,
  }
  const philosophy = ap?.philosophy?.length
    ? ap.philosophy.map((b: any) => ({ ...b, img: img(b.image, 1200) }))
    : FALLBACK_PHILOSOPHY

  const valuesEyebrow = ap?.valuesEyebrow || 'Nos Valeurs'
  const valuesTitle = ap?.valuesTitle || 'Ce qui nous distingue'
  const values = ap?.values?.length ? ap.values : FALLBACK_VALUES

  const founderQuote = ap?.founderQuote || FALLBACK_QUOTE
  const founderAccent = ap?.founderQuoteAccent || ''
  const founderName = ap?.founderName || 'La Direction'
  const founderOrg = ap?.founderOrg || 'Elite Promotion Immobilière'

  const stats = ap?.stats?.length ? ap.stats.map((s: any) => ({ n: s.number, l: s.label })) : FALLBACK_STATS

  const ctaTitle = ap?.ctaTitle || FALLBACK_CTA.title
  const ctaLabel = ap?.ctaLabel || FALLBACK_CTA.label
  const ctaLink = ap?.ctaLink || FALLBACK_CTA.link
  const ctaImg = img(ap?.ctaImage, 1800) || FALLBACK_CTA.img

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}
    >
      <Seo
        title="À Propos"
        description="Elite Promotion Immobilière façonne le paysage immobilier algérien : architecture d'exception, finitions haut standing et accompagnement sur-mesure, de la conception à la remise des clés."
        path="/a-propos"
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'À Propos', path: '/a-propos' }])}
      />
      <Header />

      {/* ── HERO ── */}
      <div ref={heroRef} className="force-dark" style={{ position: 'relative', height: '88dvh', minHeight: 540, overflow: 'hidden' }}>
        {isMobile ? (
          <img src={heroImg} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <motion.img src={heroImg} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.4) 45%, rgba(6,6,6,0.96) 100%)' }} />

        <motion.div style={{ position: 'absolute', inset: 0, ...(isMobile ? {} : { y: heroTextY, opacity: heroFade }), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <motion.span initial={{ opacity: 0, letterSpacing: '0.5em' }} animate={{ opacity: 0.8, letterSpacing: '0.34em' }} transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.6vw, 18px)', color: TEAL, textTransform: 'uppercase', marginBottom: 20 }}>
            {heroEyebrow}
          </motion.span>

          {/* H1 — word-by-word mask rise (narrower scale for a gentler jump) */}
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 6.6vw, 90px)', lineHeight: 1.0, margin: 0, color: '#fff', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.22em' }}>
            {heroWords.map((w: string, i: number) => (
              <span key={w + i} style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 1 }}>
                <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE, delay: 0.45 + i * 0.12 }} style={{ display: 'inline-block' }}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ duration: 1.2, delay: 1 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.7vw, 20px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.8)', margin: '18px 0 0' }}>
            {heroSub}
          </motion.p>
        </motion.div>

        {/* scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
          style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.5)' }}>Découvrir</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 1, height: 30, background: `linear-gradient(to bottom, ${TEAL}, transparent)` }} />
        </motion.div>
      </div>

      {/* ── KEYWORD MARQUEE ── */}
      <div style={{ padding: 'clamp(28px, 4vw, 48px) 0', borderBottom: '1px solid rgba(var(--line-rgb),0.05)' }}>
        <Marquee items={keywords} speed={42} color="rgba(var(--text-rgb),0.85)" />
      </div>

      {/* ── STORY — word-by-word reveal ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(80px, 13vw, 170px) clamp(24px, 5vw, 64px)', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3.6vw, 46px)', lineHeight: 1.45, color: 'var(--text)', margin: 0, fontWeight: 400 }}>
          <WordReveal segments={[{ t: storyText }]} />
        </p>
      </section>

      {/* ── 01 · MISSION split ── */}
      <section style={{ padding: 'clamp(20px, 5vw, 60px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="ap-split">
          <Reveal>
            <ParallaxImage src={mission.img} alt="Espaces signés Elite Promotion" aspect="4/5" />
          </Reveal>
          <Reveal delay={0.15}>
            <Eyebrow>{mission.eyebrow}</Eyebrow>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4.2vw, 56px)', fontWeight: 400, lineHeight: 1.12, margin: '0 0 26px' }}>
              {mission.title1}<br /><span style={{ color: TEAL }}>{mission.title2}</span>
            </h2>
            {mission.paras.map((p: string, i: number) => (
              <p key={i} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: i === 0 ? 'rgba(var(--text-rgb),0.65)' : 'rgba(var(--text-rgb),0.5)', marginBottom: i === 0 ? 20 : 0, maxWidth: 480 }}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 02 / 03 · PHILOSOPHY zig-zag ── */}
      {philosophy.map((b: any, idx: number) => {
        const imgEl = (
          <Reveal key="img">
            <ParallaxImage src={b.img || FALLBACK_PHILOSOPHY[0].img} alt={b.title1 || 'Philosophie Elite'} aspect="4/5" range={16} />
          </Reveal>
        )
        const txtEl = (
          <Reveal key="txt" delay={0.15}>
            <Eyebrow>{b.eyebrow}</Eyebrow>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px, 4.2vw, 56px)', fontWeight: 400, lineHeight: 1.12, margin: '0 0 26px' }}>
              {b.title1}<br /><span style={{ color: TEAL }}>{b.title2}</span>
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.85, color: 'rgba(var(--text-rgb),0.6)', maxWidth: 480 }}>
              {b.text}
            </p>
          </Reveal>
        )
        return (
          <section key={(b.index || idx) + ''} style={{ padding: 'clamp(48px, 8vw, 110px) clamp(24px, 5vw, 64px)' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 90px)', alignItems: 'center' }} className="ap-split">
              {b.reverse ? [txtEl, imgEl] : [imgEl, txtEl]}
            </div>
          </section>
        )
      })}

      {/* ── 04 · VALUES ── */}
      <section style={{ padding: 'clamp(70px, 11vw, 150px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vw, 80px)' }}>
              <Eyebrow color={TEAL}>{valuesEyebrow}</Eyebrow>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, margin: 0 }}>{valuesTitle}</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(16px, 2vw, 28px)' }}>
            {values.map((v: any, i: number) => (
              <Reveal key={v.title + i} delay={i * 0.1}>
                <BezelCard>
                  <div style={{ color: TEAL, marginBottom: 22 }}>{VALUE_ICONS[v.icon] || VALUE_ICONS.gem}</div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 400, margin: '0 0 14px', color: 'var(--text)' }}>{v.title}</h3>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, lineHeight: 1.75, color: 'rgba(var(--text-rgb),0.55)', margin: 0 }}>{v.text}</p>
                </BezelCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER QUOTE ── */}
      <section style={{ position: 'relative', padding: 'clamp(80px, 13vw, 180px) clamp(24px, 5vw, 64px)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '120%', background: `radial-gradient(ellipse, ${TEAL}0c 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 0.5, color: TEAL, opacity: 0.25, marginBottom: 10 }}>“</div>
          </Reveal>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(24px, 4vw, 52px)', lineHeight: 1.4, color: 'var(--text)', margin: 0, fontWeight: 400 }}>
              <WordReveal segments={accentSegments(founderQuote, founderAccent)} />
            </p>
          </blockquote>
          <Reveal delay={0.2}>
            <div style={{ marginTop: 'clamp(32px, 4vw, 48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 8 }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.4vw, 16px)', letterSpacing: '0.1em', color: 'var(--text)' }}>{founderName}</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.45)' }}>{founderOrg}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS band — moving marquee ── */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid rgba(var(--line-rgb),0.04)', borderBottom: '1px solid rgba(var(--line-rgb),0.04)', padding: 'clamp(56px, 8vw, 100px) 0' }}>
        <StatMarquee items={stats} speed={38} />
      </section>

      {/* ── CTA ── */}
      <section className="force-dark" style={{ position: 'relative', height: '64dvh', minHeight: 440, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={ctaImg} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.68)' }} />
        <Reveal>
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5.5vw, 72px)', fontWeight: 700, margin: '0 0 28px', lineHeight: 1.05 }}>
              {ctaTitle}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MagneticCTA label={ctaLabel} to={ctaLink} variant="solid" />
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />

      <style>{`
        @media (max-width: 860px){
          .ap-split{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}

/* Split a quote around the accented phrase so the editor can highlight key words in CMS. */
function accentSegments(quote: string, accent: string) {
  if (!accent || !quote.includes(accent)) return [{ t: quote }]
  const idx = quote.indexOf(accent)
  const before = quote.slice(0, idx)
  const after = quote.slice(idx + accent.length)
  return [before && { t: before }, { t: accent, accent: true }, after && { t: after }].filter(Boolean) as { t: string; accent?: boolean }[]
}

/* Section index marker — e.g. "01 ——" */
function SectionIndex({ n, centered = false }: { n: string; centered?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, justifyContent: centered ? 'center' : 'flex-start' }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontVariantNumeric: 'tabular-nums', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', color: GOLD }}>{n}</span>
      <span style={{ width: 'clamp(24px, 3vw, 44px)', height: 1, background: 'rgba(212,175,55,0.4)' }} />
    </div>
  )
}
