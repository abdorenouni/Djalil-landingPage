import { motion } from 'framer-motion'
import Header from '@/components/custom/Header'
import Preloader from '@/components/custom/Preloader'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Projects from '@/sections/Projects'

export default function Home() {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Preloader />
      <Header />

      {/*
        CURTAIN REVEAL: Hero is sticky behind. As you scroll, the About + Projects
        sections slide over it. Content uses zIndex > 0 to ensure it layers correctly.
      */}
      <div style={{ position: 'relative' }}>
        {/* Sticky hero — stays pinned at top while content scrolls over */}
        <div style={{ position: 'sticky', top: 0, zIndex: 0, height: '100vh' }}>
          <Hero />
        </div>

        {/* Scrolling content — slides over the pinned hero */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <About />
          <Projects />

          {/* ── MINIMAL FOOTER BRIDGE — Phase 3 will replace this ── */}
          <footer
            id="contact"
            style={{
              background: '#050505',
              borderTop: '1px solid rgba(212,175,55,0.08)',
              padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <img
              src="/images/elite-logo.png"
              alt="Elite Promotion Immobilière"
              style={{
                height: 36,
                width: 'auto',
                display: 'block',
                opacity: 0.55,
              }}
            />
            <div
              style={{
                width: 40,
                height: 0.5,
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
              }}
            />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: '0.2em',
                color: 'rgba(243,244,241,0.25)',
                textTransform: 'uppercase',
                margin: 0,
                textAlign: 'center',
              }}
            >
              © {new Date().getFullYear()} Elite Promotion Immobilière — Tous droits réservés
            </p>
          </footer>
        </div>
      </div>
    </motion.div>
  )
}
