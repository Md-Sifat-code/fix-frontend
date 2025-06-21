"use client"

import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ThumbprintButton } from "@/components/ThumbprintButton"

export function ScheduleAppointmentSection({ formData, updateFormData, goToNextSection }) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    formData.appointmentDate ? new Date(formData.appointmentDate) : undefined,
  )
  const [selectedTime, setSelectedTime] = React.useState<string | null>(formData.appointmentTime || null)
  const [meetingLocation, setMeetingLocation] = React.useState(formData.meetingLocation || "")

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null)
    updateFormData({ appointmentDate: date ? date.toISOString() : null, appointmentTime: null })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    updateFormData({ appointmentTime: time })
  }

  const getAvailableTimes = (date: Date | undefined) => {
    // This is a placeholder. In a real application, you'd fetch available times from your backend.
    return ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
  }

  const handleInputChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value })
  }

  const handleMeetingLocationChange = (e) => {
    setMeetingLocation(e.target.value)
    updateFormData({ meetingLocation: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <Label htmlFor="appointmentDate" className="text-xs">
            Select Date
          </Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="mt-2 border-0 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="appointmentTime" className="text-xs">
            Select Time
          </Label>
          {selectedDate ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {getAvailableTimes(selectedDate).map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => handleTimeSelect(time)}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Available times will appear here once you select a date.
            </p>
          )}
        </div>
      </div>
      {selectedDate && selectedTime && (
        <div>
          <h2 className="text-base font-medium mb-6">Selected Appointment</h2>
          <p className="text-sm">
            Date: {selectedDate.toDateString()} at {selectedTime}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="appointmentType" className="text-xs">
            Appointment Type
          </Label>
          <Select
            name="appointmentType"
            value={formData.appointmentType}
            onValueChange={(value) => updateFormData({ appointmentType: value })}
          >
            <SelectTrigger id="appointmentType" className="mt-1">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-person">In-person Meeting</SelectItem>
              <SelectItem value="video-call">Video Call</SelectItem>
              <SelectItem value="phone-call">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.appointmentType === "in-person" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="meetingLocation" className="text-xs">
                Meeting Location
              </Label>
              <Input
                id="meetingLocation"
                name="meetingLocation"
                value={meetingLocation}
                onChange={handleMeetingLocationChange}
                className="mt-1"
                placeholder="Enter the address for the meeting"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Client will be responsible for representative's travel expenses to meeting location.
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="appointmentNotes" className="text-xs">
            Additional Notes for the Appointment
          </Label>
          <Textarea
            id="appointmentNotes"
            name="appointmentNotes"
            value={formData.appointmentNotes}
            onChange={handleInputChange}
            className="mt-1"
            rows={4}
            placeholder="Any specific topics you'd like to discuss or questions you have for the architect?"
          />
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <ThumbprintButton onClick={goToNextSection} text="Next Step" />
      </div>
    </div>
  )
}
