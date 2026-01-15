'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Image from 'next/image'
import { Instagram } from 'lucide-react'
import { AnimatedLink } from '@/components/AnimatedLink'
import { ImageRevealShader } from '@/components/ImageRevealShader'
import { PressHighlight } from '@/types/pressHighlight'
import { Project } from '@/types/project'
import { urlFor } from '@/sanity/lib/image'

gsap.registerPlugin(ScrollToPlugin)

interface WorkPageProps {
  projects: Project[]
  workIntroText?: string
}

export default function WorkPage({ projects, workIntroText }: WorkPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isPabloHovered, setIsPabloHovered] = useState(false)

  const firstProjectRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      {/* Header / Navigation */}
      <div className="flex justify-between items-center p-8 md:p-12 lg:p-16">
        <AnimatedLink href="/" className="font-bold text-2xl">
          Pablo Gnecco
        </AnimatedLink>
        <div className="flex gap-8">
          <AnimatedLink href="/" className="font-bold">
            Home
          </AnimatedLink>
          <AnimatedLink href="/#contact" className="font-bold">
            Contact
          </AnimatedLink>
        </div>
      </div>

      <div style={{ padding: isMobile ? '40px 20px' : '0 40px 60px 40px' }}>
        <div className="w-full">
          <div className="border-t border-black" />
          
          <div style={{ paddingTop: '32px', paddingBottom: '32px' }}>
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Work</h2>
          </div>

          <div>
            {/* Top Section: Text on left, Two stacked rectangles on right */}
            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '120px', alignItems: 'start' }}>
              {/* Left Column - Text */}
              <div>
                <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.6', margin: 0, maxWidth: '100%' }}>
                  {workIntroText || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis, dolor sed consectetur gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.'}
                </p>
              </div>

              {/* Right Column - Two stacked rectangles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredProjects.slice(0, 2).map((project, index) => (
                  <div
                    key={project._id}
                    ref={index === 0 ? firstProjectRef : null}
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
                    ref={filteredProjects.length === 0 && index === 0 ? firstProjectRef : null}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: '#E5E5E5',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Categories Section - Below text */}
            <div style={{ marginTop: '40px', maxWidth: isMobile ? '100%' : '50%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left Column Categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.slice(0, 7).map((category) => {
                    const isActive = selectedCategory === category
                    
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        style={{
                          fontSize: '16px',
                          textAlign: 'left',
                          padding: '8px 0',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.slice(7).map((category) => {
                    const isActive = selectedCategory === category
                    
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        style={{
                          fontSize: '16px',
                          textAlign: 'left',
                          padding: '8px 0',
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
              <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', maxWidth: isMobile ? '100%' : '50%' }}>
                {filteredProjects.slice(2).map((project, index) => (
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
  )
}

