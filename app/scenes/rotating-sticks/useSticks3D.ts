import { useState, useEffect, useCallback, useRef } from 'react'
import { PortfolioStick, FormationType } from '@/types/stick'
import { ANIMATION } from '@/lib/animation'

// 4D rotation matrix functions for hypercube
const rotate4D = (point: number[], angleXW: number, angleYW: number, angleZW: number) => {
  const [x, y, z, w] = point
  
  // Rotate in XW plane
  let newX = x * Math.cos(angleXW) - w * Math.sin(angleXW)
  let newW = x * Math.sin(angleXW) + w * Math.cos(angleXW)
  
  // Rotate in YW plane
  let newY = y * Math.cos(angleYW) - newW * Math.sin(angleYW)
  newW = y * Math.sin(angleYW) + newW * Math.cos(angleYW)
  
  // Rotate in ZW plane
  let newZ = z * Math.cos(angleZW) - newW * Math.sin(angleZW)
  newW = z * Math.sin(angleZW) + newW * Math.cos(angleZW)
  
  return [newX, newY, newZ, newW]
}

// Project 4D point to 3D using perspective projection
const project4Dto3D = (point: number[], distance: number = 2) => {
  const [x, y, z, w] = point
  const scale = distance / (distance - w)
  return [x * scale, y * scale, z * scale]
}

// Helper to calculate rotation from one point to another
// Calculates the rotation needed to point a cylinder (default Y-axis) from point A to point B
const calculateLookAtRotation = (from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }) => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dz = to.z - from.z
  
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  if (length < 0.001) return { x: 0, y: 0, z: 0 }
  
  // Normalize
  const nx = dx / length
  const ny = dy / length
  const nz = dz / length
  
  // The cylinder points along Y-axis by default [0, 1, 0]
  // We want to rotate it to point along [nx, ny, nz]
  
  // Calculate rotation around Z axis (for XY plane alignment)
  const angleZ = Math.atan2(nx, ny)
  
  // Calculate rotation around X axis (for vertical tilt)
  const angleX = -Math.asin(nz)
  
  return { x: angleX, y: 0, z: angleZ }
}

// Generate hypercube vertices (16 vertices)
const generateHypercubeVertices = () => {
  const vertices: number[][] = []
  for (let i = 0; i < 16; i++) {
    vertices.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ])
  }
  return vertices
}

// Generate hypercube edges (32 edges)
const generateHypercubeEdges = () => {
  const edges: [number, number][] = []
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      // Two vertices are connected if they differ in exactly one coordinate
      const diff = i ^ j
      if (diff && !(diff & (diff - 1))) { // Check if diff is a power of 2
        edges.push([i, j])
      }
    }
  }
  return edges
}

export function useSticks3D(initialSticks: PortfolioStick[]) {
  const [sticks, setSticks] = useState<PortfolioStick[]>(initialSticks)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, depth: 500 })
  const [formation, setFormation] = useState<FormationType>('scattered')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, z: 0 })
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(Date.now())
  const targetPositionsRef = useRef<Map<string, { x: number; y: number; z: number }>>(new Map())
  const hypercubeTimeRef = useRef<number>(0)

  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        depth: 500, // Depth of 3D space
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Calculate formation positions
  const calculateFormationPositions = useCallback((
    type: FormationType,
    stickCount: number
  ): Map<string, { x: number; y: number; z: number }> => {
    const positions = new Map<string, { x: number; y: number; z: number }>()
    const { width, height, depth } = dimensions
    const centerX = width / 2
    const centerY = height / 2
    const centerZ = 0

    switch (type) {
      case 'sphere': {
        const radius = Math.min(width, height) * 0.3
        for (let i = 0; i < stickCount; i++) {
          const phi = Math.acos(-1 + (2 * i) / stickCount)
          const theta = Math.sqrt(stickCount * Math.PI) * phi
          positions.set(`stick-${i}`, {
            x: centerX + radius * Math.cos(theta) * Math.sin(phi),
            y: centerY + radius * Math.sin(theta) * Math.sin(phi),
            z: centerZ + radius * Math.cos(phi),
          })
        }
        break
      }
      case 'cube': {
        const size = Math.min(width, height) * 0.4
        const itemsPerEdge = Math.ceil(Math.cbrt(stickCount))
        for (let i = 0; i < stickCount; i++) {
          const x = (i % itemsPerEdge) / (itemsPerEdge - 1 || 1)
          const y = (Math.floor(i / itemsPerEdge) % itemsPerEdge) / (itemsPerEdge - 1 || 1)
          const z = Math.floor(i / (itemsPerEdge * itemsPerEdge)) / (itemsPerEdge - 1 || 1)
          positions.set(`stick-${i}`, {
            x: centerX + (x - 0.5) * size,
            y: centerY + (y - 0.5) * size,
            z: centerZ + (z - 0.5) * size,
          })
        }
        break
      }
      case 'grid': {
        const cols = Math.ceil(Math.sqrt(stickCount))
        const rows = Math.ceil(stickCount / cols)
        const spacing = Math.min(width / (cols + 1), height / (rows + 1))
        for (let i = 0; i < stickCount; i++) {
          const col = i % cols
          const row = Math.floor(i / cols)
          positions.set(`stick-${i}`, {
            x: (col + 1) * spacing,
            y: (row + 1) * spacing,
            z: centerZ,
          })
        }
        break
      }
      case 'helix': {
        const radius = Math.min(width, height) * 0.25
        const heightSpread = height * 0.6
        for (let i = 0; i < stickCount; i++) {
          const t = (i / stickCount) * Math.PI * 4
          const y = centerY + (i / stickCount - 0.5) * heightSpread
          positions.set(`stick-${i}`, {
            x: centerX + radius * Math.cos(t),
            y,
            z: centerZ + radius * Math.sin(t),
          })
        }
        break
      }
      case 'wave': {
        const cols = Math.ceil(Math.sqrt(stickCount))
        const rows = Math.ceil(stickCount / cols)
        const spacingX = width / (cols + 1)
        const spacingY = height / (rows + 1)
        const waveHeight = 200
        for (let i = 0; i < stickCount; i++) {
          const col = i % cols
          const row = Math.floor(i / cols)
          const x = (col + 1) * spacingX
          const y = (row + 1) * spacingY
          positions.set(`stick-${i}`, {
            x,
            y,
            z: centerZ + Math.sin((x / width) * Math.PI * 2) * waveHeight,
          })
        }
        break
      }
      case 'hypercube': {
        // Step 1: Generate 4D hypercube vertices (16 points)
        const vertices4D = generateHypercubeVertices()
        const edges = generateHypercubeEdges()
        
        // Step 2: Rotate in 4D space
        const time = hypercubeTimeRef.current
        const rotated4D = vertices4D.map(v => 
          rotate4D(v, time * 0.3, time * 0.4, time * 0.5)
        )
        
        // Step 3: Project to 3D space (perspective projection from 4D)
        const vertices3D = rotated4D.map(v => project4Dto3D(v, 3))
        
        // Step 4: Scale and center the vertices in screen space
        const scale = Math.min(width, height) * 0.15
        const scaledVertices = vertices3D.map(v => ({
          x: centerX + v[0] * scale,
          y: centerY + v[1] * scale,
          z: centerZ + v[2] * scale,
        }))
        
        // Step 5: Map each stick to an edge (connecting two vertices)
        for (let i = 0; i < Math.min(edges.length, stickCount); i++) {
          const [v1Idx, v2Idx] = edges[i]
          const vertex1 = scaledVertices[v1Idx]
          const vertex2 = scaledVertices[v2Idx]
          
          // Debug log for first edge
          if (i === 0) {
            console.log(`📍 Edge ${i}: Vertex ${v1Idx} → Vertex ${v2Idx}`)
            console.log(`   V1: (${vertex1.x.toFixed(1)}, ${vertex1.y.toFixed(1)}, ${vertex1.z.toFixed(1)})`)
            console.log(`   V2: (${vertex2.x.toFixed(1)}, ${vertex2.y.toFixed(1)}, ${vertex2.z.toFixed(1)})`)
          }
          
          // Store the actual vertex positions (for debugging/verification)
          positions.set(`stick-${i}-v1`, vertex1)
          positions.set(`stick-${i}-v2`, vertex2)
          
          // Calculate edge length (distance between vertices)
          const dx = vertex2.x - vertex1.x
          const dy = vertex2.y - vertex1.y
          const dz = vertex2.z - vertex1.z
          const edgeLength = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          // Position stick at exact midpoint between the two vertices
          const midpoint = {
            x: (vertex1.x + vertex2.x) / 2,
            y: (vertex1.y + vertex2.y) / 2,
            z: (vertex1.z + vertex2.z) / 2,
          }
          
          // Store position and length
          positions.set(`stick-${i}`, midpoint)
          positions.set(`stick-${i}-length`, { x: edgeLength, y: 0, z: 0 })
          
          // Calculate rotation using helper function
          const rotation = calculateLookAtRotation(vertex1, vertex2)
          positions.set(`stick-${i}-rotation`, rotation)
        }
        break
      }
      default: // 'scattered'
        // Keep original positions
        break
    }

    return positions
  }, [dimensions])

  // Change formation
  const changeFormation = useCallback((newFormation: FormationType) => {
    setFormation(newFormation)
    if (newFormation !== 'scattered') {
      const positions = calculateFormationPositions(newFormation, sticks.length)
      targetPositionsRef.current = positions
      
      // Reset hypercube time when entering hypercube
      if (newFormation === 'hypercube') {
        hypercubeTimeRef.current = 0
        console.log('🎲 Entering HYPERCUBE formation')
        console.log('   16 vertices in 4D space')
        console.log('   32 edges connecting vertices')
        console.log('   Each stick = one edge')
      }
    } else {
      targetPositionsRef.current.clear()
    }
  }, [sticks.length, calculateFormationPositions])

  // Physics update loop
  useEffect(() => {
    if (dimensions.width === 0) return

    const update = () => {
      const now = Date.now()
      const deltaTime = Math.min((now - lastTimeRef.current) / 1000, 1 / 30)
      lastTimeRef.current = now
      
      // Update hypercube animation every frame
      if (formation === 'hypercube') {
        hypercubeTimeRef.current += deltaTime
        
        const { width, height } = dimensions
        const centerX = width / 2
        const centerY = height / 2
        const centerZ = 0
        
        // Step 1: Generate 4D hypercube vertices
        const vertices4D = generateHypercubeVertices()
        const edges = generateHypercubeEdges()
        
        // Step 2: Rotate in 4D space
        const time = hypercubeTimeRef.current
        const rotated4D = vertices4D.map(v => 
          rotate4D(v, time * 0.3, time * 0.4, time * 0.5)
        )
        
        // Step 3: Project from 4D to 3D
        const vertices3D = rotated4D.map(v => project4Dto3D(v, 3))
        
        // Step 4: Scale and position vertices in screen space
        const scale = Math.min(width, height) * 0.15
        const scaledVertices = vertices3D.map(v => ({
          x: centerX + v[0] * scale,
          y: centerY + v[1] * scale,
          z: centerZ + v[2] * scale,
        }))
        
        // Step 5: Update each stick to connect its two vertices
        for (let i = 0; i < Math.min(edges.length, sticks.length); i++) {
          const [v1Idx, v2Idx] = edges[i]
          const vertex1 = scaledVertices[v1Idx]
          const vertex2 = scaledVertices[v2Idx]
          
          // Store actual vertex positions
          targetPositionsRef.current.set(`stick-${i}-v1`, vertex1)
          targetPositionsRef.current.set(`stick-${i}-v2`, vertex2)
          
          // Calculate edge length
          const dx = vertex2.x - vertex1.x
          const dy = vertex2.y - vertex1.y
          const dz = vertex2.z - vertex1.z
          const edgeLength = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          // Position at exact midpoint
          const midpoint = {
            x: (vertex1.x + vertex2.x) / 2,
            y: (vertex1.y + vertex2.y) / 2,
            z: (vertex1.z + vertex2.z) / 2,
          }
          
          targetPositionsRef.current.set(`stick-${i}`, midpoint)
          targetPositionsRef.current.set(`stick-${i}-length`, { x: edgeLength, y: 0, z: 0 })
          
          // Calculate rotation using helper
          const rotation = calculateLookAtRotation(vertex1, vertex2)
          targetPositionsRef.current.set(`stick-${i}-rotation`, rotation)
        }
      }

      setSticks((prevSticks) =>
        prevSticks.map((stick, index) => {
          let { position, velocity, angle, rotationSpeed, rotation3D = { x: 0, y: 0, z: 0 }, length } = stick

          // Check if we have a target position for formation
          const targetKey = `stick-${index}`
          const targetPos = targetPositionsRef.current.get(targetKey)

          if (targetPos) {
            // Smoothly transition to target position
            const lerpFactor = 0.05
            position = {
              x: position.x + (targetPos.x - position.x) * lerpFactor,
              y: position.y + (targetPos.y - position.y) * lerpFactor,
              z: position.z + (targetPos.z - position.z) * lerpFactor,
            }
            
            // Check if we have target rotation and length (for hypercube)
            const targetRot = targetPositionsRef.current.get(`stick-${index}-rotation`) as any
            const targetLength = targetPositionsRef.current.get(`stick-${index}-length`) as any
            
            if (targetRot && formation === 'hypercube') {
              // Smoothly interpolate rotation to align with edge
              const rotLerpFactor = 0.1
              rotation3D = {
                x: rotation3D.x + (targetRot.x - rotation3D.x) * rotLerpFactor,
                y: rotation3D.y + (targetRot.y - rotation3D.y) * rotLerpFactor,
                z: rotation3D.z + (targetRot.z - rotation3D.z) * rotLerpFactor,
              }
              
              // Update stick length to match edge length
              if (targetLength) {
                const lengthLerpFactor = 0.1
                length = length + (targetLength.x - length) * lengthLerpFactor
              }
            }
            
            // Slow down velocity when in formation
            velocity = {
              x: velocity.x * 0.95,
              y: velocity.y * 0.95,
              z: velocity.z * 0.95,
            }
          } else {
            // Free-floating scattered mode
            // Update position with velocity
            position = {
              x: position.x + velocity.x * deltaTime,
              y: position.y + velocity.y * deltaTime,
              z: position.z + velocity.z * deltaTime,
            }

            // Bounds checking and bouncing
            const halfLength = stick.length / 2

            // X bounds
            if (position.x - halfLength <= 0 || position.x + halfLength >= dimensions.width) {
              velocity.x *= -ANIMATION.BOUNCE_DAMPING
              position.x = Math.max(halfLength, Math.min(dimensions.width - halfLength, position.x))
            }

            // Y bounds
            if (position.y - halfLength <= 0 || position.y + halfLength >= dimensions.height) {
              velocity.y *= -ANIMATION.BOUNCE_DAMPING
              position.y = Math.max(halfLength, Math.min(dimensions.height - halfLength, position.y))
            }

            // Z bounds
            const depthRange = dimensions.depth / 2
            if (position.z <= -depthRange || position.z >= depthRange) {
              velocity.z *= -ANIMATION.BOUNCE_DAMPING
              position.z = Math.max(-depthRange, Math.min(depthRange, position.z))
            }

            // Apply velocity damping
            velocity.x *= ANIMATION.VELOCITY_DAMPING
            velocity.y *= ANIMATION.VELOCITY_DAMPING
            velocity.z *= ANIMATION.VELOCITY_DAMPING
          }

          // Update rotations
          angle += rotationSpeed * deltaTime

          // Add subtle 3D rotation
          rotation3D = {
            x: rotation3D.x + (rotationSpeed * 0.5) * deltaTime,
            y: rotation3D.y + (rotationSpeed * 0.3) * deltaTime,
            z: angle,
          }

          return {
            ...stick,
            position,
            velocity,
            angle,
            rotation3D,
            length,
          }
        })
      )

      animationFrameRef.current = requestAnimationFrame(update)
    }

    animationFrameRef.current = requestAnimationFrame(update)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions, formation, sticks.length])

  // Click handler for sticks
  const handleStickClick = useCallback((stickId: string) => {
    setSticks((prevSticks) =>
      prevSticks.map((stick) =>
        stick.id === stickId
          ? { ...stick, textVisible: !stick.textVisible }
          : stick
      )
    )
  }, [])

  // Hover handler for sticks
  const handleStickHover = useCallback((stickId: string, isHovered: boolean) => {
    console.log(`Hover ${isHovered ? 'ENTER' : 'LEAVE'} on stick:`, stickId)
    setSticks((prevSticks) =>
      prevSticks.map((stick) =>
        stick.id === stickId
          ? { ...stick, isHovered }
          : { ...stick, isHovered: false } // Clear hover from other sticks
      )
    )
  }, [])

  return {
    sticks,
    dimensions,
    formation,
    changeFormation,
    handleStickClick,
    handleStickHover,
  }
}

