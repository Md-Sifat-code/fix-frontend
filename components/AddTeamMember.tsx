"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Lock,
  Eye,
  FileText,
  DollarSign,
  Image,
  Mail,
  FileCheck,
  CheckCircle,
  User,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TeamMemberData {
  name: string
  email: string
  role: string
  department: string
  financialInfo: {
    payType: "salary" | "hourly"
    payRate: string
    payFrequency: "weekly" | "biweekly" | "monthly"
    utilizationRate: string
  }
  taxInfo: {
    federalTaxWithholding: string
    stateTaxWithholding: string
    socialSecurity: string
    medicare: string
  }
  deductions: {
    retirement401k: string
    healthInsurance: string
    dentalInsurance: string
    visionInsurance: string
    otherDeductions: string
  }
  accessPermissions: {
    studioAccess: boolean
    mediaAccess: boolean
    financialsAccess: boolean
    projectAssignment: boolean
    viewOnly: boolean
  }
  accountSettings: {
    requirePasswordChange: boolean
    require2FA: boolean
    sendWelcomeEmail: boolean
  }
  federalForms: {
    w4: boolean
    i9: boolean
    directDeposit: boolean
    benefitsEnrollment: boolean
    confidentialityAgreement: boolean
    employeeHandbook: boolean
  }
}

const roleOptions = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Administrator" },
  { value: "project_manager", label: "Project Manager" },
  { value: "architect", label: "Architect" },
  { value: "designer", label: "Designer" },
  { value: "drafter", label: "Drafter" },
  { value: "consultant", label: "Consultant" },
  { value: "accounting", label: "Accounting" },
  { value: "marketing", label: "Marketing" },
  { value: "intern", label: "Intern" },
]

const departmentOptions = [
  { value: "management", label: "Management" },
  { value: "architecture", label: "Architecture" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "administration", label: "Administration" },
]

const federalFormsList = [
  { id: "w4", name: "W-4 (Employee's Withholding Certificate)", required: true },
  { id: "i9", name: "I-9 (Employment Eligibility Verification)", required: true },
  { id: "directDeposit", name: "Direct Deposit Authorization Form", required: true },
  { id: "benefitsEnrollment", name: "Benefits Enrollment Forms", required: false },
  { id: "confidentialityAgreement", name: "Confidentiality Agreement", required: true },
  { id: "employeeHandbook", name: "Employee Handbook Acknowledgment", required: true },
]

export function AddTeamMember() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [enrollmentComplete, setEnrollmentComplete] = useState(false)

  const [teamMember, setTeamMember] = useState<TeamMemberData>({
    name: "",
    email: "",
    role: "",
    department: "",
    financialInfo: {
      payType: "salary",
      payRate: "",
      payFrequency: "biweekly",
      utilizationRate: "80",
    },
    taxInfo: {
      federalTaxWithholding: "22",
      stateTaxWithholding: "5",
      socialSecurity: "6.2",
      medicare: "1.45",
    },
    deductions: {
      retirement401k: "5",
      healthInsurance: "250",
      dentalInsurance: "30",
      visionInsurance: "15",
      otherDeductions: "0",
    },
    accessPermissions: {
      studioAccess: true,
      mediaAccess: false,
      financialsAccess: false,
      projectAssignment: false,
      viewOnly: true,
    },
    accountSettings: {
      requirePasswordChange: true,
      require2FA: false,
      sendWelcomeEmail: true,
    },
    federalForms: {
      w4: true,
      i9: true,
      directDeposit: true,
      benefitsEnrollment: false,
      confidentialityAgreement: true,
      employeeHandbook: true,
    },
  })

  // Check if user is owner
  const isOwner = user?.role === "Owner"

  if (!isOwner) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page. Only owners can add new team members.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </CardFooter>
      </Card>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTeamMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setTeamMember((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggleChange = (section: "accessPermissions" | "accountSettings", field: string, checked: boolean) => {
    setTeamMember((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked,
      },
    }))
  }

  const handleFormCheckboxChange = (formId: string, checked: boolean) => {
    setTeamMember((prev) => ({
      ...prev,
      federalForms: {
        ...prev.federalForms,
        [formId]: checked,
      },
    }))
  }

  const handleFinancialInfoChange = (field: string, value: string) => {
    setTeamMember((prev) => ({
      ...prev,
      financialInfo: {
        ...prev.financialInfo,
        [field]: value,
      },
    }))
  }

  const handleTaxInfoChange = (field: string, value: string) => {
    setTeamMember((prev) => ({
      ...prev,
      taxInfo: {
        ...prev.taxInfo,
        [field]: value,
      },
    }))
  }

  const handleDeductionsChange = (field: string, value: string) => {
    setTeamMember((prev) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmationDialog(true)
  }

  const completeEnrollment = async () => {
    setIsSubmitting(true)
    setShowConfirmationDialog(false)

    try {
      // In a real app, you would send the data to your API here
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      toast({
        title: "Enrollment process initiated",
        description: `An email has been sent to ${teamMember.email} with onboarding instructions and required forms.`,
        duration: 5000,
      })

      setEnrollmentComplete(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error initiating the enrollment process. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (enrollmentComplete) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Enrollment Process Initiated</CardTitle>
          <CardDescription className="text-base">
            An email has been sent to {teamMember.email} with instructions to complete the onboarding process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Next Steps:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Employee will receive an email with a secure link to complete their forms</li>
              <li>You'll be notified when they complete each required document</li>
              <li>Once all documents are completed, you can finalize their onboarding</li>
              <li>
                <span className="font-medium">Direct Deposit Setup:</span> After the employee submits their direct
                deposit form, you'll need to complete their setup in the{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                  onClick={() => router.push("/dashboard?tab=financials")}
                >
                  Payroll Management
                </Button>{" "}
                section
              </li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/dashboard?tab=financials")}>Return to Dashboard</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard?tab=financials")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Team Member</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="forms">Federal Forms</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Add the new team member's personal and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={teamMember.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={teamMember.email}
                      onChange={handleInputChange}
                      placeholder="johndoe@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={teamMember.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={teamMember.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-medium">Utilization Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="utilizationRate">Utilization Rate (%)</Label>
                      <Input
                        id="utilizationRate"
                        value={teamMember.financialInfo.utilizationRate}
                        onChange={(e) => handleFinancialInfoChange("utilizationRate", e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="80"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard?tab=financials")}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => document.getElementById("payroll-tab")?.click()}>
                  Next: Payroll Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" id="payroll-tab">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Information</CardTitle>
                <CardDescription>Set up the employee's pay rate, tax information, and deductions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pay Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payType">Pay Type</Label>
                      <Select
                        value={teamMember.financialInfo.payType}
                        onValueChange={(value) => handleFinancialInfoChange("payType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pay type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payRate">
                        {teamMember.financialInfo.payType === "salary" ? "Annual Salary" : "Hourly Rate"}
                      </Label>
                      <Input
                        id="payRate"
                        value={teamMember.financialInfo.payRate}
                        onChange={(e) => handleFinancialInfoChange("payRate", e.target.value)}
                        type="number"
                        min="0"
                        step={teamMember.financialInfo.payType === "salary" ? "1000" : "0.01"}
                        placeholder={teamMember.financialInfo.payType === "salary" ? "80000" : "45.00"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payFrequency">Pay Frequency</Label>
                      <Select
                        value={teamMember.financialInfo.payFrequency}
                        onValueChange={(value) => handleFinancialInfoChange("payFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pay frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tax Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="federalTaxWithholding">Federal Tax Withholding (%)</Label>
                      <Input
                        id="federalTaxWithholding"
                        value={teamMember.taxInfo.federalTaxWithholding}
                        onChange={(e) => handleTaxInfoChange("federalTaxWithholding", e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stateTaxWithholding">State Tax Withholding (%)</Label>
                      <Input
                        id="stateTaxWithholding"
                        value={teamMember.taxInfo.stateTaxWithholding}
                        onChange={(e) => handleTaxInfoChange("stateTaxWithholding", e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialSecurity">Social Security (%)</Label>
                      <Input
                        id="socialSecurity"
                        value={teamMember.taxInfo.socialSecurity}
                        onChange={(e) => handleTaxInfoChange("socialSecurity", e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicare">Medicare (%)</Label>
                      <Input
                        id="medicare"
                        value={teamMember.taxInfo.medicare}
                        onChange={(e) => handleTaxInfoChange("medicare", e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-medium">Direct Deposit Information</h3>
                  <p className="text-sm text-muted-foreground">
                    The employee will need to provide this information to complete their payroll setup.
                  </p>

                  <div className="rounded-md border p-4 bg-amber-50">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Direct Deposit Setup</p>
                        <p className="text-sm text-amber-700 mt-1">
                          For security and compliance reasons, direct deposit information should be collected directly
                          from the employee. After adding the team member, they will receive an email with instructions
                          to complete their direct deposit setup.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="sendDirectDepositEmail" defaultChecked />
                    <label htmlFor="sendDirectDepositEmail" className="text-sm font-medium leading-none">
                      Send direct deposit setup email to employee
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Deductions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="retirement401k">401(k) Contribution (%)</Label>
                      <Input
                        id="retirement401k"
                        value={teamMember.deductions.retirement401k}
                        onChange={(e) => handleDeductionsChange("retirement401k", e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="healthInsurance">Health Insurance ($ per pay period)</Label>
                      <Input
                        id="healthInsurance"
                        value={teamMember.deductions.healthInsurance}
                        onChange={(e) => handleDeductionsChange("healthInsurance", e.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dentalInsurance">Dental Insurance ($ per pay period)</Label>
                      <Input
                        id="dentalInsurance"
                        value={teamMember.deductions.dentalInsurance}
                        onChange={(e) => handleDeductionsChange("dentalInsurance", e.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visionInsurance">Vision Insurance ($ per pay period)</Label>
                      <Input
                        id="visionInsurance"
                        value={teamMember.deductions.visionInsurance}
                        onChange={(e) => handleDeductionsChange("visionInsurance", e.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherDeductions">Other Deductions ($ per pay period)</Label>
                      <Input
                        id="otherDeductions"
                        value={teamMember.deductions.otherDeductions}
                        onChange={(e) => handleDeductionsChange("otherDeductions", e.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => document.getElementById("basic-info-tab")?.click()}>
                  Previous: Basic Information
                </Button>
                <Button type="button" onClick={() => document.getElementById("permissions-tab")?.click()}>
                  Next: Access Permissions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" id="permissions-tab">
            <Card>
              <CardHeader>
                <CardTitle>Access Permissions</CardTitle>
                <CardDescription>Control what areas of the system this team member can access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <FileCheck className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      All new employees automatically receive access to the Studio section. This is the default
                      workspace for all team members.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="studioAccess" className="text-base">
                          Studio Access
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Access to the main studio workspace (required for all employees)
                        </p>
                      </div>
                    </div>
                    <Switch id="studioAccess" checked={true} disabled={true} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="mediaAccess" className="text-base">
                          Media Access
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Access to media files, projects, and publications
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="mediaAccess"
                      checked={teamMember.accessPermissions.mediaAccess}
                      onCheckedChange={(checked) => handleToggleChange("accessPermissions", "mediaAccess", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="financialsAccess" className="text-base">
                          Financials Access
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Access to financial data, reports, and employee information
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="financialsAccess"
                      checked={teamMember.accessPermissions.financialsAccess}
                      onCheckedChange={(checked) =>
                        handleToggleChange("accessPermissions", "financialsAccess", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="projectAssignment" className="text-base">
                          Project Assignment
                        </Label>
                        <p className="text-sm text-muted-foreground">Ability to create, assign, and manage projects</p>
                      </div>
                    </div>
                    <Switch
                      id="projectAssignment"
                      checked={teamMember.accessPermissions.projectAssignment}
                      onCheckedChange={(checked) =>
                        handleToggleChange("accessPermissions", "projectAssignment", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="viewOnly" className="text-base">
                          View Only Mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Read-only access to assigned areas without edit permissions
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="viewOnly"
                      checked={teamMember.accessPermissions.viewOnly}
                      onCheckedChange={(checked) => handleToggleChange("accessPermissions", "viewOnly", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => document.getElementById("payroll-tab")?.click()}>
                  Previous: Payroll Information
                </Button>
                <Button type="button" onClick={() => document.getElementById("forms-tab")?.click()}>
                  Next: Federal Forms
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="forms" id="forms-tab">
            <Card>
              <CardHeader>
                <CardTitle>Federal Forms</CardTitle>
                <CardDescription>
                  Select the forms that will be sent to the employee for completion during onboarding.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                    <div className="flex items-start">
                      <FileCheck className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        These forms will be sent to the employee's email address for electronic completion. Required
                        forms cannot be deselected as they are mandatory for employment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {federalFormsList.map((form) => (
                      <div key={form.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={form.id}
                          checked={teamMember.federalForms[form.id as keyof typeof teamMember.federalForms]}
                          onCheckedChange={(checked) => handleFormCheckboxChange(form.id, checked as boolean)}
                          disabled={form.required}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={form.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {form.name}
                            {form.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {form.id === "w4" && (
                            <p className="text-sm text-muted-foreground">Federal tax withholding information</p>
                          )}
                          {form.id === "i9" && (
                            <p className="text-sm text-muted-foreground">Employment eligibility verification</p>
                          )}
                          {form.id === "directDeposit" && (
                            <p className="text-sm text-muted-foreground">
                              Banking information for payroll direct deposit
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => document.getElementById("permissions-tab")?.click()}>
                  Previous: Access Permissions
                </Button>
                <Button type="button" onClick={() => document.getElementById("account-tab")?.click()}>
                  Next: Account Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account" id="account-tab">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Configure security and onboarding settings for this team member.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="requirePasswordChange" className="text-base">
                          Require Password Change
                        </Label>
                        <p className="text-sm text-muted-foreground">User must create a new password on first login</p>
                      </div>
                    </div>
                    <Switch
                      id="requirePasswordChange"
                      checked={teamMember.accountSettings.requirePasswordChange}
                      onCheckedChange={(checked) =>
                        handleToggleChange("accountSettings", "requirePasswordChange", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="sendWelcomeEmail" className="text-base">
                          Send Welcome Email
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send an automated welcome email with login instructions
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="sendWelcomeEmail"
                      checked={teamMember.accountSettings.sendWelcomeEmail}
                      onCheckedChange={(checked) => handleToggleChange("accountSettings", "sendWelcomeEmail", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="require2FA" className="text-base">
                          Require Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          User must set up 2FA before accessing the system
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="require2FA"
                      checked={teamMember.accountSettings.require2FA}
                      onCheckedChange={(checked) => handleToggleChange("accountSettings", "require2FA", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => document.getElementById("forms-tab")?.click()}>
                  Previous: Federal Forms
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Complete & Send Enrollment Email
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Enrollment Process</DialogTitle>
            <DialogDescription>
              This will create a new team member account and send an email with onboarding instructions and forms to{" "}
              {teamMember.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-sm mb-2">The following forms will be sent:</h4>
              <ul className="text-sm space-y-1">
                {Object.entries(teamMember.federalForms)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([formId]) => {
                    const form = federalFormsList.find((f) => f.id === formId)
                    return <li key={formId}>• {form?.name}</li>
                  })}
              </ul>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowConfirmationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={completeEnrollment} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Sending..." : "Confirm & Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
