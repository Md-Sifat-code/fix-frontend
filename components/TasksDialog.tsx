"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Search } from "lucide-react"

interface Task {
  id: string
  name: string
  projectName: string
  dueDate: string
  importance: "low" | "medium" | "high"
  completed: boolean
}

interface TasksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: Task[]
  onTaskComplete: (taskId: string) => void
}

export function TasksDialog({ open, onOpenChange, tasks, onTaskComplete }: TasksDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [importanceFilter, setImportanceFilter] = useState<string>("all")
  const [completedFilter, setCompletedFilter] = useState<string>("all")

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (importanceFilter === "all" || task.importance === importanceFilter) &&
      (completedFilter === "all" ||
        (completedFilter === "completed" && task.completed) ||
        (completedFilter === "incomplete" && !task.completed)),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>All Tasks</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 my-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select value={importanceFilter} onValueChange={setImportanceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by importance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Importance</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={completedFilter} onValueChange={setCompletedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-y-auto flex-grow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        task.importance === "high"
                          ? "bg-red-100 text-red-800"
                          : task.importance === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.importance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Checkbox checked={task.completed} onCheckedChange={() => onTaskComplete(task.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
