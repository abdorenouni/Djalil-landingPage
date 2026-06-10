import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function GradientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const orbs = container.querySelectorAll('.orb')
    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-100, 100)`,
          y: `random(-80, 80)`,
          scale: `random(0.8, 1.3)`,
          duration: `random(8, 14)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 1.5,
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
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <div
        className="orb"
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="orb"
        style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="orb"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,140,40,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}
