"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Send,
  Phone,
  Video,
  Smile,
  MoreVertical,
  Search,
  Calendar,
  PhoneCall,
  Users,
  FileText,
  Bell,
  Cloud,
  Plus,
  Pin,
  ImageIcon,
  Bold,
  Italic,
  List,
  Link,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Pusher from "pusher-js"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  avatar?: string
  isCurrentUser?: boolean
  sharedContent?: {
    type: "image" | "file"
    url: string
    title: string
  }
}

interface ChatUser {
  id: number
  name: string
  status: "active" | "away" | "offline" | "busy"
  avatar?: string
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
  isPinned?: boolean
}

const NavigationItem = ({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: any
  label: string
  active?: boolean
  badge?: number
}) => (
  <div className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent ${active ? "bg-accent" : ""}`}>
    <div className="relative">
      <Icon className="h-5 w-5" />
      {badge && (
        <span className="absolute top-0 left-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
          {badge}
        </span>
      )}
    </div>
    <span className="text-sm">{label}</span>
  </div>
)

export function ChatBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [globalSearchQuery, setGlobalSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [activeSection, setActiveSection] = useState<
    "chat" | "calls" | "teams" | "calendar" | "files" | "activity" | "onedrive"
  >("chat")

  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe("chat")

    // Listen for new messages
    channel.bind("new-message", (data) => {
      // Only increment counter if message is from someone else
      if (data.senderId !== user.id) {
        setUnreadMessages((prev) => prev + 1)

        // Show a toast notification
        toast({
          title: `New message from ${data.senderName}`,
          description: data.content.length > 30 ? `${data.content.substring(0, 30)}...` : data.content,
        })
      }
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("chat")
    }
  }, [user, toast])

  const handleChatClick = () => {
    setUnreadMessages(0)
    router.push("/chat")
  }

  const handleNotificationsClick = () => {
    setUnreadNotifications(0)
    // Open notifications panel or navigate to notifications page
  }

  // Mock chat users data with pinned conversations
  const chatUsers: ChatUser[] = [
    {
      id: 1,
      name: "Eric Rivera (You)",
      status: "active",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png",
      isPinned: true,
    },
    {
      id: 2,
      name: "Paige Noga",
      status: "active",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png",
      lastMessage: "Hey Paige, were you able to review...",
      timestamp: "3:40 PM",
      isPinned: false,
    },
    {
      id: 3,
      name: "Samira Saleh",
      status: "active",
      lastMessage: "Great, thanks",
      timestamp: "3:40 PM",
      isPinned: false,
    },
    // Add more users as needed
  ]

  // Mock messages data with shared content
  const messages: Message[] = [
    {
      id: 1,
      sender: "Paige Noga",
      content:
        "and I will forward you the email. I always email it to myself and then write an official email to the client",
      timestamp: "1/22 8:49 AM",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png",
      sharedContent: {
        type: "image",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WoqtWjglue7RflXtZ9I2LIrJkHpJx8.png",
        title: "Screenshot.png",
      },
    },
    {
      id: 2,
      sender: "You",
      content: "Okay",
      timestamp: "1/22 8:31 AM",
      isCurrentUser: true,
    },
    // Add more messages as needed
  ]

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, scrollToBottom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput)
      setMessageInput("")
      scrollToBottom()
    }
  }

  const navigationItems = [
    { id: "chat", icon: MessageSquare, badge: 1 },
    { id: "calls", icon: PhoneCall },
    { id: "teams", icon: Users },
    { id: "calendar", icon: Calendar },
    { id: "files", icon: FileText },
    { id: "activity", icon: Bell, badge: 3 },
    { id: "onedrive", icon: Cloud },
  ] as const

  const renderContent = () => {
    switch (activeSection) {
      case "chat":
        return (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="recent" className="flex-1">
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="contacts" className="flex-1">
                    Contacts
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="flex-1">
              {/* Pinned conversations */}
              <div className="p-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
                {chatUsers
                  .filter((user) => user.isPinned)
                  .map((user) => (
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
                        {user.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                        )}
                      </div>
                      {user.unreadCount && (
                        <span className="ml-auto mr-2 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
                <Separator className="my-2" />
              </div>

              {/* Recent conversations */}
              <div className="p-2">
                {chatUsers
                  .filter((user) => !user.isPinned)
                  .map((user) => (
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
                        {user.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                        )}
                      </div>
                      {user.unreadCount && (
                        <span className="ml-auto mr-2 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )
      case "calls":
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Calls section coming soon</p>
          </div>
        )
      // Add other sections as needed
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">{activeSection} section coming soon</p>
          </div>
        )
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)} size="icon" className="h-12 w-12 rounded-full shadow-lg relative">
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
            2
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex ${isExpanded ? "w-[1200px]" : "w-[320px]"} h-[600px] rounded-lg shadow-xl bg-background border overflow-hidden`}
    >
      {isExpanded && (
        <div className="flex">
          {/* Navigation Rail */}
          <div className="w-[72px] border-r flex flex-col items-center py-4 space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full relative flex items-center justify-center h-12 rounded-none"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                {item.badge && (
                  <span className="absolute top-0 left-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            ))}
            <Separator className="my-2" />
            <Button variant="ghost" className="w-full flex items-center justify-center h-12 rounded-none mt-auto">
              <Plus className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          {/* Section Content */}
          <div className="w-[320px] flex flex-col border-r">
            {/* Global Search */}
            <div className="flex items-center gap-2 p-2 border-b">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search (Ctrl+E)"
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Active Section Content */}
            {renderContent()}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  selectedUser?.avatar ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hBNfGaChxuMgfcXcU0LUZW6SRYlg3G.png"
                }
                alt={selectedUser?.name || "John Doe"}
              />
              <AvatarFallback>{(selectedUser?.name || "John Doe")[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedUser?.name || "John Doe"}</h3>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View profile</DropdownMenuItem>
                <DropdownMenuItem>Add to contacts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuItem>Pin conversation</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Block user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} items-start gap-2`}
              >
                {!message.isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-1">
                  {!message.isCurrentUser && <span className="text-xs text-muted-foreground">{message.sender}</span>}
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.sharedContent && (
                      <div className="mt-2 border rounded-md overflow-hidden">
                        {message.sharedContent.type === "image" && (
                          <img
                            src={message.sharedContent.url || "/placeholder.svg"}
                            alt={message.sharedContent.title}
                            className="w-full h-auto max-h-[200px] object-cover"
                          />
                        )}
                        <div className="p-2 bg-background flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{message.sharedContent.title}</span>
                        </div>
                      </div>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
