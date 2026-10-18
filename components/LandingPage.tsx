'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Instagram, Mail, X } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { AnimatedLink } from './AnimatedLink'
import { InteractiveBio } from './InteractiveBio'

const ScanFigure = dynamic(() => import('./ScanFigure'), { ssr: false })

// Desktop width of the About / Contact sections: half the content width minus half the old 60px column gap
const TEXT_COLUMN_WIDTH = 'calc((100% - 60px) / 2)'
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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
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
        
        // Detect iOS Safari
        const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                           !(window as any).MSStream
        
        if (isIOSSafari || mobile) {
          // Find the header div with bullet point, or use section start
          const headerDiv = sectionElement.querySelector('div[class*="cursor-pointer"]') as HTMLElement
          const borderDiv = sectionElement.querySelector('.border-t') as HTMLElement
          const targetElement = borderDiv || headerDiv || sectionElement
          
          if (targetElement) {
            // Calculate exact position BEFORE scrolling
            const rect = targetElement.getBoundingClientRect()
            const elementTop = rect.top + window.scrollY
            const offset = mobile ? 12 : 48
            
            // Clamp to document bounds to prevent overshooting
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            const targetY = Math.max(0, Math.min(elementTop - offset, maxScroll))
            
            // Single smooth scroll to exact position - no adjustments needed
            window.scrollTo({ 
              top: targetY, 
              behavior: 'smooth' 
            })
          }
        } else {
          // Use GSAP for desktop (non-iOS); aim at the divider line, past the section's top padding
          const borderDiv = sectionElement.querySelector('.border-t') as HTMLElement | null
          const rect = (borderDiv || sectionElement).getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const offset = 48
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const targetY = Math.max(0, Math.min(elementTop - offset, maxScroll))
          
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
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
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
        }),
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
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
    setFormData(prev => ({ ...prev, [name]: value }))
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
      {hasMounted && <ScanFigure mobile={mobile} onContactClick={() => scrollToContact()} />}

      {/* Page 1 - Intro */}
      <div ref={heroContainerRef} className="flex flex-col pb-safe hero-container" style={{ 
        position: 'relative', 
        padding: mobile ? '12px' : '48px',
        height: mobile ? 'var(--hero-h, 100svh)' : 'auto',
        minHeight: mobile ? 'var(--hero-h, 100svh)' : '100vh',
        maxHeight: mobile ? 'var(--hero-h, 100svh)' : 'none',
        overflow: mobile ? 'hidden' : 'visible'
      }}>
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
              <InteractiveBio mobile={mobile} />
              {/* Contact links below bio */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: mobile ? '8px 20px' : '8px 32px', marginTop: mobile ? '20px' : '32px', fontSize: mobile ? '15px' : '18px' }}>
                <AnimatedLink href="https://instagram.com/yopablo" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Instagram size={mobile ? 18 : 22} strokeWidth={1.5} />
                    @yopablo
                  </span>
                </AnimatedLink>
                <AnimatedLink href="mailto:artcoffeecomputer@gmail.com" style={{ color: '#FFFFFF' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={mobile ? 18 : 22} strokeWidth={1.5} />
                    artcoffeecomputer@gmail.com
                  </span>
                </AnimatedLink>
              </div>
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
        {/* Desktop: as wide as the left text column, so the divider line stops at the text */}
        <div className="w-full" style={{ maxWidth: mobile ? '100%' : TEXT_COLUMN_WIDTH }}>
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
                  I’ve run my studio,{' '}
                  <AnimatedLink href="https://studiostudio.nyc" target="_blank" rel="noopener noreferrer" className="underline">Studio Studio</AnimatedLink>
                  , since 2015, when it started at NEW INC. Since then I’ve made work for brands, entertainment networks, and cultural institutions, with projects shown at major festivals and art fairs. Lately I’m most excited about permanent light installations and new media sculpture.
                </p>
                <p style={{ margin: 0 }}>
                  I also run{' '}
                  <AnimatedLink href="https://origen.nyc" target="_blank" rel="noopener noreferrer" className="underline">Origen</AnimatedLink>
                  , a coffee company that buys directly from farmers in Colombia. Our coffee comes from Finca Bellavista in Charalá, Santander.
                </p>
                <p style={{ margin: 0 }}>
                  Outside the studio I’m usually on a bike, in the water, or carrying a camera. I’m open to new work, including consulting and freelance. If you’re building something interesting, write me. I’d like to hear about it.
                </p>
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
      <div ref={contactSectionRef} className="flex flex-col" style={{ padding: mobile ? '100px 32px' : '200px 88px' }}>
        {/* Desktop: as wide as the left text column, so the divider line stops at the text */}
        <div className="w-full" style={{ maxWidth: mobile ? '100%' : TEXT_COLUMN_WIDTH }}>
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleAndScrollToSection('contact', contactSectionRef)}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '24px', paddingBottom: '24px' }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '32px' : '40px', marginTop: '40px', paddingBottom: '60px' }}>
              {/* CTA under the heading */}
              <div style={{ fontSize: mobile ? '16px' : '18px', lineHeight: '1.6' }}>
                <p style={{ margin: 0 }}>
                  Drop me a line, would love to hear from you about your next project or collaboration.
                </p>
              </div>

              {/* Contact Form */}
              <div>
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  {/* Name Field */}
                  <div>
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
                        padding: '12px 0',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 1)',
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
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
                        padding: '12px 0',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 1)',
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Message"
                      required
                      rows={4}
                      disabled={formStatus === 'submitting'}
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 1)',
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '80px',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '12px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 1)',
                      color: '#FFFFFF',
                      fontSize: '18px',
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
      <div className="flex flex-col" style={{ 
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
            <svg
              viewBox="0 0 1000 160"
              width="100%"
              role="img"
              aria-label="YOPABLO"
              style={{ display: 'block', overflow: 'visible', marginTop: '350px', marginBottom: '150px' }}
            >
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

          </div>

          {/* Bottom Row */}
          <div className="pb-safe" style={{ 
            marginTop: 'auto',
            paddingTop: '20px',
            // At the end of the page the Origen dot lines up with the fixed 3D clip
            // buttons (their row is centred 28px / 36px above the bottom of the screen)
            paddingBottom: mobile ? '10px' : '16px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            // Desktop: three columns so the copyright sits dead centre: Origen dot | © | (Work)
            // Mobile: copyright on its own line above, clear of the buttons
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : '1fr auto 1fr',
            rowGap: '16px',
            alignItems: 'center',
            fontSize: '13px'
          }}>
            {/* Origen coffee — same size as the 3D clip buttons */}
            <a
              href="https://origen.nyc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Origen coffee"
              title="Origen"
              className="origen-dot"
              style={{ display: 'block', justifySelf: 'start', width: mobile ? '36px' : '40px', height: mobile ? '36px' : '40px', borderRadius: '50%', backgroundColor: '#FF6700' }}
            />

            <div style={{ opacity: 0.5, textAlign: 'center', order: mobile ? -1 : 0 }} suppressHydrationWarning>© {currentYear} Pablo Gnecco</div>

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
  )
}
