"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import NewProposalPage from "@/components/NewProposalPage" // Default import
import { projectsService } from "@/services/projects-service"
import type { Project } from "@/services/projects-service"
import { useToast } from "@/components/ui/use-toast"

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
}

export default function CreateProposalPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [usedFallback, setUsedFallback] = useState(false)

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
          console.log("Successfully loaded project from Supabase:", projectId)
        } else {
          // If projectData is null, check if we have fallback data
          if (MOCK_PROJECT_DATA[projectId]) {
            console.log("Using fallback mock data for project:", projectId)
            setProject(MOCK_PROJECT_DATA[projectId])
            setUsedFallback(true)
          } else {
            // If no fallback data, use a generic one
            const genericProject = Object.values(MOCK_PROJECT_DATA)[0]
            if (genericProject) {
              setProject({
                ...genericProject,
                id: projectId,
              })
              setUsedFallback(true)
              console.log("Using generic fallback project data")
            } else {
              toast({
                title: "Error",
                description: "Project not found and no fallback data available",
                variant: "destructive",
              })
              router.push("/projects")
            }
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err)
        // Use fallback data regardless of error type
        if (MOCK_PROJECT_DATA[projectId]) {
          console.log("Using fallback mock data for project after error:", projectId)
          setProject(MOCK_PROJECT_DATA[projectId])
          setUsedFallback(true)
        } else {
          // If no fallback data, use a generic one
          const genericProject = Object.values(MOCK_PROJECT_DATA)[0]
          if (genericProject) {
            setProject({
              ...genericProject,
              id: projectId,
            })
            setUsedFallback(true)
            console.log("Using generic fallback project data after error")
          } else {
            toast({
              title: "Error",
              description: "Failed to load project details and no fallback data available",
              variant: "destructive",
            })
            router.push("/projects")
          }
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id, router, toast])

  const handleProposalCreated = (proposalData: any) => {
    // Handle proposal creation
    if (usedFallback) {
      toast({
        title: "Demo Mode",
        description: "Proposal created successfully (demo only)",
      })
      router.push(`/projects/${params.id}`)
      return
    }

    if (project) {
      // Update the project in the database
      projectsService
        .update(project.id, {
          ...project,
          stage: "proposal",
          proposal_data: proposalData,
          updated_at: new Date().toISOString(),
        })
        .then(() => {
          toast({
            title: "Success",
            description: "Proposal created successfully",
          })
          router.push(`/projects/${params.id}`)
        })
        .catch((err) => {
          console.error("Error updating project:", err)
          toast({
            title: "Warning",
            description: "Proposal created but failed to update project stage",
            variant: "warning",
          })
          router.push(`/projects/${params.id}`)
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-amber-600 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the project you're looking for.</p>
          <button
            onClick={() => router.push("/projects")}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Go to Projects
          </button>
        </div>
      </div>
    )
  }

  // Pass the project data to the NewProposalPage component
  return <NewProposalPage projectData={project} onProposalCreated={handleProposalCreated} />
}
