"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Check, ChevronDown, ChevronUp, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TimecardDetailView } from "./TimecardDetailView"
import { TimesheetEntryForm } from "./TimesheetEntryForm"
import { NewTimesheetDialog } from "./NewTimesheetDialog"

interface Project {
  id: string
  name: string
  objectives: Objective[]
}

interface Objective {
  id: string
  name: string
  subTasks: SubTask[]
}

interface SubTask {
  id: string
  name: string
}

interface TimeEntry {
  projectId: string
  objectiveId: string
  taskId: string
  hours: number
}

interface DayEntry {
  date: string
  entries: TimeEntry[]
}

interface Timecard {
  id: string
  weekStarting: string
  days: DayEntry[]
  totalHours: number
  status: "pending" | "approved" | "denied"
  submitted: boolean
  approved: boolean
  submittedAt: string
  feedback?: string
}

interface TimeCardSubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (timecard: any) => void
  projects: Project[]
}

// Mock previously submitted timecards
const mockPreviousTimecards: Timecard[] = [
  {
    id: "tc1",
    weekStarting: "2025-03-30",
    days: Array(7).fill({ date: "", entries: [] }),
    totalHours: 0.0,
    status: "pending",
    submitted: false,
    approved: false,
    submittedAt: "",
  },
  {
    id: "tc2",
    weekStarting: "2025-03-23",
    days: Array(7).fill({ date: "", entries: [] }),
    totalHours: 41.0,
    status: "approved",
    submitted: true,
    approved: true,
    submittedAt: "2025-03-29T17:45:00Z",
  },
  {
    id: "tc3",
    weekStarting: "2025-03-16",
    days: Array(7).fill({ date: "", entries: [] }),
    totalHours: 42.0,
    status: "approved",
    submitted: true,
    approved: true,
    submittedAt: "2025-03-22T19:15:00Z",
  },
  {
    id: "tc4",
    weekStarting: "2025-03-09",
    days: Array(7).fill({ date: "", entries: [] }),
    totalHours: 42.0,
    status: "approved",
    submitted: true,
    approved: true,
    submittedAt: "2025-03-15T16:20:00Z",
  },
  {
    id: "tc5",
    weekStarting: "2025-03-02",
    days: Array(7).fill({ date: "", entries: [] }),
    totalHours: 41.0,
    status: "approved",
    submitted: true,
    approved: true,
    submittedAt: "2025-03-08T14:30:00Z",
  },
  {
    id: "tc6",
    weekStarting: "2025-02-23",
    days: Array(7).fill({ date: "", entries: [] }),
    totalHours: 47.0,
    status: "approved",
    submitted: true,
    approved: true,
    submittedAt: "2025-03-01T18:45:00Z",
  },
]

export function TimeCardSubmissionDialog({ open, onOpenChange, onSubmit, projects }: TimeCardSubmissionDialogProps) {
  const { toast } = useToast()
  const [weekStarting, setWeekStarting] = useState<Date>(() => {
    try {
      return startOfWeek(new Date(), { weekStartsOn: 1 })
    } catch (error) {
      console.error("Error initializing date:", error)
      return new Date() // Fallback to current date if startOfWeek fails
    }
  })
  const [days, setDays] = useState<DayEntry[]>([])
  const [previousTimecards, setPreviousTimecards] = useState<Timecard[]>(mockPreviousTimecards)
  const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null)
  const [userName, setUserName] = useState("Eric Rivera") // This would come from your auth context
  const [showDetailView, setShowDetailView] = useState(false)
  const [showNewTimesheetDialog, setShowNewTimesheetDialog] = useState(false)
  const [showTimesheetEntryForm, setShowTimesheetEntryForm] = useState(false)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Initialize the week days when the component mounts or week changes
  useEffect(() => {
    try {
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStarting, i)
        return {
          date: format(date, "yyyy-MM-dd"),
          entries: [],
        }
      })
      setDays(weekDays)
    } catch (error) {
      console.error("Error creating week days:", error)
      // Set a default empty week if there's an error
      setDays(Array(7).fill({ date: "", entries: [] }))
    }
  }, [weekStarting])

  const handleStartNewTimecard = () => {
    setShowNewTimesheetDialog(true)
  }

  const handleNewTimesheetConfirm = (endDate: Date, copyFromDate?: string) => {
    // Calculate the start date (Monday) based on the end date (Sunday)
    // Subtract 6 days from Sunday to get the previous Monday
    const startDate = startOfWeek(endDate, { weekStartsOn: 1 })

    setWeekStarting(startDate)

    // Initialize days array
    const newDays = Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(startDate, i), "yyyy-MM-dd"),
      entries: [],
    }))

    // If copying from a previous timesheet, find that timesheet and copy its entries
    if (copyFromDate) {
      const sourceTimecard = previousTimecards.find((tc) => tc.weekStarting === copyFromDate)
      if (sourceTimecard && sourceTimecard.days) {
        // Copy entries from the source timecard
        sourceTimecard.days.forEach((day, index) => {
          if (day.entries && day.entries.length > 0) {
            newDays[index].entries = [...day.entries]
          }
        })
      }
    }

    setDays(newDays)
    setSelectedTimecard(null)
    setShowDetailView(false)
    setShowTimesheetEntryForm(true)
  }

  const handleViewTimecard = (timecard: Timecard) => {
    setSelectedTimecard(timecard)
    setShowDetailView(true)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "M/d/yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const sortedTimecards = [...previousTimecards].sort((a, b) => {
    const dateA = new Date(a.weekStarting).getTime()
    const dateB = new Date(b.weekStarting).getTime()
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA
  })

  if (showDetailView && selectedTimecard) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0">
          <TimecardDetailView
            timecard={selectedTimecard}
            employeeName={userName}
            onClose={() => setShowDetailView(false)}
            onSave={() => {
              toast({
                title: "Timecard Saved",
                description: "Your changes have been saved successfully.",
              })
              setShowDetailView(false)
            }}
            onDelete={() => {
              setPreviousTimecards(previousTimecards.filter((tc) => tc.id !== selectedTimecard.id))
              toast({
                title: "Timecard Deleted",
                description: "The timecard has been deleted successfully.",
              })
              setShowDetailView(false)
            }}
            onUnsubmit={() => {
              const updatedTimecards = previousTimecards.map((tc) =>
                tc.id === selectedTimecard.id ? { ...tc, submitted: false, status: "pending" } : tc,
              )
              setPreviousTimecards(updatedTimecards)
              toast({
                title: "Timecard Unsubmitted",
                description: "The timecard has been unsubmitted and is now in draft status.",
              })
              setShowDetailView(false)
            }}
            onPrint={() => {
              toast({
                title: "Printing Timecard",
                description: "The timecard is being prepared for printing.",
              })
            }}
            isReadOnly={selectedTimecard.status === "approved"}
          />
        </DialogContent>
      </Dialog>
    )
  }

  if (showTimesheetEntryForm) {
    // Calculate the end date (Sunday) from the start date (Monday)
    const endDate = addDays(weekStarting, 6)

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0">
          <TimesheetEntryForm
            endDate={endDate}
            employeeName={userName}
            onClose={() => onOpenChange(false)}
            onSave={() => {
              toast({
                title: "Timesheet Saved",
                description: "Your changes have been saved successfully.",
              })
            }}
            onCancel={() => {
              setShowTimesheetEntryForm(false)
              onOpenChange(false)
            }}
            onDelete={() => {
              toast({
                title: "Timesheet Deleted",
                description: "The timesheet has been deleted successfully.",
              })
              setShowTimesheetEntryForm(false)
              onOpenChange(false)
            }}
            onSubmit={() => {
              toast({
                title: "Timesheet Submitted",
                description: "Your timesheet has been submitted for approval.",
              })
              setShowTimesheetEntryForm(false)
              onOpenChange(false)
            }}
            onPrint={() => {
              toast({
                title: "Printing Timesheet",
                description: "The timesheet is being prepared for printing.",
              })
            }}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              My Last 10 Timesheets
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Select a row to view details below</p>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="p-4">
              <Button variant="outline" size="sm" onClick={handleStartNewTimecard} className="mb-4">
                New
              </Button>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px] cursor-pointer" onClick={toggleSortDirection}>
                        <div className="flex items-center">
                          Timesheet Date
                          {sortDirection === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Timesheet Total</TableHead>
                      <TableHead className="text-center">Submitted</TableHead>
                      <TableHead className="text-center">
                        <div className="text-center">
                          Accounting
                          <br />
                          Approved
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Open</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTimecards.map((timecard) => (
                      <TableRow
                        key={timecard.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewTimecard(timecard)}
                      >
                        <TableCell>{formatDate(timecard.weekStarting)}</TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {timecard.totalHours.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          {timecard.submitted && <Check className="mx-auto h-4 w-4 text-green-600" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {timecard.approved && <Check className="mx-auto h-4 w-4 text-green-600" />}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className="text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewTimecard(timecard)
                            }}
                          >
                            Open
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NewTimesheetDialog
        open={showNewTimesheetDialog}
        onOpenChange={setShowNewTimesheetDialog}
        onConfirm={handleNewTimesheetConfirm}
        previousTimesheets={previousTimecards}
      />
    </>
  )
}
