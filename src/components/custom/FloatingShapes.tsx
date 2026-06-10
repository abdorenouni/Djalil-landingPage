import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const shapes = container.querySelectorAll('.float-shape')
    const ctx = gsap.context(() => {
      shapes.forEach((shape, i) => {
        gsap.to(shape, {
          y: -30,
          rotation: i % 2 === 0 ? 15 : -15,
          duration: 4 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Top right diamond */}
      <div
        className="float-shape"
        style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          width: 60,
          height: 60,
          border: '1px solid rgba(212, 175, 55, 0.15)',
          transform: 'rotate(45deg)',
        }}
      />
      {/* Bottom left circle */}
      <div
        className="float-shape"
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '5%',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.12)',
        }}
      />
      {/* Center right line */}
      <div
        className="float-shape"
        style={{
          position: 'absolute',
          top: '45%',
          right: '15%',
          width: 80,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.2), transparent)',
        }}
      />
    </div>
  )
}
