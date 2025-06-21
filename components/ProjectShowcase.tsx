"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
// Adjust imports to your components location
import {
  Filter,
  X,
  Sun,
  Building,
  Calendar,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

// Example icon for tags (you can swap or import your own)
const TagIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 12v8a2 2 0 0 1-2 2h-8l-8-8 8-8h8a2 2 0 0 1 2 2z"></path></svg>

const climates = ["Cold", "Temperate", "Tropical", "Desert"]

interface Project {
  id: string
  name: string
  description: string
  images: string[]
  location: string
  continent: string
  year: number
  climate: string
  style: string
  buildingType: string
  tags: string[]
  approved: boolean
  title: string
  country: string
  type: string
  stage: "inquiry" | "bidding" | "active" | "completed"
  lat: number
  lng: number
}

interface SidebarFilterProps {
  climates: string[]
  selectedClimate: string | null
  handleClimateChange: (climate: string) => void
  selectedStyles: string[]
  handleStyleChange: (style: string) => void
  allStyles: string[]
  buildingTypes: string[]
  selectedBuildingTypes: string[]
  handleBuildingTypeChange: (type: string) => void
  yearRange: [number, number]
  selectedYearRange: [number, number]
  handleYearRangeChange: (range: [number, number]) => void
  projects: Project[]

  // New filters:
  allContinents: string[]
  selectedContinents: string[]
  handleContinentChange: (continent: string, checked: boolean) => void

  allTags: string[]
  selectedTags: string[]
  handleTagChange: (tag: string, checked: boolean) => void
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  climates,
  selectedClimate,
  handleClimateChange,
  selectedStyles,
  handleStyleChange,
  allStyles,
  buildingTypes,
  selectedBuildingTypes,
  handleBuildingTypeChange,
  yearRange,
  selectedYearRange,
  handleYearRangeChange,
  projects,
  allContinents,
  selectedContinents,
  handleContinentChange,
  allTags,
  selectedTags,
  handleTagChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [styleSearchTerm, setStyleSearchTerm] = useState("")
  const [buildingTypeSearchTerm, setBuildingTypeSearchTerm] = useState("")
  const [tagSearchTerm, setTagSearchTerm] = useState("")
  const [specificYear, setSpecificYear] = useState("")

  // Filter helpers
  const filteredStyles = allStyles.filter((style) =>
    style.toLowerCase().includes(styleSearchTerm.toLowerCase()),
  )
  const filteredBuildingTypes = buildingTypes.filter((type) =>
    type.toLowerCase().includes(buildingTypeSearchTerm.toLowerCase()),
  )
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase()),
  )

  const countProjects = (filterType: string, filterValue: string) => {
    switch (filterType) {
      case "tags":
        return projects.filter((p) => p.tags.includes(filterValue)).length
      case "climate":
        return projects.filter((p) => p.climate === filterValue).length
      case "style":
        return projects.filter((p) => p.style === filterValue).length
      case "buildingType":
        return projects.filter((p) => p.buildingType === filterValue).length
      case "continent":
        return projects.filter((p) => p.continent === filterValue).length
      default:
        return 0
    }
  }

  const clearAllFilters = () => {
    handleClimateChange("")
    handleStyleChange("")
    handleBuildingTypeChange("")
    handleYearRangeChange([yearRange[0], yearRange[1]])
    setSpecificYear("")
    selectedContinents.forEach((c) => handleContinentChange(c, false))
    selectedTags.forEach((t) => handleTagChange(t, false))
  }

  const getClimateInfo = (climate: string) => {
    switch (climate) {
      case "Temperate":
        return "Moderate temperatures with distinct seasons. Suitable for a wide range of architectural styles."
      case "Tropical":
        return "Hot and humid year-round with heavy rainfall. Designs focus on natural ventilation and heat management."
      case "Desert":
        return "Hot and dry with extreme temperature variations. Architecture emphasizes heat protection and water conservation."
      case "Cold":
        return "Long, cold winters and short, cool summers. Buildings prioritize insulation and heat retention."
      default:
        return "Climate information not available."
    }
  }

  return (
    <>
      <Button variant="outline" className="mb-4 flex items-center" onClick={() => setIsOpen(!isOpen)}>
        <Filter className="w-4 h-4 mr-2" />
        Filters
        {isOpen ? <ChevronLeft className="ml-2" /> : <ChevronRight className="ml-2" />}
      </Button>

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r z-40 overflow-hidden"
      >
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>

        <ScrollArea className="h-[calc(100vh-2rem)] p-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          {/* Active Filters */}
          {(selectedClimate ||
            selectedStyles.length > 0 ||
            selectedBuildingTypes.length > 0 ||
            selectedContinents.length > 0 ||
            selectedTags.length > 0) && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {selectedClimate && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => handleClimateChange("")}>
                    {selectedClimate} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {selectedStyles.map((style) => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleStyleChange(style)}
                  >
                    {style} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {selectedBuildingTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleBuildingTypeChange(type)}
                  >
                    {type} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {selectedContinents.map((continent) => (
                  <Badge
                    key={continent}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleContinentChange(continent, false)}
                  >
                    {continent} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTagChange(tag, false)}
                  >
                    {tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Building Type */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Building className="w-4 h-4 mr-2" /> Building Type
              </h3>
              <Input
                type="text"
                placeholder="Search building types..."
                value={buildingTypeSearchTerm}
                onChange={(e) => setBuildingTypeSearchTerm(e.target.value)}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                {filteredBuildingTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedBuildingTypes.includes(type)}
                      onCheckedChange={() => handleBuildingTypeChange(type)}
                    />
                    <label htmlFor={`type-${type}`} className="ml-2 text-xs truncate">
                      {type} ({countProjects("buildingType", type)})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Climate */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Sun className="w-4 h-4 mr-2" /> Climate
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {climates.map((climate) => (
                  <Collapsible key={climate}>
                    <CollapsibleTrigger asChild>
                      <div
                        className={`flex justify-between items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                          selectedClimate === climate
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        } cursor-pointer`}
                        onClick={() => handleClimateChange(climate)}
                      >
                        <span>{climate}</span>
                        <span>({countProjects("climate", climate)})</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 text-sm text-gray-600 p-2 bg-secondary/50 rounded-md">
                      {getClimateInfo(climate)}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>

            {/* Year Completed */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Year Completed
              </h3>
              <div className="space-y-4">
                <Select
                  value={selectedYearRange[0].toString()}
                  onValueChange={(value) => {
                    if (value === "all") {
                      handleYearRangeChange(yearRange)
                    } else {
                      const year = Number.parseInt(value)
                      handleYearRangeChange([year, year])
                    }
                    setSpecificYear(value === "all" ? "" : value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {Array.from({ length: 5 }, (_, i) => yearRange[1] - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Enter specific year"
                    value={specificYear}
                    onChange={(e) => {
                      const year = Number.parseInt(e.target.value)
                      setSpecificYear(e.target.value)
                      if (!isNaN(year) && year >= yearRange[0] && year <= yearRange[1]) {
                        handleYearRangeChange([year, year])
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Architectural Style */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Paintbrush className="w-4 h-4 mr-2" /> Architectural Style
              </h3>
              <Input
                type="text"
                placeholder="Search styles..."
                value={styleSearchTerm}
                onChange={(e) => setStyleSearchTerm(e.target.value)}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                {filteredStyles.map((style) => (
                  <div key={style} className="flex items-center">
                    <Checkbox
                      id={`style-${style}`}
                      checked={selectedStyles.includes(style)}
                      onCheckedChange={() => handleStyleChange(style)}
                    />
                    <label htmlFor={`style-${style}`} className="ml-2 text-xs truncate">
                      {style} ({countProjects("style", style)})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Continent */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Building className="w-4 h-4 mr-2" /> Continent
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                {allContinents.map((continent) => (
                  <div key={continent} className="flex items-center">
                    <Checkbox
                      id={`continent-${continent}`}
                      checked={selectedContinents.includes(continent)}
                      onCheckedChange={(checked) =>
                        handleContinentChange(continent, checked === true)
                      }
                    />
                    <label htmlFor={`continent-${continent}`} className="ml-2 text-xs truncate">
                      {continent} ({countProjects("continent", continent)})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TagIcon /> Tags
              </h3>
              <Input
                type="text"
                placeholder="Search tags..."
                value={tagSearchTerm}
                onChange={(e) => setTagSearchTerm(e.target.value)}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                {filteredTags.map((tag) => (
                  <div key={tag} className="flex items-center">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) =>
                        handleTagChange(tag, checked === true)
                      }
                    />
                    <label htmlFor={`tag-${tag}`} className="ml-2 text-xs truncate">
                      {tag} ({countProjects("tags", tag)})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button variant="ghost" className="mt-6 w-full" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </ScrollArea>
      </motion.div>
    </>
  )
}

// Parent component to handle state and render sidebar + project showcase
const ProjectShowcase = ({ projects }: { projects: Project[] }) => {
  // Extract all unique values
  const allStyles = useMemo(() => Array.from(new Set(projects.map(p => p.style))).sort(), [projects])
  const buildingTypes = useMemo(() => Array.from(new Set(projects.map(p => p.buildingType))).sort(), [projects])
  const allContinents = useMemo(() => Array.from(new Set(projects.map(p => p.continent))).sort(), [projects])
  const allTags = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tags))).sort(), [projects])

  const years = projects.map(p => p.year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)

  // Filter state
  const [selectedClimate, setSelectedClimate] = useState<string | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>([])
  const [selectedContinents, setSelectedContinents] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number]>([minYear, maxYear])

  // Handlers
  const handleClimateChange = (climate: string) => {
    setSelectedClimate((prev) => (prev === climate ? null : climate))
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    )
  }

  const handleBuildingTypeChange = (type: string) => {
    setSelectedBuildingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const handleContinentChange = (continent: string, checked: boolean) => {
    setSelectedContinents((prev) =>
      checked ? [...prev, continent] : prev.filter((c) => c !== continent),
    )
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tag] : prev.filter((t) => t !== tag),
    )
  }

  const handleYearRangeChange = (range: [number, number]) => {
    setSelectedYearRange(range)
  }

  // Filtering projects
  const filteredProjects = projects.filter((project) => {
    const climateMatch = selectedClimate ? project.climate === selectedClimate : true

    const styleMatch = selectedStyles.length > 0 ? selectedStyles.includes(project.style) : true

    const buildingTypeMatch = selectedBuildingTypes.length > 0
      ? selectedBuildingTypes.includes(project.buildingType)
      : true

    const continentMatch = selectedContinents.length > 0
      ? selectedContinents.includes(project.continent)
      : true

    const tagMatch = selectedTags.length > 0
      ? selectedTags.some(tag => project.tags.includes(tag))
      : true

    const yearMatch =
      selectedYearRange.length === 2
        ? project.year >= selectedYearRange[0] && project.year <= selectedYearRange[1]
        : true

    return (
      climateMatch &&
      styleMatch &&
      buildingTypeMatch &&
      continentMatch &&
      tagMatch &&
      yearMatch
    )
  })

  return (
    <div className="flex">
      <SidebarFilter
        climates={climates}
        selectedClimate={selectedClimate}
        handleClimateChange={handleClimateChange}
        selectedStyles={selectedStyles}
        handleStyleChange={handleStyleChange}
        allStyles={allStyles}
        buildingTypes={buildingTypes}
        selectedBuildingTypes={selectedBuildingTypes}
        handleBuildingTypeChange={handleBuildingTypeChange}
        yearRange={[minYear, maxYear]}
        selectedYearRange={selectedYearRange}
        handleYearRangeChange={handleYearRangeChange}
        projects={projects}
        allContinents={allContinents}
        selectedContinents={selectedContinents}
        handleContinentChange={handleContinentChange}
        allTags={allTags}
        selectedTags={selectedTags}
        handleTagChange={handleTagChange}
      />

      <main className="flex-1 p-6 overflow-auto max-h-screen">
        <h1 className="text-2xl font-bold mb-4">Project Showcase</h1>
        {filteredProjects.length === 0 ? (
          <p>No projects found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-sm text-muted">{project.description}</p>
                <p className="text-xs mt-1">
                  <strong>Continent:</strong> {project.continent} | <strong>Country:</strong>{" "}
                  {project.country}
                </p>
                <p className="text-xs">
                  <strong>Year:</strong> {project.year} | <strong>Climate:</strong> {project.climate}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default ProjectShowcase
