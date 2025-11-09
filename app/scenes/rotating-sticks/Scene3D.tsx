'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { PortfolioStick } from '@/types/stick'
import { useSticks3D } from './useSticks3D'
import { Stick3D } from './Stick3D'
import { StickText3D } from './StickText3D'
import { StickImage } from './StickImage'
import { COLORS } from '@/lib/animation'

interface Scene3DProps {
  initialSticks: PortfolioStick[]
}

interface SceneContentProps {
  sticks: PortfolioStick[]
  handleStickClick: (id: string) => void
  handleStickHover: (id: string, isHovered: boolean) => void
}

function SceneContent({ sticks, handleStickClick, handleStickHover }: SceneContentProps) {
  return (
    <>
      {/* Render all sticks */}
      {sticks.map((stick) => (
        <Stick3D
          key={stick.id}
          stick={stick}
          onClick={() => handleStickClick(stick.id)}
          onPointerEnter={() => handleStickHover(stick.id, true)}
          onPointerLeave={() => handleStickHover(stick.id, false)}
        />
      ))}
      
      {/* Render all text labels */}
      {sticks.map((stick) => (
        <StickText3D key={`text-${stick.id}`} stick={stick} />
      ))}
    </>
  )
}

export function RotatingStickScene3D({ initialSticks }: Scene3DProps) {
  const [mounted, setMounted] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const targetPosRef = useState({ x: 0, y: 0 })[0]
  
  // Use the 3D sticks hook
  const { sticks, changeFormation, handleStickClick, handleStickHover } = useSticks3D(initialSticks)
  
  // Wait for client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard controls for formations
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case '1':
          changeFormation('scattered')
          break
        case '2':
          changeFormation('sphere')
          break
        case '3':
          changeFormation('cube')
          break
        case '4':
          changeFormation('grid')
          break
        case '5':
          changeFormation('helix')
          break
        case '6':
          changeFormation('wave')
          break
        case '7':
          changeFormation('hypercube')
          break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [changeFormation])

  // Track cursor for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.x = e.clientX
      targetPosRef.y = e.clientY
      setCursorVisible(true)
    }
    const handleMouseLeave = () => setCursorVisible(false)
    const handleMouseEnter = () => setCursorVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [targetPosRef])

  // Smooth cursor animation
  useEffect(() => {
    let animFrameRef: number
    const smoothFollow = () => {
      setCursorPos((prev) => {
        const dx = targetPosRef.x - prev.x
        const dy = targetPosRef.y - prev.y
        const lerp = 0.15
        return {
          x: prev.x + dx * lerp,
          y: prev.y + dy * lerp,
        }
      })
      animFrameRef = requestAnimationFrame(smoothFollow)
    }
    animFrameRef = requestAnimationFrame(smoothFollow)
    return () => cancelAnimationFrame(animFrameRef)
  }, [targetPosRef])

  // Show black screen until mounted
  if (!mounted) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: COLORS.BACKGROUND,
        }}
      />
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: COLORS.BACKGROUND,
        cursor: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        style={{ background: COLORS.BACKGROUND }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Camera setup - orthographic-like perspective for 2D feel */}
        <PerspectiveCamera
          makeDefault
          position={[
            typeof window !== 'undefined' ? window.innerWidth / 2 : 960,
            typeof window !== 'undefined' ? window.innerHeight / 2 : 540,
            1000,
          ]}
          fov={50}
          near={0.1}
          far={5000}
        />

        {/* Lighting */}
        <ambientLight intensity={1} />
        
        {/* Scene content */}
        <Suspense fallback={null}>
          <SceneContent
            sticks={sticks}
            handleStickClick={handleStickClick}
            handleStickHover={handleStickHover}
          />
        </Suspense>

        {/* Optional: Enable camera controls for debugging */}
        {/* <OrbitControls enableDamping={false} /> */}
      </Canvas>

      {/* Hover images - still 2D overlays */}
      {sticks.map((stick) => (
        <StickImage key={`image-${stick.id}`} stick={stick} />
      ))}

      {/* Custom cursor */}
      {cursorVisible && (
        <div
          style={{
            position: 'fixed',
            left: cursorPos.x,
            top: cursorPos.y,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            mixBlendMode: 'difference',
            zIndex: 9999,
          }}
        />
      )}

      {/* Formation controls - accessible via keyboard */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          color: COLORS.TEXT,
          fontSize: '12px',
          fontFamily: 'monospace',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        Press: 1=Scattered, 2=Sphere, 3=Cube, 4=Grid, 5=Helix, 6=Wave, 7=Hypercube
      </div>

      {/* Hypercube button - bottom right */}
      <button
        onClick={() => changeFormation('hypercube')}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          padding: '15px 25px',
          backgroundColor: 'transparent',
          border: '2px solid ' + COLORS.TEXT,
          color: COLORS.TEXT,
          fontFamily: "'Futura', 'Futura PT', -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 'bold',
          fontSize: '14px',
          letterSpacing: '2px',
          cursor: 'pointer',
          zIndex: 1000,
          mixBlendMode: 'difference',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.TEXT
          e.currentTarget.style.color = COLORS.BACKGROUND
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = COLORS.TEXT
        }}
      >
        HYPERCUBE
      </button>
    </div>
  )
}

