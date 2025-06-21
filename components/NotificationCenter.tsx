"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, CheckCircle2, AlertCircle, MessageSquare, RefreshCw, DollarSign } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  securityLevel?: "standard" | "admin" | "owner" // Add security level field
  type?: "task" | "milestone" | "message" | "update" | "payroll" // Add payroll type
  priority?: "low" | "medium" | "high"
  projectId?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New task assigned",
    message: "You have been assigned a new task: Review architectural plans for Modern Residence project",
    timestamp: "2023-06-15T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    title: "Project milestone reached",
    message: "Congratulations! The Schematic Design phase for Urban Office Complex has been completed.",
    timestamp: "2023-06-14T15:45:00Z",
    read: true,
  },
  {
    id: "3",
    title: "Client meeting scheduled",
    message: "A client meeting for the Sustainable Community Center project has been scheduled for next week.",
    timestamp: "2023-06-13T09:15:00Z",
    read: false,
  },
  {
    id: "5",
    title: "Missed Pay Period Alert",
    message: "The pay period ending on April 30th was not processed. Immediate attention required.",
    timestamp: "2023-05-02T08:00:00Z",
    read: false,
    securityLevel: "owner",
    type: "payroll",
    priority: "high",
  },
  {
    id: "6",
    title: "Payroll Processing Reminder",
    message: "Upcoming pay period closes in 2 days. Please ensure all timecards are approved.",
    timestamp: "2023-05-10T09:30:00Z",
    read: false,
    securityLevel: "admin",
    type: "payroll",
    priority: "medium",
  },
]

interface NotificationCenterProps {
  expanded?: boolean
  user?: {
    role?: string
    securityClearance?: "standard" | "admin" | "owner"
  }
}

export function NotificationCenter({
  expanded = false,
  user = { securityClearance: "standard" },
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const filterNotificationsBySecurityLevel = (notifications: Notification[]) => {
    return notifications.filter((notification) => {
      // If no security level is specified, show to everyone
      if (!notification.securityLevel) return true

      // If user has owner clearance, show all notifications
      if (user?.securityClearance === "owner") return true

      // If user has admin clearance, show admin and standard notifications
      if (user?.securityClearance === "admin") {
        return notification.securityLevel !== "owner"
      }

      // Standard users only see standard notifications
      return notification.securityLevel === "standard"
    })
  }

  useEffect(() => {
    setFilteredNotifications(filterNotificationsBySecurityLevel(notifications))
  }, [notifications, user?.securityClearance])

  const renderNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "milestone":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "update":
        return <RefreshCw className="h-4 w-4 text-purple-500" />
      case "payroll":
        return <DollarSign className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const unreadNotificationsCount = filteredNotifications.filter((n) => !n.read).length

  return (
    <ScrollArea className={expanded ? "h-[calc(100vh-200px)]" : "h-[300px]"}>
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                {renderNotificationIcon(notification.type)}
                <h3 className="font-semibold">{notification.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleString()}</span>
                <div>
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      Mark as read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
