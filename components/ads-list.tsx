"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, ExternalLink } from "lucide-react"
import Image from "next/image"

interface Ad {
  id: number
  title: string
  advertiser: string
  status: "active" | "paused" | "rejected" | string
  impressions: string
  clicks: string
  ctr: string
  spend: string
  image?: string
  category: string
  dateCreated: string
}

export function AdsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAds() {
      setLoading(true)
      setError(null)
      try {
        // Troque a URL abaixo pela sua API real
        const res = await fetch("/api/ads")
        if (!res.ok) throw new Error(`Erro ao buscar anúncios: ${res.statusText}`)
        const data = await res.json()
        setAds(data)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "paused":
        return "Pausado"
      case "rejected":
        return "Rejeitado"
      default:
        return status
    }
  }

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.advertiser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Anúncios Minerados</h2>
          <p className="text-gray-600 mt-2">Lista completa de anúncios coletados do Facebook</p>
        </div>
        <Button disabled={loading || ads.length === 0} onClick={() => alert("Implementar exportação")}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título ou anunciante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p>Carregando anúncios...</p>}
          {error && <p className="text-red-600">Erro: {error}</p>}
          {!loading && !error && filteredAds.length === 0 && <p>Nenhum anúncio encontrado.</p>}

          {!loading &&
            !error &&
            filteredAds.map((ad) => (
              <div key={ad.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <Image
                    src={ad.image || "/placeholder.svg"}
                    alt={ad.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{ad.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ad.advertiser}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{ad.category}</Badge>
                          <Badge className={getStatusColor(ad.status)}>{getStatusText(ad.status)}</Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => alert(`Ver anúncio ${ad.title}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(ad.image || "#", "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Abrir
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Impressões</p>
                        <p className="text-sm font-semibold">{ad.impressions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cliques</p>
                        <p className="text-sm font-semibold">{ad.clicks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">CTR</p>
                        <p className="text-sm font-semibold">{ad.ctr}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Investimento</p>
                        <p className="text-sm font-semibold">{ad.spend}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
