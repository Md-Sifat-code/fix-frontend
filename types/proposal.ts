export interface ScopeItem {
  id: string
  taskNumber: number
  description: string
  defaultHours: number
  ratePerHour: number
  isRequired: boolean
  category: "information" | "schematic" | "construction" | "custom"
}

export interface ProposalScope {
  projectName: string
  clientName: string
  projectNumber: string
  tasks: ScopeItem[]
  totalHours: number
  totalCost: number
}

export const defaultScopeItems: ScopeItem[] = [
  // Task 1: Assemble Information
  {
    id: "1.1",
    taskNumber: 1,
    description: "Attend an in-person meeting at jobsite with SCE CRE and CBRE to go over project requirements",
    defaultHours: 12,
    ratePerHour: 140,
    isRequired: true,
    category: "information",
  },
  {
    id: "1.2",
    taskNumber: 1,
    description: "Internal project meetings and setup",
    defaultHours: 6,
    ratePerHour: 130,
    isRequired: true,
    category: "information",
  },
  {
    id: "1.3",
    taskNumber: 1,
    description: "Visit project site to field verify existing conditions (a maximum of one day)",
    defaultHours: 8,
    ratePerHour: 130,
    isRequired: true,
    category: "information",
  },
  {
    id: "1.4",
    taskNumber: 1,
    description: "Obtain as-built drawings from SCE, if available",
    defaultHours: 2,
    ratePerHour: 130,
    isRequired: true,
    category: "information",
  },
  {
    id: "1.5",
    taskNumber: 1,
    description: "Prepare as-built plans",
    defaultHours: 30,
    ratePerHour: 130,
    isRequired: true,
    category: "information",
  },

  // Task 2: 100% Schematic Design (SDs)
  {
    id: "2.1",
    taskNumber: 2,
    description: "Attend conference call meetings with SCE CRE and CBRE to discuss project requirements",
    defaultHours: 4,
    ratePerHour: 140,
    isRequired: true,
    category: "schematic",
  },
  {
    id: "2.2",
    taskNumber: 2,
    description: "Prepare Life Safety Plan",
    defaultHours: 4,
    ratePerHour: 130,
    isRequired: true,
    category: "schematic",
  },
  {
    id: "2.3",
    taskNumber: 2,
    description: "Prepare Demolition Floor Plan",
    defaultHours: 6,
    ratePerHour: 130,
    isRequired: false,
    category: "schematic",
  },
  {
    id: "2.4",
    taskNumber: 2,
    description: "Prepare Proposed Floor Plan",
    defaultHours: 8,
    ratePerHour: 130,
    isRequired: true,
    category: "schematic",
  },
  {
    id: "2.5",
    taskNumber: 2,
    description: "Prepare Proposed Reflected Ceiling Plan",
    defaultHours: 8,
    ratePerHour: 130,
    isRequired: true,
    category: "schematic",
  },
  {
    id: "2.6",
    taskNumber: 2,
    description: "Review plans for conformance with project requirements (QA/QC)",
    defaultHours: 4,
    ratePerHour: 140,
    isRequired: true,
    category: "schematic",
  },

  // Task 3: 100% Construction Documents (CDs)
  {
    id: "3.1",
    taskNumber: 3,
    description: "Attend conference call meetings with SCE CRE and CBRE to coordinate CDs",
    defaultHours: 8,
    ratePerHour: 140,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.2",
    taskNumber: 3,
    description: "Take 100% SDs to 50% CDs",
    defaultHours: 14,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.3",
    taskNumber: 3,
    description: "Prepare Title Sheet",
    defaultHours: 2,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.4",
    taskNumber: 3,
    description: "Prepare General Notes",
    defaultHours: 2,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.5",
    taskNumber: 3,
    description: "Prepare Site Plan",
    defaultHours: 3,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.6",
    taskNumber: 3,
    description: "Prepare Interior Elevations",
    defaultHours: 6,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.7",
    taskNumber: 3,
    description: "Prepare Building Sections",
    defaultHours: 6,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.8",
    taskNumber: 3,
    description: "Prepare Construction Details",
    defaultHours: 8,
    ratePerHour: 130,
    isRequired: true,
    category: "construction",
  },
  {
    id: "3.9",
    taskNumber: 3,
    description: "Review plans for conformance with project requirements (QA/QC)",
    defaultHours: 6,
    ratePerHour: 140,
    isRequired: true,
    category: "construction",
  },
]

export const calculateTotals = (items: ScopeItem[]) => {
  return items.reduce(
    (acc, item) => {
      const cost = item.defaultHours * item.ratePerHour
      return {
        totalHours: acc.totalHours + item.defaultHours,
        totalCost: acc.totalCost + cost,
      }
    },
    { totalHours: 0, totalCost: 0 },
  )
}
