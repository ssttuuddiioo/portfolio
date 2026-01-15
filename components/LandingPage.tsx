'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Instagram, Twitter, Linkedin } from 'lucide-react'
import { AnimatedLink } from './AnimatedLink'
import { ImageRevealShader } from './ImageRevealShader'
import { PressHighlight } from '@/types/pressHighlight'
import { Project } from '@/types/project'

gsap.registerPlugin(ScrollToPlugin)

interface LandingPageProps {
  pressHighlights: PressHighlight[]
  projects: Project[]
  workIntroText?: string
}

export function LandingPage({ pressHighlights, projects, workIntroText }: LandingPageProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: false,
    experience: false,
    press: false,
    contact: false,
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isPabloHovered, setIsPabloHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [comingSoonMessage, setComingSoonMessage] = useState<string | null>(null)

  const aboutContentRef = useRef<HTMLDivElement>(null)
  const experienceContentRef = useRef<HTMLDivElement>(null)
  const pressContentRef = useRef<HTMLDivElement>(null)
  const contactContentRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!openSections.contact) {
      setOpenSections(prev => ({ ...prev, contact: true }))
    } else {
      // If already open, just scroll to it
      gsap.to(window, {
        scrollTo: { y: "max", autoKill: true },
        duration: 1.0,
        ease: 'power2.inOut'
      })
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
        console.error('Formspree endpoint not configured')
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const contentRef = aboutContentRef.current
    if (contentRef) {
      if (openSections.about) {
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
        contentRef.style.overflow = 'hidden'
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.contact])

  return (
    <div className="bg-[#0020FF] text-white">
      {/* Page 1 - Intro */}
      <div className="flex flex-col p-8 md:p-12 lg:p-16" style={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Section - Large Heading */}
          <div style={{ paddingTop: isMobile ? '20px' : '50px', paddingLeft: isMobile ? '20px' : '40px', flex: isMobile ? '0 0 auto' : '1' }}>
            <h1 style={{ fontSize: isMobile ? '2rem' : '4.6rem', lineHeight: '1.1', maxWidth: isMobile ? '100%' : '75%' }} className="font-bold text-white">
              Hi. I&apos;m{' '}
              <AnimatedLink
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: '#FFFFFF !important', textDecorationColor: 'white' }}
                onMouseEnter={() => setIsPabloHovered(true)}
                onMouseLeave={() => setIsPabloHovered(false)}
              >
                Pablo
              </AnimatedLink>
              , an experiential artist, technologist, and designer from Colombia,
              living and working in{' '}
              <span className="line-through" style={{ color: 'white' }}>ATL</span>,{' '}
              <span className="line-through" style={{ color: 'white' }}>MIA</span>,{' '}
              <span className="line-through" style={{ color: 'white' }}>BOG</span>, NYC.
            </h1>
          </div>
          
          {/* Navigation Links - Bottom on mobile, top on desktop */}
          <div style={{ 
            marginTop: isMobile ? 'auto' : '80px',
            paddingLeft: isMobile ? '20px' : '40px',
            paddingRight: isMobile ? '20px' : '40px',
            paddingBottom: isMobile ? '40px' : '0',
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '20px' : '0',
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '20px' : '0',
              flexWrap: 'wrap'
            }}>
              <AnimatedLink 
                href="#work"
                onClick={(e) => showComingSoon(e, 'Coming Soon')}
                style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', lineHeight: '1', marginLeft: isMobile ? '0' : '0', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
                className="font-bold underline cursor-pointer"
              >
                View Work   
              </AnimatedLink>
              <AnimatedLink 
                href="#contact"
                onClick={scrollToContact}
                style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', lineHeight: '1', marginLeft: isMobile ? '0' : '30px', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
                className="font-bold underline cursor-pointer"
              >
                Contact
              </AnimatedLink>
              <AnimatedLink 
                href="#experiments"
                onClick={(e) => showComingSoon(e, 'Coming Soon')}
                style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', lineHeight: '1', marginLeft: isMobile ? '0' : '30px', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
                className="font-bold underline cursor-pointer"
              >
                Experiments
              </AnimatedLink>
            </div>
            
            {/* Social Icons - Right aligned */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMobile ? '16px' : '20px' }}>
              <AnimatedLink 
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', color: '#FFFFFF' }}
              >
                <Instagram size={isMobile ? 32 : 40} strokeWidth={1.5} />
              </AnimatedLink>
              <AnimatedLink 
                href="https://x.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', color: '#FFFFFF' }}
              >
                <Twitter size={isMobile ? 32 : 40} strokeWidth={1.5} />
              </AnimatedLink>
              <AnimatedLink 
                href="https://www.linkedin.com/in/pablo-gnecco-7b700939/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', color: '#FFFFFF' }}
              >
                <Linkedin size={isMobile ? 32 : 40} strokeWidth={1.5} />
              </AnimatedLink>
            </div>
          </div>
        </div>
        
        {/* Pablo Portrait - Appears on hover with shader effect (hidden on mobile) */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '90px',
              width: '350px',
              height: '480px',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <ImageRevealShader
              imageUrl="/pablo-portrait.jpg"
              isVisible={isPabloHovered}
              width={350}
              height={480}
            />
          </div>
        )}
      </div>

      {/* Work Section - Only visible when opened */}
      {/* Work section content moved to /app/work/page.tsx */}

      {/* About Section */}
      <div className="flex flex-col" style={{ padding: isMobile ? '40px 20px' : '60px 40px 60px 40px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('about')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>About</h2>
            <span style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.about ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={aboutContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: isMobile ? '20px' : '120px', marginTop: '40px', paddingBottom: '20px' }}>
              {!isMobile && (
                <div>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: isMobile ? '16px' : '18px', lineHeight: '1.6', maxWidth: isMobile ? '100%' : '70%', marginLeft: isMobile ? '0' : 'auto' }}>
                <p style={{ margin: 0 }}>
                  Pablo Gnecco is a Colombian-born experiential director and creative
                  technologist based in New York. He creates immersive installations for public
                  art, brand activations, and cultural institutions—working at the intersection
                  of motion, interaction, and physical computing.
                </p>
                <p style={{ margin: 0 }}>
                  Clients include Google, Intel, Sony, and Michigan Central Station. An early
                  member of The New Museum&apos;s NEW INC and resident artist at Mana
                  Contemporary, Pablo founded Studio Studio and the 9to5.tv festival in
                  Atlanta.
                </p>
                <p style={{ margin: 0 }}>
                  Currently developing permanent light installations and new media sculptures
                  while building Origen, a specialty coffee company connecting roasters with
                  Colombian farmers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="flex flex-col" style={{ padding: isMobile ? '40px 20px' : '60px 40px 60px 40px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('experience')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Experience</h2>
            <span style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.experience ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={experienceContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: isMobile ? '20px' : '120px', marginTop: '40px', paddingBottom: '20px' }}>
              {!isMobile && (
                <div>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                </div>
              )}

              {isMobile ? (
                // Mobile view - list with strokes
                <div style={{ maxWidth: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ paddingTop: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Experiential Director</h3>
                      <AnimatedLink
                        href="https://chemistrycreative.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
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
                        style={{ fontSize: '16px' }}
                      >
                        MOVL ↗
                      </AnimatedLink>
                    </div>
                  </div>
                </div>
              ) : (
                // Desktop view - two columns with dates
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '350px', maxWidth: '70%', marginLeft: 'auto' }}>
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
      <div className="flex flex-col" style={{ padding: isMobile ? '40px 20px' : '60px 40px 60px 40px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('press')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Press</h2>
            <span style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.press ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={pressContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            {pressHighlights.length > 0 && (
              <div style={{ marginTop: '40px', paddingBottom: '20px' }}>
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
                            {!isMobile && (
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div ref={contactSectionRef} className="flex flex-col" style={{ padding: isMobile ? '40px 20px' : '60px 40px 60px 40px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('contact')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Contact</h2>
            <span style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '300', lineHeight: '1' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: isMobile ? '20px' : '120px', marginTop: '40px', paddingBottom: '20px' }}>
              {!isMobile && (
                <div>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
                </div>
              )}

              <div style={{ maxWidth: isMobile ? '100%' : '100%', marginLeft: isMobile ? '0' : '0' }}>
                <div style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.6' }}>
                  
                  {/* Contact Form */}
                  <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: isMobile ? '100%' : '1000px', width: '100%' }}>
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
      </div>

      {/* Footer */}
      <div className="flex flex-col" style={{ padding: isMobile ? '40px 20px 80px 20px' : '60px 40px 120px 40px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          <div style={{ paddingTop: '40px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '20px' : '0', fontSize: '14px', opacity: 0.7 }}>
            <div>© {new Date().getFullYear()} Pablo Gnecco</div>
            <div style={{ display: 'flex', gap: isMobile ? '20px' : '30px', alignItems: 'center' }}>
              <AnimatedLink
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Instagram size={18} strokeWidth={1.5} />
                <span>Instagram</span>
              </AnimatedLink>
              <AnimatedLink
                href="https://x.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Twitter size={18} strokeWidth={1.5} />
                <span>Twitter</span>
              </AnimatedLink>
              <AnimatedLink
                href="https://www.linkedin.com/in/pablo-gnecco-7b700939/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Linkedin size={18} strokeWidth={1.5} />
                <span>LinkedIn</span>
              </AnimatedLink>
              <AnimatedLink
                href="mailto:hello@pablognecco.com"
              >
                Email
              </AnimatedLink>
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
            fontSize: isMobile ? '24px' : '32px',
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

    </div>
  )
}
