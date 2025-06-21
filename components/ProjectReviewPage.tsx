"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  Copy,
  FileText,
  LinkIcon,
  ExternalLink,
  Clock,
  Calendar,
  BarChart3,
  Users,
  MapPin,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: number
  name: string
  number: string
  stage: "inquiry" | "bidding" | "active" | "completed"
  phase: string
  dueDate: string
  hours: string
  currentTask: string
  nextTask: string
  location: string
  totalTime: string
  hoursBilled: number
  totalHours: number
  projectProgress: number
  taskProgress: number
  clientName: string
  projectAddress: string
  projectCity: string
  projectState: string
  projectZip: string
  projectType: string
  projectSize: string
  estimatedBudget: string
  additionalNotes: string
  appointmentTime?: string
  appointmentDate?: string
  proposalSent?: boolean
  proposalAccepted?: boolean
  firstPaymentReceived?: boolean
  completionDate?: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  firstName?: string
  middleInitial?: string
  lastName?: string
  clientPhoto?: string
  clientCity?: string
  clientState?: string
  clientZipCode?: string
  clientCountry?: string
  projectFolderLink?: string
  taskDueDate?: string
  googleDriveLink?: string
  appointmentType?: string
  meetingLocation?: string
  appointmentNotes?: string
}

interface Objective {
  id: string
  order: string
  name: string
  isEditing: boolean
  tasks: Task[]
  staffHours: StaffHours
}

interface Task {
  id: string
  order: number
  name: string
  isEditing: boolean
  staffHours: StaffHours
}

interface StaffHours {
  principal: number
  projectArchitect: number
  projectManager: number
  designer: number
  drafter: number
  consultant: number
  staffHours: number
}

interface ProjectReviewPageProps {
  project: Project
}

const hourlyRates = {
  principal: 250,
  projectArchitect: 200,
  projectManager: 175,
  designer: 125,
  drafter: 100,
  consultant: 105,
}

export default function ProjectReviewPage({ project }: ProjectReviewPageProps) {
  const router = useRouter()
  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: "obj1",
      order: "A",
      name: "Assemble Information",
      isEditing: false,
      staffHours: {
        principal: 0,
        projectArchitect: 0,
        projectManager: 0,
        designer: 0,
        drafter: 0,
        consultant: 0,
        staffHours: 0,
      },
      tasks: [
        {
          id: "task1",
          order: 1,
          name: "Visit Project Site To Field Verify Existing Conditions (A Maximum Of One Site Visit).",
          isEditing: false,
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
            staffHours: 0,
          },
        },
        {
          id: "task2",
          order: 2,
          name: "Prepare An As-Built Floor Plan, Ceiling Plan And Floor Plan Based On Field Measurements.",
          isEditing: false,
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
            staffHours: 0,
          },
        },
        {
          id: "task3",
          order: 3,
          name: "Obtain As-Built Drawings From PG&E.",
          isEditing: false,
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
            staffHours: 0,
          },
        },
      ],
    },
    {
      id: "obj2",
      order: "B",
      name: "100% Schematic Design",
      isEditing: false,
      staffHours: {
        principal: 0,
        projectArchitect: 0,
        projectManager: 0,
        designer: 0,
        drafter: 0,
        consultant: 0,
        staffHours: 0,
      },
      tasks: [
        {
          id: "task8",
          order: 1,
          name: "Visit Project Site To Field Verify Existing Conditions (A Maximum Of One Site Visit).",
          isEditing: false,
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
            staffHours: 0,
          },
        },
        {
          id: "task9",
          order: 2,
          name: "Prepare An As-Built Floor Plan, Ceiling Plan And Floor Plan Based On Field Measurements.",
          isEditing: false,
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
            staffHours: 0,
          },
        },
      ],
    },
  ])
  const [editingObjective, setEditingObjective] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [googleDriveLink, setGoogleDriveLink] = useState(project.googleDriveLink || "")
  const { toast } = useToast()

  const handleGoBack = () => {
    router.push("/dashboard")
  }

  const handleAddObjective = () => {
    const newObjective: Objective = {
      id: `obj${objectives.length + 1}`,
      order: String.fromCharCode(65 + objectives.length),
      name: "NEW OBJECTIVE",
      isEditing: false,
      staffHours: {
        principal: 0,
        projectArchitect: 0,
        projectManager: 0,
        designer: 0,
        drafter: 0,
        consultant: 0,
        staffHours: 0,
      },
      tasks: [],
    }
    setObjectives([...objectives, newObjective])
  }

  const handleAddTask = (objectiveId: string) => {
    const updatedObjectives = objectives.map((objective) => {
      if (objective.id === objectiveId) {
        return {
          ...objective,
          tasks: [
            ...objective.tasks,
            {
              id: `task${Date.now()}`,
              order: objective.tasks.length + 1,
              name: "NEW TASK",
              isEditing: false,
              staffHours: {
                principal: 0,
                projectArchitect: 0,
                projectManager: 0,
                designer: 0,
                drafter: 0,
                consultant: 0,
                staffHours: 0,
              },
            },
          ],
        }
      }
      return objective
    })
    setObjectives(updatedObjectives)
  }

  const handleDeleteObjective = (objectiveId: string) => {
    setObjectives(objectives.filter((obj) => obj.id !== objectiveId))
  }

  const handleDeleteTask = (objectiveId: string, taskId: string) => {
    setObjectives(
      objectives.map((obj) =>
        obj.id === objectiveId
          ? {
              ...obj,
              tasks: obj.tasks.filter((task) => task.id !== taskId),
            }
          : obj,
      ),
    )
  }

  const calculateTotal = (staffHours: StaffHours, role?: keyof StaffHours) => {
    if (role) {
      return staffHours[role] || 0
    }
    return Object.values(staffHours).reduce((sum, hours) => sum + (hours || 0), 0)
  }

  const calculateGrandTotal = () => {
    return objectives.reduce((total, objective) => total + calculateTotal(objective.staffHours), 0)
  }

  const handleStageTransition = () => {
    // Implement your stage transition logic here
    console.log("Stage transition triggered")
  }

  const handleObjectiveNameChange = (objectiveId: string, newName: string) => {
    const capitalizedName = newName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
    setObjectives(
      objectives.map((obj) => (obj.id === objectiveId ? { ...obj, name: capitalizedName, isEditing: false } : obj)),
    )
    setEditingObjective(null)
  }

  const handleTaskNameChange = (objectiveId: string, taskId: string, newName: string) => {
    const capitalizedName = newName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
    setObjectives(
      objectives.map((obj) =>
        obj.id === objectiveId
          ? {
              ...obj,
              tasks: obj.tasks.map((task) =>
                task.id === taskId ? { ...task, name: capitalizedName, isEditing: false } : task,
              ),
            }
          : obj,
      ),
    )
    setEditingTask(null)
  }

  const handleStaffHoursChange = (objectiveId: string, taskId: string, role: keyof StaffHours, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setObjectives(
      objectives.map((obj) =>
        obj.id === objectiveId
          ? {
              ...obj,
              tasks: obj.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      staffHours: {
                        ...task.staffHours,
                        [role]: numValue,
                        staffHours: calculateTotal({
                          ...task.staffHours,
                          [role]: numValue,
                        }),
                      },
                    }
                  : task,
              ),
              staffHours: obj.tasks.reduce(
                (acc, task) => ({
                  principal:
                    acc.principal +
                    (task.id === taskId && role === "principal" ? numValue : task.staffHours.principal || 0),
                  projectArchitect:
                    acc.projectArchitect +
                    (task.id === taskId && role === "projectArchitect"
                      ? numValue
                      : task.staffHours.projectArchitect || 0),
                  projectManager:
                    acc.projectManager +
                    (task.id === taskId && role === "projectManager" ? numValue : task.staffHours.projectManager || 0),
                  designer:
                    acc.designer +
                    (task.id === taskId && role === "designer" ? numValue : task.staffHours.designer || 0),
                  drafter:
                    acc.drafter + (task.id === taskId && role === "drafter" ? numValue : task.staffHours.drafter || 0),
                  consultant:
                    acc.consultant +
                    (task.id === taskId && role === "consultant" ? numValue : task.staffHours.consultant || 0),
                  staffHours: 0, // This will be calculated below
                }),
                {
                  principal: 0,
                  projectArchitect: 0,
                  projectManager: 0,
                  designer: 0,
                  drafter: 0,
                  consultant: 0,
                  staffHours: 0,
                } as StaffHours,
              ),
            }
          : obj,
      ),
    )

    // Recalculate total staff hours for the objective
    setObjectives((prevObjectives) =>
      prevObjectives.map((obj) =>
        obj.id === objectiveId
          ? {
              ...obj,
              staffHours: {
                ...obj.staffHours,
                staffHours: calculateTotal(obj.staffHours),
              },
            }
          : obj,
      ),
    )
  }

  const handleSaveGoogleDriveLink = () => {
    // In a real app, you would update the project in your database
    toast({
      title: "Link saved",
      description: "Google Drive link has been saved",
    })
    // Here you would typically make an API call to update the project
    console.log("Saving Google Drive link:", googleDriveLink)
  }

  const handleCopyGoogleDriveLink = () => {
    navigator.clipboard.writeText(googleDriveLink)
    toast({
      title: "Link copied",
      description: "Google Drive link copied to clipboard",
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 bg-gray-50 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">Project Review: {project.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium capitalize px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full">
            {project.stage}
          </span>
          <Button variant="outline" size="default" className="h-10">
            <Download className="h-5 w-5 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Column - Project Info */}
        <div className="col-span-3 space-y-4">
          {/* Project Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Project Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-500">Number</Label>
                  <p className="text-base font-medium">{project.number}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Type</Label>
                  <p className="text-base font-medium">{project.projectType || "Residential"}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Size</Label>
                <p className="text-base font-medium">{project.projectSize || "2,500 sq ft"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Budget</Label>
                <p className="text-base font-medium">{project.estimatedBudget || "$250,000"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Client Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-gray-500">Name</Label>
                <p className="text-base font-medium">
                  {project.firstName} {project.middleInitial && project.middleInitial + "."} {project.lastName}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <p className="text-base font-medium">{project.clientEmail}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Phone</Label>
                <p className="text-base font-medium">{project.clientPhone}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Address</Label>
                <p className="text-sm">
                  {project.clientAddress}
                  <br />
                  {project.clientCity}, {project.clientState} {project.clientZipCode}
                  <br />
                  {project.clientCountry}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Location */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Project Location</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-gray-500">Address</Label>
                <p className="text-sm">
                  {project.projectAddress}
                  <br />
                  {project.projectCity}, {project.projectState} {project.projectZip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-500">Due Date</Label>
                  <p className="text-base font-medium">{project.dueDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Task Due</Label>
                  <p className="text-base font-medium">{project.taskDueDate || "Not set"}</p>
                </div>
              </div>
              {project.stage === "inquiry" && project.appointmentDate && (
                <div>
                  <Label className="text-sm text-gray-500">Consultation</Label>
                  <p className="text-base font-medium">
                    {project.appointmentDate} at {project.appointmentTime}
                  </p>
                  <p className="text-sm text-gray-500">
                    {project.appointmentType || "In-person"} at {project.meetingLocation || "Office"}
                  </p>
                </div>
              )}
              {project.stage === "completed" && (
                <div>
                  <Label className="text-sm text-gray-500">Completed</Label>
                  <p className="text-base font-medium">{project.completionDate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Project Analytics and Description */}
        <div className="col-span-3 space-y-4">
          {/* Project Analytics */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm text-gray-500">Overall Progress</Label>
                  <span className="text-sm font-medium">{project.projectProgress}%</span>
                </div>
                <Progress value={project.projectProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm text-gray-500">Current Task</Label>
                  <span className="text-sm font-medium">{project.taskProgress}%</span>
                </div>
                <Progress value={project.taskProgress} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Total Hours</p>
                  <p className="text-lg font-bold">{project.totalHours}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Billed</p>
                  <p className="text-lg font-bold">{project.hoursBilled}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-lg font-bold">{project.totalHours - project.hoursBilled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Description */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Project Description</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={project.additionalNotes || ""} readOnly className="h-[200px] text-sm resize-none" />
            </CardContent>
          </Card>

          {/* Current Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Current Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-md border-l-2 border-blue-500">
                <p className="text-sm font-medium text-blue-800">Current Task</p>
                <p className="text-sm">{project.currentTask}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md border-l-2 border-gray-300">
                <p className="text-sm font-medium text-gray-500">Next Task</p>
                <p className="text-sm">{project.nextTask}</p>
              </div>
            </CardContent>
          </Card>

          {/* Google Drive Link */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-base font-semibold">Project Files</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="googleDriveLink" className="text-sm text-gray-500">
                  Google Drive Link
                </Label>
                <div className="flex items-center space-x-1">
                  <Input
                    id="googleDriveLink"
                    value={googleDriveLink}
                    onChange={(e) => setGoogleDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="flex-1 h-7 text-xs"
                  />
                  <Button onClick={handleSaveGoogleDriveLink} size="sm" className="h-7 px-2 text-xs">
                    Save
                  </Button>
                  {googleDriveLink && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleCopyGoogleDriveLink} className="h-7 w-7 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" asChild className="h-7 w-7 p-0">
                        <a href={googleDriveLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {project.stage === "bidding" && (
                <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">Project Proposal.pdf</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                    <Download className="h-3 w-3 mr-1" /> Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stage-specific Actions */}
          <div className="pt-2">
            {project.stage === "inquiry" && (
              <Button onClick={handleStageTransition} size="default" className="w-full py-6 text-base">
                <CheckCircle className="h-5 w-5 mr-2" /> Create Proposal
              </Button>
            )}

            {project.stage === "bidding" && project.proposalAccepted && project.firstPaymentReceived && (
              <Button onClick={handleStageTransition} size="default" className="w-full py-6 text-base">
                <CheckCircle className="h-5 w-5 mr-2" /> Move to Active
              </Button>
            )}

            {project.stage === "active" && (
              <Button onClick={handleStageTransition} size="default" className="w-full py-6 text-base">
                <CheckCircle className="h-5 w-5 mr-2" /> Mark as Completed
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Scope of Services */}
        <div className="col-span-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-gray-500" />
                  <CardTitle className="text-base font-semibold">Scope of Services</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={handleAddObjective} variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Add Objective
                  </Button>
                  <Button className="h-7 text-xs">Submit to Client</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {project.stage === "bidding" && (
                <div className="bg-blue-50 p-2 rounded-md border border-blue-100 mb-3">
                  <p className="text-xs text-blue-700">
                    This project is currently in the bidding stage. The scope of services below represents the proposed
                    work.
                  </p>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden h-[calc(100vh-180px)]">
                <div className="overflow-auto h-full">
                  <Table className="relative min-w-[1100px]">
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-[70px] text-base">Order</TableHead>
                        <TableHead className="w-[250px] text-base">Name</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Principal</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Architect</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Manager</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Designer</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Drafter</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Consultant</TableHead>
                        <TableHead className="w-[80px] text-center text-base">Hours</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {objectives.map((objective) => (
                        <React.Fragment key={objective.id}>
                          <TableRow className="bg-blue-50 dark:bg-blue-950">
                            <TableCell className="font-medium">{objective.order}</TableCell>
                            <TableCell
                              colSpan={7}
                              onDoubleClick={() => setEditingObjective(objective.id)}
                              className="font-medium"
                            >
                              {editingObjective === objective.id ? (
                                <Input
                                  value={objective.name}
                                  onChange={(e) => handleObjectiveNameChange(objective.id, e.target.value)}
                                  onBlur={() => setEditingObjective(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleObjectiveNameChange(objective.id, (e.target as HTMLInputElement).value)
                                    }
                                  }}
                                  autoFocus
                                  className="h-7 text-sm"
                                />
                              ) : (
                                objective.name
                              )}
                            </TableCell>
                            <TableCell className="text-center font-medium">
                              {calculateTotal(objective.staffHours)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteObjective(objective.id)}
                                className="h-6 w-6"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          {objective.tasks.map((task) => (
                            <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                              <TableCell className="text-xs text-gray-500">{task.order}</TableCell>
                              <TableCell
                                onDoubleClick={() => setEditingTask(task.id)}
                                className="max-w-[200px] truncate text-sm"
                                title={task.name}
                              >
                                {editingTask === task.id ? (
                                  <Input
                                    value={task.name}
                                    onChange={(e) => handleTaskNameChange(objective.id, task.id, e.target.value)}
                                    onBlur={() => setEditingTask(null)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleTaskNameChange(
                                          objective.id,
                                          task.id,
                                          (e.target as HTMLInputElement).value,
                                        )
                                      }
                                    }}
                                    autoFocus
                                    className="h-7 text-sm"
                                  />
                                ) : (
                                  task.name
                                )}
                              </TableCell>
                              <TableCell className="text-center p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={task.staffHours.principal || 0}
                                  onChange={(e) =>
                                    handleStaffHoursChange(objective.id, task.id, "principal", e.target.value)
                                  }
                                  className="w-14 h-8 text-center text-sm"
                                />
                              </TableCell>
                              <TableCell className="text-center p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={task.staffHours.projectArchitect || 0}
                                  onChange={(e) =>
                                    handleStaffHoursChange(objective.id, task.id, "projectArchitect", e.target.value)
                                  }
                                  className="w-14 h-8 text-center text-sm"
                                />
                              </TableCell>
                              <TableCell className="text-center p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={task.staffHours.projectManager || 0}
                                  onChange={(e) =>
                                    handleStaffHoursChange(objective.id, task.id, "projectManager", e.target.value)
                                  }
                                  className="w-14 h-8 text-center text-sm"
                                />
                              </TableCell>
                              <TableCell className="text-center p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={task.staffHours.designer || 0}
                                  onChange={(e) =>
                                    handleStaffHoursChange(objective.id, task.id, "designer", e.target.value)
                                  }
                                  className="w-14 h-8 text-center text-sm"
                                />
                              </TableCell>
                              <TableCell className="text-center p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={task.staffHours.drafter || 0}
                                  onChange={(e) =>
                                    handleStaffHoursChange(objective.id, task.id, "drafter", e.target.value)
                                  }
                                  className="w-14 h-8 text-center text-sm"
                                />
                              </TableCell>
                              <TableCell className="text-center p-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={task.staffHours.consultant || 0}
                                  onChange={(e) =>
                                    handleStaffHoursChange(objective.id, task.id, "consultant", e.target.value)
                                  }
                                  className="w-14 h-8 text-center text-sm"
                                />
                              </TableCell>
                              <TableCell className="text-center text-sm">{calculateTotal(task.staffHours)}</TableCell>
                              <TableCell className="text-right p-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTask(objective.id, task.id)}
                                  className="h-6 w-6"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={10}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddTask(objective.id)}
                                className="w-full h-6 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Task
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={2} className="text-xs font-medium">
                              OBJECTIVE TOTALS
                            </TableCell>
                            <TableCell className="text-center text-xs">
                              {calculateTotal(objective.staffHours, "principal")}
                            </TableCell>
                            <TableCell className="text-center text-xs">
                              {calculateTotal(objective.staffHours, "projectArchitect")}
                            </TableCell>
                            <TableCell className="text-center text-xs">
                              {calculateTotal(objective.staffHours, "projectManager")}
                            </TableCell>
                            <TableCell className="text-center text-xs">
                              {calculateTotal(objective.staffHours, "designer")}
                            </TableCell>
                            <TableCell className="text-center text-xs">
                              {calculateTotal(objective.staffHours, "drafter")}
                            </TableCell>
                            <TableCell className="text-center text-xs">
                              {calculateTotal(objective.staffHours, "consultant")}
                            </TableCell>
                            <TableCell className="text-center text-xs font-medium">
                              {calculateTotal(objective.staffHours)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                      <TableRow className="font-bold bg-gray-100 dark:bg-gray-800">
                        <TableCell colSpan={2}>GRAND TOTAL</TableCell>
                        <TableCell colSpan={6}></TableCell>
                        <TableCell className="text-center">{calculateGrandTotal().toFixed(1)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export type { ProjectReviewPageProps }
