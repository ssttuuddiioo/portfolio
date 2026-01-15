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
  const [isPabloHovered, setIsPabloHovered] = useState(false)
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
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
        // Reset success message after 5 seconds
        setTimeout(() => setFormStatus('idle'), 5000)
      } else {
        // Handle Formspree error responses
        if (data.error) {
          console.error('Formspree error:', data.error)
        }
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

  // Use a constant year to avoid hydration issues
  const currentYear = 2025

  return (
    <div className="bg-[#0020FF] text-white">
      {/* Page 1 - Intro */}
      <div className="flex flex-col p-8 md:p-12 lg:p-16" style={{ height: 'calc(100vh - 100px)', position: 'relative' }}>
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Section - Large Heading */}
          <div className="pt-5 md:pt-[50px] pl-5 md:pl-10 flex-none md:flex-1">
            <h1 className="font-bold text-white text-[2rem] md:text-[4.6rem] leading-tight max-w-full md:max-w-[75%]">
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
          <div className="mt-auto md:mt-20 px-5 md:px-10 pb-10 md:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-0">
            <div className="flex flex-col md:flex-row gap-5 md:gap-0 flex-wrap">
              <AnimatedLink 
                href="#work"
                onClick={(e) => showComingSoon(e, 'Coming Soon')}
                className="font-bold underline cursor-pointer text-[1.8rem] md:text-[2.5rem] leading-none text-white"
              >
                View Work   
              </AnimatedLink>
              <AnimatedLink 
                href="#contact"
                onClick={scrollToContact}
                className="font-bold underline cursor-pointer text-[1.8rem] md:text-[2.5rem] leading-none ml-0 md:ml-[30px] text-white"
              >
                Contact
              </AnimatedLink>
              <AnimatedLink 
                href="#experiments"
                onClick={(e) => showComingSoon(e, 'Coming Soon')}
                className="font-bold underline cursor-pointer text-[1.8rem] md:text-[2.5rem] leading-none ml-0 md:ml-[30px] text-white"
              >
                Experiments
              </AnimatedLink>
            </div>
            
            {/* Social Icons - Right aligned */}
            <div className="inline-flex items-center gap-4 md:gap-5">
              <AnimatedLink 
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white"
              >
                <Instagram className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </AnimatedLink>
              <AnimatedLink 
                href="https://x.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white"
              >
                <Twitter className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </AnimatedLink>
              <AnimatedLink 
                href="https://www.linkedin.com/in/pablo-gnecco-7b700939/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-white"
              >
                <Linkedin className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </AnimatedLink>
            </div>
          </div>
        </div>
        
        {/* Pablo Portrait - Appears on hover with shader effect (hidden on mobile) */}
        <div
          className="hidden md:block absolute bottom-10 right-[90px] w-[350px] h-[480px] z-[9999] pointer-events-none"
        >
          <ImageRevealShader
            imageUrl="/pablo-portrait.jpg"
            isVisible={isPabloHovered}
            width={350}
            height={480}
          />
        </div>
      </div>

      {/* Work Section - Only visible when opened */}
      {/* Work section content moved to /app/work/page.tsx */}

      {/* About Section */}
      <div className="flex flex-col px-5 py-10 md:px-10 md:py-[60px]">
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('about')}
            className="cursor-pointer py-8 flex items-center justify-between"
          >
            <h2 className="text-2xl md:text-[32px] font-bold tracking-tight m-0">About</h2>
            <span className="text-[32px] md:text-[40px] font-light leading-none">
              {openSections.about ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={aboutContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 md:gap-[120px] mt-10 pb-5">
              <div className="hidden md:block">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              
              <div className="flex flex-col gap-7 text-base md:text-lg leading-relaxed max-w-full md:max-w-[70%] ml-0 md:ml-auto">
                <p className="m-0">
                  Pablo Gnecco is a Colombian-born experiential director and creative
                  technologist based in New York. He creates immersive installations for public
                  art, brand activations, and cultural institutions—working at the intersection
                  of motion, interaction, and physical computing.
                </p>
                <p className="m-0">
                  Clients include Google, Intel, Sony, and Michigan Central Station. An early
                  member of The New Museum&apos;s NEW INC and resident artist at Mana
                  Contemporary, Pablo founded Studio Studio and the 9to5.tv festival in
                  Atlanta.
                </p>
                <p className="m-0">
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
      <div className="flex flex-col px-5 py-10 md:px-10 md:py-[60px]">
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('experience')}
            className="cursor-pointer py-8 flex items-center justify-between"
          >
            <h2 className="text-2xl md:text-[32px] font-bold tracking-tight m-0">Experience</h2>
            <span className="text-[32px] md:text-[40px] font-light leading-none">
              {openSections.experience ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={experienceContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 md:gap-[120px] mt-10 pb-5">
              <div className="hidden md:block">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              {/* Mobile view - list with strokes */}
              <div className="block md:hidden max-w-full">
                <div className="flex flex-col">
                  <div className="py-5 border-b border-white/20">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Experiential Director</h3>
                    <AnimatedLink href="https://chemistrycreative.com" target="_blank" rel="noopener noreferrer" className="text-base">
                      Chemistry Creative Inc. ↗
                    </AnimatedLink>
                  </div>
                  <div className="py-5 border-b border-white/20">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Founder</h3>
                    <AnimatedLink href="https://studiostudio.nyc" target="_blank" rel="noopener noreferrer" className="text-base">
                      Studio–Studio ↗
                    </AnimatedLink>
                  </div>
                  <div className="py-5 border-b border-white/20">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Creative Technologist</h3>
                    <AnimatedLink href="https://invisiblenorth.com" target="_blank" rel="noopener noreferrer" className="text-base">
                      Invisible North ↗
                    </AnimatedLink>
                  </div>
                  <div className="py-5 border-b border-white/20">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Creative Technologist</h3>
                    <AnimatedLink href="https://giantspoon.com" target="_blank" rel="noopener noreferrer" className="text-base">
                      Giant Spoon ↗
                    </AnimatedLink>
                  </div>
                  <div className="py-5 border-b border-white/20">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Motion Designer</h3>
                    <AnimatedLink href="https://leaddog.com" target="_blank" rel="noopener noreferrer" className="text-base">
                      Leaddog Marketing ↗
                    </AnimatedLink>
                  </div>
                  <div className="py-5">
                    <h3 className="text-lg font-bold mb-2 tracking-tight">Designer</h3>
                    <AnimatedLink href="https://movl.com" target="_blank" rel="noopener noreferrer" className="text-base">
                      MOVL ↗
                    </AnimatedLink>
                  </div>
                </div>
              </div>

              {/* Desktop view - two columns with dates */}
              <div className="hidden md:grid grid-cols-2 gap-x-[350px] max-w-[70%] ml-auto">
                {/* Left Column */}
                <div className="flex flex-col gap-16">
                  <div>
                    <div className="mb-3 text-base">• 2022-2025</div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Experiential Director</h3>
                    <AnimatedLink href="https://chemistrycreative.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg">
                      Chemistry Creative Inc. ↗
                    </AnimatedLink>
                  </div>
                  <div>
                    <div className="mb-3 text-base">• 2018-2019</div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Creative Technologist</h3>
                    <AnimatedLink href="https://invisiblenorth.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg">
                      Invisible North ↗
                    </AnimatedLink>
                  </div>
                  <div>
                    <div className="mb-3 text-base">• 2012-2013</div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Motion Designer</h3>
                    <AnimatedLink href="https://leaddog.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg">
                      Leaddog Marketing ↗
                    </AnimatedLink>
                  </div>
                </div>
                {/* Right Column */}
                <div className="flex flex-col gap-16">
                  <div>
                    <div className="mb-3 text-base">• 2015-Present</div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Founder</h3>
                    <AnimatedLink href="https://studiostudio.nyc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg">
                      Studio–Studio ↗
                    </AnimatedLink>
                  </div>
                  <div>
                    <div className="mb-3 text-base">• 2017-2018</div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Creative Technologist</h3>
                    <AnimatedLink href="https://giantspoon.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg">
                      Giant Spoon ↗
                    </AnimatedLink>
                  </div>
                  <div>
                    <div className="mb-3 text-base">• 2010-2011</div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Designer</h3>
                    <AnimatedLink href="https://movl.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg">
                      MOVL ↗
                    </AnimatedLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Press Section */}
      <div className="flex flex-col px-5 py-10 md:px-10 md:py-[60px]">
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('press')}
            className="cursor-pointer py-8 flex items-center justify-between"
          >
            <h2 className="text-2xl md:text-[32px] font-bold tracking-tight m-0">Press</h2>
            <span className="text-[32px] md:text-[40px] font-light leading-none">
              {openSections.press ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={pressContentRef}
            style={{ height: 0, opacity: 0 }}
          >
            {pressHighlights.length > 0 && (
              <div className="mt-10 pb-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[17px]">
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
                            <td className="py-5 pr-6">
                              <AnimatedLink
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                              >
                                {highlight.title}
                              </AnimatedLink>
                            </td>
                            <td className="hidden md:table-cell py-5 pr-6">
                              <AnimatedLink
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                              >
                                {formattedDate}
                              </AnimatedLink>
                            </td>
                            <td className="py-5 pr-6">
                              <AnimatedLink
                                href={highlight.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="no-underline"
                              >
                                {highlight.publication}
                              </AnimatedLink>
                            </td>
                            <td className="py-5 text-right">
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
      <div ref={contactSectionRef} className="flex flex-col px-5 py-10 md:px-10 md:py-[60px]">
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('contact')}
            className="cursor-pointer py-8 flex items-center justify-between"
          >
            <h2 className="text-2xl md:text-[32px] font-bold tracking-tight m-0">Contact</h2>
            <span className="text-[32px] md:text-[40px] font-light leading-none">
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
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 md:gap-[120px] mt-10 pb-5">
              <div className="hidden md:block">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              <div className="max-w-full">
                <div className="text-base md:text-lg leading-relaxed">
                  
                  {/* Contact Form */}
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 max-w-full md:max-w-[1000px] w-full">
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
      <div className="flex flex-col px-5 py-10 pb-20 md:px-10 md:py-[60px] md:pb-[120px]">
        <div className="w-full">
          <div className="border-t border-white" />
          <div className="pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-0 text-sm opacity-70">
            <div>© {currentYear} Pablo Gnecco</div>
            <div className="flex gap-5 md:gap-[30px] items-center">
              <AnimatedLink
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Instagram size={18} strokeWidth={1.5} />
                <span>Instagram</span>
              </AnimatedLink>
              <AnimatedLink
                href="https://x.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Twitter size={18} strokeWidth={1.5} />
                <span>Twitter</span>
              </AnimatedLink>
              <AnimatedLink
                href="https://www.linkedin.com/in/pablo-gnecco-7b700939/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
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
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0020FF] text-white px-10 py-5 text-2xl md:text-[32px] font-bold z-[10000] pointer-events-none transition-opacity duration-300"
        >
          {comingSoonMessage}
        </div>
      )}

    </div>
  )
}
