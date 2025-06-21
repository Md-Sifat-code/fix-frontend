import { useProjects } from "@/contexts/ProjectContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectFinancialSummaryProps {
  projectId: string
  minimal?: boolean
}

export function ProjectFinancialSummary({ projectId, minimal = false }: ProjectFinancialSummaryProps) {
  const { projects, financialSummaries, calculateFinancialSummary } = useProjects()

  // Get the project
  const project = projects.find((p) => p.id === projectId)

  // Get or calculate the financial summary
  const summary = financialSummaries[projectId] || calculateFinancialSummary(projectId)

  if (!project || !summary) {
    return <div className="text-sm text-muted-foreground">No financial data available</div>
  }

  const isProfitable = summary.profitLoss > 0

  if (minimal) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Contract Amount:</div>
            <div>${summary.contractAmount.toLocaleString()}</div>
            <div className="text-muted-foreground">Billed to Date:</div>
            <div>${summary.totalActualCost.toLocaleString()}</div>
            <div className="text-muted-foreground">Profit/Loss:</div>
            <div className={isProfitable ? "text-green-600" : "text-red-600"}>
              {isProfitable ? "+" : "-"}${Math.abs(summary.profitLoss).toLocaleString()} ({summary.profitLossPercentage}
              %)
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{project.name} - Financial Summary</CardTitle>
          <Badge
            className={project.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
          >
            {project.status === "completed" ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Contract Amount</p>
            <p className="text-xl font-bold">${summary.contractAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Billed to Date</p>
            <p className="text-xl font-bold">${summary.totalActualCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-bold">${(summary.contractAmount - summary.totalActualCost).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit/Loss</p>
            <p className={`text-xl font-bold ${isProfitable ? "text-green-600" : "text-red-600"}`}>
              {isProfitable ? "+" : "-"}${Math.abs(summary.profitLoss).toLocaleString()} ({summary.profitLossPercentage}
              %)
            </p>
          </div>
        </div>

        {project.objectives && project.objectives.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Objective Breakdown</h3>
            <div className="space-y-4">
              {project.objectives.map((objective) => {
                const objectiveActualCost = objective.actualCost || 0
                const objectiveBudgetedCost = objective.budgetedCost || 0
                const objectiveStatus = objective.status || "unknown"

                return (
                  <div key={objective.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{objective.name}</h4>
                      <Badge
                        className={
                          objectiveStatus === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {objectiveStatus === "completed" ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Budgeted Cost:</div>
                      <div>${objectiveBudgetedCost.toLocaleString()}</div>
                      <div className="text-muted-foreground">Actual Cost:</div>
                      <div>${objectiveActualCost.toLocaleString()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
