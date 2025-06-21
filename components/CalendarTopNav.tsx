"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Video, Clock, MoreHorizontal, MessageSquare, Users, CalendarIcon, Share2 } from "lucide-react"

export function CalendarTopNav() {
  return (
    <div className="p-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>New Appointment</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>New Meeting</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Focus Time</span>
        </Button>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>New Skype Meeting</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Video className="h-4 w-4" />
          <span>Teams Meeting</span>
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          Today
        </Button>
        <Button variant="ghost" size="sm">
          Next 7 Days
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
