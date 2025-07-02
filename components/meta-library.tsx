"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MetaAd {
  id: string
  ad_creative_bodies?: Array<{ value: string }>
  ad_creative_link_captions?: Array<{ value: string }>
  ad_creative_link_descriptions?: Array<{ value: string }>
  ad_creative_link_titles?: Array<{ value: string }>
  ad_creation_time: string
  ad_delivery_start_time?: string
  ad_delivery_stop_time?: string
  ad_snapshot_url?: string
  bylines?: string
  currency?: string
  delivery_by_region?: Array<{
    region: string
    percentage: string
  }>
  demographic_distribution?: Array<{
    age: string
    gender: string
    percentage: string
  }>
  impressions?: {
    lower_bound: string
    upper_bound: string
  }
  languages?: Array<string>
  page_id: string
  page_name: string
  publisher_platforms?: Array<string>
  spend?: {
    lower_bound: string
    upper_bound: string
  }
  ad_creative_link_urls?: Array<{ value: string }>
}

export function MetaLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [country, setCountry] = useState("BR")
  const [adType, setAdType] = useState("ALL")
  const [mediaType, setMediaType] = useState("ALL")
  const [ads, setAds] = useState<MetaAd[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [connectionStatus, setConnectionStatus] = useState("disconnected")

  const searchAds = async () => {
    if (!searchTerm.trim()) {
      setError("Por favor, digite um termo de busca")
      return
    }

    setLoading(true)
    setError("")
    setAds([])

    try {
      const params = new URLSearchParams({
        search_terms: searchTerm,
        ad_reached_countries: country,
        ad_active_status: "ALL",
        limit: "20",
      })

      if (mediaType !== "ALL") {
        params.append("media_type", mediaType)
      }

      const response = await fetch(`/api/meta-ads?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar anúncios")
      }

      if (data.success && data.data && data.data.length > 0) {
        setAds(data.data)
        setConnectionStatus("connected")
      } else {
        setError("Nenhum anúncio encontrado para este termo")
        setConnectionStatus("no_results")
      }
    } catch (error) {
      console.error("Erro na busca:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
      setConnectionStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      const response = await fetch("/api/meta-ads", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setConnectionStatus("connected")
        alert("✅ Conexão com Meta Ad Library OK!")
      } else {
        setConnectionStatus("error")
        alert(`❌ Erro na conexão: ${data.error}`)
      }
    } catch (error) {
      setConnectionStatus("error")
      alert("❌ Erro ao testar conexão")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatRange = (range: any, prefix = "") => {
    if (!range) return "N/A"
    if (range.lower_bound && range.upper_bound) {
      const lower = Number.parseInt(range.lower_bound).toLocaleString()
      const upper = Number.parseInt(range.upper_bound).toLocaleString()
      return `${prefix}${lower} - ${prefix}${upper}`
    }
    return "N/A"
  }

  const exportResults = () => {
    if (ads.length === 0) {
      alert("Nenhum anúncio para exportar")
      return
    }

    const csvContent = [
      ["Página", "Título", "Descrição", "Impressões", "Investimento", "Data Início", "Plataformas", "Status"].join(","),
      ...ads.map((ad) =>
        [
          `"${ad.page_name}"`,
          `"${ad.ad_creative_link_titles?.[0]?.value || ""}"`,
          `"${ad.ad_creative_link_descriptions?.[0]?.value || ""}"`,
          `"${formatRange(ad.impressions)}"`,
          `"${formatRange(ad.spend, "R$ ")}"`,
          `"${formatDate(ad.ad_creation_time)}"`,
          `"${ad.publisher_platforms?.join(", ") || ""}"`,
          `"${ad.ad_delivery_stop_time ? "Finalizado" : "Ativo"}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `meta-ads-${searchTerm}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusIndicator = () => {
    if (connectionStatus === "connected") {
      return (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-400">API Conectada</span>
        </>
      )
    } else if (connectionStatus === "error") {
      return (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-400">Erro na API</span>
        </>
      )
    } else {
      return (
        <>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-400">Desconectado</span>
        </>
      )
    }
  }

  return (
    <div className="h-full bg-[#121214] text-[#E4E4E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-purple-400 mb-2">Meta Ad Library</h1>
          <p className="text-gray-400">Busque anúncios públicos do Facebook e Instagram</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">{getStatusIndicator()}</div>
          <Button onClick={testConnection} className="bg-purple-600 hover:bg-purple-700">
            <i className="fas fa-cog mr-2"></i>
            Testar API
          </Button>
        </div>
      </div>

      {/* Search Form */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-purple-400">
            <i className="fas fa-search mr-2"></i>
            Buscar Anúncios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Termo de Busca</label>
              <Input
                type="text"
                placeholder="Ex: emagrecimento, renda extra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchAds()}
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
                <option value="BR">🇧🇷 Brasil</option>
                <option value="US">🇺🇸 Estados Unidos</option>
                <option value="PT">🇵🇹 Portugal</option>
                <option value="ES">🇪🇸 Espanha</option>
                <option value="MX">🇲🇽 México</option>
                <option value="AR">🇦🇷 Argentina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Anúncio</label>
              <select
                value={adType}
                onChange={(e) => setAdType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="POLITICAL_AND_ISSUE_ADS">Políticos</option>
                <option value="HOUSING_ADS">Habitação</option>
                <option value="EMPLOYMENT_ADS">Emprego</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Mídia</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300"
              >
                <option value="ALL">Todas as Mídias</option>
                <option value="IMAGE">Imagem</option>
                <option value="VIDEO">Vídeo</option>
                <option value="CAROUSEL">Carrossel</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={searchAds}
              disabled={loading || !searchTerm.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-2"></i>
                  Buscar Anúncios
                </>
              )}
            </Button>

            {ads.length > 0 && (
              <Button onClick={exportResults} className="bg-green-600 hover:bg-green-700">
                <i className="fas fa-download mr-2"></i>
                Exportar CSV
              </Button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {ads.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Resultados da Busca ({ads.length} anúncios encontrados)
            </h2>
            <div className="text-sm text-gray-400">
              Termo: "<strong className="text-purple-400">{searchTerm}</strong>" • País:{" "}
              <strong className="text-purple-400">{country}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <Card
                key={ad.id}
                className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-purple-400 mb-2">{ad.page_name}</CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <i className="fas fa-calendar text-gray-400"></i>
                        <span className="text-sm text-gray-400">{formatDate(ad.ad_creation_time)}</span>
                      </div>
                    </div>
                    <Badge
                      className={ad.ad_delivery_stop_time ? "bg-gray-600 text-gray-300" : "bg-green-600 text-green-300"}
                    >
                      {ad.ad_delivery_stop_time ? "Finalizado" : "Ativo"}
                    </Badge>
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
                    {ad.ad_creative_link_titles?.[0]?.value && (
                      <div>
                        <h4 className="font-semibold text-white mb-1">{ad.ad_creative_link_titles[0].value}</h4>
                        {ad.ad_creative_link_descriptions?.[0]?.value && (
                          <p className="text-sm text-gray-400 mb-2">{ad.ad_creative_link_descriptions[0].value}</p>
                        )}
                      </div>
                    )}

                    {ad.ad_creative_bodies?.[0]?.value && (
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-gray-300 line-clamp-4">{ad.ad_creative_bodies[0].value}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-700 pt-3">
                      <div>
                        <span className="text-gray-400 block">Impressões:</span>
                        <p className="font-medium text-white">{formatRange(ad.impressions)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Investimento:</span>
                        <p className="font-medium text-green-400">{formatRange(ad.spend, "R$ ")}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-700">
                      <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => window.open(ad.ad_snapshot_url, "_blank")}
                      >
                        <i className="fas fa-eye mr-1"></i>
                        Ver Anúncio
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 px-3"
                        onClick={() => window.open(ad.ad_creative_link_urls?.[0]?.value, "_blank")}
                      >
                        <i className="fas fa-external-link-alt"></i>
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
      {!loading && ads.length === 0 && !error && (
        <div className="text-center py-12">
          <i className="fas fa-search text-6xl text-gray-600 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Busque anúncios na Meta Ad Library</h3>
          <p className="text-gray-500 mb-4">
            Digite um termo de busca para encontrar anúncios públicos do Facebook e Instagram
          </p>
          <div className="text-sm text-gray-600">
            <p>
              💡 <strong>Dicas de busca:</strong>
            </p>
            <p>• Use palavras-chave específicas como "emagrecimento", "renda extra"</p>
            <p>• Teste diferentes países para ver variações regionais</p>
            <p>• Combine termos para resultados mais precisos</p>
          </div>
        </div>
      )}
    </div>
  )
}
