"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users } from "lucide-react"

export function CalendarSidebar() {
  return (
    <div className="w-64 border-r p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        <h3 className="font-semibold">My Calendars</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="calendar" />
            <label htmlFor="calendar" className="text-sm">
              Calendar
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="holidays" />
            <label htmlFor="holidays" className="text-sm">
              United States holidays
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="birthdays" />
            <label htmlFor="birthdays" className="text-sm">
              Birthdays
            </label>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <h3 className="font-semibold">Team Calendars</h3>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="team1" />
              <label htmlFor="team1" className="text-sm">
                Architecture Team
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="team2" />
              <label htmlFor="team2" className="text-sm">
                Design Team
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="team3" />
              <label htmlFor="team3" className="text-sm">
                Project Management
              </label>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
