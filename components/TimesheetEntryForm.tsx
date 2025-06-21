"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, addDays, startOfWeek } from "date-fns"
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle } from "lucide-react"

interface TimesheetEntryFormProps {
  endDate: Date
  employeeName: string
  onClose: () => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
  onSubmit: () => void
  onPrint: () => void
}

interface Project {
  id: string
  name: string
  objectives: Objective[]
  status: "bidding" | "active" | "completed" | "on-hold"
}

interface Objective {
  id: string
  name: string
  tasks: Task[]
  estimatedHours: number
  spentHours: number
  contractAmount: number
}

interface Task {
  id: string
  name: string
  estimatedHours: number
  spentHours: number
}

interface OverheadEntry {
  category: string
  hours: number[]
  total: number
}

interface HoursDetail {
  id: string
  hours: number
  notes: string
}

interface TimeEntry {
  id: string
  projectId: string
  objectiveId: string
  taskId: string
  hours: number[]
  total: number
}

export function TimesheetEntryForm({
  endDate,
  employeeName,
  onClose,
  onSave,
  onCancel,
  onDelete,
  onSubmit,
  onPrint,
}: TimesheetEntryFormProps) {
  const [overheadExpanded, setOverheadExpanded] = useState(true)
  const [hoursDetailExpanded, setHoursDetailExpanded] = useState(true)

  // Mock data for projects, objectives, and tasks
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "p1",
      name: "Downtown Revitalization",
      status: "active",
      objectives: [
        {
          id: "o1",
          name: "Concept Design",
          estimatedHours: 200,
          spentHours: 120,
          contractAmount: 35000,
          tasks: [
            {
              id: "t1",
              name: "Site Analysis",
              estimatedHours: 80,
              spentHours: 65,
            },
            {
              id: "t2",
              name: "Preliminary Sketches",
              estimatedHours: 120,
              spentHours: 55,
            },
          ],
        },
        {
          id: "o2",
          name: "Design Development",
          estimatedHours: 250,
          spentHours: 50,
          contractAmount: 45000,
          tasks: [
            {
              id: "t3",
              name: "3D Modeling",
              estimatedHours: 150,
              spentHours: 30,
            },
            {
              id: "t4",
              name: "Material Selection",
              estimatedHours: 100,
              spentHours: 20,
            },
          ],
        },
      ],
    },
    {
      id: "p2",
      name: "Waterfront Project",
      status: "active",
      objectives: [
        {
          id: "o3",
          name: "Master Planning",
          estimatedHours: 400,
          spentHours: 320,
          contractAmount: 75000,
          tasks: [
            {
              id: "t5",
              name: "Urban Context Analysis",
              estimatedHours: 200,
              spentHours: 180,
            },
            {
              id: "t6",
              name: "Zoning Review",
              estimatedHours: 200,
              spentHours: 140,
            },
          ],
        },
      ],
    },
  ])

  // State for time entries
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [showNewEntryForm, setShowNewEntryForm] = useState(false)
  const [newEntry, setNewEntry] = useState<{
    projectId: string
    objectiveId: string
    taskId: string
    hours: number[]
  }>({
    projectId: "",
    objectiveId: "",
    taskId: "",
    hours: Array(7).fill(0),
  })

  // Overhead categories and entries
  const overheadCategories = [
    "Bereavement",
    "Client Billing & Invoice Review",
    "Company & Group Meetings",
    "General Office",
    "General research/assembling information (not project-specific)",
    "Holiday",
    "Jury & Witness Duty",
    "PMCS Committee",
    "Professional Training & Development",
    "QA/QC Program development (not project-specific)",
    "Safety Training & Meetings",
    "Sick",
    "Overhead",
  ]

  const [overheadEntries, setOverheadEntries] = useState<OverheadEntry[]>(
    overheadCategories.map((category) => ({
      category,
      hours: Array(7).fill(0),
      total: 0,
    })),
  )

  // Hours detail entries
  const [hoursDetails, setHoursDetails] = useState<HoursDetail[]>([])
  const [showNewHoursDetailForm, setShowNewHoursDetailForm] = useState(false)
  const [newHoursDetail, setNewHoursDetail] = useState<{
    hours: string
    notes: string
  }>({
    hours: "",
    notes: "",
  })

  // Get selected project, objective options
  const selectedProject = projects.find((p) => p.id === newEntry.projectId)
  const objectiveOptions = selectedProject?.objectives || []
  const selectedObjective = objectiveOptions.find((o) => o.id === newEntry.objectiveId)
  const taskOptions = selectedObjective?.tasks || []

  // Get selected task for showing budget information
  const selectedTask = taskOptions.find((t) => t.id === newEntry.taskId)

  // Function to add a new time entry
  const addTimeEntry = () => {
    if (newEntry.projectId && newEntry.objectiveId && newEntry.taskId) {
      const total = newEntry.hours.reduce((sum, h) => sum + h, 0)
      setTimeEntries([
        ...timeEntries,
        {
          id: Date.now().toString(),
          projectId: newEntry.projectId,
          objectiveId: newEntry.objectiveId,
          taskId: newEntry.taskId,
          hours: [...newEntry.hours],
          total,
        },
      ])
      setShowNewEntryForm(false)
      setNewEntry({
        projectId: "",
        objectiveId: "",
        taskId: "",
        hours: Array(7).fill(0),
      })
    }
  }

  // Function to update hours for a specific day
  const updateHours = (dayIndex: number, value: string) => {
    const hours = [...newEntry.hours]
    hours[dayIndex] = Number.parseFloat(value) || 0
    setNewEntry({
      ...newEntry,
      hours,
    })
  }

  // Function to update overhead hours
  const updateOverheadHours = (categoryIndex: number, dayIndex: number, value: string) => {
    const newOverheadEntries = [...overheadEntries]
    const hours = Number.parseFloat(value) || 0
    newOverheadEntries[categoryIndex].hours[dayIndex] = hours

    // Update total
    newOverheadEntries[categoryIndex].total = newOverheadEntries[categoryIndex].hours.reduce((sum, h) => sum + h, 0)

    setOverheadEntries(newOverheadEntries)
  }

  // Function to add a new hours detail entry
  const addHoursDetail = () => {
    if (newHoursDetail.hours && Number.parseFloat(newHoursDetail.hours) > 0) {
      setHoursDetails([
        ...hoursDetails,
        {
          id: Date.now().toString(),
          hours: Number.parseFloat(newHoursDetail.hours),
          notes: newHoursDetail.notes,
        },
      ])
      setShowNewHoursDetailForm(false)
      setNewHoursDetail({
        hours: "",
        notes: "",
      })
    }
  }

  // Function to delete a hours detail entry
  const deleteHoursDetail = (id: string) => {
    setHoursDetails(hoursDetails.filter((detail) => detail.id !== id))
  }

  // Calculate the start date (Monday) from the end date (Sunday)
  const startDate = startOfWeek(endDate, { weekStartsOn: 1 })

  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i)
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "MM/dd"),
    }
  })

  // Calculate totals
  const directDailyTotals = weekDates.map((_, index) => {
    return timeEntries.reduce((sum, entry) => sum + (entry.hours[index] || 0), 0)
  })

  const directTotal = timeEntries.reduce((sum, entry) => sum + entry.total, 0)

  const overheadDailyTotals = weekDates.map((_, index) => {
    return overheadEntries.reduce((sum, entry) => sum + (entry.hours[index] || 0), 0)
  })

  const overheadTotal = overheadEntries.reduce((sum, entry) => sum + entry.total, 0)

  const timesheetDailyTotals = directDailyTotals.map((total, index) => total + overheadDailyTotals[index])
  const timesheetTotal = directTotal + overheadTotal

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-medium text-gray-700">
          Timesheet for {employeeName} for {format(endDate, "MM/dd/yyyy")}
        </h2>
      </div>

      {/* Direct Billable Work */}
      <div className="border rounded-md overflow-hidden mb-4">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[250px]">Project</TableHead>
              <TableHead className="w-[200px]">Phase</TableHead>
              <TableHead className="w-[200px]">Activity</TableHead>
              <TableHead className="w-[120px]">Employee Type</TableHead>
              {weekDates.map((date, index) => (
                <TableHead key={index} className="text-center w-[60px]">
                  <div>{date.dayName}</div>
                  <div>{date.dayNumber}</div>
                </TableHead>
              ))}
              <TableHead className="text-center w-[60px]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry) => {
              const project = projects.find((p) => p.id === entry.projectId)
              const objective = project?.objectives.find((o) => o.id === entry.objectiveId)
              const task = objective?.tasks.find((t) => t.id === entry.taskId)

              // Calculate if this task is approaching or over budget
              const isOverBudget = task && task.spentHours + entry.total > task.estimatedHours
              const isApproachingBudget =
                task && !isOverBudget && task.spentHours + entry.total > task.estimatedHours * 0.8

              return (
                <TableRow key={entry.id}>
                  <TableCell>{project?.name}</TableCell>
                  <TableCell>{objective?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {task?.name}
                      {isOverBudget && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                This task is over budget! ({task.spentHours + entry.total}/{task.estimatedHours} hours)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {isApproachingBudget && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-yellow-500 ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                This task is approaching budget limit ({task.spentHours + entry.total}/
                                {task.estimatedHours} hours)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>Regular</TableCell>
                  {entry.hours.map((hours, idx) => (
                    <TableCell key={idx} className="text-center">
                      {hours > 0 ? hours.toFixed(2) : ""}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-medium">{entry.total.toFixed(2)}</TableCell>
                </TableRow>
              )
            })}

            {showNewEntryForm ? (
              <TableRow>
                <TableCell>
                  <Select
                    value={newEntry.projectId}
                    onValueChange={(value) =>
                      setNewEntry({ ...newEntry, projectId: value, objectiveId: "", taskId: "" })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects
                        .filter((p) => p.status === "active")
                        .map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={newEntry.objectiveId}
                    onValueChange={(value) => setNewEntry({ ...newEntry, objectiveId: value, taskId: "" })}
                    disabled={!newEntry.projectId}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      {objectiveOptions.map((objective) => (
                        <SelectItem key={objective.id} value={objective.id}>
                          {objective.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div>
                    <Select
                      value={newEntry.taskId}
                      onValueChange={(value) => setNewEntry({ ...newEntry, taskId: value })}
                      disabled={!newEntry.objectiveId}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskOptions.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedTask && (
                      <div className="text-xs mt-1">
                        <Badge
                          variant={
                            selectedTask.spentHours >= selectedTask.estimatedHours
                              ? "destructive"
                              : selectedTask.spentHours >= selectedTask.estimatedHours * 0.8
                                ? "warning"
                                : "success"
                          }
                        >
                          {selectedTask.spentHours}/{selectedTask.estimatedHours} hrs used
                        </Badge>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>Regular</TableCell>
                {weekDates.map((_, idx) => (
                  <TableCell key={idx} className="p-1">
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.25"
                      className="h-7 text-xs text-center"
                      value={newEntry.hours[idx] || ""}
                      onChange={(e) => updateHours(idx, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {newEntry.hours.reduce((sum, h) => sum + h, 0).toFixed(2)}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={4 + weekDates.length + 1} className="text-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 flex items-center"
                    onClick={() => setShowNewEntryForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add time entry
                  </Button>
                </TableCell>
              </TableRow>
            )}

            <TableRow className="bg-gray-100 font-medium">
              <TableCell colSpan={4} className="text-right pr-4">
                Direct
              </TableCell>
              {directDailyTotals.map((total, index) => (
                <TableCell key={index} className="text-center">
                  {total > 0 ? total.toFixed(2) : "0.00"}
                </TableCell>
              ))}
              <TableCell className="text-center">{directTotal.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Overhead */}
      <div className="border rounded-md overflow-hidden mb-4">
        <div
          className="flex items-center bg-blue-100 p-2 cursor-pointer"
          onClick={() => setOverheadExpanded(!overheadExpanded)}
        >
          {overheadExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          <span className="font-medium">Overhead</span>
        </div>

        {overheadExpanded && (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead colSpan={1}>Category</TableHead>
                {weekDates.map((date, index) => (
                  <TableHead key={index} className="text-center w-[60px]">
                    <div>{date.dayName}</div>
                  </TableHead>
                ))}
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overheadEntries.map((entry, categoryIndex) => (
                <TableRow key={categoryIndex} className={categoryIndex % 2 === 0 ? "bg-blue-50" : ""}>
                  <TableCell className="text-xs">{entry.category}</TableCell>
                  {entry.hours.map((hours, dayIndex) => (
                    <TableCell key={dayIndex} className="p-1">
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.25"
                        className="h-7 text-xs text-center"
                        value={hours || ""}
                        onChange={(e) => updateOverheadHours(categoryIndex, dayIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">{entry.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-100 font-medium">
                <TableCell className="text-right pr-4">Overhead Total</TableCell>
                {overheadDailyTotals.map((total, index) => (
                  <TableCell key={index} className="text-center">
                    {total.toFixed(2)}
                  </TableCell>
                ))}
                <TableCell className="text-center">{overheadTotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="bg-gray-200 font-medium">
                <TableCell className="text-right pr-4">Timesheet Total</TableCell>
                {timesheetDailyTotals.map((total, index) => (
                  <TableCell key={index} className="text-center">
                    {total.toFixed(2)}
                  </TableCell>
                ))}
                <TableCell className="text-center">{timesheetTotal.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>

      {/* Hours Detail */}
      <div className="border rounded-md overflow-hidden mb-4">
        <div
          className="flex items-center bg-gray-100 p-2 cursor-pointer"
          onClick={() => setHoursDetailExpanded(!hoursDetailExpanded)}
        >
          {hoursDetailExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          <span className="font-medium">Hours Detail</span>
        </div>

        {hoursDetailExpanded && (
          <div className="p-4">
            {hoursDetails.length > 0 ? (
              <div className="space-y-4">
                {hoursDetails.map((detail) => (
                  <div key={detail.id} className="flex items-start border-b pb-3">
                    <div className="w-24 font-medium">{detail.hours.toFixed(2)} hrs</div>
                    <div className="flex-1">{detail.notes}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => deleteHoursDetail(detail.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {showNewHoursDetailForm ? (
              <div className="mt-4 space-y-4">
                <div className="flex gap-4">
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      step="0.25"
                      placeholder="Hours"
                      value={newHoursDetail.hours}
                      onChange={(e) => setNewHoursDetail({ ...newHoursDetail, hours: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add notes here..."
                      value={newHoursDetail.notes}
                      onChange={(e) => setNewHoursDetail({ ...newHoursDetail, notes: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewHoursDetailForm(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={addHoursDetail}>
                    Add Detail
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 flex items-center mt-2"
                onClick={() => setShowNewHoursDetailForm(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add hours detail
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline" size="sm" onClick={onSave}>
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="default" size="sm" onClick={onSubmit}>
          Submit
        </Button>
        <Button variant="outline" size="sm" onClick={onPrint}>
          Print
        </Button>
        <Button variant="outline" size="sm">
          Help
        </Button>
      </div>
    </div>
  )
}
