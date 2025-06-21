"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Task {
  id: string
  title: string
  completed: boolean
}

interface TaskManagementProps {
  tasks: Task[]
}

export function TaskManagement({ tasks: initialTasks }: TaskManagementProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle, completed: false }])
      setNewTaskTitle("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Button onClick={addTask}>Add</Button>
        </div>
        <ScrollArea className="h-[200px]">
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                  <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
