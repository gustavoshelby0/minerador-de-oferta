"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, Users } from "lucide-react"

interface StatsData {
  totalAds: number
  impressions: number
  clicks: number
  totalSpend: number
  categoryStats: {
    category: string
    count: number
    percentage: number
  }[]
  recentActivity: {
    action: string
    count: number
    time: string
  }[]
}

export function Analytics() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)
      try {
        // Troque aqui para a sua API real que retorna dados do dashboard
        const res = await fetch("/api/analytics")
        if (!res.ok) throw new Error("Erro ao buscar dados do dashboard")
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p>Carregando dashboard...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>
  if (!data) return null

  const stats = [
    {
      title: "Total de Anúncios",
      value: data.totalAds.toLocaleString(),
      change: "+12.5%", // Você pode receber isso da API também
      trend: "up",
      icon: Eye,
    },
    {
      title: "Impressões",
      value: (data.impressions / 1_000_000).toFixed(1) + "M",
      change: "+8.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Cliques",
      value: data.clicks.toLocaleString(),
      change: "-2.1%",
      trend: "down",
      icon: MousePointer,
    },
    {
      title: "Investimento Total",
      value: `R$ ${data.totalSpend.toLocaleString("pt-BR")}`,
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Visão geral da mineração de anúncios do Facebook</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendIcon className={`h-3 w-3 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                  <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Anúncios por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
