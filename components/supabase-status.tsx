"use client"

import { useSupabaseStatus } from "@/hooks/use-supabase-status"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function SupabaseStatus() {
  const { status, error, isChecking, checkConnection } = useSupabaseStatus()

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="font-medium">Supabase Connection:</span>
        {status === "connected" && (
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" /> Connected
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" /> Error
          </span>
        )}
        {status === "checking" && (
          <span className="flex items-center text-blue-600">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Checking...
          </span>
        )}
        {status === "idle" && <span className="text-gray-500">Not checked</span>}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <Button onClick={checkConnection} disabled={isChecking} size="sm">
        {isChecking ? "Checking..." : "Check Connection"}
      </Button>
    </div>
  )
}
