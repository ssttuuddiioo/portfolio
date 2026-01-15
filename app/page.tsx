import { LandingPage } from '@/components/LandingPage'
import { client, isSanityConfigured } from '@/sanity/lib/client'
import { PressHighlight } from '@/types/pressHighlight'
import { Project } from '@/types/project'
import { SiteSettings } from '@/types/siteSettings'

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

async function getProjects(): Promise<Project[]> {
  if (!isSanityConfigured()) {
    return []
  }

  try {
    const query = `*[_type == "project"] | order(order asc) {
      _id,
      _type,
      title,
      slug,
      tech,
      description,
      image,
      projectUrl,
      githubUrl,
      featured,
      order,
      category
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured()) {
    return null
  }

  try {
    const query = `*[_type == "siteSettings"][0] {
      _id,
      _type,
      pressHighlightsTitle,
      heroTitle,
      contactEmail,
      socialLinks,
      workIntroText
    }`
    
    return await client.fetch(query)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export default async function Home() {
  const pressHighlights = await getPressHighlights()
  const projects = await getProjects()
  const siteSettings = await getSiteSettings()
  
  return (
    <div className="bg-[#0020FF]">
      <LandingPage 
        pressHighlights={pressHighlights}
        projects={projects}
        workIntroText={siteSettings?.workIntroText}
      />
    </div>
  )
}
