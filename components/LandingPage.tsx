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
      <div className="flex flex-col" style={{ padding: '80px 160px' }}>
        <div className="w-full">
          <div className="border-t border-white" style={{ marginBottom: '60px' }} />
          
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <h2 className="text-xl font-normal mb-6">About</h2>
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            
            <div className="col-span-9 space-y-5" style={{ fontSize: '18px', lineHeight: '1.7' }}>
              <p>
                Pablo Gnecco is a Colombian-born experiential director and creative
                technologist based in New York. He creates immersive installations for public
                art, brand activations, and cultural institutions—working at the intersection
                of motion, interaction, and physical computing.
              </p>
              <p>
                Clients include Google, Intel, Sony, and Michigan Central Station. An early
                member of The New Museum&apos;s NEW INC and resident artist at Mana
                Contemporary, Pablo founded Studio Studio and the 9to5.tv festival in
                Atlanta.
              </p>
              <p>
                Currently developing permanent light installations and new media sculptures
                while building Origen, a specialty coffee company connecting roasters with
                Colombian farmers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Press Section */}
      <div className="flex flex-col" style={{ padding: '80px 160px' }}>
        <div className="w-full">
          <div className="border-t border-white" style={{ marginBottom: '60px' }} />
          
          <h2 className="text-xl font-normal mb-10">Press</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ fontSize: '16px' }}>
              <tbody>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-5 pr-6">BAM Rose Cinema</td>
                  <td className="py-5 pr-6">May 21, 2016</td>
                  <td className="py-5 pr-6">VICE</td>
                  <td className="py-5 text-right">
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block hover:opacity-70 transition-opacity"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-5 pr-6">Interactive Installation Turns Hand Gestures Into GIFs</td>
                  <td className="py-5 pr-6">May 21, 2014</td>
                  <td className="py-5 pr-6">VICE</td>
                  <td className="py-5 text-right">
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block hover:opacity-70 transition-opacity"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-5 pr-6">Interactive Installation Turns Hand Gestures Into GIFs</td>
                  <td className="py-5 pr-6">May 21, 2014</td>
                  <td className="py-5 pr-6">VICE</td>
                  <td className="py-5 text-right">
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block hover:opacity-70 transition-opacity"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-5 pr-6">Interactive Installation Turns Hand Gestures Into GIFs</td>
                  <td className="py-5 pr-6">May 21, 2014</td>
                  <td className="py-5 pr-6">VICE</td>
                  <td className="py-5 text-right">
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block hover:opacity-70 transition-opacity"
                    >
                      ↗
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="flex flex-col" style={{ padding: '80px 160px', minHeight: '100vh' }}>
        <div className="w-full">
          <div className="border-t border-white" style={{ marginBottom: '60px' }} />
          
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-3">
              <h2 className="text-xl font-normal mb-6">Experience</h2>
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-20 gap-y-16" style={{ fontSize: '16px' }}>
            {/* Left Column */}
            <div className="space-y-16">
              <div>
                <div className="mb-2 opacity-80">2022-2025</div>
                <h3 className="text-lg font-bold mb-1">Experiential Director</h3>
                <a 
                  href="https://chemistrycreative.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  Chemistry Creative Inc. ↗
                </a>
              </div>

              <div>
                <div className="mb-2 opacity-80">2018-2019</div>
                <h3 className="text-lg font-bold mb-1">Creative Technologist</h3>
                <a 
                  href="https://invisiblenorth.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  Invisible North ↗
                </a>
              </div>

              <div>
                <div className="mb-2 opacity-80">2012-2013</div>
                <h3 className="text-lg font-bold mb-1">Motion Designer</h3>
                <a 
                  href="https://leaddog.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  Leaddog Marketing ↗
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-16">
              <div>
                <div className="mb-2 opacity-80">2015-Present</div>
                <h3 className="text-lg font-bold mb-1">Founder</h3>
                <a 
                  href="https://studio-studio.us" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  Studio–Studio ↗
                </a>
              </div>

              <div>
                <div className="mb-2 opacity-80">2017-2018</div>
                <h3 className="text-lg font-bold mb-1">Creative Technologist</h3>
                <a 
                  href="https://giantspoon.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  Giant Spoon ↗
                </a>
              </div>

              <div>
                <div className="mb-2 opacity-80">2010-2011</div>
                <h3 className="text-lg font-bold mb-1">Designer</h3>
                <a 
                  href="https://movl.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  MOVL ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
