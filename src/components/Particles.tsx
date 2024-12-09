import { PointMaterial, Points } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ThemeKey, themes } from '../constants'

export const Particles = ({theme}: {theme: ThemeKey}) => {
  const ref = useRef<THREE.Points>(null)
  
  // Create fewer particles with random initial positions
  const count = 100
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.5 + Math.random() * 2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    return positions
  }, [])

  // Give particle random speed
  const speeds = useMemo(() => 
    Array.from({ length: count }, () => ({
      orbit: 0.2 + Math.random() * 0.8,
      bob: 0.1 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2
    })),
  [])

  useFrame((state) => {
    if (!ref.current) return
    const positions = ref.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const speed = speeds[i]
      
  
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]
      

      const radius = Math.sqrt(x * x + z * z)
      const currentAngle = Math.atan2(z, x)
      

      const newAngle = currentAngle + speed.orbit * 0.01
      positions[i3] = Math.cos(newAngle) * radius
      positions[i3 + 1] = y + Math.sin(time * speed.bob + speed.phase) * 0.02
      positions[i3 + 2] = Math.sin(newAngle) * radius
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group position={[0, 0, 0]}>
      <Points
        ref={ref}
        positions={positions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color={themes[theme].particlesColor}
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  )
}
