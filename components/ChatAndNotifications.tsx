"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Send,
  Link,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Pin,
  Filter,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  image?: string
}

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  projectId?: string
  type: "task" | "milestone" | "message" | "update"
  priority: "low" | "medium" | "high"
}

interface User {
  id: string
  name: string
  avatar?: string
  status: "active" | "away" | "offline" | "busy"
  lastMessage?: string
  timestamp?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Eric Rivera (You)",
    status: "active",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png",
  },
  {
    id: "2",
    name: "Paige Noga",
    status: "active",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png",
    lastMessage: "Hey Paige, were you able to review...",
    timestamp: "3:40 PM",
  },
  { id: "3", name: "Samira Saleh", status: "away", lastMessage: "Great, thanks", timestamp: "3:40 PM" },
]

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "Paige Noga",
    content:
      "and I will forward you the email. I always email it to myself and then write an official email to the client",
    timestamp: "1/22 8:49 AM",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iCCEAj4C9FFrzmG2621oT9P87WFeuA.png",
  },
  {
    id: "2",
    senderId: "1",
    senderName: "You",
    content: "Okay",
    timestamp: "1/22 8:31 AM",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New task assigned",
    message: "Review architectural plans for Modern Residence project",
    timestamp: "2023-06-15T10:30:00Z",
    read: false,
    projectId: "project1",
    type: "task",
    priority: "high",
  },
  {
    id: "2",
    title: "Project milestone reached",
    message: "Schematic Design phase for Urban Office Complex completed",
    timestamp: "2023-06-14T15:45:00Z",
    read: true,
    type: "milestone",
    priority: "medium",
  },
  {
    id: "3",
    title: "New message from client",
    message: "The client for Sustainable Community Center has sent a new message",
    timestamp: "2023-06-13T09:15:00Z",
    read: false,
    projectId: "project2",
    type: "message",
    priority: "medium",
  },
  {
    id: "4",
    title: "Project update",
    message: "Budget adjustments made for Skyline Tower project",
    timestamp: "2023-06-12T14:20:00Z",
    read: false,
    projectId: "project3",
    type: "update",
    priority: "low",
  },
]

export function ChatAndNotifications() {
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState(mockMessages)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[1])
  const [searchQuery, setSearchQuery] = useState("")
  const [conversationSearch, setConversationSearch] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedUser) {
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: "1",
        senderName: "You",
        content: newMessage,
        timestamp: new Date().toLocaleString(),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const renderNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "milestone":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "update":
        return <RefreshCw className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-[320px] border-r flex flex-col">
        <div className="p-2 border-b">
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search (Ctrl+E)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Input
            placeholder="Search conversations..."
            value={conversationSearch}
            onChange={(e) => setConversationSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">
              Chat
            </TabsTrigger>
            <TabsTrigger value="chatboard" className="flex-1">
              Chat Board
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent ${
                      selectedUser?.id === user.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
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
                        <p className="font-medium truncate">{user.name}</p>
                        {user.timestamp && <span className="text-xs text-muted-foreground">{user.timestamp}</span>}
                      </div>
                      {user.lastMessage && <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="chatboard" className="flex-1 overflow-hidden flex flex-col">
            <div className="p-2 border-b flex justify-between items-center">
              <h3 className="font-semibold">Chat Board</h3>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <ScrollArea className="flex-1">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 border-b ${notification.read ? "opacity-60" : ""}`}>
                  <div className="flex items-start">
                    {renderNotificationIcon(notification.type)}
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            notification.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : notification.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        <div>
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              Mark as read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            Delete
                          </Button>
                          {notification.projectId && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/projects/${notification.projectId}`}>
                                <Link className="h-4 w-4 mr-1" />
                                View Project
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser && (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.senderId === "1" ? "justify-end" : "justify-start"}`}
                >
                  {message.senderId !== "1" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={selectedUser.avatar} alt={message.senderName} />
                      <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] ${message.senderId === "1" ? "items-end" : "items-start"}`}>
                    {message.senderId !== "1" && <div className="text-sm font-medium mb-1">{message.senderName}</div>}
                    <div
                      className={`rounded-lg p-3 ${
                        message.senderId === "1" ? "bg-primary text-primary-foreground" : "bg-accent"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.image && (
                        <div className="mt-2">
                          <Image
                            src={"https://picsum.photos/1280/720"}
                            alt="Shared screenshot"
                            width={400}
                            height={300}
                            className="rounded-md"
                          />
                          <div className="mt-1 text-xs opacity-70">Screenshot.png</div>
                        </div>
                      )}
                      <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
