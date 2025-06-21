"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2, Save } from "lucide-react"
import type { ProjectInfo, Objective, Task, FinancialSettings } from "@/types"

interface ActiveProjectReviewProps {
  project: {
    projectInfo: ProjectInfo
    objectives: Objective[]
    financialSettings: FinancialSettings
    contractSignDate: Date
    targetCompletionDate: Date | null
  }
}

const formatCurrency = (amount: number | string | undefined) => {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (numAmount === undefined || isNaN(numAmount)) return "$0.00"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numAmount)
}

export function ActiveProjectReview({ project: initialProject }: ActiveProjectReviewProps) {
  const [editMode, setEditMode] = useState(false)
  const [project, setProject] = useState(initialProject)

  const handleEdit = () => {
    setEditMode(!editMode)
  }

  const handleSave = () => {
    setEditMode(false)
    // Here you would typically save the changes to your backend
  }

  const handleProjectInfoChange = (field: keyof ProjectInfo, value: string) => {
    setProject((prev) => ({
      ...prev,
      projectInfo: {
        ...prev.projectInfo,
        [field]: value,
      },
    }))
  }

  const calculateTotalHours = (objective: Objective) => {
    return objective.tasks.reduce((sum, task) => {
      return sum + Object.values(task.staffHours).reduce((taskSum, hours) => taskSum + (hours || 0), 0)
    }, 0)
  }

  const calculateTaskCost = (task: Task) => {
    let total = 0
    for (const role in task.staffHours) {
      if (role !== "consultant") {
        const hours = task.staffHours[role as keyof Omit<Task["staffHours"], "consultant">] || 0
        const rate =
          project.financialSettings.staffRoles[role as keyof Omit<FinancialSettings["staffRoles"], "consultant">]
            ?.rate || 0
        total += hours * rate
      } else {
        total += task.staffHours.consultant || 0
      }
    }
    return total
  }

  const calculateObjectiveCost = (objective: Objective) => {
    return objective.tasks.reduce((sum, task) => sum + calculateTaskCost(task), 0)
  }

  const calculateTotalCost = () => {
    return project.objectives.reduce((sum, objective) => sum + calculateObjectiveCost(objective), 0)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{project.projectInfo.projectName}</CardTitle>
        <Button onClick={editMode ? handleSave : handleEdit}>
          {editMode ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" /> Edit Project
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="project-info">
            <AccordionTrigger>Project Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={project.projectInfo.clientName}
                    onChange={(e) => handleProjectInfoChange("clientName", e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    disabled={!editMode}
                    value={project.projectInfo.projectType}
                    onValueChange={(value) => handleProjectInfoChange("projectType", value)}
                  >
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectAddress">Project Address</Label>
                  <Input
                    id="projectAddress"
                    value={project.projectInfo.projectAddress}
                    onChange={(e) => handleProjectInfoChange("projectAddress", e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="projectSize">Project Size (sq ft)</Label>
                  <Input
                    id="projectSize"
                    type="number"
                    value={project.projectInfo.projectSize.toString()}
                    onChange={(e) => handleProjectInfoChange("projectSize", e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                  <Input
                    id="estimatedBudget"
                    value={project.projectInfo.estimatedBudget}
                    onChange={(e) => handleProjectInfoChange("estimatedBudget", e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="scope">
            <AccordionTrigger>Scope of Services</AccordionTrigger>
            <AccordionContent>
              {project.objectives.map((objective) => (
                <Accordion key={objective.id} type="single" collapsible className="w-full border rounded-lg mb-4">
                  <AccordionItem value="objective">
                    <AccordionTrigger className="px-4">{objective.name}</AccordionTrigger>
                    <AccordionContent className="px-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Duration (days)</TableHead>
                            <TableHead>Staff Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {objective.tasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell>{task.name}</TableCell>
                              <TableCell>{format(new Date(task.start), "MM/dd/yyyy")}</TableCell>
                              <TableCell>{task.duration}</TableCell>
                              <TableCell>
                                {Object.values(task.staffHours).reduce((sum, hours) => sum + (hours || 0), 0)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="financials">
            <AccordionTrigger>Financials</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Objective</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.objectives.map((objective) => (
                    <TableRow key={objective.id}>
                      <TableCell>{objective.name}</TableCell>
                      <TableCell>{calculateTotalHours(objective)}</TableCell>
                      <TableCell>{formatCurrency(calculateObjectiveCost(objective))}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell>{project.objectives.reduce((sum, obj) => sum + calculateTotalHours(obj), 0)}</TableCell>
                    <TableCell>{formatCurrency(calculateTotalCost())}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="additional-notes">
            <AccordionTrigger>Additional Notes</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={project.projectInfo.additionalNotes}
                onChange={(e) => handleProjectInfoChange("additionalNotes", e.target.value)}
                disabled={!editMode}
                rows={4}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
