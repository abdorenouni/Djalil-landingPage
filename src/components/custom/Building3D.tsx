import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'

const GOLD = '#2bbdb0'
const TEAL = '#2bbdb0'

function Label({ y, name, accent }: { y: number; name: string; accent: string }) {
  return (
    <Html position={[0, y, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: accent,
          letterSpacing: '0.22em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          textShadow: `0 0 14px ${accent}77`,
        }}
      >
        {name}
      </span>
    </Html>
  )
}

/* ── ASTERIA — detailed flagship: curved cantilevered floor plates, glass
      core, perimeter fins, a cascade ribbon, an infinity-pool base, a crown. ── */
function AsteriaTower({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const floors = 16
  const slabH = 0.07
  const gap = 0.145
  const step = slabH + gap
  const totalH = floors * step
  const baseR = 0.66

  useFrame((s) => {
    if (groupRef.current) groupRef.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.4 + delay) * 0.05
  })

  const plates = useMemo(() => Array.from({ length: floors }, (_, i) => {
    const taper = 1 - (i / floors) * 0.2
    return { y: slabH / 2 + i * step, r: baseR * taper }
  }), [])

  const fins = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]

  return (
    <group ref={groupRef} position={position}>
      {/* glass core */}
      <mesh position={[0, totalH / 2, 0]}>
        <cylinderGeometry args={[baseR * 0.5, baseR * 0.55, totalH, 36]} />
        <meshStandardMaterial color="#0b1f1e" roughness={0.12} metalness={0.5} transparent opacity={0.6} emissive={TEAL} emissiveIntensity={0.16} />
      </mesh>

      {/* curved floor plates with glowing rims */}
      {plates.map((p, i) => (
        <group key={i} position={[0, p.y, 0]}>
          <mesh>
            <cylinderGeometry args={[p.r, p.r, slabH, 44]} />
            <meshStandardMaterial color="#171717" roughness={0.16} metalness={0.92} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[p.r, 0.012, 8, 56]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.55} />
          </mesh>
        </group>
      ))}

      {/* perimeter fins */}
      {fins.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * baseR * 0.92, totalH / 2, Math.sin(a) * baseR * 0.92]}>
          <boxGeometry args={[0.035, totalH, 0.035]} />
          <meshStandardMaterial color="#242424" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* cascade ribbon (the signature waterfall) */}
      <mesh position={[0, totalH * 0.48, baseR * 0.9]}>
        <planeGeometry args={[0.16, totalH * 0.92]} />
        <meshStandardMaterial color="#bfeee8" emissive={TEAL} emissiveIntensity={0.5} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* infinity-pool base */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[baseR * 1.3, 48]} />
        <meshStandardMaterial color="#0c2e2c" emissive={TEAL} emissiveIntensity={0.22} roughness={0.08} metalness={0.6} transparent opacity={0.82} />
      </mesh>

      {/* crown */}
      <mesh position={[0, totalH + 0.06, 0]}>
        <cylinderGeometry args={[baseR * 0.28, baseR * 0.42, 0.12, 28]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
      </mesh>

      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[0.05, totalH + 0.55, 0.3]}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial color={GOLD} roughness={0.15} metalness={0.95} emissive={GOLD} emissiveIntensity={0.4} />
        </mesh>
      </Float>

      <Label y={totalH + 0.95} name="ASTERIA" accent={GOLD} />
    </group>
  )
}

/* ── Simpler stacked-slab tower for the secondary projects ── */
function SlabTower({
  position, name, accent, floors, floorW = 1.0, floorD = 0.9, delay = 0, ghost = false,
}: {
  position: [number, number, number]; name: string; accent: string; floors: number
  floorW?: number; floorD?: number; delay?: number; ghost?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const slabH = 0.11
  const gap = 0.17
  const step = slabH + gap
  const totalH = floors * step
  const coreW = floorW * 0.46
  const coreD = floorD * 0.46
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(floorW, slabH, floorD)), [floorW, floorD])

  useFrame((s) => {
    if (groupRef.current) groupRef.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.4 + delay) * 0.07
  })

  return (
    <group ref={groupRef} position={position}>
      {!ghost && (
        <mesh position={[0, totalH / 2, 0]}>
          <boxGeometry args={[coreW, totalH, coreD]} />
          <meshStandardMaterial color="#0e0e0e" roughness={0.3} metalness={0.85} />
        </mesh>
      )}
      {Array.from({ length: floors }).map((_, i) => {
        const y = slabH / 2 + i * step
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <boxGeometry args={[floorW, slabH, floorD]} />
              <meshStandardMaterial color="#161616" roughness={0.2} metalness={0.9} transparent opacity={ghost ? 0.16 : 0.95} />
            </mesh>
            <lineSegments geometry={edges}>
              <lineBasicMaterial color={accent} transparent opacity={ghost ? 0.4 : 0.55} />
            </lineSegments>
          </group>
        )
      })}
      <mesh position={[0, totalH + 0.05, 0]}>
        <boxGeometry args={[coreW * 0.7, 0.1, coreD * 0.7]} />
        <meshStandardMaterial color={accent} roughness={0.2} metalness={0.9} emissive={accent} emissiveIntensity={ghost ? 0.25 : 0.4} transparent opacity={ghost ? 0.6 : 1} />
      </mesh>
      <Label y={totalH + 0.4} name={name} accent={accent} />
    </group>
  )
}

function ArchitecturalScene() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.16) * 0.2
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.04
  })

  return (
    <group ref={groupRef} position={[0, -1.7, 0]}>
      {/* Separated, in order: ASTERIA · MAGNOLIA · À VENIR */}
      <AsteriaTower position={[-2.7, 0, 0]} delay={0} />
      <SlabTower position={[0.15, 0, 0]} name="MAGNOLIA" accent={TEAL} floors={10} floorW={1.05} floorD={0.95} delay={1} />
      <SlabTower position={[2.85, 0, 0.1]} name="À Venir" accent="#9fb0ae" floors={7} floorW={0.92} floorD={0.86} delay={2} ghost />

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 11]} />
        <meshStandardMaterial color="#080808" roughness={0.7} metalness={0.4} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

export default function Building3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers = [500, 1200, 2500].map(ms =>
      setTimeout(() => window.dispatchEvent(new Event('resize')), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}>
      <Canvas
        camera={{ position: [1.2, 1.9, 9.8], fov: 44 }}
        style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 7, 5]} intensity={0.9} color="#fff8ec" />
        <directionalLight position={[-4, 3, -2]} intensity={0.3} color="#c8e6e3" />
        <pointLight position={[-5, 2, 3]} intensity={1.0} color={TEAL} />
        <pointLight position={[5, 1, 2]} intensity={0.7} color={GOLD} />
        <hemisphereLight args={['#1a2a2a', '#0a0a0a', 0.6]} />
        <ArchitecturalScene />
      </Canvas>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(6,6,6,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
