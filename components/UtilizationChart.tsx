interface UtilizationChartProps {
  value: number
  goal: number
  title: string
  customLabel?: string
}

export function UtilizationChart({ value, goal, title, customLabel }: UtilizationChartProps) {
  const percentage = Math.min((value / goal) * 100, 100)
  const strokeWidth = 2.5
  const radius = 18
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-10 h-10">
        <svg className="w-full h-full" viewBox="0 0 40 40">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
          />
          {/* Progress circle */}
          <circle
            className="text-blue-600"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="20"
            cy="20"
            transform="rotate(-90 20 20)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-medium text-gray-700">{customLabel || `${Math.round(percentage)}%`}</span>
        </div>
      </div>
      <p className="mt-0.5 text-[8px] text-gray-500 text-center">{title}</p>
    </div>
  )
}
