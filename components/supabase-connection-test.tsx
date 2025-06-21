"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [tables, setTables] = useState<string[]>([])

  const testConnection = async () => {
    try {
      setStatus("loading")
      setMessage("Testing connection to Supabase...")

      // Simple query to test the connection
      const { data, error } = await supabase.from("Projects").select("id").limit(1)

      if (error) throw error

      setStatus("success")
      setMessage("Connection successful! Found Projects table.")

      // Get list of tables
      const { data: tablesData, error: tablesError } = await supabase
        .from("pg_tables")
        .select("tablename")
        .eq("schemaname", "public")

      if (tablesError) {
        console.error("Error fetching tables:", tablesError)
      } else {
        setTables(tablesData.map((t) => t.tablename).sort())
      }
    } catch (err: any) {
      console.error("Connection test error:", err)
      setStatus("error")
      setMessage(`Connection failed: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Testing..." : "Test Connection"}
        </Button>

        {message && (
          <div
            className={`p-4 rounded-md ${
              status === "success"
                ? "bg-green-100 text-green-800"
                : status === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {message}
          </div>
        )}

        {tables.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Available Tables:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {tables.map((table) => (
                <li key={table} className="text-sm">
                  {table}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
