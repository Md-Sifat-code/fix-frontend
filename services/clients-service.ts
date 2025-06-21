import { supabase, type Database } from "@/lib/supabase-client"

export type Client = Database["public"]["Tables"]["Clients"]["Row"]
export type NewClient = Database["public"]["Tables"]["Clients"]["Insert"]
export type UpdateClient = Database["public"]["Tables"]["Clients"]["Update"]

export const clientsService = {
  async getAll() {
    const { data, error } = await supabase.from("Clients").select("*").order("name")

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase.from("Clients").select("*, Projects(*)").eq("id", id).single()

    if (error) throw error
    return data
  },

  async create(client: NewClient) {
    const { data, error } = await supabase.from("Clients").insert(client).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: UpdateClient) {
    const { data, error } = await supabase.from("Clients").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("Clients").delete().eq("id", id)

    if (error) throw error
    return true
  },
}
