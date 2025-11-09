'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    const scrollContent = scrollContentRef.current

    if (!scrollContainer || !scrollContent) return

    let currentScroll = 0
    let targetScroll = 0
    let ease = 0.275 // Adjust this for smoothness (lower = smoother, higher = more responsive)

    const smoothScroll = () => {
      targetScroll = window.scrollY
      currentScroll += (targetScroll - currentScroll) * ease

      if (Math.abs(targetScroll - currentScroll) < 0.05) {
        currentScroll = targetScroll
      }

      gsap.set(scrollContent, {
        y: -currentScroll,
      })

      requestAnimationFrame(smoothScroll)
    }

    // Set initial height
    const updateHeight = () => {
      if (scrollContent) {
        document.body.style.height = `${scrollContent.offsetHeight}px`
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    // Start smooth scroll loop
    requestAnimationFrame(smoothScroll)

    return () => {
      window.removeEventListener('resize', updateHeight)
      document.body.style.height = ''
    }
  }, [])

  return (
    <div ref={scrollContainerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', overflow: 'hidden' }}>
      <div ref={scrollContentRef}>
        {children}
      </div>
    </div>
  )
}

