import Dashboard from "@/components/Dashboard"
import { ProjectProvider } from "@/contexts/ProjectContext"

export default function DashboardPage() {
  return (
    <ProjectProvider>
      <Dashboard />
    </ProjectProvider>
  )
}
