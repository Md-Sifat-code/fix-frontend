"use client"

import { useState, useEffect } from "react"
import { checkSupabaseConnection } from "@/lib/supabaseClient"

export function useSupabaseStatus() {
  const [status, setStatus] = useState<"idle" | "checking" | "connected" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    try {
      setStatus("checking")
      setError(null)

      const result = await checkSupabaseConnection()

      if (result.success) {
        setStatus("connected")
      } else {
        setStatus("error")
        setError(result.error || "Unknown error")
      }
    } catch (err: any) {
      setStatus("error")
      setError(err.message || "Unexpected error")
    }
  }

  useEffect(() => {
    // Automatically check connection on mount
    checkConnection()
  }, [])

  return {
    status,
    error,
    isConnected: status === "connected",
    isChecking: status === "checking",
    hasError: status === "error",
    checkConnection,
  }
}
