import { motion } from 'framer-motion'
import Header from '@/components/custom/Header'
import Preloader from '@/components/custom/Preloader'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Projects from '@/sections/Projects'
import Contact from '@/sections/Contact'

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
          <Contact />
        </div>
      </div>
    </motion.div>
  )
}
