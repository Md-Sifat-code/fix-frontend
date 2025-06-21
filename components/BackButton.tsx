"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const pathname = usePathname()
  const router = useRouter()

  // Only show back button on project detail pages
  const isProjectPage = pathname?.includes("/projects/") || pathname?.includes("/active-projects/")

  if (!isProjectPage) return null

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>
  )
}
