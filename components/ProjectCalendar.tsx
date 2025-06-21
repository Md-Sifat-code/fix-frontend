"use client"

import { useState, useMemo } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, CheckSquare, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarItem {
  id: string
  title: string
  date: string
  time: string | null
  type: "task" | "event"
}

interface ProjectCalendarProps {
  items?: CalendarItem[]
  onAddItem: (date: Date, type: "task" | "event") => void
}

type ViewType = "month" | "week"

export function ProjectCalendar({ items = [], onAddItem }: ProjectCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("month")

  const handlePrevious = () => {
    if (viewType === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (viewType === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const toggleViewType = () => {
    setViewType(viewType === "month" ? "week" : "month")
  }

  const days = useMemo(() => {
    if (viewType === "month") {
      return getMonthDays(currentDate)
    } else {
      return getWeekDays(currentDate)
    }
  }, [currentDate, viewType])

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {viewType === "month"
              ? format(currentDate, "MMMM yyyy")
              : `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
          </h2>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous {viewType}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next {viewType}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleViewType}>
                    {viewType === "month" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Switch to {viewType === "month" ? "week" : "month"} view</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onAddItem(currentDate, "task")}>
                  <CheckSquare className="h-4 w-4 mr-2 text-green-500" />
                  <span>Add Task</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddItem(currentDate, "event")}>
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-400" />
                  <span>Add Event</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center py-2 bg-gray-100 text-sm font-semibold text-gray-700">
            {day}
          </div>
        ))}
      </div>
      <div className={cn("grid gap-px bg-gray-200", viewType === "month" ? "grid-cols-7" : "grid-cols-7")}>
        {days.map((day, dayIndex) => {
          const dayItems = items.filter((item) => isSameDay(parseISO(item.date), day))
          return (
            <div
              key={dayIndex}
              className={cn(
                "bg-white p-2",
                viewType === "month" ? "h-32" : "h-48",
                !isSameMonth(day, currentDate) && viewType === "month" && "bg-gray-50",
                isToday(day) && "ring-2 ring-blue-500",
              )}
            >
              <div className={cn("text-sm font-medium", isToday(day) ? "text-blue-600" : "text-gray-700")}>
                {format(day, "d")}
              </div>
              <div className="mt-1 space-y-1">
                {dayItems.slice(0, viewType === "month" ? 3 : 5).map((item) => (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "text-xs p-1 rounded truncate cursor-pointer transition-colors",
                            item.type === "task"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200",
                          )}
                        >
                          {item.time && <span className="font-semibold mr-1">{item.time}</span>}
                          {item.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <strong>{item.title}</strong>
                        </p>
                        <p>{format(parseISO(item.date), "MMMM d, yyyy")}</p>
                        {item.time && <p>Time: {item.time}</p>}
                        <p>Type: {item.type}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {dayItems.length > (viewType === "month" ? 3 : 5) && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayItems.length - (viewType === "month" ? 3 : 5)} more
                  </div>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onAddItem(day, "task")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add item to this day</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getMonthDays(date: Date) {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  const days = []
  let day = start
  while (day <= end) {
    days.push(day)
    day = addDays(day, 1)
  }
  return days
}

function getWeekDays(date: Date) {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export interface Task {
  id: string
  title: string
  date: string
  type: "task" | "event"
}
