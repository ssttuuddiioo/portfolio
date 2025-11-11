import { LandingPage } from '@/components/LandingPage'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { PressHighlight } from '@/types/pressHighlight'

async function getPressHighlights(): Promise<PressHighlight[]> {
  if (!isSanityConfigured()) {
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

export default async function Home() {
  const pressHighlights = await getPressHighlights()
  
  return (
    <div className="bg-[#0020FF]">
      <LandingPage pressHighlights={pressHighlights} />
    </div>
  )
}
