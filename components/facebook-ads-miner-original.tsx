"use client"

import { useState, useEffect } from "react"

export function FacebookAdsMinerOriginal() {
  const [currentTab, setCurrentTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")
  const [ticketFilter, setTicketFilter] = useState("all")
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAds() {
      try {
        const response = await fetch("/api/anuncios") // Altere para sua API real
        const data = await response.json()
        setAds(data)
        setLoading(false)
      } catch (err) {
        console.error("Erro ao buscar anúncios:", err)
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  const filteredAds = ads.filter((ad) => {
    if (!ad.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (statusFilter !== "all" && ad.status !== statusFilter) return false
    if (formatFilter !== "all" && ad.format !== formatFilter) return false
    if (ticketFilter !== "all") {
      const ticket = ad.ticket || 0
      if (ticketFilter === "ate50" && ticket > 50) return false
      if (ticketFilter === "51a150" && (ticket < 51 || ticket > 150)) return false
      if (ticketFilter === "acima150" && ticket < 151) return false
    }
    return true
  })

  const createCard = (ad: any) => {
    const borderColors: any = {
      gray: "border-gray-500",
      blue: "border-blue-500",
      orange: "border-orange-500",
      red: "border-red-500",
    }

    const textColors: any = {
      gray: "text-gray-300",
      blue: "text-blue-400",
      orange: "text-orange-400",
      red: "text-red-400",
    }

    return (
      <article
        key={ad.id || ad.title}
        className={`card rounded-lg border ${borderColors[ad.color] || "border-gray-500"} shadow-md p-4 bg-gray-800 cursor-pointer transition-transform hover:scale-[1.03]`}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className={`text-lg font-semibold ${textColors[ad.color] || "text-gray-300"}`}>{ad.title}</h4>
          <span
            className={`status-badge ${
              ad.status === "validating"
                ? "bg-gray-600 text-gray-300"
                : ad.status === "prescale"
                ? "bg-yellow-500 text-yellow-900"
                : "bg-green-600 text-green-300"
            }`}
          >
            {ad.status === "validating" ? "Validando" : ad.status === "prescale" ? "Pré Escala" : "Escalando"}
          </span>
        </div>
        <p className="text-gray-300 text-sm mb-0.5">
          <strong>Qtd Anúncios:</strong> {ad.adsCount}
        </p>
        <p className="text-gray-300 text-sm mb-0.5">
          <strong>ROAS:</strong> {ad.roas?.toFixed(2) ?? "N/A"}
        </p>
        <button
          className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg font-semibold text-sm transition"
          aria-label={`Ver detalhes da campanha ${ad.title}`}
        >
          Ver Detalhes
        </button>
      </article>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif", background: "#121214", color: "#E4E4E7" }}>
      {/* Sidebar, Header, Filtros e outras seções seguem iguais */}

      {/* Exibição Condicional com Loading */}
      <section className={`tab-content grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-8 py-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 ${currentTab !== "dashboard" ? "hidden" : ""}`}>
        {loading ? (
          <p className="text-center text-purple-400 col-span-full">Carregando anúncios...</p>
        ) : filteredAds.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">Nenhum anúncio encontrado.</p>
        ) : (
          filteredAds.map((ad) => createCard(ad))
        )}
      </section>
    </div>
  )
}
