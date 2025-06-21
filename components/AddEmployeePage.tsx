"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AddEmployeePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new add-team-member page
    router.push("/add-team-member")
  }, [router])

  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <p>Redirecting to new team member form...</p>
    </div>
  )
}
