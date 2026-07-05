import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Reveal, TEAL } from '@/components/custom/lux'
import { ARTICLES, formatDate, type Article } from '@/data/journal'
import { fetchArticles } from '@/lib/queries'

export default function JournalTeaser() {
  const [articles, setArticles] = useState<Article[]>(ARTICLES)
  useEffect(() => { fetchArticles().then((a) => a?.length && setArticles(a)) }, [])
  const latest = articles.slice(0, 3)
  return (
    <section style={{ background: 'var(--bg-2)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '15%', right: '-12%', width: '50%', height: '60%', background: `radial-gradient(ellipse, ${TEAL}08 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(48px, 7vw, 80px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                <div style={{ width: 38, height: 1, background: TEAL }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Le Journal</span>
                <div style={{ width: 38, height: 1, background: TEAL }} />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
                Regards et Récits
              </h2>
            </div>
            <Link
              to="/journal"
              className="jt-all"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', border: `1px solid ${TEAL}66`, color: TEAL,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3,
                transition: 'all 0.4s ease', whiteSpace: 'nowrap',
              }}
            >
              <span>Tous les articles</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </Link>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'clamp(20px, 3vw, 36px)', alignItems: 'stretch' }} className="jt-grid">
          {/* Featured article — large card */}
          <Reveal>
            <Link to={`/journal/${latest[0].slug}`} className="jt-feat force-dark" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', position: 'relative', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: 360, overflow: 'hidden' }}>
                <img src={latest[0].cover} alt={latest[0].title} loading="lazy" className="jt-feat-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.2) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px, 3vw, 40px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: TEAL }}>{latest[0].category}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(var(--text-rgb),0.3)' }} />
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(var(--text-rgb),0.5)' }}>{formatDate(latest[0].date)}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: 400, color: 'var(--text)', margin: '0 0 12px', lineHeight: 1.15 }}>
                    {latest[0].title}
                  </h3>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, lineHeight: 1.7, color: 'rgba(var(--text-rgb),0.55)', margin: 0, maxWidth: 500 }}>
                    {latest[0].excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Secondary articles — stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 24px)' }}>
            {latest.slice(1).map((a, i) => (
              <Reveal key={a.slug} delay={0.1 + i * 0.08}>
                <Link to={`/journal/${a.slug}`} className="jt-card" style={{ display: 'flex', gap: 'clamp(14px, 2vw, 22px)', textDecoration: 'none', padding: 'clamp(14px, 1.6vw, 20px)', border: '1px solid rgba(var(--line-rgb),0.06)', borderRadius: 5, transition: 'border-color 0.3s ease, background 0.3s ease' }}>
                  <div style={{ flexShrink: 0, width: 'clamp(100px, 14vw, 140px)', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 3 }}>
                    <img src={a.cover} alt={a.title} loading="lazy" className="jt-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL }}>{a.category}</span>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: 'rgba(var(--text-rgb),0.35)' }}>{a.readMinutes} min</span>
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(16px, 1.4vw, 20px)', fontWeight: 400, color: 'var(--text)', margin: 0, lineHeight: 1.25 }}>
                      {a.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .jt-all:hover { background: ${TEAL} !important; color: var(--bg) !important; border-color: ${TEAL} !important; }
        .jt-feat:hover .jt-feat-img { transform: scale(1.05); }
        .jt-card:hover { border-color: rgba(43,189,176,0.3) !important; background: rgba(var(--line-rgb),0.02) !important; }
        .jt-card:hover .jt-card-img { transform: scale(1.06); }
        @media (max-width: 860px) { .jt-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
