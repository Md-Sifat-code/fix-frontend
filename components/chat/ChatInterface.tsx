"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, UserCircle2, Paperclip, Smile } from "lucide-react"
import Pusher from "pusher-js"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ChatMessage } from "./ChatMessage"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: string
  attachments?: string[]
}

interface OnlineUser {
  id: string
  name: string
  avatar?: string
  lastSeen: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Initialize Pusher
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe("chat")

    // Listen for new messages
    channel.bind("new-message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data])

      // Auto scroll to bottom when new message arrives
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
      }, 100)
    })

    // Listen for user presence
    channel.bind("user-online", (data: OnlineUser) => {
      setOnlineUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.id === data.id)
        if (exists) {
          return prevUsers.map((user) => (user.id === data.id ? { ...user, lastSeen: data.lastSeen } : user))
        } else {
          return [...prevUsers, data]
        }
      })
    })

    channel.bind("user-offline", (data: { id: string }) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.id !== data.id))
    })

    // Fetch initial messages
    fetchMessages()

    // Announce user presence
    if (user) {
      announcePresence(true)
    }

    return () => {
      if (user) {
        announcePresence(false)
      }
      channel.unbind_all()
      pusher.unsubscribe("chat")
    }
  }, [user])

  // Auto scroll on first load
  useEffect(() => {
    if (messages.length > 0 && !isLoading && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [isLoading, messages.length])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chat/messages")
      if (!response.ok) throw new Error("Failed to fetch messages")

      const data = await response.json()
      setMessages(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const announcePresence = async (isOnline: boolean) => {
    try {
      await fetch("/api/chat/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isOnline,
          userId: user?.id,
          userName: user?.name || "Anonymous",
          userAvatar: user?.avatar,
        }),
      })
    } catch (error) {
      console.error("Error announcing presence:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !user) return

    setIsSending(true)

    try {
      const newMessage = {
        content: inputValue,
        senderId: user.id,
        senderName: user.name || "Anonymous",
        senderAvatar: user.avatar,
      }

      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })

      setInputValue("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="flex flex-col h-[600px] shadow-lg">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Project Chat</h2>
          <p className="text-sm text-gray-500">{onlineUsers.length} online</p>
        </div>
        <div className="flex gap-2">
          {onlineUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="relative">
              <Avatar className="h-8 w-8 border-2 border-white">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
            </div>
          ))}
          {onlineUsers.length > 3 && (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
              +{onlineUsers.length - 3}
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <UserCircle2 className="h-16 w-16 mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} isOwnMessage={message.senderId === user?.id} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="pr-10"
              disabled={isSending}
            />
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Smile className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          <Button onClick={sendMessage} disabled={isSending || !inputValue.trim()} className="shrink-0">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
