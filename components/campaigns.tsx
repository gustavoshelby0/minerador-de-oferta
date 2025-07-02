"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Play, Pause, BarChart3 } from "lucide-react"

interface Campaign {
  id: number
  name: string
  advertiser: string
  status: "active" | "paused" | "completed" | string
  budget: string
  spent: string
  progress: number
  ads: number
  impressions: string
  clicks: string
  conversions: number
  ctr: string
  cpc: string
  roas: string
  trend: "up" | "down"
}

export function Campaigns() {
  const [campaignList, setCampaignList] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true)
      setError(null)
      try {
        // Troque pela URL da sua API real que retorna as campanhas
        const response = await fetch("/api/campaigns") 
        if (!response.ok) {
          throw new Error("Erro ao carregar campanhas")
        }
        const data: Campaign[] = await response.json()
        setCampaignList(data)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa"
      case "paused":
        return "Pausada"
      case "completed":
        return "Concluída"
      default:
        return status
    }
  }

  if (loading) {
    return <p>Carregando campanhas...</p>
  }

  if (error) {
    return <p className="text-red-600">Erro: {error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Campanhas</h2>
          <p className="text-gray-600 mt-2">Análise detalhada das campanhas mineradas</p>
        </div>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Relatório Completo
        </Button>
      </div>

      <div className="grid gap-6">
        {campaignList.map((campaign) => {
          const TrendIcon = campaign.trend === "up" ? TrendingUp : TrendingDown

          return (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{campaign.name}</CardTitle>
                    <p className="text-gray-600 mt-1">{campaign.advertiser}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <Badge className={getStatusColor(campaign.status)}>{getStatusText(campaign.status)}</Badge>
                      <span className="text-sm text-gray-500">{campaign.ads} anúncios</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      {campaign.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Orçamento Utilizado</span>
                      <span className="text-sm text-gray-600">
                        {campaign.spent} de {campaign.budget}
                      </span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Impressões</p>
                      <p className="text-sm font-semibold">{campaign.impressions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Cliques</p>
                      <p className="text-sm font-semibold">{campaign.clicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Conversões</p>
                      <p className="text-sm font-semibold">{campaign.conversions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">CTR</p>
                      <p className="text-sm font-semibold">{campaign.ctr}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">CPC</p>
                      <p className="text-sm font-semibold">{campaign.cpc}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">ROAS</p>
                      <div className="flex items-center justify-center space-x-1">
                        <p className="text-sm font-semibold">{campaign.roas}</p>
                        <TrendIcon
                          className={`h-3 w-3 ${
                            campaign.trend === "up" ? "text-green-500" : "text-red-500"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Anúncios</p>
                      <p className="text-sm font-semibold">{campaign.ads}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
