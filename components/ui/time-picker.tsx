"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  value: string | null
  onChange: (value: string | null) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]

  const handleChange = (newValue: string) => {
    onChange(newValue === "none" ? null : newValue)
  }

  return (
    <Select value={value || "none"} onValueChange={handleChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No time</SelectItem>
        {hours.flatMap((hour) =>
          minutes.map((minute) => {
            const time = `${hour}:${minute}`
            return (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            )
          }),
        )}
      </SelectContent>
    </Select>
  )
}
