'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { gsap } from 'gsap'

interface SmoothScrollProps {
  children: ReactNode
}

// Touch screens keep native scrolling: they already have momentum, and a fixed,
// transformed page breaks the browser's scroll-the-focused-field-into-view when
// the on-screen keyboard opens (the contact form jumping off screen on iOS).
const TOUCH_QUERY = '(hover: none) and (pointer: coarse)'

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLDivElement>(null)
  const [smooth, setSmooth] = useState(true)

  useEffect(() => {
    setSmooth(!window.matchMedia(TOUCH_QUERY).matches)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const scrollContent = scrollContentRef.current

    if (!smooth || !scrollContainer || !scrollContent) return

    let currentScroll = window.scrollY
    let targetScroll = currentScroll
    // Share of the remaining distance covered per 60fps frame (lower = heavier, higher = more responsive).
    // Scaled by elapsed time so it feels the same on 60Hz and 120Hz screens.
    const ease = 0.16
    let lastTime = performance.now()
    let frame = 0

    const smoothScroll = (now: number) => {
      const frames = Math.min((now - lastTime) / (1000 / 60), 6)
      lastTime = now
      targetScroll = window.scrollY
      currentScroll += (targetScroll - currentScroll) * (1 - Math.pow(1 - ease, frames))

      if (Math.abs(targetScroll - currentScroll) < 0.05) {
        currentScroll = targetScroll
      }

      gsap.set(scrollContent, {
        y: -currentScroll,
      })

      frame = requestAnimationFrame(smoothScroll)
    }

    // Set initial height
    const updateHeight = () => {
      if (scrollContent) {
        document.body.style.height = `${scrollContent.offsetHeight}px`
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    // Watch for content height changes (e.g., accordion expansions)
    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    if (scrollContent) {
      resizeObserver.observe(scrollContent)
    }

    // Start smooth scroll loop
    frame = requestAnimationFrame(smoothScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateHeight)
      resizeObserver.disconnect()
      document.body.style.height = ''
      gsap.set(scrollContent, { clearProps: 'transform' })
    }
  }, [smooth])

  // Native scrolling: content stays in normal flow, just stacked above the pinned 3D layer
  const containerStyle: React.CSSProperties = smooth
    ? { position: 'fixed', top: 0, left: 0, width: '100%', overflow: 'hidden', zIndex: 1 }
    : { position: 'relative', zIndex: 1 }

  return (
    <div ref={scrollContainerRef} style={containerStyle}>
      <div ref={scrollContentRef}>
        {children}
      </div>
    </div>
  )
}
