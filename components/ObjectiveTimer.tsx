"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Square, Clock, Save } from "lucide-react"
import type { Objective, Project } from "@/types"

interface ObjectiveTimerProps {
  objective: Objective | null
  isRunning: boolean
  onStop: () => void
  project: Project
}

export function ObjectiveTimer({ objective, isRunning, onStop, project }: ObjectiveTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [savedTime, setSavedTime] = useState(0)
  const [hourlyRate, setHourlyRate] = useState(150) // Default hourly rate
  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [isRunningState, setIsRunning] = useState(isRunning)

  // Start timer when isRunning changes to true
  useEffect(() => {
    if (isRunning && objective) {
      startTimeRef.current = Date.now()

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Start a new timer that updates every second
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setElapsedTime(currentElapsed)

          // Check if it's end of workday (5:00 PM)
          const now = new Date()
          if (now.getHours() >= 17 && now.getMinutes() >= 0) {
            // Auto-stop timer at end of day
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }

            // Send notification to Project Manager
            notifyProjectManager(objective.name, formatTime(currentElapsed))

            // Save the logged time automatically
            setSavedTime(savedTime + currentElapsed)
            setElapsedTime(0)
            setIsRunning(false)
            onStop()
          }
        }
      }, 1000)
    } else {
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Reset elapsed time
      setElapsedTime(0)
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, objective, onStop, savedTime])

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  // Function to notify project manager that task is ending for the day
  const notifyProjectManager = (objectiveName: string, timeSpent: string) => {
    console.log(`Notifying PM: Task "${objectiveName}" stopped after ${timeSpent} at end of workday`)

    // In a real app, this would send a notification through your notification system
    // For example, you might call an API endpoint or use a messaging service

    // Example implementation:
    // sendNotification({
    //   recipientRole: 'project_manager',
    //   projectId: project.id,
    //   title: 'Task Timer Auto-stopped',
    //   message: `Timer for "${objectiveName}" automatically stopped after ${timeSpent} at end of workday.`,
    //   priority: 'medium',
    //   type: 'timer'
    // })
  }

  // Calculate cost based on time and hourly rate
  const calculateCost = (seconds: number) => {
    const hours = seconds / 3600
    return (hours * hourlyRate).toFixed(2)
  }

  // Save the logged time
  const handleSaveTime = () => {
    // In a real app, you would save this to the database
    setSavedTime(savedTime + elapsedTime)
    setElapsedTime(0)
    console.log(`Saved ${formatTime(elapsedTime)} for objective: ${objective?.name}`)

    // Stop the timer
    onStop()
  }

  if (!objective) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>No active timer</p>
        <p className="text-sm mt-2">Start a timer from the Objectives tab</p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="font-medium">Tracking time for:</h3>
          <p className="text-lg font-bold mt-1">{objective.name}</p>
          <p className="text-sm text-gray-500 mt-1">Project: {project.name}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-center">
            <div className="text-3xl font-mono font-bold mb-2">{formatTime(elapsedTime)}</div>
            <p className="text-sm text-gray-500">Current session: ${calculateCost(elapsedTime)}</p>
          </div>

          {savedTime > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm font-medium">Previously logged</p>
              <p className="text-lg font-mono mt-1">{formatTime(savedTime)}</p>
              <p className="text-sm text-gray-500">Value: ${calculateCost(savedTime)}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={onStop}
            timer={isRunning}
            timerStartTime={startTimeRef.current || undefined}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Timer
          </Button>

          <Button size="sm" onClick={handleSaveTime}>
            <Save className="h-4 w-4 mr-2" />
            Save Time
          </Button>
        </div>
        {isRunning === false && savedTime > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-2">Adjust Time Entry</h4>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-2 py-1 text-sm border rounded"
                  value={Math.floor(savedTime / 3600)}
                  onChange={(e) => {
                    const hours = Number.parseInt(e.target.value) || 0
                    const mins = Math.floor((savedTime % 3600) / 60)
                    const secs = savedTime % 60
                    setSavedTime(hours * 3600 + mins * 60 + secs)
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-full px-2 py-1 text-sm border rounded"
                  value={Math.floor((savedTime % 3600) / 60)}
                  onChange={(e) => {
                    const mins = Number.parseInt(e.target.value) || 0
                    const hours = Math.floor(savedTime / 3600)
                    const secs = savedTime % 60
                    setSavedTime(hours * 3600 + mins * 60 + secs)
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="w-full px-2 py-1 text-sm border rounded"
                  value={savedTime % 60}
                  onChange={(e) => {
                    const secs = Number.parseInt(e.target.value) || 0
                    const hours = Math.floor(savedTime / 3600)
                    const mins = Math.floor((savedTime % 3600) / 60)
                    setSavedTime(hours * 3600 + mins * 60 + secs)
                  }}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => console.log(`Time adjusted: ${formatTime(savedTime)}`)}
            >
              Update Time Entry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
