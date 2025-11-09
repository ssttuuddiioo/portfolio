'use client'

import { useRef } from 'react'
import { Mesh } from 'three'
import { PortfolioStick } from '@/types/stick'
import { ANIMATION, COLORS } from '@/lib/animation'

interface Stick3DProps {
  stick: PortfolioStick
  onClick?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

export function Stick3D({ stick, onClick, onPointerEnter, onPointerLeave }: Stick3DProps) {
  const meshRef = useRef<Mesh>(null)
  const hitboxRef = useRef<Mesh>(null)
  
  // Convert 2D angle to 3D rotation
  const rotationZ = stick.angle
  const rotationX = stick.rotation3D?.x || 0
  const rotationY = stick.rotation3D?.y || 0
  
  // Stick dimensions
  const radius = ANIMATION.STROKE_WIDTH / 2
  const height = stick.length
  
  // Larger hitbox for easier hover detection
  const hitboxRadius = 15 // Much larger for easier hovering
  
  return (
    <group
      position={[stick.position.x, stick.position.y, stick.position.z]}
      rotation={[rotationX, rotationY, rotationZ]}
    >
      {/* Invisible hitbox for easier hover detection */}
      <mesh
        ref={hitboxRef}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <cylinderGeometry args={[hitboxRadius, hitboxRadius, height, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible stick cylinder */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[radius, radius, height, 8]} />
        <meshBasicMaterial color={COLORS.STICK} />
      </mesh>
    </group>
  )
}

