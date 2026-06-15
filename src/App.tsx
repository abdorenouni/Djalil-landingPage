import { useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Asteria from './pages/Asteria'
import APropos from './pages/APropos'

/* Scroll to top on every route change (and honour /#contact hash) */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollManager />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/projets/asteria" element={<Asteria />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
