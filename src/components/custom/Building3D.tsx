import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function BuildingBlock({ position, size, color, delay }: { position: [number, number, number]; size: [number, number, number]; color: string; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + delay) * 0.15
    }
    if (edgesRef.current) {
      edgesRef.current.position.y = position[1] + Math.sin(t * 0.5 + delay) * 0.15
    }
  })

  const edges = useMemo(() => {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2])
    return new THREE.EdgesGeometry(geometry)
  }, [size])

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>
      <lineSegments ref={edgesRef} position={position} geometry={edges}>
        <lineBasicMaterial color="#d4af37" transparent opacity={0.4} />
      </lineSegments>
    </group>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 80

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return [pos]
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return
    const t = state.clock.elapsedTime
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.002
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y = t * 0.05
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d4af37"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function ArchitecturalScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    // 4-5 second full rotation cycle
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.4 + t * 0.08
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Main tower */}
      <BuildingBlock position={[0, 0, 0]} size={[1.2, 3, 1.2]} color="#1a1a1a" delay={0} />
      {/* Side wings */}
      <BuildingBlock position={[-1.4, -0.3, 0.3]} size={[1, 2, 0.8]} color="#222" delay={0.5} />
      <BuildingBlock position={[1.4, -0.2, -0.2]} size={[0.9, 2.2, 0.9]} color="#1e1e1e" delay={1} />
      {/* Top accent */}
      <BuildingBlock position={[0, 1.8, 0]} size={[0.8, 0.6, 0.8]} color="#2a2a2a" delay={1.5} />
      {/* Gold accent blocks */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0.7, 0.5, 0.7]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.9} emissive="#d4af37" emissiveIntensity={0.2} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh position={[-0.6, -0.8, 0.5]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#d4af37" roughness={0.2} metalness={0.9} emissive="#d4af37" emissiveIntensity={0.15} />
        </mesh>
      </Float>
      {/* Ground plane */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.3} transparent opacity={0.5} />
      </mesh>
      <FloatingParticles />
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
        <pointLight position={[3, -2, -3]} intensity={0.3} color="#d4af37" />
        <Environment preset="city" />
        <ArchitecturalScene />
      </Canvas>
      {/* Overlay gradient */}
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
