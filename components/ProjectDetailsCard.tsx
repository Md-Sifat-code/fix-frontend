"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FileText, Play, Square, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ObjectiveTimer } from "./ObjectiveTimer"
import type { Project, Objective } from "@/types"

interface ProjectDetailsCardProps {
  project: Project
  onStatusUpdate?: (projectId: string, newStatus: string) => void
  onAddNote?: (projectId: string, note: string) => void
  onUploadFile?: (projectId: string, file: File) => void
}

export function ProjectDetailsCard({ project, onStatusUpdate, onAddNote, onUploadFile }: ProjectDetailsCardProps) {
  const [activeObjective, setActiveObjective] = useState<Objective | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [expandedView, setExpandedView] = useState(false)

  // Calculate overall project progress
  const totalObjectives = project.objectives?.length || 0
  const completedObjectives = project.objectives?.filter((obj) => obj.status === "completed").length || 0
  const progress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0

  // Format dates
  const startDate = project.startDate ? new Date(project.startDate) : null
  const endDate = project.endDate ? new Date(project.endDate) : null

  // Calculate contract value based on objectives
  const contractValue = project.objectives?.reduce((total, obj) => total + (obj.budgetedCost || 0), 0) || 0

  // Handle timer actions
  const handleStartTimer = (objective: Objective) => {
    setActiveObjective(objective)
    setIsTimerRunning(true)
    // In a real app, you would start tracking time in the database
    console.log(`Started timer for objective: ${objective.name}`)
  }

  const handleStopTimer = () => {
    if (activeObjective) {
      setIsTimerRunning(false)
      // In a real app, you would stop tracking time and log the duration
      console.log(`Stopped timer for objective: ${activeObjective.name}`)
      setActiveObjective(null)
    }
  }

  // Generate contract or invoice
  const handleGenerateContract = () => {
    // In a real app, this would generate a contract based on project data
    console.log(`Generating contract for project: ${project.name}`)
  }

  const handleGenerateInvoice = () => {
    // In a real app, this would generate an invoice based on logged time
    console.log(`Generating invoice for project: ${project.name}`)
  }

  return (
    <Card className={`w-full transition-all duration-300 ${expandedView ? "max-w-4xl" : "max-w-md"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{project.name}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">Client: {project.clientName}</div>
          </div>
          <Badge
            className={`
              ${
                project.stage === "active"
                  ? "bg-green-100 text-green-800"
                  : project.stage === "bidding"
                    ? "bg-blue-100 text-blue-800"
                    : project.stage === "inquiry"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }
            `}
          >
            {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Start: {startDate ? format(startDate, "MMM d, yyyy") : "Not set"}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>End: {endDate ? format(endDate, "MMM d, yyyy") : "Not set"}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
            <span>Value: ${contractValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>Phase: {project.phase || "Not set"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {expandedView && (
          <Tabs defaultValue="objectives" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="objectives" className="space-y-4 pt-4">
              <h4 className="text-sm font-medium">Project Objectives</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {project.objectives?.map((objective) => (
                  <div key={objective.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-sm">{objective.name}</h5>
                        <div className="text-xs text-gray-500 mt-1">
                          Budget: ${objective.budgetedCost?.toLocaleString() || 0}
                        </div>
                      </div>
                      <Badge
                        className={`${
                          objective.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {objective.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleStartTimer(objective)}
                        disabled={isTimerRunning}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start Timer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timer" className="pt-4">
              <ObjectiveTimer
                objective={activeObjective}
                isRunning={isTimerRunning}
                onStop={handleStopTimer}
                project={project}
              />
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4 pt-4">
              <h4 className="text-sm font-medium">Contracts & Invoices</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h5 className="font-medium text-sm">Generate Documents</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    Create contracts and invoices based on project data and logged time.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleGenerateContract}>
                      <FileText className="h-3 w-3 mr-1" />
                      Generate Contract
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleGenerateInvoice}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setExpandedView(!expandedView)}>
          {expandedView ? "Collapse" : "Expand"}
        </Button>

        <div className="flex space-x-2">
          {isTimerRunning && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              onClick={handleStopTimer}
            >
              <Square className="h-3 w-3 mr-1" />
              Stop Timer
            </Button>
          )}

          <Link href={`/projects/${project.id}`}>
            <Button size="sm" className="text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
