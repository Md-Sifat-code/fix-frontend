"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { projectsService } from "@/services/projects-service"
import type { Project } from "@/services/projects-service"
import { InquiryStage } from "@/components/project-stages/InquiryStage"
import { ProposalStage } from "@/components/project-stages/ProposalStage"
import { BiddingStage } from "@/components/project-stages/BiddingStage"
import { ActiveStage } from "@/components/project-stages/ActiveStage"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

// Expanded fallback mock data for development/testing
const MOCK_PROJECT_DATA: Record<string, Project> = {
  "inq-001": {
    id: "inq-001",
    name: "Modern Residential Home",
    description: "A contemporary residential project with sustainable features",
    client_id: "client-001",
    client: { name: "John Smith" },
    stage: "inquiry",
    status: "pending",
    consultation_date: new Date().toISOString(),
    consultation_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    budget: 250000,
    location: "123 Main St, Anytown, USA",
    project_type: "residential",
    square_footage: 2500,
    timeline: "6 months",
    contact_email: "john.smith@example.com",
    contact_phone: "555-123-4567",
    notes: "Client is interested in sustainable design features and modern aesthetics.",
  },
  "prop-001": {
    id: "prop-001",
    name: "Office Building Renovation",
    description: "Renovation of an existing 3-story office building",
    client_id: "client-002",
    client: { name: "Acme Corporation" },
    stage: "proposal",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    budget: 750000,
    location: "456 Business Ave, Metropolis, USA",
    project_type: "commercial",
    square_footage: 12000,
    timeline: "12 months",
    contact_email: "contact@acme.com",
    contact_phone: "555-987-6543",
    notes: "Client wants to modernize the space while maintaining some historical elements.",
  },
  "bid-001": {
    id: "bid-001",
    name: "Public Library Extension",
    description: "Adding a new wing to the city's central library",
    client_id: "client-003",
    client: { name: "Metropolis City Council" },
    stage: "bidding",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    budget: 1200000,
    location: "789 Civic Center, Metropolis, USA",
    project_type: "public",
    square_footage: 8500,
    timeline: "18 months",
    contact_email: "library@metropolis.gov",
    contact_phone: "555-789-0123",
    notes: "Project needs to comply with historical preservation guidelines while adding modern facilities.",
  },
  "act-001": {
    id: "act-001",
    name: "Community Center Construction",
    description: "New construction of a community center with sports facilities",
    client_id: "client-004",
    client: { name: "Riverside Neighborhood Association" },
    stage: "active",
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    budget: 3500000,
    location: "101 Riverside Dr, Metropolis, USA",
    project_type: "community",
    square_footage: 22000,
    timeline: "24 months",
    contact_email: "contact@riverside.org",
    contact_phone: "555-456-7890",
    notes: "Project includes indoor sports facilities, meeting rooms, and a small auditorium.",
  },
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)
  const fallbackToastShown = useRef(false)
  const retryCount = useRef(0)

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return

      const projectId = params.id as string
      setLoading(true)

      try {
        // Try to fetch from Supabase
        const projectData = await projectsService.getById(projectId)

        if (projectData) {
          setProject(projectData)
          setUsedFallback(false)
          setError(null)
          console.log("Successfully loaded project from Supabase:", projectId)
        } else {
          // If projectData is null, check if we have fallback data
          if (MOCK_PROJECT_DATA[projectId]) {
            console.log("Using fallback mock data for project:", projectId)
            setProject(MOCK_PROJECT_DATA[projectId])
            setUsedFallback(true)
            setError(null)
          } else {
            setError("Project not found. Please check the project ID and try again.")
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err)

        // Use fallback data regardless of error type
        if (MOCK_PROJECT_DATA[projectId]) {
          console.log("Using fallback mock data for project after error:", projectId)
          setProject(MOCK_PROJECT_DATA[projectId])
          setUsedFallback(true)
          setError(null)
        } else {
          setError("Failed to load project details. Using demo mode.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  // Show fallback toast only once when fallback is used
  useEffect(() => {
    if (usedFallback && !fallbackToastShown.current && !loading) {
      fallbackToastShown.current = true
      toast({
        title: "Using Demo Data",
        description: "Currently viewing demo data. Some features may be limited.",
        duration: 5000,
      })
    }
  }, [usedFallback, loading, toast])

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      if (!usedFallback) {
        // Only try to update in Supabase if we're not using fallback data
        const updated = await projectsService.update(updatedProject.id, updatedProject)
        if (updated) {
          setProject(updated)
        } else {
          // If Supabase update fails, just update the local state
          setProject(updatedProject)
          setUsedFallback(true)
          toast({
            title: "Offline Mode",
            description: "Changes saved locally only. Database connection unavailable.",
            variant: "warning",
            duration: 5000,
          })
        }
      } else {
        // In fallback mode, just update the local state
        setProject(updatedProject)
      }

      toast({
        title: "Success",
        description: "Project updated successfully",
        duration: 3000,
      })
    } catch (err) {
      console.error("Error updating project:", err)
      // Still update the local state even if the API call fails
      setProject(updatedProject)
      toast({
        title: "Warning",
        description: "Project updated locally only. Database connection failed.",
        variant: "warning",
        duration: 5000,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="mr-2">
            Go to Dashboard
          </Button>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!project) {
    // Use any fallback project if the specific one wasn't found
    const fallbackProject = Object.values(MOCK_PROJECT_DATA)[0]
    if (fallbackProject) {
      setProject(fallbackProject)
      setUsedFallback(true)
      if (!fallbackToastShown.current) {
        fallbackToastShown.current = true
        toast({
          title: "Using Demo Project",
          description: "Showing a sample project as the requested one wasn't found.",
          duration: 5000,
        })
      }
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-amber-600 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the project you're looking for.</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </div>
      )
    }
  }

  // Render the appropriate stage component based on project.stage
  switch (project.stage) {
    case "inquiry":
      return <InquiryStage project={project} onProjectUpdate={handleProjectUpdate} usedFallback={usedFallback} />
    case "proposal":
      return <ProposalStage project={project} onProjectUpdate={handleProjectUpdate} usedFallback={usedFallback} />
    case "bidding":
      return <BiddingStage project={project} onProjectUpdate={handleProjectUpdate} usedFallback={usedFallback} />
    case "active":
      return <ActiveStage project={project} onProjectUpdate={handleProjectUpdate} usedFallback={usedFallback} />
    default:
      return <InquiryStage project={project} onProjectUpdate={handleProjectUpdate} usedFallback={usedFallback} />
  }
}
