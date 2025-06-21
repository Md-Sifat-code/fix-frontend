"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Compass,
  Ruler,
  Pencil,
  Cloud,
  Sun,
  CloudRain,
  Target,
  Wind,
  Droplets,
  Thermometer,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Clock,
  Loader2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { format, addDays, isSameDay, differenceInDays, isBefore, addHours } from "date-fns"

// Add these imports at the top of the file
import { useState, useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { projectsService } from "@/services/projects-service"
import { useToast } from "@/components/ui/use-toast"

// Add custom scrollbar styles
const scrollbarStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
`

interface DashboardOverviewProps {
  selectedYear: number | "overall"
  setSelectedYear: (year: number | "overall") => void
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    biddingProjects: number
    inquiryProjects: number
  }
  userStats: {
    assignedProjects: number
    assignedTasks: number
    completedTasks: number
    taskCompletionRate: number
  }
  importantTasks: any[]
  years: number[]
  onViewTask: (taskId: string) => void
  onViewAllTasks: () => void
}

// Weather API types
interface WeatherLocation {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  temp?: string
  condition?: string
  icon?: any
  isLoading?: boolean
}

interface WeatherData {
  location: string
  condition: string
  temperature: string
  feelsLike: string
  humidity: string
  wind: string
  precipitation: string
  icon: any
  hourlyForecast: {
    time: string
    temp: string
    condition: string
    icon: any
    precipitation: string
  }[]
  dailyForecast: {
    day: string
    high: string
    low: string
    condition: string
    icon: any
  }[]
}

// Weather icon mapping
const weatherIconMap: Record<string, any> = {
  "01d": Sun, // clear sky day
  "01n": Sun, // clear sky night
  "02d": Cloud, // few clouds day
  "02n": Cloud, // few clouds night
  "03d": Cloud, // scattered clouds day
  "03n": Cloud, // scattered clouds night
  "04d": Cloud, // broken clouds day
  "04n": Cloud, // broken clouds night
  "09d": CloudRain, // shower rain day
  "09n": CloudRain, // shower rain night
  "10d": CloudRain, // rain day
  "10n": CloudRain, // rain night
  "11d": CloudLightning, // thunderstorm day
  "11n": CloudLightning, // thunderstorm night
  "13d": CloudSnow, // snow day
  "13n": CloudSnow, // snow night
  "50d": CloudFog, // mist day
  "50n": CloudFog, // mist night
}

// Mock data for user objectives and stats
const userObjectiveStats = {
  totalAssigned: 15,
  totalCompleted: 8,
  inProgress: 4,
  notStarted: 3,
  totalTasks: 50,
  completedTasks: 35,
}

// Update the userObjectives array to use contract terminology and include totalHours, location, priority, and status
const userObjectives = [
  {
    id: "obj1",
    name: "Assemble Information",
    projectName: "Project Alpha",
    projectId: "projectAlphaId",
    location: "San Francisco, CA",
    order: "A",
    dueDate: addDays(new Date(), 2),
    totalTasks: 10,
    completedTasks: 7,
    totalHours: 24,
    priority: "high",
    status: "in-progress",
    assignee: "John Doe",
  },
  {
    id: "obj2",
    name: "Schematic Design",
    projectName: "Project Beta",
    projectId: "projectBetaId",
    location: "Los Angeles, CA",
    order: "B",
    dueDate: addDays(new Date(), 5),
    totalTasks: 8,
    completedTasks: 6,
    totalHours: 32,
    priority: "medium",
    status: "in-progress",
    assignee: "Jane Smith",
  },
  {
    id: "obj3",
    name: "Design Development",
    projectName: "Project Gamma",
    projectId: "projectGammaId",
    location: "Seattle, WA",
    order: "C",
    dueDate: addDays(new Date(), 7),
    totalTasks: 12,
    completedTasks: 8,
    totalHours: 48,
    priority: "low",
    status: "not-started",
    assignee: "Mike Johnson",
  },
  {
    id: "obj4",
    name: "50% Construction Documents",
    projectName: "Project Delta",
    projectId: "projectDeltaId",
    location: "Chicago, IL",
    order: "D",
    dueDate: addDays(new Date(), 10),
    totalTasks: 15,
    completedTasks: 10,
    totalHours: 60,
    priority: "high",
    status: "on-hold",
    assignee: "Sarah Williams",
  },
  {
    id: "obj5",
    name: "100% Construction Documents",
    projectName: "Project Epsilon",
    projectId: "projectEpsilonId",
    location: "New York, NY",
    order: "E",
    dueDate: addDays(new Date(), 15),
    totalTasks: 10,
    completedTasks: 5,
    totalHours: 40,
    priority: "medium",
    status: "in-progress",
    assignee: "David Brown",
  },
  {
    id: "obj6",
    name: "Agency Review",
    projectName: "Project Zeta",
    projectId: "projectZetaId",
    location: "Denver, CO",
    order: "F",
    dueDate: addDays(new Date(), 20),
    totalTasks: 8,
    completedTasks: 2,
    totalHours: 36,
    priority: "medium",
    status: "not-started",
    assignee: "Lisa Chen",
  },
  {
    id: "obj7",
    name: "Bidding & Negotiation",
    projectName: "Project Eta",
    projectId: "projectEtaId",
    location: "Austin, TX",
    order: "G",
    dueDate: addDays(new Date(), 25),
    totalTasks: 6,
    completedTasks: 0,
    totalHours: 30,
    priority: "low",
    status: "not-started",
    assignee: "Robert Kim",
  },
]

// Default locations for quick access
const defaultLocations: WeatherLocation[] = [
  { id: "la", name: "Los Angeles", country: "US", lat: 34.0522, lon: -118.2437 },
  { id: "ny", name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { id: "ld", name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { id: "tk", name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { id: "sy", name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
  { id: "pr", name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { id: "db", name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { id: "sp", name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
]

// Mock weather data for locations
const mockWeatherData: Record<string, WeatherData> = {
  la: {
    location: "Los Angeles",
    condition: "Sunny",
    temperature: "78°F",
    feelsLike: "80°F",
    humidity: "45%",
    wind: "5 mph",
    precipitation: "0%",
    icon: Sun,
    hourlyForecast: [
      { time: "Now", temp: "78°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "1PM", temp: "79°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "2PM", temp: "80°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "3PM", temp: "81°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "0%" },
      { time: "4PM", temp: "80°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "5PM", temp: "78°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "6PM", temp: "75°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "7PM", temp: "72°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "8PM", temp: "70°F", condition: "Light Rain", icon: CloudRain, precipitation: "40%" },
      { time: "9PM", temp: "68°F", condition: "Light Rain", icon: CloudRain, precipitation: "50%" },
    ],
    dailyForecast: [
      { day: "Today", high: "81°F", low: "64°F", condition: "Partly Cloudy", icon: Cloud },
      { day: "Tomorrow", high: "80°F", low: "67°F", condition: "Partly Cloudy", icon: Cloud },
      { day: "Wed", high: "75°F", low: "64°F", condition: "Cloudy", icon: Cloud },
    ],
  },
  ny: {
    location: "New York",
    condition: "Cloudy",
    temperature: "65°F",
    feelsLike: "63°F",
    humidity: "70%",
    wind: "10 mph",
    precipitation: "20%",
    icon: Cloud,
    hourlyForecast: [
      { time: "Now", temp: "65°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "1PM", temp: "66°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "2PM", temp: "67°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "3PM", temp: "66°F", condition: "Light Rain", icon: CloudRain, precipitation: "40%" },
      { time: "4PM", temp: "65°F", condition: "Light Rain", icon: CloudRain, precipitation: "50%" },
      { time: "5PM", temp: "64°F", condition: "Light Rain", icon: CloudRain, precipitation: "40%" },
      { time: "6PM", temp: "62°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "7PM", temp: "60°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "8PM", temp: "58°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "9PM", temp: "57°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
    ],
    dailyForecast: [
      { day: "Today", high: "67°F", low: "55°F", condition: "Cloudy", icon: Cloud },
      { day: "Tomorrow", high: "70°F", low: "58°F", condition: "Partly Cloudy", icon: Cloud },
      { day: "Wed", high: "72°F", low: "60°F", condition: "Sunny", icon: Sun },
    ],
  },
  ld: {
    location: "London",
    condition: "Rainy",
    temperature: "59°F",
    feelsLike: "57°F",
    humidity: "85%",
    wind: "12 mph",
    precipitation: "70%",
    icon: CloudRain,
    hourlyForecast: [
      { time: "Now", temp: "59°F", condition: "Rainy", icon: CloudRain, precipitation: "70%" },
      { time: "1PM", temp: "59°F", condition: "Rainy", icon: CloudRain, precipitation: "80%" },
      { time: "2PM", temp: "58°F", condition: "Rainy", icon: CloudRain, precipitation: "80%" },
      { time: "3PM", temp: "58°F", condition: "Rainy", icon: CloudRain, precipitation: "70%" },
      { time: "4PM", temp: "57°F", condition: "Cloudy", icon: Cloud, precipitation: "50%" },
      { time: "5PM", temp: "56°F", condition: "Cloudy", icon: Cloud, precipitation: "40%" },
      { time: "6PM", temp: "55°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "7PM", temp: "54°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "8PM", temp: "53°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "9PM", temp: "52°F", condition: "Cloudy", icon: Cloud, precipitation: "10%" },
    ],
    dailyForecast: [
      { day: "Today", high: "59°F", low: "52°F", condition: "Rainy", icon: CloudRain },
      { day: "Tomorrow", high: "62°F", low: "54°F", condition: "Cloudy", icon: Cloud },
      { day: "Wed", high: "65°F", low: "56°F", condition: "Partly Cloudy", icon: Cloud },
    ],
  },
  tk: {
    location: "Tokyo",
    condition: "Partly Cloudy",
    temperature: "72°F",
    feelsLike: "74°F",
    humidity: "60%",
    wind: "8 mph",
    precipitation: "10%",
    icon: Cloud,
    hourlyForecast: [
      { time: "Now", temp: "72°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "1PM", temp: "73°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "2PM", temp: "74°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "3PM", temp: "75°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "4PM", temp: "74°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "5PM", temp: "73°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "6PM", temp: "72°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "7PM", temp: "70°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "8PM", temp: "69°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
      { time: "9PM", temp: "68°F", condition: "Partly Cloudy", icon: Cloud, precipitation: "10%" },
    ],
    dailyForecast: [
      { day: "Today", high: "75°F", low: "68°F", condition: "Partly Cloudy", icon: Cloud },
      { day: "Tomorrow", high: "77°F", low: "69°F", condition: "Sunny", icon: Sun },
      { day: "Wed", high: "79°F", low: "70°F", condition: "Sunny", icon: Sun },
    ],
  },
  sy: {
    location: "Sydney",
    condition: "Sunny",
    temperature: "81°F",
    feelsLike: "83°F",
    humidity: "55%",
    wind: "7 mph",
    precipitation: "0%",
    icon: Sun,
    hourlyForecast: [
      { time: "Now", temp: "81°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "1PM", temp: "82°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "2PM", temp: "83°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "3PM", temp: "83°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "4PM", temp: "82°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "5PM", temp: "81°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "6PM", temp: "79°F", condition: "Clear", icon: Sun, precipitation: "0%" },
      { time: "7PM", temp: "77°F", condition: "Clear", icon: Sun, precipitation: "0%" },
      { time: "8PM", temp: "75°F", condition: "Clear", icon: Sun, precipitation: "0%" },
      { time: "9PM", temp: "74°F", condition: "Clear", icon: Sun, precipitation: "0%" },
    ],
    dailyForecast: [
      { day: "Today", high: "83°F", low: "72°F", condition: "Sunny", icon: Sun },
      { day: "Tomorrow", high: "85°F", low: "73°F", condition: "Sunny", icon: Sun },
      { day: "Wed", high: "82°F", low: "71°F", condition: "Partly Cloudy", icon: Cloud },
    ],
  },
  pr: {
    location: "Paris",
    condition: "Cloudy",
    temperature: "62°F",
    feelsLike: "60°F",
    humidity: "75%",
    wind: "9 mph",
    precipitation: "30%",
    icon: Cloud,
    hourlyForecast: [
      { time: "Now", temp: "62°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "1PM", temp: "63°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "2PM", temp: "64°F", condition: "Cloudy", icon: Cloud, precipitation: "40%" },
      { time: "3PM", temp: "63°F", condition: "Light Rain", icon: CloudRain, precipitation: "50%" },
      { time: "4PM", temp: "62°F", condition: "Light Rain", icon: CloudRain, precipitation: "50%" },
      { time: "5PM", temp: "61°F", condition: "Light Rain", icon: CloudRain, precipitation: "40%" },
      { time: "6PM", temp: "60°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "7PM", temp: "59°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "8PM", temp: "58°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "9PM", temp: "57°F", condition: "Cloudy", icon: Cloud, precipitation: "10%" },
    ],
    dailyForecast: [
      { day: "Today", high: "64°F", low: "57°F", condition: "Cloudy", icon: Cloud },
      { day: "Tomorrow", high: "66°F", low: "58°F", condition: "Partly Cloudy", icon: Cloud },
      { day: "Wed", high: "68°F", low: "59°F", condition: "Sunny", icon: Sun },
    ],
  },
  db: {
    location: "Dubai",
    condition: "Sunny",
    temperature: "95°F",
    feelsLike: "98°F",
    humidity: "40%",
    wind: "6 mph",
    precipitation: "0%",
    icon: Sun,
    hourlyForecast: [
      { time: "Now", temp: "95°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "1PM", temp: "96°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "2PM", temp: "97°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "3PM", temp: "98°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "4PM", temp: "97°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "5PM", temp: "95°F", condition: "Sunny", icon: Sun, precipitation: "0%" },
      { time: "6PM", temp: "93°F", condition: "Clear", icon: Sun, precipitation: "0%" },
      { time: "7PM", temp: "90°F", condition: "Clear", icon: Sun, precipitation: "0%" },
      { time: "8PM", temp: "88°F", condition: "Clear", icon: Sun, precipitation: "0%" },
      { time: "9PM", temp: "86°F", condition: "Clear", icon: Sun, precipitation: "0%" },
    ],
    dailyForecast: [
      { day: "Today", high: "98°F", low: "82°F", condition: "Sunny", icon: Sun },
      { day: "Tomorrow", high: "99°F", low: "83°F", condition: "Sunny", icon: Sun },
      { day: "Wed", high: "97°F", low: "82°F", condition: "Sunny", icon: Sun },
    ],
  },
  sp: {
    location: "Singapore",
    condition: "Thunderstorms",
    temperature: "86°F",
    feelsLike: "92°F",
    humidity: "80%",
    wind: "5 mph",
    precipitation: "60%",
    icon: CloudLightning,
    hourlyForecast: [
      { time: "Now", temp: "86°F", condition: "Thunderstorms", icon: CloudLightning, precipitation: "60%" },
      { time: "1PM", temp: "87°F", condition: "Thunderstorms", icon: CloudLightning, precipitation: "70%" },
      { time: "2PM", temp: "86°F", condition: "Thunderstorms", icon: CloudLightning, precipitation: "80%" },
      { time: "3PM", temp: "85°F", condition: "Thunderstorms", icon: CloudLightning, precipitation: "70%" },
      { time: "4PM", temp: "84°F", condition: "Rain", icon: CloudRain, precipitation: "60%" },
      { time: "5PM", temp: "83°F", condition: "Rain", icon: CloudRain, precipitation: "50%" },
      { time: "6PM", temp: "82°F", condition: "Cloudy", icon: Cloud, precipitation: "40%" },
      { time: "7PM", temp: "81°F", condition: "Cloudy", icon: Cloud, precipitation: "30%" },
      { time: "8PM", temp: "80°F", condition: "Cloudy", icon: Cloud, precipitation: "20%" },
      { time: "9PM", temp: "79°F", condition: "Cloudy", icon: Cloud, precipitation: "10%" },
    ],
    dailyForecast: [
      { day: "Today", high: "87°F", low: "78°F", condition: "Thunderstorms", icon: CloudLightning },
      { day: "Tomorrow", high: "88°F", low: "79°F", condition: "Thunderstorms", icon: CloudLightning },
      { day: "Wed", high: "86°F", low: "78°F", condition: "Rain", icon: CloudRain },
    ],
  },
}

// Generate mock weather data for a location that doesn't have predefined data
const generateMockWeatherData = (location: WeatherLocation): WeatherData => {
  // Generate random temperature between 50-90°F
  const temp = Math.floor(Math.random() * 40) + 50
  const feelsLike = temp + (Math.floor(Math.random() * 5) - 2) // +/- 2 degrees

  // Random conditions
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorms"]
  const conditionIndex = Math.floor(Math.random() * conditions.length)
  const condition = conditions[conditionIndex]

  // Icon based on condition
  let icon
  switch (condition) {
    case "Sunny":
      icon = Sun
      break
    case "Partly Cloudy":
      icon = Cloud
      break
    case "Cloudy":
      icon = Cloud
      break
    case "Rainy":
      icon = CloudRain
      break
    case "Thunderstorms":
      icon = CloudLightning
      break
    default:
      icon = Cloud
  }

  // Generate hourly forecast
  const hourlyForecast = []
  let currentTemp = temp
  for (let i = 0; i < 10; i++) {
    // Slight temperature variation
    currentTemp += Math.floor(Math.random() * 3) - 1
    const hourCondition = conditions[Math.floor(Math.random() * conditions.length)]
    let hourIcon
    switch (hourCondition) {
      case "Sunny":
        hourIcon = Sun
        break
      case "Partly Cloudy":
        hourIcon = Cloud
        break
      case "Cloudy":
        hourIcon = Cloud
        break
      case "Rainy":
        hourIcon = CloudRain
        break
      case "Thunderstorms":
        hourIcon = CloudLightning
        break
      default:
        hourIcon = Cloud
    }

    hourlyForecast.push({
      time: i === 0 ? "Now" : `${i + 1}PM`,
      temp: `${currentTemp}°F`,
      condition: hourCondition,
      icon: hourIcon,
      precipitation: `${Math.floor(Math.random() * 100)}%`,
    })
  }

  // Generate daily forecast
  const dailyForecast = []
  for (let i = 0; i < 3; i++) {
    const dayTemp = temp + (Math.floor(Math.random() * 10) - 5)
    const lowTemp = dayTemp - (Math.floor(Math.random() * 10) + 5)
    const dayCondition = conditions[Math.floor(Math.random() * conditions.length)]
    let dayIcon
    switch (dayCondition) {
      case "Sunny":
        dayIcon = Sun
        break
      case "Partly Cloudy":
        dayIcon = Cloud
        break
      case "Cloudy":
        dayIcon = Cloud
        break
      case "Rainy":
        dayIcon = CloudRain
        break
      case "Thunderstorms":
        dayIcon = CloudLightning
        break
      default:
        dayIcon = Cloud
    }

    dailyForecast.push({
      day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : "Wed",
      high: `${dayTemp}°F`,
      low: `${lowTemp}°F`,
      condition: dayCondition,
      icon: dayIcon,
    })
  }

  return {
    location: location.name,
    condition,
    temperature: `${temp}°F`,
    feelsLike: `${feelsLike}°F`,
    humidity: `${Math.floor(Math.random() * 60) + 40}%`,
    wind: `${Math.floor(Math.random() * 15) + 2} mph`,
    precipitation: `${Math.floor(Math.random() * 100)}%`,
    icon,
    hourlyForecast,
    dailyForecast,
  }
}

// Add these helper functions after the existing helper functions
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200"
    case "medium":
      return "text-amber-600 bg-amber-50 border-amber-200"
    case "low":
      return "text-green-600 bg-green-50 border-green-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50 border-green-200"
    case "in-progress":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "not-started":
      return "text-gray-600 bg-gray-50 border-gray-200"
    case "on-hold":
      return "text-amber-600 bg-amber-50 border-amber-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed"
    case "in-progress":
      return "In Progress"
    case "not-started":
      return "Not Started"
    case "on-hold":
      return "On Hold"
    default:
      return status
  }
}

// Add this function if it doesn't already exist
const formatRelativeDate = (date: Date) => {
  const today = new Date()
  if (isSameDay(date, today)) {
    // If it's today, show the time
    return `Today, ${format(date, "h:mm a")}`
  }
  if (isSameDay(date, addDays(today, 1))) return "Tomorrow"

  const daysAway = differenceInDays(date, today)
  if (daysAway < 7) return `In ${daysAway} days`
  return format(date, "MMM d")
}

export function DashboardOverview({
  selectedYear,
  setSelectedYear,
  stats,
  userStats,
  importantTasks,
  years,
  onViewTask,
  onViewAllTasks,
}: DashboardOverviewProps) {
  // First, let's add a new state to track timers for each objective
  // State for weather and location
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation>(defaultLocations[0])
  const [homeLocation, setHomeLocation] = useState<WeatherLocation>(defaultLocations[0])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(true) // Use mock data by default
  // Add this to the existing state declarations in the DashboardOverview component
  const [objectiveTimers, setObjectiveTimers] = useState<
    Record<
      string,
      {
        isRunning: boolean
        startTime: number | null
        elapsedTime: number
      }
    >
  >({})
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    biddingProjects: 0,
    inquiryProjects: 0,
  })

  const [objectiveStats, setObjectiveStats] = useState({
    totalAssigned: 0,
    totalCompleted: 0,
    inProgress: 0,
    notStarted: 0,
    totalTasks: 0,
    completedTasks: 0,
  })

  // Refs
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // Effect to handle clicks outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Effect to fetch weather data when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(selectedLocation)
    }
  }, [selectedLocation])

  // Effect to initialize with default locations
  useEffect(() => {
    // Load weather for default locations
    Promise.all(defaultLocations.slice(0, 3).map((location) => fetchLocationWeather(location)))

    // Fetch weather for the selected location
    fetchWeatherData(selectedLocation)

    // Try to get user's current location, but handle errors gracefully
    try {
      if (navigator.geolocation) {
        // Set a timeout to handle slow geolocation responses
        const timeoutId = setTimeout(() => {
          console.log("Geolocation request timed out, using default location")
          // Continue with default location
        }, 3000)

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId)
            const userLocation: WeatherLocation = {
              id: "current",
              name: "Current Location",
              country: "",
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }
            fetchLocationWeather(userLocation).then((location) => {
              if (location) {
                setSelectedLocation(location)
                setHomeLocation(location)
              }
            })
          },
          (error) => {
            clearTimeout(timeoutId)
            console.log("Geolocation error (expected in some environments):", error.message)
            // Just continue with default location, no need to show an error
          },
          { timeout: 5000, enableHighAccuracy: false },
        )
      }
    } catch (e) {
      console.log("Geolocation API not available:", e)
      // Continue with default location
    }
  }, [])

  // Effect to fetch project stats
  useEffect(() => {
    const fetchProjectStats = async () => {
      try {
        // Set default fallback data first
        const fallbackData = {
          totalProjects: 13,
          activeProjects: 4,
          completedProjects: 3,
          biddingProjects: 3,
          inquiryProjects: 3,
        }

        // Default objective stats
        const fallbackObjectiveStats = {
          totalAssigned: 15,
          totalCompleted: 8,
          inProgress: 4,
          notStarted: 3,
          totalTasks: 50,
          completedTasks: 35,
        }

        // In preview mode or if there's an error, use fallback data
        if (window.location.hostname.includes("vercel.app") || process.env.NODE_ENV === "development") {
          console.log("Using fallback project data in preview environment")
          setProjectStats(fallbackData)
          setObjectiveStats(fallbackObjectiveStats)
          return
        }

        // Only try to fetch real data if not in preview
        try {
          // Fetch all projects
          const allProjects = await projectsService.getAll()

          // Count projects by stage
          const activeCount = allProjects.filter((p) => p.stage === "active").length
          const completedCount = allProjects.filter((p) => p.stage === "completed").length
          const biddingCount = allProjects.filter((p) => p.stage === "bidding").length
          const inquiryCount = allProjects.filter((p) => p.stage === "inquiry").length

          setProjectStats({
            totalProjects: allProjects.length,
            activeProjects: activeCount,
            completedProjects: completedCount,
            biddingProjects: biddingCount,
            inquiryProjects: inquiryCount,
          })

          // Calculate objective stats from projects
          let totalTasks = 0
          let completedTasks = 0
          let inProgressCount = 0
          let notStartedCount = 0
          let objectivesCompletedCount = 0

          // Count objectives by status
          allProjects.forEach((project) => {
            if (project.objectives) {
              project.objectives.forEach((objective) => {
                totalTasks += objective.totalTasks || 0
                completedTasks += objective.completedTasks || 0

                if (objective.status === "completed") {
                  objectivesCompletedCount++
                } else if (objective.status === "in-progress") {
                  inProgressCount++
                } else if (objective.status === "not-started") {
                  notStartedCount++
                }
              })
            }
          })

          setObjectiveStats({
            totalAssigned: objectivesCompletedCount + inProgressCount + notStartedCount,
            totalCompleted: objectivesCompletedCount,
            inProgress: inProgressCount,
            notStarted: notStartedCount,
            totalTasks: totalTasks || 50, // Fallback if no tasks found
            completedTasks: completedTasks || 35, // Fallback if no completed tasks found
          })
        } catch (error) {
          console.warn("Could not fetch project data, using fallback data", error)
          setProjectStats(fallbackData)
          setObjectiveStats(fallbackObjectiveStats)
        }
      } catch (error) {
        console.error("Error in project stats handling:", error)
        // Ultimate fallback
        setProjectStats({
          totalProjects: 13,
          activeProjects: 4,
          completedProjects: 3,
          biddingProjects: 3,
          inquiryProjects: 3,
        })
        setObjectiveStats({
          totalAssigned: 15,
          totalCompleted: 8,
          inProgress: 4,
          notStarted: 3,
          totalTasks: 50,
          completedTasks: 35,
        })
      }
    }

    fetchProjectStats()
  }, [])

  // Function to search for locations
  const searchLocations = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    try {
      // Clear any existing timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }

      // Set a new timeout to avoid too many API calls
      searchTimeout.current = setTimeout(async () => {
        if (useMockData) {
          // Simulate search with mock data
          const filteredLocations = defaultLocations.filter(
            (location) =>
              location.name.toLowerCase().includes(query.toLowerCase()) ||
              location.country.toLowerCase().includes(query.toLowerCase()),
          )

          // Add some random cities for more comprehensive results
          const randomCities = [
            {
              id: `search-1-${Date.now()}`,
              name: `${query.charAt(0).toUpperCase() + query.slice(1)} City`,
              country: "US",
              lat: 35 + Math.random() * 10,
              lon: -100 + Math.random() * 20,
            },
            {
              id: `search-2-${Date.now()}`,
              name: `${query.charAt(0).toUpperCase() + query.slice(1)}ville`,
              country: "CA",
              lat: 45 + Math.random() * 10,
              lon: -90 + Math.random() * 20,
            },
            {
              id: `search-3-${Date.now()}`,
              name: `${query.charAt(0).toUpperCase() + query.slice(1)}burg`,
              country: "DE",
              lat: 50 + Math.random() * 5,
              lon: 10 + Math.random() * 10,
            },
          ]

          setSearchResults([...filteredLocations, ...randomCities])
          setIsSearching(false)
        } else {
          // Real API call (would work if API key was valid)
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=YOUR_API_KEY`,
          )

          if (!response.ok) {
            throw new Error("Failed to fetch locations")
          }

          const data = await response.json()

          // Format the results
          const locations: WeatherLocation[] = data.map((item: any) => ({
            id: `${item.lat}-${item.lon}`,
            name: item.name,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
          }))

          setSearchResults(locations)
        }
      }, 500)
    } catch (error) {
      console.error("Error searching locations:", error)
      // Fallback to mock search
      const filteredLocations = defaultLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.country.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filteredLocations)
    } finally {
      setIsSearching(false)
    }
  }

  // Function to fetch weather for a location (just the basic info)
  const fetchLocationWeather = async (location: WeatherLocation): Promise<WeatherLocation | null> => {
    try {
      if (useMockData) {
        // Use mock data
        const locationId = location.id.split("-")[0] // Get the first part of the ID
        const mockData = mockWeatherData[locationId as keyof typeof mockWeatherData]

        // If we have predefined mock data for this location, use it
        if (mockData) {
          const updatedLocation: WeatherLocation = {
            ...location,
            temp: mockData.temperature,
            condition: mockData.condition,
            icon: mockData.icon,
          }
          return updatedLocation
        } else {
          // Generate random mock data for this location
          const generatedData = generateMockWeatherData(location)
          const updatedLocation: WeatherLocation = {
            ...location,
            temp: generatedData.temperature,
            condition: generatedData.condition,
            icon: generatedData.icon,
          }
          return updatedLocation
        }
      } else {
        // Real API call (would work if API key was valid)
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=YOUR_API_KEY`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await response.json()

        // Update the location with weather data
        const updatedLocation: WeatherLocation = {
          ...location,
          temp: `${Math.round(data.main.temp)}°F`,
          condition: data.weather[0].main,
          icon: weatherIconMap[data.weather[0].icon] || Cloud,
        }

        return updatedLocation
      }
    } catch (error) {
      console.error("Error fetching location weather:", error)

      // Fallback to mock data
      const locationId = location.id.split("-")[0]
      const mockData = mockWeatherData[locationId as keyof typeof mockWeatherData]

      if (mockData) {
        return {
          ...location,
          temp: mockData.temperature,
          condition: mockData.condition,
          icon: mockData.icon,
        }
      } else {
        // Generate random mock data
        const generatedData = generateMockWeatherData(location)
        return {
          ...location,
          temp: generatedData.temperature,
          condition: generatedData.condition,
          icon: generatedData.icon,
        }
      }
    }
  }

  // Function to fetch detailed weather data for the selected location
  const fetchWeatherData = async (location: WeatherLocation) => {
    setIsLoadingWeather(true)
    setWeatherError(null)

    try {
      if (useMockData) {
        // Use mock data
        const locationId = location.id.split("-")[0] // Get the first part of the ID
        const mockData = mockWeatherData[locationId as keyof typeof mockWeatherData]

        // If we have predefined mock data for this location, use it
        if (mockData) {
          // Add a small delay to simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))
          setWeatherData(mockData)
        } else {
          // Generate random mock data for this location
          await new Promise((resolve) => setTimeout(resolve, 500))
          const generatedData = generateMockWeatherData(location)
          setWeatherData(generatedData)
        }
      } else {
        // Real API call (would work if API key was valid)
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&units=imperial&exclude=minutely&appid=YOUR_API_KEY`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await response.json()

        // Format the weather data
        const formattedData: WeatherData = {
          location: location.name,
          condition: data.current.weather[0].main,
          temperature: `${Math.round(data.current.temp)}°F`,
          feelsLike: `${Math.round(data.current.feels_like)}°F`,
          humidity: `${data.current.humidity}%`,
          wind: `${Math.round(data.current.wind_speed)} mph`,
          precipitation: data.daily[0].pop ? `${Math.round(data.daily[0].pop * 100)}%` : "0%",
          icon: weatherIconMap[data.current.weather[0].icon] || Cloud,
          hourlyForecast: data.hourly.slice(0, 12).map((hour: any, index: number) => ({
            time: index === 0 ? "Now" : format(new Date(hour.dt * 1000), "ha"),
            temp: `${Math.round(hour.temp)}°F`,
            condition: hour.weather[0].main,
            icon: weatherIconMap[hour.weather[0].icon] || Cloud,
            precipitation: hour.pop ? `${Math.round(hour.pop * 100)}%` : "0%",
          })),
          dailyForecast: data.daily.slice(0, 3).map((day: any, index: number) => ({
            day: index === 0 ? "Today" : format(new Date(day.dt * 1000), "EEE"),
            high: `${Math.round(day.temp.max)}°F`,
            low: `${Math.round(day.temp.min)}°F`,
            condition: day.weather[0].main,
            icon: weatherIconMap[day.weather[0].icon] || Cloud,
          })),
        }

        setWeatherData(formattedData)
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)

      // Fallback to mock data
      const locationId = location.id.split("-")[0]
      const mockData = mockWeatherData[locationId as keyof typeof mockWeatherData]

      if (mockData) {
        setWeatherData(mockData)
      } else {
        // Generate random mock data
        const generatedData = generateMockWeatherData(location)
        setWeatherData(generatedData)
      }
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchLocations(query)
  }

  // Handle location selection
  const handleSelectLocation = (location: WeatherLocation) => {
    setSelectedLocation(location)
    setSearchQuery("")
    setIsSearchOpen(false)
    setSearchResults([])
  }

  const cycleYear = (direction: "prev" | "next") => {
    if (selectedYear === "overall") {
      setSelectedYear(years[0])
    } else {
      const currentIndex = years.indexOf(selectedYear as number)
      if (direction === "prev") {
        if (currentIndex < years.length - 1) {
          setSelectedYear(years[currentIndex + 1])
        } else {
          setSelectedYear("overall")
        }
      } else {
        if (currentIndex > 0) {
          setSelectedYear(years[currentIndex - 1])
        } else {
          setSelectedYear("overall")
        }
      }
    }
  }

  // Function to get appropriate icon for design milestone
  const getMilestoneIcon = (milestoneName: string) => {
    if (milestoneName.includes("Concept")) return <Pencil className="h-2.5 w-2.5" />
    if (milestoneName.includes("Schematic")) return <Pencil className="h-2.5 w-2.5" />
    if (milestoneName.includes("Development")) return <Compass className="h-2.5 w-2.5" />
    return <Ruler className="h-2.5 w-2.5" />
  }

  // Function to get precipitation color
  const getPrecipitationColor = (precipitation: string) => {
    const value = Number.parseInt(precipitation.replace("%", ""))
    if (value === 0) return "text-gray-400"
    if (value < 20) return "text-blue-300"
    if (value < 40) return "text-blue-400"
    if (value < 60) return "text-blue-500"
    if (value < 80) return "text-blue-600"
    return "text-blue-700"
  }

  // Function to get notification priority color
  const getNotificationPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  // Function to format relative time for notifications
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays}d ago`

    return format(date, "MMM d")
  }

  // Function to navigate to project (would be implemented with router in real app)
  const navigateToProject = (projectId: string) => {
    console.log(`Navigating to project: ${projectId}`)
    // In a real implementation, this would use router.push(`/active-projects/${projectId}`)
    window.location.href = `/active-projects/${projectId}`
  }

  // Function to get urgency class
  const getUrgencyClass = (date: Date) => {
    const now = new Date()
    if (isBefore(date, addHours(now, 24))) {
      return "text-red-600 font-semibold"
    }
    if (isBefore(date, addHours(now, 72))) {
      return "text-amber-600"
    }
    return "text-gray-600"
  }

  // Get current date and time
  const currentDate = format(new Date(), "EEE, MMM d, yyyy")
  const currentTime = format(new Date(), "h:mm a")

  // Render weather content based on loading state
  const renderWeatherContent = () => {
    if (isLoadingWeather) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin mb-2" />
          <p className="text-[10px] text-gray-600">Loading weather data...</p>
        </div>
      )
    }

    if (weatherError) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
          <p className="text-[10px] text-gray-600">{weatherError}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-[10px]"
            onClick={() => fetchWeatherData(selectedLocation)}
          >
            Retry
          </Button>
        </div>
      )
    }

    if (!weatherData) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-[10px] text-gray-600">No weather data available</p>
        </div>
      )
    }

    const WeatherIcon = weatherData.icon

    return (
      <>
        {/* Central weather display - Balance of elements */}
        <div className="flex justify-between items-center mb-1.5">
          {/* Left: Current temperature and condition */}
          <div className="flex items-center">
            <WeatherIcon className="h-6 w-6 text-amber-500 mr-1" />
            <div className="flex flex-col">
              <div className="text-xl font-bold text-gray-800">{weatherData.temperature}</div>
              <div className="text-[11px] text-gray-600">{weatherData.condition}</div>
            </div>
          </div>

          {/* Right: Key metrics in balanced layout */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <Thermometer className="h-2.5 w-2.5 text-red-400 mb-0.5" />
              <span className="text-[11px] font-bold text-gray-800">{weatherData.feelsLike}</span>
              <span className="text-[11px] text-gray-600">Feels Like</span>
            </div>
            <div className="flex flex-col items-center">
              <Wind className="h-2.5 w-2.5 text-blue-400 mb-0.5" />
              <span className="text-[11px] font-bold text-gray-800">{weatherData.wind}</span>
              <span className="text-[11px] text-gray-600">Wind</span>
            </div>
            <div className="flex flex-col items-center">
              <Droplets className="h-2.5 w-2.5 text-blue-500 mb-0.5" />
              <span className="text-[11px] font-bold text-gray-800">{weatherData.humidity}</span>
              <span className="text-[11px] text-gray-600">Humidity</span>
            </div>
          </div>
        </div>

        {/* Flowing timeline - Harmonious progression */}
        <div className="mb-1.5">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-1"></div>
          <div className="flex justify-between">
            {weatherData.hourlyForecast.slice(0, 9).map((hour, index) => {
              const HourIcon = hour.icon
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center ${index === 0 ? "text-indigo-600 font-medium" : ""}`}
                >
                  <div className="text-[11px] text-gray-600">{hour.time}</div>
                  <HourIcon className={`h-2.5 w-2.5 my-0.5 ${index === 0 ? "text-amber-500" : "text-gray-500"}`} />
                  <div className="text-[11px] font-medium">{hour.temp}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3-day forecast - Earth element in balance */}
        <div className="grid grid-cols-3 gap-1.5">
          {weatherData.dailyForecast.map((day, index) => {
            const DayIcon = day.icon
            return (
              <div
                key={index}
                className={`flex items-center justify-between px-1.5 py-1 rounded-md ${
                  index === 0 ? "bg-white shadow-sm" : "bg-transparent"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-gray-700">{day.day}</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[11px] text-red-500">{day.high}</span>
                    <span className="text-[11px] text-blue-500">{day.low}</span>
                  </div>
                </div>
                <DayIcon className={`h-3 w-3 ${index === 0 ? "text-amber-500" : "text-gray-400"}`} />
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // Add this helper function to format time in HH:MM:SS format
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Add this effect to update running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setObjectiveTimers((prevTimers) => {
        const newTimers = { ...prevTimers }
        let updated = false

        Object.keys(newTimers).forEach((id) => {
          if (newTimers[id].isRunning) {
            newTimers[id].elapsedTime =
              Date.now() - (newTimers[id].startTime || Date.now()) + (newTimers[id].elapsedTime || 0)
            updated = true
          }
        })

        return updated ? newTimers : prevTimers
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Add these functions to handle timer actions
  const startTimer = (objectiveId: string) => {
    setObjectiveTimers((prev) => {
      const existing = prev[objectiveId] || { isRunning: false, startTime: null, elapsedTime: 0 }
      return {
        ...prev,
        [objectiveId]: {
          ...existing,
          isRunning: true,
          startTime: Date.now(),
        },
      }
    })
  }

  const stopTimer = (objectiveId: string) => {
    setObjectiveTimers((prev) => {
      const existing = prev[objectiveId]
      if (!existing || !existing.isRunning) return prev

      const elapsedTime = existing.startTime
        ? Date.now() - existing.startTime + existing.elapsedTime
        : existing.elapsedTime

      return {
        ...prev,
        [objectiveId]: {
          isRunning: false,
          startTime: null,
          elapsedTime,
        },
      }
    })
  }

  const resetTimer = (objectiveId: string) => {
    setObjectiveTimers((prev) => ({
      ...prev,
      [objectiveId]: {
        isRunning: false,
        startTime: null,
        elapsedTime: 0,
      },
    }))
  }

  // Sort objectives by due date (soonest first)
  const sortedObjectives = [...userObjectives].sort((a, b) => {
    return a.dueDate.getTime() - b.dueDate.getTime()
  })

  // State for managing the "Add Task" dialog
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null)
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskHours, setNewTaskHours] = useState(0)

  // Function to open the "Add Task" dialog
  const openAddTaskDialog = (objectiveId: string) => {
    setSelectedObjectiveId(objectiveId)
    setShowAddTaskDialog(true)
  }

  // Function to close the "Add Task" dialog
  const closeAddTaskDialog = () => {
    setShowAddTaskDialog(false)
    setSelectedObjectiveId(null)
    setNewTaskName("")
    setNewTaskHours(0)
  }

  // Function to handle adding a new task to an objective
  const handleAddTask = () => {
    if (!selectedObjectiveId || !newTaskName || newTaskHours <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      })
      return
    }

    // Find the selected objective
    const selectedObjective = userObjectives.find((obj) => obj.id === selectedObjectiveId)

    if (!selectedObjective) {
      toast({
        title: "Error",
        description: "Objective not found.",
        variant: "destructive",
      })
      return
    }

    // Check if there are enough hours available
    if (newTaskHours > selectedObjective.totalHours) {
      toast({
        title: "Error",
        description: "Not enough hours available in this objective.",
        variant: "destructive",
      })
      return
    }

    // Create a new task
    const newTask = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      hours: newTaskHours,
    }

    // Update the objective with the new task
    const updatedObjectives = userObjectives.map((obj) => {
      if (obj.id === selectedObjectiveId) {
        return {
          ...obj,
          tasks: [...(obj.tasks || []), newTask],
          totalHours: obj.totalHours - newTaskHours,
        }
      }
      return obj
    })

    // Update the state with the updated objectives
    //setUserObjectives(updatedObjectives);

    // Close the dialog
    closeAddTaskDialog()

    toast({
      title: "Success",
      description: `Task "${newTaskName}" added to objective "${selectedObjective.name}"`,
    })
  }

  // Calculate billable hours (replace with actual logic)
  const billableHours = 25 // Replace with actual billable hours
  const totalHoursPerWeek = 40 // Standard 40-hour work week

  // Calculate utilization rate
  const utilizationRate = (billableHours / totalHoursPerWeek) * 100

  const { toast } = useToast()

  return (
    <>
      <style jsx global>
        {scrollbarStyles}
      </style>
      <Card className="bg-white shadow-sm rounded-lg overflow-hidden w-full">
        <CardHeader className="border-b border-gray-100 py-0.5 px-2">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="flex items-center justify-center flex-1">
              <Clock className="h-3 w-3 text-indigo-500 mr-1.5" />
              <div className="text-sm font-medium text-gray-700 tracking-wide">
                {currentDate} | {currentTime}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-1 justify-end">
              <Button variant="ghost" size="sm" className="h-5 w-4 p-0" onClick={() => cycleYear("prev")}>
                <ChevronLeft className="h-2.5 w-2.5" />
              </Button>
              <span className="text-[10px] font-medium text-gray-600">
                {selectedYear === "overall" ? "Overall" : selectedYear}
              </span>
              <Button variant="ghost" size="sm" className="h-5 w-4 p-0" onClick={() => cycleYear("next")}>
                <ChevronRight className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-1 flex flex-col">
          {/* Project Inventory - Moved to be above Project Objectives */}
          <div className="bg-gray-50 rounded-lg p-0.5 mb-0.5">
            <div className="flex items-center">
              <Briefcase className="h-2 w-2 text-amber-600 mr-0.5" />
              <h3 className="text-[11px] font-medium text-gray-700">Project Inventory</h3>
            </div>
            <div className="grid grid-cols-5 gap-0.5 mt-0.5">
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-indigo-800">{projectStats.totalProjects}</div>
                <div className="text-[11px] text-gray-500">Total</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-green-600">{projectStats.activeProjects}</div>
                <div className="text-[11px] text-gray-500">Active</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-purple-600">{projectStats.completedProjects}</div>
                <div className="text-[11px] text-gray-500">Done</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-amber-600">{projectStats.biddingProjects}</div>
                <div className="text-[11px] text-gray-500">Bid</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-sky-600">{projectStats.inquiryProjects}</div>
                <div className="text-[11px] text-gray-500">Inq</div>
              </div>
            </div>
          </div>

          {/* Project Objectives */}
          <div className="bg-gray-50 rounded-lg p-1 flex flex-col">
            <div className="flex justify-between items-center mb-0.5">
              <div className="flex items-center">
                <Compass className="h-2 w-2 text-fuchsia-600 mr-0.5" />
                <h3 className="text-[11px] font-medium text-gray-700">Project Objectives</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 text-[10px] flex items-center gap-0.5 px-1 py-0"
                onClick={onViewAllTasks}
              >
                <Target className="h-2 w-2" />
                <span>View All</span>
              </Button>
            </div>

            {/* Combined Stats and Progress Bar */}
            <div className="bg-white p-0.5 rounded-md mb-0.5 flex flex-col">
              <div className="grid grid-cols-5 gap-0.5">
                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-bold text-indigo-800">{objectiveStats.totalAssigned}</div>
                  <div className="text-[11px] text-gray-500">Assigned</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-bold text-green-600">{objectiveStats.totalCompleted}</div>
                  <div className="text-[11px] text-gray-500">Complete</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-bold text-blue-600">{objectiveStats.inProgress}</div>
                  <div className="text-[11px] text-gray-500">In Progress</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-bold text-amber-600">{objectiveStats.notStarted}</div>
                  <div className="text-[11px] text-gray-500">Not Started</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-bold text-amber-600">
                    {objectiveStats.completedTasks}/{objectiveStats.totalTasks}
                  </div>
                  <div className="text-[11px] text-gray-500">Tasks</div>
                </div>
              </div>

              {/* Task Completion Progress */}
              <div className="mt-0.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-blue-600 font-medium">Overall Task Completion</span>
                  <span className="font-medium text-blue-600">
                    {Math.round((objectiveStats.completedTasks / objectiveStats.totalTasks) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(objectiveStats.completedTasks / objectiveStats.totalTasks) * 100}
                  className="h-1 bg-amber-100"
                  indicatorClassName="bg-gradient-to-r from-orange-400 to-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Utilization Rate */}
          <div className="bg-gray-50 rounded-lg p-0.5">
            <div className="flex items-center">
              <Target className="h-2 w-2 text-blue-600 mr-0.5" />
              <h3 className="text-[11px] font-medium text-gray-700">Utilization Rate</h3>
            </div>
            <div className="flex flex-row justify-between items-center mt-0.5">
              {/* Current Utilization */}
              <div className="w-[48%]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-blue-600 font-medium">Current Utilization</span>
                  <span className="font-medium text-blue-600">{utilizationRate.toFixed(2)}%</span>
                </div>
                <Progress
                  value={utilizationRate}
                  className="h-1 bg-blue-100"
                  indicatorClassName="bg-gradient-to-r from-violet-500 to-purple-600"
                />
              </div>

              {/* Utilization Goal */}
              <div className="w-[48%]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-blue-600 font-medium">Goal</span>
                  <span className="font-medium text-blue-600">80%</span>
                </div>
                <Progress
                  value={80}
                  className="h-1 bg-green-100"
                  indicatorClassName="bg-gradient-to-r from-emerald-400 to-teal-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
