"use client"

import { useState, useMemo } from "react"
import Layout from "@/components/Layout"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Project {
  id: number
  title: string
  category: string
  image: string
  year: number
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern Residence",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400&text=Modern+Residence",
    year: 2023,
  },
  {
    id: 2,
    title: "City Center Plaza",
    category: "Urban Planning",
    image: "/placeholder.svg?height=300&width=400&text=City+Center+Plaza",
    year: 2022,
  },
  {
    id: 3,
    title: "Eco-Friendly Office Complex",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400&text=Eco-Friendly+Office",
    year: 2021,
  },
  {
    id: 4,
    title: "Historic Building Renovation",
    category: "Restoration",
    image: "/placeholder.svg?height=300&width=400&text=Historic+Renovation",
    year: 2020,
  },
  {
    id: 5,
    title: "Sustainable Community Center",
    category: "Public",
    image: "/placeholder.svg?height=300&width=400&text=Community+Center",
    year: 2022,
  },
  {
    id: 6,
    title: "Luxury Hotel Design",
    category: "Hospitality",
    image: "/placeholder.svg?height=300&width=400&text=Luxury+Hotel",
    year: 2023,
  },
]

export default function PortfolioPage() {
  const [sortBy, setSortBy] = useState<"title" | "year">("title")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((project) => project.category)))
  }, [])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((project) => selectedCategories.length === 0 || selectedCategories.includes(project.category))
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title)
        } else {
          return b.year - a.year
        }
      })
  }, [selectedCategories, sortBy])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-6">Our Portfolio</h1>

          {/* search filter, sort option  */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
         
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                <p className="text-sm text-gray-500 mb-4">Year: {project.year}</p>
                <Button variant="outline" className="w-full">
                  View Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
