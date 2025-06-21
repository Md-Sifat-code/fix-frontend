"use client"

import { useState } from "react"
import { ActiveProjectReview } from "./ActiveProjectReview"
import { Button } from "@/components/ui/button"
import type { ProjectInfo, Objective, FinancialSettings } from "@/types"

// Mock data for demonstration
const mockProject = {
  projectInfo: {
    projectName: "Sample Active Project",
    clientName: "John Doe",
    projectAddress: "123 Main St",
    projectCity: "Anytown",
    projectState: "CA",
    projectZip: "12345",
    projectType: "commercial",
    projectSize: 5000,
    estimatedBudget: "500000",
    additionalNotes: "This is a sample active project.",
  } as ProjectInfo,
  objectives: [
    {
      id: "obj1",
      name: "Schematic Design",
      tasks: [
        {
          id: "task1",
          name: "Initial Design Concepts",
          start: new Date().getTime(),
          duration: 14,
          staffHours: {
            principal: 10,
            projectArchitect: 20,
            projectManager: 30,
            designer: 40,
            drafter: 50,
            consultant: 1000,
          },
        },
      ],
    },
  ] as Objective[],
  financialSettings: {
    firmMultiplier: 3,
    staffRoles: {
      principal: { title: "Principal", rate: 250 },
      projectArchitect: { title: "Project Architect", rate: 200 },
      projectManager: { title: "Project Manager", rate: 175 },
      designer: { title: "Designer", rate: 125 },
      drafter: { title: "Drafter", rate: 100 },
    },
  } as FinancialSettings,
  contractSignDate: new Date(),
  targetCompletionDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
}

export function ActiveProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof mockProject | null>(null)

  const handleProjectSelect = () => {
    setSelectedProject(mockProject)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Active Projects</h1>
      {selectedProject ? (
        <div>
          <Button onClick={() => setSelectedProject(null)} className="mb-4">
            Back to Project List
          </Button>
          <ActiveProjectReview project={selectedProject} />
        </div>
      ) : (
        <div>
          <Button onClick={handleProjectSelect} className="mb-4">
            View Sample Project
          </Button>
          <p>Click the button above to view a sample active project.</p>
        </div>
      )}
    </div>
  )
}
