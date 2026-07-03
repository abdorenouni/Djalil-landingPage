import { motion } from 'framer-motion'
import Header from '@/components/custom/Header'
import ContactSection from '@/sections/Contact'
import { Seo, breadcrumbLd } from '@/lib/seo'

/**
 * Dedicated /contact route. Reuses the same Contact section as the home page
 * so the form, coordinates and footer stay identical, and gives /contact a
 * real page (title, SEO, navigation) instead of a blank screen.
 */
export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}
    >
      <Seo
        title="Contact"
        description="Contactez Elite Promotion Immobilière : réservez une visite privée de la résidence ASTERIA. Téléphone, WhatsApp, email — un conseiller dédié vous répond."
        path="/contact"
        jsonLd={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Contact', path: '/contact' }])}
      />
      <Header />
      <div style={{ paddingTop: 70 }}>
        <ContactSection />
      </div>
    </motion.div>
  )
}
