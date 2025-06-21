"use client"

import { useEffect, useState } from "react"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  const { user, signIn } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate auth check completion
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Project Communications</h1>

      {user ? (
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">Team Chat</TabsTrigger>
            <TabsTrigger value="client">Client Communications</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="client" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Communications</CardTitle>
                <CardDescription>Manage all your client communications in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Client communication functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with project notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notification center coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access the chat functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => signIn()}>Sign In</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
