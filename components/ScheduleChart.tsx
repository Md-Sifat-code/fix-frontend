import { format, differenceInDays } from "date-fns"
import type { Objective } from "@/types"

interface ScheduleChartProps {
  objectives: Objective[]
  contractSignDate: Date
  targetCompletionDate: Date | null
}

export function ScheduleChart({ objectives, contractSignDate, targetCompletionDate }: ScheduleChartProps) {
  const totalDays = targetCompletionDate ? differenceInDays(targetCompletionDate, contractSignDate) : 0

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Project Schedule</h3>
      <div className="relative h-60">
        {objectives.map((objective, index) => (
          <div key={objective.id} className="mb-2">
            <div className="text-sm font-medium">{objective.name}</div>
            <div className="relative h-6 bg-gray-200 rounded">
              {objective.tasks.map((task) => {
                const startOffset = (differenceInDays(task.start, contractSignDate) / totalDays) * 100
                const width = (task.duration / totalDays) * 100
                return (
                  <div
                    key={task.id}
                    className="absolute h-full bg-blue-500 rounded"
                    style={{
                      left: `${startOffset}%`,
                      width: `${width}%`,
                    }}
                    title={`${task.name}: ${format(task.start, "MM/dd/yyyy")} - ${format(task.finish, "MM/dd/yyyy")}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm mt-2">
        <span>{format(contractSignDate, "MM/dd/yyyy")}</span>
        {targetCompletionDate && <span>{format(targetCompletionDate, "MM/dd/yyyy")}</span>}
      </div>
    </div>
  )
}
