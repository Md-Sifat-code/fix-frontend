"use client"

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  currentDate: Date
  tasks: any[] | undefined
  meetings: any[] | undefined
  view: "day" | "week" | "month" | "schedule"
}

export function CalendarGrid({ currentDate, tasks = [], meetings = [], view }: CalendarGridProps) {
  const monthToDisplay = currentDate
  const monthStart = startOfMonth(monthToDisplay)
  const monthEnd = endOfMonth(monthToDisplay)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const events = [...(Array.isArray(tasks) ? tasks : []), ...(Array.isArray(meetings) ? meetings : [])].sort((a, b) => {
    const dateA = "startDate" in a ? a.startDate : a.date
    const dateB = "startDate" in b ? b.startDate : b.date
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-6 border-t border-l">
      {/* Header */}
      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
        <div key={day} className="p-2 text-sm font-medium border-r border-b bg-muted/50">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((day, index) => {
        const dayEvents = events.filter((event) => {
          const eventDate = "startDate" in event ? event.startDate : event.date
          return isSameDay(eventDate, day)
        })

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "min-h-[120px] p-2 border-r border-b",
              !isSameMonth(day, monthToDisplay) && "bg-muted/20",
              "relative",
            )}
          >
            <span className="text-sm">{format(day, "d")}</span>
            <div className="mt-1 space-y-1">
              {dayEvents.map((event, eventIndex) => (
                <div
                  key={`${event.id}-${eventIndex}`}
                  className="text-xs p-1 rounded bg-blue-100 text-blue-900 truncate cursor-pointer hover:bg-blue-200"
                >
                  {format("startDate" in event ? event.startDate : event.date, "HH:mm")} - {event.title}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
