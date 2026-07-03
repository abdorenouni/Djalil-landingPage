import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { Reveal, TEAL, EASE } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { ARTICLES, featuredArticle, formatDate, type Article } from '@/data/journal'
import { fetchArticles } from '@/lib/queries'
import { Seo, breadcrumbLd } from '@/lib/seo'

const CATEGORIES = ['Tous', 'ASTERIA', 'Architecture', 'Art de vivre', 'Marché'] as const

export default function Journal() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Tous')
  const [articles, setArticles] = useState<Article[]>(ARTICLES)
  useEffect(() => { fetchArticles().then((a) => a?.length && setArticles(a)) }, [])

  const featured = articles.find((a) => a.featured) || articles[0] || featuredArticle()
  const rest = articles.filter((a) => a.slug !== featured.slug)
  const visible = rest.filter((a) => cat === 'Tous' || a.category === cat)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', overflowX: 'hidden' }}
    >
      <Seo
        title="Le Journal"
        description="Regards et récits sur l'architecture, l'art de vivre et le marché du haut de gamme en Algérie, par Elite Promotion Immobilière."
        path="/journal"
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Le Journal', path: '/journal' }])}
      />
      <Header />

      {/* ── HEADER ── */}
      <section style={{ padding: 'clamp(120px, 15vw, 190px) clamp(24px, 5vw, 80px) clamp(30px, 4vw, 50px)', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 38, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Le Journal</span>
            <div style={{ width: 38, height: 1, background: TEAL }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(40px, 8vw, 104px)', fontWeight: 700, margin: 0, lineHeight: 1 }}>
            Regards · Récits
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(15px, 2vw, 20px)', color: 'rgba(var(--text-rgb),0.55)', margin: '22px auto 0', maxWidth: 560, lineHeight: 1.6 }}>
            L'architecture, l'art de vivre et le marché du haut de gamme, vus par Elite Promotion.
          </p>
        </motion.div>
      </section>

      {/* ── FEATURED ── */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(48px, 6vw, 80px)' }}>
        <Reveal>
          <Link to={`/journal/${featured.slug}`} className="jrn-feat force-dark" style={{ display: 'block', position: 'relative', maxWidth: 1300, margin: '0 auto', aspectRatio: '21/9', overflow: 'hidden', borderRadius: 5, textDecoration: 'none' }}>
            <img src={featured.cover} alt={featured.title} className="jrn-feat-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.25) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(28px, 4vw, 56px)' }}>
              <Meta article={featured} />
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 400, color: 'var(--text)', margin: '14px 0 12px', lineHeight: 1.12, maxWidth: 760 }}>
                {featured.title}
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.3vw, 17px)', lineHeight: 1.7, color: 'rgba(var(--text-rgb),0.7)', margin: 0, maxWidth: 620 }}>
                {featured.excerpt}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 22, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>
                Lire l'article <Arrow />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* ── FILTERS ── */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, padding: '0 clamp(24px, 5vw, 80px) clamp(40px, 5vw, 60px)' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: '10px 22px', cursor: 'pointer',
              background: cat === c ? TEAL : 'transparent',
              border: `1px solid ${cat === c ? TEAL : 'rgba(var(--line-rgb),0.15)'}`,
              color: cat === c ? 'var(--bg)' : 'rgba(var(--text-rgb),0.7)',
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: '0.08em',
              textTransform: 'uppercase', borderRadius: 2, transition: 'all 0.3s ease',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: '0 clamp(24px, 5vw, 80px) clamp(80px, 12vw, 150px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'clamp(20px, 2.5vw, 36px)' }}>
          <AnimatePresence mode="popLayout">
            {visible.map((a, i) => (
              <motion.div key={a.slug} layout initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.55, ease: EASE, delay: i * 0.05 }}>
                <Card article={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {visible.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(var(--text-rgb),0.4)', padding: '40px 0' }}>Aucun article dans cette catégorie pour le moment.</p>
        )}
      </section>

      <SiteFooter />

      <style>{`.jrn-feat:hover .jrn-feat-img{ transform: scale(1.05); }`}</style>
    </motion.div>
  )
}

function Card({ article }: { article: Article }) {
  return (
    <Link to={`/journal/${article.slug}`} className="jrn-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 4 }}>
        <img src={article.cover} alt={article.title} loading="lazy" decoding="async" className="jrn-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.55), transparent 60%)', pointerEvents: 'none' }} />
      </div>
      <div style={{ padding: '20px 2px 0' }}>
        <Meta article={article} />
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(19px, 1.8vw, 24px)', fontWeight: 400, color: 'var(--text)', margin: '12px 0 10px', lineHeight: 1.25 }}>
          {article.title}
        </h3>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, lineHeight: 1.7, color: 'rgba(var(--text-rgb),0.55)', margin: 0 }}>
          {article.excerpt}
        </p>
      </div>
      <style>{`.jrn-card:hover .jrn-card-img{ transform: scale(1.06); }`}</style>
    </Link>
  )
}

function Meta({ article }: { article: Article }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>{article.category}</span>
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(var(--text-rgb),0.3)' }} />
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.08em', color: 'rgba(var(--text-rgb),0.45)' }}>{formatDate(article.date)}</span>
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(var(--text-rgb),0.3)' }} />
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.08em', color: 'rgba(var(--text-rgb),0.45)' }}>{article.readMinutes} min</span>
    </div>
  )
}

function Arrow() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
}
