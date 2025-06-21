"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Task {
  id: string
  name: string
  time: string
  status?: "Complete"
  additionalInfo?: string
  type: "team" | "project" | "client" | "site" | "punch" | "design"
}

interface AgendaTasksProps {
  date: Date
  tasks: Task[]
  onPreviousDay: () => void
  onNextDay: () => void
  className?: string
}

export function AgendaTasks({ date, tasks, onPreviousDay, onNextDay, className }: AgendaTasksProps) {
  const getTaskColor = (type: Task["type"]) => {
    switch (type) {
      case "team":
        return "bg-red-500"
      case "project":
        return "bg-blue-500"
      case "client":
        return "bg-green-500"
      case "site":
        return "bg-yellow-500"
      case "punch":
        return "bg-orange-500"
      case "design":
        return "bg-purple-500"
    }
  }

  return (
    <div className={cn("w-full bg-white", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-sm font-semibold text-gray-900">AGENDA TASKS</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onPreviousDay} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button variant="ghost" size="icon" onClick={onNextDay} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="px-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-2.5 pl-3 pr-4 hover:bg-gray-50 rounded-sm group relative"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn("w-1 h-5 rounded-sm", getTaskColor(task.type))} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{task.name}</span>
                  {task.additionalInfo && (
                    <span
                      className={cn(
                        "text-xs",
                        task.additionalInfo.toLowerCase().includes("overdue") ? "text-red-500" : "text-gray-500",
                      )}
                    >
                      {task.additionalInfo}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 tabular-nums">{task.time}</span>
                {task.status && (
                  <span className="text-xs text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded">{task.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
