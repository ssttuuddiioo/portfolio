'use client'

import { AnimatedLink } from './AnimatedLink'

export function LandingPage() {
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
      <div className="flex flex-col" style={{ padding: '60px 90px' }}>
        <div className="w-full">
          <div className="border-t border-white" style={{ marginBottom: '70px' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '120px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '400', marginBottom: '24px', letterSpacing: '-0.01em' }}>About</h2>
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

      {/* Experience Section */}
      <div className="flex flex-col" style={{ padding: '60px 90px', minHeight: '100vh' }}>
        <div className="w-full">
          <div className="border-t border-white" style={{ marginBottom: '70px' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '120px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '400', marginBottom: '24px', letterSpacing: '-0.01em' }}>Experience</h2>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '140px' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                <div>
                  <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2022-2025</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Experiential Director</h3>
                  <a 
                    href="https://chemistrycreative.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontSize: '18px' }}
                  >
                    Chemistry Creative Inc. ↗
                  </a>
                </div>

                <div>
                  <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2018-2019</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Creative Technologist</h3>
                  <a 
                    href="https://invisiblenorth.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontSize: '18px' }}
                  >
                    Invisible North ↗
                  </a>
                </div>

                <div>
                  <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2012-2013</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Motion Designer</h3>
                  <a 
                    href="https://leaddog.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontSize: '18px' }}
                  >
                    Leaddog Marketing ↗
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
                <div>
                  <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2015-Present</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Founder</h3>
                  <a 
                    href="https://studio-studio.us" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontSize: '18px' }}
                  >
                    Studio–Studio ↗
                  </a>
                </div>

                <div>
                  <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2017-2018</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Creative Technologist</h3>
                  <a 
                    href="https://giantspoon.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontSize: '18px' }}
                  >
                    Giant Spoon ↗
                  </a>
                </div>

                <div>
                  <div style={{ marginBottom: '12px', fontSize: '16px' }}>• 2010-2011</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.01em' }}>Designer</h3>
                  <a 
                    href="https://movl.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ fontSize: '18px' }}
                  >
                    MOVL ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
