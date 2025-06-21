"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react"

// Types for our project management system
interface Employee {
  id: string
  name: string
  role: string
  hourlyRate: number
}

interface Task {
  id: string
  name: string
  estimatedHours: number
  spentHours: number
  estimatedCost: number
  actualCost: number
}

interface Objective {
  id: string
  name: string
  contractAmount: number
  estimatedHours: number
  spentHours: number
  estimatedCost: number
  actualCost: number
  tasks: Task[]
}

interface Project {
  id: string
  name: string
  client: string
  status: "bidding" | "active" | "completed" | "on-hold"
  contractAmount: number
  estimatedHours: number
  spentHours: number
  estimatedCost: number
  actualCost: number
  startDate: string
  endDate: string
  objectives: Objective[]
  paymentReceived: boolean
}

interface TimeEntry {
  id: string
  employeeId: string
  projectId: string
  objectiveId: string
  taskId: string
  date: string
  hours: number
  notes: string
  approved: boolean
}

interface Timecard {
  id: string
  employeeId: string
  weekStarting: string
  weekEnding: string
  status: "draft" | "submitted" | "approved" | "rejected"
  timeEntries: TimeEntry[]
  totalHours: number
  submittedAt?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
}

// Mock data
const mockEmployees: Employee[] = [
  { id: "e1", name: "Eric Rivera", role: "Architect", hourlyRate: 85 },
  { id: "e2", name: "Paige Noga", role: "Project Manager", hourlyRate: 75 },
  { id: "e3", name: "Samira Saleh", role: "Designer", hourlyRate: 65 },
]

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Downtown Revitalization",
    client: "City of Springfield",
    status: "bidding",
    contractAmount: 120000,
    estimatedHours: 650,
    spentHours: 0,
    estimatedCost: 48750,
    actualCost: 0,
    startDate: "2025-04-15",
    endDate: "2025-10-30",
    objectives: [
      {
        id: "o1",
        name: "Concept Design",
        contractAmount: 35000,
        estimatedHours: 200,
        spentHours: 0,
        estimatedCost: 15000,
        actualCost: 0,
        tasks: [
          {
            id: "t1",
            name: "Site Analysis",
            estimatedHours: 80,
            spentHours: 0,
            estimatedCost: 6000,
            actualCost: 0,
          },
          {
            id: "t2",
            name: "Preliminary Sketches",
            estimatedHours: 120,
            spentHours: 0,
            estimatedCost: 9000,
            actualCost: 0,
          },
        ],
      },
      {
        id: "o2",
        name: "Design Development",
        contractAmount: 45000,
        estimatedHours: 250,
        spentHours: 0,
        estimatedCost: 18750,
        actualCost: 0,
        tasks: [
          {
            id: "t3",
            name: "3D Modeling",
            estimatedHours: 150,
            spentHours: 0,
            estimatedCost: 11250,
            actualCost: 0,
          },
          {
            id: "t4",
            name: "Material Selection",
            estimatedHours: 100,
            spentHours: 0,
            estimatedCost: 7500,
            actualCost: 0,
          },
        ],
      },
    ],
    paymentReceived: false,
  },
  {
    id: "p2",
    name: "Waterfront Project",
    client: "Harbor Development Corp",
    status: "active",
    contractAmount: 250000,
    estimatedHours: 1200,
    spentHours: 320,
    estimatedCost: 90000,
    actualCost: 24000,
    startDate: "2025-02-01",
    endDate: "2025-12-15",
    objectives: [
      {
        id: "o3",
        name: "Master Planning",
        contractAmount: 75000,
        estimatedHours: 400,
        spentHours: 320,
        estimatedCost: 30000,
        actualCost: 24000,
        tasks: [
          {
            id: "t5",
            name: "Urban Context Analysis",
            estimatedHours: 200,
            spentHours: 180,
            estimatedCost: 15000,
            actualCost: 13500,
          },
          {
            id: "t6",
            name: "Zoning Review",
            estimatedHours: 200,
            spentHours: 140,
            estimatedCost: 15000,
            actualCost: 10500,
          },
        ],
      },
    ],
    paymentReceived: true,
  },
]

const mockTimecards: Timecard[] = [
  {
    id: "tc1",
    employeeId: "e1",
    weekStarting: "2025-03-24",
    weekEnding: "2025-03-30",
    status: "approved",
    timeEntries: [
      {
        id: "te1",
        employeeId: "e1",
        projectId: "p2",
        objectiveId: "o3",
        taskId: "t5",
        date: "2025-03-25",
        hours: 8,
        notes: "Completed urban analysis for north sector",
        approved: true,
      },
      {
        id: "te2",
        employeeId: "e1",
        projectId: "p2",
        objectiveId: "o3",
        taskId: "t5",
        date: "2025-03-26",
        hours: 8,
        notes: "Completed urban analysis for south sector",
        approved: true,
      },
    ],
    totalHours: 16,
    submittedAt: "2025-03-30T18:00:00Z",
    approvedAt: "2025-04-01T10:15:00Z",
    approvedBy: "e2",
  },
  {
    id: "tc2",
    employeeId: "e1",
    weekStarting: "2025-03-31",
    weekEnding: "2025-04-06",
    status: "submitted",
    timeEntries: [
      {
        id: "te3",
        employeeId: "e1",
        projectId: "p2",
        objectiveId: "o3",
        taskId: "t6",
        date: "2025-04-01",
        hours: 8,
        notes: "Started zoning review for waterfront area",
        approved: false,
      },
      {
        id: "te4",
        employeeId: "e1",
        projectId: "p2",
        objectiveId: "o3",
        taskId: "t6",
        date: "2025-04-02",
        hours: 8,
        notes: "Continued zoning review, identified potential issues",
        approved: false,
      },
    ],
    totalHours: 16,
    submittedAt: "2025-04-06T17:30:00Z",
  },
]

export function ProjectIntegrationSystem() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [timecards, setTimecards] = useState<Timecard[]>(mockTimecards)
  const [employees] = useState<Employee[]>(mockEmployees)
  const [activeTab, setActiveTab] = useState("projects")

  // Function to convert a project from bidding to active
  const convertToActiveProject = (projectId: string) => {
    setProjects(projects.map((project) => (project.id === projectId ? { ...project, status: "active" } : project)))
  }

  // Function to approve a timecard
  const approveTimecard = (timecardId: string) => {
    const timecard = timecards.find((tc) => tc.id === timecardId)
    if (!timecard) return

    // Update timecard status
    const updatedTimecards = timecards.map((tc) =>
      tc.id === timecardId
        ? {
            ...tc,
            status: "approved" as const,
            approvedAt: new Date().toISOString(),
            approvedBy: "e2", // Assuming current user is a supervisor
          }
        : tc,
    )

    // Update project hours and costs
    const updatedProjects = [...projects]

    timecard.timeEntries.forEach((entry) => {
      const projectIndex = updatedProjects.findIndex((p) => p.id === entry.projectId)
      if (projectIndex === -1) return

      const project = updatedProjects[projectIndex]
      const objectiveIndex = project.objectives.findIndex((o) => o.id === entry.objectiveId)
      if (objectiveIndex === -1) return

      const objective = project.objectives[objectiveIndex]
      const taskIndex = objective.tasks.findIndex((t) => t.id === entry.taskId)
      if (taskIndex === -1) return

      // Find employee to get hourly rate
      const employee = employees.find((e) => e.id === entry.employeeId)
      if (!employee) return

      const entryCost = entry.hours * employee.hourlyRate

      // Update task
      const task = objective.tasks[taskIndex]
      task.spentHours += entry.hours
      task.actualCost += entryCost

      // Update objective
      objective.spentHours += entry.hours
      objective.actualCost += entryCost

      // Update project
      project.spentHours += entry.hours
      project.actualCost += entryCost
    })

    setTimecards(updatedTimecards)
    setProjects(updatedProjects)
  }

  // Function to reject a timecard
  const rejectTimecard = (timecardId: string, reason: string) => {
    setTimecards(
      timecards.map((tc) =>
        tc.id === timecardId
          ? {
              ...tc,
              status: "rejected" as const,
              rejectedAt: new Date().toISOString(),
              rejectedBy: "e2", // Assuming current user is a supervisor
              rejectionReason: reason,
            }
          : tc,
      ),
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Project Management System</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="timecards">Timecards</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bidding Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Bidding Projects</CardTitle>
                <CardDescription>Projects with signed proposals awaiting activation</CardDescription>
              </CardHeader>
              <CardContent>
                {projects
                  .filter((p) => p.status === "bidding")
                  .map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.client}</p>
                        </div>
                        <Badge variant={project.paymentReceived ? "success" : "outline"}>
                          {project.paymentReceived ? "Payment Received" : "Awaiting Payment"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Contract:</span> ${project.contractAmount.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-gray-500">Est. Hours:</span> {project.estimatedHours}
                        </div>
                        <div>
                          <span className="text-gray-500">Start:</span>{" "}
                          {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span> {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>

                      <Button
                        onClick={() => convertToActiveProject(project.id)}
                        disabled={!project.paymentReceived}
                        className="w-full"
                      >
                        {project.paymentReceived ? "Convert to Active Project" : "Waiting for Payment"}
                      </Button>
                    </div>
                  ))}

                {projects.filter((p) => p.status === "bidding").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bidding projects available</p>
                )}
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Projects currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                {projects
                  .filter((p) => p.status === "active")
                  .map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.client}</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Contract:</span> ${project.contractAmount.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-gray-500">Hours:</span> {project.spentHours}/{project.estimatedHours}
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span> ${project.actualCost.toLocaleString()}/$
                          {project.estimatedCost.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-gray-500">End Date:</span>{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  ))}

                {projects.filter((p) => p.status === "active").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No active projects available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          {projects.filter((p) => p.status === "active").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Objective Tracking</CardTitle>
                <CardDescription>Track progress on active project objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Objective</TableHead>
                      <TableHead>Contract Amount</TableHead>
                      <TableHead>Hours (Used/Est)</TableHead>
                      <TableHead>Cost (Actual/Est)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects
                      .filter((p) => p.status === "active")
                      .flatMap((project) =>
                        project.objectives.map((objective) => (
                          <TableRow key={`${project.id}-${objective.id}`}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{objective.name}</TableCell>
                            <TableCell>${objective.contractAmount.toLocaleString()}</TableCell>
                            <TableCell>
                              {objective.spentHours}/{objective.estimatedHours}
                              {objective.spentHours > objective.estimatedHours * 0.9 && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />
                              )}
                            </TableCell>
                            <TableCell>
                              ${objective.actualCost.toLocaleString()}/${objective.estimatedCost.toLocaleString()}
                              {objective.actualCost > objective.estimatedCost * 0.9 && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />
                              )}
                            </TableCell>
                            <TableCell>
                              {objective.spentHours >= objective.estimatedHours ? (
                                <Badge variant="destructive">Over Budget</Badge>
                              ) : objective.spentHours >= objective.estimatedHours * 0.75 ? (
                                <Badge variant="warning">Caution</Badge>
                              ) : (
                                <Badge variant="success">On Track</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )),
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Timecards Tab */}
        <TabsContent value="timecards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pending Approval */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
                <CardDescription>Timecards submitted and awaiting supervisor approval</CardDescription>
              </CardHeader>
              <CardContent>
                {timecards
                  .filter((tc) => tc.status === "submitted")
                  .map((timecard) => {
                    const employee = employees.find((e) => e.id === timecard.employeeId)

                    return (
                      <div key={timecard.id} className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{employee?.name || "Unknown Employee"}</h3>
                            <p className="text-sm text-gray-500">
                              Week: {new Date(timecard.weekStarting).toLocaleDateString()} -{" "}
                              {new Date(timecard.weekEnding).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>Submitted</Badge>
                        </div>

                        <div className="text-sm mb-3">
                          <div className="mb-1">
                            <span className="text-gray-500">Total Hours:</span> {timecard.totalHours}
                          </div>
                          <div className="mb-1">
                            <span className="text-gray-500">Submitted:</span>{" "}
                            {new Date(timecard.submittedAt!).toLocaleString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {timecard.timeEntries.map((entry) => {
                            const project = projects.find((p) => p.id === entry.projectId)
                            const objective = project?.objectives.find((o) => o.id === entry.objectiveId)
                            const task = objective?.tasks.find((t) => t.id === entry.taskId)

                            return (
                              <div key={entry.id} className="text-xs bg-gray-50 p-2 rounded">
                                <div className="font-medium">
                                  {project?.name} - {objective?.name} - {task?.name}
                                </div>
                                <div>
                                  {new Date(entry.date).toLocaleDateString()}: {entry.hours} hours
                                </div>
                                <div className="text-gray-500 italic">{entry.notes}</div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => rejectTimecard(timecard.id, "Please provide more detailed notes")}
                          >
                            Reject
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => approveTimecard(timecard.id)}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                {timecards.filter((tc) => tc.status === "submitted").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No timecards pending approval</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
                <CardDescription>Recently approved timecards</CardDescription>
              </CardHeader>
              <CardContent>
                {timecards
                  .filter((tc) => tc.status === "approved")
                  .map((timecard) => {
                    const employee = employees.find((e) => e.id === timecard.employeeId)
                    const approver = employees.find((e) => e.id === timecard.approvedBy)

                    return (
                      <div key={timecard.id} className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{employee?.name || "Unknown Employee"}</h3>
                            <p className="text-sm text-gray-500">
                              Week: {new Date(timecard.weekStarting).toLocaleDateString()} -{" "}
                              {new Date(timecard.weekEnding).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="success">Approved</Badge>
                        </div>

                        <div className="text-sm mb-3">
                          <div className="mb-1">
                            <span className="text-gray-500">Total Hours:</span> {timecard.totalHours}
                          </div>
                          <div className="mb-1">
                            <span className="text-gray-500">Approved:</span>{" "}
                            {new Date(timecard.approvedAt!).toLocaleString()}
                          </div>
                          <div className="mb-1">
                            <span className="text-gray-500">Approved By:</span> {approver?.name || "Unknown"}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    )
                  })}

                {timecards.filter((tc) => tc.status === "approved").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recently approved timecards</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Hours Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.reduce((total, project) => total + project.spentHours, 0)}
                  <span className="text-sm text-gray-500 ml-2">hrs</span>
                </div>
                <p className="text-sm text-gray-500">Total hours logged across all projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Cost Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${projects.reduce((total, project) => total + project.actualCost, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Total labor costs across all projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-500" />
                  Team Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (projects.reduce((total, project) => total + project.spentHours, 0) / (employees.length * 40 * 4)) *
                      100,
                  )}
                  %
                </div>
                <p className="text-sm text-gray-500">Team utilization rate (last 4 weeks)</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Project Performance Reports</CardTitle>
              <CardDescription>Compare actual vs. estimated hours and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Hours Used</TableHead>
                    <TableHead>Hours Estimated</TableHead>
                    <TableHead>Hours %</TableHead>
                    <TableHead>Cost Actual</TableHead>
                    <TableHead>Cost Estimated</TableHead>
                    <TableHead>Cost %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects
                    .filter((p) => p.status === "active")
                    .map((project) => {
                      const hoursPercentage = Math.round((project.spentHours / project.estimatedHours) * 100)
                      const costPercentage = Math.round((project.actualCost / project.estimatedCost) * 100)

                      return (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.spentHours}</TableCell>
                          <TableCell>{project.estimatedHours}</TableCell>
                          <TableCell>
                            {hoursPercentage}%
                            {hoursPercentage > 90 && <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />}
                          </TableCell>
                          <TableCell>${project.actualCost.toLocaleString()}</TableCell>
                          <TableCell>${project.estimatedCost.toLocaleString()}</TableCell>
                          <TableCell>
                            {costPercentage}%
                            {costPercentage > 90 && <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />}
                          </TableCell>
                          <TableCell>
                            {hoursPercentage > 100 || costPercentage > 100 ? (
                              <Badge variant="destructive">Over Budget</Badge>
                            ) : hoursPercentage > 90 || costPercentage > 90 ? (
                              <Badge variant="warning">At Risk</Badge>
                            ) : (
                              <Badge variant="success">On Track</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>

              {projects.filter((p) => p.status === "active").length === 0 && (
                <p className="text-gray-500 text-center py-4">No active projects to report on</p>
              )}
            </CardContent>
          </Card>

          {/* Alerts and Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Projects requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {projects.some(
                (p) =>
                  p.status === "active" &&
                  (p.spentHours > p.estimatedHours * 0.9 || p.actualCost > p.estimatedCost * 0.9),
              ) ? (
                <div className="space-y-3">
                  {projects
                    .filter(
                      (p) =>
                        p.status === "active" &&
                        (p.spentHours > p.estimatedHours * 0.9 || p.actualCost > p.estimatedCost * 0.9),
                    )
                    .map((project) => (
                      <Alert key={project.id} variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning: {project.name}</AlertTitle>
                        <AlertDescription>
                          {project.spentHours > project.estimatedHours
                            ? `This project has exceeded its estimated hours (${project.spentHours}/${project.estimatedHours}).`
                            : project.spentHours > project.estimatedHours * 0.9
                              ? `This project is approaching its estimated hours (${project.spentHours}/${project.estimatedHours}).`
                              : ""}
                          {project.actualCost > project.estimatedCost
                            ? ` This project has exceeded its estimated cost ($${project.actualCost.toLocaleString()}/$${project.estimatedCost.toLocaleString()}).`
                            : project.actualCost > project.estimatedCost * 0.9
                              ? ` This project is approaching its estimated cost ($${project.actualCost.toLocaleString()}/$${project.estimatedCost.toLocaleString()}).`
                              : ""}
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No alerts at this time</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
