import { createClient } from "@supabase/supabase-js"
import { IS_PREVIEW } from "@/lib/environment"

// Create a mock Supabase client for preview mode
const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  }
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create the appropriate client based on environment
let supabase: any

// In preview mode, use a mock client
if (IS_PREVIEW) {
  console.log("Using mock Supabase client in preview mode")
  supabase = createMockClient()
} else {
  // Only create a real client if we have the required environment variables
  try {
    if (supabaseUrl && supabaseAnonKey) {
      supabase = createClient(supabaseUrl, supabaseAnonKey)
    } else {
      console.warn("Supabase environment variables are missing. Using mock client.")
      supabase = createMockClient()
    }
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    supabase = createMockClient()
  }
}

export { supabase }

// Helper function to check if Supabase is configured correctly
export async function checkSupabaseConnection() {
  // In preview mode, always return success
  if (IS_PREVIEW) {
    return { success: true, data: [], preview: true }
  }

  try {
    const { data, error } = await supabase.from("Projects").select("id").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("Unexpected error checking Supabase connection:", err)
    return { success: false, error: err.message }
  }
}
