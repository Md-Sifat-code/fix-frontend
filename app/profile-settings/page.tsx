"use client"

import { useAuth } from "@/lib/auth"
import { ProfileSettings } from "@/components/ProfileSettings"
import { DashboardHeader } from "@/components/DashboardHeader"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function ProfileSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
    // In a real app, you would persist this preference
    document.documentElement.classList.toggle("dark")
  }

  const handleSettingsClick = () => {
    // We're already on the settings page
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen  bg-white dark:bg-black">
      <DashboardHeader
        user={user}
        onSettingsClick={handleSettingsClick}
        onThemeToggle={handleThemeToggle}
        onBackClick={handleBackToDashboard}
      />
      <ProfileSettings />
    </div>
  )
}
