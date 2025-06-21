import { supabase } from "@/lib/supabaseClient"

export type Profile = {
  id: string
  name: string
  // Add other profile properties based on your schema
  created_at?: string
  updated_at?: string
  // Add any other fields that exist in your profiles table
}

export const profilesService = {
  async getAll() {
    const { data, error } = await supabase.from("profiles").select("*")

    if (error) throw error
    return data as Profile[]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) throw error
    return data as Profile
  },

  async create(profile: Omit<Profile, "id">) {
    const { data, error } = await supabase.from("profiles").insert(profile).select().single()

    if (error) throw error
    return data as Profile
  },

  async update(id: string, updates: Partial<Omit<Profile, "id">>) {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Profile
  },

  async delete(id: string) {
    const { error } = await supabase.from("profiles").delete().eq("id", id)

    if (error) throw error
    return true
  },
}
