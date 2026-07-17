import { TEAL, EASE } from '@/components/custom/lux'
import Header from '@/components/custom/Header'
import SiteFooter from '@/components/custom/SiteFooter'
import MeetingRequestForm from '@/components/custom/MeetingRequestForm'
import { motion } from 'framer-motion'
import { Seo, breadcrumbLd } from '@/lib/seo'

export default function RendezVous() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', overflowX: 'hidden' }}
    >
      <Seo
        title="Meeting And Zoom"
        description="Planifiez une réunion Zoom avec l'équipe Elite Promotion Immobilière : choisissez votre créneau, un conseiller vous confirme le rendez-vous."
        path="/rendez-vous"
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Meeting And Zoom', path: '/rendez-vous' }])}
      />
      <Header />

      <section style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(130px, 16vw, 200px) clamp(24px, 5vw, 48px) clamp(80px, 10vw, 140px)' }}>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.15 }} style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ width: 38, height: 1, background: TEAL }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: TEAL }}>Meeting And Zoom</span>
            <div style={{ width: 38, height: 1, background: TEAL }} />
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 700, margin: 0, lineHeight: 1.05 }}>
            Rencontrons-nous
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'rgba(var(--text-rgb),0.55)', margin: '18px auto 0', maxWidth: 480, lineHeight: 1.65 }}>
            Choisissez votre créneau : un conseiller accepte votre demande et vous confirme la réunion.
          </p>
        </motion.div>

        <MeetingRequestForm />
      </section>

      <SiteFooter />
    </motion.div>
  )
}
