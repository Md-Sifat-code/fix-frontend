"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Project } from "@/components/ProjectForm"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
  onSelect: (project: Project) => void
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const progress = project.projectProgress || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Client: {project.clientName}</div>
          <div className="text-sm text-muted-foreground">Phase: {project.phase}</div>
          <div className="text-sm text-muted-foreground">Current Task: {project.currentTask}</div>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-right">{progress}% Complete</div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
