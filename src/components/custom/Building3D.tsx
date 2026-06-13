import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'

function Building({
  position,
  size,
  name,
  delay,
}: {
  position: [number, number, number]
  size: [number, number, number]
  name: string
  delay: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  const edges = useMemo(() => {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2])
    return new THREE.EdgesGeometry(geometry)
  }, [size])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4 + delay) * 0.1
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Building name */}
      <Html
        position={[0, size[1] / 2 + 0.3, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(212,175,55,0.4)',
          }}
        >
          {name}
        </span>
      </Html>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#d4af37" transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

function ArchitecturalScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.35 + t * 0.06
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.08
  })

  return (
    <group ref={groupRef}>
      <Building position={[-1.1, 0.2, 0]} size={[1.3, 3.2, 1.0]} name="ASTERIA" delay={0} />
      <Building position={[1.2, -0.1, 0.3]} size={[1.1, 2.6, 1.1]} name="MAGNOLIA" delay={1} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 1.2, 0.6]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.9} emissive="#d4af37" emissiveIntensity={0.2} />
        </mesh>
      </Float>

      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.3} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default function Building3D() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [4, 2, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff" />
        <pointLight position={[-3, 2, 3]} intensity={0.5} color="#d4af37" />
        <Environment preset="city" />
        <ArchitecturalScene />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
