import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Sanity project IDs can only contain a-z, 0-9, and dashes.
// If the env var contains other characters (like underscores in "your_project_id"),
// we fallback to a safe dummy value to prevent the app from crashing on boot.
const isValidProjectId = projectId && /^[a-z0-9-]+$/.test(projectId)

if (!projectId) {
  console.warn('⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity client will not work.')
} else if (!isValidProjectId) {
  console.warn('⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID contains invalid characters. It should only contain a-z, 0-9, and dashes.')
}

export const client = createClient({
  projectId: isValidProjectId ? projectId : 'dummy-project-id', 
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // Set to true for production
})

// Helper to check if Sanity is configured
export const isSanityConfigured = () => !!projectId && isValidProjectId && projectId !== 'your_project_id'



