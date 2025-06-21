"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { projectsService } from "@/services/projects-service"
import type { Project } from "@/services/projects-service"

interface ProjectStageLayoutProps {
  project: Project
  children: React.ReactNode
  onProjectUpdate?: (updatedProject: Project) => void
}

export function ProjectStageLayout({ project, children, onProjectUpdate }: ProjectStageLayoutProps) {
  const { toast } = useToast()
  const [currentProject, setCurrentProject] = useState<Project>(project)

  // Update local state when project prop changes
  useEffect(() => {
    setCurrentProject(project)
  }, [project])

  // Function to update project stage
  const updateProjectStage = async (newStage: string) => {
    try {
      toast({
        title: "Updating project stage...",
        description: `Changing project stage from ${currentProject.stage} to ${newStage}`,
      })

      const updatedProject = await projectsService.update(currentProject.id, {
        stage: newStage,
        updated_at: new Date().toISOString(),
      })

      setCurrentProject(updatedProject)

      if (onProjectUpdate) {
        onProjectUpdate(updatedProject)
      }

      toast({
        title: "Project updated",
        description: `Project stage has been updated to ${newStage}`,
      })
    } catch (error) {
      console.error("Error updating project stage:", error)
      toast({
        title: "Error",
        description: "Failed to update project stage. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" data-project-stage={currentProject.stage || "unknown"}>
      {/* Header - Consistent with dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/studio" className="flex items-center text-gray-700 hover:text-gray-900">
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{currentProject.name}</h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>#{currentProject.number || "N/A"}</span>
                  <span>•</span>
                  <Badge
                    className={`
                      ${
                        currentProject.stage === "active"
                          ? "bg-green-100 text-green-800"
                          : currentProject.stage === "bidding"
                            ? "bg-blue-100 text-blue-800"
                            : currentProject.stage === "inquiry"
                              ? "bg-yellow-100 text-yellow-800"
                              : currentProject.stage === "proposal"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                      }
                    `}
                  >
                    {currentProject.stage?.charAt(0).toUpperCase() + currentProject.stage?.slice(1) || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Settings className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
    </div>
  )
}
