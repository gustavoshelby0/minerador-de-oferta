"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MinedAd {
  id: string
  page_name: string
  ad_creative_body?: string
  ad_creative_link_title?: string
  impressions?: {
    lower_bound: string
    upper_bound: string
  }
  spend?: {
    lower_bound: string
    upper_bound: string
  }
  ad_creation_time: string
  publisher_platforms?: string[]
  ad_snapshot_url?: string
  currency?: string
  is_active?: boolean
}

export function Mineracao() {
  const [searchTerm, setSearchTerm] = useState("")
  const [country, setCountry] = useState("BR")
  const [minSpend, setMinSpend] = useState("")
  const [maxSpend, setMaxSpend] = useState("")
  const [minedAds, setMinedAds] = useState<MinedAd[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [autoMining, setAutoMining] = useState(false)
  const [miningInterval, setMiningInterval] = useState<NodeJS.Timeout | null>(null)

  const startMining = async () => {
    if (!searchTerm.trim()) {
      setError("Digite um termo para minerar")
      return
    }

    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        search_terms: searchTerm,
        ad_reached_countries: country,
        ad_active_status: "ACTIVE",
        limit: "50",
      })

      const response = await fetch(`/api/meta-ads?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao minerar anúncios")
      }

      if (data.success && data.data && data.data.length > 0) {
        // Filtrar por investimento se especificado
        let filteredAds = data.data

        if (minSpend || maxSpend) {
          filteredAds = data.data.filter((ad: MinedAd) => {
            if (!ad.spend) return false

            const spendLower = Number.parseInt(ad.spend.lower_bound)
            const spendUpper = Number.parseInt(ad.spend.upper_bound)
            const avgSpend = (spendLower + spendUpper) / 2

            if (minSpend && avgSpend < Number.parseInt(minSpend)) return false
            if (maxSpend && avgSpend > Number.parseInt(maxSpend)) return false

            return true
          })
        }

        setMinedAds(filteredAds)
      } else {
        setError("Nenhum anúncio encontrado para minerar")
      }
    } catch (error) {
      console.error("Erro na mineração:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoMining = () => {
    if (autoMining) {
      // Parar mineração automática
      if (miningInterval) {
        clearInterval(miningInterval)
        setMiningInterval(null)
      }
      setAutoMining(false)
    } else {
      // Iniciar mineração automática
      setAutoMining(true)
      const interval = setInterval(() => {
        startMining()
      }, 300000) // 5 minutos
      setMiningInterval(interval)
    }
  }

  const exportMinedAds = () => {
    if (minedAds.length === 0) {
      alert("Nenhum anúncio minerado para exportar")
      return
    }

    const csvContent = [
      [
        "Página",
        "Título",
        "Texto",
        "Impressões Min",
        "Impressões Max",
        "Gasto Min",
        "Gasto Max",
        "Data",
        "Plataformas",
        "Status",
      ].join(","),
      ...minedAds.map((ad) =>
        [
          `"${ad.page_name}"`,
          `"${ad.ad_creative_link_title || ""}"`,
          `"${ad.ad_creative_body?.substring(0, 100) || ""}"`,
          `"${ad.impressions?.lower_bound || ""}"`,
          `"${ad.impressions?.upper_bound || ""}"`,
          `"${ad.spend?.lower_bound || ""}"`,
          `"${ad.spend?.upper_bound || ""}"`,
          `"${new Date(ad.ad_creation_time).toLocaleDateString("pt-BR")}"`,
          `"${ad.publisher_platforms?.join(", ") || ""}"`,
          `"${ad.is_active ? "Ativo" : "Inativo"}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `anuncios-minerados-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatNumber = (num: string) => {
    const number = Number.parseInt(num)
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M"
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K"
    }
    return number.toString()
  }

  const formatCurrency = (value: string, currency = "BRL") => {
    const number = Number.parseFloat(value)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency === "USD" ? "USD" : "BRL",
    }).format(number)
  }

  useEffect(() => {
    return () => {
      if (miningInterval) {
        clearInterval(miningInterval)
      }
    }
  }, [miningInterval])

  return (
    <div className="h-full bg-[#121214] text-[#E4E4E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-400 mb-2">Sistema de Mineração</h1>
          <p className="text-gray-400">Minere anúncios automaticamente com filtros personalizados</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${autoMining ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
            <span className="text-sm text-gray-400">{autoMining ? "Mineração Ativa" : "Mineração Parada"}</span>
          </div>
          <Button
            onClick={toggleAutoMining}
            className={autoMining ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            <i className={`fas ${autoMining ? "fa-stop" : "fa-play"} mr-2`}></i>
            {autoMining ? "Parar Mineração" : "Iniciar Auto-Mineração"}
          </Button>
        </div>
      </div>

      {/* Mining Configuration */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-400">
            <i className="fas fa-cogs mr-2"></i>
            Configuração da Mineração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nicho/Palavra-chave</label>
              <Input
                type="text"
                placeholder="Ex: emagrecimento, curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300"
              >
                <option value="BR">Brasil</option>
                <option value="US">Estados Unidos</option>
                <option value="PT">Portugal</option>
                <option value="ES">Espanha</option>
                <option value="AR">Argentina</option>
                <option value="MX">México</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gasto Mínimo (R$)</label>
              <Input
                type="number"
                placeholder="Ex: 1000"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gasto Máximo (R$)</label>
              <Input
                type="number"
                placeholder="Ex: 10000"
                value={maxSpend}
                onChange={(e) => setMaxSpend(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={startMining}
                disabled={loading || !searchTerm.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Minerando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Minerar Agora
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mining Results */}
      {minedAds.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Anúncios Minerados ({minedAds.length} encontrados)</h2>
            <Button onClick={exportMinedAds} className="bg-green-600 hover:bg-green-700">
              <i className="fas fa-download mr-2"></i>
              Exportar Mineração
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {minedAds.map((ad) => (
              <Card
                key={ad.id}
                className="bg-gray-800 border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-orange-400 mb-2">{ad.page_name}</CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <i className="fas fa-calendar text-gray-400"></i>
                        <span className="text-sm text-gray-400">
                          {new Date(ad.ad_creation_time).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500 text-yellow-900">Minerado</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {ad.publisher_platforms?.map((platform) => (
                      <Badge
                        key={platform}
                        className={
                          platform === "facebook"
                            ? "bg-blue-600 text-blue-300"
                            : platform === "instagram"
                              ? "bg-pink-600 text-pink-300"
                              : "bg-purple-600 text-purple-300"
                        }
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {ad.ad_creative_link_title && (
                      <div>
                        <h4 className="font-semibold text-white mb-1">{ad.ad_creative_link_title}</h4>
                      </div>
                    )}

                    {ad.ad_creative_body && (
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-300 line-clamp-3">{ad.ad_creative_body}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-700 pt-3">
                      <div>
                        <span className="text-gray-400 block">Impressões:</span>
                        <p className="font-medium text-white">
                          {ad.impressions
                            ? `${formatNumber(ad.impressions.lower_bound)} - ${formatNumber(ad.impressions.upper_bound)}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Investimento:</span>
                        <p className="font-medium text-green-400">
                          {ad.spend
                            ? `${formatCurrency(ad.spend.lower_bound, ad.currency)} - ${formatCurrency(ad.spend.upper_bound, ad.currency)}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-700">
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        onClick={() => window.open(ad.ad_snapshot_url, "_blank")}
                      >
                        <i className="fas fa-eye mr-1"></i>
                        Ver Anúncio
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 px-3"
                        onClick={() => {
                          navigator.clipboard.writeText(ad.ad_creative_body || ad.ad_creative_link_title || "")
                          alert("Texto copiado!")
                        }}
                      >
                        <i className="fas fa-copy"></i>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && minedAds.length === 0 && !error && (
        <div className="text-center py-12">
          <i className="fas fa-pickaxe text-6xl text-gray-600 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Inicie a mineração de anúncios</h3>
          <p className="text-gray-500 mb-4">Configure os filtros e comece a minerar anúncios automaticamente</p>
          <div className="text-sm text-gray-600">
            <p>
              ⚡ <strong>Recursos da mineração:</strong>
            </p>
            <p>• Mineração automática a cada 5 minutos</p>
            <p>• Filtros por investimento e país</p>
            <p>• Exportação automática dos resultados</p>
            <p>• Apenas anúncios ativos são minerados</p>
          </div>
        </div>
      )}
    </div>
  )
}
