"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Filter, X, Sun, Building, Calendar, Paintbrush, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  handleClimateChange: (climate: string | null) => void
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
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [styleSearchTerm, setStyleSearchTerm] = useState("")
  const [buildingTypeSearchTerm, setBuildingTypeSearchTerm] = useState("")
  const [specificYear, setSpecificYear] = useState("")

  const filteredStyles = allStyles.filter((style) => style.toLowerCase().includes(styleSearchTerm.toLowerCase()))
  const filteredBuildingTypes = buildingTypes.filter((type) =>
    type.toLowerCase().includes(buildingTypeSearchTerm.toLowerCase()),
  )

  const countProjects = (
    filterType: "climate" | "style" | "buildingType",
    filterValue: string
  ) => {
    return projects.filter((project) => project[filterType] === filterValue).length
  }

  const clearAllFilters = () => {
    handleClimateChange(null)
    handleStyleChange("")
    handleBuildingTypeChange("")
    handleYearRangeChange([yearRange[0], yearRange[1]])
    setSpecificYear("")
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

          {(selectedClimate || selectedStyles.length > 0 || selectedBuildingTypes.length > 0) && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {selectedClimate && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => handleClimateChange(null)}>
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
              </div>
            </div>
          )}

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
            <div className="grid grid-cols-2 gap-2">
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
                    setSpecificYear("")
                  } else {
                    const year = Number.parseInt(value)
                    handleYearRangeChange([year, year])
                    setSpecificYear(value)
                  }
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
                  placeholder="Custom year"
                  value={specificYear}
                  onChange={(e) => {
                    const val = e.target.value
                    setSpecificYear(val)
                    if (val.length === 4) {
                      const year = Number.parseInt(val)
                      if (year >= yearRange[0] && year <= yearRange[1]) {
                        handleYearRangeChange([year, year])
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    handleYearRangeChange(yearRange)
                    setSpecificYear("")
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Style */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Paintbrush className="w-4 h-4 mr-2" /> Style
            </h3>
            <Input
              type="text"
              placeholder="Search styles..."
              value={styleSearchTerm}
              onChange={(e) => setStyleSearchTerm(e.target.value)}
              className="mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
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

          <Button variant="outline" className="mt-6 w-full" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </ScrollArea>
      </motion.div>
    </>
  )
}
