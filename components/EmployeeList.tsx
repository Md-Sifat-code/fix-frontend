"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Pencil, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface Employee {
  id: string
  name: string
  role: string
  email: string
  startDate: string
  utilizationRate: number
  hourlyRate: number
  salary: number
  state: string
  department: string
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
  payType?: string
  payFrequency?: string
}

interface EmployeeListProps {
  employees: Employee[]
  onUpdateEmployee: (updatedEmployee: Employee) => void
}

export function EmployeeList({ employees, onUpdateEmployee }: EmployeeListProps) {
  const [sortColumn, setSortColumn] = useState<keyof Employee>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  // Add this near the top of the component function, after the state declarations
  React.useEffect(() => {
    const handleEditEvent = (event: CustomEvent) => {
      const { employeeId } = event.detail
      const employee = employees.find((emp) => emp.id === employeeId)
      if (employee) {
        handleEditEmployee(employee)
      }
    }

    const handleSaveEvent = () => {
      handleSaveEmployee()
    }

    window.addEventListener("edit-employee", handleEditEvent as EventListener)
    window.addEventListener("save-employee", handleSaveEvent as EventListener)

    return () => {
      window.removeEventListener("edit-employee", handleEditEvent as EventListener)
      window.removeEventListener("save-employee", handleSaveEvent as EventListener)
    }
  }, [employees])

  const handleSort = (column: keyof Employee) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee({ ...employee })
  }

  const handleSaveEmployee = () => {
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee)
      setEditingEmployee(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingEmployee) {
      setEditingEmployee({
        ...editingEmployee,
        [e.target.name]: e.target.value,
      })
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="overflow-auto max-h-[calc(100vh-220px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                Name <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("role")} className="cursor-pointer">
                Role <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
                Email <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("state")} className="cursor-pointer">
                State <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("startDate")} className="cursor-pointer">
                Start Date <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("utilizationRate")} className="cursor-pointer">
                Utilization Rate <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("hourlyRate")} className="cursor-pointer">
                Hourly Rate <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead onClick={() => handleSort("salary")} className="cursor-pointer">
                Salary <ArrowUpDown className="inline-block w-4 h-4 ml-1" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.state || "N/A"}</TableCell>
                <TableCell>{employee.startDate}</TableCell>
                <TableCell>{employee.utilizationRate}%</TableCell>
                <TableCell>${employee.hourlyRate.toFixed(2)}</TableCell>
                <TableCell>${employee.salary.toLocaleString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                        data-employee-edit="true"
                        data-employee-id={employee.id}
                        data-action="edit"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Edit Employee: {editingEmployee?.name}</DialogTitle>
                      </DialogHeader>

                      <Tabs defaultValue="basic-info" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                          <TabsTrigger value="payroll">Payroll</TabsTrigger>
                          <TabsTrigger value="tax">Tax Info</TabsTrigger>
                          <TabsTrigger value="access">Access</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic-info" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                name="name"
                                value={editingEmployee?.name || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={editingEmployee?.email || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Select
                                value={editingEmployee?.role || ""}
                                onValueChange={(value) => setEditingEmployee({ ...editingEmployee!, role: value })}
                              >
                                <SelectTrigger id="role">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="owner">Owner</SelectItem>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="project_manager">Project Manager</SelectItem>
                                  <SelectItem value="architect">Architect</SelectItem>
                                  <SelectItem value="designer">Designer</SelectItem>
                                  <SelectItem value="drafter">Drafter</SelectItem>
                                  <SelectItem value="consultant">Consultant</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="department">Department</Label>
                              <Select
                                value={editingEmployee?.department || ""}
                                onValueChange={(value) =>
                                  setEditingEmployee({ ...editingEmployee!, department: value })
                                }
                              >
                                <SelectTrigger id="department">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="management">Management</SelectItem>
                                  <SelectItem value="architecture">Architecture</SelectItem>
                                  <SelectItem value="design">Design</SelectItem>
                                  <SelectItem value="engineering">Engineering</SelectItem>
                                  <SelectItem value="finance">Finance</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={editingEmployee?.startDate || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Select
                                value={editingEmployee?.state || ""}
                                onValueChange={(value) => setEditingEmployee({ ...editingEmployee!, state: value })}
                              >
                                <SelectTrigger id="state">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AL">Alabama</SelectItem>
                                  <SelectItem value="AK">Alaska</SelectItem>
                                  <SelectItem value="AZ">Arizona</SelectItem>
                                  <SelectItem value="AR">Arkansas</SelectItem>
                                  <SelectItem value="CA">California</SelectItem>
                                  <SelectItem value="CO">Colorado</SelectItem>
                                  <SelectItem value="CT">Connecticut</SelectItem>
                                  <SelectItem value="DE">Delaware</SelectItem>
                                  <SelectItem value="FL">Florida</SelectItem>
                                  <SelectItem value="GA">Georgia</SelectItem>
                                  <SelectItem value="HI">Hawaii</SelectItem>
                                  <SelectItem value="ID">Idaho</SelectItem>
                                  <SelectItem value="IL">Illinois</SelectItem>
                                  <SelectItem value="IN">Indiana</SelectItem>
                                  <SelectItem value="IA">Iowa</SelectItem>
                                  <SelectItem value="KS">Kansas</SelectItem>
                                  <SelectItem value="KY">Kentucky</SelectItem>
                                  <SelectItem value="LA">Louisiana</SelectItem>
                                  <SelectItem value="ME">Maine</SelectItem>
                                  <SelectItem value="MD">Maryland</SelectItem>
                                  <SelectItem value="MA">Massachusetts</SelectItem>
                                  <SelectItem value="MI">Michigan</SelectItem>
                                  <SelectItem value="MN">Minnesota</SelectItem>
                                  <SelectItem value="MS">Mississippi</SelectItem>
                                  <SelectItem value="MO">Missouri</SelectItem>
                                  <SelectItem value="MT">Montana</SelectItem>
                                  <SelectItem value="NE">Nebraska</SelectItem>
                                  <SelectItem value="NV">Nevada</SelectItem>
                                  <SelectItem value="NH">New Hampshire</SelectItem>
                                  <SelectItem value="NJ">New Jersey</SelectItem>
                                  <SelectItem value="NM">New Mexico</SelectItem>
                                  <SelectItem value="NY">New York</SelectItem>
                                  <SelectItem value="NC">North Carolina</SelectItem>
                                  <SelectItem value="ND">North Dakota</SelectItem>
                                  <SelectItem value="OH">Ohio</SelectItem>
                                  <SelectItem value="OK">Oklahoma</SelectItem>
                                  <SelectItem value="OR">Oregon</SelectItem>
                                  <SelectItem value="PA">Pennsylvania</SelectItem>
                                  <SelectItem value="RI">Rhode Island</SelectItem>
                                  <SelectItem value="SC">South Carolina</SelectItem>
                                  <SelectItem value="SD">South Dakota</SelectItem>
                                  <SelectItem value="TN">Tennessee</SelectItem>
                                  <SelectItem value="TX">Texas</SelectItem>
                                  <SelectItem value="UT">Utah</SelectItem>
                                  <SelectItem value="VT">Vermont</SelectItem>
                                  <SelectItem value="VA">Virginia</SelectItem>
                                  <SelectItem value="WA">Washington</SelectItem>
                                  <SelectItem value="WV">West Virginia</SelectItem>
                                  <SelectItem value="WI">Wisconsin</SelectItem>
                                  <SelectItem value="WY">Wyoming</SelectItem>
                                  <SelectItem value="DC">District of Columbia</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="payroll" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="utilizationRate">Utilization Rate (%)</Label>
                              <Input
                                id="utilizationRate"
                                name="utilizationRate"
                                type="number"
                                value={editingEmployee?.utilizationRate || ""}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="payType">Pay Type</Label>
                              <Select
                                value={editingEmployee?.payType || "salary"}
                                onValueChange={(value) => setEditingEmployee({ ...editingEmployee!, payType: value })}
                              >
                                <SelectTrigger id="payType">
                                  <SelectValue placeholder="Select pay type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="salary">Salary</SelectItem>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                              <Input
                                id="hourlyRate"
                                name="hourlyRate"
                                type="number"
                                value={editingEmployee?.hourlyRate || ""}
                                onChange={(e) => {
                                  const hourlyRate = Number.parseFloat(e.target.value)
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    hourlyRate: hourlyRate,
                                    salary: hourlyRate * 2080,
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="salary">Annual Salary ($)</Label>
                              <Input
                                id="salary"
                                name="salary"
                                type="number"
                                value={editingEmployee?.salary || ""}
                                onChange={(e) => {
                                  const salary = Number.parseFloat(e.target.value)
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    salary: salary,
                                    hourlyRate: salary / 2080,
                                  })
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="payFrequency">Pay Frequency</Label>
                              <Select
                                value={editingEmployee?.payFrequency || "biweekly"}
                                onValueChange={(value) =>
                                  setEditingEmployee({ ...editingEmployee!, payFrequency: value })
                                }
                              >
                                <SelectTrigger id="payFrequency">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2 mt-4">
                            <h3 className="text-md font-medium">Deductions</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="retirement401k">401(k) Contribution (%)</Label>
                                <Input
                                  id="retirement401k"
                                  value={editingEmployee?.deductions?.retirement401k || ""}
                                  onChange={(e) =>
                                    setEditingEmployee({
                                      ...editingEmployee!,
                                      deductions: {
                                        ...editingEmployee!.deductions,
                                        retirement401k: e.target.value,
                                      },
                                    })
                                  }
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
                                  value={editingEmployee?.deductions?.healthInsurance || ""}
                                  onChange={(e) =>
                                    setEditingEmployee({
                                      ...editingEmployee!,
                                      deductions: {
                                        ...editingEmployee!.deductions,
                                        healthInsurance: e.target.value,
                                      },
                                    })
                                  }
                                  type="number"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dentalInsurance">Dental Insurance ($ per pay period)</Label>
                                <Input
                                  id="dentalInsurance"
                                  value={editingEmployee?.deductions?.dentalInsurance || ""}
                                  onChange={(e) =>
                                    setEditingEmployee({
                                      ...editingEmployee!,
                                      deductions: {
                                        ...editingEmployee!.deductions,
                                        dentalInsurance: e.target.value,
                                      },
                                    })
                                  }
                                  type="number"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="visionInsurance">Vision Insurance ($ per pay period)</Label>
                                <Input
                                  id="visionInsurance"
                                  value={editingEmployee?.deductions?.visionInsurance || ""}
                                  onChange={(e) =>
                                    setEditingEmployee({
                                      ...editingEmployee!,
                                      deductions: {
                                        ...editingEmployee!.deductions,
                                        visionInsurance: e.target.value,
                                      },
                                    })
                                  }
                                  type="number"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="tax" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="federalTaxWithholding">Federal Tax Withholding (%)</Label>
                              <Input
                                id="federalTaxWithholding"
                                value={editingEmployee?.taxInfo?.federalTaxWithholding || ""}
                                onChange={(e) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    taxInfo: {
                                      ...editingEmployee!.taxInfo,
                                      federalTaxWithholding: e.target.value,
                                    },
                                  })
                                }
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
                                value={editingEmployee?.taxInfo?.stateTaxWithholding || ""}
                                onChange={(e) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    taxInfo: {
                                      ...editingEmployee!.taxInfo,
                                      stateTaxWithholding: e.target.value,
                                    },
                                  })
                                }
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
                                value={editingEmployee?.taxInfo?.socialSecurity || ""}
                                onChange={(e) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    taxInfo: {
                                      ...editingEmployee!.taxInfo,
                                      socialSecurity: e.target.value,
                                    },
                                  })
                                }
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
                                value={editingEmployee?.taxInfo?.medicare || ""}
                                onChange={(e) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    taxInfo: {
                                      ...editingEmployee!.taxInfo,
                                      medicare: e.target.value,
                                    },
                                  })
                                }
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-blue-800 font-medium">State Tax Information</p>
                                <p className="text-sm text-blue-700 mt-1">
                                  The employee's state ({editingEmployee?.state || "Not set"}) determines the state tax
                                  withholding rate. Different states have different tax rates and regulations.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="access" className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="studioAccess">Studio Access</Label>
                                <p className="text-sm text-muted-foreground">Access to the main studio workspace</p>
                              </div>
                              <Switch
                                id="studioAccess"
                                checked={editingEmployee?.accessPermissions?.studioAccess}
                                onCheckedChange={(checked) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    accessPermissions: {
                                      ...editingEmployee!.accessPermissions,
                                      studioAccess: checked,
                                    },
                                  })
                                }
                              />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="mediaAccess">Media Access</Label>
                                <p className="text-sm text-muted-foreground">
                                  Access to media files, projects, and publications
                                </p>
                              </div>
                              <Switch
                                id="mediaAccess"
                                checked={editingEmployee?.accessPermissions?.mediaAccess}
                                onCheckedChange={(checked) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    accessPermissions: {
                                      ...editingEmployee!.accessPermissions,
                                      mediaAccess: checked,
                                    },
                                  })
                                }
                              />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="financialsAccess">Financials Access</Label>
                                <p className="text-sm text-muted-foreground">
                                  Access to financial data, reports, and employee information
                                </p>
                              </div>
                              <Switch
                                id="financialsAccess"
                                checked={editingEmployee?.accessPermissions?.financialsAccess}
                                onCheckedChange={(checked) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    accessPermissions: {
                                      ...editingEmployee!.accessPermissions,
                                      financialsAccess: checked,
                                    },
                                  })
                                }
                              />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="projectAssignment">Project Assignment</Label>
                                <p className="text-sm text-muted-foreground">
                                  Ability to create, assign, and manage projects
                                </p>
                              </div>
                              <Switch
                                id="projectAssignment"
                                checked={editingEmployee?.accessPermissions?.projectAssignment}
                                onCheckedChange={(checked) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    accessPermissions: {
                                      ...editingEmployee!.accessPermissions,
                                      projectAssignment: checked,
                                    },
                                  })
                                }
                              />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="viewOnly">View Only Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                  Read-only access to assigned areas without edit permissions
                                </p>
                              </div>
                              <Switch
                                id="viewOnly"
                                checked={editingEmployee?.accessPermissions?.viewOnly}
                                onCheckedChange={(checked) =>
                                  setEditingEmployee({
                                    ...editingEmployee!,
                                    accessPermissions: {
                                      ...editingEmployee!.accessPermissions,
                                      viewOnly: checked,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEmployee} data-employee-edit="true" data-action="save">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
