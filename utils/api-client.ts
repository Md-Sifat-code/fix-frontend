// Generic API client for making requests to our API endpoints
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`/api/${endpoint}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "An error occurred")
    }

    const { data } = await response.json()
    return data as T
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "An error occurred")
    }

    const { data } = await response.json()
    return data as T
  },

  async patch<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "An error occurred")
    }

    const { data } = await response.json()
    return data as T
  },

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`/api/${endpoint}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "An error occurred")
    }
  },
}

// Profile-specific API functions
import type { Profile } from "@/services/profiles-service"

export const profilesApi = {
  getAll: () => apiClient.get<Profile[]>("profiles"),
  getById: (id: string) => apiClient.get<Profile>(`profiles/${id}`),
  create: (profile: Omit<Profile, "id">) => apiClient.post<Profile>("profiles", profile),
  update: (id: string, updates: Partial<Profile>) => apiClient.patch<Profile>(`profiles/${id}`, updates),
  delete: (id: string) => apiClient.delete(`profiles/${id}`),
}
