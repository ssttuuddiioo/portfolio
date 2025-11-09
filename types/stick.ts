export interface PortfolioStick {
  id: string
  skill: string // Display text on stick (e.g., "CODE", "DESIGN")
  client?: string // Client name (shown above stick on hover)
  title?: string // Project title (shown below stick on hover)
  description?: string // Project description (shown on click)
  rotationSpeed: number // -0.02 to 0.02
  length: number // 120-200px
  velocity: { x: number; y: number; z: number } // 3D velocity
  position: { x: number; y: number; z: number } // 3D position
  angle: number
  rotation3D?: { x: number; y: number; z: number } // Optional 3D rotation angles
  textVisible: boolean
  imageUrl?: string // Optional hover image
  isHovered: boolean
}

export interface StickPhysics {
  position: { x: number; y: number; z: number }
  velocity: { x: number; y: number; z: number }
  angle: number
  rotation3D?: { x: number; y: number; z: number }
  rotationSpeed: number
}

export type FormationType = 'scattered' | 'sphere' | 'cube' | 'grid' | 'helix' | 'wave' | 'hypercube'

