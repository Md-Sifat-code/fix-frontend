"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DollarSign,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  Info,
  Users,
  FileCheck,
  X,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types
interface Employee {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "pending" | "inactive"
  payType: "salary" | "hourly"
  payRate: number
  payFrequency: "weekly" | "biweekly" | "monthly"
  federalTaxWithholding: number
  stateTaxWithholding: number
  stateCode: string
  localTaxWithholding: number
  localityName?: string
  socialSecurity: number
  medicare: number
  retirement401k: number
  healthInsurance: number
  dentalInsurance: number
  visionInsurance: number
  otherDeductions: number
  directDepositSetup: boolean
  bankName?: string
  accountType?: "checking" | "savings"
  routingNumber?: string
  accountNumber?: string
  lastPayDate?: string
  ytdEarnings: number
  ytdTaxes: number
}

interface PayPeriod {
  id: string
  startDate: string
  endDate: string
  payDate: string
  status: "draft" | "processing" | "completed"
  totalGrossPay: number
  totalNetPay: number
  totalTaxes: number
  totalDeductions: number
  employeeCount: number
}

interface PayrollEntry {
  id: string
  employeeId: string
  employeeName: string
  payPeriodId: string
  regularHours: number
  overtimeHours: number
  grossPay: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  retirement401k: number
  healthInsurance: number
  otherDeductions: number
  netPay: number
}

interface BankAccount {
  id: string
  name: string
  accountType: "checking" | "savings"
  accountNumber: string
  routingNumber: string
  balance: number
  isDefault: boolean
}

interface Payment {
  id: string
  employeeId: string
  employeeName: string
  amount: number
  date: string
  status: "pending" | "processing" | "completed" | "failed"
  bankAccountId: string
  description: string
  reference: string
  taxDetails?: TaxDetails
}

interface TaxDetails {
  federalIncomeTax: number
  stateTax: number
  stateCode: string
  localTax: number
  localityName?: string
  socialSecurity: {
    employee: number
    employer: number
  }
  medicare: {
    employee: number
    employer: number
  }
  federalUnemployment: number
  stateUnemployment: number
  totalEmployeeTaxes: number
  totalEmployerTaxes: number
}

interface StateTaxInfo {
  code: string
  name: string
  incomeTaxRate: number
  hasLocalTax: boolean
  unemploymentRate: number
  minimumWage: number
  specialNotes?: string
}

interface Timecard {
  id: string
  employeeId: string
  weekStartDate: string
  weekEndDate: string
  totalHours: number
  status: "pending" | "approved" | "rejected"
  employeeName: string
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@architecturesimple.com",
    role: "Principal",
    department: "Management",
    status: "active",
    payType: "salary",
    payRate: 120000,
    payFrequency: "biweekly",
    federalTaxWithholding: 22,
    stateTaxWithholding: 5,
    stateCode: "CA",
    localTaxWithholding: 1,
    localityName: "San Francisco",
    socialSecurity: 6.2,
    medicare: 1.45,
    retirement401k: 5,
    healthInsurance: 250,
    dentalInsurance: 30,
    visionInsurance: 15,
    otherDeductions: 0,
    directDepositSetup: true,
    bankName: "Chase Bank",
    accountType: "checking",
    routingNumber: "•••••••••",
    accountNumber: "•••••••••",
    lastPayDate: "2023-04-15",
    ytdEarnings: 40000,
    ytdTaxes: 12000,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@architecturesimple.com",
    role: "Project Manager",
    department: "Architecture",
    status: "active",
    payType: "salary",
    payRate: 95000,
    payFrequency: "biweekly",
    federalTaxWithholding: 20,
    stateTaxWithholding: 4.25,
    stateCode: "NY",
    localTaxWithholding: 3.876,
    localityName: "New York City",
    socialSecurity: 6.2,
    medicare: 1.45,
    retirement401k: 4,
    healthInsurance: 250,
    dentalInsurance: 30,
    visionInsurance: 15,
    otherDeductions: 0,
    directDepositSetup: true,
    bankName: "Bank of America",
    accountType: "checking",
    routingNumber: "•••••••••",
    accountNumber: "•••••••••",
    lastPayDate: "2023-04-15",
    ytdEarnings: 31666,
    ytdTaxes: 9500,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@architecturesimple.com",
    role: "Architect",
    department: "Architecture",
    status: "active",
    payType: "hourly",
    payRate: 45,
    payFrequency: "biweekly",
    federalTaxWithholding: 18,
    stateTaxWithholding: 3.07,
    stateCode: "PA",
    localTaxWithholding: 0,
    socialSecurity: 6.2,
    medicare: 1.45,
    retirement401k: 3,
    healthInsurance: 250,
    dentalInsurance: 30,
    visionInsurance: 15,
    otherDeductions: 0,
    directDepositSetup: true,
    bankName: "Wells Fargo",
    accountType: "checking",
    routingNumber: "•••••••••",
    accountNumber: "•••••••••",
    lastPayDate: "2023-04-15",
    ytdEarnings: 28000,
    ytdTaxes: 8400,
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@architecturesimple.com",
    role: "Designer",
    department: "Design",
    status: "pending",
    payType: "hourly",
    payRate: 35,
    payFrequency: "biweekly",
    federalTaxWithholding: 15,
    stateTaxWithholding: 4.95,
    stateCode: "IL",
    localTaxWithholding: 0,
    socialSecurity: 6.2,
    medicare: 1.45,
    retirement401k: 3,
    healthInsurance: 250,
    dentalInsurance: 30,
    visionInsurance: 15,
    otherDeductions: 0,
    directDepositSetup: false,
    ytdEarnings: 0,
    ytdTaxes: 0,
  },
]

const mockPayPeriods: PayPeriod[] = [
  {
    id: "pp1",
    startDate: "2023-04-01",
    endDate: "2023-04-15",
    payDate: "2023-04-20",
    status: "completed",
    totalGrossPay: 18750,
    totalNetPay: 13125,
    totalTaxes: 4125,
    totalDeductions: 1500,
    employeeCount: 3,
  },
  {
    id: "pp2",
    startDate: "2023-04-16",
    endDate: "2023-04-30",
    payDate: "2023-05-05",
    status: "processing",
    totalGrossPay: 18750,
    totalNetPay: 13125,
    totalTaxes: 4125,
    totalDeductions: 1500,
    employeeCount: 3,
  },
  {
    id: "pp3",
    startDate: "2023-05-01",
    endDate: "2023-05-15",
    payDate: "2023-05-20",
    status: "draft",
    totalGrossPay: 0,
    totalNetPay: 0,
    totalTaxes: 0,
    totalDeductions: 0,
    employeeCount: 4,
  },
]

const mockPayrollEntries: PayrollEntry[] = [
  {
    id: "pe1",
    employeeId: "1",
    employeeName: "John Doe",
    payPeriodId: "pp2",
    regularHours: 80,
    overtimeHours: 0,
    grossPay: 4615.38,
    federalTax: 1015.38,
    stateTax: 230.77,
    socialSecurity: 286.15,
    medicare: 66.92,
    retirement401k: 230.77,
    healthInsurance: 125,
    otherDeductions: 45,
    netPay: 2615.39,
  },
  {
    id: "pe2",
    employeeId: "2",
    employeeName: "Jane Smith",
    payPeriodId: "pp2",
    regularHours: 80,
    overtimeHours: 0,
    grossPay: 3653.85,
    federalTax: 730.77,
    stateTax: 182.69,
    socialSecurity: 226.54,
    medicare: 52.98,
    retirement401k: 146.15,
    healthInsurance: 125,
    otherDeductions: 45,
    netPay: 2144.72,
  },
  {
    id: "pe3",
    employeeId: "3",
    employeeName: "Bob Johnson",
    payPeriodId: "pp2",
    regularHours: 80,
    overtimeHours: 5,
    grossPay: 3825,
    federalTax: 688.5,
    stateTax: 191.25,
    socialSecurity: 237.15,
    medicare: 55.46,
    retirement401k: 114.75,
    healthInsurance: 125,
    otherDeductions: 45,
    netPay: 2367.89,
  },
]

// Mock bank accounts
const mockBankAccounts: BankAccount[] = [
  {
    id: "ba1",
    name: "Business Checking",
    accountType: "checking",
    accountNumber: "•••••••1234",
    routingNumber: "•••••••5678",
    balance: 125000,
    isDefault: true,
  },
  {
    id: "ba2",
    name: "Business Savings",
    accountType: "savings",
    accountNumber: "•••••••5678",
    routingNumber: "•••••••5678",
    balance: 250000,
    isDefault: false,
  },
]

// Mock payment history
const mockPayments: Payment[] = [
  {
    id: "pmt1",
    employeeId: "1",
    employeeName: "John Doe",
    amount: 4615.38,
    date: "2023-04-20",
    status: "completed",
    bankAccountId: "ba1",
    description: "Salary payment for Apr 1-15",
    reference: "PAY-2023-04-20-001",
    taxDetails: {
      federalIncomeTax: 1015.38,
      stateTax: 230.77,
      stateCode: "CA",
      localTax: 46.15,
      localityName: "San Francisco",
      socialSecurity: {
        employee: 286.15,
        employer: 286.15,
      },
      medicare: {
        employee: 66.92,
        employer: 66.92,
      },
      federalUnemployment: 27.69,
      stateUnemployment: 138.46,
      totalEmployeeTaxes: 1645.37,
      totalEmployerTaxes: 519.22,
    },
  },
  {
    id: "pmt2",
    employeeId: "2",
    employeeName: "Jane Smith",
    amount: 3653.85,
    date: "2023-04-20",
    status: "completed",
    bankAccountId: "ba1",
    description: "Salary payment for Apr 1-15",
    reference: "PAY-2023-04-20-002",
    taxDetails: {
      federalIncomeTax: 730.77,
      stateTax: 155.29,
      stateCode: "NY",
      localTax: 141.62,
      localityName: "New York City",
      socialSecurity: {
        employee: 226.54,
        employer: 226.54,
      },
      medicare: {
        employee: 52.98,
        employer: 52.98,
      },
      federalUnemployment: 21.92,
      stateUnemployment: 109.62,
      totalEmployeeTaxes: 1307.2,
      totalEmployerTaxes: 411.06,
    },
  },
  {
    id: "pmt3",
    employeeId: "3",
    employeeName: "Bob Johnson",
    amount: 3825,
    date: "2023-04-20",
    status: "completed",
    bankAccountId: "ba1",
    description: "Salary payment for Apr 1-15",
    reference: "PAY-2023-04-20-003",
    taxDetails: {
      federalIncomeTax: 688.5,
      stateTax: 117.43,
      stateCode: "PA",
      localTax: 0,
      socialSecurity: {
        employee: 237.15,
        employer: 237.15,
      },
      medicare: {
        employee: 55.46,
        employer: 55.46,
      },
      federalUnemployment: 22.95,
      stateUnemployment: 114.75,
      totalEmployeeTaxes: 1098.54,
      totalEmployerTaxes: 430.31,
    },
  },
]

// Mock timecards
const mockTimecards: Timecard[] = [
  {
    id: "tc1",
    employeeId: "1",
    weekStartDate: "2024-01-01",
    weekEndDate: "2024-01-07",
    totalHours: 40,
    status: "approved",
    employeeName: "John Doe",
  },
  {
    id: "tc2",
    employeeId: "2",
    weekStartDate: "2024-01-01",
    weekEndDate: "2024-01-07",
    totalHours: 45,
    status: "pending",
    employeeName: "Jane Smith",
  },
  {
    id: "tc3",
    employeeId: "3",
    weekStartDate: "2024-01-01",
    weekEndDate: "2024-01-07",
    totalHours: 35,
    status: "rejected",
    employeeName: "Bob Johnson",
  },
]

// State tax information database
const stateTaxInfo: StateTaxInfo[] = [
  { code: "AL", name: "Alabama", incomeTaxRate: 5.0, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 7.25 },
  { code: "AK", name: "Alaska", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 1.5, minimumWage: 10.34 },
  { code: "AZ", name: "Arizona", incomeTaxRate: 2.59, hasLocalTax: false, unemploymentRate: 2.0, minimumWage: 13.85 },
  { code: "AR", name: "Arkansas", incomeTaxRate: 4.9, hasLocalTax: false, unemploymentRate: 3.1, minimumWage: 11.0 },
  {
    code: "CA",
    name: "California",
    incomeTaxRate: 9.3,
    hasLocalTax: true,
    unemploymentRate: 3.4,
    minimumWage: 15.5,
    specialNotes: "Progressive tax brackets from 1% to 12.3%. Additional 1% surcharge on income over $1 million.",
  },
  { code: "CO", name: "Colorado", incomeTaxRate: 4.55, hasLocalTax: false, unemploymentRate: 1.7, minimumWage: 13.65 },
  { code: "CT", name: "Connecticut", incomeTaxRate: 5.5, hasLocalTax: false, unemploymentRate: 3.2, minimumWage: 15.0 },
  { code: "DE", name: "Delaware", incomeTaxRate: 6.6, hasLocalTax: false, unemploymentRate: 1.8, minimumWage: 11.75 },
  { code: "FL", name: "Florida", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 12.0 },
  { code: "GA", name: "Georgia", incomeTaxRate: 5.75, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 7.25 },
  { code: "HI", name: "Hawaii", incomeTaxRate: 7.25, hasLocalTax: false, unemploymentRate: 2.4, minimumWage: 14.0 },
  { code: "ID", name: "Idaho", incomeTaxRate: 6.5, hasLocalTax: false, unemploymentRate: 1.0, minimumWage: 7.25 },
  { code: "IL", name: "Illinois", incomeTaxRate: 4.95, hasLocalTax: false, unemploymentRate: 3.1, minimumWage: 13.0 },
  { code: "IN", name: "Indiana", incomeTaxRate: 3.23, hasLocalTax: true, unemploymentRate: 2.5, minimumWage: 7.25 },
  { code: "IA", name: "Iowa", incomeTaxRate: 4.4, hasLocalTax: false, unemploymentRate: 1.8, minimumWage: 7.25 },
  { code: "KS", name: "Kansas", incomeTaxRate: 5.7, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 7.25 },
  { code: "KY", name: "Kentucky", incomeTaxRate: 4.5, hasLocalTax: true, unemploymentRate: 2.2, minimumWage: 7.25 },
  { code: "LA", name: "Louisiana", incomeTaxRate: 4.25, hasLocalTax: false, unemploymentRate: 2.0, minimumWage: 7.25 },
  { code: "ME", name: "Maine", incomeTaxRate: 7.15, hasLocalTax: false, unemploymentRate: 1.93, minimumWage: 14.15 },
  { code: "MD", name: "Maryland", incomeTaxRate: 5.75, hasLocalTax: true, unemploymentRate: 2.2, minimumWage: 13.25 },
  {
    code: "MA",
    name: "Massachusetts",
    incomeTaxRate: 5.0,
    hasLocalTax: false,
    unemploymentRate: 2.42,
    minimumWage: 15.0,
  },
  { code: "MI", name: "Michigan", incomeTaxRate: 4.25, hasLocalTax: true, unemploymentRate: 2.7, minimumWage: 10.33 },
  { code: "MN", name: "Minnesota", incomeTaxRate: 7.85, hasLocalTax: false, unemploymentRate: 1.8, minimumWage: 10.59 },
  { code: "MS", name: "Mississippi", incomeTaxRate: 5.0, hasLocalTax: false, unemploymentRate: 1.2, minimumWage: 7.25 },
  { code: "MO", name: "Missouri", incomeTaxRate: 5.3, hasLocalTax: true, unemploymentRate: 2.376, minimumWage: 12.3 },
  { code: "MT", name: "Montana", incomeTaxRate: 6.75, hasLocalTax: false, unemploymentRate: 1.7, minimumWage: 9.95 },
  { code: "NE", name: "Nebraska", incomeTaxRate: 6.84, hasLocalTax: false, unemploymentRate: 1.25, minimumWage: 10.5 },
  { code: "NV", name: "Nevada", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 1.95, minimumWage: 12.0 },
  {
    code: "NH",
    name: "New Hampshire",
    incomeTaxRate: 5.0,
    hasLocalTax: false,
    unemploymentRate: 1.7,
    minimumWage: 7.25,
    specialNotes: "Only taxes interest and dividend income, not wages.",
  },
  {
    code: "NJ",
    name: "New Jersey",
    incomeTaxRate: 5.525,
    hasLocalTax: false,
    unemploymentRate: 3.4,
    minimumWage: 14.13,
  },
  { code: "NM", name: "New Mexico", incomeTaxRate: 5.9, hasLocalTax: false, unemploymentRate: 1.9, minimumWage: 12.0 },
  {
    code: "NY",
    name: "New York",
    incomeTaxRate: 6.33,
    hasLocalTax: true,
    unemploymentRate: 3.2,
    minimumWage: 15.0,
    specialNotes: "New York City and Yonkers have additional local income taxes.",
  },
  {
    code: "NC",
    name: "North Carolina",
    incomeTaxRate: 4.75,
    hasLocalTax: false,
    unemploymentRate: 1.2,
    minimumWage: 7.25,
  },
  {
    code: "ND",
    name: "North Dakota",
    incomeTaxRate: 2.9,
    hasLocalTax: false,
    unemploymentRate: 1.0,
    minimumWage: 7.25,
  },
  { code: "OH", name: "Ohio", incomeTaxRate: 3.99, hasLocalTax: true, unemploymentRate: 2.7, minimumWage: 10.45 },
  { code: "OK", name: "Oklahoma", incomeTaxRate: 4.75, hasLocalTax: false, unemploymentRate: 1.5, minimumWage: 7.25 },
  { code: "OR", name: "Oregon", incomeTaxRate: 9.9, hasLocalTax: true, unemploymentRate: 1.97, minimumWage: 13.2 },
  {
    code: "PA",
    name: "Pennsylvania",
    incomeTaxRate: 3.07,
    hasLocalTax: true,
    unemploymentRate: 3.6,
    minimumWage: 7.25,
    specialNotes: "Flat tax rate. Many municipalities impose local income taxes.",
  },
  {
    code: "RI",
    name: "Rhode Island",
    incomeTaxRate: 5.99,
    hasLocalTax: false,
    unemploymentRate: 1.9,
    minimumWage: 13.0,
  },
  {
    code: "SC",
    name: "South Carolina",
    incomeTaxRate: 7.0,
    hasLocalTax: false,
    unemploymentRate: 1.11,
    minimumWage: 7.25,
  },
  { code: "SD", name: "South Dakota", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 1.2, minimumWage: 10.8 },
  { code: "TN", name: "Tennessee", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 7.25 },
  { code: "TX", name: "Texas", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 7.25 },
  { code: "UT", name: "Utah", incomeTaxRate: 4.95, hasLocalTax: false, unemploymentRate: 2.7, minimumWage: 7.25 },
  { code: "VT", name: "Vermont", incomeTaxRate: 8.75, hasLocalTax: false, unemploymentRate: 1.0, minimumWage: 13.67 },
  { code: "VA", name: "Virginia", incomeTaxRate: 5.75, hasLocalTax: false, unemploymentRate: 2.5, minimumWage: 12.0 },
  { code: "WA", name: "Washington", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 1.16, minimumWage: 15.74 },
  {
    code: "WV",
    name: "West Virginia",
    incomeTaxRate: 6.5,
    hasLocalTax: false,
    unemploymentRate: 2.7,
    minimumWage: 8.75,
  },
  { code: "WI", name: "Wisconsin", incomeTaxRate: 7.65, hasLocalTax: false, unemploymentRate: 3.25, minimumWage: 7.25 },
  { code: "WY", name: "Wyoming", incomeTaxRate: 0, hasLocalTax: false, unemploymentRate: 1.67, minimumWage: 7.25 },
  {
    code: "DC",
    name: "District of Columbia",
    incomeTaxRate: 9.75,
    hasLocalTax: false,
    unemploymentRate: 2.7,
    minimumWage: 17.0,
  },
]

interface EmployeeListProps {
  employees: Employee[]
  onUpdateEmployee: (employee: Employee) => void
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onUpdateEmployee }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Pay Type</TableHead>
            <TableHead>Pay Rate</TableHead>
            <TableHead>YTD Earnings</TableHead>
            <TableHead>YTD Taxes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell className="capitalize">{employee.payType}</TableCell>
              <TableCell>
                {employee.payType === "salary"
                  ? formatCurrency(employee.payRate) + "/year"
                  : formatCurrency(employee.payRate) + "/hour"}
              </TableCell>
              <TableCell>{formatCurrency(employee.ytdEarnings)}</TableCell>
              <TableCell>{formatCurrency(employee.ytdTaxes)}</TableCell>
              <TableCell>
                {employee.status === "active" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                )}
                {employee.status === "inactive" && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    Pay
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Send Payment</DropdownMenuItem>
                      <DropdownMenuItem>Payment History</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Pay Information</DropdownMenuItem>
                      <DropdownMenuItem>Tax Documents</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function PayrollManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>(mockPayPeriods)
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>(mockPayrollEntries)
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<string>(mockPayPeriods[1].id)
  const [showDirectDepositDialog, setShowDirectDepositDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showRunPayrollDialog, setShowRunPayrollDialog] = useState(false)
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false)
  const [showEmployeeDetailsDialog, setShowEmployeeDetailsDialog] = useState(false)
  const [showAddPayPeriodDialog, setShowAddPayPeriodDialog] = useState(false)
  const [newPayPeriod, setNewPayPeriod] = useState({
    startDate: "",
    endDate: "",
    payDate: "",
  })

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts)
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [showSendPaymentDialog, setShowSendPaymentDialog] = useState(false)
  const [showTaxComplianceDialog, setShowTaxComplianceDialog] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<{
    employee: Employee | null
    amount: number
    description: string
    selectedBankAccount: string
    taxDetails?: TaxDetails
  }>({
    employee: null,
    amount: 0,
    description: "",
    selectedBankAccount: mockBankAccounts.find((acc) => acc.isDefault)?.id || "",
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showPaymentHistoryDialog, setShowPaymentHistoryDialog] = useState(false)
  const [showTaxDetailsDialog, setShowTaxDetailsDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [selectedState, setSelectedState] = useState<string>("")
  const [stateNotes, setStateNotes] = useState<string>("")
  const [employeesModalOpen, setEmployeesModalOpen] = useState(false)
  const [timecards, setTimecards] = useState<Timecard[]>(mockTimecards)

  // Get current pay period
  const currentPayPeriod = payPeriods.find((pp) => pp.id === selectedPayPeriod)

  // Get entries for current pay period
  const currentPayrollEntries = payrollEntries.filter((entry) => entry.payPeriodId === selectedPayPeriod)

  // Handle direct deposit setup
  const handleSetupDirectDeposit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDirectDepositDialog(true)
  }

  const handleSaveDirectDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return

    // Update employee with direct deposit info
    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id
        ? { ...selectedEmployee, directDepositSetup: true, status: "active" as const }
        : emp,
    )

    setEmployees(updatedEmployees)
    setShowDirectDepositDialog(false)

    toast({
      title: "Direct deposit setup complete",
      description: `Direct deposit information for ${selectedEmployee.name} has been saved.`,
      duration: 3000,
    })
  }

  // Handle run payroll
  const handleRunPayroll = () => {
    if (!currentPayPeriod || currentPayPeriod.status !== "draft") return
    setShowRunPayrollDialog(true)
  }

  const processPayroll = async () => {
    setIsProcessingPayroll(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update pay period status
    const updatedPayPeriods = payPeriods.map((pp) =>
      pp.id === selectedPayPeriod ? { ...pp, status: "processing" as const } : pp,
    )

    setPayPeriods(updatedPayPeriods)
    setIsProcessingPayroll(false)
    setShowRunPayrollDialog(false)

    toast({
      title: "Payroll processing initiated",
      description: `Payroll for period ${currentPayPeriod?.startDate} to ${currentPayPeriod?.endDate} is now processing.`,
      duration: 3000,
    })
  }
  // Handle view employee details
  const handleViewEmployeeDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeDetailsDialog(true)
  }

  // Handle add pay period
  const handleAddPayPeriod = (e: React.FormEvent) => {
    e.preventDefault()

    const newId = `pp${payPeriods.length + 1}`
    const newPeriod: PayPeriod = {
      id: newId,
      startDate: newPayPeriod.startDate,
      endDate: newPayPeriod.endDate,
      payDate: newPayPeriod.payDate,
      status: "draft",
      totalGrossPay: 0,
      totalNetPay: 0,
      totalTaxes: 0,
      totalDeductions: 0,
      employeeCount: employees.filter((e) => e.status === "active").length,
    }

    setPayPeriods([...payPeriods, newPeriod])
    setSelectedPayPeriod(newId)
    setShowAddPayPeriodDialog(false)

    toast({
      title: "Pay period added",
      description: `New pay period from ${newPayPeriod.startDate} to ${newPayPeriod.endDate} has been created.`,
      duration: 3000,
    })
  }

  // Calculate tax details for an employee payment
  const calculateTaxDetails = (employee: Employee, grossAmount: number): TaxDetails => {
    // Get state tax info
    const stateInfo = stateTaxInfo.find((state) => state.code === employee.stateCode) || {
      code: "XX",
      name: "Unknown",
      incomeTaxRate: 0,
      hasLocalTax: false,
      unemploymentRate: 0,
      minimumWage: 7.25,
    }

    // Calculate taxes
    const federalIncomeTax = grossAmount * (employee.federalTaxWithholding / 100)
    const stateTax = grossAmount * (employee.stateTaxWithholding / 100)
    const localTax = grossAmount * (employee.localTaxWithholding / 100)

    // FICA taxes
    const socialSecurityEmployee = grossAmount * (employee.socialSecurity / 100)
    const socialSecurityEmployer = grossAmount * (employee.socialSecurity / 100)
    const medicareEmployee = grossAmount * (employee.medicare / 100)
    const medicareEmployer = grossAmount * (employee.medicare / 100)

    // Unemployment taxes
    const federalUnemployment = grossAmount * 0.006 // 0.6% FUTA
    const stateUnemployment = grossAmount * (stateInfo.unemploymentRate / 100)

    // Calculate totals
    const totalEmployeeTaxes = federalIncomeTax + stateTax + localTax + socialSecurityEmployee + medicareEmployee
    const totalEmployerTaxes = socialSecurityEmployer + medicareEmployer + federalUnemployment + stateUnemployment

    return {
      federalIncomeTax,
      stateTax,
      stateCode: employee.stateCode,
      localTax,
      localityName: employee.localityName,
      socialSecurity: {
        employee: socialSecurityEmployee,
        employer: socialSecurityEmployer,
      },
      medicare: {
        employee: medicareEmployee,
        employer: medicareEmployer,
      },
      federalUnemployment,
      stateUnemployment,
      totalEmployeeTaxes,
      totalEmployerTaxes,
    }
  }

  // Handle send payment
  const handleSendPayment = (employee: Employee) => {
    // Calculate default payment amount based on pay type
    let defaultAmount = 0
    if (employee.payType === "salary") {
      // Bi-weekly salary
      defaultAmount = employee.payRate / 26
    } else {
      // Hourly rate * 80 hours (two weeks)
      defaultAmount = employee.payRate * 80
    }

    // Calculate tax details
    const taxDetails = calculateTaxDetails(employee, defaultAmount)

    setPaymentDetails({
      employee,
      amount: defaultAmount,
      description: `Salary payment for ${currentPayPeriod?.startDate} to ${currentPayPeriod?.endDate}`,
      selectedBankAccount: bankAccounts.find((acc) => acc.isDefault)?.id || "",
      taxDetails,
    })

    // Show tax compliance dialog first
    setShowTaxComplianceDialog(true)
  }

  // Handle tax compliance confirmation
  const handleTaxComplianceConfirm = () => {
    setShowTaxComplianceDialog(false)
    setShowSendPaymentDialog(true)
  }

  // View tax details for a payment
  const handleViewTaxDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowTaxDetailsDialog(true)
  }

  // Handle state selection for tax information
  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode)
    const stateInfo = stateTaxInfo.find((state) => state.code === stateCode)
    setStateNotes(stateInfo?.specialNotes || "")
  }

  // Process payment
  const processPayment = async () => {
    if (!paymentDetails.employee || !paymentDetails.selectedBankAccount) return

    setIsProcessingPayment(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newPayment: Payment = {
      id: `pmt${payments.length + 1}`,
      employeeId: paymentDetails.employee.id,
      employeeName: paymentDetails.employee.name,
      amount: paymentDetails.amount,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      bankAccountId: paymentDetails.selectedBankAccount,
      description: paymentDetails.description,
      reference: `PAY-${new Date().toISOString().split("T")[0]}-${(payments.length + 1).toString().padStart(3, "0")}`,
      taxDetails: paymentDetails.taxDetails,
    }

    // Update bank account balance - include employer taxes in the total withdrawal
    const totalWithdrawal = paymentDetails.amount + (paymentDetails.taxDetails?.totalEmployerTaxes || 0)
    const updatedBankAccounts = bankAccounts.map((account) =>
      account.id === paymentDetails.selectedBankAccount
        ? { ...account, balance: account.balance - totalWithdrawal }
        : account,
    )

    setBankAccounts(updatedBankAccounts)
    setPayments([...payments, newPayment])
    setIsProcessingPayment(false)
    setShowSendPaymentDialog(false)

    toast({
      title: "Payment sent successfully",
      description: `Payment of ${formatCurrency(paymentDetails.amount)} has been sent to ${paymentDetails.employee.name}.`,
      duration: 3000,
    })
  }

  // View payment history
  const handleViewPaymentHistory = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowPaymentHistoryDialog(true)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const handleUpdateEmployee = (employee: Employee) => {
    setEmployees(employees.map((e) => (e.id === employee.id ? employee : e)))
  }

  useEffect(() => {
    const handleTeamManagementEvent = (event: CustomEvent) => {
      const { integrateWithPayroll, pendingApprovals } = event.detail
      if (integrateWithPayroll) {
        setEmployeesModalOpen(true)
        // If there are pending approvals, automatically switch to the timecards tab
        if (pendingApprovals > 0) {
          // Find the timecards tab and click it
          setTimeout(() => {
            const timecardsTab = document.querySelector('[value="timecards"]')
            if (timecardsTab) {
              ;(timecardsTab as HTMLElement).click()
            }
          }, 100)
        }
      }
    }

    window.addEventListener("open-team-management", handleTeamManagementEvent as EventListener)

    return () => {
      window.removeEventListener("open-team-management", handleTeamManagementEvent as EventListener)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Payroll Management</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setShowAddPayPeriodDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Pay Period
          </Button>
          <Select value={selectedPayPeriod} onValueChange={setSelectedPayPeriod}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select pay period" />
            </SelectTrigger>
            <SelectContent>
              {payPeriods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {formatDate(period.startDate)} - {formatDate(period.endDate)}
                  {period.status === "draft" && " (Draft)"}
                  {period.status === "processing" && " (Processing)"}
                  {period.status === "completed" && " (Completed)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentPayPeriod && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  Pay Period: {formatDate(currentPayPeriod.startDate)} - {formatDate(currentPayPeriod.endDate)}
                </CardTitle>
                <CardDescription>
                  Pay Date: {formatDate(currentPayPeriod.payDate)} •{currentPayPeriod.status === "draft" && " Draft"}
                  {currentPayPeriod.status === "processing" && " Processing"}
                  {currentPayPeriod.status === "completed" && " Completed"}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                {currentPayPeriod.status === "draft" && (
                  <Button onClick={handleRunPayroll}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Run Payroll
                  </Button>
                )}
                {currentPayPeriod.status === "processing" && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Processing
                  </Badge>
                )}
                {currentPayPeriod.status === "completed" && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Reports
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="integrated-view">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="integrated-view">Payroll Dashboard</TabsTrigger>
                <TabsTrigger value="detailed-view">Employee Details</TabsTrigger>
                <TabsTrigger value="pending-setup">
                  Pending Setup ({employees.filter((e) => e.status === "pending").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="integrated-view" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(currentPayPeriod.totalGrossPay)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(currentPayPeriod.totalNetPay)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Taxes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(currentPayPeriod.totalTaxes)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(currentPayPeriod.totalDeductions)}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Payroll Entries</h3>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search employees..." className="w-[250px]" />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Pay Type</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Gross Pay</TableHead>
                        <TableHead>Taxes</TableHead>
                        <TableHead>Net Pay</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPayrollEntries.length > 0 ? (
                        currentPayrollEntries.map((entry) => {
                          const employee = employees.find((e) => e.id === entry.employeeId)
                          return (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">{entry.employeeName}</TableCell>
                              <TableCell>{employee?.department || "—"}</TableCell>
                              <TableCell className="capitalize">{employee?.payType || "—"}</TableCell>
                              <TableCell>{entry.regularHours + entry.overtimeHours}</TableCell>
                              <TableCell>{formatCurrency(entry.grossPay)}</TableCell>
                              <TableCell>
                                {formatCurrency(
                                  entry.federalTax + entry.stateTax + entry.socialSecurity + entry.medicare,
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{formatCurrency(entry.netPay)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => employee && handleViewEmployeeDetails(employee)}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => employee && handleSendPayment(employee)}
                                  >
                                    <DollarSign className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            {currentPayPeriod.status === "draft"
                              ? "No payroll entries yet. Run payroll to generate entries."
                              : "No payroll entries found for this period."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="detailed-view">
                <div className="flex justify-between items-center mb-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search employees..." className="w-[300px]" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Pay Type</TableHead>
                        <TableHead>Pay Rate</TableHead>
                        <TableHead>YTD Earnings</TableHead>
                        <TableHead>YTD Taxes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees
                        .filter((e) => e.status !== "pending")
                        .map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell className="capitalize">{employee.payType}</TableCell>
                            <TableCell>
                              {employee.payType === "salary"
                                ? formatCurrency(employee.payRate) + "/year"
                                : formatCurrency(employee.payRate) + "/hour"}
                            </TableCell>
                            <TableCell>{formatCurrency(employee.ytdEarnings)}</TableCell>
                            <TableCell>{formatCurrency(employee.ytdTaxes)}</TableCell>
                            <TableCell>
                              {employee.status === "active" && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Active
                                </Badge>
                              )}
                              {employee.status === "inactive" && (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendPayment(employee)}
                                  className="flex items-center"
                                >
                                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                                  Pay
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleSendPayment(employee)}>
                                      Send Payment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewPaymentHistory(employee)}>
                                      Payment History
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleViewEmployeeDetails(employee)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit Pay Information</DropdownMenuItem>
                                    <DropdownMenuItem>Tax Documents</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Set a data attribute to enable special styling
                    const event = new CustomEvent("open-team-management", {
                      detail: {
                        integrateWithPayroll: true,
                        pendingApprovals: timecards.filter((t) => t.status === "pending").length,
                      },
                    })
                    window.dispatchEvent(event)
                    setEmployeesModalOpen(true)
                  }}
                  className="w-full text-xs"
                >
                  <Users className="h-3 w-3 mr-1.5" />
                  Manage Team
                </Button>
              </TabsContent>

              <TabsContent value="pending-setup">
                <div className="mt-6">
                  {employees.filter((e) => e.status === "pending").length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-md">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">All employees are set up</h3>
                      <p className="text-muted-foreground">There are no employees pending direct deposit setup.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-amber-800">
                            The following employees need to complete their direct deposit setup before they can be
                            included in payroll.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employees
                              .filter((e) => e.status === "pending")
                              .map((employee) => (
                                <TableRow key={employee.id}>
                                  <TableCell className="font-medium">{employee.name}</TableCell>
                                  <TableCell>{employee.email}</TableCell>
                                  <TableCell>{employee.role}</TableCell>
                                  <TableCell>{employee.department}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                      Pending Setup
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button size="sm" onClick={() => handleSetupDirectDeposit(employee)}>
                                      Setup Direct Deposit
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Direct Deposit Setup Dialog */}
      <Dialog open={showDirectDepositDialog} onOpenChange={setShowDirectDepositDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Setup Direct Deposit</DialogTitle>
            <DialogDescription>Enter the direct deposit information for {selectedEmployee?.name}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveDirectDeposit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bankName" className="text-right">
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  className="col-span-3"
                  value={selectedEmployee?.bankName || ""}
                  onChange={(e) => setSelectedEmployee((prev) => (prev ? { ...prev, bankName: e.target.value } : null))}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountType" className="text-right">
                  Account Type
                </Label>
                <Select
                  value={selectedEmployee?.accountType || "checking"}
                  onValueChange={(value) =>
                    setSelectedEmployee((prev) =>
                      prev ? { ...prev, accountType: value as "checking" | "savings" } : null,
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="routingNumber" className="text-right">
                  Routing Number
                </Label>
                <Input
                  id="routingNumber"
                  className="col-span-3"
                  value={selectedEmployee?.routingNumber || ""}
                  onChange={(e) =>
                    setSelectedEmployee((prev) => (prev ? { ...prev, routingNumber: e.target.value } : null))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountNumber" className="text-right">
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  className="col-span-3"
                  value={selectedEmployee?.accountNumber || ""}
                  onChange={(e) =>
                    setSelectedEmployee((prev) => (prev ? { ...prev, accountNumber: e.target.value } : null))
                  }
                  required
                />
              </div>
              <div className="col-span-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirmInfo" required />
                  <label
                    htmlFor="confirmInfo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm this information is correct and authorize direct deposit to this account
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDirectDepositDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Direct Deposit Information</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Run Payroll Dialog */}
      <Dialog open={showRunPayrollDialog} onOpenChange={setShowRunPayrollDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
            <DialogDescription>
              You are about to process payroll for the period {currentPayPeriod?.startDate} to{" "}
              {currentPayPeriod?.endDate}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md border p-4 mb-4">
              <h4 className="font-medium mb-2">Payroll Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Pay Period:</div>
                <div>
                  {formatDate(currentPayPeriod?.startDate || "")} - {formatDate(currentPayPeriod?.endDate || "")}
                </div>
                <div>Pay Date:</div>
                <div>{formatDate(currentPayPeriod?.payDate || "")}</div>
                <div>Employees:</div>
                <div>{employees.filter((e) => e.status === "active").length}</div>
                <div>Estimated Total:</div>
                <div>
                  {formatCurrency(
                    employees
                      .filter((e) => e.status === "active")
                      .reduce((sum, emp) => sum + (emp.payType === "salary" ? emp.payRate / 26 : emp.payRate * 80), 0),
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="confirmPayroll" required />
                <label
                  htmlFor="confirmPayroll"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that all employee information and hours are correct
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="authorizePayroll" required />
                <label
                  htmlFor="authorizePayroll"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I authorize the processing of this payroll and associated tax payments
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowRunPayrollDialog(false)}>
              Cancel
            </Button>
            <Button onClick={processPayroll} disabled={isProcessingPayroll} className="bg-green-600 hover:bg-green-700">
              {isProcessingPayroll ? "Processing..." : "Process Payroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={showEmployeeDetailsDialog} onOpenChange={setShowEmployeeDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>Detailed information for {selectedEmployee?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="pay-info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pay-info">Pay Information</TabsTrigger>
                <TabsTrigger value="tax-info">Tax Information</TabsTrigger>
                <TabsTrigger value="deductions">Deductions</TabsTrigger>
              </TabsList>

              <TabsContent value="pay-info" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Pay Type</Label>
                    <p className="font-medium capitalize">{selectedEmployee?.payType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Pay Rate</Label>
                    <p className="font-medium">
                      {selectedEmployee?.payType === "salary"
                        ? formatCurrency(selectedEmployee?.payRate || 0) + "/year"
                        : formatCurrency(selectedEmployee?.payRate || 0) + "/hour"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Pay Frequency</Label>
                    <p className="font-medium capitalize">{selectedEmployee?.payFrequency}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Last Pay Date</Label>
                    <p className="font-medium">
                      {selectedEmployee?.lastPayDate ? formatDate(selectedEmployee.lastPayDate) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">YTD Earnings</Label>
                    <p className="font-medium">{formatCurrency(selectedEmployee?.ytdEarnings || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">YTD Taxes</Label>
                    <p className="font-medium">{formatCurrency(selectedEmployee?.ytdTaxes || 0)}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Direct Deposit Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">Bank Name</Label>
                      <p className="font-medium">{selectedEmployee?.bankName || "Not set up"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Account Type</Label>
                      <p className="font-medium capitalize">{selectedEmployee?.accountType || "Not set up"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Routing Number</Label>
                      <p className="font-medium">{selectedEmployee?.routingNumber || "Not set up"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">Account Number</Label>
                      <p className="font-medium">{selectedEmployee?.accountNumber || "Not set up"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tax-info" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Federal Tax Withholding</Label>
                    <p className="font-medium">{selectedEmployee?.federalTaxWithholding}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">State</Label>
                    <p className="font-medium">
                      {selectedEmployee?.stateCode} (
                      {stateTaxInfo.find((s) => s.code === selectedEmployee?.stateCode)?.name})
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">State Tax Withholding</Label>
                    <p className="font-medium">{selectedEmployee?.stateTaxWithholding}%</p>
                  </div>
                  {selectedEmployee?.localTaxWithholding > 0 && (
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Local Tax ({selectedEmployee?.localityName})
                      </Label>
                      <p className="font-medium">{selectedEmployee?.localTaxWithholding}%</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground text-sm">Social Security</Label>
                    <p className="font-medium">{selectedEmployee?.socialSecurity}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Medicare</Label>
                    <p className="font-medium">{selectedEmployee?.medicare}%</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deductions" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">401(k) Contribution</Label>
                    <p className="font-medium">{selectedEmployee?.retirement401k}%</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Health Insurance</Label>
                    <p className="font-medium">{formatCurrency(selectedEmployee?.healthInsurance || 0)}/pay period</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Dental Insurance</Label>
                    <p className="font-medium">{formatCurrency(selectedEmployee?.dentalInsurance || 0)}/pay period</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Vision Insurance</Label>
                    <p className="font-medium">{formatCurrency(selectedEmployee?.visionInsurance || 0)}/pay period</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Other Deductions</Label>
                    <p className="font-medium">{formatCurrency(selectedEmployee?.otherDeductions || 0)}/pay period</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEmployeeDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Pay Period Dialog */}
      <Dialog open={showAddPayPeriodDialog} onOpenChange={setShowAddPayPeriodDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Pay Period</DialogTitle>
            <DialogDescription>Create a new pay period for upcoming payroll.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayPeriod}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="col-span-3"
                  value={newPayPeriod.startDate}
                  onChange={(e) => setNewPayPeriod({ ...newPayPeriod, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className="col-span-3"
                  value={newPayPeriod.endDate}
                  onChange={(e) => setNewPayPeriod({ ...newPayPeriod, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payDate" className="text-right">
                  Pay Date
                </Label>
                <Input
                  id="payDate"
                  type="date"
                  className="col-span-3"
                  value={newPayPeriod.payDate}
                  onChange={(e) => setNewPayPeriod({ ...newPayPeriod, payDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddPayPeriodDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Pay Period</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tax Compliance Dialog */}
      <Dialog open={showTaxComplianceDialog} onOpenChange={setShowTaxComplianceDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tax Compliance Check</DialogTitle>
            <DialogDescription>
              Verify tax compliance information before sending payment to {paymentDetails.employee?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  This payment will include all required tax withholdings and employer contributions based on the
                  employee's state and local tax requirements.
                </p>
              </div>
            </div>

            {paymentDetails.employee && (
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Employee Tax Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>State:</div>
                    <div className="font-medium">
                      {paymentDetails.employee.stateCode} (
                      {stateTaxInfo.find((s) => s.code === paymentDetails.employee?.stateCode)?.name})
                    </div>

                    <div>Federal Withholding:</div>
                    <div className="font-medium">{paymentDetails.employee.federalTaxWithholding}%</div>

                    <div>State Withholding:</div>
                    <div className="font-medium">{paymentDetails.employee.stateTaxWithholding}%</div>

                    {paymentDetails.employee.localTaxWithholding > 0 && (
                      <>
                        <div>Local Withholding:</div>
                        <div className="font-medium">
                          {paymentDetails.employee.localTaxWithholding}% ({paymentDetails.employee.localityName})
                        </div>
                      </>
                    )}

                    <div>Social Security:</div>
                    <div className="font-medium">{paymentDetails.employee.socialSecurity}%</div>

                    <div>Medicare:</div>
                    <div className="font-medium">{paymentDetails.employee.medicare}%</div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Payment Tax Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Gross Payment:</div>
                    <div className="font-medium">{formatCurrency(paymentDetails.amount)}</div>

                    <div>Employee Tax Withholdings:</div>
                    <div className="font-medium">
                      {formatCurrency(paymentDetails.taxDetails?.totalEmployeeTaxes || 0)}
                    </div>

                    <div>Employer Tax Contributions:</div>
                    <div className="font-medium">
                      {formatCurrency(paymentDetails.taxDetails?.totalEmployerTaxes || 0)}
                    </div>

                    <div>Net Payment to Employee:</div>
                    <div className="font-medium">
                      {formatCurrency(paymentDetails.amount - (paymentDetails.taxDetails?.totalEmployeeTaxes || 0))}
                    </div>

                    <div>Total Cost to Company:</div>
                    <div className="font-medium">
                      {formatCurrency(paymentDetails.amount + (paymentDetails.taxDetails?.totalEmployerTaxes || 0))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="stateSelect">View State Tax Information</Label>
                  <Select value={selectedState} onValueChange={handleStateSelect}>
                    <SelectTrigger id="stateSelect">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateTaxInfo.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.code} - {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedState && (
                    <div className="mt-2 text-sm">
                      {stateNotes ? (
                        <div className="p-2 bg-gray-50 rounded border mt-2">
                          <p>{stateNotes}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No special notes for this state.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="confirmTaxCompliance" required />
                <label
                  htmlFor="confirmTaxCompliance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that all tax information is correct and complies with state and federal regulations
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="authorizeTaxPayments" required />
                <label
                  htmlFor="authorizeTaxPayments"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I authorize the withholding and payment of all required taxes
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowTaxComplianceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTaxComplianceConfirm} className="bg-green-600 hover:bg-green-700">
              Confirm & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Payment Dialog */}
      <Dialog open={showSendPaymentDialog} onOpenChange={setShowSendPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Payment</DialogTitle>
            <DialogDescription>Send a payment to {paymentDetails.employee?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentAmount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3 relative">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    className="pl-8"
                    value={paymentDetails.amount}
                    onChange={(e) => {
                      const newAmount = Number.parseFloat(e.target.value)
                      const newTaxDetails = calculateTaxDetails(paymentDetails.employee!, newAmount)
                      setPaymentDetails({
                        ...paymentDetails,
                        amount: newAmount,
                        taxDetails: newTaxDetails,
                      })
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="paymentDescription"
                  className="col-span-3"
                  value={paymentDetails.description}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bankAccount" className="text-right">
                  From Account
                </Label>
                <Select
                  value={paymentDetails.selectedBankAccount}
                  onValueChange={(value) => setPaymentDetails({ ...paymentDetails, selectedBankAccount: value })}
                >
                  <SelectTrigger id="bankAccount" className="col-span-3">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({formatCurrency(account.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border p-4 mt-4">
                <h4 className="font-medium mb-2">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>To:</div>
                  <div>{paymentDetails.employee?.name}</div>

                  <div>Gross Amount:</div>
                  <div>{formatCurrency(paymentDetails.amount)}</div>

                  <div>Employee Tax Withholdings:</div>
                  <div>{formatCurrency(paymentDetails.taxDetails?.totalEmployeeTaxes || 0)}</div>

                  <div>Net Amount to Employee:</div>
                  <div className="font-medium">
                    {formatCurrency(paymentDetails.amount - (paymentDetails.taxDetails?.totalEmployeeTaxes || 0))}
                  </div>

                  <div>Employer Tax Contributions:</div>
                  <div>{formatCurrency(paymentDetails.taxDetails?.totalEmployerTaxes || 0)}</div>

                  <div>Total Cost to Company:</div>
                  <div className="font-medium">
                    {formatCurrency(paymentDetails.amount + (paymentDetails.taxDetails?.totalEmployerTaxes || 0))}
                  </div>

                  <div>From Account:</div>
                  <div>{bankAccounts.find((acc) => acc.id === paymentDetails.selectedBankAccount)?.name}</div>

                  <div>Date:</div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirmPayment" required />
                  <label
                    htmlFor="confirmPayment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm this payment information is correct
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="authorizePayment" required />
                  <label
                    htmlFor="authorizePayment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I authorize this payment to be processed
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowSendPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={isProcessingPayment} className="bg-green-600 hover:bg-green-700">
              {isProcessingPayment ? "Processing..." : "Send Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={showPaymentHistoryDialog} onOpenChange={setShowPaymentHistoryDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Payment History</DialogTitle>
            <DialogDescription>Payment history for {selectedEmployee?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments
                    .filter((payment) => payment.employeeId === selectedEmployee?.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>
                          {payment.status === "completed" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Completed
                            </Badge>
                          )}
                          {payment.status === "pending" && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                          {payment.status === "processing" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Processing
                            </Badge>
                          )}
                          {payment.status === "failed" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTaxDetails(payment)}
                            className="text-blue-600"
                          >
                            Tax Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {(!selectedEmployee ||
                    payments.filter((payment) => payment.employeeId === selectedEmployee?.id).length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No payment history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPaymentHistoryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tax Details Dialog */}
      <Dialog open={showTaxDetailsDialog} onOpenChange={setShowTaxDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tax Details</DialogTitle>
            <DialogDescription>
              Tax breakdown for payment to {selectedPayment?.employeeName} on{" "}
              {selectedPayment ? formatDate(selectedPayment.date) : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPayment?.taxDetails ? (
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Employee Withholdings</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Federal Income Tax:</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.federalIncomeTax)}</div>

                    <div>State Income Tax ({selectedPayment.taxDetails.stateCode}):</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.stateTax)}</div>

                    {selectedPayment.taxDetails.localTax > 0 && (
                      <>
                        <div>Local Tax ({selectedPayment.taxDetails.localityName}):</div>
                        <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.localTax)}</div>
                      </>
                    )}

                    <div>Social Security (Employee):</div>
                    <div className="font-medium">
                      {formatCurrency(selectedPayment.taxDetails.socialSecurity.employee)}
                    </div>

                    <div>Medicare (Employee):</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.medicare.employee)}</div>

                    <div className="font-medium pt-2">Total Employee Withholdings:</div>
                    <div className="font-medium pt-2">
                      {formatCurrency(selectedPayment.taxDetails.totalEmployeeTaxes)}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Employer Contributions</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Social Security (Employer):</div>
                    <div className="font-medium">
                      {formatCurrency(selectedPayment.taxDetails.socialSecurity.employer)}
                    </div>

                    <div>Medicare (Employer):</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.medicare.employer)}</div>

                    <div>Federal Unemployment Tax (FUTA):</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.federalUnemployment)}</div>

                    <div>State Unemployment Tax (SUTA):</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.stateUnemployment)}</div>

                    <div className="font-medium pt-2">Total Employer Contributions:</div>
                    <div className="font-medium pt-2">
                      {formatCurrency(selectedPayment.taxDetails.totalEmployerTaxes)}
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Payment Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Gross Payment:</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.amount)}</div>

                    <div>Employee Withholdings:</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.totalEmployeeTaxes)}</div>

                    <div>Net Payment to Employee:</div>
                    <div className="font-medium">
                      {formatCurrency(selectedPayment.amount - selectedPayment.taxDetails.totalEmployeeTaxes)}
                    </div>

                    <div>Employer Tax Contributions:</div>
                    <div className="font-medium">{formatCurrency(selectedPayment.taxDetails.totalEmployerTaxes)}</div>

                    <div>Total Cost to Company:</div>
                    <div className="font-medium">
                      {formatCurrency(selectedPayment.amount + selectedPayment.taxDetails.totalEmployerTaxes)}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="mb-1">
                        All tax withholdings and contributions have been calculated according to current rates.
                      </p>
                      <p>
                        These taxes will be remitted to the appropriate tax authorities according to the required filing
                        schedules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No tax details available for this payment.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTaxDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={employeesModalOpen} onOpenChange={setEmployeesModalOpen}>
        <DialogContent data-team-management="true" className="sm:max-w-[900px] max-h-[85vh] p-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-full">
            {/* Sidebar Navigation */}
            <div className="bg-gray-50 border-r border-gray-200 p-5">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-primary">Team Management</h2>
              </div>

              <div className="space-y-1">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-primary/10 text-primary font-medium">
                  <Users className="h-4 w-4" />
                  <span>Employees</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200">
                  <Clock className="h-4 w-4" />
                  <span>Timecards</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200">
                  <DollarSign className="h-4 w-4" />
                  <span>Payroll</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-200">
                  <FileText className="h-4 w-4" />
                  <span>Tax Documents</span>
                </button>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push("/add-team-member")}
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    Add Team Member
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileCheck className="h-3.5 w-3.5 mr-2" />
                    Approve Timecards
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <DollarSign className="h-3.5 w-3.5 mr-2" />
                    Run Payroll
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col h-full">
              <div className="border-b border-gray-200 p-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Team & Payroll Management</h2>
                  <Button variant="ghost" size="sm" onClick={() => setEmployeesModalOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your team members, payroll, and connected bank accounts.
                </p>
              </div>

              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="employees" className="h-full flex flex-col">
                  <div className="px-5 pt-4 border-b border-gray-200">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="employees">Employees</TabsTrigger>
                      <TabsTrigger value="timecards">Timecards</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-auto p-5">
                    <TabsContent value="employees" className="h-full mt-0">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <Input placeholder="Search employees..." className="w-[250px]" />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEmployeesModalOpen(false)
                            router.push("/add-team-member")
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Team Member
                        </Button>
                      </div>
                      <EmployeeList employees={mockEmployees} onUpdateEmployee={handleUpdateEmployee} />
                    </TabsContent>

                    <TabsContent value="timecards" className="h-full mt-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Employee Timecards</h3>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Clock className="mr-2 h-4 w-4" />
                            Submit Timecard
                          </Button>
                          <Button size="sm">
                            <FileCheck className="mr-2 h-4 w-4" />
                            Approve Timecards
                          </Button>
                        </div>
                      </div>

                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead>Week Starting</TableHead>
                              <TableHead>Total Hours</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {timecards.slice(0, 5).map((timecard) => (
                              <TableRow key={timecard.id}>
                                <TableCell className="font-medium">{timecard.employeeName}</TableCell>
                                <TableCell>{new Date(timecard.weekStartDate).toLocaleDateString()}</TableCell>
                                <TableCell>{timecard.totalHours}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      timecard.status === "approved"
                                        ? "bg-green-100 text-green-800"
                                        : timecard.status === "rejected"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {timecard.status === "approved"
                                      ? "Approved"
                                      : timecard.status === "rejected"
                                        ? "Rejected"
                                        : "Pending"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="h-full mt-0">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Payroll Settings</h3>
                          <Card>
                            <CardContent className="p-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Payment Frequency</Label>
                                  <Select defaultValue="biweekly">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Default Pay Day</Label>
                                  <Select defaultValue="friday">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="monday">Monday</SelectItem>
                                      <SelectItem value="tuesday">Tuesday</SelectItem>
                                      <SelectItem value="wednesday">Wednesday</SelectItem>
                                      <SelectItem value="thursday">Thursday</SelectItem>
                                      <SelectItem value="friday">Friday</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3">Connected Bank Accounts</h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {bankAccounts.map((account) => (
                                  <div
                                    key={account.id}
                                    className="flex justify-between items-center p-3 border rounded-md"
                                  >
                                    <div>
                                      <p className="font-medium">{account.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}{" "}
                                        •••• {account.accountNumber.slice(-4)}
                                      </p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={account.isDefault ? "bg-blue-50 text-blue-700" : ""}
                                    >
                                      {account.isDefault ? "Default" : "Secondary"}
                                    </Badge>
                                  </div>
                                ))}

                                <Button variant="outline" size="sm" className="w-full mt-2">
                                  <Plus className="h-3.5 w-3.5 mr-2" />
                                  Connect New Account
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
