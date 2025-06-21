"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectIntegrationSystem } from "@/components/project-management/ProjectIntegrationSystem"
import { TimecardApprovalDashboard } from "@/components/project-management/TimecardApprovalDashboard"

export default function ProjectManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects & Timecards</TabsTrigger>
          <TabsTrigger value="approvals">Timecard Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectIntegrationSystem />
        </TabsContent>

        <TabsContent value="approvals">
          <TimecardApprovalDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
