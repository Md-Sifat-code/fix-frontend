// Update the projects service to handle network errors better
import { supabase } from "@/lib/supabaseClient"
import { IS_PREVIEW } from "@/lib/environment"

export type Project = {
  id: string
  name: string
  description?: string
  client_id?: string
  client?: { name: string }
  stage: "inquiry" | "proposal" | "bidding" | "active" | "completed"
  status: "pending" | "in_progress" | "completed" | "on_hold"
  consultation_date?: string
  consultation_completed?: boolean
  created_at: string
  updated_at: string
  budget?: number
  location?: string
  project_type?: string
  square_footage?: number
  timeline?: string
  contact_email?: string
  contact_phone?: string
  notes?: string
}

// Mock data for preview environments
const mockProjects: Project[] = [
  {
    id: "inq-001",
    name: "Mountain View Residence",
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
    location: "123 Mountain View Dr, Anytown, USA",
    project_type: "residential",
    square_footage: 2500,
    timeline: "6 months",
    contact_email: "john.smith@example.com",
    contact_phone: "555-123-4567",
    notes: "Client is interested in sustainable design features and modern aesthetics.",
  },
  {
    id: "inq-002",
    name: "Downtown Boutique Hotel",
    description: "Renovation of a historic building into modern office space",
    client_id: "client-002",
    client: { name: "Acme Corporation" },
    stage: "active",
    status: "in_progress",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    budget: 750000,
    location: "456 Main St, Downtown, USA",
    project_type: "commercial",
    square_footage: 5000,
    timeline: "12 months",
    contact_email: "contact@acmecorp.com",
    contact_phone: "555-987-6543",
    notes: "Historic preservation requirements must be considered.",
  },
  {
    id: "inq-003",
    name: "Seaside Hotel",
    description: "New luxury hotel development on beachfront property",
    client_id: "client-003",
    client: { name: "Coastal Developments LLC" },
    stage: "bidding",
    status: "pending",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    budget: 12000000,
    location: "789 Ocean Blvd, Beachtown, USA",
    project_type: "hospitality",
    square_footage: 25000,
    timeline: "24 months",
    contact_email: "info@coastaldevelopments.com",
    contact_phone: "555-456-7890",
    notes: "Environmental impact studies required.",
  },
  {
    id: "inq-004",
    name: "Community Center",
    description: "Multi-purpose community center with sports facilities",
    client_id: "client-004",
    client: { name: "City of Greenfield" },
    stage: "completed",
    status: "completed",
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 5000000,
    location: "101 Park Ave, Greenfield, USA",
    project_type: "public",
    square_footage: 15000,
    timeline: "18 months",
    contact_email: "planning@greenfield.gov",
    contact_phone: "555-789-0123",
    notes: "Project completed under budget and ahead of schedule.",
  },
  {
    id: "inq-005",
    name: "Lakeside Apartments",
    description: "Mixed-use residential development with retail spaces",
    client_id: "client-005",
    client: { name: "Urban Living Developers" },
    stage: "inquiry",
    status: "pending",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    budget: 8500000,
    location: "222 Lake View Rd, Lakeside, USA",
    project_type: "mixed-use",
    square_footage: 35000,
    timeline: "30 months",
    contact_email: "projects@urbanlivingdev.com",
    contact_phone: "555-234-5678",
    notes: "Potential for phased development approach.",
  },
]

class ProjectsService {
  // Helper function to handle fetching and fallback logic
  private async handleFetch<T>(
    fetchFn: () => Promise<{ data: T | null; error: any }>,
    mockData: T | null,
    errorMessage: string,
  ): Promise<T | null> {
    if (IS_PREVIEW) {
      console.log("Preview mode: Using mock data")
      return mockData
    }

    try {
      if (!supabase) {
        console.warn("Supabase client not available, using mock data")
        return mockData
      }

      const { data, error } = await fetchFn()

      if (error) {
        console.error(errorMessage, error)
        return mockData
      }

      return data
    } catch (err) {
      console.error("Network error:", err)
      return mockData
    }
  }

  async getAll(): Promise<Project[]> {
    return (await this.handleFetch(
      () => supabase.from("Projects").select("*, client:client_id(name)").order("created_at", { ascending: false }),
      mockProjects,
      "Supabase error fetching projects:",
    )) as Project[]
  }

  async getById(id: string): Promise<Project | null> {
    return (await this.handleFetch(
      () => supabase.from("Projects").select("*, client:client_id(name)").eq("id", id).single(),
      mockProjects.find((p) => p.id === id) || null,
      "Supabase error fetching project by ID:",
    )) as Project | null
  }

  async create(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project | null> {
    if (IS_PREVIEW) {
      console.log("Preview mode: Simulating project creation")
      const mockId = `mock-${Date.now()}`
      const now = new Date().toISOString()
      return {
        id: mockId,
        ...project,
        created_at: now,
        updated_at: now,
      } as Project
    }

    try {
      const now = new Date().toISOString()
      const newProject = {
        ...project,
        created_at: now,
        updated_at: now,
      }

      const { data, error } = await supabase.from("Projects").insert([newProject]).select().single()

      if (error) {
        console.error("Supabase error creating project:", error)
        return null
      }

      return data as unknown as Project
    } catch (err) {
      console.error("Network error creating project:", err)
      return null
    }
  }

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (IS_PREVIEW) {
      console.log("Preview mode: Simulating project update for ID:", id)
      const mockProject = mockProjects.find((p) => p.id === id) as Project
      return {
        ...mockProject,
        ...updates,
        updated_at: new Date().toISOString(),
      }
    }

    try {
      const { data, error } = await supabase
        .from("Projects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Supabase error updating project:", error)
        return null
      }

      return data as unknown as Project
    } catch (err) {
      console.error("Network error updating project:", err)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    if (IS_PREVIEW) {
      console.log("Preview mode: Simulating project deletion for ID:", id)
      return true
    }

    try {
      const { error } = await supabase.from("Projects").delete().eq("id", id)

      if (error) {
        console.error("Supabase error deleting project:", error)
        return false
      }

      return true
    } catch (err) {
      console.error("Network error deleting project:", err)
      return false
    }
  }
}

export const projectsService = new ProjectsService()
