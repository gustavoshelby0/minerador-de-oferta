"use client"

import { List, Heart, Gift, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isApiConfigured: boolean
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: List, label: "Dashboard" },
    { id: "meta-library", icon: Heart, label: "Meta Library" },
    { id: "indique", icon: Gift, label: "Indique" },
  ]

  return (
    <div className="transition-all duration-300 fixed z-50 h-screen w-16 bg-[#181818] border-r border-[#333333]">
      <button
        className="absolute right-0 top-4 transform translate-x-1/2 bg-[#A259FF] text-white rounded-full p-1 shadow-md z-20 glow-primary"
        aria-label="Expandir menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="p-4 border-b border-[#333333]">
        <div className="flex items-center justify-center"></div>
      </div>

      <div className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-center py-3 transition-colors",
                isActive
                  ? "bg-[#2A2A2A] text-[#A259FF] font-medium"
                  : "text-white hover:bg-[#2A2A2A] hover:text-[#A259FF]",
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "animate-chart-grow")} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
