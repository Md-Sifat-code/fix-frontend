"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Logo from "./Logo"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  unreadMessages: number
}

export function DashboardSidebar({ activeTab, setActiveTab, unreadMessages }: DashboardSidebarProps) {
  return (
    <header className="fixed top-0 left-0 right-0  z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm py-4">
      <div className="px-2 md:px-20 flex justify-between items-center ">
        <nav className="flex space-x-8 ">
          <Button
            variant="link"
            className={cn(
              "p-0 h-auto text-sm font-normal",
              activeTab === "studio"
                ? "text-black after:block after:w-full after:h-0.5 after:bg-black after:mt-0.5"
                : "text-gray-500 hover:text-gray-800",
            )}
            onClick={() => setActiveTab("studio")}
          >
            Studio
          </Button>

          <Button
            variant="link"
            className={cn(
              "p-0 h-auto text-sm font-normal",
              activeTab === "media"
                ? "text-black after:block after:w-full after:h-0.5 after:bg-black after:mt-0.5"
                : "text-gray-500 hover:text-gray-800",
            )}
            onClick={() => setActiveTab("media")}
          >
            Media
          </Button>

          <Button
            variant="link"
            className={cn(
              "p-0 h-auto text-sm font-normal",
              activeTab === "financials"
                ? "text-black after:block after:w-full after:h-0.5 after:bg-black after:mt-0.5"
                : "text-gray-500 hover:text-gray-800",
            )}
            onClick={() => setActiveTab("financials")}
          >
            Financials
          </Button>
        </nav>

        <Logo className="absolute left-1/2 transform -translate-x-1/2" />
      </div>
    </header>
  )
}
