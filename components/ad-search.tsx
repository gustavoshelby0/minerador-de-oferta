"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Trash2, Download } from "lucide-react"

export function AdSearch() {
  const [searchQueries, setSearchQueries] = useState([
    { id: 1, advertiser: "Hotmart", status: "active" },
    { id: 2, advertiser: "Monetizze", status: "active" },
    { id: 3, advertiser: "Eduzz", status: "paused" },
  ])
  const [newAdvertiser, setNewAdvertiser] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Filtros
  const [country, setCountry] = useState("BR")
  const [adType, setAdType] = useState("ALL")
  const [dateRange, setDateRange] = useState("30")
  const [minImpressions, setMinImpressions] = useState("100000")

  const addAdvertiser = () => {
    if (newAdvertiser.trim()) {
      const newQuery = {
        id: Date.now(),
        advertiser: newAdvertiser.trim(),
        status: "active",
      }
      setSearchQueries([...searchQueries, newQuery])
      setNewAdvertiser("")
    }
  }

  const removeAdvertiser = (id: number) => {
    setSearchQueries(searchQueries.filter((query) => query.id !== id))
  }

  const performSearch = async () => {
    if (searchQueries.length === 0) return alert("Adicione pelo menos um anunciante para buscar")

    setIsSearching(true)

    try {
      // Montar query string para o backend
      // Vamos mandar anunciantes concatenados separados por vírgula
      const advertisers = searchQueries.map((q) => q.advertiser).join(",")
      
      // Montar URL do endpoint API (ajuste para seu endpoint real)
      const queryParams = new URLSearchParams({
        search_terms: advertisers,
        ad_reached_countries: country,
        ad_active_status: adType === "ALL" ? "ALL" : adType.toUpperCase(),
        limit: "50",
      })

      const response = await fetch(`/api/ads?${queryParams.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        alert("Erro na busca: " + (data.error || "Erro desconhecido"))
        setSearchResults([])
      } else {
        // Aqui você pode filtrar por impressões mínimas e data se precisar
        // Exemplo de filtro simples por impressões (supondo que impressions seja string '1M+' etc)
        let filteredAds = data.data || []

        if (minImpressions) {
          // Converter minImpressions para número
          const minImprNum = Number(minImpressions)
          filteredAds = filteredAds.filter((ad: any) => {
            // Supondo que ad.impressions seja uma string, tentar extrair número real (ex: '1M+' -> 1000000)
            const impressionsStr = ad.impressions || ""
            const impressionsNum = parseImpressions(impressionsStr)
            return impressionsNum >= minImprNum
          })
        }

        setSearchResults(filteredAds)
      }
    } catch (error) {
      alert("Erro ao buscar anúncios: " + error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Função auxiliar para converter impressões tipo '1M+' para número exato
  function parseImpressions(impr: string): number {
    if (!impr) return 0
    const num = impr.replace(/[+,]/g, "").toUpperCase()
    if (num.endsWith("M")) return parseFloat(num) * 1_000_000
    if (num.endsWith("K")) return parseFloat(num) * 1_000
    return parseFloat(num) || 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Buscar Anúncios</h2>
        <p className="text-gray-600 mt-2">Configure buscas automáticas por anunciantes específicos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Anunciantes Monitorados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Nome do anunciante..."
                value={newAdvertiser}
                onChange={(e) => setNewAdvertiser(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAdvertiser()}
              />
              <Button onClick={addAdvertiser}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-auto">
              {searchQueries.map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{query.advertiser}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        query.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {query.status === "active" ? "Ativo" : "Pausado"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeAdvertiser(query.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={performSearch} disabled={isSearching || searchQueries.length === 0} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Buscando..." : "Buscar Anúncios"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Busca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="country">País</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BR">Brasil</SelectItem>
                  <SelectItem value="US">Estados Unidos</SelectItem>
                  <SelectItem value="ALL">Todos os países</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ad-type">Tipo de Anúncio</Label>
              <Select value={adType} onValueChange={setAdType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os tipos</SelectItem>
                  <SelectItem value="ACTIVE">Ativos</SelectItem>
                  <SelectItem value="PAUSED">Pausados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="min-impressions">Impressões Mínimas</Label>
              <Input
                id="min-impressions"
                type="number"
                placeholder="Ex: 100000"
                value={minImpressions}
                onChange={(e) => setMinImpressions(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Resultados da Busca</CardTitle>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{result.advertiser}</h3>
                      <p className="text-sm text-gray-600">Última atualização: {result.last_updated}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total de Anúncios</p>
                      <p className="text-lg font-semibold">{result.ad_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Anúncios Ativos</p>
                      <p className="text-lg font-semibold">{result.active_ads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Investimento Total</p>
                      <p className="text-lg font-semibold">{result.total_spend}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
