"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Bell, Key, Lock, LogOut, Shield, User, UserCog, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProfileSettings() {
  const { user, updateProfilePhoto, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "Architecture Simple",
    role: user?.role || "Architect",
    bio: "I'm an architect with a passion for sustainable design and innovative solutions.",
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const isOwner = user?.role === "Owner"

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecurityData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    // In a real app, you would upload this file to your storage service
    // For now, we'll just use a placeholder URL
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await updateProfilePhoto("/placeholder.svg?height=100&width=100")
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile photo",
        description: "There was an error updating your profile photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating password",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error updating notification preferences",
        description: "There was an error updating your notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} aria-label="Back to dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                  >
                    <UserCog className="h-4 w-4" />
                    <input
                      id="profile-photo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Separator />
                <div className="w-full">
                  <div className="text-sm text-muted-foreground mb-2">Account Status</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="owner-controls">
                  <Key className="h-4 w-4 mr-2" />
                  Owner Controls
                </TabsTrigger>
              )}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleProfileSubmit}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and how others see you on the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="Your email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={profileData.company}
                          onChange={handleProfileChange}
                          placeholder="Your company"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        name="role"
                        value={profileData.role}
                        onChange={handleProfileChange}
                        placeholder="Your role"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself"
                        className="w-full min-h-[100px] p-2 border rounded-md"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <form onSubmit={handleSecuritySubmit}>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and account security settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Lock className="h-5 w-5 mr-2" />
                        Change Password
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={securityData.currentPassword}
                          onChange={handleSecurityChange}
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={securityData.newPassword}
                          onChange={handleSecurityChange}
                          placeholder="Enter your new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={handleSecurityChange}
                          placeholder="Confirm your new password"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Key className="h-5 w-5 mr-2" />
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-factor authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="2fa" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Account Activity
                      </h3>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-sm font-medium">Last sign in</p>
                        <p className="text-sm text-muted-foreground">Today, 10:30 AM • IP: 192.168.1.1</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        View all activity
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Update security settings"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <form onSubmit={handleNotificationsSubmit}>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how and when you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Project Updates</p>
                          <p className="text-sm text-muted-foreground">Get notified about changes to your projects</p>
                        </div>
                        <Switch
                          id="projectUpdates"
                          checked={notificationSettings.projectUpdates}
                          onCheckedChange={(checked) => handleNotificationChange("projectUpdates", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Task Assignments</p>
                          <p className="text-sm text-muted-foreground">Get notified when you're assigned to a task</p>
                        </div>
                        <Switch
                          id="taskAssignments"
                          checked={notificationSettings.taskAssignments}
                          onCheckedChange={(checked) => handleNotificationChange("taskAssignments", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Security Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified about security events</p>
                        </div>
                        <Switch
                          id="securityAlerts"
                          checked={notificationSettings.securityAlerts}
                          onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                        </div>
                        <Switch
                          id="marketingEmails"
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save notification preferences"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Owner Controls Tab - Only visible to owners */}
            {isOwner && (
              <TabsContent value="owner-controls">
                <Card>
                  <CardHeader>
                    <CardTitle>Owner Controls</CardTitle>
                    <CardDescription>
                      Manage team access permissions and system-wide settings for your organization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Team Access Permissions */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="team-permissions">
                        <AccordionTrigger className="text-lg font-medium">Team Access Permissions</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="team-member">Select Team Member</Label>
                            <Select>
                              <SelectTrigger id="team-member">
                                <SelectValue placeholder="Select a team member" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="john-doe">John Doe</SelectItem>
                                <SelectItem value="jane-smith">Jane Smith</SelectItem>
                                <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                                <SelectItem value="emily-davis">Emily Davis</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Access to Media Tab</p>
                                <p className="text-sm text-muted-foreground">Allow user to access the Media section</p>
                              </div>
                              <Switch id="media-access" />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Access to Financials Tab</p>
                                <p className="text-sm text-muted-foreground">
                                  Allow user to view financial information
                                </p>
                              </div>
                              <Switch id="financials-access" />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Project Assignment Capabilities</p>
                                <p className="text-sm text-muted-foreground">
                                  Allow user to assign projects to team members
                                </p>
                              </div>
                              <Switch id="project-assignment" />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">View-only Mode</p>
                                <p className="text-sm text-muted-foreground">Restrict user to view-only access</p>
                              </div>
                              <Switch id="view-only" />
                            </div>
                          </div>

                          <Button className="mt-4" variant="outline">
                            Save Permissions
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* System Settings */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="system-settings">
                        <AccordionTrigger className="text-lg font-medium">System Settings</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Firm-wide Security Preferences</h4>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Require 2FA for All Users</p>
                                <p className="text-sm text-muted-foreground">
                                  Enforce two-factor authentication for all team members
                                </p>
                              </div>
                              <Switch id="require-2fa" />
                            </div>

                            <div className="space-y-2 mt-2">
                              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="session-timeout"
                                  type="number"
                                  min="5"
                                  max="240"
                                  defaultValue="30"
                                  className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">minutes</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Users will be automatically logged out after this period of inactivity
                              </p>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-4">
                            <h4 className="font-medium">Default Notification Settings</h4>
                            <p className="text-sm text-muted-foreground">
                              Set default notification preferences for new team members
                            </p>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Email Notifications</p>
                              </div>
                              <Switch id="default-email" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Project Updates</p>
                              </div>
                              <Switch id="default-project-updates" defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Task Assignments</p>
                              </div>
                              <Switch id="default-task-assignments" defaultChecked />
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-4">
                            <h4 className="font-medium">Activity Logs</h4>
                            <p className="text-sm text-muted-foreground">
                              Export team activity logs for compliance and monitoring
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="log-start-date">Start Date</Label>
                                <Input id="log-start-date" type="date" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="log-end-date">End Date</Label>
                                <Input id="log-end-date" type="date" />
                              </div>
                            </div>

                            <Button className="mt-2" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Export Logs as CSV
                            </Button>
                          </div>

                          <Button className="mt-4">Save System Settings</Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
