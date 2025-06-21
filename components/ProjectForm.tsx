"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export interface Project {
  id: string
  name: string
  number?: string
  description?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  location?: string
  stage: "inquiry" | "bidding" | "active" | "completed"
  phase?: string
  startDate?: string
  endDate?: string
  contractAmount?: number
  googleDriveLink?: string
  projectManager?: {
    id: string
    name: string
    email?: string
  } | null
  completedTasks?: number
  totalTasks?: number
  [key: string]: any
}

interface ProjectFormProps {
  project?: Project
  onSubmit: (project: Project) => void
  onCancel: () => void
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const isEditing = !!project?.id

  const [formData, setFormData] = useState<Project>(
    project || {
      id: `proj-${Date.now()}`,
      name: "",
      stage: "inquiry",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Project" : "New Project"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the project details below" : "Enter the details for the new project"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Project Number</Label>
              <Input id="number" name="number" value={formData.number || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" name="clientName" value={formData.clientName || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input id="clientPhone" name="clientPhone" value={formData.clientPhone || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => handleSelectChange("stage", value)}>
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="bidding">Bidding</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase">Phase</Label>
              <Input id="phase" name="phase" value={formData.phase || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Target End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate || ""} onChange={handleChange} />
            </div>
          </div>

          {(formData.stage === "bidding" || formData.stage === "active" || formData.stage === "completed") && (
            <div className="space-y-2">
              <Label htmlFor="contractAmount">Contract Amount ($)</Label>
              <Input
                id="contractAmount"
                name="contractAmount"
                type="number"
                value={formData.contractAmount || ""}
                onChange={handleChange}
              />
            </div>
          )}

          {(formData.stage === "active" || formData.stage === "completed") && (
            <div className="space-y-2">
              <Label htmlFor="googleDriveLink">Google Drive Link</Label>
              <Input
                id="googleDriveLink"
                name="googleDriveLink"
                value={formData.googleDriveLink || ""}
                onChange={handleChange}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Project" : "Create Project"}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
