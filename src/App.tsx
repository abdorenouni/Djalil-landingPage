import { useLocation, Routes, Route } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
      </Routes>
    </AnimatePresence>
  )
}
