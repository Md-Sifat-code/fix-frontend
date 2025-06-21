"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface StaffRole {
  title: string
  rate: number
  salary: number
}

interface FinancialSettings {
  firmMultiplier: number
  staffRoles: {
    [key: string]: StaffRole
  }
}

export function FinancialSettings() {
  const [settings, setSettings] = useState<FinancialSettings>({
    firmMultiplier: 3,
    staffRoles: {
      principal: { title: "Principal", rate: 250, salary: 83.33 },
      projectArchitect: { title: "Project Architect", rate: 200, salary: 66.67 },
      projectManager: { title: "Project Manager", rate: 175, salary: 58.33 },
      designer: { title: "Designer", rate: 125, salary: 41.67 },
      drafter: { title: "Drafter", rate: 100, salary: 33.33 },
    },
  })

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMultiplier = Number.parseFloat(e.target.value)
    setSettings((prev) => ({
      ...prev,
      firmMultiplier: newMultiplier,
      staffRoles: Object.fromEntries(
        Object.entries(prev.staffRoles).map(([key, role]) => [
          key,
          { ...role, rate: Math.round(role.salary * newMultiplier) },
        ]),
      ),
    }))
  }

  const handleSalaryChange = (role: string, newSalary: number) => {
    setSettings((prev) => ({
      ...prev,
      staffRoles: {
        ...prev.staffRoles,
        [role]: {
          ...prev.staffRoles[role],
          salary: newSalary,
          rate: Math.round(newSalary * prev.firmMultiplier),
        },
      },
    }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Settings</h2>

      <div>
        <Label htmlFor="firmMultiplier">Firm Multiplier</Label>
        <Input
          id="firmMultiplier"
          type="number"
          value={settings.firmMultiplier}
          onChange={handleMultiplierChange}
          step="0.1"
          min="1"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Staff Hourly Rates</h3>
        {Object.entries(settings.staffRoles).map(([key, role]) => (
          <div key={key} className="grid grid-cols-3 gap-4 items-center">
            <Label htmlFor={`${key}-salary`}>{role.title} Salary</Label>
            <Input
              id={`${key}-salary`}
              type="number"
              value={role.salary}
              onChange={(e) => handleSalaryChange(key, Number.parseFloat(e.target.value))}
              step="0.01"
              min="0"
            />
            <div>Rate: ${role.rate}/hour</div>
          </div>
        ))}
      </div>

      <Button>Save Settings</Button>
    </div>
  )
}
