"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define the project structure based on existing data
export interface SubTask {
  id: string
  name: string
  budgetedHours?: number
  actualHours?: number
  budgetedCost?: number
  actualCost?: number
  status?: string
}

export interface Objective {
  id: string
  name: string
  budgetedCost?: number
  actualCost?: number
  startDate?: string
  endDate?: string
  status?: string
  subTasks: SubTask[]
}

export interface Project {
  id: string
  name: string
  number?: string
  stage?: string
  phase?: string
  clientName?: string
  firstName?: string
  lastName?: string
  clientEmail?: string
  currentTask?: string
  location?: string
  projectAddress?: string
  completedTasks?: number
  totalTasks?: number
  projectProgress?: number
  startDate?: string
  endDate?: string
  contractAmount?: number
  status?: string
  objectives?: Objective[]
  tasks?: any[]
}

interface ProjectContextType {
  projects: Project[]
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
  calculateFinancialSummary: (projectId: string) => any
  financialSummaries: Record<string, any>
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  activeProject: null,
  setActiveProject: () => {},
  calculateFinancialSummary: () => ({}),
  financialSummaries: {},
})

export const useProjects = () => useContext(ProjectContext)

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This will be populated from the Dashboard component's projectData
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [financialSummaries, setFinancialSummaries] = useState<Record<string, any>>({})

  // Function to calculate financial metrics for a project
  const calculateFinancialSummary = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)

    if (!project) return null

    // If the project doesn't have objectives, create a basic financial summary
    if (!project.objectives) {
      const summary = {
        contractAmount: project.contractAmount || 0,
        totalBudgetedCost: 0,
        totalActualCost: 0,
        profitLoss: 0,
        profitLossPercentage: "0.00",
        status: project.status || "unknown",
      }

      setFinancialSummaries((prev) => ({
        ...prev,
        [projectId]: summary,
      }))

      return summary
    }

    // Calculate metrics if objectives exist
    let totalBudgetedCost = 0
    let totalActualCost = 0
    let totalBudgetedHours = 0
    let totalActualHours = 0

    project.objectives.forEach((objective) => {
      totalBudgetedCost += objective.budgetedCost || 0
      totalActualCost += objective.actualCost || 0

      objective.subTasks?.forEach((task) => {
        totalBudgetedHours += task.budgetedHours || 0
        totalActualHours += task.actualHours || 0
      })
    })

    const profitLoss = (project.contractAmount || 0) - totalActualCost
    const profitLossPercentage = project.contractAmount
      ? ((profitLoss / project.contractAmount) * 100).toFixed(2)
      : "0.00"

    const summary = {
      contractAmount: project.contractAmount || 0,
      totalBudgetedCost,
      totalActualCost,
      totalBudgetedHours,
      totalActualHours,
      profitLoss,
      profitLossPercentage,
      status: project.status || "unknown",
    }

    setFinancialSummaries((prev) => ({
      ...prev,
      [projectId]: summary,
    }))

    return summary
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        calculateFinancialSummary,
        financialSummaries,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
