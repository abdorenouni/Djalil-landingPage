import { useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import Asteria from './pages/Asteria'
import APropos from './pages/APropos'
import Projets from './pages/Projets'
import ProjectDetail from './pages/ProjectDetail'
import Journal from './pages/Journal'
import Article from './pages/Article'
import Univers from './pages/Univers'
import ContactPage from './pages/Contact'
import NotFound from './pages/NotFound'
import { BackToTop } from './components/custom/lux'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const tryScroll = () => {
        const el = document.querySelector(hash)
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return true }
        return false
      }
      if (tryScroll()) return
      let attempts = 0
      const id = setInterval(() => {
        if (tryScroll() || ++attempts >= 15) clearInterval(id)
      }, 120)
      return () => clearInterval(id)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      {/* Film-grain overlay — physical paper texture (editorial-luxury) */}
      <div className="noise-overlay" aria-hidden="true" />
      <BackToTop />
      <ScrollManager />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/projets/asteria" element={<Asteria />} />
          <Route path="/projets/:slug" element={<ProjectDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<Article />} />
          <Route path="/univers/:slug" element={<Univers />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </MotionConfig>
  )
}
