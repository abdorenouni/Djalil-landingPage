import { motion } from 'framer-motion'
import Header from '@/components/custom/Header'
import Preloader from '@/components/custom/Preloader'
import Hero from '@/sections/Hero'
import ProjectsIntro from '@/sections/ProjectsIntro'
import Projects from '@/sections/Projects'
import Chiffres from '@/sections/Chiffres'
import Processus from '@/sections/Processus'
import About from '@/sections/About'
import JournalTeaser from '@/sections/JournalTeaser'
import FAQ from '@/sections/FAQ'
import Contact from '@/sections/Contact'
import { Seo, organizationLd } from '@/lib/seo'
import { ScrollSection } from '@/components/custom/lux'
import { useSiteSettings } from '@/lib/useSiteSettings'

export default function Home() {
  const settings = useSiteSettings()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Seo path="/" jsonLd={organizationLd(settings ?? undefined)} />
      <Preloader />
      <Header />

      {/*
        CURTAIN REVEAL: Hero is sticky behind. As you scroll, the content
        sections slide over it. Content uses zIndex > 0 to layer correctly.
        Order (client request): Projets first, À Propos moved before Contact.
      */}
      <div style={{ position: 'relative' }}>
        {/* Sticky hero — stays pinned at top while content scrolls over */}
        <div className="hero-container" style={{ position: 'sticky', top: 0, zIndex: 0 }}>
          <Hero />
        </div>

        {/* Scrolling content — slides over the pinned hero */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ScrollSection><Projects /></ScrollSection>
          <ProjectsIntro />
          <ScrollSection><Chiffres /></ScrollSection>
          <ScrollSection><Processus /></ScrollSection>
          <ScrollSection><About /></ScrollSection>
          <ScrollSection><JournalTeaser /></ScrollSection>
          <ScrollSection><FAQ /></ScrollSection>
          <ScrollSection><Contact /></ScrollSection>
        </div>
      </div>
    </motion.div>
  )
}
