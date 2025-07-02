"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Dashboard } from "./dashboard"
import { AdSearch } from "./ad-search"
import { ScaledAds } from "./scaled-ads"
import { Competitors } from "./competitors"
import { ApiConfig } from "./api-config"

export function AdLibraryMiner() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isApiConfigured, setIsApiConfigured] = useState(false)

  const renderContent = () => {
    if (!isApiConfigured && activeTab !== "config") {
      return <ApiConfig onConfigured={() => setIsApiConfigured(true)} />
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "search":
        return <AdSearch />
      case "scaled":
        return <ScaledAds />
      case "competitors":
        return <Competitors />
      case "config":
        return <ApiConfig onConfigured={() => setIsApiConfigured(true)} />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isApiConfigured={isApiConfigured} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
