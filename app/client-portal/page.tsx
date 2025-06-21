"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, FileText, CreditCard, Calendar } from "lucide-react"

export default function ClientPortalPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [clientData, setClientData] = useState<any>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check for preview mode from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const preview = params.get("preview") === "true"
    const admin = params.get("admin") === "true"

    if (preview) {
      setIsPreview(true)
      setIsAdmin(admin)
      setIsLoggedIn(true)

      // Load mock data for preview
      setClientData({
        name: "John Smith",
        email: "john@example.com",
        projects: [
          {
            id: "PROJ-123456",
            name: "Modern Residential Home",
            address: "123 Main St, San Francisco, CA",
            status: "In Progress",
            progress: 35,
            startDate: "2023-11-15",
            estimatedCompletion: "2024-06-30",
            currentPhase: "Design Development",
            nextMilestone: "Construction Documents",
            nextMilestoneDate: "2024-01-15",
            payments: [
              { id: "PAY-001", amount: 5000, status: "Paid", date: "2023-11-15", description: "Initial Deposit" },
              {
                id: "PAY-002",
                amount: 7500,
                status: "Due",
                date: "2024-01-15",
                description: "Design Development Completion",
              },
            ],
            documents: [
              { id: "DOC-001", name: "Contract Agreement", date: "2023-11-15", type: "pdf" },
              { id: "DOC-002", name: "Schematic Design", date: "2023-12-20", type: "pdf" },
            ],
            timeline: [
              { phase: "Project Initiation", status: "Completed", date: "2023-11-15" },
              { phase: "Schematic Design", status: "Completed", date: "2023-12-20" },
              { phase: "Design Development", status: "In Progress", date: "2023-12-21" },
              { phase: "Construction Documents", status: "Pending", date: "2024-01-15" },
              { phase: "Bidding", status: "Pending", date: "2024-02-15" },
              { phase: "Construction", status: "Pending", date: "2024-03-01" },
              { phase: "Project Closeout", status: "Pending", date: "2024-06-15" },
            ],
          },
        ],
      })
    }

    setIsLoading(false)
  }, [])

  // Listen for portal preview event
  useEffect(() => {
    const handlePortalPreview = (event: any) => {
      const { adminAccess, clientEmail, tempPassword, proposalId } = event.detail

      setIsPreview(true)
      setIsAdmin(adminAccess)
      setIsLoggedIn(true)

      // Set mock data based on the proposal details
      setClientData({
        name: clientEmail
          .split("@")[0]
          .split(".")
          .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" "),
        email: clientEmail,
        projects: [
          {
            id: proposalId,
            name: "New Architecture Project",
            address: "123 Main St, San Francisco, CA",
            status: "Contract Sent",
            progress: 5,
            startDate: new Date().toISOString().split("T")[0],
            estimatedCompletion: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            currentPhase: "Contract Review",
            nextMilestone: "Contract Signing",
            nextMilestoneDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            payments: [
              {
                id: `PAY-${Date.now().toString().slice(-6)}`,
                amount: 5000,
                status: "Pending",
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                description: "Initial Deposit",
              },
            ],
            documents: [
              {
                id: `DOC-${Date.now().toString().slice(-6)}`,
                name: "Contract Agreement",
                date: new Date().toISOString().split("T")[0],
                type: "pdf",
              },
            ],
            timeline: [
              { phase: "Contract Sent", status: "Completed", date: new Date().toISOString().split("T")[0] },
              {
                phase: "Contract Signing",
                status: "Pending",
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                phase: "Project Initiation",
                status: "Pending",
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                phase: "Schematic Design",
                status: "Pending",
                date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                phase: "Design Development",
                status: "Pending",
                date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                phase: "Construction Documents",
                status: "Pending",
                date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              {
                phase: "Construction",
                status: "Pending",
                date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
            ],
          },
        ],
      })
    }

    window.addEventListener("show-portal-preview", handlePortalPreview)
    return () => window.removeEventListener("show-portal-preview", handlePortalPreview)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would validate against a database
    // For demo purposes, we'll accept any email/password
    if (email && password) {
      setIsLoggedIn(true)
      setClientData({
        name: email
          .split("@")[0]
          .split(".")
          .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" "),
        email: email,
        projects: [
          {
            id: "PROJ-123456",
            name: "Modern Residential Home",
            address: "123 Main St, San Francisco, CA",
            status: "In Progress",
            progress: 35,
            startDate: "2023-11-15",
            estimatedCompletion: "2024-06-30",
            currentPhase: "Design Development",
            nextMilestone: "Construction Documents",
            nextMilestoneDate: "2024-01-15",
            payments: [
              { id: "PAY-001", amount: 5000, status: "Paid", date: "2023-11-15", description: "Initial Deposit" },
              {
                id: "PAY-002",
                amount: 7500,
                status: "Due",
                date: "2024-01-15",
                description: "Design Development Completion",
              },
            ],
            documents: [
              { id: "DOC-001", name: "Contract Agreement", date: "2023-11-15", type: "pdf" },
              { id: "DOC-002", name: "Schematic Design", date: "2023-12-20", type: "pdf" },
            ],
            timeline: [
              { phase: "Project Initiation", status: "Completed", date: "2023-11-15" },
              { phase: "Schematic Design", status: "Completed", date: "2023-12-20" },
              { phase: "Design Development", status: "In Progress", date: "2023-12-21" },
              { phase: "Construction Documents", status: "Pending", date: "2024-01-15" },
              { phase: "Bidding", status: "Pending", date: "2024-02-15" },
              { phase: "Construction", status: "Pending", date: "2024-03-01" },
              { phase: "Project Closeout", status: "Pending", date: "2024-06-15" },
            ],
          },
        ],
      })
    } else {
      setError("Please enter both email and password")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail("")
    setPassword("")
    setClientData(null)

    // Remove preview mode
    if (isPreview) {
      window.history.pushState({}, "", window.location.pathname)
      setIsPreview(false)
      setIsAdmin(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Client Portal</CardTitle>
            <CardDescription className="text-center">Sign in to access your project information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-500">
              Don't have an account? Contact your project manager for access.
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Preview Banner */}
      {isAdmin && (
        <div className="bg-yellow-100 border-b border-yellow-200 p-2 text-center text-sm text-yellow-800">
          <strong>Admin Preview Mode</strong> - This is how the client portal will appear to your client.
          <Button variant="outline" size="sm" className="ml-2 h-7" onClick={handleLogout}>
            Exit Preview
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Architecture Simple</h1>
            <span className="text-sm text-gray-500">Client Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <div className="font-medium">{clientData.name}</div>
              <div className="text-gray-500">{clientData.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>

        {clientData.projects.map((project: any) => (
          <div key={project.id} className="mb-8 bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Project Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <p className="text-gray-500">{project.address}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Contract Sent"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Project ID: {project.id}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Project Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Key Dates */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Start Date</div>
                  <div className="font-medium">{formatDate(project.startDate)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Estimated Completion</div>
                  <div className="font-medium">{formatDate(project.estimatedCompletion)}</div>
                </div>
              </div>
            </div>

            {/* Project Details Tabs */}
            <Tabs defaultValue="overview" className="p-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Status */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Current Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Current Phase:</span>
                          <span className="font-medium">{project.currentPhase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Next Milestone:</span>
                          <span className="font-medium">{project.nextMilestone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Expected Date:</span>
                          <span className="font-medium">{formatDate(project.nextMilestoneDate)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Payment */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Next Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {project.payments.find((p: any) => p.status === "Due" || p.status === "Pending") ? (
                        <div className="space-y-4">
                          {project.payments
                            .filter((p: any) => p.status === "Due" || p.status === "Pending")
                            .slice(0, 1)
                            .map((payment: any) => (
                              <div key={payment.id} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Amount:</span>
                                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Due Date:</span>
                                  <span className="font-medium">{formatDate(payment.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Description:</span>
                                  <span className="font-medium">{payment.description}</span>
                                </div>
                                <Button className="w-full mt-2">Make Payment</Button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No pending payments</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.timeline
                          .filter((t: any) => t.status === "Completed" || t.status === "In Progress")
                          .slice(0, 3)
                          .map((activity: any, index: number) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div
                                className={`mt-0.5 rounded-full p-1 ${
                                  activity.status === "Completed"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {activity.status === "Completed" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{activity.phase}</p>
                                <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                              </div>
                              <div
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  activity.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {activity.status}
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>Track the progress of your project through each phase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                      {/* Timeline Items */}
                      <div className="space-y-8">
                        {project.timeline.map((phase: any, index: number) => (
                          <div key={index} className="flex items-start space-x-4 relative">
                            <div
                              className={`z-10 flex items-center justify-center w-14 h-14 rounded-full border-2 ${
                                phase.status === "Completed"
                                  ? "bg-green-100 border-green-500 text-green-600"
                                  : phase.status === "In Progress"
                                    ? "bg-blue-100 border-blue-500 text-blue-600"
                                    : "bg-gray-100 border-gray-300 text-gray-400"
                              }`}
                            >
                              {phase.status === "Completed" ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : phase.status === "In Progress" ? (
                                <Clock className="h-6 w-6" />
                              ) : (
                                <Calendar className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-lg">{phase.phase}</h4>
                                  <p className="text-gray-500">{formatDate(phase.date)}</p>
                                </div>
                                <div
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    phase.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : phase.status === "In Progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {phase.status}
                                </div>
                              </div>

                              {/* Phase Description - could be expanded with more details */}
                              <p className="mt-2 text-sm text-gray-600">
                                This phase includes all necessary activities and deliverables to move the project
                                forward.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View and manage your project payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {project.payments.map((payment: any) => (
                        <div key={payment.id} className="border rounded-lg overflow-hidden">
                          <div className="p-4 flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{payment.description}</h4>
                              <p className="text-sm text-gray-500">Due: {formatDate(payment.date)}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(payment.amount)}</div>
                              <div
                                className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${
                                  payment.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : payment.status === "Due"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {payment.status}
                              </div>
                            </div>
                          </div>
                          {(payment.status === "Due" || payment.status === "Pending") && (
                            <div className="bg-gray-50 p-4 border-t">
                              <Button className="w-full" size="sm">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Make Payment
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Documents</CardTitle>
                    <CardDescription>Access and download project-related documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gray-100 p-2 rounded">
                              <FileText className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">Added on {formatDate(doc.date)}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ))}

        {/* Account Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Account Settings</h3>
          </div>

          <div className="p-6">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={clientData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={clientData.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© 2023 Architecture Simple. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
