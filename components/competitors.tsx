"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Eye, Users, Target, Zap } from "lucide-react"

interface Competitor {
  id: number
  name: string
  category: string
  total_ads: number
  active_ads: number
  estimated_spend: string
  top_products: string[]
  trend: "up" | "down"
  growth: string
  market_share: number
  avg_ctr: string
  scale_level: "Alto" | "Médio" | "Baixo" | string
}

export function Competitors() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompetitors() {
      setLoading(true)
      setError(null)
      try {
        // Troque pela URL real da sua API que traz concorrentes por período
        const response = await fetch(`/api/competitors?period=${selectedPeriod}`)
        if (!response.ok) {
          throw new Error("Erro ao carregar concorrentes")
        }
        const data: Competitor[] = await response.json()
        setCompetitors(data)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }
    fetchCompetitors()
  }, [selectedPeriod]) // atualiza quando muda o período

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

  if (loading) return <p>Carregando concorrentes...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Análise de Concorrentes</h2>
          <p className="text-gray-600 mt-2">Monitore a atividade publicitária dos principais players</p>
        </div>
        <div className="flex space-x-2">
          {["7d", "30d", "90d"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Concorrentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitors.length}</div>
            {/* Pode ser dinâmico, ex: soma de novos concorrentes por período se API fornecer */}
            <p className="text-xs text-muted-foreground">+12 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anúncios Ativos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitors.reduce((acc, c) => acc + c.active_ads, 0)}
            </div>
            <p className="text-xs text-muted-foreground">+8.2% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* Exemplo básico: você pode precisar processar esse dado */}
              {/* Aqui não soma string, só exibe estimativa maior */}
              {competitors.reduce((acc, c) => {
                // Supondo que estimated_spend seja faixa "R$ xx - R$ yy"
                const maxMatch = c.estimated_spend.match(/R\$ (\d+[,.\d]*) - R\$ (\d+[,.\d]*)/)
                if (maxMatch) {
                  const maxValue = parseFloat(maxMatch[2].replace(/\./g, "").replace(",", "."))
                  return acc + maxValue
                }
                return acc
              }, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-xs text-muted-foreground">Estimativa mensal</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {competitors.map((competitor) => {
          const TrendIcon = competitor.trend === "up" ? TrendingUp : TrendingDown

          return (
            <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{competitor.name}</h3>
                      <Badge variant="secondary">{competitor.category}</Badge>
                      <Badge className={getScaleLevelColor(competitor.scale_level)}>
                        <Zap className="h-3 w-3 mr-1" />
                        {competitor.scale_level}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{competitor.total_ads} anúncios total</span>
                      <span>{competitor.active_ads} ativos</span>
                      <span>CTR médio: {competitor.avg_ctr}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TrendIcon
                      className={`h-4 w-4 ${
                        competitor.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        competitor.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {competitor.growth}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Anúncios
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Principais Produtos</h4>
                    <div className="flex flex-wrap gap-2">
                      {competitor.top_products.map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Investimento Estimado</h4>
                    <p className="text-lg font-semibold text-blue-600">{competitor.estimated_spend}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Market Share</span>
                    <span className="text-sm text-gray-600">{competitor.market_share}%</span>
                  </div>
                  <Progress value={competitor.market_share} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
