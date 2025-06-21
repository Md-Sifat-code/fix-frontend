"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PlanFormProps {
  onSubmit: (data: any) => void
}

export function PlanForm({ onSubmit }: PlanFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Add form submission logic here
    onSubmit({
      // Add form data here
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="planName">Plan Name</Label>
        <Input id="planName" required />
      </div>
      <div>
        <Label htmlFor="architect">Architect</Label>
        <Input id="architect" required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" min="0" step="0.01" required />
      </div>
      <Button type="submit">Submit Plan</Button>
    </form>
  )
}
