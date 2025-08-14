"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { profilesApi } from "@/utils/api-client"
import type { Profile } from "@/services/profiles-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Plus, Save, X } from "lucide-react"

export default function ProfileManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: "",
  })
  const [isCreating, setIsCreating] = useState(false)

  // Load profiles
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true)
        // const data = await profilesApi.getAll()
        // setProfiles(data)
        const data = await profilesApi.getAll()
setProfiles(Array.isArray(data) ? data : [])
        console.log(data);
      } catch (err: any) {
        console.error("Error loading profiles:", err)
        setError(err.message || "Failed to load profiles")
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
  }, [])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Create a new profile
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newProfile = await profilesApi.create(formData as Omit<Profile, "id">)
      setProfiles((prev) => [...prev, newProfile])
      setFormData({ name: "" })
      setIsCreating(false)
    } catch (err: any) {
      console.error("Error creating profile:", err)
      setError(err.message || "Failed to create profile")
    }
  }

  // Start editing a profile
  const handleEdit = (profile: Profile) => {
    setEditingId(profile.id)
    setFormData({
      name: profile.name,
      // Add other fields as needed
    })
  }

  // Update a profile
  const handleUpdate = async (id: string) => {
    try {
      const updatedProfile = await profilesApi.update(id, formData)
      setProfiles((prev) => prev.map((profile) => (profile.id === id ? updatedProfile : profile)))
      setEditingId(null)
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    }
  }

  // Delete a profile
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return

    try {
      await profilesApi.delete(id)
      setProfiles((prev) => prev.filter((profile) => profile.id !== id))
    } catch (err: any) {
      console.error("Error deleting profile:", err)
      setError(err.message || "Failed to delete profile")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading profiles...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Profiles</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Profile
          </Button>
        )}
      </div>

      {/* Create form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Profile Name"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setFormData({ name: "" })
                  }}
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Profiles list */}
      <div className="space-y-4">
        {profiles.length === 0 ? (
          <p className="text-center p-4">No profiles found.</p>
        ) : (
          profiles.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="p-4">
                {editingId === profile.id ? (
                  <div className="space-y-4">
                    <Input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Profile Name" />
                    <div className="flex space-x-2">
                      <Button onClick={() => handleUpdate(profile.id)}>
                        <Save className="h-4 w-4 mr-2" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{profile.name}</h3>
                      {/* Display other profile info here */}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(profile)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(profile.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
