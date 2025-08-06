"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Project } from "@/components/ProjectForm"
import { useRouter } from "next/navigation"

interface StudioProjectsSectionProps {
  projects?: Project[]
  onAddProject?: () => void
}

// Sample data for demonstration
const sampleProjects: Project[] = [
  // INQUIRY PHASE PROJECTS
  {
    id: "inq-001",
    name: "Mountain View Residence",
    number: "INQ-2023-001",
    description: "Modern home with panoramic views",
    clientName: "Sarah & Mark Johnson",
    clientEmail: "johnson@example.com",
    clientPhone: "555-123-4567",
    location: "Aspen, CO",
    stage: "inquiry",
    phase: "Initial Contact",
    startDate: "2023-11-01",
    projectManager: null,
    completedTasks: 1,
    totalTasks: 4,
  },
  {
    id: "inq-002",
    name: "Downtown Boutique Hotel",
    number: "INQ-2023-002",
    description: "Renovation of historic building into boutique hotel",
    clientName: "Urban Hospitality Group",
    clientEmail: "contact@uhg.com",
    clientPhone: "555-987-6543",
    location: "Portland, OR",
    stage: "inquiry",
    phase: "Site Visit Scheduled",
    startDate: "2023-10-25",
    projectManager: null,
    completedTasks: 2,
    totalTasks: 4,
  },
  {
    id: "inq-003",
    name: "Lakeside Restaurant",
    number: "INQ-2023-003",
    description: "New construction waterfront dining establishment",
    clientName: "Fresh Bites, LLC",
    clientEmail: "info@freshbites.com",
    clientPhone: "555-444-3333",
    location: "Lake Tahoe, NV",
    stage: "inquiry",
    phase: "Requirements Gathering",
    startDate: "2023-11-10",
    projectManager: null,
    completedTasks: 3,
    totalTasks: 4,
  },

  // BIDDING PHASE PROJECTS
  {
    id: "bid-001",
    name: "Tech Innovation Campus",
    number: "BID-2023-001",
    description: "Sustainable office complex for tech startups",
    clientName: "FutureTech Ventures",
    clientEmail: "projects@futuretech.com",
    clientPhone: "555-789-0123",
    location: "Austin, TX",
    stage: "bidding",
    phase: "Proposal Development",
    startDate: "2023-09-15",
    endDate: "2024-12-30",
    contractAmount: 4800000,
    projectManager: {
      id: "1",
      name: "Elena Rodriguez",
      email: "elena@archsimple.com",
    },
    completedTasks: 2,
    totalTasks: 6,
  },
  {
    id: "bid-002",
    name: "Oceanfront Condominiums",
    number: "BID-2023-002",
    description: "Luxury condominium complex with 24 units",
    clientName: "Coastal Development Corp",
    clientEmail: "info@coastaldev.com",
    clientPhone: "555-222-1111",
    location: "Miami, FL",
    stage: "bidding",
    phase: "Cost Estimation",
    startDate: "2023-10-01",
    endDate: "2025-03-15",
    contractAmount: 8500000,
    projectManager: null, // No PM assigned yet, can't move to active
    completedTasks: 3,
    totalTasks: 6,
  },
  {
    id: "bid-003",
    name: "University Research Facility",
    number: "BID-2023-003",
    description: "State-of-the-art research building for biological sciences",
    clientName: "State University Foundation",
    clientEmail: "facilities@stateuniv.edu",
    clientPhone: "555-111-9999",
    location: "Boston, MA",
    stage: "bidding",
    phase: "Final Proposal",
    startDate: "2023-08-20",
    endDate: "2025-06-30",
    contractAmount: 12700000,
    projectManager: {
      id: "2",
      name: "David Chen",
      email: "david@archsimple.com",
    },
    completedTasks: 5,
    totalTasks: 6,
  },

  // ACTIVE PHASE PROJECTS
  {
    id: "act-001",
    name: "City Center Mixed-Use Development",
    number: "PRJ-2023-001",
    description: "Mixed-use development with retail, office, and residential units",
    clientName: "Metropolitan Builders",
    clientEmail: "projects@metrobuilders.com",
    clientPhone: "555-333-7777",
    location: "Chicago, IL",
    stage: "active",
    phase: "Schematic Design",
    startDate: "2023-07-10",
    endDate: "2025-09-30",
    contractAmount: 18500000,
    googleDriveLink: "https://drive.google.com/folders/example1",
    projectManager: {
      id: "3",
      name: "Michael Johnson",
      email: "michael@archsimple.com",
    },
    completedTasks: 8,
    totalTasks: 32,
  },
  {
    id: "act-002",
    name: "Green Valley Elementary School",
    number: "PRJ-2023-002",
    description: "New K-5 elementary school with sustainable design principles",
    clientName: "Green Valley School District",
    clientEmail: "facilities@gvsd.org",
    clientPhone: "555-888-2222",
    location: "Denver, CO",
    stage: "active",
    phase: "Design Development",
    startDate: "2023-05-15",
    endDate: "2024-08-30",
    contractAmount: 9600000,
    googleDriveLink: "https://drive.google.com/folders/example2",
    projectManager: {
      id: "4",
      name: "Samantha Lee",
      email: "samantha@archsimple.com",
    },
    completedTasks: 14,
    totalTasks: 28,
  },
  {
    id: "act-003",
    name: "Riverfront Public Library",
    number: "PRJ-2023-003",
    description: "Modern public library with community spaces and technology center",
    clientName: "City of Riverdale",
    clientEmail: "publicworks@riverdale.gov",
    clientPhone: "555-444-6666",
    location: "Riverdale, NY",
    stage: "active",
    phase: "Construction Documents",
    startDate: "2023-03-01",
    endDate: "2024-05-30",
    contractAmount: 7200000,
    googleDriveLink: "https://drive.google.com/folders/example3",
    projectManager: {
      id: "1",
      name: "Elena Rodriguez",
      email: "elena@archsimple.com",
    },
    completedTasks: 22,
    totalTasks: 24,
  },
  {
    id: "act-004",
    name: "Sunset Hills Medical Center",
    number: "PRJ-2022-012",
    description: "Expansion of existing medical facility with new surgical wing",
    clientName: "Sunset Hills Healthcare",
    clientEmail: "facilities@sunsethills.org",
    clientPhone: "555-777-9999",
    location: "Phoenix, AZ",
    stage: "active",
    phase: "Construction Administration",
    startDate: "2022-11-15",
    endDate: "2024-02-28",
    contractAmount: 14300000,
    googleDriveLink: "https://drive.google.com/folders/example4",
    projectManager: {
      id: "2",
      name: "David Chen",
      email: "david@archsimple.com",
    },
    completedTasks: 26,
    totalTasks: 30,
  },

  // COMPLETED PHASE PROJECTS
  {
    id: "cmp-001",
    name: "Harbor View Apartments",
    number: "PRJ-2022-005",
    description: "Luxury apartment complex with waterfront views",
    clientName: "Harbor Development LLC",
    clientEmail: "info@harbordev.com",
    clientPhone: "555-666-7777",
    location: "Seattle, WA",
    stage: "completed",
    phase: "Project Closeout",
    startDate: "2022-04-15",
    endDate: "2023-08-30",
    contractAmount: 11200000,
    googleDriveLink: "https://drive.google.com/folders/example5",
    projectManager: {
      id: "3",
      name: "Michael Johnson",
      email: "michael@archsimple.com",
    },
    completedTasks: 32,
    totalTasks: 32,
  },
  {
    id: "cmp-002",
    name: "Parkside Community Center",
    number: "PRJ-2022-008",
    description: "Multi-purpose community facility with sports amenities",
    clientName: "Parkside Community Foundation",
    clientEmail: "admin@parksidecommunityfoundation.org",
    clientPhone: "555-123-9876",
    location: "Minneapolis, MN",
    stage: "completed",
    phase: "Post-Occupancy",
    startDate: "2022-06-01",
    endDate: "2023-07-15",
    contractAmount: 6800000,
    googleDriveLink: "https://drive.google.com/folders/example6",
    projectManager: {
      id: "4",
      name: "Samantha Lee",
      email: "samantha@archsimple.com",
    },
    completedTasks: 26,
    totalTasks: 26,
  },
  {
    id: "cmp-003",
    name: "Oakwood Corporate Headquarters",
    number: "PRJ-2021-011",
    description: "Corporate campus with main building and ancillary structures",
    clientName: "Oakwood Industries",
    clientEmail: "facilities@oakwood.com",
    clientPhone: "555-987-1234",
    location: "Atlanta, GA",
    stage: "completed",
    phase: "Warranty",
    startDate: "2021-09-15",
    endDate: "2023-03-30",
    contractAmount: 22500000,
    googleDriveLink: "https://drive.google.com/folders/example7",
    projectManager: {
      id: "1",
      name: "Elena Rodriguez",
      email: "elena@archsimple.com",
    },
    completedTasks: 38,
    totalTasks: 38,
  },
]

export function StudioProjectsSection({
  projects: initialProjects = [],
  onAddProject = () => {},
}: StudioProjectsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  // Initialize with sample data on component mount
  useEffect(() => {
    setProjects(sampleProjects)
  }, [])

  const handleFilterChange = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const filteredProjects = projects.filter(
    (project) =>
      (activeFilters.length === 0 || activeFilters.includes(project.stage)) &&
      (project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const projectsByStage = {
    inquiry: projects.filter((p) => p.stage === "inquiry"),
    bidding: projects.filter((p) => p.stage === "bidding"),
    active: projects.filter((p) => p.stage === "active"),
    completed: projects.filter((p) => p.stage === "completed"),
  }

  const updateProjectStage = (projectId: string, newStage: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => (project.id === projectId ? { ...project, stage: newStage } : project)),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Management</h2>
        <div className="text-sm text-gray-500">
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 rounded-full bg-yellow-100 mr-1"></span>
            Inquiry
          </span>
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 rounded-full bg-blue-100 mr-1"></span>
            Bidding
          </span>
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 rounded-full bg-green-100 mr-1"></span>
            Active
          </span>
          <span className="inline-flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-100 mr-1"></span>
            Completed
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex-1 mr-2 relative">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9"
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <div className="flex items-center">{/* Filter button removed */}</div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 items-center justify-around">
              <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
              <TabsTrigger value="inquiry">Inquiry ({projectsByStage.inquiry.length})</TabsTrigger>
              <TabsTrigger value="bidding">Bidding ({projectsByStage.bidding.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({projectsByStage.active.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({projectsByStage.completed.length})</TabsTrigger>
            </div>
            <div className="flex-shrink-0 ml-8">
              <Button
                variant="default"
                size="sm"
                className="h-9 flex items-center gap-1"
                onClick={() => router.push("/new-proposal")}
              >
                <FileText className="h-4 w-4" />
                New Proposal
              </Button>
            </div>
          </div>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <ProjectsTable
            projects={filteredProjects.length > 0 ? filteredProjects : projects}
            updateProjectStage={updateProjectStage}
          />
        </TabsContent>

        <TabsContent value="inquiry" className="mt-4">
          <ProjectsTable projects={projectsByStage.inquiry} updateProjectStage={updateProjectStage} />
        </TabsContent>

        <TabsContent value="bidding" className="mt-4">
          <ProjectsTable projects={projectsByStage.bidding} updateProjectStage={updateProjectStage} />
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <ProjectsTable projects={projectsByStage.active} updateProjectStage={updateProjectStage} />
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <ProjectsTable projects={projectsByStage.completed} updateProjectStage={updateProjectStage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectsTable({
  projects,
  updateProjectStage,
}: {
  projects: Project[]
  updateProjectStage: (projectId: string, newStage: string) => void
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-50 border-b text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Project Workflow:</span> Projects progress through stages from Inquiry to
          Completed. Once a contract is signed, the scope of services is locked and the project moves to Active stage.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Client </TableHead>
            <TableHead>Project Manager</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                No projects found
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.number}</div>
                </TableCell>
                <TableCell>
                  <div>{project.clientName}</div>
                </TableCell>
                <TableCell>
                  {project.projectManager ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {project.projectManager.name.substring(0, 2)}
                      </div>
                      <span className="text-sm">{project.projectManager.name}</span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                      Not Assigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer">
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
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Change Project Stage</p>
                        <p className="text-xs text-gray-500 mb-2">
                          Moving to Active stage locks in the scope of services defined in the contract.
                        </p>
                        {["inquiry", "bidding", "active", "completed"].map((stage) => {
                          const isDisabled =
                            stage === "active" && project.stage === "bidding" && !project.projectManager
                          return (
                            <div key={stage} className="flex items-center">
                              <Button
                                variant={project.stage === stage ? "default" : "outline"}
                                size="sm"
                                className="w-full justify-start text-left capitalize"
                                disabled={isDisabled}
                                onClick={() => {
                                  if (isDisabled) {
                                    alert("Bidding projects must have a project manager assigned before activating")
                                    return
                                  }
                                  updateProjectStage(project.id, stage)
                                }}
                              >
                                {stage}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>{project.phase}</TableCell>
                <TableCell>
                  {project.completedTasks !== undefined && project.totalTasks !== undefined ? (
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {project.completedTasks}/{project.totalTasks}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
