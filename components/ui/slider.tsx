"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, onValueChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    if (onValueChange) {
      onValueChange(value)
    }
  }

  return (
    <input
      type="range"
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
        "dark:bg-gray-700",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full",
        "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full",
        className,
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  )
})
Slider.displayName = "Slider"

export { Slider }
