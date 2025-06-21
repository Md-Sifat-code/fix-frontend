export interface StaffHours {
  principal: number
  projectArchitect: number
  projectManager: number
  designer: number
  drafter: number
  consultant: number
}

export interface ProjectInfo {
  projectName: string
  clientName: string
  projectAddress: string
  projectCity: string
  projectState: string
  projectZip: string
  projectType: string
  projectSize: string
  estimatedBudget: string
  targetCompletionDate: string
  additionalNotes: string
}

export interface Objective {
  id: string
  name: string
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  start: number
  duration: number
  staffHours: StaffHours
}
