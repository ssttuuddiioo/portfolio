'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { AnimatedLink } from './AnimatedLink'
import { PressHighlight } from '@/types/pressHighlight'

interface LandingPageProps {
  pressHighlights: PressHighlight[]
}

export function LandingPage({ pressHighlights }: LandingPageProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    about: false,
    experience: false,
    press: false,
    contact: false,
  })

  const aboutContentRef = useRef<HTMLDivElement>(null)
  const experienceContentRef = useRef<HTMLDivElement>(null)
  const pressContentRef = useRef<HTMLDivElement>(null)
  const contactContentRef = useRef<HTMLDivElement>(null)

  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const experienceSectionRef = useRef<HTMLDivElement>(null)
  const pressSectionRef = useRef<HTMLDivElement>(null)
  const contactSectionRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: string) => {
    const isOpening = !openSections[section]
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    
    // Scroll up by 500px when opening a section
    if (isOpening) {
      setTimeout(() => {
        window.scrollBy({ top: -500, behavior: 'smooth' })
      }, 100)
    }
  }

  useEffect(() => {
    const contentRef = aboutContentRef.current
    if (contentRef) {
      if (openSections.about) {
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
      } else {
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.about])

  useEffect(() => {
    const contentRef = experienceContentRef.current
    if (contentRef) {
      if (openSections.experience) {
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
      } else {
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.experience])

  useEffect(() => {
    const contentRef = pressContentRef.current
    if (contentRef) {
      if (openSections.press) {
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
      } else {
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.press])

  useEffect(() => {
    const contentRef = contactContentRef.current
    if (contentRef) {
      if (openSections.contact) {
        gsap.fromTo(
          contentRef,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out' }
        )
      } else {
        gsap.to(contentRef, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
      }
    }
  }, [openSections.contact])

  return (
    <div className="bg-[#0020FF] text-white">
      {/* Page 1 - Intro */}
      <div className="min-h-screen flex flex-col p-8 md:p-12 lg:p-16">
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Section - Large Heading */}
          <div className="flex-1" style={{ paddingTop: '50px', paddingLeft: '40px' }}>
            <h1 style={{ fontSize: '4.6rem', lineHeight: '1.1', maxWidth: '75%' }} className="font-bold text-white">
              Hi. I&apos;m{' '}
              <AnimatedLink
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: '#FFFFFF !important', textDecorationColor: 'white' }}
              >
                Pablo
              </AnimatedLink>
              , an experiential artist, technologist, and designer from Colombia,
              living and working in{' '}
              <span className="line-through" style={{ color: 'white' }}>ATL</span>,{' '}
              <span className="line-through" style={{ color: 'white' }}>MIA</span>,{' '}
              <span className="line-through" style={{ color: 'white' }}>BOG</span>, NYC.
            </h1>
            <AnimatedLink 
              href="#work"
              style={{ fontSize: '2.5rem', lineHeight: '1', marginTop: '80px', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
              className="font-bold underline cursor-pointer"
            >
              View Work   
            </AnimatedLink>
            <AnimatedLink 
              href="#contact"
              style={{ fontSize: '2.5rem', lineHeight: '1', marginLeft: '30px', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
              className="font-bold underline cursor-pointer"
            >
              Contact
            </AnimatedLink>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div ref={aboutSectionRef} className="flex flex-col" style={{ padding: '60px 90px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('about')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>About</h2>
            <span style={{ fontSize: '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.about ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={aboutContentRef}
            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '120px', marginTop: '40px', paddingBottom: '20px' }}>
              <div>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '18px', lineHeight: '1.6' }}>
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
      <div ref={experienceSectionRef} className="flex flex-col" style={{ padding: '60px 90px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('experience')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Experience</h2>
            <span style={{ fontSize: '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.experience ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={experienceContentRef}
            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '120px', marginTop: '40px', paddingBottom: '20px' }}>
              <div>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '140px' }}>
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
                      href="https://studio-studio.us" 
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
            </div>
          </div>
        </div>
      </div>

      {/* Press Section */}
      <div ref={pressSectionRef} className="flex flex-col" style={{ padding: '60px 90px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('press')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Press</h2>
            <span style={{ fontSize: '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.press ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={pressContentRef}
            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
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
      <div ref={contactSectionRef} className="flex flex-col" style={{ padding: '60px 90px' }}>
        <div className="w-full">
          <div className="border-t border-white" />
          
          <div 
            onClick={() => toggleSection('contact')}
            className="cursor-pointer py-8 flex items-center justify-between"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Contact</h2>
            <span style={{ fontSize: '40px', fontWeight: '300', lineHeight: '1' }}>
              {openSections.contact ? '−' : '+'}
            </span>
          </div>

          <div 
            ref={contactContentRef}
            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '120px', marginTop: '40px', paddingBottom: '20px' }}>
              <div>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '18px', lineHeight: '1.6' }}>
                <div>
                  <p style={{ margin: 0, marginBottom: '12px', opacity: 0.7 }}>Email</p>
                  <AnimatedLink
                    href="mailto:hello@pablognecco.com"
                    style={{ fontSize: '20px', fontWeight: '500' }}
                  >
                    hello@pablognecco.com
                  </AnimatedLink>
                </div>
                <div>
                  <p style={{ margin: 0, marginBottom: '12px', opacity: 0.7 }}>Instagram</p>
                  <AnimatedLink
                    href="https://instagram.com/yopablo"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '20px', fontWeight: '500' }}
                  >
                    @yopablo
                  </AnimatedLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
