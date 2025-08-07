"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Plus,
  DollarSign,
  Users,
  TrendingUp,
  BarChart,
  Clock,
  FileCheck,
  Search,
  ArrowLeft,
  CreditCard,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FinancialChart } from "./FinancialChart";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useProjects } from "@/contexts/ProjectContext";
import { ProjectFinancialSummary } from "./ProjectFinancialSummary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmployeeList } from "./EmployeeList";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  startDate: string;
  utilizationRate: number;
  hourlyRate: number;
  salary: number;
  status?: string;
}

// Mock financial data for firm overview
const financialData = {
  firm: {
    2023: {
      activeProjects: [
        500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000,
        950000, 1000000, 1050000,
      ],
      completedProjects: [
        100000, 120000, 140000, 160000, 180000, 200000, 220000, 240000, 260000,
        280000, 300000, 320000,
      ],
      laborCost: [
        50000, 52000, 51000, 53000, 54000, 55000, 56000, 57000, 58000, 59000,
        60000, 61000,
      ],
      profit: [
        20000, 22000, 23000, 25000, 26000, 27000, 28000, 29000, 30000, 31000,
        32000, 33000,
      ],
      overhead: [
        15000, 15500, 15200, 15800, 16000, 16200, 16500, 16800, 17000, 17200,
        17500, 17800,
      ],
      utilization: [75, 78, 80, 82, 85, 87, 88, 90, 92, 93, 95, 96],
    },
    2022: {
      activeProjects: [
        450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000,
        900000, 950000, 1000000,
      ],
      completedProjects: [
        90000, 110000, 130000, 150000, 170000, 190000, 210000, 230000, 250000,
        270000, 290000, 310000,
      ],
      laborCost: [
        48000, 49000, 50000, 51000, 52000, 53000, 54000, 55000, 56000, 57000,
        58000, 59000,
      ],
      profit: [
        18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000,
        28000, 29000,
      ],
      overhead: [
        14000, 14200, 14500, 14800, 15000, 15200, 15500, 15800, 16000, 16200,
        16500, 16800,
      ],
      utilization: [70, 72, 75, 78, 80, 82, 85, 87, 88, 90, 92, 93],
    },
    2021: {
      activeProjects: [
        400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000,
        850000, 900000, 950000,
      ],
      completedProjects: [
        80000, 100000, 120000, 140000, 160000, 180000, 200000, 220000, 240000,
        260000, 280000, 300000,
      ],
      laborCost: [
        45000, 46000, 47000, 48000, 49000, 50000, 51000, 52000, 53000, 54000,
        55000, 56000,
      ],
      profit: [
        15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000,
        25000, 26000,
      ],
      overhead: [
        13000, 13200, 13500, 13800, 14000, 14200, 14500, 14800, 15000, 15200,
        15500, 15800,
      ],
      utilization: [65, 68, 70, 72, 75, 78, 80, 82, 85, 87, 88, 90],
    },
  },
  employees: {
    emp1: {
      name: "John Doe",
      role: "Principal",
      2023: {
        activeProjects: [
          200000, 220000, 240000, 260000, 280000, 300000, 320000, 340000,
          360000, 380000, 400000, 420000,
        ],
        completedProjects: [
          40000, 48000, 56000, 64000, 72000, 80000, 88000, 96000, 104000,
          112000, 120000, 128000,
        ],
        laborCost: [
          10000, 10500, 10200, 10800, 11000, 11200, 11500, 11800, 12000, 12200,
          12500, 12800,
        ],
        utilization: [80, 82, 85, 87, 90, 92, 95, 97, 98, 99, 100, 100],
      },
      2022: {
        activeProjects: [
          180000, 200000, 220000, 240000, 260000, 280000, 300000, 320000,
          340000, 360000, 380000, 400000,
        ],
        completedProjects: [
          36000, 44000, 52000, 60000, 68000, 76000, 84000, 92000, 100000,
          108000, 116000, 124000,
        ],
        laborCost: [
          9000, 9200, 9500, 9800, 10000, 10200, 10500, 10800, 11000, 11200,
          11500, 11800,
        ],
        utilization: [75, 78, 80, 82, 85, 87, 90, 92, 95, 97, 98, 99],
      },
      2021: {
        activeProjects: [
          160000, 180000, 200000, 220000, 240000, 260000, 280000, 300000,
          320000, 340000, 360000, 380000,
        ],
        completedProjects: [
          32000, 40000, 48000, 56000, 64000, 72000, 80000, 88000, 96000, 104000,
          112000, 120000,
        ],
        laborCost: [
          8000, 8200, 8500, 8800, 9000, 9200, 9500, 9800, 10000, 10200, 10500,
          10800,
        ],
        utilization: [70, 72, 75, 78, 80, 82, 85, 87, 90, 92, 95, 97],
      },
    },
    emp2: {
      name: "Jane Smith",
      role: "Project Manager",
      2023: {
        activeProjects: [
          160000, 176000, 192000, 208000, 224000, 240000, 256000, 272000,
          288000, 304000, 320000, 336000,
        ],
        completedProjects: [
          32000, 38400, 44800, 51200, 57600, 64000, 70400, 76800, 83200, 89600,
          96000, 102400,
        ],
        laborCost: [
          8000, 8200, 8500, 8800, 9000, 9200, 9500, 9800, 10000, 10200, 10500,
          10800,
        ],
        utilization: [75, 78, 80, 82, 85, 87, 90, 92, 95, 97, 98, 99],
      },
      2022: {
        activeProjects: [
          140000, 156000, 172000, 188000, 204000, 220000, 236000, 252000,
          268000, 284000, 300000, 316000,
        ],
        completedProjects: [
          28000, 34400, 40800, 47200, 53600, 60000, 66400, 72800, 79200, 85600,
          92000, 98400,
        ],
        laborCost: [
          7000, 7200, 7500, 7800, 8000, 8200, 8500, 8800, 9000, 9200, 9500,
          9800,
        ],
        utilization: [70, 72, 75, 78, 80, 82, 85, 87, 90, 92, 95, 97],
      },
      2021: {
        activeProjects: [
          120000, 136000, 152000, 168000, 184000, 200000, 216000, 232000,
          248000, 264000, 280000, 296000,
        ],
        completedProjects: [
          24000, 30400, 36800, 43200, 49600, 56000, 62400, 68800, 75200, 81600,
          88000, 94400,
        ],
        laborCost: [
          6000, 6200, 6500, 6800, 7000, 7200, 7500, 7800, 8000, 8200, 8500,
          8800,
        ],
        utilization: [65, 68, 70, 72, 75, 78, 80, 82, 85, 87, 90, 92],
      },
    },
  },
};

// Mock timecard data
const mockTimecards = [
  {
    id: "tc1",
    employeeId: "1",
    employeeName: "John Doe",
    weekStarting: "2023-06-05",
    status: "approved",
    days: [
      {
        date: "2023-06-05",
        entries: [
          {
            projectId: "active-1",
            objectiveId: "obj-0-1",
            taskId: "task-0-1-1",
            hours: 4,
          },
          {
            projectId: "active-1",
            objectiveId: "obj-0-1",
            taskId: "task-0-1-2",
            hours: 4,
          },
        ],
      },
      {
        date: "2023-06-06",
        entries: [
          {
            projectId: "active-1",
            objectiveId: "obj-0-2",
            taskId: "task-0-2-1",
            hours: 8,
          },
        ],
      },
      {
        date: "2023-06-07",
        entries: [
          {
            projectId: "active-1",
            objectiveId: "obj-0-2",
            taskId: "task-0-2-2",
            hours: 6,
          },
          {
            projectId: "active-2",
            objectiveId: "obj-1-1",
            taskId: "task-1-1-1",
            hours: 2,
          },
        ],
      },
      {
        date: "2023-06-08",
        entries: [
          {
            projectId: "active-1",
            objectiveId: "obj-0-2",
            taskId: "task-0-2-2",
            hours: 8,
          },
        ],
      },
      {
        date: "2023-06-09",
        entries: [
          {
            projectId: "active-1",
            objectiveId: "obj-0-2",
            taskId: "task-0-2-2",
            hours: 4,
          },
          {
            projectId: "active-2",
            objectiveId: "obj-1-1",
            taskId: "task-1-1-2",
            hours: 4,
          },
        ],
      },
    ],
    totalHours: 40,
  },
  {
    id: "tc2",
    employeeId: "2",
    employeeName: "Jane Smith",
    weekStarting: "2023-06-05",
    status: "pending",
    days: [
      {
        date: "2023-06-05",
        entries: [
          {
            projectId: "active-2",
            objectiveId: "obj-1-1",
            taskId: "task-1-1-1",
            hours: 8,
          },
        ],
      },
      {
        date: "2023-06-06",
        entries: [
          {
            projectId: "active-2",
            objectiveId: "obj-1-1",
            taskId: "task-1-1-1",
            hours: 6,
          },
          {
            projectId: "active-2",
            objectiveId: "obj-1-1",
            taskId: "task-1-1-2",
            hours: 2,
          },
        ],
      },
      {
        date: "2023-06-07",
        entries: [
          {
            projectId: "active-2",
            objectiveId: "obj-1-1",
            taskId: "task-1-1-2",
            hours: 8,
          },
        ],
      },
      {
        date: "2023-06-08",
        entries: [
          {
            projectId: "active-2",
            objectiveId: "obj-1-2",
            taskId: "task-1-2-1",
            hours: 8,
          },
        ],
      },
      {
        date: "2023-06-09",
        entries: [
          {
            projectId: "active-2",
            objectiveId: "obj-1-2",
            taskId: "task-1-2-1",
            hours: 8,
          },
        ],
      },
    ],
    totalHours: 40,
  },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function FinancialsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("firm");
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "emp1",
      name: "John Doe",
      role: "Principal",
      email: "",
      startDate: "",
      utilizationRate: 0,
      hourlyRate: 0,
      salary: 0,
    },
    {
      id: "emp2",
      name: "Jane Smith",
      role: "Project Manager",
      email: "",
      startDate: "",
      utilizationRate: 0,
      hourlyRate: 0,
      salary: 0,
    },
  ]);
  const [mockEmployees, setMockEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      role: "Principal",
      email: "john@architecturesimple.com",
      startDate: "2020-01-15",
      utilizationRate: 85,
      hourlyRate: 120,
      salary: 120 * 2080,
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Project Manager",
      email: "jane@architecturesimple.com",
      startDate: "2021-03-01",
      utilizationRate: 78,
      hourlyRate: 95,
      salary: 95 * 2080,
      status: "active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      role: "Architect",
      email: "bob@architecturesimple.com",
      startDate: "2019-11-10",
      utilizationRate: 92,
      hourlyRate: 85,
      salary: 85 * 2080,
      status: "active",
    },
    {
      id: "4",
      name: "Alice Brown",
      role: "Designer",
      email: "alice@architecturesimple.com",
      startDate: "2022-06-20",
      utilizationRate: 80,
      hourlyRate: 75,
      salary: 75 * 2080,
      status: "active",
    },
    {
      id: "5",
      name: "Charlie Davis",
      role: "Engineer",
      email: "charlie@architecturesimple.com",
      startDate: "2021-09-05",
      utilizationRate: 88,
      hourlyRate: 80,
      salary: 80 * 2080,
      status: "active",
    },
  ]);

  // State for timecards
  const [timecards, setTimecards] = useState(mockTimecards);
  const [selectedTimecard, setSelectedTimecard] = useState<string>("");

  // Add these state variables at the top of the component
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [selectedTimecardForDenial, setSelectedTimecardForDenial] =
    useState("");
  const { toast } = useToast();

  const [overheadModalOpen, setOverheadModalOpen] = useState(false);
  const [employeesModalOpen, setEmployeesModalOpen] = useState(false);
  const [newExpenseFormOpen, setNewExpenseFormOpen] = useState(false);
  const [overheadExpenses, setOverheadExpenses] = useState([
    {
      id: "1",
      name: "Office Rent",
      amount: 8500,
      frequency: "monthly",
      category: "Rent & Facilities",
    },
    {
      id: "2",
      name: "Revit Licenses",
      amount: 2400,
      frequency: "monthly",
      category: "Software & Technology",
    },
    {
      id: "3",
      name: "Professional Liability Insurance",
      amount: 12000,
      frequency: "yearly",
      category: "Insurance",
    },
    {
      id: "4",
      name: "Office Utilities",
      amount: 1200,
      frequency: "monthly",
      category: "Rent & Facilities",
    },
    {
      id: "5",
      name: "Adobe Creative Cloud",
      amount: 600,
      frequency: "monthly",
      category: "Software & Technology",
    },
    {
      id: "6",
      name: "Staff Training",
      amount: 5000,
      frequency: "yearly",
      category: "Professional Development",
    },
    {
      id: "7",
      name: "Marketing Materials",
      amount: 800,
      frequency: "monthly",
      category: "Marketing & Business Development",
    },
    {
      id: "8",
      name: "Office Supplies",
      amount: 350,
      frequency: "monthly",
      category: "Office Expenses",
    },
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    {
      id: "cat1",
      name: "Rent & Facilities",
      description: "Office rent, utilities, maintenance, parking",
    },
    {
      id: "cat2",
      name: "Software & Technology",
      description: "Revit, AutoCAD, Adobe, rendering software, IT services",
    },
    {
      id: "cat3",
      name: "Insurance",
      description:
        "Professional liability, E&O, general liability, health insurance",
    },
    {
      id: "cat4",
      name: "Professional Development",
      description:
        "Continuing education, licenses, certifications, conferences",
    },
    {
      id: "cat5",
      name: "Marketing & Business Development",
      description:
        "Website, advertising, proposal materials, client entertainment",
    },
    {
      id: "cat6",
      name: "Office Expenses",
      description: "Supplies, printing, postage, furniture",
    },
    {
      id: "cat7",
      name: "Travel",
      description: "Site visits, client meetings, conferences",
    },
    {
      id: "cat8",
      name: "Professional Services",
      description: "Legal, accounting, consulting",
    },
    {
      id: "cat9",
      name: "Equipment",
      description: "Computers, plotters, printers, phones",
    },
    {
      id: "cat10",
      name: "Subscriptions",
      description: "Industry publications, research tools, memberships",
    },
    { id: "cat11", name: "Other", description: "Miscellaneous expenses" },
  ]);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: 0,
    frequency: "monthly",
    category: "Rent & Facilities",
  });

  // Pay period tracking data
  const [payPeriodAlerts, setPayPeriodAlerts] = useState({
    paymentFrequency: "bi-weekly", // 'bi-weekly' or 'monthly'
    nextPayPeriod: {
      startDate: "2023-05-01",
      endDate: "2023-05-15",
      payDate: "2023-05-20",
      daysRemaining: 3,
      status: "upcoming", // 'upcoming', 'due', 'overdue', 'processed'
      accumulatedHours: {
        approved: 320, // Total approved hours for this pay period
        pending: 40, // Hours still pending approval
        total: 360, // Total expected hours
      },
    },
    missedPayPeriods: [
      {
        id: "missed-1",
        startDate: "2023-04-16",
        endDate: "2023-04-30",
        payDate: "2023-05-05",
        daysOverdue: 2,
        accumulatedHours: {
          approved: 280,
          pending: 0,
          total: 280,
        },
      },
    ],
  });

  // Use the ProjectContext to access shared project data
  const {
    projects,
    activeProject,
    setActiveProject,
    calculateFinancialSummary,
  } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<typeof projects>([]);

  // Check for project in URL params
  useEffect(() => {
    const projectId = searchParams.get("project");
    if (projectId) {
      setSelectedProject(projectId);
      calculateFinancialSummary(projectId);
    } else if (activeProject) {
      setSelectedProject(activeProject.id);
      calculateFinancialSummary(activeProject.id);
    }
  }, [searchParams, activeProject, calculateFinancialSummary]);

  // Add this useEffect after the other useEffect that checks for project in URL params
  useEffect(() => {
    // Calculate financial summaries for active projects
    projects
      .filter((p) => p.stage === "active")
      .forEach((project) => {
        if (project.id) {
          calculateFinancialSummary(project.id);
        }
      });
  }, [projects, calculateFinancialSummary]);

  const getDataForSelectedEmployee = () => {
    if (selectedEmployee === "firm") {
      return (
        financialData.firm[selectedYear] || {
          activeProjects: [],
          completedProjects: [],
          laborCost: [],
          profit: [],
          overhead: [],
          utilization: [],
        }
      );
    } else {
      const employeeData =
        financialData.employees[selectedEmployee]?.[selectedYear];
      return {
        activeProjects: employeeData?.activeProjects || [],
        completedProjects: employeeData?.completedProjects || [],
        laborCost: employeeData?.laborCost || [],
        utilization: employeeData?.utilization || [],
        profit: [],
        overhead: Array(12).fill(0), // Add this line to include overhead for employees
      };
    }
  };

  const data = getDataForSelectedEmployee();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Financial Metrics",
      },
    },
  };

  const handleAddEmployee = () => {
    router.push("/add-team-member");
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    const updatedEmployees = mockEmployees.map((employee) =>
      employee.id === updatedEmployee.id ? updatedEmployee : employee
    );
    setMockEmployees(updatedEmployees);
  };

  const calculateTotalRevenue = () => {
    return (
      data.activeProjects.reduce((a, b) => a + b, 0) +
      data.completedProjects.reduce((a, b) => a + b, 0)
    );
  };

  const totalRevenue = calculateTotalRevenue();
  const totalLaborCost = data.laborCost.reduce((a, b) => a + b, 0);
  const totalOverhead = data.overhead
    ? data.overhead.reduce((a, b) => a + b, 0)
    : 0;
  const totalProfit = totalRevenue - totalLaborCost - totalOverhead;
  const averageUtilization = (
    data.utilization.reduce((a, b) => a + b, 0) / 12
  ).toFixed(2);

  // Add these handler functions inside the FinancialsPage component
  const handleApproveTimecard = (timecardId) => {
    // Find the timecard being approved
    const timecard = timecards.find((tc) => tc.id === timecardId);

    // Update the timecard status
    setTimecards(
      timecards.map((tc) =>
        tc.id === timecardId ? { ...tc, status: "approved" } : tc
      )
    );

    // Add the approved hours to the current pay period
    if (timecard) {
      setPayPeriodAlerts((prev) => {
        // Determine which pay period this timecard belongs to
        const timecardDate = new Date(timecard.weekStarting);
        const nextPeriodStart = new Date(prev.nextPayPeriod.startDate);
        const nextPeriodEnd = new Date(prev.nextPayPeriod.endDate);

        // If the timecard falls within the next pay period
        if (timecardDate >= nextPeriodStart && timecardDate <= nextPeriodEnd) {
          return {
            ...prev,
            nextPayPeriod: {
              ...prev.nextPayPeriod,
              accumulatedHours: {
                ...prev.nextPayPeriod.accumulatedHours,
                approved:
                  prev.nextPayPeriod.accumulatedHours.approved +
                  timecard.totalHours,
                pending:
                  prev.nextPayPeriod.accumulatedHours.pending -
                  timecard.totalHours,
              },
            },
          };
        }

        // If it doesn't match any period, just return the current state
        return prev;
      });
    }

    // Show toast notification
    toast({
      title: "Timecard Approved",
      description:
        "The timecard has been approved successfully and hours added to the current pay period.",
    });
  };

  const handleDenyTimecard = (timecardId) => {
    // Open a dialog to provide feedback
    setDenyDialogOpen(true);
    setSelectedTimecardForDenial(timecardId);
  };

  const handleSubmitDenial = (feedback: string) => {
    setTimecards(
      timecards.map((tc) =>
        tc.id === selectedTimecardForDenial
          ? {
              ...tc,
              status: "denied",
              feedback: feedback,
            }
          : tc
      )
    );

    setDenyDialogOpen(false);
    setSelectedTimecardForDenial("");

    // Show toast notification
    toast({
      title: "Timecard Denied",
      description:
        "The timecard has been denied and sent back for resubmission.",
    });
  };

  // Function to handle back to studio navigation
  const handleBackToStudio = (projectId: string) => {
    router.push(`/dashboard?tab=studio&project=${projectId}`);
  };

  const [showPayrollReviewDialog, setShowPayrollReviewDialog] = useState(false);
  const [currentPayPeriodId, setCurrentPayPeriodId] = useState<
    string | undefined
  >(undefined);

  // Function to handle processing payroll
  const handleProcessPayroll = (payPeriodId?: string) => {
    // Store the pay period ID and open the review dialog
    setCurrentPayPeriodId(payPeriodId);
    setShowPayrollReviewDialog(true);
  };

  // Function to confirm and actually process the payroll after review
  const confirmProcessPayroll = () => {
    // Close the review dialog
    setShowPayrollReviewDialog(false);

    // For demo purposes, update the state to show the payroll as processed
    if (currentPayPeriodId) {
      // Handle processing a specific missed pay period
      setPayPeriodAlerts((prev) => ({
        ...prev,
        missedPayPeriods: prev.missedPayPeriods.filter(
          (p) => p.id !== currentPayPeriodId
        ),
      }));
    } else {
      // Handle processing the next pay period
      setPayPeriodAlerts((prev) => ({
        ...prev,
        nextPayPeriod: {
          ...prev.nextPayPeriod,
          status: "processed",
        },
      }));
    }

    // Show toast notification
    toast({
      title: "Payroll Processing Initiated",
      description: "Payroll has been submitted for processing.",
    });

    // Open the payroll management dialog
    setEmployeesModalOpen(true);
  };

  // Function to handle changing payment frequency
  const handleChangePaymentFrequency = (frequency: "bi-weekly" | "monthly") => {
    setPayPeriodAlerts((prev) => ({
      ...prev,
      paymentFrequency: frequency,
      // Update the next pay period dates based on the new frequency
      nextPayPeriod: {
        ...prev.nextPayPeriod,
        startDate: frequency === "bi-weekly" ? "2023-05-01" : "2023-05-01",
        endDate: frequency === "bi-weekly" ? "2023-05-15" : "2023-05-31",
        payDate: frequency === "bi-weekly" ? "2023-05-20" : "2023-06-05",
      },
    }));

    toast({
      title: `Payment frequency updated to ${frequency}`,
      description: `Payroll will now be processed on a ${frequency} basis.`,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary"></h2>
        <div className="flex items-center space-x-4">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firm">Firm Overview</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name} ({employee.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="project-tracking">Project Tracking</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {selectedEmployee === "firm" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-3">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Financial Summary </CardTitle>
                        <CardDescription>
                          {selectedYear} Overview for{" "}
                          {selectedEmployee === "firm"
                            ? "Entire Firm"
                            : financialData.employees[selectedEmployee]?.name}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Calculate actual financial metrics from projects */}
                    {(() => {
                      // Get active and completed projects
                      const activeProjects = projects.filter(
                        (p) => p.stage === "active" || p.status === "active"
                      );
                      const completedProjects = projects.filter(
                        (p) =>
                          p.stage === "completed" || p.status === "completed"
                      );

                      // Calculate total revenue from contract amounts
                      const activeProjectsRevenue = activeProjects.reduce(
                        (sum, project) => sum + (project.contractAmount || 0),
                        0
                      );
                      const completedProjectsRevenue = completedProjects.reduce(
                        (sum, project) => sum + (project.contractAmount || 0),
                        0
                      );
                      const actualTotalRevenue =
                        activeProjectsRevenue + completedProjectsRevenue;

                      // Calculate labor costs (estimated as 45% of revenue for active projects)
                      const actualLaborCost = Math.round(
                        activeProjectsRevenue * 0.45
                      );

                      // Calculate overhead (estimated as 20% of revenue)
                      const actualOverhead = Math.round(
                        actualTotalRevenue * 0.2
                      );

                      // Calculate profit
                      const actualProfit =
                        actualTotalRevenue - actualLaborCost - actualOverhead;

                      // Calculate profit margin
                      const profitMargin =
                        actualTotalRevenue > 0
                          ? ((actualProfit / actualTotalRevenue) * 100).toFixed(
                              1
                            )
                          : "0.0";

                      // Calculate monthly averages
                      const monthlyOverhead = Math.round(actualOverhead / 12);

                      // Calculate overhead percentage
                      const overheadPercentage =
                        actualTotalRevenue > 0
                          ? (
                              (actualOverhead / actualTotalRevenue) *
                              100
                            ).toFixed(1)
                          : "0.0";

                      // Calculate labor percentage
                      const laborPercentage =
                        actualTotalRevenue > 0
                          ? (
                              (actualLaborCost / actualTotalRevenue) *
                              100
                            ).toFixed(1)
                          : "0.0";

                      // Calculate billable ratio
                      const billableRatio =
                        actualLaborCost > 0
                          ? (actualTotalRevenue / actualLaborCost).toFixed(2)
                          : "0.00";

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          {/* Profit Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold flex items-center">
                                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                                Profit
                              </h3>
                              <span className="text-2xl font-bold text-green-600">
                                ${actualProfit.toLocaleString()}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Total Revenue</span>
                                <span className="font-medium">
                                  ${actualTotalRevenue.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Profit Margin</span>
                                <span className="font-medium">
                                  {profitMargin}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Active Projects</span>
                                <span className="font-medium">
                                  {activeProjects.length}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Completed Projects</span>
                                <span className="font-medium">
                                  {completedProjects.length}
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="text-sm font-medium mb-1">
                                Revenue Breakdown
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Active Projects</span>
                                  <span>
                                    ${activeProjectsRevenue.toLocaleString()}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{
                                      width:
                                        actualTotalRevenue > 0
                                          ? `${
                                              (activeProjectsRevenue /
                                                actualTotalRevenue) *
                                              100
                                            }%`
                                          : "0%",
                                    }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>Completed Projects</span>
                                  <span>
                                    ${completedProjectsRevenue.toLocaleString()}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-green-500 h-1.5 rounded-full"
                                    style={{
                                      width:
                                        actualTotalRevenue > 0
                                          ? `${
                                              (completedProjectsRevenue /
                                                actualTotalRevenue) *
                                              100
                                            }%`
                                          : "0%",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Overhead Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold flex items-center">
                                <BarChart className="h-5 w-5 mr-2 text-orange-600" />
                                Overhead
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOverheadModalOpen(true)}
                                >
                                  <Plus className="h-3 w-3 mr-1.5" />
                                  Update Overhead
                                </Button>
                              </div>
                              <span className="text-2xl font-bold text-orange-600">
                                ${actualOverhead.toLocaleString()}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>% of Revenue</span>
                                <span className="font-medium">
                                  {overheadPercentage}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Monthly Average</span>
                                <span className="font-medium">
                                  ${monthlyOverhead.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Per Project (Avg)</span>
                                <span className="font-medium">
                                  $
                                  {activeProjects.length > 0
                                    ? Math.round(
                                        actualOverhead / activeProjects.length
                                      ).toLocaleString()
                                    : "0"}
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="text-sm font-medium mb-1">
                                Overhead Breakdown
                              </div>
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Rent & Utilities</span>
                                    <span>42%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-orange-500 h-1.5 rounded-full"
                                      style={{ width: "42%" }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Software & Equipment</span>
                                    <span>28%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-orange-500 h-1.5 rounded-full"
                                      style={{ width: "28%" }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Insurance & Benefits</span>
                                    <span>18%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-orange-500 h-1.5 rounded-full"
                                      style={{ width: "18%" }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Other</span>
                                    <span>12%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-orange-500 h-1.5 rounded-full"
                                      style={{ width: "12%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Labor Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold flex items-center">
                                <Users className="h-5 w-5 mr-2 text-blue-600" />
                                Labor
                              </h3>
                              <span className="text-2xl font-bold text-blue-600">
                                ${actualLaborCost.toLocaleString()}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>% of Revenue</span>
                                <span className="font-medium">
                                  {laborPercentage}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Utilization Rate</span>
                                <span className="font-medium">
                                  {averageUtilization}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Billable Ratio</span>
                                <span className="font-medium">
                                  {billableRatio}x
                                </span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <div className="text-sm font-medium mb-1">
                                Labor by Role
                              </div>
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Principals</span>
                                    <span>25%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full"
                                      style={{ width: "25%" }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Project Architects</span>
                                    <span>35%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full"
                                      style={{ width: "35%" }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Designers</span>
                                    <span>30%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full"
                                      style={{ width: "30%" }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Support Staff</span>
                                    <span>10%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full"
                                      style={{ width: "10%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Financial Health Section */}
                          <div className="space-y-4">
                            <div className="flex justify-end gap-4 mb-4">
                              <button className="flex items-center gap-2 px-6 py-2 rounded-md bg-black text-white">
                                <Plus size={16} /> Upload Overhead
                              </button>
                              <button className="flex items-center gap-2 px-6 py-2 rounded-md bg-black text-white">
                                <Plus size={16} /> Updated Labor
                              </button>
                             
                            </div>
                            <div className="flex items-center justify-between mt-5">
                              <h3 className="text-lg font-semibold flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                                Financial Health
                              </h3>
                              <span className="text-2xl font-bold text-purple-600">
                                {actualProfit > 0
                                  ? "Good"
                                  : actualProfit === 0
                                  ? "Neutral"
                                  : "Attention"}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Current Ratio</span>
                                  <span className="font-medium">
                                    {(
                                      actualTotalRevenue /
                                      (actualLaborCost + actualOverhead)
                                    ).toFixed(1)}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`${
                                      actualProfit > 0
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                    } h-1.5 rounded-full`}
                                    style={{
                                      width: `${Math.min(
                                        (actualTotalRevenue /
                                          (actualLaborCost + actualOverhead) /
                                          3) *
                                          100,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Assets to liabilities ratio
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Profit per Project</span>
                                  <span className="font-medium">
                                    $
                                    {activeProjects.length > 0
                                      ? Math.round(
                                          actualProfit / activeProjects.length
                                        ).toLocaleString()
                                      : "0"}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`${
                                      actualProfit > 0
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                    } h-1.5 rounded-full`}
                                    style={{
                                      width: `${Math.min(
                                        (actualProfit /
                                          (actualTotalRevenue || 1)) *
                                          100,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Average profit per active project
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Project Completion</span>
                                  <span className="font-medium">
                                    {completedProjects.length}/
                                    {activeProjects.length +
                                      completedProjects.length}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{
                                      width:
                                        activeProjects.length +
                                          completedProjects.length >
                                        0
                                          ? `${
                                              (completedProjects.length /
                                                (activeProjects.length +
                                                  completedProjects.length)) *
                                              100
                                            }%`
                                          : "0%",
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Completed vs. total projects
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Cash Reserves</span>
                                  <span className="font-medium">
                                    $
                                    {Math.round(
                                      actualProfit * 0.3
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`${
                                      actualProfit > 0
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    } h-1.5 rounded-full`}
                                    style={{
                                      width: `${Math.min(
                                        actualProfit > 0 ? 85 : 20,
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  
                                  {actualProfit > 0
                                    ? `${(
                                        (actualProfit * 0.3) /
                                        monthlyOverhead
                                      ).toFixed(1)} months of expenses`
                                    : "Insufficient reserves"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-3">
                  <CardHeader>
                    <CardTitle>Financial Performance</CardTitle>
                    <CardDescription>
                      Monthly breakdown of key financial metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FinancialChart data={data} />
                  </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-3">
                  <CardHeader>
                    <CardTitle>Top Performing Projects</CardTitle>
                    <CardDescription>By profit margin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "City Center Tower",
                          client: "Metropolis Development",
                          margin: 32,
                          revenue: 450000,
                        },
                        {
                          name: "Riverside Residences",
                          client: "Waterfront Properties",
                          margin: 28,
                          revenue: 380000,
                        },
                        {
                          name: "Tech Campus Expansion",
                          client: "InnoTech Inc.",
                          margin: 25,
                          revenue: 520000,
                        },
                        {
                          name: "Harborview Hotel",
                          client: "Coastal Resorts",
                          margin: 23,
                          revenue: 290000,
                        },
                        {
                          name: "Downtown Revitalization",
                          client: "City of Oakridge",
                          margin: 21,
                          revenue: 410000,
                        },
                      ].map((project, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-medium">
                            {i + 1}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {project.name} 
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.client}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {project.margin}% margin
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${project.revenue.toLocaleString()} revenue 
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {selectedEmployee !== "firm" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +18.2% from last year
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Labor Cost
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalLaborCost.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8.5% from last year
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Projects Led
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedEmployee === "emp1" ? "8" : "6"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedEmployee === "emp1" ? "+2" : "+1"} from last year
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Utilization Rate
                    </CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {averageUtilization}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +4.8% from last year
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Performance</CardTitle>
                  <CardDescription>
                    {selectedYear} data for{" "}
                    {financialData.employees[selectedEmployee]?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialChart data={data} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Contributions</CardTitle>
                    <CardDescription>
                      Revenue by project in {selectedYear}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "City Center Tower",
                          revenue: 180000,
                          percentage: 35,
                        },
                        {
                          name: "Riverside Residences",
                          revenue: 120000,
                          percentage: 25,
                        },
                        {
                          name: "Tech Campus Expansion",
                          revenue: 90000,
                          percentage: 18,
                        },
                        {
                          name: "Greenfield Hospital",
                          revenue: 65000,
                          percentage: 12,
                        },
                        {
                          name: "Mountain View Condos",
                          revenue: 45000,
                          percentage: 10,
                        },
                      ].map((project, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {project.name}
                            </span>
                            <span className="text-sm">
                              ${project.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Key indicators for {selectedYear}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Billable Hours
                          </p>
                          <p className="text-xl font-bold">1,840</p>
                          <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+5.2% YoY</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Avg. Hourly Rate
                          </p>
                          <p className="text-xl font-bold">
                            ${selectedEmployee === "emp1" ? "120" : "95"}
                          </p>
                          <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+3.5% YoY</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Client Satisfaction
                          </p>
                          <p className="text-xl font-bold">4.8/5.0</p>
                          <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+0.2 YoY</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Project On-Time
                          </p>
                          <p className="text-xl font-bold">92%</p>
                          <div className="flex items-center text-xs text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+4% YoY</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">
                          Professional Development
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Continuing Education Credits</span>
                            <span>18/24 hours</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Project & Objective Tracking Tab */}
        <TabsContent value="project-tracking" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Project Financial Tracking</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </div>

          {/* Project Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Search</CardTitle>
              <CardDescription>
                Search for projects by name, number, client, or status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Active Projects Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Active Projects from Studio
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project #</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects
                        .filter((p) => p.stage === "active")
                        .map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-mono text-sm">
                              {project.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {project.name}
                            </TableCell>
                            <TableCell>{project.clientName}</TableCell>
                            <TableCell>{project.phase || "Design"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                      width: `${project.progress || 65}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs">
                                  {project.progress || 65}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(project.id)}
                              >
                                Financial Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      {projects.filter((p) => p.stage === "active").length ===
                        0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No active projects found in the studio
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Completed Projects Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Completed Projects from Studio
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project #</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Final Amount</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects
                        .filter(
                          (p) =>
                            p.stage === "completed" || p.status === "completed"
                        )
                        .map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-mono text-sm">
                              {project.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {project.name}
                            </TableCell>
                            <TableCell>{project.clientName}</TableCell>
                            <TableCell>
                              $
                              {project.contractAmount?.toLocaleString() ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {project.completionDate || "Dec 15, 2023"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(project.id)}
                              >
                                Financial Summary
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      {projects.filter(
                        (p) =>
                          p.stage === "completed" || p.status === "completed"
                      ).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No completed projects found in the studio
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Search Projects Section */}
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-medium mb-4">Search Projects</h3>
                  <div className="flex w-full items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          if (searchTerm === "") {
                            setFilteredProjects([]);
                          } else {
                            const filtered = projects.filter((project) => {
                              return (
                                project.name
                                  ?.toLowerCase()
                                  .includes(searchTerm) ||
                                project.clientName
                                  ?.toLowerCase()
                                  .includes(searchTerm) ||
                                project.id
                                  ?.toLowerCase()
                                  .includes(searchTerm) ||
                                project.status
                                  ?.toLowerCase()
                                  .includes(searchTerm)
                              );
                            });
                            setFilteredProjects(filtered);
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setFilteredProjects([])}
                    >
                      Clear
                    </Button>
                  </div>

                  {filteredProjects.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">
                        Search Results
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project #</TableHead>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Contract Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProjects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell className="font-mono text-sm">
                                {project.id}
                              </TableCell>
                              <TableCell className="font-medium">
                                {project.name}
                              </TableCell>
                              <TableCell>{project.clientName}</TableCell>
                              <TableCell>
                                $
                                {project.contractAmount?.toLocaleString() ||
                                  "N/A"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    project.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }
                                >
                                  {project.status === "completed"
                                    ? "Completed"
                                    : "In Progress"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedProject(project.id)}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Project Detail View */}
          {selectedProject && (
            <div className="space-y-6">
              <div className="flex justify-start mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBackToStudio(selectedProject)}
                  className="text-xs"
                >
                  <ArrowLeft className="mr-2 h-3 w-3" /> Back to Studio
                </Button>
              </div>
              <ProjectFinancialSummary projectId={selectedProject} />
            </div>
          )}

          {!selectedProject && (
            <p className="text-center text-muted-foreground p-4">
              Search for a project above or select a project from the studio
              dashboard to view detailed financial information.
            </p>
          )}
        </TabsContent>

        <TabsContent value="payroll" className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Payroll Management</h2>
              <Badge variant="outline" className="capitalize">
                {payPeriodAlerts.paymentFrequency}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Select
                value={payPeriodAlerts.paymentFrequency}
                onValueChange={(value) =>
                  handleChangePaymentFrequency(value as "bi-weekly" | "monthly")
                }
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 text-xs">
                <CreditCard className="mr-1.5 h-3 w-3" />
                Connect Account
              </Button>
            </div>
          </div>

          {/* Feng Shui Layout - Balanced 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Left Column - Water Element (Flow of Money) */}
            <Card className="col-span-1 md:col-span-1 overflow-hidden border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="py-3 px-4 bg-blue-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 rounded-full p-1.5">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Business Accounts</CardTitle>
                    <CardDescription className="text-[10px]">
                      Connected banking
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Primary Account
                      </p>
                      <p className="text-lg font-bold">$125,000.00</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className="text-[9px] px-1 py-0 h-3.5 bg-blue-100 text-blue-800 border-blue-200">
                          Default
                        </Badge>
                        <Badge className="text-[9px] px-1 py-0 h-3.5 bg-blue-100 text-blue-800 border-blue-200">
                          Checking
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] mt-2">
                      <div className="text-muted-foreground">Account:</div>
                      <div>•••••••1234</div>
                      <div className="text-muted-foreground">Bank:</div>
                      <div>Chase Bank</div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-md border border-blue-100 shadow-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Reserve Account
                      </p>
                      <p className="text-lg font-bold">$250,000.00</p>
                      <Badge className="text-[9px] px-1 py-0 h-3.5 mt-1 bg-indigo-100 text-indigo-800 border-indigo-200">
                        Savings
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] mt-2">
                      <div className="text-muted-foreground">Account:</div>
                      <div>•••••••5678</div>
                      <div className="text-muted-foreground">Bank:</div>
                      <div>Chase Bank</div>
                    </div>
                  </div>

                  {/* Recent Transactions Section */}
                  <div className="bg-white rounded-md border border-blue-100 shadow-sm">
                    <div className="p-2 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                      <h4 className="text-xs font-medium flex items-center">
                        <BarChart className="h-3 w-3 mr-1.5 text-blue-600" />
                        Recent Transactions
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                      <div className="p-2 border-b border-gray-100 flex justify-between">
                        <div>
                          <p className="text-[11px] font-medium">
                            Payroll Payment
                          </p>
                          <p className="text-[9px] text-muted-foreground">
                            Apr 20, 2023
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-red-600">
                          -$12,094.23
                        </p>
                      </div>
                      <div className="p-2 border-b border-gray-100 flex justify-between">
                        <div>
                          <p className="text-[11px] font-medium">
                            Client Payment - XYZ Corp
                          </p>
                          <p className="text-[9px] text-muted-foreground">
                            Apr 18, 2023
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-green-600">
                          +$15,000.00
                        </p>
                      </div>
                      <div className="p-2 border-b border-gray-100 flex justify-between">
                        <div>
                          <p className="text-[11px] font-medium">
                            Software Subscription
                          </p>
                          <p className="text-[9px] text-muted-foreground">
                            Apr 15, 2023
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-red-600">
                          -$99.00
                        </p>
                      </div>
                      <div className="p-2 flex justify-between">
                        <div>
                          <p className="text-[11px] font-medium">
                            Client Payment - ABC Inc
                          </p>
                          <p className="text-[9px] text-muted-foreground">
                            Apr 12, 2023
                          </p>
                        </div>
                        <p className="text-[11px] font-medium text-green-600">
                          +$8,500.00
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1.5" />
                      Add Account
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1"
                    >
                      <Search className="h-3 w-3 mr-1.5" />
                      Search Transactions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Center Column - Earth Element (Stability) */}
            <Card className="col-span-1 md:col-span-1 overflow-hidden border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="py-3 px-4 bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 rounded-full p-1.5">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Next Pay Period</CardTitle>
                    <CardDescription className="text-[10px]">
                      Due in {payPeriodAlerts.nextPayPeriod.daysRemaining} days
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-md border border-amber-100 shadow-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                      <div className="text-muted-foreground">Period:</div>
                      <div className="font-medium">
                        {new Date(
                          payPeriodAlerts.nextPayPeriod.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          payPeriodAlerts.nextPayPeriod.endDate
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">Pay Date:</div>
                      <div className="font-medium">
                        {new Date(
                          payPeriodAlerts.nextPayPeriod.payDate
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">Employees:</div>
                      <div className="font-medium">
                        {
                          mockEmployees.filter((e) => e.status !== "inactive")
                            .length
                        }
                      </div>
                      <div className="text-muted-foreground">Hours Status:</div>
                      <div className="font-medium flex items-center gap-1">
                        <span className="text-green-600">
                          {
                            payPeriodAlerts.nextPayPeriod.accumulatedHours
                              .approved
                          }{" "}
                          approved
                        </span>
                        {payPeriodAlerts.nextPayPeriod.accumulatedHours
                          .pending > 0 && (
                          <span className="text-amber-600">
                            /{" "}
                            {
                              payPeriodAlerts.nextPayPeriod.accumulatedHours
                                .pending
                            }{" "}
                            pending
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        Estimated Total:
                      </div>
                      <div className="font-medium">$24,750.00</div>
                    </div>
                  </div>

                  {payPeriodAlerts.missedPayPeriods.length > 0 && (
                    <div className="bg-white rounded-md border border-red-100 overflow-hidden shadow-sm">
                      <div className="p-3 bg-red-50/50">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="bg-red-100 rounded-full p-0.5">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                          </div>
                          <h4 className="text-xs font-medium text-red-800">
                            Missed Pay Periods
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {payPeriodAlerts.missedPayPeriods.map((period) => (
                            <div
                              key={period.id}
                              className="flex justify-between items-center text-[10px] bg-white p-2 rounded border border-red-50"
                            >
                              <div>
                                <p className="font-medium">
                                  {new Date(
                                    period.startDate
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    period.endDate
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-muted-foreground">
                                  Due:{" "}
                                  {new Date(
                                    period.payDate
                                  ).toLocaleDateString()}
                                  ({period.daysOverdue}{" "}
                                  {period.daysOverdue === 1 ? "day" : "days"}{" "}
                                  overdue)
                                </p>
                                <p className="text-green-600">
                                  {period.accumulatedHours.approved} hours
                                  approved
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-100 text-[10px] h-6 px-2"
                                onClick={() => handleProcessPayroll(period.id)}
                              >
                                Process
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleProcessPayroll()}
                    className="w-full text-xs bg-amber-600 hover:bg-amber-700 border-amber-700"
                  >
                    <DollarSign className="mr-1.5 h-3 w-3" />
                    Process Payroll
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Wood Element (Growth) */}
            <Card className="col-span-1 md:col-span-1 overflow-hidden border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-white">
              <CardHeader className="py-3 px-4 bg-emerald-50/50">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 rounded-full p-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">
                      Pending Approvals & Payroll
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Timecards and current payroll status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  {timecards.filter((t) => t.status === "pending").length >
                  0 ? (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {timecards
                        .filter((t) => t.status === "pending")
                        .map((timecard) => (
                          <div
                            key={timecard.id}
                            className="bg-white p-3 rounded-md border border-emerald-100 shadow-sm"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-xs font-medium">
                                {timecard.employeeName}
                              </div>
                              <Badge className="text-[9px] px-1 py-0 h-3.5 bg-amber-100 text-amber-800 border-amber-200">
                                Pending
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div className="text-muted-foreground">
                                Week Starting:
                              </div>
                              <div>
                                {new Date(
                                  timecard.weekStarting
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-muted-foreground">
                                Total Hours:
                              </div>
                              <div>{timecard.totalHours} hours</div>
                            </div>
                            <div className="flex items-center justify-end gap-1 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2 bg-white hover:bg-gray-50"
                                onClick={() => setSelectedTimecard(timecard.id)}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                onClick={() =>
                                  handleApproveTimecard(timecard.id)
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px] px-2 bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                onClick={() => handleDenyTimecard(timecard.id)}
                              >
                                Deny
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[150px] p-4 bg-white rounded-md border border-emerald-100">
                      <FileCheck className="h-10 w-10 text-emerald-200 mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        No pending timecards
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        All timecards have been processed
                      </p>
                    </div>
                  )}

                  {/* Integrated Payroll Summary Section */}
                  <div className="bg-white rounded-md border border-emerald-100 shadow-sm">
                    <div className="p-2 bg-emerald-50/50 border-b border-emerald-100 flex justify-between items-center">
                      <h4 className="text-xs font-medium flex items-center">
                        <FileCheck className="h-3 w-3 mr-1.5 text-emerald-600" />
                        Payroll Summary
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleProcessPayroll()}
                      >
                        Process
                      </Button>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Current Pay Period:
                        </span>
                        <span className="font-medium">
                          $
                          {
                            payPeriodAlerts.nextPayPeriod.accumulatedHours
                              .approved
                          }{" "}
                          hrs approved
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Estimated Total:
                        </span>
                        <span className="font-medium">$24,750.00</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Next Pay Date:
                        </span>
                        <span className="font-medium">
                          {new Date(
                            payPeriodAlerts.nextPayPeriod.payDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-1 text-amber-600" />
                        <span className="text-amber-600">
                          Due in {payPeriodAlerts.nextPayPeriod.daysRemaining}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEmployeesModalOpen(true)}
                    className="w-full text-xs"
                  >
                    <Users className="h-3 w-3 mr-1.5" />
                    Manage Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Overhead Update Modal */}
      <Dialog open={overheadModalOpen} onOpenChange={setOverheadModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Overhead Expenses Management gg</DialogTitle>
            <DialogDescription>
              Track and manage all expenses needed to run your architecture
              firm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Top Controls */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Expense List</h3>
                <p className="text-sm text-muted-foreground">
                  {overheadExpenses.length} expenses totaling $
                  {(
                    overheadExpenses
                      .filter((e) => e.frequency === "monthly")
                      .reduce((sum, e) => sum + e.amount, 0) +
                    overheadExpenses
                      .filter((e) => e.frequency === "semi-annually")
                      .reduce((sum, e) => sum + e.amount / 6, 0) +
                    overheadExpenses
                      .filter((e) => e.frequency === "yearly")
                      .reduce((sum, e) => sum + e.amount / 12, 0)
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  /month
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setNewExpenseFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Expense
                </Button>
              </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Expense List - Takes 2/3 of the space */}
              <div className="lg:col-span-2 border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Expense</TableHead>
                      <TableHead className="w-[15%]">Amount</TableHead>
                      <TableHead className="w-[15%]">Frequency</TableHead>
                      <TableHead className="w-[15%]">Category</TableHead>
                      <TableHead className="w-[15%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overheadExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.name}
                        </TableCell>
                        <TableCell>
                          ${expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{expense.frequency}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal text-nowrap text-center">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setNewExpense({
                                  name: expense.name,
                                  amount: expense.amount,
                                  frequency: expense.frequency,
                                  category: expense.category,
                                });
                                setNewExpenseFormOpen(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setOverheadExpenses(
                                  overheadExpenses.filter(
                                    (e) => e.id !== expense.id
                                  )
                                );
                                toast({
                                  title: "Expense removed",
                                  description: `${expense.name} has been removed from overhead expenses.`,
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash-2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {overheadExpenses.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No expenses added yet. Click "Add New Expense" to get
                          started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Section - Takes 1/3 of the space */}
              <div className="space-y-6">
                {/* Financial Summary Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Monthly Expenses:
                        </span>
                        <span className="font-medium">
                          $
                          {overheadExpenses
                            .filter((e) => e.frequency === "monthly")
                            .reduce((sum, e) => sum + e.amount, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Semi-Annual Expenses:
                        </span>
                        <span className="font-medium">
                          $
                          {overheadExpenses
                            .filter((e) => e.frequency === "semi-annually")
                            .reduce((sum, e) => sum + e.amount, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Yearly Expenses:
                        </span>
                        <span className="font-medium">
                          $
                          {overheadExpenses
                            .filter((e) => e.frequency === "yearly")
                            .reduce((sum, e) => sum + e.amount, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm font-medium">
                        <span>Monthly Equivalent:</span>
                        <span className="text-primary">
                          $
                          {(
                            overheadExpenses
                              .filter((e) => e.frequency === "monthly")
                              .reduce((sum, e) => sum + e.amount, 0) +
                            overheadExpenses
                              .filter((e) => e.frequency === "semi-annually")
                              .reduce((sum, e) => sum + e.amount / 6, 0) +
                            overheadExpenses
                              .filter((e) => e.frequency === "yearly")
                              .reduce((sum, e) => sum + e.amount / 12, 0)
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Annual Total:</span>
                        <span className="text-primary">
                          $
                          {(
                            overheadExpenses
                              .filter((e) => e.frequency === "monthly")
                              .reduce((sum, e) => sum + e.amount * 12, 0) +
                            overheadExpenses
                              .filter((e) => e.frequency === "semi-annually")
                              .reduce((sum, e) => sum + e.amount * 2, 0) +
                            overheadExpenses
                              .filter((e) => e.frequency === "yearly")
                              .reduce((sum, e) => sum + e.amount, 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {expenseCategories.map((category) => {
                      const categoryExpenses = overheadExpenses.filter(
                        (e) => e.category === category.name
                      );
                      if (categoryExpenses.length === 0) return null;

                      const monthlyTotal =
                        categoryExpenses
                          .filter((e) => e.frequency === "monthly")
                          .reduce((sum, e) => sum + e.amount, 0) +
                        categoryExpenses
                          .filter((e) => e.frequency === "semi-annually")
                          .reduce((sum, e) => sum + e.amount / 6, 0) +
                        categoryExpenses
                          .filter((e) => e.frequency === "yearly")
                          .reduce((sum, e) => sum + e.amount / 12, 0);

                      // Calculate percentage of total
                      const allMonthlyExpenses =
                        overheadExpenses
                          .filter((e) => e.frequency === "monthly")
                          .reduce((sum, e) => sum + e.amount, 0) +
                        overheadExpenses
                          .filter((e) => e.frequency === "semi-annually")
                          .reduce((sum, e) => sum + e.amount / 6, 0) +
                        overheadExpenses
                          .filter((e) => e.frequency === "yearly")
                          .reduce((sum, e) => sum + e.amount / 12, 0);

                      const percentage =
                        allMonthlyExpenses > 0
                          ? (monthlyTotal / allMonthlyExpenses) * 100
                          : 0;

                      return (
                        <div key={category.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm font-medium">
                              $
                              {monthlyTotal.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                              /mo
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% of total expenses
                          </p>
                        </div>
                      );
                    })}
                    {!expenseCategories.some((category) =>
                      overheadExpenses.some((e) => e.category === category.name)
                    ) && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No expenses added yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setOverheadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Overhead expenses updated",
                  description:
                    "Your overhead expenses have been updated successfully.",
                });
                setOverheadModalOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Expense Dialog */}
      <Dialog open={newExpenseFormOpen} onOpenChange={setNewExpenseFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {newExpense.id ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <DialogDescription>
              {newExpense.id
                ? "Update the expense details below."
                : "Enter the details of your new expense."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="Enter expense name"
                value={newExpense.name}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount ($)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0"
                  value={newExpense.amount || ""}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      amount: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-frequency">Frequency</Label>
                <Select
                  value={newExpense.frequency}
                  onValueChange={(value) =>
                    setNewExpense({ ...newExpense, frequency: value })
                  }
                >
                  <SelectTrigger id="expense-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, category: value })
                }
              >
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {
                  expenseCategories.find(
                    (cat) => cat.name === newExpense.category
                  )?.description
                }
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setNewExpenseFormOpen(false);
                setNewExpense({
                  name: "",
                  amount: 0,
                  frequency: "monthly",
                  category: "Rent & Facilities",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newExpense.name || newExpense.amount <= 0) {
                  toast({
                    title: "Invalid expense",
                    description:
                      "Please provide a name and amount greater than zero.",
                    variant: "destructive",
                  });
                  return;
                }

                if (newExpense.id) {
                  // Update existing expense
                  setOverheadExpenses(
                    overheadExpenses.map((expense) =>
                      expense.id === newExpense.id ? newExpense : expense
                    )
                  );
                  toast({
                    title: "Expense updated",
                    description: `${newExpense.name} has been updated successfully.`,
                  });
                } else {
                  // Add new expense
                  const id = Math.random().toString(36).substring(2, 9);
                  setOverheadExpenses([
                    ...overheadExpenses,
                    { ...newExpense, id },
                  ]);
                  toast({
                    title: "Expense added",
                    description: `${newExpense.name} has been added to overhead expenses.`,
                  });
                }

                setNewExpenseFormOpen(false);
                setNewExpense({
                  name: "",
                  amount: 0,
                  frequency: "monthly",
                  category: "Rent & Facilities",
                });
              }}
            >
              {newExpense.id ? "Update Expense" : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Management Modal */}
      <Dialog open={employeesModalOpen} onOpenChange={setEmployeesModalOpen}>
        <DialogContent className="sm:max-w-[1220px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team & Payroll Management</DialogTitle>
            <DialogDescription>
              Manage your team members, payroll, and connected bank accounts.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="employees" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employees">Employees</TabsTrigger>
              {/* <TabsTrigger value="timecards">Timecards</TabsTrigger> */}
            </TabsList>

            <TabsContent value="employees" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Employee List</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    setEmployeesModalOpen(false);
                    router.push("/add-team-member");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
              <EmployeeList
                employees={mockEmployees}
                onUpdateEmployee={handleUpdateEmployee}
              />
            </TabsContent>

          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setEmployeesModalOpen(false)}
            >
              Close 
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payroll Review Dialog */}
      <Dialog
        open={showPayrollReviewDialog}
        onOpenChange={setShowPayrollReviewDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payroll Review</DialogTitle>
            <DialogDescription>
              Review payroll details carefully before processing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  You are about to process payroll for{" "}
                  {currentPayPeriodId
                    ? "a missed pay period"
                    : "the upcoming pay period"}
                  . This will initiate payments for all employees.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Pay Period Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {currentPayPeriodId ? (
                    // Missed pay period details
                    (() => {
                      const missedPeriod =
                        payPeriodAlerts.missedPayPeriods.find(
                          (p) => p.id === currentPayPeriodId
                        );
                      return missedPeriod ? (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Period:</div>
                          <div>
                            {new Date(
                              missedPeriod.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              missedPeriod.endDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">Pay Date:</div>
                          <div>
                            {new Date(
                              missedPeriod.payDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">Status:</div>
                          <div className="text-red-600">
                            {missedPeriod.daysOverdue} days overdue
                          </div>
                          <div className="text-muted-foreground">
                            Approved Hours:
                          </div>
                          <div>
                            {missedPeriod.accumulatedHours.approved} hours
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          Pay period details not found
                        </p>
                      );
                    })()
                  ) : (
                    // Current pay period details
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Period:</div>
                      <div>
                        {new Date(
                          payPeriodAlerts.nextPayPeriod.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          payPeriodAlerts.nextPayPeriod.endDate
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">Pay Date:</div>
                      <div>
                        {new Date(
                          payPeriodAlerts.nextPayPeriod.payDate
                        ).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">Employees:</div>
                      <div>
                        {
                          mockEmployees.filter((e) => e.status !== "inactive")
                            .length
                        }
                      </div>
                      <div className="text-muted-foreground">Hours:</div>
                      <div>
                        <span className="text-green-600">
                          {
                            payPeriodAlerts.nextPayPeriod.accumulatedHours
                              .approved
                          }
                        </span>
                        {payPeriodAlerts.nextPayPeriod.accumulatedHours
                          .pending > 0 && (
                          <span className="text-amber-600">
                            {" "}
                            /{" "}
                            {
                              payPeriodAlerts.nextPayPeriod.accumulatedHours
                                .pending
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">
                        Gross Payroll:
                      </div>
                      <div className="font-medium">$24,750.00</div>
                      <div className="text-muted-foreground">
                        Employee Taxes:
                      </div>
                      <div className="font-medium">$5,940.00</div>
                      <div className="text-muted-foreground">
                        Employer Taxes:
                      </div>
                      <div className="font-medium">$1,980.00</div>
                      <div className="text-muted-foreground">Deductions:</div>
                      <div className="font-medium">$2,475.00</div>
                      <div className="text-muted-foreground">Net Payroll:</div>
                      <div className="font-medium">$16,335.00</div>
                      <div className="text-muted-foreground">Total Cost:</div>
                      <div className="font-bold">$26,730.00</div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">From Account:</div>
                      <div>Business Checking (•••••••1234)</div>
                      <div className="text-muted-foreground">
                        Available Balance:
                      </div>
                      <div className="font-medium">$125,000.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Employee Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Employee</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead>Net Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>$4,615.38</TableCell>
                        <TableCell>$3,230.77</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>$3,653.85</TableCell>
                        <TableCell>$2,557.69</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bob Johnson</TableCell>
                        <TableCell>$3,825.00</TableCell>
                        <TableCell>$2,677.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Alice Brown</TableCell>
                        <TableCell>$2,800.00</TableCell>
                        <TableCell>$1,960.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Charlie Davis</TableCell>
                        <TableCell>$3,200.00</TableCell>
                        <TableCell>$2,240.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirmPayrollDetails" required />
                  <label
                    htmlFor="confirmPayrollDetails"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have reviewed and confirm these payroll details are
                    correct
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="authorizePayrollPayment" required />
                  <label
                    htmlFor="authorizePayrollPayment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I authorize these payments to be processed from the selected
                    account
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPayrollReviewDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmProcessPayroll}
              className="bg-green-600 hover:bg-green-700"
            >
              Process Payroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
