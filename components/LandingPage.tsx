'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Instagram, Mail, Phone, Plus, X } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { AnimatedLink } from './AnimatedLink'
import { InteractiveBio } from './InteractiveBio'
import { SCAN_BUTTON_SIZE, SCAN_BUTTONS_LIFT_MOBILE, SCAN_ROW_DESKTOP, SCAN_STRIP } from './scanLayout'

const ScanFigure = dynamic(() => import('./ScanFigure'), { ssr: false })

// Space under the footer wordmark, and the desktop footer bottom row's height
// (padding + button-height spacer + border); the desktop landing wordmark sits at the same height
// the footer wordmark ends up at the bottom of the page, so the two screens match
const FOOTER_WORDMARK_GAP = 350
const FOOTER_ROW_DESKTOP = 20 + SCAN_BUTTON_SIZE.desktop + 16 + 1

// The big YOPABLO wordmark, stretched to the full width it's given
function Wordmark({ style, id }: { style?: React.CSSProperties; id?: string }) {
  return (
    <svg id={id} viewBox="0 0 1000 160" width="100%" role="img" aria-label="YOPABLO" style={{ display: 'block', overflow: 'visible', ...style }}>
      <text
        x="0"
        y="140"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontSize="175"
        fontWeight="700"
        fill="#FFFFFF"
        style={{ fontFamily: 'inherit' }}
      >
        YOPABLO
      </text>
    </svg>
  )
}

// Desktop width of the About / Contact sections: half the content width minus half the old 60px column gap
const TEXT_COLUMN_WIDTH = 'calc((100% - 60px) / 2)'
// Desktop About / Contact width, as a share of the text column
const SECTION_WIDTH_DESKTOP = 0.6
import { PressHighlight } from '@/types/pressHighlight'
import { Project } from '@/types/project'
import { urlFor } from '@/sanity/lib/image'

gsap.registerPlugin(ScrollToPlugin)

interface LandingPageProps {
  pressHighlights: PressHighlight[]
  projects: Project[]
  workIntroText?: string
}

export function LandingPage({ pressHighlights, projects, workIntroText }: LandingPageProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: true,
    experience: false,
    press: false,
    contact: true,
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMedium, setIsMedium] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const emptyForm = { name: '', email: '', message: '', subscribe: false }
  const [formData, setFormData] = useState(emptyForm)
  const [showMessage, setShowMessage] = useState(false) // message box opens via "+ Add a message"
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [comingSoonMessage, setComingSoonMessage] = useState<string | null>(null)
  const [isWorkOpen, setIsWorkOpen] = useState(false)

  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const aboutInitRef = useRef(false)
  const experienceSectionRef = useRef<HTMLDivElement>(null)
  const experienceContentRef = useRef<HTMLDivElement>(null)
  const pressSectionRef = useRef<HTMLDivElement>(null)
  const pressContentRef = useRef<HTMLDivElement>(null)
  const contactContentRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)
  const contactInitRef = useRef(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const navLinksRef = useRef<HTMLDivElement>(null)
  const heroContainerRef = useRef<HTMLDivElement>(null)
  const landingRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const workPanelRef = useRef<HTMLDivElement>(null)

  const categories = [
    'Art',
    'Commercial',
    'Installation',
    'Tools',
    'Branding',
    'Vibe Coded',
    'Photography',
    'Design',
    'Editing',
    'AR/XR',
    'Motion Graphics',
    'Neat Ideas',
  ]

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category?.includes(selectedCategory))
    : projects

  const toggleAndScrollToSection = (section: string, sectionRef: React.RefObject<HTMLDivElement | null>) => {
    const isCurrentlyOpen = openSections[section]
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    
    // Only scroll if we're opening the section
    // Scroll starts immediately to run in parallel with expansion animation
    if (!isCurrentlyOpen && sectionRef.current) {
      // Calculate the exact scroll position to place section at top of viewport
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY
      gsap.to(window, {
        scrollTo: { y: sectionTop, autoKill: false },
        duration: 0.8,
        ease: 'power2.inOut'
      })
    }
  }

  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!openSections.about) {
      setOpenSections(prev => ({ ...prev, about: true }))
    }
    // Scroll to About section with header-like spacing
    // Position nav bar at top as header, with equal space above/below the divider line
    if (aboutSectionRef.current) {
      gsap.to(window, {
        scrollTo: { y: aboutSectionRef.current, offsetY: 160, autoKill: true },
        duration: 1.0,
        ease: 'power2.inOut'
      })
    }
  }

  const scrollToContact = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault()
    const wasOpen = openSections.contact
    if (!openSections.contact) {
      setOpenSections(prev => ({ ...prev, contact: true }))
    }
    
    if (contactSectionRef.current) {
      const delay = wasOpen ? 0 : (mobile ? 200 : 150)
      
      setTimeout(() => {
        const sectionElement = contactSectionRef.current
        if (!sectionElement) return

        // Centre the section's visible block (divider line through the form) on screen,
        // past its top/bottom padding; if it's taller than the screen, show it from the top
        const block = (sectionElement.firstElementChild as HTMLElement | null) || sectionElement
        const rect = block.getBoundingClientRect()
        const blockTop = rect.top + window.scrollY
        const centred = blockTop + rect.height / 2 - window.innerHeight / 2
        const fromTop = blockTop - (mobile ? 12 : 48)
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const targetY = Math.max(0, Math.min(rect.height < window.innerHeight ? centred : fromTop, maxScroll))

        // Detect iOS Safari
        const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                           !(window as any).MSStream

        if (isIOSSafari || mobile) {
          // Native smooth scroll on phones (they scroll natively, see SmoothScroll)
          window.scrollTo({ top: targetY, behavior: 'smooth' })
        } else {
          gsap.killTweensOf(window)
          gsap.to(window, {
            scrollTo: { y: targetY, autoKill: false },
            duration: 1.0,
            ease: 'power2.inOut'
          })
        }
      }, delay)
    }
  }

  // The 3D figure's animation follows the section in the middle of the screen: pacing on the
  // landing, dancing through the bio and About, typing at Contact, lying down at the bottom.
  // A section has to hold the middle for a moment before the animation switches, so a fast
  // scroll crossfades once to where it stops instead of flickering through every section.
  const [sectionClip, setSectionClip] = useState('pacing')
  useEffect(() => {
    const sections: [React.RefObject<HTMLDivElement | null>, string][] = [
      [landingRef, 'pacing'],
      [heroContainerRef, 'dancing'],
      [aboutSectionRef, 'dancing'],
      [contactSectionRef, 'typing'],
      [footerRef, 'laying'],
    ]
    // Page position from layout offsets, which ignore the smooth scroll's transform
    const pageTop = (el: HTMLElement) => {
      let top = 0
      for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop
      return top
    }
    let timer: ReturnType<typeof setTimeout> | null = null
    const update = () => {
      const probe = window.scrollY + window.innerHeight / 2
      const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2
      let next = 'pacing'
      for (const [ref, clipName] of sections) {
        if (ref.current && pageTop(ref.current) <= probe) next = clipName
      }
      if (atBottom) next = 'laying'
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => setSectionClip(next), 150)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const scrollToBio = () => {
    if (!heroContainerRef.current) return
    const top = heroContainerRef.current.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  const showComingSoon = (e: React.MouseEvent<HTMLAnchorElement>, message: string) => {
    e.preventDefault()
    setComingSoonMessage(message)
    setTimeout(() => setComingSoonMessage(null), 2000)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Basic validation (the message is optional)
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormStatus('error')
      return
    }

    setFormStatus('submitting')

    try {
      const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT
      
      if (!formspreeEndpoint) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Formspree endpoint not configured')
        }
        setFormStatus('error')
        return
      }

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subscribe: formData.subscribe ? 'yes' : 'no', // add to the mailing list
        }),
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData(emptyForm)
        setShowMessage(false)
        // Reset success message after 5 seconds
        setTimeout(() => setFormStatus('idle'), 5000)
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormStatus('error')
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const checked = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : undefined
    setFormData(prev => ({ ...prev, [name]: checked ?? value }))
    // Reset error status when user starts typing
    if (formStatus === 'error') {
      setFormStatus('idle')
    }
  }

  useEffect(() => {
    setHasMounted(true)
    let lockedWidth = 0
    const checkBreakpoints = () => {
      const width = window.innerWidth
      setIsMobile(width < 900)
      setIsMedium(width >= 900 && width < 1500)
      // Lock the hero to the screen height; only re-measure when the width changes
      // (rotation, window resize), never for keyboard or browser-bar height changes
      if (width !== lockedWidth) {
        lockedWidth = width
        document.documentElement.style.setProperty('--hero-h', `${window.innerHeight}px`)
      }
    }
    
    checkBreakpoints()
    window.addEventListener('resize', checkBreakpoints)
    
    return () => window.removeEventListener('resize', checkBreakpoints)
  }, [])

  useEffect(() => {
    const contentRef = aboutContentRef.current
    if (contentRef) {
      if (openSections.about) {
        // Open by default on first mount — show instantly, no animation
        if (!aboutInitRef.current) {
          aboutInitRef.current = true
          gsap.set(contentRef, { height: 'auto', opacity: 1 })
          contentRef.style.overflow = 'visible'
          return
        }
        contentRef.style.overflow = 'hidden'
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { 
            height: 'auto', 
            opacity: 1, 
            duration: 0.6, 
            ease: 'power2.out',
            onComplete: () => {
              contentRef.style.overflow = 'visible'
            }
          }
        )
      } else {
        aboutInitRef.current = true
        contentRef.style.overflow = 'hidden'
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.about])

  useEffect(() => {
    const contentRef = experienceContentRef.current
    if (contentRef) {
      if (openSections.experience) {
        contentRef.style.overflow = 'hidden'
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { 
            height: 'auto', 
            opacity: 1, 
            duration: 0.6, 
            ease: 'power2.out',
            onComplete: () => {
              contentRef.style.overflow = 'visible'
            }
          }
        )
      } else {
        contentRef.style.overflow = 'hidden'
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.experience])

  useEffect(() => {
    const contentRef = pressContentRef.current
    if (contentRef) {
      if (openSections.press) {
        contentRef.style.overflow = 'hidden'
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { 
            height: 'auto', 
            opacity: 1, 
            duration: 0.6, 
            ease: 'power2.out',
            onComplete: () => {
              contentRef.style.overflow = 'visible'
            }
          }
        )
      } else {
        contentRef.style.overflow = 'hidden'
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.press])

  useEffect(() => {
    const contentRef = contactContentRef.current
    if (contentRef) {
      if (openSections.contact) {
        // On first mount the section is open by default — show it instantly, no auto-scroll
        if (!contactInitRef.current) {
          contactInitRef.current = true
          gsap.set(contentRef, { height: 'auto', opacity: 1 })
          contentRef.style.overflow = 'visible'
          return
        }
        contentRef.style.overflow = 'hidden'
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { 
            height: 'auto', 
            opacity: 1, 
            duration: 0.6, 
            ease: 'power2.out',
            onComplete: () => {
              contentRef.style.overflow = 'visible'
              // Ensure we are really at the bottom after expansion finishes
              gsap.to(window, {
                scrollTo: { y: document.body.scrollHeight, autoKill: false },
                duration: 0.5,
                ease: 'power2.out'
              })
            }
          }
        )
        
        // Start scrolling immediately as it opens
        gsap.to(window, {
          scrollTo: { y: document.body.scrollHeight + 1000, autoKill: false }, // Overshoot to ensure max
          duration: 1.0,
          ease: 'power2.inOut'
        })
      } else {
        contactInitRef.current = true
        contentRef.style.overflow = 'hidden'
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.contact])

  // Work panel slide animation and scroll lock
  useEffect(() => {
    if (workPanelRef.current) {
      if (isWorkOpen) {
        // Lock body scroll
        document.body.style.overflow = 'hidden'
        gsap.to(workPanelRef.current, {
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      } else {
        // Unlock body scroll
        document.body.style.overflow = ''
        gsap.to(workPanelRef.current, {
          x: '100%',
          duration: 0.6,
          ease: 'power3.in',
        })
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
    }
  }, [isWorkOpen])

  // Use a constant year to avoid hydration issues
  const currentYear = new Date().getFullYear()
  
  // Use mobile state only after mount to prevent hydration mismatch
  // Server always renders desktop mode, client updates after mount
  // Use breakpoint states only after mount to prevent hydration mismatch
  // Server always renders desktop mode, client updates after mount
  const mobile = hasMounted ? isMobile : false
  const medium = hasMounted ? isMedium : false

  // Show only the Contact section for now — flip to true to restore Work, About, Experience, Press
  const showSecondarySections = false

  return (
    <div className="text-white" suppressHydrationWarning>
      {/* 3D scan pinned bottom-right behind the page (also paints the blue background) */}
      {hasMounted && <ScanFigure mobile={mobile} sectionClip={sectionClip} onContactClick={() => scrollToContact()} onInfoClick={scrollToBio} />}

      {/* Landing: just the pinned 3D figure with YOPABLO across it; the bio follows on scroll.
          Mobile: the wordmark sits right above the clip buttons, and the landing and the rest
          of the page are scroll-snap areas so the first scroll glides straight to the bio (see
          .snap-start in globals.css). Desktop: the wordmark sits where the footer one ends up
          at the bottom of the page. */}
      <div ref={landingRef} className={mobile ? 'snap-start' : undefined} style={{ position: 'relative', height: mobile ? 'var(--hero-h, 100svh)' : '100vh' }}>
        <Wordmark
          id="landing-wordmark" // the 3D figure lies on top of it (see ScanFigure)
          style={
            mobile
              ? {
                  position: 'absolute',
                  left: '32px',
                  width: 'calc(100% - 64px)',
                  // top edge of the buttons, plus a small gap
                  bottom: `${SCAN_BUTTONS_LIFT_MOBILE + (SCAN_STRIP.mobile + SCAN_BUTTON_SIZE.mobile) / 2 + 12}px`,
                }
              : {
                  position: 'absolute',
                  left: '88px',
                  width: 'calc(100% - 176px)',
                  bottom: `${FOOTER_WORDMARK_GAP + FOOTER_ROW_DESKTOP}px`,
                }
          }
        />
      </div>

      {/* Everything after the landing, as one snap area that scrolls freely inside */}
      <div className={mobile ? 'snap-start' : undefined}>

      {/* Page 1 - Intro */}
      <div ref={heroContainerRef} className="flex flex-col pb-safe hero-container" style={{ 
        position: 'relative', 
        padding: mobile ? '12px' : '48px',
        height: mobile ? 'var(--hero-h, 100svh)' : 'auto',
        minHeight: mobile ? 'var(--hero-h, 100svh)' : '100vh',
        maxHeight: mobile ? 'var(--hero-h, 100svh)' : 'none',
        overflow: mobile ? 'hidden' : 'visible'
      }}>
        {/* Desktop: "View selected projects" with the contact links under it, at the bottom of the
            first screen; the links row is level with the 3D clip buttons on the right */}
        {!mobile && (
          <div style={{
            position: 'absolute',
            left: '88px',
            bottom: `${SCAN_ROW_DESKTOP.centerFromBottom - SCAN_BUTTON_SIZE.desktop / 2}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            zIndex: 1,
          }}>
            <span style={{ fontSize: 'clamp(0.945rem, 2.52vw + 0.63rem, 2.835rem)', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
              <AnimatedLink href="https://studiostudio.nyc" target="_blank" rel="noopener noreferrer" className="underline">
                View selected projects
              </AnimatedLink>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '18px', height: `${SCAN_BUTTON_SIZE.desktop}px` }}>
              <AnimatedLink href="https://instagram.com/yopablo" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Instagram size={22} strokeWidth={1.5} />
                  @yopablo
                </span>
              </AnimatedLink>
              <AnimatedLink href="mailto:artcoffeecomputer@gmail.com" style={{ color: '#FFFFFF' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={22} strokeWidth={1.5} />
                  artcoffeecomputer@gmail.com
                </span>
              </AnimatedLink>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col" style={{ minHeight: 0, height: '100%', justifyContent: 'space-between' }}>
          {/* Top Section - Large Heading */}
          <div style={{ 
            paddingTop: mobile ? '20px' : '40px', // matches paddingLeft so the text sits as far from the top as from the left 
            paddingLeft: mobile ? '20px' : '40px', 
            paddingRight: mobile ? '20px' : '40px', 
            flex: mobile ? '1 1 auto' : '1',
            minHeight: 0,
            overflow: 'hidden'
          }}>
            <div ref={titleRef}>
              <InteractiveBio mobile={mobile} showWorkLink={mobile} />
            </div>
          </div>
          
          {/* Navigation Links - Bottom on mobile, top on desktop */}
          <div ref={navLinksRef} className="hero-nav-container" style={{ 
            marginTop: mobile ? 'auto' : '80px',
            paddingLeft: mobile ? '20px' : '40px',
            paddingRight: mobile ? '20px' : '40px',
            paddingBottom: mobile ? '0' : '0',
            display: 'flex', 
            flexDirection: mobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: mobile ? 'center' : 'space-between',
            gap: mobile ? '6px' : '0',
            position: 'relative',
            zIndex: 10000,
            flexShrink: 0,
            flexGrow: 0
          }}>
            <div className="hero-nav-links" style={{ 
              display: 'flex', 
              flexDirection: mobile ? 'row' : 'row',
              gap: mobile ? '6px' : '0',
              flexWrap: 'wrap',
              justifyContent: mobile ? 'center' : 'flex-start',
              alignItems: 'center',
              order: mobile ? 0 : 0
            }}>
              {showSecondarySections && (
                <>
              <AnimatedLink
                href="#work"
                onClick={(e) => {
                  e.preventDefault()
                  setIsWorkOpen(true)
                }}
                style={{ 
                  lineHeight: '1', 
                  display: 'inline-block', 
                  color: '#FFFFFF',
                  fontSize: mobile ? 'clamp(0.875rem, 1.2vw + 0.4rem, 1.125rem)' : 'clamp(1.5rem, 3vw + 1rem, 3.75rem)',
                  padding: mobile ? '6px 4px' : '8px 0',
                  textDecorationThickness: '1px',
                  textUnderlineOffset: '2px',
                  fontWeight: '700',
                }} 
                className="font-bold underline cursor-pointer min-h-[44px] hero-nav-link"
              >
                View Work   
              </AnimatedLink>
              <AnimatedLink 
                href="#about"
                onClick={scrollToAbout}
                style={{ 
                  lineHeight: '1', 
                  marginLeft: mobile ? '0' : '30px', 
                  display: 'inline-block', 
                  color: '#FFFFFF',
                  fontSize: mobile ? 'clamp(1rem, 1.5vw + 0.5rem, 1.25rem)' : 'clamp(1.5rem, 3vw + 1rem, 3.75rem)',
                  padding: mobile ? '8px 4px' : '8px 0',
                  textDecorationThickness: '1px',
                  textUnderlineOffset: '2px',
                  fontWeight: '700',
                }} 
                className="font-bold underline cursor-pointer min-h-[44px] hero-nav-link"
              >
                About
              </AnimatedLink>
                </>
              )}
            </div>
          </div>
        </div>
        
      </div>

      {/* Work Section - Only visible when opened */}
      {/* Work section content moved to /app/work/page.tsx */}

      {/* About Section */}
      <div ref={aboutSectionRef} className="flex flex-col" style={{ padding: mobile ? '100px 32px' : '200px 88px' }}>
        {/* Desktop: narrower than the text column, centred on the page */}
        <div className="w-full" style={{ maxWidth: mobile ? '100%' : `calc(${TEXT_COLUMN_WIDTH} * ${SECTION_WIDTH_DESKTOP})`, margin: mobile ? undefined : '0 auto' }}>
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleAndScrollToSection('about', aboutSectionRef)}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '24px', paddingBottom: '24px' }}
          >
            <h2 style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>About me</h2>
            <span style={{ fontSize: mobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.about ? '−' : '+'}
            </span>
          </div>

          <div
            ref={aboutContentRef}
            style={{ opacity: 1 }}
          >
            <div style={{ marginTop: '40px', paddingBottom: '60px' }}>
              {/* Bio content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: mobile ? '16px' : '18px', lineHeight: '1.6' }}>
                <p style={{ margin: 0 }}>
                  I’m Pablo. I was born in Colombia, grew up in Atlanta, went to art school in Savannah, and have spent the last 14 years in Brooklyn directing large-scale light installations and interactive experiences.
                </p>
                <p style={{ margin: 0 }}>
                  I founded{' '}
                  <AnimatedLink href="https://studiostudio.nyc" target="_blank" rel="noopener noreferrer" className="underline">Studio Studio</AnimatedLink>
                  {' '}in 2015 at NEW INC, the New Museum’s art and technology incubator. Since then I’ve made work for brands, entertainment networks, and cultural institutions, often alongside creative teams at agencies. Lately I’m most excited about how quickly an idea can become a stable prototype, whether it’s fully digital or an interactive light piece.
                </p>
                {/* Desktop only: mobile keeps the About text to the first two paragraphs */}
                {!mobile && (
                  <>
                  <p style={{ margin: 0 }}>
                    I also run{' '}
                    <AnimatedLink href="https://origen.nyc" target="_blank" rel="noopener noreferrer" className="underline">Origen</AnimatedLink>
                    , a coffee company that buys directly from farmers in Colombia. Our coffee comes from Finca Bellavista in Charalá, Santander.
                  </p>
                  <p style={{ margin: 0 }}>
                    Outside the studio I’m usually on a bike, in the water, or carrying a camera. I’m open to new work, including consulting and freelance. If you’re building something interesting, write me. I’d like to hear about it.
                  </p>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {showSecondarySections && (
      <>
      {/* Experience Section */}
      <div ref={experienceSectionRef} className="flex flex-col" style={{ padding: mobile ? '0 32px' : '0 88px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleAndScrollToSection('experience', experienceSectionRef)}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '24px', paddingBottom: '24px' }}
          >
            <h2 style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Experience</h2>
            <span style={{ fontSize: mobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.experience ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={experienceContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '20px' : '60px', marginTop: '40px', paddingBottom: '60px' }}>
              {/* Left Column - Bullet point on desktop, hidden on mobile */}
              {!mobile && (
                <div>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                </div>
              )}

              {/* Right Column - Experience content */}
              {mobile ? (
                // Mobile view - list with strokes
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Experiential Director</h3>
                      <AnimatedLink
                        href="https://chemistrycreative.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center"
                        style={{ fontSize: '16px' }}
                      >
                        Chemistry Creative Inc. ↗
                      </AnimatedLink>
                    </div>

                    <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Founder</h3>
                      <AnimatedLink
                        href="https://studiostudio.nyc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center"
                        style={{ fontSize: '16px' }}
                      >
                        Studio–Studio ↗
                      </AnimatedLink>
                    </div>

                    <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Creative Technologist</h3>
                      <AnimatedLink
                        href="https://invisiblenorth.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center"
                        style={{ fontSize: '16px' }}
                      >
                        Invisible North ↗
                      </AnimatedLink>
                    </div>

                    <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Creative Technologist</h3>
                      <AnimatedLink
                        href="https://giantspoon.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center"
                        style={{ fontSize: '16px' }}
                      >
                        Giant Spoon ↗
                      </AnimatedLink>
                    </div>

                    <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Motion Designer</h3>
                      <AnimatedLink
                        href="https://leaddog.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center"
                        style={{ fontSize: '16px' }}
                      >
                        Leaddog Marketing ↗
                      </AnimatedLink>
                    </div>

                    <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Designer</h3>
                      <AnimatedLink
                        href="https://movl.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center"
                        style={{ fontSize: '16px' }}
                      >
                        MOVL ↗
                      </AnimatedLink>
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop view - two columns with dates
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2022-2025</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Experiential Director</h3>
                      <AnimatedLink
                        href="https://chemistrycreative.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: '18px' }}
                      >
                        Chemistry Creative Inc. ↗
                      </AnimatedLink>
                    </div>

                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2018-2019</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Creative Technologist</h3>
                      <AnimatedLink
                        href="https://invisiblenorth.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: '18px' }}
                      >
                        Invisible North ↗
                      </AnimatedLink>
                    </div>

                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2012-2013</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Motion Designer</h3>
                      <AnimatedLink
                        href="https://leaddog.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: '18px' }}
                      >
                        Leaddog Marketing ↗
                      </AnimatedLink>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2015-Present</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Founder</h3>
                      <AnimatedLink
                        href="https://studiostudio.nyc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: '18px' }}
                      >
                        Studio–Studio ↗
                      </AnimatedLink>
                    </div>

                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2017-2018</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Creative Technologist</h3>
                      <AnimatedLink
                        href="https://giantspoon.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: '18px' }}
                      >
                        Giant Spoon ↗
                      </AnimatedLink>
                    </div>

                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2010-2011</div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Designer</h3>
                      <AnimatedLink
                        href="https://movl.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: '18px' }}
                      >
                        MOVL ↗
                      </AnimatedLink>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Press Section */}
      <div ref={pressSectionRef} className="flex flex-col" style={{ padding: mobile ? '0 32px' : '0 88px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleAndScrollToSection('press', pressSectionRef)}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '24px', paddingBottom: '24px' }}
          >
            <h2 style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Press</h2>
            <span style={{ fontSize: mobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.press ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={pressContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '20px' : '60px', marginTop: '40px', paddingBottom: '60px' }}>
              {/* Left Column - Bullet point on desktop, hidden on mobile */}
              {!mobile && (
                <div>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                </div>
              )}

              {/* Right Column - Press content */}
              {pressHighlights.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" style={{ fontSize: '17px' }}>
                    <tbody>
                      {pressHighlights.map((highlight) => {
                        const formattedDate = new Date(highlight.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })

                        return (
                          <tr
                            key={highlight._id}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                          >
                            <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingRight: '24px' }}>
                              <AnimatedLink
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                              >
                                {highlight.title}
                              </AnimatedLink>
                            </td>
                            {!mobile && (
                              <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingRight: '24px' }}>
                                <AnimatedLink
                                  href={highlight.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="no-underline"
                                >
                                  {formattedDate}
                                </AnimatedLink>
                              </td>
                            )}
                            <td style={{ paddingTop: '20px', paddingBottom: '20px', paddingRight: '24px' }}>
                              <AnimatedLink
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                              >
                                {highlight.publication}
                              </AnimatedLink>
                            </td>
                            <td style={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'right' }}>
                              <AnimatedLink
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                              >
                                ↗
                              </AnimatedLink>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Contact Section */}
      <div ref={contactSectionRef} className="flex flex-col" style={{ padding: mobile ? '48px 32px' : '200px 88px' }}>
        {/* Desktop: narrower than the text column, centred on the page */}
        <div className="w-full" style={{ maxWidth: mobile ? '100%' : `calc(${TEXT_COLUMN_WIDTH} * ${SECTION_WIDTH_DESKTOP})`, margin: mobile ? undefined : '0 auto' }}>
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleAndScrollToSection('contact', contactSectionRef)}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: mobile ? '16px' : '24px', paddingBottom: mobile ? '16px' : '24px' }}
          >
            <h2 style={{ fontSize: mobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Contact</h2>
            <span style={{ fontSize: mobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.contact ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={contactContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <style dangerouslySetInnerHTML={{ __html: `
              input[type="text"]::placeholder,
              input[type="email"]::placeholder,
              textarea::placeholder {
                color: rgba(255, 255, 255, 1) !important;
                opacity: 1 !important;
              }
              input[type="text"]::-webkit-input-placeholder,
              input[type="email"]::-webkit-input-placeholder,
              textarea::-webkit-input-placeholder {
                color: rgba(255, 255, 255, 1) !important;
                opacity: 1 !important;
              }
              input[type="text"]::-moz-placeholder,
              input[type="email"]::-moz-placeholder,
              textarea::-moz-placeholder {
                color: rgba(255, 255, 255, 1) !important;
                opacity: 1 !important;
              }
              input[type="text"]:-ms-input-placeholder,
              input[type="email"]:-ms-input-placeholder,
              textarea:-ms-input-placeholder {
                color: rgba(255, 255, 255, 1) !important;
                opacity: 1 !important;
              }
            `}} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '20px' : '40px', marginTop: mobile ? '8px' : '40px', paddingBottom: mobile ? '24px' : '60px' }}>
              {/* Direct contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', fontSize: mobile ? '16px' : '18px' }}>
                {[
                  { href: 'https://instagram.com/yopablo', label: '@yopablo', Icon: Instagram, external: true },
                  { href: 'mailto:hello@studiostudio.nyc', label: 'hello@studiostudio.nyc', Icon: Mail },
                  { href: 'tel:+13477221388', label: '(347) 722-1388', Icon: Phone },
                ].map(({ href, label, Icon, external }) => (
                  <AnimatedLink
                    key={href}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{ color: '#FFFFFF' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={mobile ? 18 : 20} strokeWidth={1.5} />
                      {label}
                    </span>
                  </AnimatedLink>
                ))}
              </div>

              {/* Contact Form */}
              <div>
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '12px' : '24px', width: '100%' }}>
                  {/* Name and email on one line */}
                  <div style={{ display: 'flex', gap: mobile ? '12px' : '24px' }}>
                    {/* Name Field */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Name"
                        required
                        disabled={formStatus === 'submitting'}
                        style={{
                          width: '100%',
                          padding: mobile ? '8px 0' : '12px 0',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 1)',
                          color: '#FFFFFF',
                          fontSize: mobile ? '16px' : '18px', // 16px+ stops iOS zooming in on focus
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Email Field */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Email"
                        required
                        disabled={formStatus === 'submitting'}
                        style={{
                          width: '100%',
                          padding: mobile ? '8px 0' : '12px 0',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 1)',
                          color: '#FFFFFF',
                          fontSize: mobile ? '16px' : '18px', // 16px+ stops iOS zooming in on focus
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Message Field: closed until "+ Add a message" */}
                  {showMessage ? (
                    <div>
                      <textarea
                        ref={messageRef}
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Message"
                        rows={mobile ? 3 : 4}
                        disabled={formStatus === 'submitting'}
                        style={{
                          width: '100%',
                          padding: mobile ? '8px 0' : '12px 0',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 1)',
                          color: '#FFFFFF',
                          fontSize: mobile ? '16px' : '18px', // 16px+ stops iOS zooming in on focus
                          fontFamily: 'inherit',
                          outline: 'none',
                          resize: 'vertical',
                          minHeight: mobile ? '64px' : '80px',
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMessage(true)
                        requestAnimationFrame(() => messageRef.current?.focus())
                      }}
                      disabled={formStatus === 'submitting'}
                      style={{
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: mobile ? '8px 0' : '12px 0',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: mobile ? '16px' : '18px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={mobile ? 18 : 20} strokeWidth={1.5} />
                      Add a message
                    </button>
                  )}

                  {/* Mailing list opt-in */}
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      alignSelf: 'flex-start',
                      fontSize: mobile ? '16px' : '18px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      name="subscribe"
                      checked={formData.subscribe}
                      onChange={handleFormChange}
                      disabled={formStatus === 'submitting'}
                      style={{ width: '18px', height: '18px', margin: 0, accentColor: '#FDF843', cursor: 'pointer' }}
                    />
                    Add me to the mailing list
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    style={{
                      alignSelf: 'flex-start',
                      padding: mobile ? '8px 0' : '12px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 1)',
                      color: '#FFFFFF',
                      fontSize: mobile ? '16px' : '18px', // 16px+ stops iOS zooming in on focus
                      fontFamily: 'inherit',
                      cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer',
                      opacity: formStatus === 'submitting' ? 0.5 : 1,
                    }}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : formStatus === 'success' ? 'Sent ✓' : 'Send'}
                  </button>

                  {/* Status Messages */}
                  {formStatus === 'error' && (
                    <div style={{ color: '#FFFFFF', fontSize: '14px', opacity: 0.7, marginTop: '-16px' }}>
                      Something went wrong. Please try again.
                    </div>
                  )}
                  {formStatus === 'success' && (
                    <div style={{ color: '#FFFFFF', fontSize: '14px', opacity: 0.7, marginTop: '-16px' }}>
                      Message sent successfully!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="flex flex-col" style={{ 
        padding: mobile ? '0 32px' : '0 88px',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div className="w-full" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          
          {/* Footer wordmark */}
          <div style={{
            paddingTop: mobile ? '40px' : '48px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '500px',
          }}>
            <Wordmark id="footer-wordmark" style={{ marginTop: '350px', marginBottom: `${FOOTER_WORDMARK_GAP}px` }} />

          </div>

          {/* Bottom Row */}
          <div className="pb-safe" style={{ 
            marginTop: 'auto',
            paddingTop: '20px',
            paddingBottom: mobile ? '40px' : '16px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            // Desktop: three columns so the copyright sits dead centre: (spacer) | © | (Work)
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : '1fr auto 1fr',
            rowGap: '16px',
            alignItems: 'center',
            fontSize: '13px'
          }}>
            {/* Desktop: empty left column (button height) so the copyright stays centred and the row keeps its height */}
            {!mobile && <div style={{ height: `${SCAN_BUTTON_SIZE.desktop}px` }} />}

            <div style={{ opacity: 0.5, textAlign: 'center' }} suppressHydrationWarning>© {currentYear} Pablo Gnecco</div>

            <div style={{ display: mobile ? 'none' : 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
              {showSecondarySections && (
                <AnimatedLink href="/work" style={{ opacity: 0.6 }}>Work</AnimatedLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      {comingSoonMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#0020FF',
            color: '#FFFFFF',
            padding: '20px 40px',
            fontSize: mobile ? '24px' : '32px',
            fontWeight: '700',
            zIndex: 10000,
            pointerEvents: 'none',
            opacity: comingSoonMessage ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {comingSoonMessage}
        </div>
      )}

      {/* Work Panel Overlay */}
      <div
        ref={workPanelRef}
        className="min-h-screen min-h-[100dvh]"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 10001,
          display: 'flex',
          transform: 'translateX(100%)',
          pointerEvents: isWorkOpen ? 'auto' : 'none',
        }}
      >
        {/* 100px Blue Column - Click to go back */}
        <div
          onClick={() => setIsWorkOpen(false)}
          style={{
            width: mobile ? '60px' : '100px',
            height: '100%',
            backgroundColor: '#0020FF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <X size={mobile ? 24 : 32} color="#FFFFFF" strokeWidth={1.5} />
        </div>

        {/* Work Content Area */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            overflowY: 'auto',
            height: '100%',
          }}
        >
          {/* Work Content */}
          <div style={{ padding: mobile ? '40px 20px' : '60px 40px' }}>
            <div className="w-full">
              <div style={{ paddingBottom: '32px' }}>
                <h2 style={{ fontSize: mobile ? '32px' : '48px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0, color: '#000000' }}>Work</h2>
                <p style={{ fontSize: mobile ? '14px' : '16px', fontWeight: '500', letterSpacing: '0.05em', margin: '12px 0 0 0', color: '#0020FF', textTransform: 'uppercase' }}>Under Construction</p>
              </div>

              <div className="border-t border-black" />

              <div>
                {/* Top Section: Text on left, Two stacked rectangles on right */}
                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '40px' : '120px', alignItems: 'start' }}>
                  {/* Left Column - Text */}
                  <div>
                    <p style={{ fontSize: mobile ? '16px' : '18px', lineHeight: '1.6', margin: 0, maxWidth: '100%', color: '#000000' }}>
                      {workIntroText || 'A collection of experiential installations, interactive works, and creative technology projects spanning public art, brand activations, and cultural institutions.'}
                    </p>
                  </div>

                  {/* Right Column - Two stacked rectangles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredProjects.slice(0, 2).map((project, index) => (
                      <div
                        key={project._id}
                        style={{
                          aspectRatio: '1',
                          backgroundColor: '#E5E5E5',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: project.projectUrl ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                          if (project.projectUrl) {
                            window.open(project.projectUrl, '_blank', 'noopener,noreferrer')
                          }
                        }}
                      >
                        {project.image ? (
                          <Image
                            src={urlFor(project.image).width(800).height(800).url()}
                            alt={project.image.alt || project.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : null}
                      </div>
                    ))}
                    {/* Show placeholders if less than 2 projects */}
                    {filteredProjects.length < 2 && Array.from({ length: 2 - filteredProjects.length }).map((_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        style={{
                          aspectRatio: '1',
                          backgroundColor: '#E5E5E5',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Categories Section - Below text */}
                <div style={{ marginTop: '40px', maxWidth: mobile ? '100%' : '50%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Left Column Categories */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {categories.slice(0, 7).map((category) => {
                        const isActive = selectedCategory === category
                        
                        return (
                          <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            style={{
                              fontSize: '16px',
                              textAlign: 'left',
                              minHeight: '44px',
                              padding: '8px 12px',
                              background: isActive ? '#0020FF' : 'transparent',
                              color: isActive ? '#FFFFFF' : '#000000',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              opacity: selectedCategory && !isActive ? 0.3 : 1,
                              fontWeight: isActive ? '600' : '400',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = '#0020FF'
                                e.currentTarget.style.color = '#FFFFFF'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = '#000000'
                              }
                            }}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>

                    {/* Right Column Categories */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {categories.slice(7).map((category) => {
                        const isActive = selectedCategory === category
                        
                        return (
                          <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            style={{
                              fontSize: '16px',
                              textAlign: 'left',
                              minHeight: '44px',
                              padding: '8px 12px',
                              background: isActive ? '#0020FF' : 'transparent',
                              color: isActive ? '#FFFFFF' : '#000000',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              opacity: selectedCategory && !isActive ? 0.3 : 1,
                              fontWeight: isActive ? '600' : '400',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = '#0020FF'
                                e.currentTarget.style.color = '#FFFFFF'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = '#000000'
                              }
                            }}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Projects Grid - Below categories, left-aligned */}
                {filteredProjects.length > 2 && (
                  <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '20px', maxWidth: mobile ? '100%' : '50%' }}>
                    {filteredProjects.slice(2).map((project) => (
                      <div
                        key={project._id}
                        style={{
                          aspectRatio: '1',
                          backgroundColor: '#E5E5E5',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: project.projectUrl ? 'pointer' : 'default',
                        }}
                        onClick={() => {
                          if (project.projectUrl) {
                            window.open(project.projectUrl, '_blank', 'noopener,noreferrer')
                          }
                        }}
                      >
                        {project.image ? (
                          <Image
                            src={urlFor(project.image).width(800).height(800).url()}
                            alt={project.image.alt || project.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                {filteredProjects.length === 0 && (
                  <div style={{ marginTop: '40px', color: '#999', fontSize: '18px' }}>
                    {selectedCategory ? `No projects found in "${selectedCategory}" category.` : 'No projects available.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}
