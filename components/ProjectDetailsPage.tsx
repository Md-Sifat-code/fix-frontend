"use client"

import { useState, useEffect } from "react"
import { Badge, TaskStatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  FileText,
  Play,
  Square,
  Save,
  Copy,
  Calendar,
  ChevronLeft,
  Settings,
  Bell,
  Plus,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  X,
  Edit,
  CheckSquare,
  CheckCircle,
  Mail,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
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
import type { Project } from "./ProjectForm"

interface ProjectDetailsPageProps {
  project: Project
}

export function ProjectDetailsPage({ project }: ProjectDetailsPageProps) {
  const { toast } = useToast()
  const [googleDriveLink, setGoogleDriveLink] = useState(project.googleDriveLink || "")
  const [activeObjective, setActiveObjective] = useState<any>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [objectiveTimers, setObjectiveTimers] = useState<Record<string, number>>({})
  const [expandedObjective, setExpandedObjective] = useState<string | null>(null)
  const [projectDuration, setProjectDuration] = useState(0)
  const [projectStartDate, setProjectStartDate] = useState(new Date())
  const [projectEndDate, setProjectEndDate] = useState(new Date())
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [projectManager, setProjectManager] = useState(project.projectManager || null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Sample project managers - in a real app, this would come from your database
  const sampleProjectManagers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", avatar: "/placeholder.svg", title: "Project Manager" },
    { id: 2, name: "Michael Chen", email: "michael@example.com", avatar: "/placeholder.svg", title: "Project Manager" },
    {
      id: 3,
      name: "Olivia Martinez",
      email: "olivia@example.com",
      avatar: "/placeholder.svg",
      title: "Project Manager",
    },
    { id: 4, name: "David Wilson", email: "david@example.com", avatar: "/placeholder.svg", title: "Project Manager" },
    { id: 5, name: "Emma Thompson", email: "emma@example.com", avatar: "/placeholder.svg", title: "Project Manager" },
  ]

  // Default objectives with tasks
  const defaultObjectives = [
    {
      id: "obj1",
      name: "ASSEMBLE INFORMATION",
      status: "in-progress",
      budgetedCost: 5000,
      tasks: [
        { id: "task1", name: "Site visit and field verification", duration: 5, status: "completed" },
        { id: "task2", name: "Prepare as-built floor plan", duration: 10, status: "in-progress" },
        { id: "task3", name: "Obtain existing drawings", duration: 3, status: "pending" },
        { id: "task4", name: "Research local code requirements", duration: 7, status: "pending" },
      ],
    },
    {
      id: "obj2",
      name: "100% SCHEMATIC DESIGN (SDs)",
      status: "pending",
      budgetedCost: 12000,
      tasks: [
        { id: "task5", name: "Client meetings to discuss requirements", duration: 2, status: "pending" },
        { id: "task6", name: "Prepare life safety plan", duration: 3, status: "pending" },
        { id: "task7", name: "Prepare demolition floor plan", duration: 4, status: "pending" },
        { id: "task8", name: "Prepare proposed floor plan", duration: 5, status: "pending" },
        { id: "task9", name: "Prepare reflected ceiling plan", duration: 4, status: "pending" },
      ],
    },
    {
      id: "obj3",
      name: "100% DESIGN DEVELOPMENT",
      status: "pending",
      budgetedCost: 18000,
      tasks: [
        { id: "task10", name: "Refine architectural plans", duration: 10, status: "pending" },
        { id: "task11", name: "Develop detailed elevations", duration: 7, status: "pending" },
        { id: "task12", name: "Prepare interior design concepts", duration: 5, status: "pending" },
        { id: "task13", name: "Coordinate with engineering consultants", duration: 8, status: "pending" },
      ],
    },
    {
      id: "obj4",
      name: "100% CONSTRUCTION DOCUMENTS (CDs)",
      status: "pending",
      budgetedCost: 25000,
      tasks: [
        { id: "task14", name: "Develop detailed construction drawings", duration: 15, status: "pending" },
        { id: "task15", name: "Prepare specifications", duration: 10, status: "pending" },
        { id: "task16", name: "Coordinate with consultants", duration: 8, status: "pending" },
        { id: "task17", name: "Quality control review", duration: 5, status: "pending" },
      ],
    },
    {
      id: "obj5",
      name: "PLAN CHECK APPROVAL FROM AHJ",
      status: "pending",
      budgetedCost: 8000,
      tasks: [
        { id: "task18", name: "Submit plans to authority", duration: 1, status: "pending" },
        { id: "task19", name: "Respond to plan check comments", duration: 10, status: "pending" },
        { id: "task20", name: "Resubmit revised plans", duration: 1, status: "pending" },
        { id: "task21", name: "Obtain final approval", duration: 10, status: "pending" },
      ],
    },
    {
      id: "obj6",
      name: "BIDDING SUPPORT",
      status: "pending",
      budgetedCost: 5000,
      tasks: [
        { id: "task22", name: "Prepare bid documents", duration: 5, status: "pending" },
        { id: "task23", name: "Assist in pre-bid meeting", duration: 1, status: "pending" },
        { id: "task24", name: "Respond to bidder questions", duration: 7, status: "pending" },
        { id: "task25", name: "Review bids", duration: 3, status: "pending" },
      ],
    },
    {
      id: "obj7",
      name: "CONSTRUCTION ADMINISTRATION",
      status: "pending",
      budgetedCost: 15000,
      tasks: [
        { id: "task26", name: "Attend pre-construction meeting", duration: 1, status: "pending" },
        { id: "task27", name: "Review shop drawings", duration: 10, status: "pending" },
        { id: "task28", name: "Conduct site visits", duration: 20, status: "pending" },
        { id: "task29", name: "Respond to RFIs", duration: 15, status: "pending" },
      ],
    },
    {
      id: "obj8",
      name: "RECORD DRAWINGS",
      status: "pending",
      budgetedCost: 4000,
      tasks: [
        { id: "task30", name: "Collect as-built drawings", duration: 2, status: "pending" },
        { id: "task31", name: "Verify as-built information", duration: 3, status: "pending" },
        { id: "task32", name: "Prepare final record drawings", duration: 5, status: "pending" },
        { id: "task33", name: "Submit record drawings", duration: 1, status: "pending" },
      ],
    },
  ]

  // Calculate project duration and dates
  useEffect(() => {
    let totalDuration = 0
    defaultObjectives.forEach((objective) => {
      objective.tasks.forEach((task) => {
        totalDuration += task.duration
      })
    })

    setProjectDuration(totalDuration)

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + totalDuration)

    setProjectStartDate(startDate)
    setProjectEndDate(endDate)
  }, [])

  // Handle saving Google Drive link
  const handleSaveGoogleDriveLink = () => {
    if (!googleDriveLink || !googleDriveLink.trim().startsWith("https://")) {
      toast({
        title: "Invalid link",
        description: "Please enter a valid Google Drive URL starting with https://",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would update the project in your database
    toast({
      title: "Saving link...",
      description: "Please wait while we save your Google Drive link",
    })

    setTimeout(() => {
      // Update the project.googleDriveLink in state
      project.googleDriveLink = googleDriveLink

      toast({
        title: "Link saved",
        description: "Google Drive link has been saved successfully",
      })
    }, 500)
  }

  // Handle timer actions
  const handleStartTimer = (objective: any) => {
    setActiveObjective(objective)
    setIsTimerRunning(true)

    // In a real app, you would start tracking time in the database
    const startTime = Date.now()
    const timerInterval = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(currentElapsed)

      // Check if it's end of workday (5:00 PM)
      const now = new Date()
      if (now.getHours() >= 17 && now.getMinutes() >= 0) {
        // Auto-stop timer at end of day
        handleEndOfDayStop(objective, currentElapsed)
      }
    }, 1000)

    // Store the interval ID to clear it later
    // @ts-ignore
    window.timerInterval = timerInterval
  }

  // Add a new function to handle end of day timer stops
  const handleEndOfDayStop = (objective: any, elapsedSeconds: number) => {
    // Clear the timer interval
    // @ts-ignore
    clearInterval(window.timerInterval)

    // Update state
    setIsTimerRunning(false)
    setObjectiveTimers((prev) => ({
      ...prev,
      [objective.id]: (prev[objective.id] || 0) + elapsedSeconds,
    }))
    setElapsedTime(0)

    // Notify the project manager
    toast({
      title: "Timer auto-stopped",
      description: `Task "${objective.name}" timer auto-stopped at end of workday after ${formatTime(elapsedSeconds)}`,
      variant: "warning",
    })

    // In a real app, you would send a notification to the PM
    // sendNotificationToPM({
    //   objectiveName: objective.name,
    //   projectName: project.name,
    //   timeSpent: formatTime(elapsedSeconds),
    //   timestamp: new Date().toISOString()
    // })
  }

  const handleStopTimer = () => {
    if (activeObjective) {
      setIsTimerRunning(false)

      // Update the total time for this objective
      setObjectiveTimers((prev) => ({
        ...prev,
        [activeObjective.id]: (prev[activeObjective.id] || 0) + elapsedTime,
      }))

      // Clear the timer interval
      // @ts-ignore
      clearInterval(window.timerInterval)
      setElapsedTime(0)

      // In a real app, you would log the time in the database
      toast({
        title: "Timer stopped",
        description: `Logged ${formatTime(elapsedTime)} for ${activeObjective.name}`,
      })
    }
  }

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  // Calculate cost based on time and hourly rate
  const calculateCost = (seconds: number, hourlyRate = 150) => {
    const hours = seconds / 3600
    return (hours * hourlyRate).toFixed(2)
  }

  // Toggle objective expansion
  const toggleObjective = (objectiveId: string) => {
    if (expandedObjective === objectiveId) {
      setExpandedObjective(null)
    } else {
      setExpandedObjective(objectiveId)
    }
  }

  // Calculate task completion percentage for an objective
  const calculateObjectiveProgress = (objective: any) => {
    if (!objective.tasks || objective.tasks.length === 0) return 0

    const completedTasks = objective.tasks.filter((task) => task.status === "completed").length
    return Math.round((completedTasks / objective.tasks.length) * 100)
  }

  // Format date as MM/DD/YYYY
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  // Function to validate if project can be changed to active
  const canSwitchToActive = () => {
    if (project.stage === "bidding") {
      if (!projectManager) {
        toast({
          title: "Unable to activate project",
          description: "Bidding projects must have an assigned project manager before switching to active status.",
          variant: "destructive",
        })
        return false
      }

      if (projectManager.title !== "Project Manager") {
        toast({
          title: "Unable to activate project",
          description: "Only employees with the Project Manager title can be assigned as project managers.",
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  // Function to handle project stage change
  const handleStageChange = (newStage: string) => {
    if (newStage === "active" && !canSwitchToActive()) {
      return
    }

    // In a real app, you would update the project in your database
    toast({
      title: "Updating project stage...",
      description: `Changing project stage from ${project.stage} to ${newStage}`,
    })

    setTimeout(() => {
      project.stage = newStage
      toast({
        title: "Project updated",
        description: `Project stage has been updated to ${newStage}`,
      })
    }, 500)
  }

  // Function to send notification to assigned user
  const sendAssignmentNotification = (user, objectiveName) => {
    // In a real app, this would send a notification to the user
    // For demo purposes, we'll just show a toast
    toast({
      title: "Notification Sent",
      description: `${user.name} has been notified of assignment to ${objectiveName}`,
    })

    // Add to notifications (in a real app, this would be stored in a database)
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: "New Assignment",
      message: `You have been assigned to ${objectiveName} by ${projectManager?.name || "the project manager"}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: "task",
      priority: "medium",
    }

    console.log("New notification created:", newNotification)
    // In a real app: addNotification(user.id, newNotification);
  }

  return (
    <div className="min-h-screen bg-gray-50" data-project-stage={project.stage || "unknown"}>
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
                <h1 className="text-lg font-semibold text-gray-800">{project.name}</h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>#{project.number || "N/A"}</span>
                  <span>•</span>
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
                    {project.stage?.charAt(0).toUpperCase() + project.stage?.slice(1) || "N/A"}
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

      {/* Content area with tabs for different sections */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Project Details Card - 3 columns */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-medium text-gray-700">Project Details</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Number:</span>
                <span className="text-sm font-medium">#{project.number || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phase:</span>
                <span className="text-sm font-medium">{project.phase || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Location:</span>
                <span className="text-sm font-medium">{project.location || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Start:</span>
                <span className="text-sm font-medium">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : formatDate(projectStartDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">End:</span>
                <span className="text-sm font-medium">
                  {project.endDate ? new Date(project.endDate).toLocaleDateString() : formatDate(projectEndDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Duration:</span>
                <span className="text-sm font-medium">{projectDuration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Contract:</span>
                <span className="text-sm font-medium">${project.contractAmount?.toLocaleString() || "N/A"}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
              <p className="text-sm font-medium">{project.clientName || "N/A"}</p>
              <p className="text-sm text-gray-600">{project.clientEmail || "N/A"}</p>
              <p className="text-sm text-gray-600">{project.clientPhone || "N/A"}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Project Manager</h3>
              {projectManager ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={projectManager.avatar || "/placeholder.svg"} alt={projectManager.name} />
                    <AvatarFallback>{projectManager.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{projectManager.name}</p>
                    <p className="text-xs text-gray-600">{projectManager.title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto p-1 h-6 text-gray-400 hover:text-gray-600"
                    onClick={() => setProjectManager(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div>
                  {isSearching ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search by name..."
                          className="text-xs h-8"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            // In a real app, this would be debounced and would query your database
                            const filteredResults = sampleProjectManagers.filter((pm) =>
                              pm.name.toLowerCase().includes(e.target.value.toLowerCase()),
                            )
                            setSearchResults(filteredResults)
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            setIsSearching(false)
                            setSearchTerm("")
                            setSearchResults([])
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="max-h-40 overflow-y-auto border rounded-md">
                        {searchResults.length > 0 ? (
                          searchResults.map((pm) => (
                            <div
                              key={pm.id}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setProjectManager(pm)
                                setIsSearching(false)
                                setSearchTerm("")
                                setSearchResults([])
                                toast({
                                  title: "Project Manager Assigned",
                                  description: `${pm.name} has been assigned as the project manager.`,
                                })
                              }}
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={pm.avatar || "/placeholder.svg"} alt={pm.name} />
                                <AvatarFallback>{pm.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{pm.name}</p>
                                <p className="text-xs text-gray-600">{pm.title}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm text-gray-500">
                            {searchTerm ? "No project managers found" : "Type to search for project managers"}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full h-8"
                      onClick={() => {
                        setIsSearching(true)
                      }}
                    >
                      Assign Project Manager
                    </Button>
                  )}
                  {project.stage === "bidding" && (
                    <p className="text-xs text-red-500 mt-1">Required before activating project</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Project Files</h3>
              <div className="space-y-2">
                <div className="flex flex-col space-y-2">
                  <Input
                    placeholder="Paste Google Drive URL here"
                    className="text-xs h-8"
                    value={googleDriveLink}
                    onChange={(e) => setGoogleDriveLink(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="w-full h-8"
                    onClick={handleSaveGoogleDriveLink}
                    disabled={!googleDriveLink || !googleDriveLink.trim().startsWith("https://")}
                  >
                    {project.googleDriveLink ? "Update Link" : "Save Link"}
                  </Button>
                </div>

                {project.googleDriveLink && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Saved link:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          navigator.clipboard.writeText(project.googleDriveLink || "")
                          toast({
                            title: "Copied",
                            description: "Link copied to clipboard",
                          })
                        }}
                        title="Copy link"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate" title={project.googleDriveLink}>
                      {project.googleDriveLink}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 h-8 text-xs"
                      onClick={() => {
                        window.open(project.googleDriveLink, "_blank", "noopener,noreferrer")
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Open Project Files
                    </Button>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-1">
                  <p>Paste your Google Drive folder link above for project documents and click Save.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Objectives Card - 9 columns (largest part) */}
          {/* Conditional Card Based on Project Stage */}
          <div className="col-span-12 lg:col-span-9 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            {project.stage === "inquiry" ? (
              /* Inquiry Stage Content */
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-medium text-gray-700">Project Inquiry Details</h2>
                  </div>
                  {project.meetingScheduled ? (
                    <Badge className="bg-green-100 text-green-800">Meeting Scheduled</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">Awaiting Initial Consultation</Badge>
                  )}
                </div>

                {/* Client Information */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold mb-3">Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium">{`${project.clientName || "N/A"}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="text-sm font-medium">{project.companyName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">{project.clientEmail || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{project.clientPhone || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium">
                        {[
                          project.clientAddress,
                          project.clientCity,
                          project.clientState,
                          project.clientZipCode,
                          project.clientCountry !== "United States" ? project.clientCountry : "",
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold mb-3">Project Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Service Type</p>
                      <p className="text-sm font-medium">
                        {project.serviceType
                          ? project.serviceType.charAt(0).toUpperCase() +
                            project.serviceType.slice(1).replace(/-/g, " ")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Square Footage</p>
                      <p className="text-sm font-medium">
                        {project.squareFootage ? `${project.squareFootage} sq ft` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Timeline</p>
                      <p className="text-sm font-medium">
                        {project.projectTimeline ? project.projectTimeline.replace(/-/g, " ") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget Range</p>
                      <p className="text-sm font-medium">
                        {project.budgetRange
                          ? project.budgetRange.replace(/-/g, " to ").replace("k", ",000").replace("m", " million")
                          : "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500">Project Location</p>
                      <p className="text-sm font-medium">
                        {[
                          project.projectStreetAddress,
                          project.projectCity,
                          project.projectState,
                          project.projectZipCode,
                          project.projectCountry !== "United States" ? project.projectCountry : "",
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                    {project.projectDescription && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Project Description</p>
                        <p className="text-sm">{project.projectDescription}</p>
                      </div>
                    )}
                    {project.architecturalStyle && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Architectural Style Preferences</p>
                        <p className="text-sm">{project.architecturalStyle}</p>
                      </div>
                    )}
                    {project.siteConstraints && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Site Constraints</p>
                        <p className="text-sm">{project.siteConstraints}</p>
                      </div>
                    )}
                    {project.sustainabilityGoals && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Sustainability Goals</p>
                        <p className="text-sm">{project.sustainabilityGoals}</p>
                      </div>
                    )}
                    {project.specialRequirements && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Special Requirements</p>
                        <p className="text-sm">{project.specialRequirements}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consultation Meeting */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold mb-3">Scheduled Consultation</h3>
                  {project.appointmentDate ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">
                          {new Date(project.appointmentDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm font-medium">{project.appointmentTime || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Meeting Type</p>
                        <p className="text-sm font-medium">
                          {project.appointmentType ? project.appointmentType.replace(/-/g, " ") : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium">
                          {project.meetingLocation || project.appointmentLocation || "N/A"}
                        </p>
                      </div>
                      {project.appointmentNotes && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500">Notes</p>
                          <p className="text-sm">{project.appointmentNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500">No consultation meeting scheduled yet.</p>
                      <Button
                        className="mt-2"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Schedule Meeting",
                            description: "This would open the meeting scheduler in a real application.",
                          })
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  )}
                </div>

                {/* Next Steps */}
                <div className="mt-6 text-center">
                  <h3 className="text-sm font-semibold mb-3">Next Steps</h3>
                  <div className="flex flex-col md:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Create Proposal",
                          description: "This would open the proposal creation form in a real application.",
                        })
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Proposal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Schedule Meeting",
                          description: "This would open the meeting scheduler in a real application.",
                        })
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {project.appointmentDate ? "Reschedule Meeting" : "Schedule Meeting"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Send Follow-up Email",
                          description: "This would open the email composer in a real application.",
                        })
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Follow-up Email
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Objectives Card for non-inquiry stages (original content) */
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-medium text-gray-700">Project Objectives & Schedule</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setShowTimelineModal(true)}
                    >
                      <CalendarDays className="h-3 w-3 mr-1" />
                      View Timeline
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Objective
                    </Button>
                  </div>
                </div>

                {/* Project Schedule Overview */}
                <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Project Schedule Overview</h3>
                    <div className="text-xs text-gray-500">
                      {formatDate(projectStartDate)} - {formatDate(projectEndDate)} ({projectDuration} days)
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
                    {defaultObjectives.map((objective, index) => {
                      // Calculate position and width based on tasks
                      let objectiveDuration = 0
                      objective.tasks.forEach((task) => {
                        objectiveDuration += task.duration
                      })

                      const objectiveWidth = (objectiveDuration / projectDuration) * 100

                      // Calculate position (sum of previous objectives' durations)
                      let position = 0
                      for (let i = 0; i < index; i++) {
                        let prevDuration = 0
                        defaultObjectives[i].tasks.forEach((task) => {
                          prevDuration += task.duration
                        })
                        position += prevDuration
                      }

                      const positionPercent = (position / projectDuration) * 100

                      // Determine color based on status
                      let bgColor = "bg-gray-400"
                      if (objective.status === "completed") {
                        bgColor = "bg-green-500"
                      } else if (objective.status === "in-progress") {
                        bgColor = "bg-blue-500"
                      } else if (objective.status === "pending") {
                        bgColor = "bg-amber-300"
                      }

                      return (
                        <div
                          key={objective.id}
                          className={`absolute top-0 h-full ${bgColor} border-r border-white`}
                          style={{
                            left: `${positionPercent}%`,
                            width: `${objectiveWidth}%`,
                          }}
                          title={`${objective.name}: ${objectiveDuration} days`}
                        ></div>
                      )
                    })}

                    {/* Today marker */}
                    <div className="absolute top-0 h-full border-l-2 border-red-500 z-10" style={{ left: "0%" }}>
                      <div className="bg-red-500 text-white text-xs px-1 rounded-sm">Today</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Start</span>
                    <span>End</span>
                  </div>
                </div>

                {/* Objectives List */}
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
                  {defaultObjectives.map((objective) => (
                    <div key={objective.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleObjective(objective.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            {expandedObjective === objective.id ? (
                              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
                            )}
                            <h3 className="font-medium">{objective.name}</h3>
                            {objective.assignedTo && (
                              <div className="ml-2 flex items-center">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={objective.assignedTo.avatar || "/placeholder.svg"}
                                    alt={objective.assignedTo.name}
                                  />
                                  <AvatarFallback>{objective.assignedTo.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="ml-1 text-xs text-gray-600">
                                  {objective.assignedTo.name}
                                  {objective.assignedTo.isSelf ? " (you)" : ""}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center mt-1 ml-6 text-xs text-gray-500">
                            <span className="mr-4">Budget: ${objective.budgetedCost?.toLocaleString() || 0}</span>
                            <span className="mr-4">
                              Tasks: {objective.tasks.filter((t) => t.status === "completed").length}/
                              {objective.tasks.length}
                            </span>
                            <span>Progress: {calculateObjectiveProgress(objective)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={`${
                              objective.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : objective.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {objective.status}
                          </Badge>

                          {!objective.assignedTo ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Assign User
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Assign to:</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {projectManager && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const selfAssignment = {
                                        ...projectManager,
                                        isSelf: true,
                                      }
                                      objective.assignedTo = selfAssignment
                                      setExpandedObjective(expandedObjective)
                                      sendAssignmentNotification(selfAssignment, objective.name)
                                      toast({
                                        title: "Self-Assigned",
                                        description: `You have assigned yourself to ${objective.name}`,
                                      })
                                    }}
                                  >
                                    <div className="flex items-center">
                                      <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage
                                          src={projectManager.avatar || "/placeholder.svg"}
                                          alt={projectManager.name}
                                        />
                                        <AvatarFallback>{projectManager.name.substring(0, 2)}</AvatarFallback>
                                      </Avatar>
                                      <span>{projectManager.name} (you)</span>
                                    </div>
                                  </DropdownMenuItem>
                                )}
                                {/* Sample team members */}
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const user = {
                                      id: 1,
                                      name: "Alex Kim",
                                      email: "alex@example.com",
                                      avatar: "/placeholder.svg",
                                    }
                                    objective.assignedTo = user
                                    setExpandedObjective(expandedObjective)
                                    sendAssignmentNotification(user, objective.name)
                                    toast({
                                      title: "User Assigned",
                                      description: `${user.name} has been assigned to ${objective.name}`,
                                    })
                                  }}
                                >
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src="/placeholder.svg" alt="Alex Kim" />
                                      <AvatarFallback>AK</AvatarFallback>
                                    </Avatar>
                                    <span>Alex Kim</span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const user = {
                                      id: 2,
                                      name: "Jordan Taylor",
                                      email: "jordan@example.com",
                                      avatar: "/placeholder.svg",
                                    }
                                    objective.assignedTo = user
                                    setExpandedObjective(expandedObjective)
                                    sendAssignmentNotification(user, objective.name)
                                    toast({
                                      title: "User Assigned",
                                      description: `${user.name} has been assigned to ${objective.name}`,
                                    })
                                  }}
                                >
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src="/placeholder.svg" alt="Jordan Taylor" />
                                      <AvatarFallback>JT</AvatarFallback>
                                    </Avatar>
                                    <span>Jordan Taylor</span>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={objective.assignedTo.avatar || "/placeholder.svg"}
                                  alt={objective.assignedTo.name}
                                />
                                <AvatarFallback>{objective.assignedTo.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">
                                {objective.assignedTo.name}
                                {objective.assignedTo.isSelf ? " (you)" : ""}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-6 text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  objective.assignedTo = null
                                  setExpandedObjective(expandedObjective)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          {isTimerRunning && activeObjective?.id === objective.id ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={handleStopTimer}
                              timer={true}
                              timerStartTime={Date.now() - elapsedTime * 1000}
                            >
                              <Square className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartTimer(objective)
                              }}
                              disabled={isTimerRunning}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Tasks list (expanded view) */}
                      {expandedObjective === objective.id && (
                        <div className="mt-3 ml-6 space-y-2">
                          <div className="flex justify-between text-xs font-medium text-gray-500 px-2">
                            <span className="w-1/2">Task</span>
                            <span className="w-1/6 text-center">Duration</span>
                            <span className="w-1/6 text-center">Status</span>
                            <span className="w-1/6 text-right">Actions</span>
                          </div>

                          {objective.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 text-sm"
                            >
                              <span className="w-1/2 truncate">{task.name}</span>
                              <span className="w-1/6 text-center">{task.duration} days</span>
                              <span className="w-1/6 text-center">
                                <TaskStatusBadge
                                  status={task.status === "pending" ? "not-started" : (task.status as any)}
                                  onStatusChange={(newStatus) => {
                                    // Update the task status
                                    task.status = newStatus === "not-started" ? "pending" : newStatus

                                    // Check if all tasks are now completed
                                    const allTasksCompleted = objective.tasks.every((t) => t.status === "completed")

                                    // If all tasks are completed, suggest marking the objective as completed
                                    if (allTasksCompleted && objective.status !== "completed") {
                                      toast({
                                        title: "All Tasks Completed",
                                        description: `All tasks in "${objective.name}" are now completed. You can mark the objective as completed.`,
                                        action: (
                                          <div className="mt-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                objective.status = "completed"
                                                setExpandedObjective(expandedObjective)
                                                toast({
                                                  title: "Objective Completed",
                                                  description: `${objective.name} has been marked as completed.`,
                                                })
                                              }}
                                            >
                                              Mark Objective Complete
                                            </Button>
                                          </div>
                                        ),
                                      })
                                    }

                                    // Force re-render
                                    setExpandedObjective(expandedObjective)

                                    if (newStatus === "completed") {
                                      toast({
                                        title: "Task Completed",
                                        description: `Task "${task.name}" has been marked as completed.`,
                                      })
                                    }
                                  }}
                                />
                              </span>
                              <span className="w-1/6 text-right">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </span>
                            </div>
                          ))}

                          <div className="flex justify-between items-center mt-4">
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Task
                            </Button>

                            <Button
                              variant={objective.status === "completed" ? "outline" : "default"}
                              size="sm"
                              className={`text-xs ${objective.status === "completed" ? "border-green-500 text-green-700" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                // Check if all tasks are completed
                                const allTasksCompleted = objective.tasks.every((task) => task.status === "completed")

                                if (!allTasksCompleted && objective.status !== "completed") {
                                  toast({
                                    title: "Cannot Complete Objective",
                                    description:
                                      "All tasks must be completed before marking the objective as complete.",
                                    variant: "destructive",
                                  })
                                  return
                                }

                                // Toggle completion status only if complete or all tasks are completed
                                const newStatus = objective.status === "completed" ? "in-progress" : "completed"
                                objective.status = newStatus

                                // Force re-render by updating state
                                setExpandedObjective(expandedObjective)

                                toast({
                                  title: newStatus === "completed" ? "Objective Completed" : "Objective Reopened",
                                  description:
                                    newStatus === "completed"
                                      ? `${objective.name} has been marked as completed.`
                                      : `${objective.name} has been reopened.`,
                                  variant: newStatus === "completed" ? "default" : "destructive",
                                })
                              }}
                            >
                              {objective.status === "completed" ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <CheckSquare className="h-3 w-3 mr-1" />
                                  Mark as Complete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Time Tracking Card - Full width in a new row */}
          <div className="col-span-12 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <h2 className="text-sm font-medium text-gray-700">Time Tracking</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Active Timer */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-2">Active Timer</h3>

                {isTimerRunning && activeObjective ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs text-gray-500">Currently tracking:</h4>
                      <p className="text-sm font-medium">{activeObjective.name}</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg text-center">
                      <div className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</div>
                      <p className="text-xs text-gray-500 mt-1">Current session: ${calculateCost(elapsedTime)}</p>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                        onClick={handleStopTimer}
                        timer={true}
                        timerStartTime={Date.now() - elapsedTime * 1000}
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Stop
                      </Button>

                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          handleStopTimer()
                          toast({
                            title: "Time saved",
                            description: `Saved ${formatTime(elapsedTime)} for ${activeObjective.name}`,
                          })
                        }}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No active timer</p>
                    <p className="text-xs mt-1">Start a timer from objectives</p>
                  </div>
                )}
              </div>

              {/* Time Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-2">Time Summary</h3>

                {Object.entries(objectiveTimers).length > 0 ? (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {Object.entries(objectiveTimers).map(([objectiveId, seconds]) => {
                      const objective = defaultObjectives.find((o) => o.id === objectiveId)
                      return objective ? (
                        <div key={objectiveId} className="flex justify-between items-center">
                          <div className="text-xs truncate max-w-[50%]">{objective.name}</div>
                          <div className="text-xs flex items-center space-x-2">
                            <span className="font-medium">{formatTime(seconds)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                // Show a dialog to adjust time
                                const hours = Math.floor(seconds / 3600)
                                const minutes = Math.floor((seconds % 3600) / 60)
                                const adjustedSeconds = Math.floor(seconds % 60)
                                const adjustedTime = prompt(
                                  `Adjust time for ${objective.name} (format: HH:MM:SS)`,
                                  `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${adjustedSeconds.toString().padStart(2, "0")}`,
                                )

                                if (adjustedTime) {
                                  const [h, m, s] = adjustedTime.split(":").map(Number)
                                  if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                                    const newSeconds = h * 3600 + m * 60 + s
                                    setObjectiveTimers((prev) => ({
                                      ...prev,
                                      [objectiveId]: newSeconds,
                                    }))
                                    toast({
                                      title: "Time adjusted",
                                      description: `Updated time for ${objective.name} to ${formatTime(newSeconds)}`,
                                    })
                                  }
                                }
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : null
                    })}

                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium">Total</div>
                        <div className="text-xs font-medium">
                          $
                          {Object.values(objectiveTimers)
                            .reduce((total, seconds) => total + Number.parseFloat(calculateCost(seconds)), 0)
                            .toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No time logged yet</p>
                  </div>
                )}

                <Button
                  size="sm"
                  className="w-full mt-3 text-xs"
                  disabled={Object.entries(objectiveTimers).length === 0}
                >
                  Generate Invoice
                </Button>
              </div>

              {/* Project Progress */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-2">Project Progress</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Overall Completion</span>
                      <span>
                        {Math.round(
                          (defaultObjectives.reduce((sum, obj) => sum + calculateObjectiveProgress(obj), 0) /
                            (defaultObjectives.length * 100)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.round(
                            (defaultObjectives.reduce((sum, obj) => sum + calculateObjectiveProgress(obj), 0) /
                              (defaultObjectives.length * 100)) *
                              100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Time Elapsed</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    <div className="flex justify-between">
                      <span>Estimated Completion:</span>
                      <span>{formatDate(projectEndDate)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Days Remaining:</span>
                      <span>{projectDuration} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Gantt Chart Modal */}
      {showTimelineModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Project Timeline (Gantt Chart)</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowTimelineModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 overflow-auto flex-grow">
              <div className="mb-4 text-sm">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">Project:</span> {project.name}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {projectDuration} working days (40hr work week,
                    8am-5pm, excluding weekends)
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <div>
                    <span className="font-medium">Start:</span> {formatDate(projectStartDate)}
                  </div>
                  <div>
                    <span className="font-medium">End:</span> {formatDate(projectEndDate)}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {/* Header - Days */}
                <div className="flex border-b bg-gray-50">
                  <div className="w-64 flex-shrink-0 p-2 font-medium border-r">Task</div>
                  <div className="flex-grow flex">
                    {Array.from({ length: projectDuration }, (_, i) => {
                      const date = new Date(projectStartDate)
                      date.setDate(date.getDate() + i)
                      // Skip weekends
                      if (date.getDay() === 0 || date.getDay() === 6) return null
                      return (
                        <div
                          key={i}
                          className={`w-10 flex-shrink-0 text-center text-xs p-1 border-r ${
                            date.getDay() === 1 ? "font-medium" : ""
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>

                {/* Header - Months */}
                <div className="flex border-b bg-gray-50">
                  <div className="w-64 flex-shrink-0 p-2 font-medium border-r"></div>
                  <div className="flex-grow flex">
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date(projectStartDate)
                      date.setMonth(date.getMonth() + i)
                      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
                      // Count working days in month
                      let workingDays = 0
                      for (let d = 1; d <= daysInMonth; d++) {
                        const dayDate = new Date(date.getFullYear(), date.getMonth(), d)
                        if (dayDate.getDay() !== 0 && dayDate.getDay() !== 6) workingDays++
                      }
                      return (
                        <div
                          key={i}
                          className="border-r text-center text-xs font-medium"
                          style={{ width: `${workingDays * 40}px` }}
                        >
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tasks */}
                {defaultObjectives.map((objective) => (
                  <div key={objective.id}>
                    {/* Objective row */}
                    <div className="flex border-b bg-gray-100">
                      <div className="w-64 flex-shrink-0 p-2 font-medium border-r truncate">{objective.name}</div>
                      <div className="flex-grow h-8 relative">
                        {/* Calculate position based on tasks */}
                        {(() => {
                          let position = 0
                          let objectiveDuration = 0

                          // Find position (days from project start)
                          for (let i = 0; i < defaultObjectives.indexOf(objective); i++) {
                            defaultObjectives[i].tasks.forEach((task) => {
                              // Only count weekdays
                              for (let d = 0; d < task.duration; d++) {
                                const date = new Date(projectStartDate)
                                date.setDate(date.getDate() + position + d)
                                if (date.getDay() !== 0 && date.getDay() !== 6) {
                                  objectiveDuration++
                                }
                              }
                            })
                            position += objectiveDuration
                            objectiveDuration = 0
                          }

                          // Calculate duration (only weekdays)
                          objective.tasks.forEach((task) => {
                            for (let d = 0; d < task.duration; d++) {
                              const date = new Date(projectStartDate)
                              date.setDate(date.getDate() + position + d)
                              if (date.getDay() !== 0 && date.getDay() !== 6) {
                                objectiveDuration++
                              }
                            }
                          })

                          // Determine color based on status
                          let bgColor = "bg-gray-400"
                          if (objective.status === "completed") {
                            bgColor = "bg-green-500"
                          } else if (objective.status === "in-progress") {
                            bgColor = "bg-blue-500"
                          } else if (objective.status === "pending") {
                            bgColor = "bg-amber-300"
                          }

                          return (
                            <div
                              className={`absolute top-1 h-6 ${bgColor} rounded`}
                              style={{
                                left: `${position * 40}px`,
                                width: `${objectiveDuration * 40}px`,
                              }}
                              title={`${objective.name}: ${objectiveDuration} working days`}
                            ></div>
                          )
                        })()}
                      </div>
                    </div>

                    {/* Task rows */}
                    {objective.tasks.map((task, taskIndex) => {
                      // Calculate position (days from project start)
                      let position = 0

                      // Add up all previous objectives' durations
                      for (let i = 0; i < defaultObjectives.indexOf(objective); i++) {
                        defaultObjectives[i].tasks.forEach((t) => {
                          // Only count weekdays
                          for (let d = 0; d < t.duration; d++) {
                            const date = new Date(projectStartDate)
                            date.setDate(date.getDate() + position + d)
                            if (date.getDay() !== 0 && date.getDay() !== 6) {
                              position++
                            }
                          }
                        })
                      }

                      // Add up previous tasks in this objective
                      for (let i = 0; i < taskIndex; i++) {
                        const prevTask = objective.tasks[i]
                        // Only count weekdays
                        for (let d = 0; d < prevTask.duration; d++) {
                          const date = new Date(projectStartDate)
                          date.setDate(date.getDate() + position + d)
                          if (date.getDay() !== 0 && date.getDay() !== 6) {
                            position++
                          }
                        }
                      }

                      // Calculate task duration (only weekdays)
                      let taskDuration = 0
                      for (let d = 0; d < task.duration; d++) {
                        const date = new Date(projectStartDate)
                        date.setDate(date.getDate() + position + d)
                        if (date.getDay() !== 0 && date.getDay() !== 6) {
                          taskDuration++
                        }
                      }

                      // Determine color based on status
                      let bgColor = "bg-gray-300"
                      if (task.status === "completed") {
                        bgColor = "bg-green-400"
                      } else if (task.status === "in-progress") {
                        bgColor = "bg-blue-400"
                      } else if (task.status === "pending") {
                        bgColor = "bg-amber-200"
                      }

                      return (
                        <div key={task.id} className="flex border-b hover:bg-gray-50">
                          <div className="w-64 flex-shrink-0 p-2 text-sm border-r pl-6 truncate">{task.name}</div>
                          <div className="flex-grow h-8 relative">
                            <div
                              className={`absolute top-1 h-6 ${bgColor} rounded border border-gray-400`}
                              style={{
                                left: `${position * 40}px`,
                                width: `${taskDuration * 40}px`,
                              }}
                              title={`${task.name}: ${taskDuration} working days`}
                            >
                              <div className="px-2 text-xs truncate whitespace-nowrap">
                                {task.name} ({taskDuration}d)
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* Today marker */}
                <div
                  className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10"
                  style={{
                    left: `${264 + 0}px`, // 264px is the width of the task column
                  }}
                >
                  <div className="bg-red-500 text-white text-xs px-1 rounded-sm">Today</div>
                </div>
              </div>

              {/* Working hours legend */}
              <div className="mt-4 text-xs text-gray-500">
                <div className="font-medium mb-1">Working Hours:</div>
                <div className="flex space-x-4">
                  <div>Monday-Friday: 8:00 AM - 5:00 PM</div>
                  <div>Weekends: Excluded</div>
                  <div>Holidays: Excluded</div>
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowTimelineModal(false)}>
                Close
              </Button>
              <Button size="sm">Export PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
