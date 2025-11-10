import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  console.warn('⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity client will not work.')
}

export const client = createClient({
  projectId: projectId || 'placeholder', // Use placeholder to prevent build errors
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Set to true for production
})

// Helper to check if Sanity is configured
export const isSanityConfigured = () => !!projectId && projectId !== 'placeholder'



