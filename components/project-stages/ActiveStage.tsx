"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Project } from "@/services/projects-service"
import { formatDate } from "@/lib/utils"

interface ActiveStageProps {
  project: Project
  onProjectUpdate: (updatedProject: Project) => void
  usedFallback?: boolean
}

export function ActiveStage({ project, onProjectUpdate, usedFallback = false }: ActiveStageProps) {
  const { toast } = useToast()

  // Mock objectives for demo purposes
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      name: "Assemble Information",
      complete: false,
      totalHours: 40,
      remainingHours: 16,
      tasks: [
        {
          id: 1,
          name: "Visit project site to field verify existing conditions",
          complete: true,
          assignedTo: ["Jane Doe"],
          hours: 8,
          status: "Done",
          internalDeadline: "Apr 10",
          externalDeadline: "",
          timeline: "Apr 5 - Apr 10",
        },
        {
          id: 2,
          name: "Internal project meetings and coordination",
          complete: true,
          assignedTo: ["Jane Doe", "Mike Smith"],
          hours: 8,
          status: "Done",
          internalDeadline: "Apr 12",
          externalDeadline: "",
          timeline: "Apr 8 - Apr 12",
        },
        {
          id: 3,
          name: "Obtain as-built drawings from SCE if available",
          complete: true,
          assignedTo: ["Amy Lee"],
          hours: 8,
          status: "Done",
          internalDeadline: "Apr 14",
          externalDeadline: "",
          timeline: "Apr 10 - Apr 14",
        },
      ],
    },
    {
      id: 2,
      name: "100% Schematic Design",
      complete: false,
      totalHours: 60,
      remainingHours: 20,
      tasks: [
        {
          id: 4,
          name: "Attend conference call meetings with SCE CSE to discuss project scope",
          complete: true,
          assignedTo: ["Jane Doe"],
          hours: 10,
          status: "Done",
          internalDeadline: "Apr 20",
          externalDeadline: "",
          timeline: "Apr 15 - Apr 20",
        },
        {
          id: 5,
          name: "100% Schematic Design Plans",
          complete: true,
          assignedTo: ["Mike Smith", "Amy Lee"],
          hours: 30,
          status: "Done",
          internalDeadline: "Apr 25",
          externalDeadline: "",
          timeline: "Apr 18 - Apr 25",
        },
        {
          id: 6,
          name: "Review 100% SDs as part of QA/QC Process",
          complete: false,
          assignedTo: ["Jane Doe"],
          hours: 20,
          status: "In Progress",
          internalDeadline: "May 2",
          externalDeadline: "",
          timeline: "Apr 26 - May 2",
        },
      ],
    },
    {
      id: 3,
      name: "100% Construction Documents",
      complete: false,
      totalHours: 80,
      remainingHours: 80,
      tasks: [
        {
          id: 7,
          name: "Address Client Comments from 100% SD review meeting",
          complete: false,
          assignedTo: ["Jane Doe"],
          hours: 20,
          status: "Not Started",
          internalDeadline: "May 10",
          externalDeadline: "",
          timeline: "May 3 - May 10",
        },
        {
          id: 8,
          name: "100% Construction Documents",
          complete: false,
          assignedTo: ["Mike Smith"],
          hours: 40,
          status: "Not Started",
          internalDeadline: "May 20",
          externalDeadline: "",
          timeline: "May 11 - May 20",
        },
        {
          id: 9,
          name: "Review 100% CDs as part of QA/QC process",
          complete: false,
          assignedTo: ["Amy Lee", "Jane Doe"],
          hours: 20,
          status: "Not Started",
          internalDeadline: "May 28",
          externalDeadline: "",
          timeline: "May 21 - May 28",
        },
      ],
    },
    {
      id: 4,
      name: "Plan Check Review",
      complete: false,
      totalHours: 40,
      remainingHours: 40,
      tasks: [
        {
          id: 10,
          name: "Address Client Comments from 100% CD review meeting",
          complete: false,
          assignedTo: ["Jane Doe"],
          hours: 10,
          status: "Not Started",
          internalDeadline: "Jun 5",
          externalDeadline: "",
          timeline: "Jun 1 - Jun 5",
        },
        {
          id: 11,
          name: "Prepare plan check submittal documents",
          complete: false,
          assignedTo: ["Mike Smith"],
          hours: 20,
          status: "Not Started",
          internalDeadline: "Jun 12",
          externalDeadline: "",
          timeline: "Jun 6 - Jun 12",
        },
        {
          id: 12,
          name: "Obtain final approval",
          complete: false,
          assignedTo: ["Amy Lee"],
          hours: 10,
          status: "Not Started",
          internalDeadline: "Jun 20",
          externalDeadline: "",
          timeline: "Jun 13 - Jun 20",
        },
      ],
    },
  ])

  const toggleTaskComplete = (objectiveId: number, taskId: number) => {
    const newObjectives = objectives.map((objective) => {
      if (objective.id === objectiveId) {
        const newTasks = objective.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, complete: !task.complete }
          }
          return task
        })

        // Check if all tasks are complete
        const allTasksComplete = newTasks.every((task) => task.complete)

        return {
          ...objective,
          tasks: newTasks,
          complete: allTasksComplete,
        }
      }
      return objective
    })

    setObjectives(newObjectives)

    if (!usedFallback) {
      // In a real implementation, we would update the project in the database
      // onProjectUpdate({ ...project, objectives: newObjectives })
    }
  }

  const updateTaskStatus = (objectiveId: number, taskId: number, newStatus: string) => {
    const newObjectives = objectives.map((objective) => {
      if (objective.id === objectiveId) {
        const newTasks = objective.tasks.map((task) => {
          if (task.id === taskId) {
            // If status is changed to "Done", also mark as complete
            const complete = newStatus === "Done"
            return { ...task, status: newStatus, complete }
          }
          return task
        })

        // Check if all tasks are complete
        const allTasksComplete = newTasks.every((task) => task.complete)

        return {
          ...objective,
          tasks: newTasks,
          complete: allTasksComplete,
        }
      }
      return objective
    })

    setObjectives(newObjectives)

    // Close all dropdown menus
    document.querySelectorAll(".absolute.z-10").forEach((el) => {
      el.classList.add("hidden")
    })

    if (!usedFallback) {
      // In a real implementation, we would update the project in the database
      // onProjectUpdate({ ...project, objectives: newObjectives });
    }
  }

  const getProjectProgress = () => {
    const totalTasks = objectives.reduce((acc, obj) => acc + obj.tasks.length, 0)
    const completedTasks = objectives.reduce((acc, obj) => acc + obj.tasks.filter((task) => task.complete).length, 0)

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className="text-green-600 bg-green-50 hover:bg-green-100">
              Active Project
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Project Documents
          </Button>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Time Tracking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Project Tasks </CardTitle>
              <CardDescription>Overall completion: {getProjectProgress()}%</CardDescription>
            </CardHeader>
            <div className="w-full bg-gray-200 h-2">
              <div className="h-2 bg-green-600" style={{ width: `${getProjectProgress()}%` }}></div>
            </div>
            <CardContent className=" pt-6   p-0 overflow-y-scroll h-[500px]">
              <div className="space-y-8">
                {objectives.map((objective) => (
                  <div key={objective.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                      <div className="flex items-center">
                        <button
                          className="mr-2 w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center"
                          aria-label={objective.complete ? "Collapse section" : "Expand section"}
                        >
                          <span className="text-xs">▼</span>
                        </button>
                        <h3 className="font-medium text-gray-800">{objective.name}</h3>
                        <div className="ml-3 text-sm text-gray-500">
                          <span className="font-medium">
                            {objective.totalHours - objective.remainingHours}/{objective.totalHours}
                          </span>{" "}
                          hours
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                          <div className="w-48 h-6 bg-gray-200 rounded-full relative flex items-center">
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">
                              {objective.tasks[0]?.timeline?.split(" - ")[0]} -{" "}
                              {objective.tasks[objective.tasks.length - 1]?.timeline?.split(" - ")[1] || "Ongoing"}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={objective.complete ? "outline" : "secondary"}
                          className={objective.complete ? "bg-green-50 text-green-700" : ""}
                        >
                          {objective.complete ? "Complete" : "In Progress"}
                        </Badge>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b text-xs text-gray-500">
                            <th className="w-8 px-4 py-2 text-center">
                              <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <th className="px-4 py-2 text-left font-medium">Item</th>
                            <th className="px-4 py-2 text-left font-medium">People</th>
                            <th className="px-4 py-2 text-left font-medium">Status</th>
                            <th className="px-4 py-2 text-left font-medium">Internal Deadline</th>
                            <th className="px-4 py-2 text-left font-medium">External Deadline</th>
                            <th className="px-4 py-2 text-left font-medium">Budgeted Time</th>
                            <th className="px-4 py-2 text-left font-medium">Actual Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {objective.tasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-center">
                                <div
                                  className={`inline-flex h-5 w-5 items-center justify-center rounded border ${
                                    task.complete ? "bg-green-100 border-green-500 text-green-600" : "border-gray-300"
                                  } cursor-pointer`}
                                  onClick={() => toggleTaskComplete(objective.id, task.id)}
                                >
                                  {task.complete && <CheckCircle className="h-3 w-3" />}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={task.status === "Done" ? "line-through text-gray-500" : "text-gray-700"}
                                >
                                  {task.name}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="relative inline-block">
                                  <button
                                    className="px-2 py-1 rounded text-xs border border-gray-300 bg-white flex items-center justify-center min-w-[90px]"
                                    onClick={(e) => {
                                      // Close all other dropdowns first
                                      document.querySelectorAll(".team-dropdown").forEach((el) => {
                                        el.classList.add("hidden")
                                      })
                                      // Toggle this dropdown
                                      e.currentTarget.nextElementSibling?.classList.toggle("hidden")
                                    }}
                                  >
                                    <div className="flex -space-x-2 mr-2">
                                      {task.assignedTo.length > 0 ? (
                                        task.assignedTo.slice(0, 3).map((person, idx) => (
                                          <div
                                            key={idx}
                                            className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600"
                                            title={person}
                                          >
                                            {person
                                              .split(" ")
                                              .map((name) => name[0])
                                              .join("")}
                                          </div>
                                        ))
                                      ) : (
                                        <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-400">
                                          +
                                        </div>
                                      )}
                                    </div>
                                    {task.assignedTo.length > 0 ? (
                                      task.assignedTo.length > 3 ? (
                                        <span className="text-gray-600">+{task.assignedTo.length - 3} more</span>
                                      ) : (
                                        <span className="text-gray-600">{task.assignedTo.length} assigned</span>
                                      )
                                    ) : (
                                      <span className="text-gray-400">Assign</span>
                                    )}
                                  </button>
                                  <div className="absolute z-10 mt-1 hidden team-dropdown bg-white border rounded-md shadow-lg w-64">
                                    <div className="p-2 border-b">
                                      <input
                                        type="text"
                                        placeholder="Search team members..."
                                        className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                          const searchTerm = e.target.value.toLowerCase()
                                          const teamMembers =
                                            e.currentTarget.parentElement?.parentElement?.querySelectorAll(
                                              ".team-member",
                                            )
                                          teamMembers?.forEach((el) => {
                                            const memberName = el.getAttribute("data-name")?.toLowerCase() || ""
                                            if (memberName.includes(searchTerm)) {
                                              el.classList.remove("hidden")
                                            } else {
                                              el.classList.add("hidden")
                                            }
                                          })
                                        }}
                                      />
                                    </div>
                                    <div className="py-1 max-h-48 overflow-y-auto">
                                      {[
                                        { id: 1, name: "Jane Doe", role: "Project Lead" },
                                        { id: 2, name: "Mike Smith", role: "Designer" },
                                        { id: 3, name: "Amy Lee", role: "Project Manager" },
                                        { id: 4, name: "John Wilson", role: "Architect" },
                                        { id: 5, name: "Sarah Chen", role: "Engineer" },
                                        { id: 6, name: "David Kim", role: "Consultant" },
                                        { id: 7, name: "Lisa Johnson", role: "Interior Designer" },
                                        { id: 8, name: "Robert Garcia", role: "Construction Manager" },
                                      ].map((member) => (
                                        <div
                                          key={member.id}
                                          className="team-member px-3 py-2 text-xs hover:bg-gray-100 flex items-center cursor-pointer"
                                          data-name={member.name}
                                          onClick={() => {
                                            const newObjectives = [...objectives]
                                            const objectiveIndex = newObjectives.findIndex((o) => o.id === objective.id)
                                            const taskIndex = newObjectives[objectiveIndex].tasks.findIndex(
                                              (t) => t.id === task.id,
                                            )

                                            if (objectiveIndex !== -1 && taskIndex !== -1) {
                                              const currentTask = newObjectives[objectiveIndex].tasks[taskIndex]

                                              // Check if member is already assigned
                                              const memberIndex = currentTask.assignedTo.findIndex(
                                                (name) => name === member.name,
                                              )

                                              if (memberIndex === -1) {
                                                // Add member if not already assigned
                                                newObjectives[objectiveIndex].tasks[taskIndex].assignedTo = [
                                                  ...currentTask.assignedTo,
                                                  member.name,
                                                ]
                                              } else {
                                                // Remove member if already assigned
                                                const newAssignedTo = [...currentTask.assignedTo]
                                                newAssignedTo.splice(memberIndex, 1)
                                                newObjectives[objectiveIndex].tasks[taskIndex].assignedTo =
                                                  newAssignedTo
                                              }

                                              setObjectives(newObjectives)
                                            }
                                          }}
                                        >
                                          <div className="flex items-center flex-1">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 mr-2">
                                              {member.name
                                                .split(" ")
                                                .map((name) => name[0])
                                                .join("")}
                                            </div>
                                            <div>
                                              <div className="font-medium">{member.name}</div>
                                              <div className="text-gray-500 text-xs">{member.role}</div>
                                            </div>
                                          </div>
                                          <div className="w-5 flex justify-center">
                                            {task.assignedTo.includes(member.name) && (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-green-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="p-2 border-t flex justify-between items-center">
                                      <span className="text-xs text-gray-500">
                                        {task.assignedTo.length} team member{task.assignedTo.length !== 1 ? "s" : ""}{" "}
                                        assigned
                                      </span>
                                      <button
                                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          e.currentTarget.closest(".team-dropdown")?.classList.add("hidden")
                                        }}
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="relative inline-block">
                                  <button
                                    className={`px-2 py-1 rounded text-xs text-white flex items-center justify-center min-w-[90px] ${
                                      task.status === "Done"
                                        ? "bg-green-500"
                                        : task.status === "In Progress"
                                          ? "bg-orange-500"
                                          : task.status === "Waiting"
                                            ? "bg-purple-500"
                                            : task.status === "Not Started"
                                              ? "bg-gray-400"
                                              : "bg-gray-400"
                                    }`}
                                    onClick={(e) => {
                                      e.currentTarget.nextElementSibling?.classList.toggle("hidden")
                                    }}
                                  >
                                    {task.status}
                                  </button>
                                  <div className="absolute z-10 mt-1 hidden bg-white border rounded-md shadow-lg w-32">
                                    <div className="py-1">
                                      <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center"
                                        onClick={() => updateTaskStatus(objective.id, task.id, "Done")}
                                      >
                                        <div className="w-4 h-4 rounded-sm bg-green-500 mr-2"></div>
                                        Done
                                      </button>
                                      <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center"
                                        onClick={() => updateTaskStatus(objective.id, task.id, "In Progress")}
                                      >
                                        <div className="w-4 h-4 rounded-sm bg-orange-500 mr-2"></div>
                                        In Progress
                                      </button>
                                      <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center"
                                        onClick={() => updateTaskStatus(objective.id, task.id, "Waiting")}
                                      >
                                        <div className="w-4 h-4 rounded-sm bg-purple-500 mr-2"></div>
                                        Waiting
                                      </button>
                                      <button
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center"
                                        onClick={() => updateTaskStatus(objective.id, task.id, "Not Started")}
                                      >
                                        <div className="w-4 h-4 rounded-sm bg-gray-400 mr-2"></div>
                                        Not Started
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{task.internalDeadline}</td>
                              <td className="px-4 py-3 text-gray-600">{task.externalDeadline}</td>
                              <td className="px-4 py-3">
                                <span className="font-medium">{task.hours}</span>
                                <span className="text-xs text-gray-500"> hrs</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-medium">{task.complete ? task.hours : "-"}</span>
                                {task.complete && <span className="text-xs text-gray-500"> hrs</span>}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={8} className="px-4 py-2">
                              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                                <span className="mr-1">+</span> Add Item
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 border-t">
                            <td colSpan={6} className="px-4 py-2 text-right text-xs text-gray-500">
                              Total Hours:
                            </td>
                            <td className="px-4 py-2 font-medium text-sm">{objective.totalHours} hrs</td>
                            <td className="px-4 py-2 font-medium text-sm">
                              {objective.totalHours - objective.remainingHours} hrs
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Client</h3>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-800">{project.client?.name}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Project Type</h3>
                <p className="text-gray-800 capitalize">{project.project_type}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Location</h3>
                <p className="text-gray-800">{project.location}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Start Date</h3>
                <p className="text-gray-800">
                  {project.proposal_signed_date ? formatDate(project.proposal_signed_date) : "Recently"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600">Estimated Completion</h3>
                <p className="text-gray-800">
                  {project.timeline
                    ? `${formatDate(project.proposal_signed_date || project.created_at)} (${project.timeline})`
                    : "To be determined"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Jane Doe</p>
                    <p className="text-xs text-gray-500">Project Lead</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                    MS
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Mike Smith</p>
                    <p className="text-xs text-gray-500">Designer</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                    AL
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Amy Lee</p>
                    <p className="text-xs text-gray-500">Project Manager</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2">
                  Manage Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
