"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Home, Briefcase, Image, MessageSquare, Calendar, DollarSign } from "lucide-react"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  unreadMessages: number
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unreadMessages }) => {
  const tabs = [
    { id: "studio", icon: Home, label: "Studio" },
    { id: "projects", icon: Briefcase, label: "Projects" },
    { id: "media", icon: Image, label: "Media" },
    { id: "chatboard", icon: MessageSquare, label: "Chatboard", badge: unreadMessages },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "financials", icon: DollarSign, label: "Financials" },
  ]

  return (
    <div className="w-64 bg-gray-100 p-4 space-y-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="mr-2 h-4 w-4" />
          {tab.label}
          {tab.badge && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{tab.badge}</span>
          )}
        </Button>
      ))}
    </div>
  )
}
