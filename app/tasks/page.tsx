"use client"

import { useEffect, useState } from "react"
import { tasksService, type Task } from "@/services/tasks-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle2Icon, CircleIcon, ClockIcon } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true)
        // const data = await tasksService.getAll()
        // setTasks(data)
      } catch (err) {
        console.error("Error loading tasks:", err)
        setError("Failed to load tasks. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading tasks...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (tasks.length === 0) {
    return <div className="text-center p-8">No tasks found.</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(task.status)}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1">{formatStatus(task.status)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {task.project_id && (
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Project:</span>
                    <span>{(task as any).project?.name || "Unknown"}</span>
                  </div>
                )}
                {task.assigned_to && (
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Assigned to:</span>
                    <span>{(task as any).assignee?.email || "Unknown"}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getStatusIcon(status: Task["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle2Icon className="h-4 w-4" />
    case "in_progress":
      return <ClockIcon className="h-4 w-4" />
    case "pending":
      return <CircleIcon className="h-4 w-4" />
    default:
      return null
  }
}

function formatStatus(status: Task["status"]) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getStatusBadgeVariant(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "success"
    case "in_progress":
      return "warning"
    case "pending":
      return "secondary"
    default:
      return "outline"
  }
}
