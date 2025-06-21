"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        "not-started": "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
        "in-progress": "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        completed: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export interface TaskStatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "not-started" | "in-progress" | "completed"
  onStatusChange?: (status: "not-started" | "in-progress" | "completed") => void
}

function TaskStatusBadge({ className, status, onStatusChange, ...props }: TaskStatusBadgeProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleStatusChange = (newStatus: "not-started" | "in-progress" | "completed") => {
    // Close dropdown immediately
    setIsOpen(false)

    // Provide visual feedback with a small delay to show the change
    if (onStatusChange) {
      // Apply status change immediately in UI
      const prevStatus = status

      // Call the callback to update parent state
      onStatusChange(newStatus)

      // If we're in a browser environment, show a visual indicator of the change
      if (typeof window !== "undefined") {
        const element = document.activeElement as HTMLElement
        if (element) {
          element.blur()
        }
      }
    }
  }

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          badgeVariants({ variant: status }),
          className,
          "cursor-pointer transition-all duration-200 hover:shadow-sm flex items-center",
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {status === "not-started" ? (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
            Not Started
          </>
        ) : status === "in-progress" ? (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1 animate-pulse"></span>
            In Progress
          </>
        ) : (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Completed
          </>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-md shadow-lg border border-gray-200">
          <div
            className={cn(badgeVariants({ variant: "not-started" }), "m-1 cursor-pointer flex items-center")}
            onClick={() => handleStatusChange("not-started")}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
            Not Started
          </div>
          <div
            className={cn(badgeVariants({ variant: "in-progress" }), "m-1 cursor-pointer flex items-center")}
            onClick={() => handleStatusChange("in-progress")}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
            In Progress
          </div>
          <div
            className={cn(badgeVariants({ variant: "completed" }), "m-1 cursor-pointer flex items-center")}
            onClick={() => handleStatusChange("completed")}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Completed
          </div>
        </div>
      )}
    </div>
  )
}

export { Badge, badgeVariants, TaskStatusBadge }
