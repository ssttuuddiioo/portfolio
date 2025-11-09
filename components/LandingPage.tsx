'use client'

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
              <a
                href="https://instagram.com/yopablo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:bg-[#FDF843] hover:!text-[#0020FF] transition-colors"
                style={{ color: '#FFFFFF !important', textDecorationColor: 'white' }}
              >
                Pablo
              </a>
              , an experiential artist, technologist, and designer from Colombia,
              living and working in{' '}
              <span className="line-through" style={{ color: 'white' }}>ATL</span>,{' '}
              <span className="line-through" style={{ color: 'white' }}>MIA</span>,{' '}
              <span className="line-through" style={{ color: 'white' }}>BOG</span>, NYC.
            </h1>
            <a 
              href="#work"
              style={{ fontSize: '2.5rem', lineHeight: '1', marginTop: '80px', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
              className="font-bold underline cursor-pointer hover:bg-[#FDF843] hover:!text-[#0020FF] transition-colors"
            >
              View Work   
            </a>
            <a 
              href="#contact"
              style={{ fontSize: '2.5rem', lineHeight: '1', marginLeft: '30px', display: 'inline-block', color: '#FFFFFF', fontWeight: 'bold' }} 
              className="font-bold underline cursor-pointer hover:bg-[#FDF843] hover:!text-[#0020FF] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>


    </div>
  )
}
