"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, TrendingUp, Eye, ExternalLink, Zap } from "lucide-react"
import Image from "next/image"

interface ScaledAd {
  id: number
  advertiser: string
  product: string
  category: string
  impressions: string
  spend: string
  reach: string
  days_active: number
  scale_level: string
  ctr: string
  image: string
  ad_text: string
  target_audience: string
  ad_url?: string
  ad_library_url?: string
}

export function ScaledAds() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [scaleFilter, setScaleFilter] = useState("all")

  const [scaledAds, setScaledAds] = useState<ScaledAd[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchScaledAds = async () => {
    setLoading(true)
    setError("")
    try {
      // Troque a URL pela sua API real
      const res = await fetch(`/api/ads-scaled`)
      if (!res.ok) throw new Error(`Erro ao buscar anúncios: ${res.statusText}`)
      const data: ScaledAd[] = await res.json()
      setScaledAds(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScaledAds()
  }, [])

  const getScaleLevelColor = (level: string) => {
    switch (level) {
      case "Alto":
        return "bg-red-100 text-red-800"
      case "Médio":
        return "bg-yellow-100 text-yellow-800"
      case "Baixo":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAds = scaledAds.filter((ad) => {
    const matchesSearch =
      ad.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || ad.category === categoryFilter
    const matchesScale = scaleFilter === "all" || ad.scale_level === scaleFilter
    return matchesSearch && matchesCategory && matchesScale
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Anúncios Escalados</h2>
          <p className="text-gray-600 mt-2">Anúncios com alto volume de impressões e investimento</p>
        </div>
        <Button onClick={() => alert("Exportar relatório ainda não implementado")}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Filtros de Escala</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por anunciante ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Negócios">Negócios</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scaleFilter} onValueChange={setScaleFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Nível de Escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Baixo">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading && <p>Carregando anúncios...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {filteredAds.map((ad) => (
          <Card key={ad.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Image
                  src={ad.image || "/placeholder.svg"}
                  alt={ad.product}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{ad.advertiser}</h3>
                      <p className="text-gray-600 mt-1">{ad.product}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{ad.category}</Badge>
                        <Badge className={getScaleLevelColor(ad.scale_level)}>
                          <Zap className="h-3 w-3 mr-1" />
                          {ad.scale_level}
                        </Badge>
                        <span className="text-sm text-gray-500">Ativo há {ad.days_active} dias</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => ad.ad_url && window.open(ad.ad_url, "_blank")}
                        disabled={!ad.ad_url}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Anúncio
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => ad.ad_library_url && window.open(ad.ad_library_url, "_blank")}
                        disabled={!ad.ad_library_url}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ad Library
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 italic">"{ad.ad_text}"</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Impressões</p>
                      <p className="text-sm font-semibold">{ad.impressions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Alcance</p>
                      <p className="text-sm font-semibold">{ad.reach}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investimento</p>
                      <p className="text-sm font-semibold">{ad.spend}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CTR</p>
                      <p className="text-sm font-semibold">{ad.ctr}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Público-alvo</p>
                      <p className="text-xs text-gray-600">{ad.target_audience}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
