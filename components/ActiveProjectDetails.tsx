"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Task {
  id: string
  name: string
  assignedTo?: string
}

interface Objective {
  id: string
  name: string
  tasks: Task[]
}

interface TeamMember {
  id: string
  name: string
}

interface ActiveProjectDetailsProps {
  project: {
    name: string
    clientName: string
    projectType: string
    startDate: string
    endDate: string
    description: string
    googleDriveLink?: string
    objectives: Objective[]
    teamMembers: TeamMember[]
  }
}

export function ActiveProjectDetails({ project }: ActiveProjectDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState(project)
  const [googleDriveLink, setGoogleDriveLink] = useState(project.googleDriveLink || "")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value })
  }

  const handleGoogleDriveLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleDriveLink(e.target.value)
  }

  const handleSaveGoogleDriveLink = () => {
    setEditedProject({ ...editedProject, googleDriveLink })
    // Here you would typically send the updated project data to your backend
    console.log("Saving Google Drive link:", googleDriveLink)
  }

  const handleAssignUser = (objectiveId: string, taskId: string, userId: string) => {
    setEditedProject((prev) => ({
      ...prev,
      objectives: prev.objectives.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              tasks: objective.tasks.map((task) => (task.id === taskId ? { ...task, assignedTo: userId } : task)),
            }
          : objective,
      ),
    }))
  }

  const handleSave = () => {
    // Here you would typically send the editedProject data to your backend
    console.log("Saving project:", editedProject)
    setIsEditing(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {project.name}
          <Button onClick={() => setIsEditing(!isEditing)} className="ml-4">
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className="ml-2">
              Save
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="project-info">
            <AccordionTrigger>Project Information</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4 mb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        name="clientName"
                        value={editedProject.clientName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Input
                        id="projectType"
                        name="projectType"
                        value={editedProject.projectType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={editedProject.startDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={editedProject.endDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={editedProject.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="h-32"
                    />
                  </div>
                </div>
              </ScrollArea>
              <div className="mt-4">
                <Label htmlFor="googleDriveLink">Google Drive Link</Label>
                <div className="flex space-x-2">
                  <Input
                    id="googleDriveLink"
                    value={googleDriveLink}
                    onChange={handleGoogleDriveLinkChange}
                    placeholder="Enter Google Drive link"
                  />
                  <Button onClick={handleSaveGoogleDriveLink}>Save Link</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tasks">
            <AccordionTrigger>Tasks</AccordionTrigger>
            <AccordionContent>
              {editedProject.objectives.map((objective) => (
                <div key={objective.id} className="mb-4">
                  <h3 className="font-semibold mb-2">{objective.name}</h3>
                  {objective.tasks.map((task) => (
                    <div key={task.id} className="flex items-center mb-2">
                      <span className="flex-grow">{task.name}</span>
                      <Select
                        value={task.assignedTo || ""}
                        onValueChange={(value) => handleAssignUser(objective.id, task.id, value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {project.teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
