"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Phone, Video, MoreVertical, Paperclip, Send, Pin, Bell, MessageSquare, Plus } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  avatar?: string
  status: "active" | "away" | "offline" | "busy"
  lastMessage?: string
  timestamp?: string
}

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  image?: string
  read: boolean
}

interface Notification {
  id: string
  title: string
  content: string
  timestamp: string
  read: boolean
  type?: "message" | "project" | "task" | "system"
}

export function ChatBoard() {
  const [newMessage, setNewMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [user, setUser] = useState<User | null>({ id: "current-user", name: "Current User" })
  const [pinnedUsers, setPinnedUsers] = useState<User[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([
    {
      id: "1",
      name: "Eric Rivera",
      status: "active",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png",
      lastMessage: "Hey, how's it going?",
      timestamp: "3:40 PM",
    },
    {
      id: "2",
      name: "Paige Noga",
      status: "away",
      lastMessage: "Can we discuss the project later?",
      timestamp: "2:15 PM",
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "2",
      senderName: "Eric Rivera",
      content: "Hey, did you see the new project brief?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: "2",
      senderId: "3",
      senderName: "Paige Noga",
      content: "Can we schedule a meeting for tomorrow?",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
    },
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New message from John Doe",
      content: "Hey, can we discuss the project timeline?",
      timestamp: new Date().toISOString(),
      read: false,
      type: "message",
    },
    {
      id: "2",
      title: "Project milestone reached",
      content: "Modern House project is now 50% complete",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      type: "project",
    },
    {
      id: "3",
      title: "Task deadline approaching",
      content: "Design review due in 24 hours",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      type: "task",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"messages" | "notifications">("messages")

  const unreadMessagesCount = useMemo(() => {
    return messages.filter((message) => !message.read).length
  }, [messages])

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length
  }, [notifications])

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() && !selectedFile) return
      if (!selectedUser || !user) return

      console.log("Attempting to send message:", newMessage)
      console.log("Selected file:", selectedFile)

      const formData = new FormData()
      formData.append("message", newMessage)
      formData.append("userId", user.id)
      formData.append("channelId", `chat-${selectedUser.id}`)

      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      try {
        console.log("Sending request to /api/chat")
        const response = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        })

        console.log("Received response:", response.status, response.statusText)

        let data
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          data = await response.json()
          console.log("Parsed JSON data:", data)
        } else {
          data = await response.text()
          console.log("Received text data:", data)
          // If the response is not JSON, we'll create an object to use below
          data = { message: data }
        }

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }

        // If we reach here, the request was successful
        const newMessageObj: Message = {
          id: data.id || Date.now().toString(),
          senderId: user.id,
          senderName: user.name,
          content: newMessage,
          timestamp: new Date().toISOString(),
          image: data.image,
          read: false,
        }
        console.log("Adding new message to state:", newMessageObj)
        setMessages((prevMessages) => [...prevMessages, newMessageObj])

        setNewMessage("")
        setSelectedFile(null)
      } catch (error) {
        console.error("Error sending message:", error)
        let errorMessage = "Failed to send message. Please try again."
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`
        }
        alert(errorMessage)
      }
    },
    [newMessage, selectedFile, selectedUser, user],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const togglePin = (user: User) => {
    if (pinnedUsers.find((u) => u.id === user.id)) {
      setPinnedUsers(pinnedUsers.filter((u) => u.id !== user.id))
    } else {
      setPinnedUsers([...pinnedUsers, user])
    }
  }

  const filteredUsers = (users: User[]) => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.lastMessage && user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  const startNewChat = () => {
    console.log("Starting a new chat...")
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "project":
        return <Bell className="h-4 w-4 text-green-500" />
      case "task":
        return <Bell className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <Tabs value={activeTab} onValueChange={(value: "messages" | "notifications") => setActiveTab(value)}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="messages" className="flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {unreadMessagesCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">
                  {unreadMessagesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center justify-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadNotificationsCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Button onClick={startNewChat} variant="outline" className="w-full mb-4">
                  <Plus className="mr-2 h-4 w-4" /> New Message
                </Button>

                {pinnedUsers.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Pin className="h-3 w-3" /> Pinned
                    </div>
                    {filteredUsers(pinnedUsers).map((user) => (
                      <UserListItem
                        key={user.id}
                        user={user}
                        selected={selectedUser?.id === user.id}
                        onSelect={() => setSelectedUser(user)}
                        onPin={() => togglePin(user)}
                        isPinned
                      />
                    ))}
                    <Separator className="my-4" />
                  </>
                )}

                {filteredUsers(recentUsers).map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    selected={selectedUser?.id === user.id}
                    onSelect={() => setSelectedUser(user)}
                    onPin={() => togglePin(user)}
                    isPinned={false}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notifications" className="flex-1">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read ? "bg-background" : "bg-accent"
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      {selectedUser && activeTab === "messages" ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">{selectedUser.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedUser.status === "active" ? "Active now" : selectedUser.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                {message.senderId !== user?.id && (
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={selectedUser.avatar} alt={message.senderName} />
                    <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-accent"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.image && (
                    <div className="mt-2">
                      <Image
                        src={message.image || "/placeholder.svg"}
                        alt="Shared image"
                        width={300}
                        height={200}
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Message Input */}
          <div className="px-6 py-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input type="file" id="file-input" className="hidden" onChange={handleFileSelect} accept="image/*" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" className="h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {selectedFile && (
              <div className="mt-2 p-2 bg-muted rounded-md flex items-center justify-between">
                <span className="text-sm truncate">{selectedFile.name}</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {activeTab === "messages" ? (
            <p>Select a conversation to start messaging</p>
          ) : (
            <p>Your notifications will appear here</p>
          )}
        </div>
      )}
    </div>
  )
}

interface UserListItemProps {
  user: User
  selected: boolean
  onSelect: () => void
  onPin: () => void
  isPinned: boolean
}

function UserListItem({ user, selected, onSelect, onPin, isPinned }: UserListItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent ${selected ? "bg-accent" : ""}`}
      onClick={onSelect}
    >
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div
          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-background ${
            user.status === "active"
              ? "bg-green-500"
              : user.status === "away"
                ? "bg-yellow-500"
                : user.status === "busy"
                  ? "bg-red-500"
                  : "bg-gray-500"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="font-medium text-sm truncate">{user.name}</p>
          {user.timestamp && <span className="text-xs text-muted-foreground">{user.timestamp}</span>}
        </div>
        {user.lastMessage && <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>}
      </div>
      {isPinned && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onPin()
          }}
        >
          <Pin className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

export default ChatBoard
