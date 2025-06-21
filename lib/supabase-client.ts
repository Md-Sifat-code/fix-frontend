import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = supabaseCreateClient(supabaseUrl, supabaseKey)

export { supabase, supabaseUrl, supabaseKey }
export type { Database } from "./database.types"

export const createClient = supabaseCreateClient
