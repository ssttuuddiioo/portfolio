export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  pressHighlightsTitle: string
  heroTitle?: string
  contactEmail?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    linkedin?: string
    github?: string
  }
  workIntroText?: string
}

