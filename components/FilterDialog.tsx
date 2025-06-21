"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"

interface FilterDialogProps {
  climates: string[]
  selectedClimate: string | null
  handleClimateChange: (climate: string) => void
  selectedStyles: string[]
  handleStyleChange: (style: string) => void
  allStyles: string[]
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  climates,
  selectedClimate,
  handleClimateChange,
  selectedStyles,
  handleStyleChange,
  allStyles,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filter Projects</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="climate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="climate">Climate</TabsTrigger>
            <TabsTrigger value="style">Architectural Style</TabsTrigger>
          </TabsList>
          <TabsContent value="climate">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Climate plays a crucial role in architectural design, influencing materials, energy efficiency, and
                overall structure.
              </p>
              <div className="flex flex-wrap gap-2">
                {climates.map((climate) => (
                  <Button
                    key={climate}
                    variant={selectedClimate === climate ? "default" : "outline"}
                    onClick={() => handleClimateChange(climate)}
                    size="sm"
                  >
                    {climate}
                  </Button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <strong>Temperate:</strong> Moderate temperatures, distinct seasons.
                </p>
                <p>
                  <strong>Tropical:</strong> Hot and humid year-round, heavy rainfall.
                </p>
                <p>
                  <strong>Desert:</strong> Hot and dry, extreme temperature variations.
                </p>
                <p>
                  <strong>Cold:</strong> Long, cold winters and short, cool summers.
                </p>
                <p>
                  <strong>Mediterranean:</strong> Warm, dry summers and mild, wet winters.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="style">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Architectural styles reflect historical, cultural, and technological influences on building design.
              </p>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {allStyles.map((style) => (
                    <div key={style} className="flex items-center">
                      <Checkbox
                        id={style}
                        checked={selectedStyles.includes(style)}
                        onCheckedChange={() => handleStyleChange(style)}
                      />
                      <label htmlFor={style} className="ml-2 text-sm">
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <strong>Modern:</strong> Emphasis on function, simple forms, and minimal ornamentation.
                </p>
                <p>
                  <strong>Contemporary:</strong> Current design trends, often blending styles and using sustainable
                  materials.
                </p>
                <p>
                  <strong>Gothic Revival:</strong> Inspired by medieval architecture, featuring pointed arches and
                  ornate details.
                </p>
                <p>
                  <strong>Art Deco:</strong> Characterized by geometric shapes, bold colors, and lavish ornamentation.
                </p>
                <p>
                  <strong>Minimalist:</strong> Focus on simplicity, clean lines, and a "less is more" approach.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
