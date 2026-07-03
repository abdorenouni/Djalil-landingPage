import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Seo } from '@/lib/seo'
import Logo from '@/components/custom/Logo'

const TEAL = '#2bbdb0'

/** Branded catch-all 404 — prevents blank screens on unknown URLs. */
export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100dvh', background: 'var(--bg)', color: 'var(--text)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px', position: 'relative', overflow: 'hidden',
      }}
    >
      <Seo title="Page introuvable" description="La page que vous cherchez n'existe pas ou a été déplacée." path="/404" />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '120%', background: `radial-gradient(ellipse, ${TEAL}0c 0%, transparent 65%)`, pointerEvents: 'none' }} />

      <Logo style={{ height: 52, marginBottom: 'clamp(32px, 5vw, 56px)' }} />

      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(72px, 16vw, 160px)', lineHeight: 1, margin: 0, color: '#fff' }}>404</h1>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 2vw, 18px)', letterSpacing: '0.28em', textTransform: 'uppercase', color: TEAL, margin: '18px 0 0' }}>
        Page introuvable
      </p>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.4vw, 16px)', color: 'rgba(var(--text-rgb),0.55)', margin: '20px 0 clamp(36px, 5vw, 48px)', maxWidth: 440, lineHeight: 1.7 }}>
        La page que vous recherchez n'existe pas ou a été déplacée. Revenez à l'accueil pour poursuivre la visite.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 34px', background: TEAL, color: '#04211e', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 999 }}
        >
          Retour à l'accueil
        </Link>
        <Link
          to="/contact"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 34px', border: `1px solid ${TEAL}66`, color: TEAL, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 999 }}
        >
          Nous contacter
        </Link>
      </div>
    </motion.div>
  )
}
