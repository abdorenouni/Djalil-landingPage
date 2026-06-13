import { useEffect } from 'react'
import Header from '@/components/custom/Header'
import Preloader from '@/components/custom/Preloader'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Projects from '@/sections/Projects'
import Services from '@/sections/Services'
import Experience from '@/sections/Experience'
import Footer from '@/sections/Footer'

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  return (
    <>
      <Preloader />
      <Header />

      {/* 
        CURTAIN REVEAL: 
        Hero is sticky inside this wrapper. As you scroll through the wrapper,
        the hero stays pinned. The content div slides over it.
      */}
      <div style={{ position: 'relative' }}>
        {/* Sticky Hero — pinned behind */}
        <div style={{ position: 'sticky', top: 0, zIndex: 0, height: '100vh' }}>
          <Hero />
        </div>

        {/* Content slides over the hero */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              background: '#0c1220',
              position: 'relative',
            }}
          >
            <About />
          </div>
          <Projects />
          <Services />
          <Experience />
          <Footer />
        </div>
      </div>
    </>
  )
}
