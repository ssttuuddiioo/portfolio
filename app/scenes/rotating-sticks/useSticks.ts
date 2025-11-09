import { useState, useEffect, useCallback, useRef } from 'react'
import { PortfolioStick } from '@/types/stick'
import { ANIMATION } from '@/lib/animation'

export function useSticks(initialSticks: PortfolioStick[]) {
  const [sticks, setSticks] = useState<PortfolioStick[]>(initialSticks)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }) // Start off-screen
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(Date.now())

  // Initialize dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleMouseLeave = () => {
      setMousePos({ x: -1000, y: -1000 }) // Move off-screen
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Physics update loop
  useEffect(() => {
    if (dimensions.width === 0) return

    const update = () => {
      const now = Date.now()
      const deltaTime = Math.min((now - lastTimeRef.current) / 1000, 1 / 30) // Cap at 30fps
      lastTimeRef.current = now

      setSticks((prevSticks) =>
        prevSticks.map((stick) => {
          let { position, velocity, angle, rotationSpeed } = stick

          // Calculate proximity to mouse for slowdown effect
          const stickCenterX = position.x + (Math.cos(angle) * stick.length) / 2
          const stickCenterY = position.y + (Math.sin(angle) * stick.length) / 2
          const distanceToMouse = Math.sqrt(
            Math.pow(mousePos.x - stickCenterX, 2) + 
            Math.pow(mousePos.y - stickCenterY, 2)
          )

          // Apply proximity slowdown with easing
          let speedMultiplier = 1.0
          if (distanceToMouse < ANIMATION.PROXIMITY_RADIUS) {
            // Normalized distance (0 at mouse, 1 at edge of radius)
            const normalizedDist = distanceToMouse / ANIMATION.PROXIMITY_RADIUS
            // Ease curve: x^3 for smooth falloff
            const easedDist = Math.pow(normalizedDist, ANIMATION.PROXIMITY_EASING)
            // Interpolate between slowdown and full speed
            speedMultiplier = ANIMATION.PROXIMITY_SLOWDOWN + (1 - ANIMATION.PROXIMITY_SLOWDOWN) * easedDist
          }

          // Update position with proximity modifier
          position = {
            x: position.x + velocity.x * deltaTime * speedMultiplier,
            y: position.y + velocity.y * deltaTime * speedMultiplier,
          }

          // Update rotation
          angle += rotationSpeed * deltaTime

          // Calculate both endpoints of the stick
          const x1 = position.x
          const y1 = position.y
          const x2 = x1 + Math.cos(angle) * stick.length
          const y2 = y1 + Math.sin(angle) * stick.length

          // Check if EITHER end hits the walls (proper bounding box)
          const minX = Math.min(x1, x2)
          const maxX = Math.max(x1, x2)
          const minY = Math.min(y1, y2)
          const maxY = Math.max(y1, y2)

          // Horizontal wall bouncing (left/right edges)
          if (minX <= 0 || maxX >= dimensions.width) {
            velocity.x *= -ANIMATION.BOUNCE_DAMPING
            // Clamp position to keep stick on screen
            if (minX <= 0) {
              position.x += (0 - minX)
            }
            if (maxX >= dimensions.width) {
              position.x -= (maxX - dimensions.width)
            }
          }

          // Vertical wall bouncing (top/bottom edges)
          if (minY <= 0 || maxY >= dimensions.height) {
            velocity.y *= -ANIMATION.BOUNCE_DAMPING
            // Clamp position to keep stick on screen
            if (minY <= 0) {
              position.y += (0 - minY)
            }
            if (maxY >= dimensions.height) {
              position.y -= (maxY - dimensions.height)
            }
          }

          // Apply velocity damping
          velocity.x *= ANIMATION.VELOCITY_DAMPING
          velocity.y *= ANIMATION.VELOCITY_DAMPING

          return {
            ...stick,
            position,
            velocity,
            angle,
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
  }, [dimensions, mousePos])

  // Hover handler - check which stick mouse is over
  const handleHover = useCallback((hoverX: number, hoverY: number) => {
    setSticks((prevSticks) =>
      prevSticks.map((stick) => {
        // Calculate stick endpoints
        const x1 = stick.position.x
        const y1 = stick.position.y
        const x2 = x1 + Math.cos(stick.angle) * stick.length
        const y2 = y1 + Math.sin(stick.angle) * stick.length

        // Point to line distance
        const A = hoverX - x1
        const B = hoverY - y1
        const C = x2 - x1
        const D = y2 - y1

        const dot = A * C + B * D
        const lenSq = C * C + D * D
        const param = lenSq !== 0 ? dot / lenSq : -1

        let xx, yy

        if (param < 0) {
          xx = x1
          yy = y1
        } else if (param > 1) {
          xx = x2
          yy = y2
        } else {
          xx = x1 + param * C
          yy = y1 + param * D
        }

        const dx = hoverX - xx
        const dy = hoverY - yy
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Set hover state based on distance
        const isHovered = distance < ANIMATION.CLICK_THRESHOLD + 30 // Slightly larger than click threshold

        return { ...stick, isHovered }
      })
    )
  }, [])

  // Click handler
  const handleClick = useCallback((clickX: number, clickY: number) => {
    setSticks((prevSticks) =>
      prevSticks.map((stick) => {
        // Calculate stick endpoints
        const x1 = stick.position.x
        const y1 = stick.position.y
        const x2 = x1 + Math.cos(stick.angle) * stick.length
        const y2 = y1 + Math.sin(stick.angle) * stick.length

        // Point to line distance
        const A = clickX - x1
        const B = clickY - y1
        const C = x2 - x1
        const D = y2 - y1

        const dot = A * C + B * D
        const lenSq = C * C + D * D
        const param = lenSq !== 0 ? dot / lenSq : -1

        let xx, yy

        if (param < 0) {
          xx = x1
          yy = y1
        } else if (param > 1) {
          xx = x2
          yy = y2
        } else {
          xx = x1 + param * C
          yy = y1 + param * D
        }

        const dx = clickX - xx
        const dy = clickY - yy
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Toggle text if within threshold
        if (distance < ANIMATION.CLICK_THRESHOLD) {
          return { ...stick, textVisible: !stick.textVisible }
        }
        return stick
      })
    )
  }, [])

  return { sticks, dimensions, handleClick, handleHover }
}

