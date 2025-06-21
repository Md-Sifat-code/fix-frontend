"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Clock, FileText, Users } from "lucide-react"

interface Employee {
  id: string
  name: string
  role: string
  hourlyRate: number
}

interface TimeEntry {
  id: string
  employeeId: string
  projectId: string
  objectiveId: string
  taskId: string
  date: string
  hours: number
  notes: string
  approved: boolean
}

interface Timecard {
  id: string
  employeeId: string
  weekStarting: string
  weekEnding: string
  status: "draft" | "submitted" | "approved" | "rejected"
  timeEntries: TimeEntry[]
  totalHours: number
  submittedAt?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
}

interface Project {
  id: string
  name: string
  client: string
  objectives: {
    id: string
    name: string
    tasks: {
      id: string
      name: string
    }[]
  }[]
}

// Mock data
const mockEmployees: Employee[] = [
  { id: "e1", name: "Eric Rivera", role: "Architect", hourlyRate: 85 },
  { id: "e2", name: "Paige Noga", role: "Project Manager", hourlyRate: 75 },
  { id: "e3", name: "Samira Saleh", role: "Designer", hourlyRate: 65 },
]

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Downtown Revitalization",
    client: "City of Springfield",
    objectives: [
      {
        id: "o1",
        name: "Concept Design",
        tasks: [
          { id: "t1", name: "Site Analysis" },
          { id: "t2", name: "Preliminary Sketches" },
        ],
      },
      {
        id: "o2",
        name: "Design Development",
        tasks: [
          { id: "t3", name: "3D Modeling" },
          { id: "t4", name: "Material Selection" },
        ],
      },
    ],
  },
  {
    id: "p2",
    name: "Waterfront Project",
    client: "Harbor Development Corp",
    objectives: [
      {
        id: "o3",
        name: "Master Planning",
        tasks: [
          { id: "t5", name: "Urban Context Analysis" },
          { id: "t6", name: "Zoning Review" },
        ],
      },
    ],
  },
]

const mockTimecards: Timecard[] = [
  {
    id: "tc1",
    employeeId: "e1",
    weekStarting: "2025-03-24",
    weekEnding: "2025-03-30",
    status: "submitted",
    timeEntries: [
      {
        id: "te1",
        employeeId: "e1",
        projectId: "p2",
        objectiveId: "o3",
        taskId: "t5",
        date: "2025-03-25",
        hours: 8,
        notes: "Completed urban analysis for north sector",
        approved: false,
      },
      {
        id: "te2",
        employeeId: "e1",
        projectId: "p2",
        objectiveId: "o3",
        taskId: "t5",
        date: "2025-03-26",
        hours: 8,
        notes: "Completed urban analysis for south sector",
        approved: false,
      },
    ],
    totalHours: 16,
    submittedAt: "2025-03-30T18:00:00Z",
  },
  {
    id: "tc2",
    employeeId: "e2",
    weekStarting: "2025-03-24",
    weekEnding: "2025-03-30",
    status: "submitted",
    timeEntries: [
      {
        id: "te3",
        employeeId: "e2",
        projectId: "p1",
        objectiveId: "o1",
        taskId: "t1",
        date: "2025-03-25",
        hours: 6,
        notes: "Site visit and initial analysis",
        approved: false,
      },
      {
        id: "te4",
        employeeId: "e2",
        projectId: "p1",
        objectiveId: "o1",
        taskId: "t2",
        date: "2025-03-26",
        hours: 7,
        notes: "Started preliminary sketches",
        approved: false,
      },
    ],
    totalHours: 13,
    submittedAt: "2025-03-29T17:30:00Z",
  },
]

export function TimecardApprovalDashboard() {
  const [timecards, setTimecards] = useState<Timecard[]>(mockTimecards)
  const [selectedTimecard, setSelectedTimecard] = useState<Timecard | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // Function to approve a timecard
  const approveTimecard = (timecardId: string) => {
    setTimecards(
      timecards.map((tc) =>
        tc.id === timecardId
          ? {
              ...tc,
              status: "approved",
              approvedAt: new Date().toISOString(),
              approvedBy: "supervisor-id", // In a real app, this would be the current user's ID
              timeEntries: tc.timeEntries.map((entry) => ({
                ...entry,
                approved: true,
              })),
            }
          : tc,
      ),
    )
    setShowDetailDialog(false)
  }

  // Function to reject a timecard
  const rejectTimecard = () => {
    if (!selectedTimecard) return

    setTimecards(
      timecards.map((tc) =>
        tc.id === selectedTimecard.id
          ? {
              ...tc,
              status: "rejected",
              rejectedAt: new Date().toISOString(),
              rejectedBy: "supervisor-id", // In a real app, this would be the current user's ID
              rejectionReason,
            }
          : tc,
      ),
    )
    setShowRejectDialog(false)
    setShowDetailDialog(false)
    setRejectionReason("")
  }

  // Function to view timecard details
  const viewTimecardDetails = (timecard: Timecard) => {
    setSelectedTimecard(timecard)
    setShowDetailDialog(true)
  }

  // Function to open reject dialog
  const openRejectDialog = () => {
    setShowRejectDialog(true)
  }

  // Add this function near the other handler functions
  const handleManageTeam = () => {
    // Dispatch a custom event to open the team management dialog
    // with the special styling for integration with payroll
    const event = new CustomEvent("open-team-management", {
      detail: { integrateWithPayroll: true },
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Timecard Approval Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timecards.filter((tc) => tc.status === "submitted").length}</div>
            <p className="text-sm text-gray-500">Timecards awaiting your review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Approved This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                timecards.filter(
                  (tc) =>
                    tc.status === "approved" &&
                    new Date(tc.approvedAt!).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
                ).length
              }
            </div>
            <p className="text-sm text-gray-500">Timecards approved in the last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-500" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timecards.reduce((total, tc) => total + tc.totalHours, 0)}</div>
            <p className="text-sm text-gray-500">Total hours across all timecards</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pending Timecard Approvals</CardTitle>
            <Button variant="outline" size="sm" onClick={handleManageTeam}>
              <Users className="mr-2 h-4 w-4" />
              Manage Team
            </Button>
          </div>
          <CardDescription>Review and approve employee timecards</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timecards
                .filter((tc) => tc.status === "submitted")
                .map((timecard) => {
                  const employee = mockEmployees.find((e) => e.id === timecard.employeeId)

                  return (
                    <TableRow key={timecard.id}>
                      <TableCell className="font-medium">{employee?.name || "Unknown"}</TableCell>
                      <TableCell>
                        {new Date(timecard.weekStarting).toLocaleDateString()} -{" "}
                        {new Date(timecard.weekEnding).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{timecard.totalHours}</TableCell>
                      <TableCell>{new Date(timecard.submittedAt!).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge>Pending</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => viewTimecardDetails(timecard)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}

              {timecards.filter((tc) => tc.status === "submitted").length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No timecards pending approval
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Timecard Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Timecard Review</DialogTitle>
            <DialogDescription>Review timecard details before approving or rejecting</DialogDescription>
          </DialogHeader>

          {selectedTimecard && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employee</h3>
                  <p>{mockEmployees.find((e) => e.id === selectedTimecard.employeeId)?.name || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Week</h3>
                  <p>
                    {new Date(selectedTimecard.weekStarting).toLocaleDateString()} -{" "}
                    {new Date(selectedTimecard.weekEnding).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
                  <p>{selectedTimecard.totalHours}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                  <p>{new Date(selectedTimecard.submittedAt!).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Time Entries</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Objective</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTimecard.timeEntries.map((entry) => {
                      const project = mockProjects.find((p) => p.id === entry.projectId)
                      const objective = project?.objectives.find((o) => o.id === entry.objectiveId)
                      const task = objective?.tasks.find((t) => t.id === entry.taskId)

                      return (
                        <TableRow key={entry.id}>
                          <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                          <TableCell>{project?.name || "Unknown"}</TableCell>
                          <TableCell>{objective?.name || "Unknown"}</TableCell>
                          <TableCell>{task?.name || "Unknown"}</TableCell>
                          <TableCell>{entry.hours}</TableCell>
                          <TableCell className="max-w-xs truncate">{entry.notes}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={openRejectDialog}>
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={() => approveTimecard(selectedTimecard.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Timecard</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this timecard</DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectTimecard} disabled={!rejectionReason.trim()}>
              Reject Timecard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
