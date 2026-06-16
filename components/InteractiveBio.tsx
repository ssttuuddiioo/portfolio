'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

// Clickable role (the only interactive phrase) — "I’m a/an ___ who uses art and technology…"
const array1 = [
  'experiential director',
  'creative technologist',
  'installation artist',
  'light designer',
  'new media artist',
  'experience director',
  'spatial designer',
  'creative director',
]

interface InteractiveBioProps {
  mobile?: boolean
  className?: string
  style?: React.CSSProperties
}

export function InteractiveBio({ mobile = false, className = '', style = {} }: InteractiveBioProps) {
  const [array1Index, setArray1Index] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Wrapper ref for click animation
  const phrase1Ref = useRef<HTMLSpanElement>(null)

  // Highlight and text refs for hover animation
  const phrase1HighlightRef = useRef<HTMLSpanElement>(null)
  const phrase1TextRef = useRef<HTMLSpanElement>(null)

  const ctxRef = useRef<gsap.Context | null>(null)

  // Initialize GSAP context
  useEffect(() => {
    ctxRef.current = gsap.context(() => {})
    return () => {
      ctxRef.current?.revert()
    }
  }, [])

  // Hover handlers for the clickable phrase
  const setupHoverHandlers = useCallback(
    (
      highlightRef: React.RefObject<HTMLSpanElement | null>,
      textRef: React.RefObject<HTMLSpanElement | null>,
      wrapperRef: React.RefObject<HTMLSpanElement | null>
    ) => {
      const wrapper = wrapperRef.current
      const highlight = highlightRef.current
      const text = textRef.current

      if (!wrapper || !highlight || !text) return

      const handleMouseEnter = () => {
        // Animate highlight from left to right
        gsap.to(highlight, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.inOut',
        })

        // Change text color to blue
        gsap.to(text, {
          color: '#0020FF',
          duration: 0.3,
          ease: 'power2.inOut',
        })

        // Increase underline thickness
        text.style.textDecorationThickness = '3px'
      }

      const handleMouseLeave = () => {
        // Animate highlight back (right to left)
        gsap.to(highlight, {
          scaleX: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })

        // Reset text color to white
        gsap.to(text, {
          color: '#FFFFFF',
          duration: 0.3,
          ease: 'power2.inOut',
        })

        // Reset underline thickness
        text.style.textDecorationThickness = '1px'
      }

      wrapper.addEventListener('mouseenter', handleMouseEnter)
      wrapper.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        wrapper.removeEventListener('mouseenter', handleMouseEnter)
        wrapper.removeEventListener('mouseleave', handleMouseLeave)
      }
    },
    []
  )

  // Setup hover handlers for the clickable phrase
  useEffect(() => {
    const cleanup1 = setupHoverHandlers(phrase1HighlightRef, phrase1TextRef, phrase1Ref)
    return () => {
      cleanup1?.()
    }
  }, [setupHoverHandlers])

  const handlePhraseClick = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)

    const ref = phrase1Ref
    const nextIndex = (array1Index + 1) % array1.length

    // Animate out, then update text and animate in
    if (ref.current && ctxRef.current) {
      // Reset any existing transforms
      gsap.set(ref.current, { clearProps: 'all' })

      // Animate out with pixelation effect
      gsap.to(ref.current, {
        filter: 'blur(8px)',
        scale: 0.95,
        opacity: 0.3,
        duration: 0.125,
        ease: 'power2.in',
        onComplete: () => {
          // Update text
          setArray1Index(nextIndex)
          // Use requestAnimationFrame to ensure DOM update happens before animation
          requestAnimationFrame(() => {
            if (ref.current) {
              // Animate in with depixelation effect
              gsap.fromTo(
                ref.current,
                {
                  filter: 'blur(8px)',
                  scale: 0.95,
                  opacity: 0.3,
                },
                {
                  filter: 'blur(0px)',
                  scale: 1,
                  opacity: 1,
                  duration: 0.125,
                  ease: 'power2.out',
                  onComplete: () => {
                    setIsAnimating(false)
                  },
                }
              )
            }
          })
        },
      })
    }
  }, [array1Index, isAnimating])

  const currentPhrase1 = array1[array1Index]

  // Helper function to determine if we should use "a" or "an"
  const getArticle = (phrase: string): string => {
    const firstLetter = phrase.trim().charAt(0).toLowerCase()
    const vowels = ['a', 'e', 'i', 'o', 'u']
    return vowels.includes(firstLetter) ? 'an' : 'a'
  }

  const article1 = getArticle(currentPhrase1)

  return (
    <h1
      className={`font-bold text-white hero-title ${className}`}
      style={{
        lineHeight: mobile ? '1.2' : '1.1',
        maxWidth: mobile ? '100%' : '75%',
        fontSize: mobile ? 'clamp(2.025rem, 4.5vw + 0.9rem, 2.7rem)' : 'clamp(1.35rem, 3.6vw + 0.9rem, 4.05rem)',
        marginBottom: mobile ? '8px' : '0',
        ...style,
      }}
    >
      Hi. I’m Pablo. I’m {article1}{' '}
      <span
        ref={phrase1Ref}
        onClick={() => handlePhraseClick()}
        className="relative inline-block cursor-pointer"
        style={{
          position: 'relative',
          zIndex: 0,
        }}
      >
        <span
          ref={phrase1HighlightRef}
          className="absolute bg-[#FDF843]"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transformOrigin: 'left',
            transform: 'scaleX(0)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <span
          ref={phrase1TextRef}
          className="relative underline"
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#FFFFFF',
            textDecorationThickness: '1px',
            textUnderlineOffset: '2px',
            pointerEvents: 'none',
          }}
        >
          {currentPhrase1}
        </span>
      </span>
      {' '}
      who uses art and technology to create light installations, immersive experiences, and websites. I also like to ride my bike around New York City, the best city in the world, and currently I’m really into micro lot coffee farming and roasting.
    </h1>
  )
}
