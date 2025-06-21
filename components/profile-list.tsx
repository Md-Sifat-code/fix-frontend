"use client"

import { useEffect, useState } from "react"
import { profilesService, type Profile } from "@/services/profiles-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileList() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getProfiles = async () => {
      try {
        setLoading(true)
        const data = await profilesService.getAll()
        setProfiles(data)
      } catch (err: any) {
        console.error("Error fetching profiles:", err)
        setError(err.message || "Failed to load profiles")
      } finally {
        setLoading(false)
      }
    }

    getProfiles()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading profiles...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">Error: {error}</div>
  }

  if (profiles.length === 0) {
    return <div className="text-center p-8">No profiles found.</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profiles</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${profile.id}`} alt={profile.name} />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{profile.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {/* Display additional profile information here */}
                {profile.created_at && <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Helper function to get initials from a name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
