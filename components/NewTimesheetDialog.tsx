"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { format, addDays, nextSunday } from "date-fns"
import { X } from "lucide-react"

interface Timecard {
  id: string
  weekStarting: string
  days: any[]
  totalHours: number
  status: "pending" | "approved" | "denied"
  submitted: boolean
  approved: boolean
  submittedAt: string
}

interface NewTimesheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (endDate: Date, copyFromDate?: string) => void
  previousTimesheets: Timecard[]
}

export function NewTimesheetDialog({ open, onOpenChange, onConfirm, previousTimesheets }: NewTimesheetDialogProps) {
  // Default to next Sunday
  const [endDate, setEndDate] = useState<Date>(() => {
    const today = new Date()
    return nextSunday(today)
  })

  const [copyEnabled, setCopyEnabled] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<string>("")

  // Format the date for display
  const formattedEndDate = format(endDate, "MM/dd/yy")

  // Update the input when the date changes
  useEffect(() => {
    setEndDate(endDate)
  }, [endDate])

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    if (dateValue) {
      const newDate = new Date(dateValue)
      setEndDate(newDate)
    }
  }

  // Handle OK button click
  const handleConfirm = () => {
    onConfirm(endDate, copyEnabled ? selectedTimesheet : undefined)
    onOpenChange(false)
  }

  // Get sorted previous timesheets for the list
  const sortedTimesheets = [...previousTimesheets]
    .sort((a, b) => new Date(b.weekStarting).getTime() - new Date(a.weekStarting).getTime())
    .map((timesheet) => {
      // Calculate the end date (Sunday) from the start date (Monday)
      const startDate = new Date(timesheet.weekStarting)
      const endDate = addDays(startDate, 6)
      return {
        ...timesheet,
        endDate: format(endDate, "MM/dd/yy"),
      }
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
          <h2 className="text-sm font-medium">New Timesheet</h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="endDate" className="text-sm font-medium text-blue-800">
              Timesheet ending date
            </label>
            <Input
              id="endDate"
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={handleDateChange}
              className="w-[150px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="copyTimesheet"
              checked={copyEnabled}
              onCheckedChange={(checked) => setCopyEnabled(checked === true)}
            />
            <label
              htmlFor="copyTimesheet"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Copy timesheet from...
            </label>
          </div>

          <div className={`border rounded-md h-[180px] overflow-auto ${!copyEnabled ? "opacity-50" : ""}`}>
            <div className="p-1">
              {sortedTimesheets.map((timesheet) => (
                <div
                  key={timesheet.id}
                  className={`px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${selectedTimesheet === timesheet.weekStarting ? "bg-blue-50 text-blue-700" : ""}`}
                  onClick={() => {
                    if (copyEnabled) {
                      setSelectedTimesheet(timesheet.weekStarting)
                    }
                  }}
                >
                  {timesheet.endDate}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-100 px-4 py-2">
          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              OK
            </Button>
            <Button variant="outline" size="sm" disabled>
              Help
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
