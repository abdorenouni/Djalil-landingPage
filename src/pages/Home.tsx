import { useEffect } from 'react'
import Header from '@/components/custom/Header'
import CustomCursor from '@/components/custom/CustomCursor'
import GradientOrbs from '@/components/custom/GradientOrbs'
import FloatingShapes from '@/components/custom/FloatingShapes'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Projects from '@/sections/Projects'
import Services from '@/sections/Services'
import Experience from '@/sections/Experience'
import Footer from '@/sections/Footer'

export default function Home() {
  useEffect(() => {
    // Smooth scroll with Lenis-like behavior using native API
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Header />
      <GradientOrbs />
      <FloatingShapes />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Projects />
        <Services />
        <Experience />
        <Footer />
      </main>
      {/* Noise overlay */}
      <div className="noise-overlay" />
    </>
  )
}
