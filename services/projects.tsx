// services/projects.tsx
import type { Project } from "@/components/ProjectForm"

const projects: Project[] = [
  // Add your project data here.  The structure should match the Project interface in components/ProjectForm.tsx
  {
    id: "1",
    name: "Project 1",
    description: "Description of Project 1",
    images: ["/image1.jpg", "/image2.jpg"],
    location: "City, State",
    country: "Country",
    continent: "Continent",
    year: 2023,
    climate: "Temperate",
    style: "Modern",
    buildingType: "Residential",
    architects: "Architect Name",
    firmName: "Firm Name",
    tags: ["Tag1", "Tag2"],
    approved: true,
  },
  // Add more projects as needed
]

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id)
}
