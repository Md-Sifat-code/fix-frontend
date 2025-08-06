"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef } from "react"
import { ArrowLeft, Trash2, Calendar, Clock } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  format,
  addDays,
  differenceInDays,
  eachWeekOfInterval,
  isWeekend,
  isSameDay,
  eachMonthOfInterval,
  eachDayOfInterval,
} from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import SignatureCanvas from "react-signature-canvas"

const capitalizeWords = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export interface NewProposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Task {
  id: string
  objectiveId: string
  order: string | number
  name: string
  duration: number
  start: Date | null
  finish: Date | null
  precedes: string
  staffHours: {
    principal: number
    projectArchitect: number
    projectManager: number
    designer: number
    drafter: number
    consultant: number
  }
}

interface Objective {
  id: string
  order: string
  name: string
  tasks: Task[]
}

interface ProjectInfo {
  projectName: string
  clientName: string
  projectAddress: string
  projectCity: string
  projectState: string
  projectZip: string
  projectType: string
  projectSize: string
  estimatedBudget: string
  additionalNotes: string
}

interface StaffHours {
  principal: number[]
  projectArchitect: number[]
  projectManager: number[]
  designer: number[]
  drafter: number[]
  consultant: number[]
}

interface StaffRole {
  title: string
  rate: number
}

interface FinancialSettings {
  firmMultiplier: number
  staffRoles: {
    [key: string]: StaffRole
  }
}

// Add this function to check for holidays (you can expand this list as needed)
const isHoliday = (date: Date) => {
  const holidays = [
    new Date(date.getFullYear(), 0, 1), // New Year's Day
    new Date(date.getFullYear(), 6, 4), // Independence Day
    new Date(date.getFullYear(), 11, 25), // Christmas Day
    // Add more holidays as needed
  ]
  return holidays.some((holiday) => isSameDay(date, holiday))
}

// Add this function to get the next working day
const getNextWorkingDay = (date: Date): Date => {
  let nextDay = addDays(date, 1)
  while (isWeekend(nextDay) || isHoliday(nextDay)) {
    nextDay = addDays(nextDay, 1)
  }
  return nextDay
}

// Modify the getWorkingDays function
const getWorkingDays = (start: Date, duration: number) => {
  let workingDays = 0
  let currentDate = start
  while (workingDays < duration) {
    if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
      workingDays++
    }
    currentDate = addDays(currentDate, 1)
  }
  return differenceInDays(currentDate, start)
}

const colorPalette = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
]

interface ScheduleChartProps {
  objectives: Objective[];
  contractSignDate: Date;
  targetCompletionDate: Date | null;
}

const ScheduleChart: React.FC<ScheduleChartProps> = ({ objectives, contractSignDate, targetCompletionDate }) => {
  const [hoveredTask, setHoveredTask] = useState(null)

  const startDate = contractSignDate
  const endDate = targetCompletionDate || addDays(startDate, 365)
  const totalDays = differenceInDays(endDate, startDate)
  const dayWidth = 20
  const weekWidth = dayWidth * 7
  const chartWidth = totalDays * dayWidth
  const rowHeight = 30
  const fixedWidth = 1000 // Fixed width for the visible part of the chart

  const weeks = eachWeekOfInterval({ start: startDate, end: endDate })

  const getTaskOffset = (taskStart: Date) => {
    return differenceInDays(taskStart, startDate) * dayWidth
  }

  const getTaskWidth = (task: Task) => {
    let width = 0
    let remainingDuration = task.duration
    let currentDate = task.start || startDate

    while (remainingDuration > 0) {
      if (!isWeekend(currentDate)) {
        width += dayWidth
        remainingDuration--
      }
      currentDate = addDays(currentDate, 1)
    }

    return width
  }

  const getWeekLabel = (date: Date) => {
    return format(date, "MMM d")
  }

  const getDayLabel = (date: Date) => {
    return format(date, "EEEEE")
  }

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div style={{ width: `${fixedWidth}px` }} className="relative overflow-x-auto">
        <div style={{ width: `${chartWidth + 150}px` }} className="relative">
          {/* Week headers */}
          <div className="flex border-b sticky top-0 bg-white z-10 text-xs">
            <div className="w-[150px] flex-shrink-0 font-medium border-r px-2 py-1 bg-gray-50">Task</div>
            {weeks.map((week, index) => (
              <div
                key={week.getTime()}
                className="flex-shrink-0 font-medium border-r text-center py-1 bg-gray-50"
                style={{ width: `${weekWidth}px` }}
              >
                {getWeekLabel(week)}
              </div>
            ))}
          </div>

          {/* Day headers */}
          <div className="flex border-b sticky top-6 bg-white z-10 text-xs">
            <div className="w-[150px] flex-shrink-0 border-r"></div>
            {eachDayOfInterval({ start: startDate, end: endDate }).map((day) => (
              <div
                key={day.getTime()}
                className="flex-shrink-0 font-medium border-r text-center py-1"
                style={{ width: `${dayWidth}px` }}
              >
                {getDayLabel(day)}
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div
            className="relative"
            style={{
              height: `${objectives.reduce((acc, obj) => acc + obj.tasks.length, 0) * rowHeight}px`,
              overflowY: "auto",
            }}
          >
            {objectives.map((objective, objIndex) => (
              <div key={objective.id} className="mb-2">
                <div
                  className="text-xs font-medium py-1 sticky left-0 bg-white z-10 px-2"
                  style={{ height: `${rowHeight}px` }}
                >
                  {objective.name}
                </div>
                {objective.tasks.map((task, taskIndex) => {
                  const taskStart = task.start || startDate
                  const taskOffset = getTaskOffset(taskStart)
                  const taskWidth = getTaskWidth(task)

                  return (
                    <div
                      key={task.id}
                      className="flex items-center relative"
                      style={{ height: `${rowHeight}px` }}
                      onMouseEnter={() => setHoveredTask(task)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      <div className="text-xs w-[150px] truncate pr-2 sticky left-0 bg-white z-10 px-2">
                        {task.name}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute h-6 ${
                                colorPalette[objIndex % colorPalette.length]
                              } rounded-sm opacity-80 hover:opacity-100 transition-opacity`}
                              style={{
                                left: `${taskOffset + 150}px`,
                                width: `${taskWidth}px`,
                                top: "4px",
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{task.name}</p>
                            <p>Start: {format(taskStart, "MMM d, yyyy")}</p>
                            <p>Duration: {task.duration} days</p>
                            <p>End: {format(addDays(taskStart, task.duration), "MMM d, yyyy")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Today's line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500 z-20"
            style={{
              left: `${getTaskOffset(new Date()) + 150}px`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ... (rest of the component remains the same)

export const NewProposalDialog: React.FC<NewProposalDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("project-info")
  const [contractSignDate, setContractSignDate] = useState<Date>(new Date())
  const [targetCompletionDate, setTargetCompletionDate] = useState<Date | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [signatureDate, setSignatureDate] = useState<string>('');

  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "",
    clientName: "",
    projectAddress: "",
    projectCity: "",
    projectState: "",
    projectZip: "",
    projectType: "",
    projectSize: "",
    estimatedBudget: "",
    additionalNotes: "",
  })

  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: "obj1",
      order: "A",
      name: "ASSEMBLE INFORMATION",
      tasks: [
        {
          id: "task1",
          objectiveId: "obj1",
          order: 1,
          name: "VISIT PROJECT SITE TO FIELD VERIFY EXISTING CONDITIONS (A MAXIMUM OF ONE SITE VISIT).",
          duration: 5,
          start: new Date(),
          finish: addDays(new Date(), 5),
          precedes: "2",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 6,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task2",
          objectiveId: "obj1",
          order: 2,
          name: "PREPARE AN AS-BUILT FLOOR PLAN, CEILING PLAN AND FLOOR PLAN BASED ON FIELD MEASUREMENTS.",
          duration: 10,
          start: new Date(),
          finish: new Date(),
          precedes: "3",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 30,
            consultant: 0,
          },
        },
        {
          id: "task3",
          objectiveId: "obj1",
          order: 3,
          name: "OBTAIN AS-BUILT DRAWINGS FROM PG&E.",
          duration: 3,
          start: new Date(),
          finish: new Date(),
          precedes: "4",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 2,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task4",
          objectiveId: "obj1",
          order: 4,
          name: "RESEARCH WITH LOCAL AUTHORITIES HAVING JURISDICTION FOR PERMITTING AND CODE REQUIREMENTS.",
          duration: 7,
          start: new Date(),
          finish: new Date(),
          precedes: "5",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 8,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task5",
          objectiveId: "obj1",
          order: 5,
          name: "PREPARE OCCUPANCY/EGRESS COUNT CALCULATIONS.",
          duration: 4,
          start: new Date(),
          finish: new Date(),
          precedes: "6",
          staffHours: {
            principal: 0,
            projectArchitect: 4,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task6",
          objectiveId: "obj1",
          order: 6,
          name: "PREPARE CODE ANALYSIS REPORT.",
          duration: 8,
          start: new Date(),
          finish: new Date(),
          precedes: "7",
          staffHours: {
            principal: 0,
            projectArchitect: 6,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task7",
          objectiveId: "obj1",
          order: 7,
          name: "COORDINATE SITE FINDINGS WITH PG&E, BCF + CONSULTANTS, AND ROEBBELEN.",
          duration: 6,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 6,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj2",
      order: "B",
      name: "100% SCHEMATIC DESIGN (SDs)",
      tasks: [
        {
          id: "task8",
          objectiveId: "obj2",
          order: 1,
          name: "Attend conference call meetings with SCE CRE and CBRE to discuss project requirements",
          duration: 2,
          start: new Date(),
          finish: new Date(),
          precedes: "2",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 4,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task9",
          objectiveId: "obj2",
          order: 2,
          name: "Prepare Life Safety Plan",
          duration: 3,
          start: new Date(),
          finish: new Date(),
          precedes: "3",
          staffHours: {
            principal: 0,
            projectArchitect: 2,
            projectManager: 0,
            designer: 4,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task10",
          objectiveId: "obj2",
          order: 3,
          name: "Prepare Demolition Floor Plan",
          duration: 4,
          start: new Date(),
          finish: new Date(),
          precedes: "4",
          staffHours: {
            principal: 0,
            projectArchitect: 2,
            projectManager: 0,
            designer: 6,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task11",
          objectiveId: "obj2",
          order: 4,
          name: "Prepare Proposed Floor Plan",
          duration: 5,
          start: new Date(),
          finish: new Date(),
          precedes: "5",
          staffHours: {
            principal: 0,
            projectArchitect: 2,
            projectManager: 8,
            designer: 8,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task12",
          objectiveId: "obj2",
          order: 5,
          name: "Prepare Proposed Reflected Ceiling Plan",
          duration: 4,
          start: new Date(),
          finish: new Date(),
          precedes: "6",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 2,
            designer: 8,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task13",
          objectiveId: "obj2",
          order: 6,
          name: "Review plans for conformance with project requirements (QA/QC)",
          duration: 3,
          start: new Date(),
          finish: new Date(),
          precedes: "7",
          staffHours: {
            principal: 3,
            projectArchitect: 0,
            projectManager: 4,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task14",
          objectiveId: "obj2",
          order: 7,
          name: "Transmit 100% SDs package to SCE CRE and CBRE for review",
          duration: 1,
          start: new Date(),
          finish: new Date(),
          precedes: "8",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 1,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task15",
          objectiveId: "obj2",
          order: 8,
          name: "Attend a conference call meeting with SCE CRE and CBRE to go over comments",
          duration: 2,
          start: new Date(),
          finish: new Date(),
          precedes: "9",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 2,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task16",
          objectiveId: "obj2",
          order: 9,
          name: "Revise plans based on comments provided by SCE CRE and CBRE",
          duration: 5,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 6,
            projectManager: 0,
            designer: 12,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj3",
      order: "C",
      name: "100% DESIGN DEVELOPMENT",
      tasks: [
        {
          id: "task17",
          objectiveId: "obj3",
          order: 1,
          name: "Refine and develop architectural plans",
          duration: 10,
          start: new Date(),
          finish: new Date(),
          precedes: "2",
          staffHours: {
            principal: 0,
            projectArchitect: 20,
            projectManager: 10,
            designer: 30,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task18",
          objectiveId: "obj3",
          order: 2,
          name: "Develop detailed elevations and sections",
          duration: 7,
          start: new Date(),
          finish: new Date(),
          precedes: "3",
          staffHours: {
            principal: 0,
            projectArchitect: 14,
            projectManager: 0,
            designer: 21,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task19",
          objectiveId: "obj3",
          order: 3,
          name: "Prepare preliminary interior design concepts",
          duration: 5,
          start: new Date(),
          finish: new Date(),
          precedes: "4",
          staffHours: {
            principal: 0,
            projectArchitect: 5,
            projectManager: 0,
            designer: 20,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task20",
          objectiveId: "obj3",
          order: 4,
          name: "Coordinate with engineering consultants",
          duration: 8,
          start: new Date(),
          finish: new Date(),
          precedes: "5",
          staffHours: {
            principal: 0,
            projectArchitect: 16,
            projectManager: 16,
            designer: 0,
            drafter: 0,
            consultant: 2000,
          },
        },
        {
          id: "task21",
          objectiveId: "obj3",
          order: 5,
          name: "Develop outline specifications",
          duration: 5,
          start: new Date(),
          finish: new Date(),
          precedes: "6",
          staffHours: {
            principal: 0,
            projectArchitect: 15,
            projectManager: 10,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task22",
          objectiveId: "obj3",
          order: 6,
          name: "Prepare preliminary cost estimate",
          duration: 3,
          start: new Date(),
          finish: new Date(),
          precedes: "7",
          staffHours: {
            principal: 0,
            projectArchitect: 6,
            projectManager: 9,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task23",
          objectiveId: "obj3",
          order: 7,
          name: "Present Design Development package to client",
          duration: 2,
          start: new Date(),
          finish: new Date(),
          precedes: "8",
          staffHours: {
            principal: 4,
            projectArchitect: 4,
            projectManager: 4,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task24",
          objectiveId: "obj3",
          order: 8,
          name: "Incorporate client feedback and finalize Design Development",
          duration: 5,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 10,
            projectManager: 5,
            designer: 15,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj4",
      order: "D",
      name: "100% CONSTRUCTION DOCUMENTS (CDs)",
      tasks: [
        {
          id: "task48",
          objectiveId: "obj4",
          order: 1,
          name: "SUBMIT PLANS TO AUTHORITY HAVING JURISDICTION (AHJ)",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task49",
          objectiveId: "obj4",
          order: 2,
          name: "RESPOND TO INITIAL PLAN CHECK COMMENTS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task50",
          objectiveId: "obj4",
          order: 3,
          name: "RESUBMIT REVISED PLANS TO AHJ",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task51",
          objectiveId: "obj4",
          order: 4,
          name: "OBTAIN FINAL APPROVAL AND PERMITS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj5",
      order: "E",
      name: "PLAN CHECK APPROVAL FROM AHJ",
      tasks: [
        {
          id: "task25",
          objectiveId: "obj5",
          order: 1,
          name: "SUBMIT PLANS TO AUTHORITY HAVING JURISDICTION (AHJ)",
          duration: 1,
          start: new Date(),
          finish: new Date(),
          precedes: "2",
          staffHours: {
            principal: 0,
            projectArchitect: 2,
            projectManager: 4,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task26",
          objectiveId: "obj5",
          order: 2,
          name: "RESPOND TO INITIAL PLAN CHECK COMMENTS",
          duration: 10,
          start: new Date(),
          finish: new Date(),
          precedes: "3",
          staffHours: {
            principal: 0,
            projectArchitect: 16,
            projectManager: 8,
            designer: 12,
            drafter: 8,
            consultant: 0,
          },
        },
        {
          id: "task27",
          objectiveId: "obj5",
          order: 3,
          name: "RESUBMIT REVISED PLANS TO AHJ",
          duration: 1,
          start: new Date(),
          finish: new Date(),
          precedes: "4",
          staffHours: {
            principal: 0,
            projectArchitect: 2,
            projectManager: 4,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task28",
          objectiveId: "obj5",
          order: 4,
          name: "OBTAIN FINAL APPROVAL AND PERMITS",
          duration: 10,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 2,
            projectArchitect: 4,
            projectManager: 8,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj6",
      order: "F",
      name: "BIDDING SUPPORT",
      tasks: [
        {
          id: "task52",
          objectiveId: "obj6",
          order: 1,
          name: "PREPARE BID DOCUMENTS AND SPECIFICATIONS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task53",
          objectiveId: "obj6",
          order: 2,
          name: "ASSIST IN PRE-BID MEETING AND SITE WALK",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task54",
          objectiveId: "obj6",
          order: 3,
          name: "RESPOND TO BIDDER QUESTIONS AND ISSUE ADDENDA",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task55",
          objectiveId: "obj6",
          order: 4,
          name: "REVIEW BIDS AND ASSIST IN CONTRACTOR SELECTION",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj7",
      order: "G",
      name: "CONSTRUCTION ADMINISTRATION",
      tasks: [
        {
          id: "task56",
          objectiveId: "obj7",
          order: 1,
          name: "ATTEND PRE-CONCONSTRUCTION MEETING",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task57",
          objectiveId: "obj7",
          order: 2,
          name: "REVIEW SHOP DRAWINGS AND SUBMITTALS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task58",
          objectiveId: "obj7",
          order: 3,
          name: "CONDUCT PERIODIC SITE VISITS AND ISSUE FIELD REPORTS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task59",
          objectiveId: "obj7",
          order: 4,
          name: "RESPOND TO RFIs AND ISSUE SUPPLEMENTAL INSTRUCTIONS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task60",
          objectiveId: "obj7",
          order: 5,
          name: "REVIEW CHANGE ORDERS AND PAYMENT APPLICATIONS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
    {
      id: "obj8",
      order: "H",
      name: "RECORD DRAWINGS",
      tasks: [
        {
          id: "task61",
          objectiveId: "obj8",
          order: 1,
          name: "COLLECT AS-BUILT DRAWINGS FROM CONTRACTOR",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task62",
          objectiveId: "obj8",
          order: 2,
          name: "REVIEW AND VERIFY AS-BUILT INFORMATION",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task63",
          objectiveId: "obj8",
          order: 3,
          name: "PREPARE FINAL RECORD DRAWINGS",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
        {
          id: "task64",
          objectiveId: "obj8",
          order: 4,
          name: "SUBMIT RECORD DRAWINGS TO CLIENT AND AHJ",
          duration: 0,
          start: new Date(),
          finish: new Date(),
          precedes: "",
          staffHours: {
            principal: 0,
            projectArchitect: 0,
            projectManager: 0,
            designer: 0,
            drafter: 0,
            consultant: 0,
          },
        },
      ],
    },
  ])

  const [staffHours, setStaffHours] = useState<StaffHours>({
    principal: Array(8).fill(0),
    projectArchitect: Array(8).fill(0),
    projectManager: Array(8).fill(0),
    designer: Array(8).fill(0),
    drafter: Array(8).fill(0),
    consultant: Array(8).fill(0),
  })

  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>({
    firmMultiplier: 3,
    staffRoles: {
      principal: { title: "Principal", rate: 250 },
      projectArchitect: { title: "Project Architect", rate: 200 },
      projectManager: { title: "Project Manager", rate: 175 },
      designer: { title: "Designer", rate: 125 },
      drafter: { title: "Drafter", rate: 100 },
    },
  })

  const monthRange = useMemo(() => {
    const startDate = contractSignDate
    const endDate = addDays(startDate, 240) // Show 8 months
    return eachMonthOfInterval({ start: startDate, end: endDate })
  }, [contractSignDate])

  useEffect(() => {
    const totalDuration = objectives.reduce((sum, objective) => {
      return sum + objective.tasks.reduce((taskSum, task) => taskSum + task.duration, 0)
    }, 0)
    setTargetCompletionDate(addDays(contractSignDate, totalDuration))
  }, [objectives, contractSignDate])

  const handleAddObjective = () => {
    const newObjective: Objective = {
      id: `obj${objectives.length + 1}`,
      order: String.fromCharCode(65 + objectives.length), // A, B, C, etc.
      name: "NEW OBJECTIVE",
      tasks: [],
    }
    setObjectives([...objectives, newObjective])
    setStaffHours((prev) => ({
      ...prev,
      principal: [...prev.principal, 0],
      projectArchitect: [...prev.projectArchitect, 0],
      projectManager: [...prev.projectManager, 0],
      designer: [...prev.designer, 0],
      drafter: [...prev.drafter, 0],
      consultant: [...prev.consultant, 0],
    }))
  }

  const handleDeleteObjective = (objectiveId: string) => {
    setObjectives(objectives.filter((obj) => obj.id !== objectiveId))
    setStaffHours((prev) => {
      const index = objectives.findIndex((obj) => obj.id === objectiveId)
      return {
        principal: prev.principal.filter((_, i) => i !== index),
        projectArchitect: prev.projectArchitect.filter((_, i) => i !== index),
        projectManager: prev.projectManager.filter((_, i) => i !== index),
        designer: prev.designer.filter((_, i) => i !== index),
        drafter: prev.drafter.filter((_, i) => i !== index),
        consultant: prev.consultant.filter((_, i) => i !== index),
      }
    })
  }

  const handleAddTask = (objectiveId: string) => {
    const objective = objectives.find((obj) => obj.id === objectiveId)
    if (!objective) return

    const newTask: Task = {
      id: `task${Date.now()}`,
      objectiveId,
      order: objective.tasks.length + 1,
      name: "NEW TASK",
      duration: 1,
      start: new Date(),
      finish: new Date(),
      precedes: "",
      staffHours: {
        principal: 0,
        projectArchitect: 0,
        projectManager: 0,
        designer: 0,
        drafter: 0,
        consultant: 0,
      },
    }

    setObjectives(objectives.map((obj) => (obj.id === objectiveId ? { ...obj, tasks: [...obj.tasks, newTask] } : obj)))
  }

  const handleDeleteTask = (objectiveId: string, taskId: string) => {
    setObjectives(
      objectives.map((obj) =>
        obj.id === objectiveId ? { ...obj, tasks: obj.tasks.filter((task) => task.id !== taskId) } : obj,
      ),
    )
  }

  const handleTaskChange = (objectiveId: string, taskId: string, field: keyof Task, value: any) => {
    setObjectives((prevObjectives) =>
      prevObjectives.map((obj) =>
        obj.id === objectiveId
          ? {
              ...obj,
              tasks: obj.tasks.map((task, index) => {
                if (task.id === taskId) {
                  const updatedTask = { ...task, [field]: value }
                  if (field === "duration") {
                    updatedTask.finish = addDays(updatedTask.start || new Date(), getWorkingDays(updatedTask.start || new Date(), Number(value)))
                  }
                  if (field === "start") {
                    const newStart = isWeekend(value) ? getNextWorkingDay(value) : value
                    updatedTask.start = newStart
                    updatedTask.finish = addDays(newStart, getWorkingDays(newStart, task.duration))
                  }
                  return updatedTask
                }
                if (index > obj.tasks.findIndex((t) => t.id === taskId)) {
                  const previousTask = obj.tasks[index - 1]
                  const newStart = getNextWorkingDay(previousTask.finish || new Date())
                  return {
                    ...task,
                    start: newStart,
                    finish: addDays(newStart, getWorkingDays(newStart, task.duration)),
                  }
                }
                return task
              }),
            }
          : obj
      )
    )
  }

  useEffect(() => {
    // Adjust start dates for all tasks and objectives
    setObjectives((prevObjectives) =>
      prevObjectives.reduce((acc, objective, objectiveIndex) => {
        let objectiveStartDate = contractSignDate;

        // If not the first objective, set start date to the end of the previous objective
        if (objectiveIndex > 0) {
          const previousObjective = acc[objectiveIndex - 1];
          const lastTaskOfPreviousObjective = previousObjective.tasks[previousObjective.tasks.length - 1];
          objectiveStartDate = lastTaskOfPreviousObjective.finish || contractSignDate;
        }

        const updatedTasks = objective.tasks.reduce((taskAcc, task, taskIndex) => {
          let taskStart;
          if (taskIndex === 0) {
            taskStart = isWeekend(objectiveStartDate) ? getNextWorkingDay(objectiveStartDate) : objectiveStartDate;
          } else {
            const previousTask = taskAcc[taskIndex - 1];
            taskStart = getNextWorkingDay(previousTask.finish || objectiveStartDate);
          }

          const updatedTask = {
            ...task,
            start: taskStart,
            finish: addDays(taskStart, getWorkingDays(taskStart, task.duration)),
          };

          return [...taskAcc, updatedTask];
        }, [] as Task[]);

        return [...acc, { ...objective, tasks: updatedTasks }];
      }, [] as Objective[])
    );
  }, [contractSignDate]);

  const calculateTaskStart = (objective: Objective, taskIndex: number): Date => {
    if (taskIndex === 0) {
      return objective.tasks[0].start || new Date()
    }
    const previousTask = objective.tasks[taskIndex - 1]
    return addDays(previousTask.start || new Date(), getWorkingDays(previousTask.start || new Date(), previousTask.duration))
  }

  const handleProjectInfoChange = (field: keyof ProjectInfo, value: string | Date | null) => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }))
  }

  const handleStaffHoursChange = (role: keyof StaffHours, objectiveIndex: number, value: string) => {
    setStaffHours((prev) => ({
      ...prev,
      [role]: prev[role].map((hours, idx) => (idx === objectiveIndex ? Number(value) || 0 : hours)),
    }))
  }

  const staffRoles = {
    principal: { rate: 250, title: "Principal" },
    projectArchitect: { rate: 200, title: "Project Architect" },
    projectManager: { rate: 175, title: "Project Manager" },
    designer: { rate: 125, title: "Designer" },
    drafter: { rate: 100, title: "Drafter" },
    consultant: { rate: 200, title: "Consultant" }, // Base rate before 1.05x multiplier

  }

  const handleTaskStaffHoursChange = (
    objectiveId: string,
    taskId: string,
    role: keyof Task["staffHours"],
    hours: number,
  ) => {
    setObjectives(
      objectives.map((obj) =>
        obj.id === objectiveId
          ? {
              ...obj,
              tasks: obj.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      staffHours: {
                        ...task.staffHours,
                        [role]: hours,
                      },
                    }
                  : task,
              ),
            }
          : obj,
      ),
    )
  }

  const calculateTaskCost = (task: Task) => {
    let cost = 0
    Object.entries(task.staffHours).forEach(([role, hours]) => {
      if (role === "consultant") {
        cost += hours // For consultant, hours represents the dollar amount
      } else {
        const rate = financialSettings.staffRoles[role]?.rate || 0
        cost += hours * rate
      }
    })
    return Math.round(cost / 100) * 100 // Round to nearest hundred
  }

  const calculateObjectiveStaffHours = (objective: Objective, role?: keyof Task["staffHours"]) => {
    if (role) {
      return objective.tasks.reduce((sum, task) => sum + task.staffHours[role], 0)
    }

    const totalHours: { [key: string]: number } = {}
    Object.keys(staffRoles).forEach((role) => {
      totalHours[role] = objective.tasks.reduce(
        (sum, task) => sum + task.staffHours[role as keyof Task["staffHours"]],
        0,
      )
    })
    return totalHours
  }

  const calculateTotalStaffHours = () => {
    const totalHours: { [key: string]: number } = {}
    Object.keys(staffRoles).forEach((role) => {
      totalHours[role] = objectives.reduce((sum, objective) => {
        return sum + (calculateObjectiveStaffHours(objective) as { [key: string]: number })[role]
      }, 0)
    })
    return totalHours
  }

  const calculateObjectiveCost = (objective: Objective) => {
    const staffHours = calculateObjectiveStaffHours(objective)
    let cost = 0
    Object.entries(staffHours).forEach(([role, hours]) => {
      const rate = staffRoles[role as keyof typeof staffRoles].rate
      cost += hours * (role === "consultant" ? rate * 1.05 : rate)
    })
    return Math.round(cost / 100) * 100 // Round to nearest hundred
  }

  const calculateTotalCost = () => {
    const total = objectives.reduce((sum, objective) => sum + calculateObjectiveCost(objective), 0)
    return Math.round(total / 1000) * 1000 // Round to nearest thousand
  }

  const renderTaskIndicators = (date: Date) => {
    // This is a placeholder function. In a real application, you'd check if there are tasks for this day.
    return <div className="task-indicator" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateTotalHours = (objective: Objective) => {
    return Object.values(calculateObjectiveStaffHours(objective)).reduce((sum, hours) => sum + hours, 0);
  };

  const calculateGrandTotalHours = () => {
    return objectives.reduce((sum, objective) => sum + calculateTotalHours(objective), 0);
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignatureDate('');
  };

  const handleSubmitToClient = () => {
    // Placeholder for submit logic
    alert("Proposal submitted to client!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0"> {/* Increased max-width */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onOpenChange(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">New Proposal </h2>
            </div>
          </div>

          <div className="p-4 max-h-[80vh] overflow-y-auto"> {/* Adjusted padding and max-height */}
            <TabsList className="grid w-full grid-cols-4 mb-4"> {/* Reduced margin */}
              <TabsTrigger value="project-info">Project Info</TabsTrigger>
              <TabsTrigger value="scope">Scope of Services</TabsTrigger>
              <TabsTrigger value="design-schedule">Design Schedule</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="project-info">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={projectInfo.projectName}
                      onChange={(e) => handleProjectInfoChange("projectName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={projectInfo.clientName}
                      onChange={(e) => handleProjectInfoChange("clientName", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="projectAddress">Project Address</Label>
                  <Input
                    id="projectAddress"
                    value={projectInfo.projectAddress}
                    onChange={(e) => handleProjectInfoChange("projectAddress", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="projectCity">City</Label>
                    <Input
                      id="projectCity"
                      value={projectInfo.projectCity}
                      onChange={(e) => handleProjectInfoChange("projectCity", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectState">State</Label>
                    <Input
                      id="projectState"
                      value={projectInfo.projectState}
                      onChange={(e) => handleProjectInfoChange("projectState", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectZip">ZIP Code</Label>
                    <Input
                      id="projectZip"
                      value={projectInfo.projectZip}
                      onChange={(e) => handleProjectInfoChange("projectZip", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    value={projectInfo.projectType}
                    onValueChange={(value) => handleProjectInfoChange("projectType", value)}
                  >
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectSize">Project Size (sq ft)</Label>
                  <Input
                    id="projectSize"
                    type="number"
                    value={projectInfo.projectSize}
                    onChange={(e) => handleProjectInfoChange("projectSize", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                  <Input
                    id="estimatedBudget"
                    value={projectInfo.estimatedBudget}
                    onChange={(e) => handleProjectInfoChange("estimatedBudget", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contractSignDate">Contract Sign Date</Label>
                  <Input
                    type="date"
                    value={contractSignDate.toISOString().split('T')[0]}
                    onChange={(e) => setContractSignDate(new Date(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={projectInfo.additionalNotes}
                    onChange={(e) => handleProjectInfoChange("additionalNotes", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </div>

            <TabsContent value="design-schedule">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Timeline</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Contract Sign Date</p>
                        <p className="text-sm text-gray-600">{format(contractSignDate, "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Expected Completion</p>
                        <p className="text-sm text-gray-600">
                          {targetCompletionDate ? format(targetCompletionDate, "MMM d, yyyy") : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Total Duration</p>
                        <p className="text-sm text-gray-600">
                          {targetCompletionDate
                            ? `${differenceInDays(targetCompletionDate, contractSignDate)} days`
                            : "Not calculated"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Color Legend</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {objectives.map((objective, index) => (
                      <div key={objective.id} className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-sm ${colorPalette[index % colorPalette.length]}`}
                        ></div>
                        <span className="text-sm">{objective.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-3 font-semibold border-b">Project Schedule</div>
                <div className="p-4">
                  <ScheduleChart
                    objectives={objectives}
                    contractSignDate={contractSignDate}
                    targetCompletionDate={targetCompletionDate}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Task List</h3>
                {objectives.map((objective) => (
                  <div key={objective.id} className="border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gray-50 p-3 font-medium">{objective.name}</div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Task Name</TableHead>
                          <TableHead className="w-[20%]">Start Date</TableHead>
                          <TableHead className="w-[15%]">Duration</TableHead>
                          <TableHead className="w-[15%]">End Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {objective.tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>{format(task.start || new Date(), "MMM d, yyyy")}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={task.duration}
                                onChange={(e) =>
                                  handleTaskChange(objective.id, task.id, "duration", Number(e.target.value))
                                }
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>{format(task.finish || new Date(), "MMM d, yyyy")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

            <TabsContent value="scope">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-base">Scope of Services</h3>
                  <Button variant="outline" size="sm" onClick={handleAddObjective}>
                    + Add Objective
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mb-2">Click on objective or task text to edit.</p>
                <div className="grid grid-cols-1 gap-4">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="border rounded-md p-2">
                      <div className="flex items-center justify-between bg-blue-50 p-1 rounded mb-2">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          className="font-medium outline-none text-sm"
                          onBlur={(e) => {
                            const newName = e.currentTarget.textContent
                            if (newName) {
                              setObjectives((prevObjectives) =>
                                prevObjectives.map((obj) =>
                                  obj.id === objective.id ? { ...obj, name: newName } : obj,
                                ),
                              )
                            }
                          }}
                        >
                          {objective.name}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteObjective(objective.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-1 text-center">#</th>
                            <th className="p-1 text-left">Task</th>
                            <th className="p-1 text-center">Start Date</th>
                            <th className="p-1 text-center">Duration</th>
                            {Object.entries(financialSettings.staffRoles).map(([role, { title }]) => (
                              <th key={role} className="p-1 text-center">
                                {title}
                              </th>
                            ))}
                            <th className="p-1 text-center">Consultant ($)</th>
                            <th className="p-1 text-center">Total</th>
                            <th className="p-1 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {objective.tasks.map((task, index) => (
                            <tr key={task.id} className="border-b">
                              <td className="p-1 text-center">{index + 1}</td>
                              <td className="p-1">
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  className="block w-full outline-none"
                                  onBlur={(e) => {
                                    const newName = e.currentTarget.textContent
                                    if (newName) {
                                      const capitalizedName = capitalizeWords(newName)
                                      handleTaskChange(objective.id, task.id, "name", capitalizedName)
                                      e.currentTarget.textContent = capitalizedName
                                    }
                                  }}
                                >
                                  {capitalizeWords(task.name)}
                                </span>
                              </td>
                              <td className="p-1">
                                <Input
                                  type="date"
                                  value={(task.start || new Date()).toISOString().split('T')[0]}
                                  onChange={(date) => handleTaskChange(objective.id, task.id, "start", new Date(date.target.value))}
                                  className="w-full text-xs p-1 border rounded"
                                />
                              </td>
                              <td className="p-1">
                                <Input
                                  type="number"
                                  value={task.duration || ""}
                                  onChange={(e) =>
                                    handleTaskChange(objective.id, task.id, "duration", Number(e.target.value) || 0)
                                  }
                                  className="w-full text-xs p-1"
                                />
                              </td>
                              {Object.keys(task.staffHours).map((role) => (
                                <td key={role} className="p-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={task.staffHours[role as keyof typeof task.staffHours]}
                                    onChange={(e) =>
                                      handleTaskStaffHoursChange(
                                        objective.id,
                                        task.id,
                                        role as keyof typeof task.staffHours,
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-full text-xs p-1"
                                  />
                                </td>
                              ))}
                              <td className="p-1 text-right font-medium">
                                ${calculateTaskCost(task).toLocaleString()}
                              </td>
                              <td className="p-1 text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(objective.id, task.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium bg-muted/50">
                            <td colSpan={4} className="p-1">
                              Objective Total
                            </td>
                            {Object.keys(staffRoles).map((role) => {
                              const value = calculateObjectiveStaffHours(objective, role as keyof Task["staffHours"]);
                              return (
                                <td key={role} className="p-1 text-center">
                                  {typeof value === "number" ? value : ""}
                                </td>
                              );
                            })}
                            <td className="p-1 text-right">${calculateObjectiveCost(objective).toLocaleString()}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                      <Button variant="outline" size="sm" onClick={() => handleAddTask(objective.id)} className="mt-2">
                        + Add Task
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border rounded-lg mt-4">
                  <div className="bg-gray-50 p-2 border-b">
                    <h3 className="font-semibold text-sm">Staff Hours Calculator</h3>
                  </div>
                  <div className="p-2 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="text-left p-1 bg-gray-50">Objective</th>
                          {Object.entries(staffRoles).map(([role, { title }]) => (
                            <th key={role} className="p-1 bg-gray-50">
                              {title}
                              <br />
                              {role === "consultant"
                                ? "($)"
                                : `($${staffRoles[role as keyof typeof staffRoles].rate}/hr)`}
                            </th>
                          ))}
                          <th className="p-1 bg-gray-50">Total Hours</th>
                          <th className="p-1 bg-gray-50">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {objectives.map((objective) => {
                          const staffHours = calculateObjectiveStaffHours(objective)
                          const totalHours = Object.values(staffHours).reduce((sum, hours) => sum + hours, 0)
                          const totalCost = calculateObjectiveCost(objective)
                          return (
                            <tr key={objective.id} className="border-t">
                              <td className="p-1">{objective.name}</td>
                              {Object.keys(staffRoles).map((role) => (
                                <td key={role} className="p-1 text-center">
                                  {(staffHours as { [key: string]: number })[role]}
                                </td>
                              ))}
                              <td className="p-1 text-center">{totalHours}</td>
                              <td className="p-1 text-right font-medium">${totalCost.toLocaleString()}</td>
                            </tr>
                          )
                        })}
                        <tr className="border-t font-medium">
                          <td className="p-1">TOTAL</td>
                          {Object.keys(staffRoles).map((role) => (
                            <td key={role} className="p-1 text-center">
                              {calculateTotalStaffHours()[role]}
                            </td>
                          ))}
                          <td className="p-1 text-center">
                            {Object.values(calculateTotalStaffHours()).reduce((sum, hours) => sum + hours, 0)}
                          </td>
                          <td className="p-1 text-right">${calculateTotalCost().toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review">
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                  <h1 className="text-3xl font-bold text-center">Project Proposal</h1>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold">Client:</p>
                      <p>{projectInfo.clientName}</p>
                      <p>{projectInfo.projectAddress}</p>
                      <p>{projectInfo.projectCity}, {projectInfo.projectState} {projectInfo.projectZip}</p>
                                                            </div>
                    <div className="text-right">
                      <p className="font-semibold">Date:</p>
                      <p>{format(new Date(), "MMMM d, yyyy")}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Project: {projectInfo.projectName}</h2>
                    <p className="mt-2">
                      We are pleased to submit this proposal for architectural services for your project. Based on our understanding of the project
                      requirements and our initial discussions, we propose the following scope of services:
                    </p>
                  </div>

                  {objectives.map((objective, index) => (
                    <div key={objective.id} className="space-y-2">
                      <h3 className="text-lg font-semibold">{index + 1}. {objective.name}</h3>
                      <ul className="list-disc pl-6">
                        {objective.tasks.map(task => (
                          <li key={task.id}>{task.name}</li>
                        ))}
                      </ul>
                      <p className="text-sm">
                        Total Hours: {calculateTotalHours(objective)} Hours<br />
                        Estimated Cost: ${calculateObjectiveCost(objective).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
                    <p>Grand Total:</p>
                    <p>Hours: {calculateGrandTotalHours()} Hours</p>
                    <p>Estimated Cost: ${calculateTotalCost().toLocaleString()}</p>
                  </div>

                  <p className="text-sm">
                    Our fee for these services is based on the estimated hours and rates provided above. This fee is subject to adjustment if the scope of the
                    project changes significantly or if additional services are required.
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Terms and Conditions</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-sm">
                      <li>Scope of Services: The Architect shall provide the services as outlined in this proposal. Any additional services requested by the Owner shall be compensated separately.</li>
                      <li>Standard of Care: The Architect shall perform its services consistent with the professional skill and care ordinarily provided by architects practicing in the same or similar locality under the same or similar circumstances.</li>
                      <li>Owner's Responsibilities: The Owner shall provide full information regarding requirements for the Project and shall establish and update an overall budget for the Project, including reasonable contingencies.</li>
                      <li>Use of Documents: The Architect's Instruments of Service are for use solely with respect to this Project. The Owner shall not use the Instruments of Service for future additions or alterations to this Project or for other projects, unless the Owner obtains the prior written agreement of the Architect.</li>
                      <li>Mediation: Any claim, dispute or other matter arising out of or related to this Agreement shall be subject to mediation as a condition precedent to binding dispute resolution.</li>
                      <li>Termination: This Agreement may be terminated by either party upon not less than seven days' written notice should the other party fail substantially to perform in accordance with the terms of this Agreement.</li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <p>If this proposal meets with your approval, please sign below to indicate your acceptance and return a copy to us. We look forward to working with you on this project.</p>
                    <p className="font-semibold">Sincerely,</p>
                    <p>[Your Name]</p>
                    <p>[Your Title]</p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <p className="font-semibold mb-4">Accepted By:</p>
                    <div className="flex flex-col space-y-4">
                      <div>
                        <Label htmlFor="clientSignature">Client Signature</Label>
                        <SignatureCanvas
                          ref={signatureRef}
                          canvasProps={{
                            width: 500,
                            height: 200,
                            className: 'border rounded-md'
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <Button onClick={clearSignature} variant="outline">Clear Signature</Button>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="signatureDate">Date:</Label>
                          <Input
                            type="date"
                            id="signatureDate"
                            value={signatureDate}
                            onChange={(e) => setSignatureDate(e.target.value)}
                            className="w-40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
                    <Button onClick={handleSubmitToClient}>Send Proposal to Client</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

export default NewProposalDialog;
