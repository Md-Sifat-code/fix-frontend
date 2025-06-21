"use client"

import React from "react"
import { Project } from "@/types/Project"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProjectDetailsProps {
  project: Project
  onClose: () => void
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Image
            src={project.images[0] || "/placeholder.svg"}
            alt={project.name}
            width={800}
            height={500}
            className="rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Location:</strong> {project.location}, {project.country}</div>
          <div><strong>Continent:</strong> {project.continent}</div>
          <div><strong>Year:</strong> {project.year}</div>
          <div><strong>Climate:</strong> {project.climate}</div>
          <div><strong>Style:</strong> {project.style}</div>
          <div><strong>Building Type:</strong> {project.buildingType}</div>
          <div><strong>Stage:</strong> {project.stage}</div>
          <div><strong>Type:</strong> {project.type}</div>
          <div>
            <strong>Tags:</strong> {project.tags.join(", ")}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
