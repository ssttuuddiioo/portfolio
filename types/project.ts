export interface Project {
  _id: string
  _type: 'project'
  title: string
  slug: {
    _type: 'slug'
    current: string
  }
  tech?: string[]
  description?: string
  longDescription?: any[]
  image?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  model3D?: {
    _type: 'file'
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  projectUrl?: string
  githubUrl?: string
  featured?: boolean
  order?: number
}







