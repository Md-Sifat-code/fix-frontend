"use client"

import type React from "react"

import { useAuthContext } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return <>{children}</>
}
