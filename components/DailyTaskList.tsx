import { format, isSameDay } from "date-fns"
import type { Task } from "./ProjectCalendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface DailyTaskListProps {
  date: Date | undefined
  tasks: Task[]
  meetings: {
    id: string
    title: string
    date: Date
    type: "project" | "inquiry"
  }[]
}

export function DailyTaskList({ date, tasks, meetings }: DailyTaskListProps) {
  if (!date) return null

  const dailyTasks = tasks.filter((task) => isSameDay(task.startDate, date) || isSameDay(task.endDate, date))
  const dailyMeetings = meetings.filter((meeting) => isSameDay(meeting.date, date))

  const sortedEvents = [...dailyTasks, ...dailyMeetings].sort((a, b) => {
    const dateA = "startDate" in a ? a.startDate : a.date
    const dateB = "startDate" in b ? b.startDate : b.date
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{format(date, "MMMM d, yyyy")}</h3>
      <ScrollArea className="h-[300px]">
        {sortedEvents.length > 0 ? (
          <ul className="space-y-3">
            {sortedEvents.map((event, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Badge variant={event.type === "inquiry" ? "secondary" : "default"}>
                  {format("startDate" in event ? event.startDate : event.date, "HH:mm")}
                </Badge>
                <span className="flex-grow">{event.title}</span>
                {"project" in event && <span className="text-sm text-muted-foreground">{event.project}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No tasks or meetings scheduled for this day.</p>
        )}
      </ScrollArea>
    </div>
  )
}
