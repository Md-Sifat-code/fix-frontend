"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { format, addDays } from "date-fns"
import { ChevronDown, ChevronRight } from "lucide-react"

interface TimecardDetailViewProps {
  timecard: any
  employeeName: string
  onClose: () => void
  onSave?: () => void
  onDelete?: () => void
  onUnsubmit?: () => void
  onPrint?: () => void
  isReadOnly?: boolean
}

export function TimecardDetailView({
  timecard,
  employeeName,
  onClose,
  onSave,
  onDelete,
  onUnsubmit,
  onPrint,
  isReadOnly = false,
}: TimecardDetailViewProps) {
  const [supervisorApproved, setSupervisorApproved] = useState(timecard.status === "approved")
  const [accountingApproved, setAccountingApproved] = useState(timecard.approved)
  const [overheadExpanded, setOverheadExpanded] = useState(true)
  const [regularExpanded, setRegularExpanded] = useState(true)

  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(timecard.weekStarting), i)
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "MM/dd"),
    }
  })

  // Mock project data
  const projectEntries = [
    {
      projectCode: "223-0373 (100)",
      projectName: "PG&E Concord SC - Fleet Restroom Remodel",
      phase: "CS Construction Support",
      activity: "E104 Review Information",
      employee: "310.49 SCE C...",
      hours: [2.0, 2.0, 1.0, 2.0, 0, 0, 0],
      total: 7.0,
    },
    {
      projectCode: "219-0298 (310)",
      projectName: "New Kerrville Service Center",
      phase: "CS3 Extended Construction Support to November 2024",
      activity: "E103 Assemble Information",
      employee: "310.49 SCE C...",
      hours: [5.0, 2.0, 1.0, 3.0, 0, 0, 0],
      total: 11.0,
    },
    {
      projectCode: "225-0187 (310)",
      projectName: "SCE Chino Canopies",
      phase: "AI Assemble Information",
      activity: "E101 Research",
      employee: "310.49 SCE C...",
      hours: [1.0, 1.0, 1.0, 0, 0, 0, 0],
      total: 3.0,
    },
    {
      projectCode: "222-0401 (310)",
      projectName: "SCE Tulare EEC T&D Training Facility",
      phase: "AB Annex Building / ABC Annex Bldg Construction Support",
      activity: "E104 Review Information",
      employee: "310.49 SCE C...",
      hours: [0, 2.0, 3.0, 2.0, 0, 0, 0],
      total: 7.0,
    },
    {
      projectCode: "223-0384 (310)",
      projectName: "SCE Vista Sub. Maintenance Building Remodel",
      phase: "CO2 Change Order #2 - Plan Revisions and Plan Check Revisions",
      activity: "E103 Assemble Information",
      employee: "310.49 SCE C...",
      hours: [0, 0, 1.0, 1.0, 1.0, 0, 0],
      total: 3.0,
    },
    {
      projectCode: "222-0380 (310)",
      projectName: "SCE Victorville SC Tool Room",
      phase: "CO2 Change Order - Site Improvements",
      activity: "E108 Coordination",
      employee: "310.49 SCE C...",
      hours: [0, 0, 0, 0, 1.0, 0, 0],
      total: 1.0,
    },
  ]

  // Mock overhead categories
  const overheadCategories = [
    { name: "Bereavement", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Client Billing & Invoice Review", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Company & Group Meetings", hours: [1.0, 0, 0, 0, 0, 0, 0], total: 1.0 },
    { name: "General Office", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "General research/assembling information (not project-specific)", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Holiday", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Jury & Witness Duty", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "PMCS Committee", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Professional Training & Development", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "QA/QC Program development (not project-specific)", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Safety Training & Meetings", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Sick", hours: [0, 0, 0, 0, 0, 0, 0], total: 0 },
    { name: "Overhead", hours: [1.0, 0, 0, 0, 8.0, 0, 0], total: 9.0 },
  ]

  // Calculate daily totals
  const directDailyTotals = Array(7)
    .fill(0)
    .map((_, dayIndex) => {
      return projectEntries.reduce((total, entry) => total + (entry.hours[dayIndex] || 0), 0)
    })

  const overheadDailyTotals = Array(7)
    .fill(0)
    .map((_, dayIndex) => {
      return overheadCategories.reduce((total, entry) => total + (entry.hours[dayIndex] || 0), 0)
    })

  const totalDailyHours = directDailyTotals.map((hours, index) => hours + overheadDailyTotals[index])

  // Calculate timesheet total
  const timesheetTotal = totalDailyHours.reduce((sum, hours) => sum + hours, 0)

  // Hours detail
  const hoursDetail = [
    { type: "Regular", hours: 40.0, notes: "" },
    { type: "Overtime", hours: 1.0, notes: "" },
    { type: "Double time", hours: 0, notes: "" },
  ]

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm max-h-[90vh] overflow-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-medium text-gray-700">
          Timesheet for {employeeName} for {format(new Date(timecard.weekStarting), "MM/dd/yyyy")} -{" "}
          {timecard.submitted ? "Submitted" : "Draft"}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="supervisor-approved"
            checked={supervisorApproved}
            onCheckedChange={setSupervisorApproved}
            disabled={isReadOnly}
          />
          <label htmlFor="supervisor-approved" className="text-sm">
            Supervisor approved
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="accounting-approved"
            checked={accountingApproved}
            onCheckedChange={setAccountingApproved}
            disabled={isReadOnly}
          />
          <label htmlFor="accounting-approved" className="text-sm">
            Accounting approved
          </label>
        </div>
      </div>

      {/* Direct Billable Work */}
      <div className="border rounded-md overflow-hidden mb-4">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[250px]">Project</TableHead>
              <TableHead className="w-[200px]">Phase</TableHead>
              <TableHead className="w-[200px]">Activity</TableHead>
              <TableHead className="w-[120px]">Employee</TableHead>
              {weekDates.map((date, index) => (
                <TableHead key={index} className="text-center w-[60px]">
                  <div>{date.dayName}</div>
                  <div>{date.dayNumber}</div>
                </TableHead>
              ))}
              <TableHead className="text-center w-[60px]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectEntries.map((entry, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-blue-50" : ""}>
                <TableCell className="text-xs">
                  <div className="font-medium">{entry.projectCode}</div>
                  <div>{entry.projectName}</div>
                </TableCell>
                <TableCell className="text-xs">{entry.phase}</TableCell>
                <TableCell className="text-xs">{entry.activity}</TableCell>
                <TableCell className="text-xs">{entry.employee}</TableCell>
                {entry.hours.map((hours, dayIndex) => (
                  <TableCell key={dayIndex} className="text-center p-1">
                    {hours > 0 ? hours.toFixed(2) : ""}
                  </TableCell>
                ))}
                <TableCell className="text-center font-medium">{entry.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gray-100 font-medium">
              <TableCell colSpan={4} className="text-right pr-4">
                Direct
              </TableCell>
              {directDailyTotals.map((total, index) => (
                <TableCell key={index} className="text-center">
                  {total.toFixed(2)}
                </TableCell>
              ))}
              <TableCell className="text-center">{directDailyTotals.reduce((a, b) => a + b, 0).toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Overhead */}
      <div className="border rounded-md overflow-hidden mb-4">
        <div
          className="flex items-center bg-blue-100 p-2 cursor-pointer"
          onClick={() => setOverheadExpanded(!overheadExpanded)}
        >
          {overheadExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          <span className="font-medium">Overhead</span>
        </div>

        {overheadExpanded && (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead colSpan={4}></TableHead>
                {weekDates.map((date, index) => (
                  <TableHead key={index} className="text-center w-[60px]"></TableHead>
                ))}
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overheadCategories.map((category, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "bg-blue-50" : ""}>
                  <TableCell colSpan={4} className="text-xs">
                    {category.name}
                  </TableCell>
                  {category.hours.map((hours, dayIndex) => (
                    <TableCell key={dayIndex} className="text-center p-1">
                      {hours > 0 ? hours.toFixed(2) : ""}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">{category.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-100 font-medium">
                <TableCell colSpan={4} className="text-right pr-4">
                  Timesheet Total
                </TableCell>
                {totalDailyHours.map((total, index) => (
                  <TableCell key={index} className="text-center">
                    {total.toFixed(2)}
                  </TableCell>
                ))}
                <TableCell className="text-center">{timesheetTotal.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>

      {/* Hours Detail */}
      <div className="border rounded-md overflow-hidden mb-4">
        <div className="bg-gray-100 p-2">
          <span className="font-medium">Hours Detail</span>
        </div>

        <div
          className="flex items-center bg-blue-100 p-2 cursor-pointer"
          onClick={() => setRegularExpanded(!regularExpanded)}
        >
          {regularExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          <span className="font-medium">Regular</span>
        </div>

        {regularExpanded && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Hours</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hoursDetail.map((detail, index) => (
                <TableRow key={index} className="bg-blue-50">
                  <TableCell>{detail.type}</TableCell>
                  <TableCell>{detail.hours.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        {!isReadOnly && (
          <>
            <Button variant="outline" size="sm" onClick={onSave}>
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={onUnsubmit}>
              Unsubmit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </>
        )}
        <Button variant="outline" size="sm" onClick={onPrint}>
          Print
        </Button>
        <Button variant="outline" size="sm">
          Help
        </Button>
      </div>
    </div>
  )
}
