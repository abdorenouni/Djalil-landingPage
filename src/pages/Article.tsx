import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, useParams, Navigate } from 'react-router'
import { Reveal, TEAL, EASE, useIsMobile } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import { getArticle, ARTICLES, formatDate, type Article as ArticleType, type Block } from '@/data/journal'
import { fetchArticle, fetchArticles } from '@/lib/queries'
import { Seo, articleLd, breadcrumbLd } from '@/lib/seo'

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleType | undefined>(() => (slug ? getArticle(slug) : undefined))
  const [allArticles, setAllArticles] = useState<ArticleType[]>(ARTICLES)
  useEffect(() => {
    if (slug) fetchArticle(slug).then((a) => a && setArticle(a))
    fetchArticles().then((list) => list?.length && setAllArticles(list))
  }, [slug])

  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])

  if (!article) return <Navigate to="/journal" replace />

  const related = allArticles.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}
    >
      <Seo
        title={article.title}
        description={article.excerpt}
        path={`/journal/${article.slug}`}
        image={article.cover}
        type="article"
        jsonLd={[
          articleLd({ title: article.title, description: article.excerpt, image: article.cover, date: article.date, author: article.author, path: `/journal/${article.slug}` }),
          breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Le Journal', path: '/journal' }, { name: article.title, path: `/journal/${article.slug}` }]),
        ]}
      />
      <Header />

      {/* ── HERO ── */}
      <div ref={heroRef} className="force-dark" style={{ position: 'relative', height: '72vh', minHeight: 460, overflow: 'hidden' }}>
        {isMobile ? (
          <img src={article.cover} alt={article.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <motion.img src={article.cover} alt={article.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: heroScale, y: heroY }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.3) 45%, rgba(6,6,6,0.95) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(32px, 6vw, 80px) clamp(24px, 5vw, 80px)' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>{article.category}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(var(--text-rgb),0.4)' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(var(--text-rgb),0.6)' }}>{formatDate(article.date)}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(var(--text-rgb),0.4)' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(var(--text-rgb),0.6)' }}>{article.readMinutes} min de lecture</span>
              </div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(30px, 5.5vw, 68px)', lineHeight: 1.08, margin: 0, color: '#fff', textShadow: '0 6px 40px rgba(0,0,0,0.5)' }}>
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 24px) clamp(60px, 8vw, 100px)' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(18px, 2.4vw, 24px)', lineHeight: 1.6, color: 'rgba(var(--text-rgb),0.8)', margin: '0 0 clamp(36px, 5vw, 56px)', paddingBottom: 'clamp(28px, 4vw, 40px)', borderBottom: '1px solid rgba(var(--line-rgb),0.08)' }}>
          {article.excerpt}
        </p>

        {article.body.map((block, i) => (
          <Reveal key={i} y={28}><BlockView block={block} /></Reveal>
        ))}

        {/* signature */}
        <div style={{ marginTop: 'clamp(40px, 6vw, 64px)', paddingTop: 28, borderTop: '1px solid rgba(var(--line-rgb),0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 1, background: TEAL }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),0.55)' }}>
            Par {article.author}
          </span>
        </div>
      </article>

      {/* ── RELATED ── */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid rgba(var(--line-rgb),0.05)', padding: 'clamp(64px, 9vw, 120px) clamp(24px, 5vw, 80px)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 400, color: 'var(--text)', textAlign: 'center', margin: '0 0 clamp(40px, 5vw, 64px)' }}>
            À lire également
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(20px, 2.5vw, 36px)' }}>
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link to={`/journal/${a.slug}`} className="rel-card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 4 }}>
                    <img src={a.cover} alt={a.title} loading="lazy" decoding="async" className="rel-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                  </div>
                  <span style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL, marginTop: 18 }}>{a.category}</span>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 400, color: 'var(--text)', margin: '10px 0 0', lineHeight: 1.3 }}>{a.title}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`.rel-card:hover .rel-card-img{ transform: scale(1.06); }`}</style>
    </motion.div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, color: 'var(--text)', margin: 'clamp(36px, 5vw, 52px) 0 18px', lineHeight: 1.2 }}>{block.text}</h2>
    case 'quote':
      return (
        <blockquote style={{ margin: 'clamp(32px, 5vw, 48px) 0', padding: '4px 0 4px 28px', borderLeft: `2px solid ${TEAL}`, fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(20px, 2.8vw, 28px)', lineHeight: 1.5, color: 'var(--text)' }}>
          {block.text}
        </blockquote>
      )
    case 'image':
      return (
        <figure style={{ margin: 'clamp(36px, 5vw, 56px) 0' }}>
          <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden', borderRadius: 4 }}>
            <img src={block.src} alt={block.caption ?? ''} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {block.caption && (
            <figcaption style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, letterSpacing: '0.04em', color: 'rgba(var(--text-rgb),0.4)', marginTop: 12, textAlign: 'center' }}>{block.caption}</figcaption>
          )}
        </figure>
      )
    default:
      return <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.85, color: 'rgba(var(--text-rgb),0.72)', margin: '0 0 24px' }}>{block.text}</p>
  }
}
