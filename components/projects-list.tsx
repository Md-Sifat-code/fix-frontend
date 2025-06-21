"use client"

import { useEffect, useState } from "react"
import { projectsService, type Project } from "@/services/projects-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        const data = await projectsService.getAll()
        setProjects(data)
      } catch (err) {
        console.error("Error loading projects:", err)
        setError("Failed to load projects. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading projects...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (projects.length === 0) {
    return <div className="text-center p-8">No projects found.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>#{project.number}</CardDescription>
              </div>
              <Badge variant={getBadgeVariant(project.stage)}>{project.stage}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Phase:</span>
                <span className="font-medium">{project.phase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">{new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getBadgeVariant(stage: Project["stage"]) {
  switch (stage) {
    case "inquiry":
      return "secondary"
    case "bidding":
      return "warning"
    case "active":
      return "success"
    case "completed":
      return "default"
    default:
      return "outline"
  }
}
