'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  tech?: string[]
  description?: string
  image?: any
  projectUrl?: string
  githubUrl?: string
}

export default function ProjectCard({ project }: { project: Project }) {
  const imageUrl = project.image ? urlFor(project.image).width(600).height(400).url() : '/placeholder.jpg'

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-2xl">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={project.image?.alt || project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-2xl font-bold text-gray-900">{project.title}</h3>
        
        {project.tech && project.tech.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {project.tech.map((tech, index) => (
              <span
                key={index}
                className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {project.description && (
          <p className="mb-4 text-gray-600">{project.description}</p>
        )}
        
        <div className="flex gap-4">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-medium transition"
            >
              View Project →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 font-medium transition"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}







