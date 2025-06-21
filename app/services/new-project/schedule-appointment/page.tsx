"use client"

import { useState } from "react"
import { format, addDays, setHours, setMinutes, isWeekend, isBefore, isAfter } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import Layout from "@/components/Layout"

const APPOINTMENT_DURATION = 60 // minutes
const WORK_START_TIME = 9 // 9 AM
const WORK_END_TIME = 12 // 12 PM (noon)

export default function ScheduleAppointmentPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const isDateSelectable = (date: Date) => {
    return !isWeekend(date) && isAfter(date, new Date())
  }

  const getAvailableTimes = (date: Date) => {
    const times = []
    let currentTime = setMinutes(setHours(date, WORK_START_TIME), 0)
    const endTime = setMinutes(setHours(date, WORK_END_TIME), 0)

    while (isBefore(currentTime, endTime)) {
      times.push(format(currentTime, "h:mm a"))
      currentTime = addDays(currentTime, 0) // Create a new Date object
      currentTime.setMinutes(currentTime.getMinutes() + APPOINTMENT_DURATION)
    }

    return times
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      // Here you would typically send this data to your backend
      console.log("Appointment scheduled for:", format(selectedDate, "MMMM d, yyyy"), "at", selectedTime)
      alert("Appointment scheduled successfully!")
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-6">Schedule an Appointment</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => !isDateSelectable(date)}
              className="rounded-md border"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Time</h2>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {getAvailableTimes(selectedDate).map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Please select a date first</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <Button onClick={handleSubmit} disabled={!selectedDate || !selectedTime} className="w-full md:w-auto">
            Schedule Appointment
          </Button>
        </div>
      </div>
    </Layout>
  )
}
