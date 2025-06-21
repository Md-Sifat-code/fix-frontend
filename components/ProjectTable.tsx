"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  number: string
  clientName: string
  location: string
  phase: string
  currentTask: string
  nextTask: string
  dueDate?: string
  taskDueDate?: string
  completedTasks: number
  totalTasks: number
  projectProgress?: number
}

interface ProjectTableProps {
  projects: Project[]
  type: "inquiry" | "bidding" | "active" | "completed"
  onProjectSelect: (project: Project) => void
}

export function ProjectTable({ projects, type, onProjectSelect }: ProjectTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<keyof Project>("name")

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.number.includes(searchTerm) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1
    if (a[sortBy] > b[sortBy]) return 1
    return 0
  })

  const calculateProgress = (value: number | undefined): number => {
    if (typeof value !== "number" || isNaN(value)) return 0
    return Math.max(0, Math.min(100, Math.round(value)))
  }

  const formatProgress = (value: number | undefined): string => {
    const progress = calculateProgress(value)
    return `${progress}%`
  }

  return (
    <div>
      <Input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => setSortBy("name")}>Project</TableHead>
            <TableHead onClick={() => setSortBy("clientName")}>Client</TableHead>
            <TableHead onClick={() => setSortBy("location")}>Location</TableHead>
            <TableHead onClick={() => setSortBy("phase")}>Phase</TableHead>
            <TableHead onClick={() => setSortBy("currentTask")}>Current Task</TableHead>
            {(type === "active" || type === "completed") && (
              <>
                <TableHead onClick={() => setSortBy("dueDate")}>Due Date</TableHead>
                <TableHead onClick={() => setSortBy("taskDueDate")}>Task Due Date</TableHead>
                {type === "active" && (
                  <>
                    <TableHead>Task Progress</TableHead>
                    <TableHead>Project Progress</TableHead>
                  </>
                )}
              </>
            )}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                {project.name}
                <div className="text-sm text-muted-foreground">{project.number}</div>
              </TableCell>
              <TableCell>{project.clientName}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>{project.phase}</TableCell>
              <TableCell>{project.currentTask}</TableCell>
              {(type === "active" || type === "completed") && (
                <>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>{project.taskDueDate}</TableCell>
                  {type === "active" && (
                    <>
                      <TableCell>
                        <Progress
                          value={calculateProgress((project.completedTasks / project.totalTasks) * 100)}
                          className="w-full"
                        />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {project.completedTasks}/{project.totalTasks} tasks completed (
                          {formatProgress((project.completedTasks / project.totalTasks) * 100)})
                        </span>
                      </TableCell>
                      <TableCell>
                        <Progress value={calculateProgress(project.projectProgress)} className="w-full" />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Overall progress: {formatProgress(project.projectProgress)}
                        </span>
                      </TableCell>
                    </>
                  )}
                </>
              )}
              <TableCell>
                <Button onClick={() => onProjectSelect(project)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
