"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import {
  format,
  addDays,
  differenceInDays,
  eachWeekOfInterval,
  isWeekend,
  isSameDay,
  eachDayOfInterval,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const capitalizeWords = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

interface Task {
  id: string;
  objectiveId: string;
  order: string | number;
  name: string;
  duration: number;
  start: Date | null;
  finish: Date | null;
  precedes: string;
  staffHours: {
    principal: number;
    projectArchitect: number;
    projectManager: number;
    designer: number;
    drafter: number;
    consultant: number;
  };
}

interface Objective {
  id: string;
  order: string;
  name: string;
  tasks: Task[];
}

interface ProjectInfo {
  projectName: string;
  clientName: string;
  projectAddress: string;
  projectCity: string;
  projectState: string;
  projectZip: string;
  projectType: string;
  projectSize: string;
  estimatedBudget: string;
  additionalNotes: string;
  email?: string;
  phone?: string;
  projectDescription?: string;
}

interface StaffHours {
  principal: number[];
  projectArchitect: number[];
  projectManager: number[];
  designer: number[];
  drafter: number[];
  consultant: number[];
}

interface StaffRole {
  title: string;
  rate: number;
}

interface FinancialSettings {
  firmMultiplier: number;
  staffRoles: {
    [key: string]: StaffRole;
  };
}

// Add this function to check for holidays (you can expand this list as needed)
const isHoliday = (date: Date) => {
  const holidays = [
    new Date(date.getFullYear(), 0, 1), // New Year's Day
    new Date(date.getFullYear(), 6, 4), // Independence Day
    new Date(date.getFullYear(), 11, 25), // Christmas Day
    // Add more holidays as needed
  ];
  return holidays.some((holiday) => isSameDay(date, holiday));
};

// Add this function to get the next working day
const getNextWorkingDay = (date: Date): Date => {
  let nextDay = addDays(date, 1);
  while (isWeekend(nextDay) || isHoliday(nextDay)) {
    nextDay = addDays(nextDay, 1);
  }
  return nextDay;
};

// Modify the getWorkingDays function
const getWorkingDays = (start: Date, duration: number) => {
  let workingDays = 0;
  let currentDate = start;
  while (workingDays < duration) {
    if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
      workingDays++;
    }
    currentDate = addDays(currentDate, 1);
  }
  return differenceInDays(currentDate, start);
};

const colorPalette = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const ScheduleChart = ({
  objectives,
  contractSignDate,
  targetCompletionDate,
}) => {
  const [hoveredTask, setHoveredTask] = useState(null);

  const startDate = contractSignDate;
  const endDate = targetCompletionDate || addDays(startDate, 365);
  const totalDays = differenceInDays(endDate, startDate);
  const dayWidth = 20;
  const weekWidth = dayWidth * 7;
  const chartWidth = totalDays * dayWidth;
  const rowHeight = 30;
  const fixedWidth = 1000; // Fixed width for the visible part of the chart

  const weeks = eachWeekOfInterval({ start: startDate, end: endDate });

  const getTaskOffset = (taskStart: Date) => {
    return differenceInDays(taskStart, startDate) * dayWidth;
  };

  const getTaskWidth = (task: Task) => {
    let width = 0;
    let remainingDuration = task.duration;
    let currentDate = task.start || startDate;

    while (remainingDuration > 0) {
      if (!isWeekend(currentDate)) {
        width += dayWidth;
        remainingDuration--;
      }
      currentDate = addDays(currentDate, 1);
    }

    return width;
  };

  const getWeekLabel = (date: Date) => {
    return format(date, "MMM d");
  };

  const getDayLabel = (date: Date) => {
    return format(date, "EEEEE");
  };

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div
        style={{ width: `${fixedWidth}px` }}
        className="relative overflow-x-auto"
      >
        <div style={{ width: `${chartWidth + 150}px` }} className="relative">
          {/* Week headers */}
          <div className="flex border-b sticky top-0 bg-white z-10 text-xs">
            <div className="w-[150px] flex-shrink-0 font-medium border-r px-2 py-1 bg-gray-50">
              Task
            </div>
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
            {eachDayOfInterval({ start: startDate, end: endDate }).map(
              (day) => (
                <div
                  key={day.getTime()}
                  className="flex-shrink-0 font-medium border-r text-center py-1"
                  style={{ width: `${dayWidth}px` }}
                >
                  {getDayLabel(day)}
                </div>
              )
            )}
          </div>

          {/* Tasks */}
          <div
            className="relative"
            style={{
              height: `${
                objectives.reduce((acc, obj) => acc + obj.tasks.length, 0) *
                rowHeight
              }px`,
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
                  const taskStart = task.start || startDate;
                  const taskOffset = getTaskOffset(taskStart);
                  const taskWidth = getTaskWidth(task);

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
                            <p>
                              End:{" "}
                              {format(
                                addDays(taskStart, task.duration),
                                "MMM d, yyyy"
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  );
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
  );
};

export interface NewProposalPageProps {
  projectData?: any;
  onProposalCreated?: (proposalData: any) => void;
}

export default function NewProposalPage({
  projectData,
  onProposalCreated,
}: NewProposalPageProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<
    "client" | "project" | "services" | "sign"
  >("client");
  const [progress, setProgress] = useState(0);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const clientSignatureRef = useRef<SignatureCanvas | null>(null);
  const architectSignatureRef = useRef<SignatureCanvas | null>(null);

  // Form state
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    additionalNotes: "",
  });

  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    projectDescription: "",
    additionalContext: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    sameAsMailingAddress: false,
    serviceType: "New Construction",
    projectType: "",
    squareFootage: "",
    budgetRange: "",
    timeline: "",
    googleDriveLink: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("lumpSum");
  const [totalCost, setTotalCost] = useState(0);
  const [totalWeeks, setTotalWeeks] = useState(0);

  const [objectiveCosts, setObjectiveCosts] = useState<Record<string, number>>({
    assemble: 0,
    schematic: 0,
    development: 0,
    construction: 0,
    approval: 0,
    bidding: 0,
    "construction-support": 0,
    record: 0,
  });

  const [objectiveTimelines, setObjectiveTimelines] = useState<
    Record<string, number>
  >({
    assemble: 0,
    schematic: 0,
    development: 0,
    construction: 0,
    approval: 0,
    bidding: 0,
    "construction-support": 0,
    record: 0,
  });

  const objectives = [
    { id: "assemble", label: "Assemble Information" },
    { id: "schematic", label: "Schematic Design" },
    { id: "development", label: "Design Development" },
    { id: "construction", label: "Construction Documents" },
    { id: "approval", label: "AHJ Approval" },
    { id: "bidding", label: "Bidding Support" },
    { id: "construction-support", label: "Construction Support" },
    { id: "record", label: "Record Drawings" },
  ];

  interface Credit {
    id: string;
    type: "dollar" | "percentage";
    amount: number;
    description: string;
  }

  // Add this to the component state declarations
  const [credits, setCredits] = useState<Credit[]>([]);
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [newCredit, setNewCredit] = useState<Omit<Credit, "id">>({
    type: "dollar",
    amount: 0,
    description: "",
  });

  const handleClientInfoChange = (field: string, value: string) => {
    setClientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleProjectInfoChange = (field: string, value: string | boolean) => {
    setProjectInfo((prev) => ({ ...prev, [field]: value }));
  };

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives((prev) => {
      const isSelected = prev.includes(objectiveId);
      const newSelected = isSelected
        ? prev.filter((id) => id !== objectiveId)
        : [...prev, objectiveId];

      // Calculate new totals
      const newTotalCost = newSelected.reduce(
        (sum, id) => sum + objectiveCosts[id],
        0
      );
      const newTotalWeeks = newSelected.reduce(
        (sum, id) => sum + objectiveTimelines[id],
        0
      );

      setTotalCost(newTotalCost);
      setTotalWeeks(newTotalWeeks);

      return newSelected;
    });
  };

  const handleCostChange = (id: string, value: string) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);
    setObjectiveCosts((prev) => {
      const newCosts = { ...prev, [id]: numValue };

      // Recalculate total cost
      const newTotalCost = selectedObjectives.reduce(
        (sum, objId) => sum + newCosts[objId],
        0
      );
      setTotalCost(newTotalCost);

      return newCosts;
    });
  };

  const handleTimelineChange = (id: string, value: string) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10);
    setObjectiveTimelines((prev) => {
      const newTimelines = { ...prev, [id]: numValue };

      // Recalculate total timeline
      const newTotalWeeks = selectedObjectives.reduce(
        (sum, objId) => sum + newTimelines[objId],
        0
      );
      setTotalWeeks(newTotalWeeks);

      return newTimelines;
    });
  };

  const handleNext = () => {
    if (activeStep === "client") {
      setActiveStep("project");
      setProgress(33);
    } else if (activeStep === "project") {
      setActiveStep("services");
      setProgress(66);
    } else if (activeStep === "services") {
      setActiveStep("sign");
      setProgress(100);
    }
  };

  const handleBack = () => {
    if (activeStep === "project") {
      setActiveStep("client");
      setProgress(0);
    } else if (activeStep === "services") {
      setActiveStep("project");
      setProgress(33);
    } else if (activeStep === "sign") {
      setActiveStep("services");
      setProgress(66);
    }
  };

  const handleSubmit = () => {
    // Prepare proposal data
    const proposalData = {
      clientInfo,
      projectInfo,
      selectedObjectives,
      paymentMethod,
      clientSignature: clientSignatureRef.current?.toDataURL(),
      architectSignature: architectSignatureRef.current?.toDataURL(),
      createdAt: new Date().toISOString(),
    };

    // Call the callback if provided
    if (onProposalCreated) {
      onProposalCreated(proposalData);
    } else {
      // Default behavior - go back to dashboard
      router.push("/studio");
    }
  };

  const clearSignature = (
    ref: React.MutableRefObject<SignatureCanvas | null>
  ) => {
    ref.current?.clear();
  };

  const calculateTotalCost = () => {
    return `${totalCost.toLocaleString()}`;
  };

  const calculateTotalCredits = () => {
    return credits.reduce((total, credit) => {
      if (credit.type === "dollar") {
        return total + credit.amount;
      } else {
        // For percentage, calculate the amount based on the total cost
        return total + (totalCost * credit.amount) / 100;
      }
    }, 0);
  };

  const finalCost = totalCost - calculateTotalCredits();
  const [signature, setSignature] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/studio" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-semibold">New Proposal</h1>
        </div>
      </header>

      {/* Progress Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant={activeStep === "client" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveStep("client")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Proposal Details hhhhhhhhhhhh
              </Button>
              <Button
                variant={activeStep === "services" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveStep("services")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Scope of Services
              </Button>
              <Button
                variant={activeStep === "sign" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveStep("sign")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Review
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Proposal Journey</span>
            <span className="text-sm text-gray-500">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <div
              className={`flex flex-col items-center ${
                activeStep === "client" ? "text-blue-600" : ""
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  activeStep === "client" ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
              <span className="text-xs mt-1">Client</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                activeStep === "project" ? "text-blue-600" : ""
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  activeStep === "project"
                    ? "bg-blue-600"
                    : progress >= 33
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="text-xs mt-1">Project</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                activeStep === "services" ? "text-blue-600" : ""
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  activeStep === "services"
                    ? "bg-blue-600"
                    : progress >= 66
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="text-xs mt-1">Services</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                activeStep === "sign" ? "text-blue-600" : ""
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  activeStep === "sign"
                    ? "bg-blue-600"
                    : progress >= 100
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>
              <span className="text-xs mt-1">Sign</span>
            </div>
          </div>
        </div>

        {/* Client Information Step */}
        {activeStep === "client" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6 border-l-4 border-blue-600 pl-3">
              Client Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={clientInfo.firstName}
                  onChange={(e) =>
                    handleClientInfoChange("firstName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={clientInfo.lastName}
                  onChange={(e) =>
                    handleClientInfoChange("lastName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="companyName">Company Name (optional)</Label>
              <Input
                id="companyName"
                value={clientInfo.companyName}
                onChange={(e) =>
                  handleClientInfoChange("companyName", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) =>
                    handleClientInfoChange("email", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientInfo.phone}
                  onChange={(e) =>
                    handleClientInfoChange("phone", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="country">Country</Label>
              <Select
                value={clientInfo.country}
                onValueChange={(value) =>
                  handleClientInfoChange("country", value)
                }
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <Label htmlFor="address">State Address</Label>
              <Input
                id="address"
                value={clientInfo.address}
                onChange={(e) =>
                  handleClientInfoChange("address", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={clientInfo.city}
                  onChange={(e) =>
                    handleClientInfoChange("city", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={clientInfo.state}
                  onValueChange={(value) =>
                    handleClientInfoChange("state", value)
                  }
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zip">ZIP</Label>
                <Input
                  id="zip"
                  value={clientInfo.zip}
                  onChange={(e) =>
                    handleClientInfoChange("zip", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                rows={4}
                value={clientInfo.additionalNotes}
                onChange={(e) =>
                  handleClientInfoChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional information about the client or special requirements"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext}>Continue to Project</Button>
            </div>
          </div>
        )}

        {/* Project Information Step */}
        {activeStep === "project" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6 border-l-4 border-blue-600 pl-3">
              Project Information
            </h2>

            <div className="mb-6">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectInfo.projectName}
                onChange={(e) =>
                  handleProjectInfoChange("projectName", e.target.value)
                }
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="projectDescription">Project Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Describe the project scope, purpose, and goals"
                rows={4}
                value={projectInfo.projectDescription}
                onChange={(e) =>
                  handleProjectInfoChange("projectDescription", e.target.value)
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                This description will appear in the Project Understanding
                section
              </p>
            </div>

            <div className="mb-6">
              <Label htmlFor="additionalContext">
                Additional Project Context
              </Label>
              <Textarea
                id="additionalContext"
                placeholder="Describe additional context or specific requests from the client"
                rows={4}
                value={projectInfo.additionalContext}
                onChange={(e) =>
                  handleProjectInfoChange("additionalContext", e.target.value)
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear as additional context in the Project
                Understanding
              </p>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="projectLocation">Project Location</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsMailingAddress"
                    checked={projectInfo.sameAsMailingAddress}
                    onCheckedChange={(checked) =>
                      handleProjectInfoChange(
                        "sameAsMailingAddress",
                        checked === true
                      )
                    }
                  />
                  <label
                    htmlFor="sameAsMailingAddress"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Same as mailing address
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={projectInfo.streetAddress}
                  onChange={(e) =>
                    handleProjectInfoChange("streetAddress", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <Label htmlFor="projectCity">City</Label>
                  <Input
                    id="projectCity"
                    value={projectInfo.city}
                    onChange={(e) =>
                      handleProjectInfoChange("city", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="projectState">State</Label>
                  <Select
                    value={projectInfo.state}
                    onValueChange={(value) =>
                      handleProjectInfoChange("state", value)
                    }
                  >
                    <SelectTrigger id="projectState">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      {/* Add more states as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectZip">ZIP</Label>
                  <Input
                    id="projectZip"
                    value={projectInfo.zip}
                    onChange={(e) =>
                      handleProjectInfoChange("zip", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="projectCountry">Country</Label>
              <Select
                value={projectInfo.country}
                onValueChange={(value) =>
                  handleProjectInfoChange("country", value)
                }
              >
                <SelectTrigger id="projectCountry">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <h3 className="font-medium text-lg mb-4">Project Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={projectInfo.serviceType}
                  onValueChange={(value) =>
                    handleProjectInfoChange("serviceType", value)
                  }
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Construction">
                      New Construction
                    </SelectItem>
                    <SelectItem value="Renovation">Renovation</SelectItem>
                    <SelectItem value="Addition">Addition</SelectItem>
                    <SelectItem value="Interior Design">
                      Interior Design
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  value={projectInfo.projectType}
                  onValueChange={(value) =>
                    handleProjectInfoChange("projectType", value)
                  }
                >
                  <SelectTrigger id="projectType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                    <SelectItem value="Institutional">Institutional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={projectInfo.squareFootage}
                  onChange={(e) =>
                    handleProjectInfoChange("squareFootage", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="budgetRange">Budget Range</Label>
                <Select
                  value={projectInfo.budgetRange}
                  onValueChange={(value) =>
                    handleProjectInfoChange("budgetRange", value)
                  }
                >
                  <SelectTrigger id="budgetRange">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $100k">Under $100k</SelectItem>
                    <SelectItem value="$100k-$250k">$100k-$250k</SelectItem>
                    <SelectItem value="$250k-$500k">$250k-$500k</SelectItem>
                    <SelectItem value="$500k-$1M">$500k-$1M</SelectItem>
                    <SelectItem value="Over $1M">Over $1M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeline">Expected Timeline</Label>
                <Select
                  value={projectInfo.timeline}
                  onValueChange={(value) =>
                    handleProjectInfoChange("timeline", value)
                  }
                >
                  <SelectTrigger id="timeline">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under 6 months">
                      Under 6 months
                    </SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="1-2 years">1-2 years</SelectItem>
                    <SelectItem value="Over 2 years">Over 2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Continue to Services</Button>
            </div>
          </div>
        )}

        {/* Services Step */}
        {activeStep === "services" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3">
                Scope of Services
              </h2>
              <div className="flex items-center">
                {/* <Button variant="outline" size="sm" onClick={() => {}}>
                  + Add Objective
                </Button> */}
                <span className="ml-4 text-sm text-gray-500">
                  Selected: {selectedObjectives.length} / 8
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {objectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="mb-4 border rounded-md overflow-hidden"
                  >
                    <div className="flex items-center p-3 bg-gray-50">
                      <Checkbox
                        id={objective.id}
                        checked={selectedObjectives.includes(objective.id)}
                        onCheckedChange={() => toggleObjective(objective.id)}
                        className="mr-3"
                      />
                      <label
                        htmlFor={objective.id}
                        className="font-medium cursor-pointer flex-grow"
                      >
                        {objective.label}
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-1">$</span>
                          <Input
                            type="number"
                            min="0"
                            value={objectiveCosts[objective.id].toString()}
                            onChange={(e) =>
                              handleCostChange(objective.id, e.target.value)
                            }
                            className="w-24 h-8 text-sm"
                            placeholder="Cost"
                          />
                        </div>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            min="0"
                            value={objectiveTimelines[objective.id].toString()}
                            onChange={(e) =>
                              handleTimelineChange(objective.id, e.target.value)
                            }
                            className="w-16 h-8 text-sm"
                            placeholder="Weeks"
                          />
                          <span className="text-sm text-gray-500 ml-1">
                            wks
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedObjectives.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-md bg-gray-50">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No services selected
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Please select the services you'd like to include in your
                      proposal.
                    </p>
                    <Button variant="outline" size="sm">
                      Add Objective
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <div className="border rounded-md p-4 mb-4">
                  <h3 className="font-medium text-lg mb-4 border-l-4 border-amber-500 pl-2">
                    Project Summary
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Active Objectives:
                    </p>
                    <p className="font-medium">
                      {selectedObjectives.length} / 8
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Services</p>
                      <p className="font-medium">{selectedObjectives.length}</p>
                      <p className="text-xs text-gray-500">objectives</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cost</p>
                      <p className="font-medium">
                        ${totalCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Timeline</p>
                      <p className="font-medium">{totalWeeks}</p>
                      <p className="text-xs text-gray-500">weeks</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Credits</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddCredit(!showAddCredit)}
                      >
                        + Add Credit
                      </Button>
                    </div>

                    {credits.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {credits.map((credit) => (
                          <div
                            key={credit.id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {credit.description || "Credit"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {credit.type === "dollar"
                                  ? `${credit.amount.toLocaleString()}`
                                  : `${credit.amount}%`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setCredits(
                                  credits.filter((c) => c.id !== credit.id)
                                )
                              }
                            >
                              <span className="text-red-500">×</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddCredit && (
                      <div className="border p-3 rounded-md mb-3">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <Label htmlFor="creditType" className="text-xs">
                              Type
                            </Label>
                            <Select
                              value={newCredit.type}
                              onValueChange={(value) =>
                                setNewCredit({
                                  ...newCredit,
                                  type: value as "dollar" | "percentage",
                                })
                              }
                            >
                              <SelectTrigger
                                id="creditType"
                                className="h-8 text-sm"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dollar">
                                  Dollar Amount
                                </SelectItem>
                                <SelectItem value="percentage">
                                  Percentage
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="creditAmount" className="text-xs">
                              Amount
                            </Label>
                            <div className="flex items-center">
                              {newCredit.type === "dollar" && (
                                <span className="text-sm mr-1">$</span>
                              )}
                              <Input
                                id="creditAmount"
                                type="number"
                                min="0"
                                value={newCredit.amount.toString()}
                                onChange={(e) =>
                                  setNewCredit({
                                    ...newCredit,
                                    amount: Number(e.target.value),
                                  })
                                }
                                className="h-8 text-sm"
                              />
                              {newCredit.type === "percentage" && (
                                <span className="text-sm ml-1">%</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <Label
                            htmlFor="creditDescription"
                            className="text-xs"
                          >
                            Description
                          </Label>
                          <Input
                            id="creditDescription"
                            value={newCredit.description}
                            onChange={(e) =>
                              setNewCredit({
                                ...newCredit,
                                description: e.target.value,
                              })
                            }
                            className="h-8 text-sm"
                            placeholder="Early payment discount, etc."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddCredit(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setCredits([
                                ...credits,
                                { ...newCredit, id: Date.now().toString() },
                              ]);
                              setNewCredit({
                                type: "dollar",
                                amount: 0,
                                description: "",
                              });
                              setShowAddCredit(false);
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}

                    {credits.length > 0 && (
                      <div className="text-sm text-gray-500">
                        Total Credits: $
                        {calculateTotalCredits().toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Final Cost</p>
                    <p className="text-xl font-medium text-green-600">
                      ${finalCost.toLocaleString()}
                    </p>
                    {credits.length > 0 ? (
                      <p className="text-xs text-gray-500">
                        After ${calculateTotalCredits().toLocaleString()} in
                        credits
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No credits applied
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Payment Method</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="lumpSum"
                          name="paymentMethod"
                          value="lumpSum"
                          checked={paymentMethod === "lumpSum"}
                          onChange={() => setPaymentMethod("lumpSum")}
                          className="mr-2"
                        />
                        <label htmlFor="lumpSum" className="text-sm">
                          Lump Sum Payment
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="installments"
                          name="paymentMethod"
                          value="installments"
                          checked={paymentMethod === "installments"}
                          onChange={() => setPaymentMethod("installments")}
                          className="mr-2"
                        />
                        <label htmlFor="installments" className="text-sm">
                          Installment Payments (per objective)
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Client will pay the full amount upfront
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={handleNext}>
                  Continue to Review
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Sign Step */}
        {activeStep === "sign" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Architecture Simple</h2>
                <p className="text-gray-600">Professional Services Proposal</p>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="font-medium">Client Name</p>
                    <p>
                      {clientInfo.firstName} {clientInfo.lastName}
                    </p>
                    <p>{projectInfo.streetAddress}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Date:</p>
                    <p>{new Date().toLocaleDateString()}</p>
                    <p>File No. 25-0001</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Subject:</h3>
                <p>Professional Services Proposal</p>
                <p>
                  {clientInfo.firstName} {clientInfo.lastName} -{" "}
                  {projectInfo.streetAddress}
                </p>
              </div>

              <div className="mb-8">
                <p className="mb-4">Dear Client,</p>
                <p className="mb-4">
                  Architecture Simple is pleased to present this design services
                  proposal for the proposed {projectInfo.serviceType} of a
                  {projectInfo.projectDescription
                    ? ` (${projectInfo.projectDescription})`
                    : ""}{" "}
                  at {projectInfo.streetAddress}.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Project Understanding
                </h3>
                <p className="mb-4">
                  The project is located in {projectInfo.city},{" "}
                  {projectInfo.state}.
                </p>
                {projectInfo.projectDescription && (
                  <p className="mb-4">{projectInfo.projectDescription}</p>
                )}
                {projectInfo.additionalContext && (
                  <p className="mb-4">{projectInfo.additionalContext}</p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Article 1 - Definitions
                </h3>
                <p className="mb-4">
                  To establish a clear understanding, the following terms are
                  defined for use throughout this Agreement:
                </p>
                <p className="mb-2">
                  <strong>"Architect"</strong> refers to Architecture Simple,
                  represented by Eric Rivera, AIA, who will provide professional
                  architectural services as detailed in this Agreement.
                </p>
                <p className="mb-2">
                  <strong>"Owner"</strong> refers to Client's Name, the
                  individual or entity who is entering into this Agreement with
                  the Architect to develop the Project.
                </p>
                <p className="mb-2">
                  <strong>"Project"</strong> refers to the construction of a
                  residential building at Project Address, City, State ZIP Code,
                  as more specifically described in the Proposal attached
                  hereto.
                </p>
                <p className="mb-2">
                  <strong>"Work"</strong> refers to all architectural,
                  engineering, and related professional services required for
                  the design, development, and documentation of the Project, as
                  set forth in the Scope of Services.
                </p>
                <p className="mb-2">
                  <strong>"Design Documents" (DDs)</strong> refers to the
                  completed Schematic Design and Design Development documents,
                  including all drawings, specifications, and other materials
                  prepared by the Architect as part of the development of the
                  Project.
                </p>
                <p className="mb-2">
                  <strong>"Construction Documents" (CDs)</strong> refers to the
                  completed set of final documents that provide the necessary
                  details for construction and permitting, including plans,
                  specifications, and other materials, prepared by the
                  Architect.
                </p>
                <p className="mb-2">
                  <strong>"Bidding Documents"</strong> refers to the final,
                  completed <strong>"Bidding Documents"</strong> refers to the
                  final, completed Construction Documents and any related
                  documents issued to contractors or bidders.
                </p>
                <p className="mb-2">
                  <strong>"Substantial Completion"</strong> means the point in
                  time when the Project is sufficiently complete in accordance
                  with the Contract Documents, allowing the Owner to occupy or
                  utilize the building for its intended use.
                </p>
                <p className="mb-2">
                  <strong>"Completion"</strong> refers to the final completion
                  of all construction work, including punch list items and final
                  inspections, after which the Project is fully delivered to the
                  Owner.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Article 2 - Scope of Services
                </h3>
                <p className="mb-4">
                  The Architect agrees to provide the following services for the
                  Project as outlined in the Proposal, which is incorporated
                  herein by reference.
                </p>
                {selectedObjectives.length > 0 ? (
                  <ul className="list-disc pl-6 mb-4">
                    {selectedObjectives.map((id) => {
                      const objective = objectives.find((o) => o.id === id);
                      return objective ? (
                        <li key={id} className="mb-2">
                          {objective.label}
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : (
                  <p className="italic text-gray-500">
                    No services have been selected.
                  </p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Article 3 - Payment Terms
                </h3>
                <h4 className="font-medium mb-2">3.1 Payment Structure</h4>
                <p className="mb-4">
                  The total fee for the services provided under this Agreement
                  shall be (
                  {paymentMethod === "lumpSum"
                    ? "lump sum"
                    : "installments upon task completion"}
                  ) for the amount of ${totalCost.toLocaleString()}, as follows:
                </p>

                <table className="w-full mb-4 border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">
                        PROFESSIONAL SERVICES FEE
                      </th>
                      <th className="border p-2 text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedObjectives.map((id) => {
                      const objective = objectives.find((o) => o.id === id);
                      return objective ? (
                        <tr key={id}>
                          <td className="border p-2">{objective.label}</td>
                          <td className="border p-2 text-right">
                            ${objectiveCosts[id].toLocaleString()}
                          </td>
                        </tr>
                      ) : null;
                    })}
                    {selectedObjectives.length === 0 && (
                      <tr>
                        <td className="border p-2">No services selected</td>
                        <td className="border p-2 text-right">$0</td>
                      </tr>
                    )}
                    {credits.length > 0 && (
                      <>
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="border p-2 font-medium">
                            Credits Applied
                          </td>
                        </tr>
                        {credits.map((credit) => (
                          <tr key={credit.id}>
                            <td className="border p-2 pl-4 text-sm">
                              {credit.description ||
                                (credit.type === "dollar"
                                  ? "Dollar Credit"
                                  : "Percentage Credit")}
                            </td>
                            <td className="border p-2 text-right text-green-600">
                              -
                              {credit.type === "dollar"
                                ? `${credit.amount.toLocaleString()}`
                                : `${(
                                    (totalCost * credit.amount) /
                                    100
                                  ).toLocaleString()} (${credit.amount}%)`}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td className="border p-2 font-bold">GRAND TOTAL</td>
                      <td className="border p-2 text-right font-bold text-lg">
                        ${finalCost.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <h4 className="font-medium mb-2">3.2 Payment Schedule</h4>

                {paymentMethod === "lumpSum" ? (
                  <>
                    <p className="mb-4">
                      The Owner will pay the full amount upon execution of this
                      Agreement.
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                      <li>
                        <strong>Lump Sum Payment:</strong> The Owner will pay
                        the full lump sum of ${finalCost.toLocaleString()} at
                        the beginning of the Project, upon execution of this
                        Agreement.
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="mb-4">
                      The Owner will pay in installments based on the completion
                      of each objective.
                    </p>
                    <table className="w-full mb-4 border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Objective</th>
                          <th className="border p-2 text-right">
                            Payment Amount
                          </th>
                          <th className="border p-2 text-right">Timeline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedObjectives.map((id) => {
                          const objective = objectives.find((o) => o.id === id);
                          return objective ? (
                            <tr key={id}>
                              <td className="border p-2">{objective.label}</td>
                              <td className="border p-2 text-right">
                                ${objectiveCosts[id].toLocaleString()}
                              </td>
                              <td className="border p-2 text-right">
                                {objectiveTimelines[id]} weeks
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>

                    <p className="mb-4">
                      <strong>Initial Payment:</strong> 25% of the total fee ($
                      {Math.round(finalCost * 0.25).toLocaleString()}) is due
                      upon execution of this Agreement.
                    </p>
                    <p className="mb-4">
                      <strong>Remaining Payments:</strong> The remaining balance
                      will be invoiced upon completion of each objective as
                      outlined above.
                    </p>
                  </>
                )}

                <h4 className="font-medium mb-2">3.3 Payment Terms</h4>
                <p className="mb-4">
                  All invoices are due within 30 days of receipt. Late payments
                  are subject to a 1.5% monthly interest charge.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Article 4 - Additional Services
                </h3>
                <p className="mb-4">
                  Additional services not specified in the Scope of Services are
                  available upon request and can be provided on a time and
                  materials basis, according to the Fee Schedule shown in
                  Exhibit A.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Article 5 - Owner's Responsibilities
                </h3>
                <p className="mb-4">The Owner agrees to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Provide all necessary documents, approvals, and access to
                    the site as required for the Architect to perform the Work.
                  </li>
                  <li className="mb-2">
                    Secure all necessary approvals and permits from the local
                    AHJ.
                  </li>
                  <li className="mb-2">
                    Notify the Architect of any changes in the scope of services
                    or design and provide prompt written authorization for any
                    additional services.
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Project Information
                </h3>
                <p className="mb-2">
                  Project Name: {projectInfo.projectName || "[Project Name]"}
                </p>
                <p className="mb-2">Project Number: 25-0001</p>
              </div>

              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">OWNER</h4>
                  <div className="border border-dashed p-4 mb-4 h-32 flex items-center justify-center">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-700">
                        Woner Signature
                      </label>

                      <input
                        type="text"
                        placeholder="Type your name"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 font-cursive text-lg"
                      />

                      {/* Show warning if empty */}
                      {signature.trim() === "" && (
                        <p className="text-gray-400">
                          Woner signature required
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <SignatureCanvas
                      ref={clientSignatureRef}
                      canvasProps={{
                        width: 300,
                        height: 150,
                        className: "border rounded-md",
                      }}
                    />
                    <div className="flex justify-between mr-7">
                      <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => clearSignature(clientSignatureRef)}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      // onClick={() => clearSignature(clientSignatureRef)}
                    >
                      Sign
                    </Button>
                    </div>
                  </div>
                  <p className="mt-4">
                    Name: {clientInfo.firstName} {clientInfo.lastName}
                  </p>
                  <p>Date: ___________________</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">ARCHITECT</h4>
                  <div className="border border-dashed p-4 mb-4 h-32 flex items-center justify-center">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-700">
                        Client Signature
                      </label>

                      <input
                        type="text"
                        placeholder="Type your name"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 font-cursive text-lg"
                      />

                      {/* Show warning if empty */}
                      {signature.trim() === "" && (
                        <p className="text-gray-400">
                          Client's signature required
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <SignatureCanvas
                      ref={architectSignatureRef}
                      canvasProps={{
                        width: 300,
                        height: 150,
                        className: "border rounded-md",
                      }}
                    />
                   <div className="flex justify-between mr-7">
                     <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => clearSignature(architectSignatureRef)}
                    >
                      Clear
                    </Button>
                     <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      // onClick={() => clearSignature(architectSignatureRef)}
                    >
                      Sign
                    </Button>
                   </div>
                  </div>
                  <p className="mt-4">Name: Eric Rivera, AIA</p>
                  <p>Date: ___________________</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Article 6 - Schedule + Contact Information
                </h3>
                <p className="mb-4">
                  Architecture Simple will provide architectural services as
                  outlined in this proposal. The estimated timeline for
                  completion of all active objectives is {totalWeeks} weeks.
                  Upon client signature, the official contract start date will
                  be set to the following Monday, and the project timeline will
                  commence from that date. This approach ensures clear milestone
                  tracking and efficient project scheduling from the beginning
                  of the work week.
                </p>

                <h4 className="font-medium mb-2">Schedule</h4>
                <p className="mb-4">
                  Architecture Simple is prepared to commence design efforts
                  immediately upon acceptance of this proposal and the issuance
                  of a written notice to proceed.
                </p>

                <h4 className="font-medium mb-2">Contact Information</h4>
                <p className="mb-1">Eric Rivera, AIA, LEED</p>
                <p className="mb-1">Principal, Architecture Simple</p>
                <p className="mb-1">Email: eric@architecturesimple.com</p>
                <p className="mb-4">Phone: +1 (925) 822-4374</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Exhibit A: Professional Services Fee Schedule
                </h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">CLASSIFICATION</th>
                      <th className="border p-2 text-right">RATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Principal</td>
                      <td className="border p-2 text-right">$200.00/Hour</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Project Architect</td>
                      <td className="border p-2 text-right">$150.00/Hour</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Project Manager</td>
                      <td className="border p-2 text-right">$130.00/Hour</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Designer</td>
                      <td className="border p-2 text-right">$110.00/Hour</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Job Captain</td>
                      <td className="border p-2 text-right">$90.00/Hour</td>
                    </tr>
                    <tr>
                      <td className="border p-2">CAD Technician</td>
                      <td className="border p-2 text-right">$80.00/Hour</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Interior Design & Planning</td>
                      <td className="border p-2 text-right">$75.00/Hour</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button variant="outline">Download PDF</Button>
                <Button variant="outline">Print</Button>
                <Button onClick={handleSubmit}>Send Proposal</Button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
