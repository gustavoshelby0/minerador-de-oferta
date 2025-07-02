"use client"

import { useState } from "react"
import { FacebookAdsMinerDashboard } from "@/components/facebook-ads-miner-dashboard"
import { Indique } from "@/components/indique"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <FacebookAdsMinerDashboard />
      case "indique":
        return <Indique />
      default:
        return <FacebookAdsMinerDashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: "4rem" }}>
        <Header />
        <main className="p-4 md:p-6">
          <div className="container mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
