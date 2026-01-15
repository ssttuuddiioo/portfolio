'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface AnimatedLinkProps {
  href: string
  children: React.ReactNode
  target?: string
  rel?: string
  className?: string
  style?: React.CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  forceHighlight?: boolean
}

export function AnimatedLink({ href, children, target, rel, className = '', style = {}, onMouseEnter, onMouseLeave, onClick, forceHighlight = false }: AnimatedLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const forceHighlightRef = useRef(forceHighlight)

  // Keep ref in sync with prop
  useEffect(() => {
    forceHighlightRef.current = forceHighlight
  }, [forceHighlight])

  // Handle forceHighlight prop changes
  useEffect(() => {
    const highlight = highlightRef.current
    const text = textRef.current

    if (!highlight || !text) return

    if (forceHighlight) {
      // Force highlight on
      gsap.to(highlight, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      
      gsap.to(text, {
        color: '#0020FF',
        duration: 0.3,
        ease: 'power2.inOut',
      })
    }
  }, [forceHighlight])

  useEffect(() => {
    const link = linkRef.current
    const highlight = highlightRef.current
    const text = textRef.current

    if (!link || !highlight || !text) return

    const handleMouseEnter = () => {
      // Only animate if not forced
      if (!forceHighlightRef.current) {
        // Animate highlight from left to right
        gsap.to(highlight, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.inOut',
        })
        
        // Change text color
        gsap.to(text, {
          color: '#0020FF',
          duration: 0.3,
          ease: 'power2.inOut',
        })
      }
      
      // Call custom handler if provided
      if (onMouseEnter) onMouseEnter()
    }

    const handleMouseLeave = () => {
      // Only animate if not forced - use ref to get latest value
      if (!forceHighlightRef.current) {
        // Animate highlight back (right to left)
        gsap.to(highlight, {
          scaleX: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })
        
        // Reset text color
        gsap.to(text, {
          color: '#FFFFFF',
          duration: 0.3,
          ease: 'power2.inOut',
        })
      }
      
      // Call custom handler if provided
      if (onMouseLeave) onMouseLeave()
    }

    link.addEventListener('mouseenter', handleMouseEnter)
    link.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      link.removeEventListener('mouseenter', handleMouseEnter)
      link.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [onMouseEnter, onMouseLeave])

  return (
    <a
      ref={linkRef}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`relative inline-block ${className}`}
      style={{ 
        ...style, 
        position: 'relative',
        zIndex: 0,
      }}
    >
      <span
        ref={highlightRef}
        className="absolute bg-[#FDF843]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          zIndex: 0,
        }}
      />
      <span ref={textRef} style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </a>
  )
}

