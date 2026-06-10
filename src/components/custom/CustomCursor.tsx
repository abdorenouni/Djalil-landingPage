import { useEffect, useRef, useCallback } from 'react'

interface CursorState {
  x: number
  y: number
  targetX: number
  targetY: number
  isHovering: boolean
  scale: number
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovering: false,
    scale: 1,
  })

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) {
      cursor.style.display = 'none'
      dot.style.display = 'none'
      return
    }

    const state = stateRef.current

    const onMouseMove = (e: MouseEvent) => {
      state.targetX = e.clientX
      state.targetY = e.clientY
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [data-cursor-hover], .cursor-hover')
      if (isInteractive) {
        state.isHovering = true
        state.scale = 4
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [data-cursor-hover], .cursor-hover')
      if (isInteractive) {
        state.isHovering = false
        state.scale = 1
      }
    }

    let rafId: number

    const animate = () => {
      state.x = lerp(state.x, state.targetX, 0.15)
      state.y = lerp(state.y, state.targetY, 0.15)

      const currentScale = parseFloat(cursor.style.getPropertyValue('--scale') || '1')
      const newScale = lerp(currentScale, state.scale, 0.12)

      cursor.style.transform = `translate(${state.x - 20}px, ${state.y - 20}px) scale(${newScale})`
      dot.style.transform = `translate(${state.x - 5}px, ${state.y - 5}px)`
      cursor.style.setProperty('--scale', String(newScale))

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [lerp])

  // Don't render on touch devices (check in render)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          backdropFilter: 'blur(2px)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'border-color 0.3s ease, background-color 0.3s ease',
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 8,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#d4af37',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            whiteSpace: 'nowrap',
          }}
          className="cursor-label"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#d4af37',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      <style>{`
        * { cursor: none !important; }
        @media (pointer: coarse) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}
