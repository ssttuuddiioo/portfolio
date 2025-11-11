import { client, isSanityConfigured } from '@/sanity/lib/client'
import { PressHighlight } from '@/types/pressHighlight'
import { SiteSettings } from '@/types/siteSettings'
import { AnimatedLink } from './AnimatedLink'

async function getPressHighlights(): Promise<PressHighlight[]> {
  if (!isSanityConfigured()) {
    console.warn('Sanity is not configured. Skipping press highlights fetch.')
    return []
  }

  try {
    const query = `*[_type == "pressHighlight"] | order(date desc) {
      _id,
      _type,
      title,
      date,
      publication,
      url,
      featured
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching press highlights:', error)
    return []
  }
}

async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) {
    console.warn('Sanity is not configured. Using default site settings.')
    return {
      _id: 'default',
      _type: 'siteSettings',
      pressHighlightsTitle: 'Press Highlights',
    }
  }

  try {
    const query = `*[_type == "siteSettings"][0] {
      _id,
      _type,
      pressHighlightsTitle,
      heroTitle,
      contactEmail,
      socialLinks
    }`
    
    const settings = await client.fetch(query)
    
    // Return default if no settings exist yet
    return settings || {
      _id: 'default',
      _type: 'siteSettings',
      pressHighlightsTitle: 'Press Highlights',
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return {
      _id: 'default',
      _type: 'siteSettings',
      pressHighlightsTitle: 'Press Highlights',
    }
  }
}

export async function PressHighlights() {
  const [highlights, settings] = await Promise.all([
    getPressHighlights(),
    getSiteSettings(),
  ])

  if (highlights.length === 0) {
    return null
  }

  return (
    <section className="min-h-screen flex flex-col p-8 md:p-12 lg:p-16" id="press" style={{ paddingTop: '100px', paddingLeft: '40px', paddingRight: '40px' }}>
      <div className="flex flex-col max-w-[1400px] w-full">
        <h2 className="text-5xl md:text-6xl font-bold mb-16 text-white">
          {settings.pressHighlightsTitle}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid white' }}>
                <th className="text-left font-bold text-white text-base md:text-lg" style={{ width: '50%', padding: '5px' }}>
                  {/* Title column - no header text */}
                </th>
                <th className="text-left font-bold text-white text-base md:text-lg whitespace-nowrap" style={{ padding: '5px' }}>
                  {/* Date column - no header text */}
                </th>
                <th className="text-left font-bold text-white text-base md:text-lg" style={{ padding: '5px' }}>
                  {/* Publication column - no header text */}
                </th>
                <th className="w-16" style={{ padding: '5px' }}></th>
              </tr>
            </thead>
            <tbody>
              {highlights.map((highlight) => {
                const formattedDate = new Date(highlight.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })

                return (
                  <tr
                    key={highlight._id}
                    className={`transition-all ${
                      highlight.featured
                        ? 'bg-[#FDF843]'
                        : ''
                    } hover:bg-white/5 cursor-pointer`}
                    style={{ borderBottom: '1.5px solid white' }}
                  >
                    <td
                      className={`text-lg md:text-xl ${
                        highlight.featured ? 'text-[#0020FF] font-bold' : 'text-white'
                      }`}
                      style={{ padding: '5px' }}
                    >
                      <AnimatedLink
                        href={highlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        {highlight.title}
                      </AnimatedLink>
                    </td>
                    <td
                      className={`text-lg md:text-xl whitespace-nowrap ${
                        highlight.featured ? 'text-[#0020FF]' : 'text-white'
                      }`}
                      style={{ padding: '5px' }}
                    >
                      <AnimatedLink
                        href={highlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        {formattedDate}
                      </AnimatedLink>
                    </td>
                    <td
                      className={`text-lg md:text-xl ${
                        highlight.featured ? 'text-[#0020FF]' : 'text-white'
                      }`}
                      style={{ padding: '5px' }}
                    >
                      <AnimatedLink
                        href={highlight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        {highlight.publication}
                      </AnimatedLink>
                    </td>
                    <td
                      className={`text-right text-2xl ${
                        highlight.featured ? 'text-[#0020FF]' : 'text-white'
                      }`}
                      style={{ padding: '5px' }}
                    >
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
    </section>
  )
}

