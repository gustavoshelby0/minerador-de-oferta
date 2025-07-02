"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, ExternalLink, Calendar, Users, DollarSign, Eye, AlertCircle, CheckCircle } from "lucide-react"

interface MetaAd {
  id: string
  page_name: string
  ad_creative_body: string
  ad_snapshot_url: string
  ad_creation_time: string
  ad_delivery_start_time: string
  ad_delivery_stop_time: string | null
  impressions: any
  spend: any
  currency: string
  platforms: string[]
  demographics: any[]
  estimated_audience: any
  is_active: boolean
}

export function MetaAdLibrary() {
  const [ads, setAds] = useState<MetaAd[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("iphone")
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown")

  // Testar conexão com Meta API
  const testConnection = async () => {
    try {
      const response = await fetch("/api/meta-ads", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("error")
        setError(result.error)
      }
    } catch (err) {
      setConnectionStatus("error")
      setError("Erro ao testar conexão")
    }
  }

  // Buscar anúncios
  const searchAds = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        search_terms: searchTerm,
        ad_reached_countries: "BR",
        limit: "20",
      })

      const response = await fetch(`/api/meta-ads?${params}`)
      const result = await response.json()

      if (result.success) {
        setAds(result.data)
        setConnectionStatus("connected")
      } else {
        setError(result.error || "Erro ao buscar anúncios")
      }
    } catch (err) {
      setError("Erro na requisição: " + (err instanceof Error ? err.message : "Erro desconhecido"))
    } finally {
      setLoading(false)
    }
  }

  // Testar conexão ao carregar
  useEffect(() => {
    testConnection()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatImpressions = (impressions: any) => {
    if (!impressions) return "N/A"
    if (typeof impressions === "object") {
      return `${impressions.lower_bound || "0"} - ${impressions.upper_bound || "0"}`
    }
    return impressions.toString()
  }

  const formatSpend = (spend: any, currency: string) => {
    if (!spend) return "N/A"
    if (typeof spend === "object") {
      return `${currency} ${spend.lower_bound || "0"} - ${spend.upper_bound || "0"}`
    }
    return `${currency} ${spend}`
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Meta Ad Library</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Busque e visualize anúncios públicos do Facebook diretamente da Meta Ad Library API. Todos os anúncios
          exibidos são públicos e disponibilizados pela Meta.
        </p>
      </div>

      {/* Status da Conexão */}
      <div className="flex justify-center">
        {connectionStatus === "connected" && (
          <Alert className="max-w-md border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Conectado à Meta Ad Library API</AlertDescription>
          </Alert>
        )}

        {connectionStatus === "error" && (
          <Alert className="max-w-md border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Erro na conexão: {error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Anúncios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Digite uma palavra-chave (ex: iphone, curso, loja)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchAds()}
              className="flex-1"
            />
            <Button onClick={searchAds} disabled={loading || !searchTerm.trim()} className="min-w-[120px]">
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">🇧🇷 Buscando apenas anúncios que alcançaram o Brasil</p>
        </CardContent>
      </Card>

      {/* Resultados */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {ads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Resultados para "{searchTerm}"</h2>
            <Badge variant="secondary">{ads.length} anúncios encontrados</Badge>
          </div>

          <div className="grid gap-6">
            {ads.map((ad) => (
              <Card key={ad.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Informações do Anúncio */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{ad.page_name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={ad.is_active ? "default" : "secondary"}>
                              {ad.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                            {ad.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" asChild>
                          <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver Original
                          </a>
                        </Button>
                      </div>

                      {/* Texto do Anúncio */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Texto do Anúncio:</h4>
                        <p className="text-gray-700 leading-relaxed">{ad.ad_creative_body}</p>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Impressões</p>
                            <p className="text-sm font-semibold">{formatImpressions(ad.impressions)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Investimento</p>
                            <p className="text-sm font-semibold">{formatSpend(ad.spend, ad.currency)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500">Criado em</p>
                            <p className="text-sm font-semibold">{formatDate(ad.ad_creation_time)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-gray-500">Público</p>
                            <p className="text-sm font-semibold">{ad.estimated_audience?.lower_bound || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview do Anúncio */}
                    <div className="bg-gray-100 p-6 flex items-center justify-center">
                      <div className="w-full max-w-md">
                        <h4 className="font-medium text-gray-900 mb-3 text-center">Preview do Anúncio</h4>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <iframe
                            src={ad.ad_snapshot_url}
                            className="w-full h-96 border-0"
                            title={`Anúncio de ${ad.page_name}`}
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">Snapshot oficial da Meta Ad Library</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {!loading && ads.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
          <p className="text-gray-500">
            Digite uma palavra-chave e clique em "Buscar" para ver anúncios da Meta Ad Library
          </p>
        </div>
      )}
    </div>
  )
}
