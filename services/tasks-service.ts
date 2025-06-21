import { supabase, type Database } from "@/lib/supabase-client"

export type Task = Database["public"]["Tables"]["Tasks"]["Row"]
export type NewTask = Database["public"]["Tables"]["Tasks"]["Insert"]
export type UpdateTask = Database["public"]["Tables"]["Tasks"]["Update"]

export const tasksService = {
  async getAll() {
    const { data, error } = await supabase
      .from("Tasks")
      .select("*, project:project_id(name), assignee:assigned_to(email)")
      .order("due_date", { ascending: true })

    if (error) throw error
    return data
  },

  async getByProject(projectId: string) {
    const { data, error } = await supabase
      .from("Tasks")
      .select("*, assignee:assigned_to(email)")
      .eq("project_id", projectId)
      .order("due_date", { ascending: true })

    if (error) throw error
    return data
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("Tasks")
      .select("*, project:project_id(name)")
      .eq("assigned_to", userId)
      .order("due_date", { ascending: true })

    if (error) throw error
    return data
  },

  async create(task: NewTask) {
    const { data, error } = await supabase.from("Tasks").insert(task).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: UpdateTask) {
    const { data, error } = await supabase.from("Tasks").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from("Tasks").delete().eq("id", id)

    if (error) throw error
    return true
  },
}
