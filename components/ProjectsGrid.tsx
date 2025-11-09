import { client } from '@/sanity/lib/client'
import ProjectCard from './ProjectCard'

async function getProjects() {
  const projects = await client.fetch(
    `*[_type == "project"] | order(order asc) {
      _id,
      title,
      slug,
      tech,
      description,
      image,
      projectUrl,
      githubUrl,
      featured
    }`
  )
  return projects
}

export default async function ProjectsGrid() {
  const projects = await getProjects()

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Featured Projects
          </h2>
          <div className="text-center text-gray-600">
            <p className="mb-4">No projects yet. Add some in your Sanity Studio!</p>
            <a 
              href="http://localhost:3333" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition"
            >
              Open Sanity Studio
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 md:text-5xl">
          Featured Projects
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}







