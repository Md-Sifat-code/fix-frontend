import { supabase, type Database } from "@/lib/supabase-client"

export type Utilization = Database["public"]["Tables"]["Utilization"]["Row"]
export type NewUtilization = Database["public"]["Tables"]["Utilization"]["Insert"]
export type UpdateUtilization = Database["public"]["Tables"]["Utilization"]["Update"]

export const utilizationService = {
  async getAll() {
    const { data, error } = await supabase
      .from("Utilization")
      .select("*, user:user_id(email)")
      .order("week_starting", { ascending: false })

    if (error) throw error
    return data
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("Utilization")
      .select("*")
      .eq("user_id", userId)
      .order("week_starting", { ascending: false })

    if (error) throw error
    return data
  },

  async getByWeek(weekStarting: string) {
    const { data, error } = await supabase
      .from("Utilization")
      .select("*, user:user_id(email)")
      .eq("week_starting", weekStarting)

    if (error) throw error
    return data
  },

  async create(utilization: NewUtilization) {
    const { data, error } = await supabase.from("Utilization").insert(utilization).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: UpdateUtilization) {
    const { data, error } = await supabase.from("Utilization").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("Utilization").delete().eq("id", id)

    if (error) throw error
    return true
  },
}
