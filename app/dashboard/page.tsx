import Dashboard from "@/components/Dashboard"
import { ProjectProvider } from "@/contexts/ProjectContext"
import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <ProjectProvider>
       <Suspense fallback={<div>Loading...</div>}>
    <Dashboard />
    </Suspense>
    </ProjectProvider>
  )
}

