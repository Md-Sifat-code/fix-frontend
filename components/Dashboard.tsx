"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"
import { useCallback, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { NewProposalDialog } from "@/components/NewProposalDialog"
import ProjectReviewPage from "./ProjectReviewPage"
import { InquiryReviewPage } from "./InquiryReviewPage"
import {
  Filter,
  FileText,
  Settings,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Clock,
  Target,
  MapPin,
  Edit,
  Eye,
  Share,
  Play,
  Youtube,
  Copy,
  MoreHorizontal,
  Heart,
  Bookmark,
} from "lucide-react"
import { ProjectForm } from "@/components/ProjectForm"
import type { Project } from "@/components/ProjectForm"
import { FinancialsPage } from "./FinancialsPage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PublicationForm } from "@/components/PublicationForm"
import { PlanForm } from "@/components/PlanForm"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { TasksDialog } from "@/components/TasksDialog"
import { DashboardSidebar } from "./DashboardSidebar"
import { DashboardOverview } from "./DashboardOverview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TimeCardSubmissionDialog } from "./TimeCardSubmissionDialog"
import { useProjects } from "@/contexts/ProjectContext"
import { ProjectFinancialSummary } from "./ProjectFinancialSummary"
import { NotificationCenter } from "@/components/NotificationCenter"
import { useToast } from "@/components/ui/use-toast"
import { StudioProjectsSection } from "./StudioProjectsSection"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  projectId?: string
  type: "task" | "milestone" | "message" | "update" | "payroll"
  priority: "low" | "medium" | "high"
  securityLevel?: "owner" | "admin" | "standard"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New task assigned",
    message: "Review architectural plans for Modern Residence project",
    timestamp: "2023-06-15T10:30:00Z",
    read: false,
    projectId: "project1",
    type: "task",
    priority: "high",
  },
  {
    id: "2",
    title: "Project milestone reached",
    message: "Schematic Design phase for Urban Office Complex completed",
    timestamp: "2023-06-14T15:45:00Z",
    read: true,
    type: "milestone",
    priority: "medium",
  },
  {
    id: "3",
    title: "New message from client",
    message: "The client for Sustainable Community Center has sent a new message",
    timestamp: "2023-06-13T09:15:00Z",
    read: false,
    projectId: "project2",
    type: "message",
    priority: "medium",
  },
  {
    id: "4",
    title: "Project update",
    message: "Budget adjustments made for Skyline Tower project",
    timestamp: "2023-06-12T14:20:00Z",
    read: false,
    projectId: "project3",
    type: "update",
    priority: "low",
  },
]

const projectData = {
  inquiry: Array.from({ length: 8 }, (_, i) => ({
    id: `inquiry-${i + 1}`,
    name: `Inquiry Project ${i + 1}`,
    number: `25${4000 + i}`,
    stage: "inquiry",
    phase: "Initial Contact",
    clientName: `Client ${i + 1}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    clientEmail: `client${i + 1}@example.com`,
    currentTask: "SCHEDULE APPOINTMENT",
    location: "VARIOUS",
    projectAddress: `${2000 + i} Project Ave, Project City`,
    startDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  })),
  bidding: Array.from({ length: 8 }, (_, i) => ({
    id: `bidding-${i + 1}`,
    name: `Bidding Project ${i + 1}`,
    number: `25${5000 + i}`,
    stage: "bidding",
    phase: "Proposal",
    clientName: `Client ${i + 9}`,
    firstName: `First${i + 9}`,
    lastName: `Last${i + 9}`,
    clientEmail: `client${i + 9}@example.com`,
    currentTask: "PREPARE PROPOSAL",
    location: "VARIOUS",
    projectAddress: `${3000 + i} Bidding St, Bid City`,
    startDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  })),
  active: Array.from({ length: 8 }, (_, i) => ({
    id: `active-${i + 1}`,
    name: `Active Project ${i + 1}`,
    number: `25${6000 + i}`,
    stage: "active",
    phase: ["SD", "DD", "CD"][i % 3],
    clientName: `Client ${i + 17}`,
    firstName: `First${i + 17}`,
    lastName: `Last${i + 17}`,
    clientEmail: `client${i + 17}@example.com`,
    currentTask: `TASK ${i + 1}`,
    location: "VARIOUS",
    projectAddress: `${4000 + i} Active Rd, Work City`,
    completedTasks: Math.floor(Math.random() * 50),
    totalTasks: 50,
    projectProgress: Math.floor(Math.random() * 100),
    startDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    contractAmount: 500000 + Math.floor(Math.random() * 1000000),
    status: "in-progress",
    tasks: Array.from({ length: 5 }, (_, j) => ({
      id: `task-${i}-${j + 1}`,
      name: `Task ${j + 1} for Active Project ${i + 1}`,
      dueDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      importance: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      completed: false,
    })),
    // Add financial data for active projects
    objectives: [
      {
        id: `obj-${i}-1`,
        name: "Schematic Design",
        budgetedCost: 75000 + Math.floor(Math.random() * 25000),
        actualCost: 70000 + Math.floor(Math.random() * 20000),
        startDate: new Date(2023, 0, 15).toISOString(),
        endDate: new Date(2023, 2, 15).toISOString(),
        status: "completed",
        subTasks: [
          {
            id: `task-${i}-1-1`,
            name: "Site Analysis",
            budgetedHours: 40,
            actualHours: 38,
            budgetedCost: 6000,
            actualCost: 5700,
            status: "completed",
          },
          {
            id: `task-${i}-1-2`,
            name: "Concept Development",
            budgetedHours: 120,
            actualHours: 125,
            budgetedCost: 18000,
            actualCost: 18750,
            status: "completed",
          },
        ],
      },
      {
        id: `obj-${i}-2`,
        name: "Design Development",
        budgetedCost: 150000 + Math.floor(Math.random() * 50000),
        actualCost: 140000 + Math.floor(Math.random() * 30000),
        startDate: new Date(2023, 2, 16).toISOString(),
        endDate: new Date(2023, 5, 15).toISOString(),
        status: i < 4 ? "completed" : "in-progress",
        subTasks: [
          {
            id: `task-${i}-2-1`,
            name: "Floor Plans",
            budgetedHours: 80,
            actualHours: 85,
            budgetedCost: 12000,
            actualCost: 12750,
            status: "completed",
          },
          {
            id: `task-${i}-2-2`,
            name: "Elevations and Sections",
            budgetedHours: 100,
            actualHours: 95,
            budgetedCost: 15000,
            actualCost: 14250,
            status: i < 4 ? "completed" : "in-progress",
          },
        ],
      },
    ],
  })),
  completed: Array.from({ length: 8 }, (_, i) => ({
    id: `completed-${i + 1}`,
    name: `Completed Project ${i + 1}`,
    number: `25${7000 + i}`,
    stage: "completed",
    phase: "Completed",
    clientName: `Client ${i + 25}`,
    firstName: `First${i + 25}`,
    lastName: `Last${i + 25}`,
    clientEmail: `client${i + 25}@example.com`,
    currentTask: "PROJECT CLOSEOUT",
    location: "VARIOUS",
    projectAddress: `${5000 + i} Completed Ln, Done City`,
    startDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    contractAmount: 400000 + Math.floor(Math.random() * 800000),
    status: "completed",
    objectives: [
      {
        id: `obj-comp-${i}-1`,
        name: "Full Project",
        budgetedCost: 350000 + Math.floor(Math.random() * 200000),
        actualCost: 340000 + Math.floor(Math.random() * 180000),
        startDate: new Date(2022, 0, 15).toISOString(),
        endDate: new Date(2022, 11, 15).toISOString(),
        status: "completed",
        subTasks: [
          {
            id: `task-comp-${i}-1`,
            name: "All Tasks",
            budgetedHours: 1200,
            actualHours: 1180,
            budgetedCost: 180000,
            actualCost: 177000,
            status: "completed",
          },
        ],
      },
    ],
  })),
}

const allProjects = [...projectData.inquiry, ...projectData.bidding, ...projectData.active, ...projectData.completed]

function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const { user, loading, logout, updateProfilePhoto } = useAuth()
  const [activeTab, setActiveTab] = useState(tab || "studio")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showProposalDialog, setShowProposalDialog] = useState(false)
  const [showReviewPage, setShowReviewPage] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>(["active"])
  const [selectedYear, setSelectedYear] = useState<number | "overall">(new Date().getFullYear())
  const [showAllTasksDialog, setShowAllTasksDialog] = useState(false)
  const [defaultMediaProject] = useState({ type: "media" })
  const [recentMediaActivity, setRecentMediaActivity] = useState([
    { id: 1, projectName: "Modern Residence", type: "Portfolio", lastUpdated: "2023-07-01", status: "Published" },
    { id: 2, projectName: "Urban Loft Plans", type: "Plans for Sale", lastUpdated: "2023-06-28", status: "Draft" },
    { id: 3, projectName: "Tokyo Skyscraper", type: "Global Project", lastUpdated: "2023-06-25", status: "Published" },
  ])
  const [profilePhoto, setProfilePhoto] = useState("/placeholder.svg?height=32&width=32")
  const [userStats, setUserStats] = useState({
    assignedProjects: 0,
    assignedTasks: 0,
    completedTasks: 0,
    taskCompletionRate: 0,
  })
  const [showPublicationForm, setShowPublicationForm] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [showTimecardDialog, setShowTimecardDialog] = useState(false)
  const [mockProjects] = useState([
    {
      id: "proj1",
      name: "Downtown Office Renovation",
      objectives: [
        {
          id: "obj1",
          name: "Schematic Design",
          subTasks: [
            { id: "task1", name: "Site Analysis" },
            { id: "task2", name: "Concept Development" },
            { id: "task3", name: "Client Presentations" },
          ],
        },
        {
          id: "obj2",
          name: "Design Development",
          subTasks: [
            { id: "task4", name: "Floor Plans" },
            { id: "task5", name: "Elevations and Sections" },
          ],
        },
        {
          id: "obj3",
          name: "Construction Documents",
          subTasks: [
            { id: "task6", name: "Structural Drawings" },
            { id: "task7", name: "MEP Coordination" },
          ],
        },
      ],
    },
    {
      id: "proj2",
      name: "Waterfront Residential Complex",
      objectives: [
        {
          id: "obj4",
          name: "Concept Design",
          subTasks: [
            { id: "task8", name: "Site Planning" },
            { id: "task9", name: "Massing Studies" },
          ],
        },
      ],
    },
  ])

  // Media section state
  const [mediaTitle, setMediaTitle] = useState("")
  const [mediaType, setMediaType] = useState("portfolio")
  const [mediaDescription, setMediaDescription] = useState("")
  const [mediaStatus, setMediaStatus] = useState("draft")
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  // Global Project specific state
  const [projectLocation, setProjectLocation] = useState("")
  const [projectYear, setProjectYear] = useState(new Date().getFullYear().toString())
  const [architectName, setArchitectName] = useState("")
  const [architectStudio, setArchitectStudio] = useState("")
  const [architectInstagram, setArchitectInstagram] = useState("")
  const [photographerName, setPhotographerName] = useState("")
  const [photographerStudio, setPhotographerStudio] = useState("")
  const [photographerInstagram, setPhotographerInstagram] = useState("")
  const [taggedAccounts, setTaggedAccounts] = useState<Array<{ username: string; fullName: string }>>([])
  const [searchInstagramQuery, setSearchInstagramQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ username: string; fullName: string }>>([])
  const [showPreview, setShowPreview] = useState(false)
  const [activePreviewTab, setActivePreviewTab] = useState<"website" | "instagram">("website")
  const [livePreview, setLivePreview] = useState(true)

  // Add this function to handle real-time preview updates
  const handlePreviewToggle = () => {
    setLivePreview(!livePreview)
  }

  // Preview modal component
  const PreviewModal = () => {
    if (!showPreview) return null

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 text-sm font-medium ${activePreviewTab === "website" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              onClick={() => setActivePreviewTab("website")}
            >
              Website Preview
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activePreviewTab === "instagram" ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-500"}`}
              onClick={() => setActivePreviewTab("instagram")}
            >
              Instagram Preview
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(80vh-40px)]">
            {activePreviewTab === "website" ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {mediaPreview ? (
                    <img
                      src={"https://picsum.photos/1280/720"}
                      alt={mediaTitle || "Project Preview"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm flex flex-col items-center">
                      <RefreshCw className="h-8 w-8 mb-2" />
                      <span>No image uploaded</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{mediaTitle || "Project Title"}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {projectLocation ? projectLocation : "Location"}
                    {projectYear ? `, ${projectYear}` : ""}
                  </p>
                  <div className="mt-2 text-sm">{mediaDescription || "Project description will appear here."}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {architectName && (
                      <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                        Architect: {architectName}
                        {architectStudio ? ` (${architectStudio})` : ""}
                        {architectInstagram && <span className="ml-1">@{architectInstagram}</span>}
                      </div>
                    )}
                    {photographerName && (
                      <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                        Photo: {photographerName}
                        {photographerStudio ? ` (${photographerStudio})` : ""}
                        {photographerInstagram && <span className="ml-1">@{photographerInstagram}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg overflow-hidden max-w-[360px] mx-auto">
                <div className="bg-white p-2 flex items-center border-b">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"></div>
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-semibold">archsimple</div>
                    {addLocation && projectLocation && <div className="text-xs text-gray-500">{projectLocation}</div>}
                  </div>
                  <div className="ml-auto">
                    <MoreHorizontal className="h-5 w-5" />
                  </div>
                </div>

                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  {mediaPreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={"https://picsum.photos/1280/720"}
                        alt={mediaTitle || "Instagram Preview"}
                        className="w-full h-full object-cover"
                      />
                      {/* Tagged accounts overlay */}
                      {taggedAccounts.length > 0 && (
                        <div className="absolute inset-0">
                          {/* Tag indicators */}
                          {taggedAccounts.map((account, index) => {
                            // Position tags at different spots in the image
                            const positions = [
                              { top: "20%", left: "30%" },
                              { top: "40%", left: "70%" },
                              { top: "60%", left: "20%" },
                              { top: "70%", left: "60%" },
                              { top: "30%", left: "50%" },
                            ]
                            const pos = positions[index % positions.length]

                            return (
                              <div
                                key={account.username}
                                className="absolute w-6 h-6 rounded-full border-2 border-white bg-black/30 flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:bg-black/50"
                                style={{ top: pos.top, left: pos.left }}
                              >
                                <span className="text-white text-xs">+</span>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                  @{account.username}
                                </div>
                              </div>
                            )
                          })}

                          {/* Tag count indicator */}
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                            {taggedAccounts.length} {taggedAccounts.length === 1 ? "person" : "people"} tagged
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm flex flex-col items-center">
                      <RefreshCw className="h-8 w-8 mb-2" />
                      <span>No image uploaded</span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-3">
                  <div className="flex space-x-4 mb-2">
                    <Heart className="h-6 w-6" />
                    <MessageSquare className="h-6 w-6" />
                    <Share className="h-6 w-6" />
                    <div className="ml-auto">
                      <Bookmark className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="text-sm font-semibold mb-1">0 likes</div>

                  <div className="text-sm">
                    <span className="font-semibold">archsimple</span>{" "}
                    <span>
                      {mediaTitle || "Project Title"}{" "}
                      {projectLocation && projectYear && `| ${projectLocation}, ${projectYear}`}{" "}
                      {architectName &&
                        `| Architect: ${architectName}${architectInstagram ? ` @${architectInstagram}` : ""}`}{" "}
                      {photographerName &&
                        `| Photo: ${photographerName}${photographerInstagram ? ` @${photographerInstagram}` : ""}`}
                    </span>
                  </div>

                  {/* Hashtags */}
                  {instagramHashtags && (
                    <div className="text-sm text-blue-500 mt-1">
                      {instagramHashtags.split(" ").map((tag, i) => (
                        <span key={i} className="mr-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">View all 0 comments</div>
                  <div className="text-[10px] text-gray-400 mt-1">JUST NOW</div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-3 flex justify-between">
            <div className="flex items-center">
              <Checkbox
                id="live-preview"
                checked={livePreview}
                onCheckedChange={handlePreviewToggle}
                className="h-3 w-3 mr-2"
              />
              <Label htmlFor="live-preview" className="text-xs">
                Live Preview
              </Label>
            </div>
            <div>
              <Button variant="outline" size="sm" className="mr-2" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              {activePreviewTab === "instagram" && postToInstagram && (
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600">
                  Share to Instagram
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  // Instagram integration
  const [isConnectedToInstagram, setIsConnectedToInstagram] = useState(false)
  const [instagramUsername, setInstagramUsername] = useState("archsimple")
  const [postToInstagram, setPostToInstagram] = useState(false)
  const [addLocation, setAddLocation] = useState(false)
  const [locationName, setLocationName] = useState("")
  const [instagramHashtags, setInstagramHashtags] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState("")
  const [showInstagramConnectModal, setShowInstagramConnectModal] = useState(false)
  const [googleDriveLink, setGoogleDriveLink] = useState("")

  // Use the ProjectContext
  const { setActiveProject, calculateFinancialSummary } = useProjects()
  const { toast } = useToast()

  // Update the context with the project data
  useEffect(() => {
    // Set the projects in the context
    setProjects(allProjects)

    // If there's a project selected from the URL
    const projectId = searchParams.get("project")
    if (projectId) {
      const project = allProjects.find((p) => p.id === projectId)
      if (project) {
        setSelectedProject(project)
        setActiveProject(project)

        // Calculate financial summary for the selected project
        if (activeTab === "financials") {
          calculateFinancialSummary(projectId)
        }
      }
    }
  }, [searchParams, activeTab, setActiveProject, calculateFinancialSummary])

  const handleTimecardSubmit = (timecard) => {
    console.log("Timecard submitted:", timecard)
    // In a real app, you would send this to your backend
  }

  const handleProjectSelect = useCallback(
    (project: Project) => {
      if (project.stage === "inquiry") {
        setSelectedInquiry(project)
      } else {
        setSelectedProject(project)
        setActiveProject(project)
        setShowReviewPage(true)
      }
    },
    [setActiveProject],
  )

  const handleLogout = useCallback(() => {
    logout()
    router.push("/login")
  }, [logout, router])

  const handleAddProject = () => {
    setShowProjectForm(true)
    setSelectedProject({ ...defaultMediaProject } as Project)
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Simulate unread messages
  useEffect(() => {
    setUnreadMessages(Math.floor(Math.random() * 10))
  }, [])

  const filteredProjects = allProjects.filter(
    (project) =>
      (activeFilters.length === 0 || activeFilters.includes(project.stage)) &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleYearTransition = useCallback(() => {
    const currentYear = new Date().getFullYear()
    // Here you would typically update your state or make an API call to update the projects
    console.log("Year transition handled for:", currentYear)
  }, [])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const lastStoredYear = localStorage.getItem("lastStoredYear")

    if (lastStoredYear && Number.parseInt(lastStoredYear) < currentYear) {
      handleYearTransition()
    }

    localStorage.setItem("lastStoredYear", currentYear.toString())
  }, [handleYearTransition])

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // This is a mock calculation based on the allProjects data
    const calculateUserStats = () => {
      const assignedProjects = allProjects.filter((project) => project.stage === "active").length
      const assignedTasks = allProjects.reduce((acc, project) => acc + (project.tasks?.length || 0), 0)
      const completedTasks = allProjects.reduce(
        (acc, project) => acc + (project.tasks?.filter((task) => task.completed)?.length || 0),
        0,
      )
      const taskCompletionRate = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0

      return {
        assignedProjects,
        assignedTasks,
        completedTasks,
        taskCompletionRate,
      }
    }

    setUserStats(calculateUserStats())
  }, [])

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhoto(event.target.result as string)
          updateProfilePhoto(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTaskComplete = (taskId: string) => {
    // Implement task completion logic here
    console.log("Task completed:", taskId)
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  const renderNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "milestone":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "update":
        return <RefreshCw className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Add this function inside the Dashboard component, before the return statement
  const [currentDateTime, setCurrentDateTime] = useState<string>("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formattedDateTime = now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      setCurrentDateTime(formattedDateTime)
    }

    // Initialize immediately
    updateDateTime()

    // Update every second
    const interval = setInterval(updateDateTime, 1000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  const renderStudioContent = () => {
    // Mock data for DashboardOverview
    const stats = {
      totalRevenue: 500000,
      newClients: 50,
      activeProjects: 10,
    }

    const importantTasks = [
      { id: "task1", name: "Finalize Design", dueDate: "2023-07-15" },
      { id: "task2", name: "Client Meeting", dueDate: "2023-07-20" },
    ]

    const years = [2021, 2022, 2023]

    return (
      <div className="space-y-3 w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold"></h2>
          <div className="text-sm font-medium text-gray-600">{currentDateTime}</div>
        </div>

        <DashboardOverview
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          stats={stats}
          userStats={userStats}
          importantTasks={importantTasks}
          years={years}
          onViewTask={(taskId) => {
            const project = allProjects.find((p) => p.tasks?.some((t) => t.id === taskId))
            if (project) handleProjectSelect(project)
          }}
          onViewAllTasks={() => setShowAllTasksDialog(true)}
        />

        <StudioProjectsSection projects={allProjects} onAddProject={() => setShowProjectForm(true)} />
      </div>
    )
  }

  const renderMediaContent = () => {
    const handleMediaSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setIsUploading(true)

      // Simulate upload process
      setTimeout(() => {
        // In a real app, this would be an API call to save the media
        console.log("Media submitted:", {
          title: mediaTitle,
          type: mediaType,
          description: mediaDescription,
          status: mediaStatus,
          file: mediaFile,
          youtubeUrl: youtubeUrl,
          // Global Project specific data
          globalProjectDetails:
            mediaType === "global"
              ? {
                  location: projectLocation,
                  year: projectYear,
                  architect: {
                    name: architectName,
                    studio: architectStudio,
                    instagram: architectInstagram,
                  },
                  photographer: {
                    name: photographerName,
                    studio: photographerStudio,
                    instagram: photographerInstagram,
                  },
                  taggedAccounts: taggedAccounts,
                  // Instagram specific data if posting to Instagram
                  postToInstagram: postToInstagram,
                  instagramDetails: postToInstagram
                    ? {
                        location: addLocation ? projectLocation : null,
                        hashtags: instagramHashtags,
                        scheduledDate: mediaStatus === "scheduled" ? scheduleDate : null,
                      }
                    : null,
                }
              : null,
        })

        // Show success message
        alert(
          mediaType === "global" && postToInstagram
            ? "Global project uploaded and posted to Instagram successfully!"
            : "Media uploaded successfully!",
        )

        // Reset form
        setMediaTitle("")
        setMediaType("portfolio")
        setMediaDescription("")
        setMediaStatus("draft")
        setMediaFile(null)
        setMediaPreview(null)
        setYoutubeUrl("")
        setPostToInstagram(false)
        setAddLocation(false)
        setLocationName("")
        setInstagramHashtags("")
        setScheduleDate("")
        setProjectLocation("")
        setProjectYear(new Date().getFullYear().toString())
        setArchitectName("")
        setArchitectStudio("")
        setArchitectInstagram("")
        setPhotographerName("")
        setPhotographerStudio("")
        setPhotographerInstagram("")
        setTaggedAccounts([])
        setIsUploading(false)
      }, 1500)
    }

    return (
      <div className="flex flex-col space-y-3 max-h-[calc(100vh-120px)]">
        {/* Header with condensed feng shui inspired balance */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg shadow-sm border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-light mb-1">Media Center</h2>
              <p className="text-xs text-gray-600">Create harmony in your digital presence</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <RefreshCw className="h-4 w-4 text-blue-500" />, label: "Upload" },
                { icon: <Edit className="h-4 w-4 text-green-500" />, label: "Edit" },
                { icon: <Eye className="h-4 w-4 text-purple-500" />, label: "Preview" },
                { icon: <Share className="h-4 w-4 text-amber-500" />, label: "Publish" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mb-1">
                    {item.icon}
                  </div>
                  <p className="text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content with three columns layout */}
        <div className="grid grid-cols-12 gap-3 h-full">
          {/* Left column - Upload Flow (30%) */}
          <div className="col-span-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-3 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-gray-800">Create New Media</h3>
              <div className="flex items-center space-x-1">
                <span
                  className={`h-2 w-2 rounded-full ${isConnectedToInstagram ? "bg-green-500" : "bg-gray-300"}`}
                ></span>
                <span className="text-[10px] font-medium">
                  {isConnectedToInstagram ? "Instagram Connected" : "Not Connected"}
                </span>
              </div>
            </div>

            <form onSubmit={handleMediaSubmit} className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                <Label htmlFor="media-title" className="text-xs font-medium">
                  Title
                </Label>
                <Input
                  id="media-title"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Enter a meaningful title"
                  required
                  className="border-blue-200 focus:border-blue-400 mt-1 h-7 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                  <Label htmlFor="media-type" className="text-xs font-medium">
                    Type
                  </Label>
                  <select
                    id="media-type"
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full rounded-md border border-blue-200 bg-white px-2 py-1 text-xs mt-1 h-7"
                  >
                    <option value="portfolio">Portfolio</option>
                    <option value="plans">Plans for Sale</option>
                    <option value="global">Global Project</option>
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="news">News</option>
                  </select>
                </div>

                <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                  <Label htmlFor="media-status" className="text-xs font-medium">
                    Status
                  </Label>
                  <select
                    id="media-status"
                    value={mediaStatus}
                    onChange={(e) => setMediaStatus(e.target.value)}
                    className="w-full rounded-md border border-blue-200 bg-white px-2 py-1 text-xs mt-1 h-7"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              {mediaStatus === "scheduled" && (
                <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                  <Label htmlFor="schedule-date" className="text-xs font-medium">
                    Schedule Date
                  </Label>
                  <Input
                    id="schedule-date"
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border-blue-200 focus:border-blue-400 mt-1 h-7 text-xs"
                  />
                </div>
              )}

              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                <Label htmlFor="media-description" className="text-xs font-medium">
                  Description
                </Label>
                <textarea
                  id="media-description"
                  value={mediaDescription}
                  onChange={(e) => setMediaDescription(e.target.value)}
                  className="w-full min-h-[60px] rounded-md border border-blue-200 bg-white px-2 py-1 text-xs mt-1"
                  placeholder="Describe your media"
                />
                {mediaType === "instagram" && (
                  <div className="mt-1 text-[10px] text-gray-500 flex items-center">
                    <span className="mr-1">Characters:</span>
                    <span
                      className={`font-medium ${mediaDescription.length > 2200 ? "text-red-500" : "text-gray-700"}`}
                    >
                      {mediaDescription.length}
                    </span>
                    <span className="mx-1">/</span>
                    <span>2200 max for Instagram</span>
                  </div>
                )}
              </div>

              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                <Label htmlFor="media-file" className="text-xs font-medium">
                  Upload File
                </Label>
                <div className="mt-1 border-2 border-dashed border-blue-200 rounded-lg p-2 text-center hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    id="media-file"
                    type="file"
                    onChange={(e) => {
                      setMediaFile(e.target.files?.[0] || null)
                      if (e.target.files?.[0]) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setMediaPreview(event.target.result as string)
                          }
                        }
                        reader.readAsDataURL(e.target.files[0])
                      }
                    }}
                    className="hidden"
                    accept={mediaType === "instagram" ? "image/*,video/*" : undefined}
                  />
                  <label htmlFor="media-file" className="cursor-pointer flex flex-col items-center">
                    {mediaPreview ? (
                      <div className="w-full max-h-24 overflow-hidden rounded-md">
                        {mediaFile?.type?.startsWith("video/") ? (
                          <video src={mediaPreview} className="w-full h-auto" controls />
                        ) : (
                          <img
                            src={"https://picsum.photos/1280/720"}
                            alt="Preview"
                            className="w-full h-auto object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <>
                        <RefreshCw className="h-8 w-8 text-blue-400 mb-1" />
                        <span className="text-xs text-gray-600 font-medium">
                          {mediaType === "instagram" ? "Upload media" : "Upload files"}
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {mediaType === "global" && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded-md border border-pink-200">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-medium text-pink-800">Global Project Details</Label>
                    {!isConnectedToInstagram && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] border-pink-400 text-pink-600 hover:bg-pink-100"
                        onClick={() => setShowInstagramConnectModal(true)}
                      >
                        Connect Instagram
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="project-location" className="text-[10px] font-medium">
                          Project Location
                        </Label>
                        <Input
                          id="project-location"
                          value={projectLocation}
                          onChange={(e) => setProjectLocation(e.target.value)}
                          placeholder="e.g. Tokyo, Japan"
                          className="h-6 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-year" className="text-[10px] font-medium">
                          Project Year
                        </Label>
                        <Input
                          id="project-year"
                          value={projectYear}
                          onChange={(e) => setProjectYear(e.target.value)}
                          placeholder="e.g. 2023"
                          className="h-6 text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="architect-name" className="text-[10px] font-medium">
                        Architect Name
                      </Label>
                      <Input
                        id="architect-name"
                        value={architectName}
                        onChange={(e) => setArchitectName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="h-6 text-xs mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="architect-studio" className="text-[10px] font-medium">
                          Studio (optional)
                        </Label>
                        <Input
                          id="architect-studio"
                          value={architectStudio}
                          onChange={(e) => setArchitectStudio(e.target.value)}
                          placeholder="e.g. Studio Name"
                          className="h-6 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="architect-instagram" className="text-[10px] font-medium">
                          Instagram Handle
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                          <Input
                            id="architect-instagram"
                            value={architectInstagram}
                            onChange={(e) => setArchitectInstagram(e.target.value)}
                            placeholder="username"
                            className="h-6 text-xs pl-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="photographer-name" className="text-[10px] font-medium">
                        Photographer Name
                      </Label>
                      <Input
                        id="photographer-name"
                        value={photographerName}
                        onChange={(e) => setPhotographerName(e.target.value)}
                        placeholder="e.g. John Smith"
                        className="h-6 text-xs mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="photographer-studio" className="text-[10px] font-medium">
                          Studio (optional)
                        </Label>
                        <Input
                          id="photographer-studio"
                          value={photographerStudio}
                          onChange={(e) => setPhotographerStudio(e.target.value)}
                          placeholder="e.g. Studio Name"
                          className="h-6 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="photographer-instagram" className="text-[10px] font-medium">
                          Instagram Handle
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                          <Input
                            id="photographer-instagram"
                            value={photographerInstagram}
                            onChange={(e) => setPhotographerInstagram(e.target.value)}
                            placeholder="username"
                            className="h-6 text-xs pl-6"
                          />
                        </div>
                      </div>
                    </div>

                    {isConnectedToInstagram && (
                      <>
                        <div className="flex items-center">
                          <Checkbox
                            id="post-to-instagram"
                            checked={postToInstagram}
                            onCheckedChange={(checked) => setPostToInstagram(checked === true)}
                            className="h-3 w-3 border-pink-400 text-pink-600"
                          />
                          <Label htmlFor="post-to-instagram" className="ml-2 text-xs font-medium">
                            Post directly to Instagram
                          </Label>
                        </div>

                        {postToInstagram && (
                          <>
                            <div>
                              <Label htmlFor="instagram-search" className="text-[10px] font-medium">
                                Tag Instagram Accounts
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  id="instagram-search"
                                  value={searchInstagramQuery}
                                  onChange={(e) => {
                                    setSearchInstagramQuery(e.target.value)
                                    // In a real app, this would trigger an API call to search Instagram
                                    if (e.target.value.length > 2) {
                                      setSearchResults([
                                        { username: "architecture_daily", fullName: "Architecture Daily" },
                                        { username: "modernist_builds", fullName: "Modernist Builds" },
                                        { username: "design_milk", fullName: "Design Milk" },
                                      ])
                                    } else {
                                      setSearchResults([])
                                    }
                                  }}
                                  placeholder="Search Instagram users"
                                  className="h-6 text-xs pr-6"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-6 w-6 p-0"
                                  onClick={() => setSearchInstagramQuery("")}
                                >
                                  {searchInstagramQuery ? "×" : "🔍"}
                                </Button>
                              </div>

                              {searchResults.length > 0 && (
                                <div className="mt-1 border border-gray-200 rounded-md bg-white max-h-20 overflow-y-auto">
                                  {searchResults.map((user) => (
                                    <div
                                      key={user.username}
                                      className="p-1 text-xs hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                      onClick={() => {
                                        setTaggedAccounts((prev) => [...prev, user])
                                        setSearchResults([])
                                        setSearchInstagramQuery("")
                                      }}
                                    >
                                      <div>
                                        <span className="font-medium">@{user.username}</span>
                                        <span className="text-gray-500 ml-1">({user.fullName})</span>
                                      </div>
                                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                        +
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {taggedAccounts.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {taggedAccounts.map((user) => (
                                    <div
                                      key={user.username}
                                      className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-[10px] flex items-center"
                                    >
                                      @{user.username}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-3 w-3 p-0 ml-1 text-blue-800"
                                        onClick={() =>
                                          setTaggedAccounts((prev) => prev.filter((u) => u.username !== user.username))
                                        }
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="instagram-hashtags" className="text-[10px] font-medium">
                                Hashtags
                              </Label>
                              <div className="mt-1 relative">
                                <Input
                                  id="instagram-hashtags"
                                  placeholder="Add hashtags (e.g. #architecture #design)"
                                  value={instagramHashtags}
                                  onChange={(e) => setInstagramHashtags(e.target.value)}
                                  className="pr-16 h-6 text-xs"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                                  {instagramHashtags.split(" ").filter((tag) => tag.trim().startsWith("#")).length} tags
                                </div>
                              </div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {["#architecture", "#design", "#interiordesign"].map((tag) => (
                                  <Button
                                    key={tag}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-5 text-[10px] py-0 px-1 border-pink-200 text-pink-700 hover:bg-pink-100"
                                    onClick={() => {
                                      if (!instagramHashtags.includes(tag)) {
                                        setInstagramHashtags((prev) => (prev ? `${prev} ${tag}` : tag))
                                      }
                                    }}
                                  >
                                    {tag}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Checkbox
                                id="add-location"
                                checked={addLocation}
                                onCheckedChange={(checked) => setAddLocation(checked === true)}
                                className="h-3 w-3 border-pink-400 text-pink-600"
                              />
                              <Label htmlFor="add-location" className="ml-2 text-xs font-medium">
                                Add location to Instagram post
                              </Label>
                            </div>

                            <div className="mt-2 flex justify-between items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] border-blue-400 text-blue-600"
                                onClick={() => setShowPreview(true)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview Post
                              </Button>

                              {livePreview && (
                                <span className="text-[10px] text-green-600 flex items-center">
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Live Preview
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isUploading}
                className={`w-full h-8 text-xs ${
                  mediaType === "instagram" && postToInstagram
                    ? "bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 hover:from-yellow-500 hover:via-red-600 hover:to-purple-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    {mediaType === "instagram" && postToInstagram ? "Posting..." : "Uploading..."}
                  </span>
                ) : (
                  <>{mediaType === "instagram" && postToInstagram ? "Post to Instagram" : "Upload Media"}</>
                )}
              </Button>
            </form>
          </div>

          {/* Middle column - Recent Activity (41.67%) */}
          <div className="col-span-5 flex flex-col space-y-3">
            {/* Recent Activity Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-100 h-1/2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold">Recent Activity</h3>
                <div className="flex gap-1">
                  <Input placeholder="Search..." className="w-24 h-6 text-xs" />
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[calc(100vh/2-140px)]">
                {recentMediaActivity.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">{item.projectName}</h4>
                        <div className="flex items-center mt-0.5 text-xs text-gray-600">
                          <span className="mr-2">Type: {item.type}</span>
                          <span>Updated: {item.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                            item.status === "Published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YouTube Integration (condensed) */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100 h-1/2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold">YouTube Channel</h3>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <Youtube className="h-3 w-3 mr-1 text-red-600" />
                  Connect
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[calc(100vh/2-140px)]">
                {[1, 2, 3].map((video) => (
                  <div
                    key={video}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={"https://picsum.photos/1280/720"}
                        alt={`Video ${video}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <h4 className="text-xs font-medium truncate">Architecture Studio Tour {video}</h4>
                      <p className="text-[10px] text-gray-600">2 weeks ago • 1.2K views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Analytics (25%) */}
          <div className="col-span-3 bg-gradient-to-br from-gray-50 to-slate-50 p-3 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold mb-2">Media Analytics</h3>
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-xl font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-600">Total Media Items</div>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-xl font-bold text-green-600">18</div>
                <div className="text-xs text-gray-600">Published</div>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-xl font-bold text-amber-600">1.2k</div>
                <div className="text-xs text-gray-600">Total Views</div>
              </div>
            </div>

            {/* Media Type Analytics */}
            <h4 className="font-medium text-xs mb-1.5">Views by Media Type</h4>
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-3">
              <div className="space-y-1.5">
                {[
                  { type: "Portfolio", views: 580, percentage: 48 },
                  { type: "Global Project", views: 320, percentage: 27 },
                  { type: "Plans", views: 180, percentage: 15 },
                  { type: "Article", views: 120, percentage: 10 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium">{item.type}</span>
                    <div className="flex items-center">
                      <span className="mr-2">{item.views}</span>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            i === 0
                              ? "bg-blue-500"
                              : i === 1
                                ? "bg-purple-500"
                                : i === 2
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-1 text-gray-500">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archive Link */}
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-xs">Media Archive</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Manage & delete media files</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() =>
                    toast({
                      title: "Archive Opened",
                      description: "Media archive folder has been opened",
                    })
                  }
                >
                  Open Archive
                </Button>
              </div>
            </div>

            <h4 className="font-medium text-xs mb-1.5">Popular Content</h4>
            <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-480px)]">
              {[
                { name: "Modern Residence", views: 342, type: "Portfolio", hasInstagram: true },
                { name: "Sustainable Design Article", views: 289, type: "Article", hasInstagram: false },
                { name: "Urban Loft Plans", views: 156, type: "Plans", hasInstagram: false },
                { name: "Tokyo Tower Project", views: 132, type: "Global Project", hasInstagram: true },
                { name: "Eco-Friendly Office", views: 98, type: "Article", hasInstagram: false },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-2 rounded-md shadow-sm border border-gray-100 flex justify-between items-center group hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-xs flex items-center">
                      {item.name}
                      {item.hasInstagram && (
                        <span
                          className="ml-1 w-3 h-3 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
                          title="Posted on Instagram"
                        ></span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500">{item.type}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-xs font-medium mr-2">{item.views}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setShowPreview(true)
                        // In a real app, you would load the specific content
                        toast({
                          title: "Content Management",
                          description: `Managing ${item.name}`,
                        })
                      }}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {mediaType === "global" && <PreviewModal />}
      </div>
    )
  }

  const handleSettingsClick = () => {
    router.push("/profile-settings")
  }

  // Add this function to the Dashboard component
  const payPeriods = []

  const checkForMissedPayPeriods = useCallback(() => {
    // This would typically be an API call in a real application
    // For now, we'll simulate finding missed pay periods
    const today = new Date()
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    // Check if there are any missed pay periods
    const missedPayPeriods = payPeriods.filter((period) => {
      const payDate = new Date(period.payDate)
      return payDate < today && period.status === "draft"
    })

    const formatDate = (date: Date) => {
      return date.toLocaleDateString()
    }

    // Generate notifications for missed pay periods
    missedPayPeriods.forEach((period) => {
      const notification = {
        id: `missed-pay-${period.id}`,
        title: "Missed Pay Period Alert",
        message: `The pay period ending on ${formatDate(period.endDate)} was not processed. Immediate attention required.`,
        timestamp: new Date().toISOString(),
        read: false,
        securityLevel: "owner",
        type: "payroll",
        priority: "high",
      }

      // Check if this notification already exists
      if (!notifications.some((n) => n.id === notification.id)) {
        setNotifications((prev) => [notification, ...prev])
      }
    })
  }, [payPeriods, notifications])

  // Add this useEffect to check for missed pay periods when the component mounts
  useEffect(() => {
    checkForMissedPayPeriods()
    // Set up a daily check for missed pay periods
    const intervalId = setInterval(checkForMissedPayPeriods, 86400000) // 24 hours

    return () => clearInterval(intervalId)
  }, [checkForMissedPayPeriods])

  const formatRelativeDate = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Tomorrow"
    } else if (diffDays > 1 && diffDays <= 7) {
      return `In ${diffDays} days`
    } else {
      return date.toLocaleDateString()
    }
  }

  const userObjectives = mockProjects.flatMap((project) =>
    project.objectives.map((objective) => ({
      id: objective.id,
      name: objective.name,
      projectName: project.name,
      location: "Remote",
      dueDate: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 7))).toISOString(),
    })),
  )

  const onViewAllTasks = () => {
    setShowAllTasksDialog(true)
  }

  // Add this useEffect for live preview updates
  useEffect(() => {
    if (!livePreview || !showPreview) return

    // This effect will run whenever any of the preview-related data changes
    // No need to do anything here as the preview will automatically re-render
    // with the updated values
  }, [
    livePreview,
    showPreview,
    mediaTitle,
    mediaDescription,
    mediaPreview,
    projectLocation,
    projectYear,
    architectName,
    architectStudio,
    architectInstagram,
    photographerName,
    photographerStudio,
    photographerInstagram,
    taggedAccounts,
    instagramHashtags,
    addLocation,
    activePreviewTab,
  ])

  return (
    <div className="h-screen bg-background">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadMessages={unreadMessages} />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Task Objectives Icon */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Target className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {userObjectives?.length || 0}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Task Objectives</span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={onViewAllTasks}>
                View All
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {userObjectives?.length > 0 ? (
                <div className="p-2 space-y-2">
                  {userObjectives.slice(0, 5).map((objective) => (
                    <div
                      key={objective.id}
                      className="bg-white rounded-md shadow-sm p-2 border-l-2 border-indigo-500 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-bold text-gray-800">{objective.name}</div>
                          <div className="text-xs text-gray-500">{objective.projectName}</div>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-400">{objective.location}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          Due:{" "}
                          {formatRelativeDate
                            ? formatRelativeDate(objective.dueDate)
                            : new Date(objective.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No task objectives</p>
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <NotificationCenter
                  expanded={false}
                  user={{
                    securityClearance: user?.role === "owner" ? "owner" : user?.role === "admin" ? "admin" : "standard",
                  }}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-7 w-7 cursor-pointer">
              <AvatarImage
                src={user?.profilePhoto || "/placeholder.svg?height=28&width=28"}
                alt={user?.name || "Profile"}
              />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowTimecardDialog(true)} className="text-xs py-1.5">
              <Clock className="mr-2 h-3 w-3" />
              <span>Timecard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick} className="text-xs py-1.5">
              <Settings className="mr-2 h-3 w-3" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-xs py-1.5">
              <LogOut className="mr-2 h-3 w-3" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-3 w-full overflow-y-auto h-full pt-12">
        {activeTab === "studio" && renderStudioContent()}
        {activeTab === "media" && renderMediaContent()}
        {activeTab === "financials" && <FinancialsPage />}
      </div>

      <NewProposalDialog open={showProposalDialog} onOpenChange={setShowProposalDialog} />

      <Dialog open={showReviewPage} onOpenChange={setShowReviewPage}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Client Information */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Name:</span> {selectedProject.clientName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {selectedProject.clientEmail || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {selectedProject.clientPhone || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Company:</span> {selectedProject.clientCompany || "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {selectedProject.clientAddress || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Project Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Project Name:</span> {selectedProject.name}
                        </div>
                        <div>
                          <span className="font-medium">Project Number:</span> {selectedProject.number || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Stage:</span> {selectedProject.stage}
                        </div>
                        <div>
                          <span className="font-medium">Phase:</span> {selectedProject.phase || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {selectedProject.location || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Start Date:</span>{" "}
                          {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {selectedProject.projectAddress || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Description:</span> {selectedProject.description || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Consultation Details - Only for Inquiry stage */}
                  {selectedProject.stage === "inquiry" && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-3">Consultation Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {selectedProject.appointmentDate
                              ? new Date(selectedProject.appointmentDate).toLocaleDateString()
                              : "Not scheduled"}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span>{" "}
                            {selectedProject.appointmentTime || "Not scheduled"}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {selectedProject.appointmentType || "In-person"}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {selectedProject.meetingLocation || "Office"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Notes:</span> {selectedProject.appointmentNotes || "N/A"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Scope of Services - Only for Bidding stage */}
                  {selectedProject.stage === "bidding" && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-3">Scope of Services</h3>
                      {selectedProject.scopeOfServices ? (
                        <div className="text-sm space-y-2">
                          {typeof selectedProject.scopeOfServices === "string" ? (
                            <p>{selectedProject.scopeOfServices}</p>
                          ) : (
                            <ul className="list-disc pl-5">
                              {Array.isArray(selectedProject.scopeOfServices) &&
                                selectedProject.scopeOfServices.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No scope of services defined yet.</div>
                      )}
                    </div>
                  )}

                  {/* Google Drive Link */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Project Files</h3>
                    <div className="space-y-4">
                      {selectedProject.googleDriveLink ? (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <a
                              href={selectedProject.googleDriveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View Project Files on Google Drive
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Input value={selectedProject.googleDriveLink} readOnly className="text-xs" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => {
                                navigator.clipboard.writeText(selectedProject.googleDriveLink || "")
                                toast({
                                  title: "Link copied",
                                  description: "Google Drive link copied to clipboard",
                                })
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-500">No Google Drive link has been added yet.</p>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Enter Google Drive folder URL"
                              className="text-xs"
                              value={googleDriveLink}
                              onChange={(e) => setGoogleDriveLink(e.target.value)}
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                if (googleDriveLink) {
                                  // In a real app, you would update the project in your database
                                  setSelectedProject({
                                    ...selectedProject,
                                    googleDriveLink: googleDriveLink,
                                  })
                                  toast({
                                    title: "Link saved",
                                    description: "Google Drive link has been saved",
                                  })
                                }
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Summary */}
                  {selectedProject.id && selectedProject.stage !== "inquiry" && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
                      <ProjectFinancialSummary projectId={selectedProject.id} minimal />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Review */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Project Review</h3>
                <ProjectReviewPage project={selectedProject} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={selectedInquiry !== null} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inquiry Review</DialogTitle>
          </DialogHeader>
          {selectedInquiry && <InquiryReviewPage inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={selectedProject || undefined}
            onSubmit={(project) => {
              if (selectedProject) {
                const updatedProjects = projects.map((p) => (p.id === project.id ? project : p))
                setProjects(updatedProjects)
                setSelectedProject(null)
              } else {
                const newProject = {
                  ...project,
                  id: `project-${Date.now()}`,
                }
                setProjects([...projects, newProject])
              }
              setShowProjectForm(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="profile-photo">Profile Photo</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.profilePhoto || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="text-[11px]"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Upload a new profile picture. Recommended size: 200x200px.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TasksDialog
        open={showAllTasksDialog}
        onOpenChange={setShowAllTasksDialog}
        tasks={allProjects.flatMap(
          (project) =>
            project.tasks?.map((task) => ({
              ...task,
              projectName: project.name,
              completed: false,
            })) || [],
        )}
        onTaskComplete={handleTaskComplete}
      />

      <Dialog open={showPublicationForm} onOpenChange={setShowPublicationForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Publication</DialogTitle>
          </DialogHeader>
          <PublicationForm
            onSubmit={(data) => {
              console.log("Publication submitted:", data)
              setShowPublicationForm(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPlanForm} onOpenChange={setShowPlanForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Plan for Sale</DialogTitle>
          </DialogHeader>
          <PlanForm
            onSubmit={(data) => {
              console.log("Plan submitted:", data)
              setShowPlanForm(false)
            }}
          />
        </DialogContent>
      </Dialog>
      <TimeCardSubmissionDialog
        open={showTimecardDialog}
        onOpenChange={setShowTimecardDialog}
        onSubmit={handleTimecardSubmit}
        projects={mockProjects}
      />
      <Dialog open={showInstagramConnectModal} onOpenChange={setShowInstagramConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Instagram Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"></div>
                </div>
              </div>
              <h3 className="text-lg font-semibold">Instagram Business Account</h3>
              <p className="text-sm text-center text-gray-500">
                Connect your Instagram Business account to post directly from this platform
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="instagram-email">Email or Username</Label>
                <Input id="instagram-email" placeholder="your.email@example.com" />
              </div>
              <div>
                <Label htmlFor="instagram-password">Password</Label>
                <Input id="instagram-password" type="password" placeholder="••••••••" />
              </div>
              <p className="text-xs text-gray-500">
                We use Meta's official API for secure authentication. Your credentials are never stored.
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowInstagramConnectModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={() => {
                setIsConnectedToInstagram(true)
                setInstagramUsername("archsimple")
                setShowInstagramConnectModal(false)
              }}
            >
              Connect Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Dashboard
