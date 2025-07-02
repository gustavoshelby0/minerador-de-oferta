"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Tag,
  Presentation,
  DollarSign,
  SlidersHorizontal,
  Medal,
  Snowflake,
  Flame,
  Crown,
  ExternalLink,
  Heart,
  Share2,
  Calendar,
  TrendingUp,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react"

interface CampanhaReal {
  id: string
  name: string
  status: string
  objective: string
  created_time: string
  updated_time: string
  start_time: string
  stop_time?: string
  daily_budget?: string
  lifetime_budget?: string
  spend_cap?: string
  insights: {
    impressions: number
    clicks: number
    spend: number
    ctr: number
    cpc: number
    roas: number
  }
  nicho: string
  formato: string
  ticket: string
}

export function FacebookAdsMinerDashboard() {
  const [campanhas, setCampanhas] = useState<CampanhaReal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dataSource, setDataSource] = useState<"facebook_api" | "none">("none")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [filtros, setFiltros] = useState({
    busca: "",
    status: "Todos os Status",
    nicho: "Todos os Nichos",
    formato: "Todos os Formatos",
    ticket: "Todos os Tickets",
    ordenacao: "Mais Recentes",
  })

  useEffect(() => {
    carregarCampanhas()
  }, [])

  const carregarCampanhas = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/facebook-campaigns?limit=50")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar campanhas")
      }

      if (data.success && data.source === "facebook_api") {
        setCampanhas(data.data || [])
        setDataSource("facebook_api")
        setLastUpdate(new Date())
      } else {
        // Não mostrar dados fake - apenas erro
        setCampanhas([])
        setDataSource("none")
        setError("Configure sua API do Facebook para ver suas campanhas reais")
      }
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error)
      setCampanhas([])
      setDataSource("none")
      setError("Configure sua API do Facebook para ver suas campanhas reais")
    } finally {
      setLoading(false)
    }
  }

  const testarConexao = async () => {
    try {
      const response = await fetch("/api/facebook-campaigns", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        alert("✅ Conexão com Facebook Ads OK!")
        carregarCampanhas()
      } else {
        alert(`❌ Erro na conexão: ${data.error}`)
      }
    } catch (error) {
      alert("❌ Erro ao testar conexão")
    }
  }

  const getBadgeResultados = (insights: any) => {
    const impressions = insights.impressions || 0

    if (impressions < 10000) {
      return {
        icon: Medal,
        color: "text-[#CD7F32]",
        border: "border-[#CD7F32]",
        label: "Baixo alcance",
        tooltip: "Menos de 10K impressões",
      }
    } else if (impressions < 50000) {
      return {
        icon: Snowflake,
        color: "text-[#5EC3FF]",
        border: "border-[#5EC3FF]",
        label: "Bom alcance",
        tooltip: "10K-50K impressões",
      }
    } else if (impressions < 100000) {
      return {
        icon: Flame,
        color: "text-[#FF4500]",
        border: "border-[#FF4500]",
        label: "Alto alcance",
        tooltip: "50K-100K impressões",
      }
    } else {
      return {
        icon: Crown,
        color: "text-[#FFD700]",
        border: "border-[#FFD700]",
        label: "Alcance premium",
        tooltip: "Mais de 100K impressões",
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "PENDING_REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "DISAPPROVED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      ACTIVE: "Ativo",
      PAUSED: "Pausado",
      PENDING_REVIEW: "Em Análise",
      DISAPPROVED: "Reprovado",
      ARCHIVED: "Arquivado",
      CAMPAIGN_PAUSED: "Pausado",
      ADSET_PAUSED: "Pausado",
    }
    return statusMap[status] || status
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const campanhasFiltradas = campanhas.filter((campanha) => {
    const matchBusca =
      campanha.name.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      campanha.nicho.toLowerCase().includes(filtros.busca.toLowerCase())

    const matchStatus = filtros.status === "Todos os Status" || getStatusLabel(campanha.status) === filtros.status

    const matchNicho = filtros.nicho === "Todos os Nichos" || campanha.nicho === filtros.nicho

    const matchFormato = filtros.formato === "Todos os Formatos" || campanha.formato === filtros.formato

    return matchBusca && matchStatus && matchNicho && matchFormato
  })

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const abrirCampanha = (campaignId: string) => {
    const adAccountId = process.env.NEXT_PUBLIC_FACEBOOK_AD_ACCOUNT_ID || "YOUR_AD_ACCOUNT_ID"
    const url = `https://business.facebook.com/adsmanager/manage/campaigns/detail?act=${adAccountId}&selected_campaign_ids=${campaignId}`
    window.open(url, "_blank")
  }

  return (
    <div className="h-full bg-[#121214] text-[#E4E4E7] p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-purple-400 mb-2">Ofertas Escaladas</h1>
            <p className="text-gray-400">
              {dataSource === "facebook_api"
                ? "Dados em tempo real do Facebook Ads"
                : "Configure sua API do Facebook para ver suas campanhas reais"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testarConexao}
              className="flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <Settings className="h-4 w-4" />
              Testar API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={carregarCampanhas}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Status da Conexão */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {dataSource === "facebook_api" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={dataSource === "facebook_api" ? "text-green-400" : "text-red-400"}>
              {dataSource === "facebook_api" ? "API Conectada" : "API Não Configurada"}
            </span>
          </div>
          {lastUpdate && (
            <div className="flex items-center gap-2 text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Estatísticas Gerais - Só mostra se tiver dados reais */}
      {campanhas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Campanhas</p>
                  <p className="text-2xl font-bold text-white">{campanhas.length}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Campanhas Ativas</p>
                  <p className="text-2xl font-bold text-green-400">
                    {campanhas.filter((c) => c.status === "ACTIVE").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Investimento Total</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(campanhas.reduce((acc, c) => acc + (c.insights?.spend || 0), 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">ROAS Médio</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {(campanhas.reduce((acc, c) => acc + (c.insights?.roas || 0), 0) / campanhas.length || 0).toFixed(
                      1,
                    )}
                    x
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros - Só mostra se tiver dados */}
      {campanhas.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
            <div className="flex items-center">
              <button className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                Mais filtros
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {/* Busca */}
            <div className="relative flex-grow min-w-[240px] max-w-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar campanhas..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-purple-500"
                value={filtros.busca}
                onChange={(e) => handleFiltroChange("busca", e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="relative min-w-[180px] flex-grow max-w-[220px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
                value={filtros.status}
                onChange={(e) => handleFiltroChange("status", e.target.value)}
              >
                <option>Todos os Status</option>
                <option>Ativo</option>
                <option>Pausado</option>
                <option>Em Análise</option>
                <option>Reprovado</option>
                <option>Arquivado</option>
              </select>
            </div>

            {/* Nicho */}
            <div className="relative min-w-[180px] flex-grow max-w-[220px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
                value={filtros.nicho}
                onChange={(e) => handleFiltroChange("nicho", e.target.value)}
              >
                <option>Todos os Nichos</option>
                <option>Emagrecimento</option>
                <option>Renda Extra</option>
                <option>Saúde</option>
                <option>Sexualidade</option>
                <option>Beleza</option>
                <option>Espiritualidade</option>
                <option>Outros</option>
              </select>
            </div>

            {/* Formato */}
            <div className="relative min-w-[180px] flex-grow max-w-[220px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Presentation className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500"
                value={filtros.formato}
                onChange={(e) => handleFiltroChange("formato", e.target.value)}
              >
                <option>Todos os Formatos</option>
                <option>VSL</option>
                <option>Typebot</option>
                <option>Quiz</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9F4CFF]"></div>
        </div>
      )}

      {/* Cards das Campanhas - Só mostra se tiver dados reais */}
      {!loading && campanhas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campanhasFiltradas.map((campanha) => {
            const badgeInfo = getBadgeResultados(campanha.insights)
            const BadgeIcon = badgeInfo.icon

            return (
              <Card
                key={campanha.id}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusColor(campanha.status)}>{getStatusLabel(campanha.status)}</Badge>
                    <div
                      className={`w-8 h-8 rounded-full ${badgeInfo.border} border-2 flex items-center justify-center bg-gray-800 shadow-md`}
                    >
                      <BadgeIcon className={`h-4 w-4 ${badgeInfo.color}`} />
                    </div>
                  </div>

                  <CardTitle className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {campanha.name}
                  </CardTitle>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Criada em {formatDate(campanha.created_time)}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Objetivo:</span>
                      <span className="text-sm font-medium text-gray-300">{campanha.objective}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Nicho:</span>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {campanha.nicho}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Formato:</span>
                      <span className="text-sm font-medium text-gray-300">{campanha.formato}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Ticket:</span>
                      <span className="text-sm font-bold text-green-400">{campanha.ticket}</span>
                    </div>

                    <div className="border-t border-gray-700 pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Impressões:</span>
                        <span className="text-sm font-medium text-gray-300">
                          {formatNumber(campanha.insights?.impressions || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Cliques:</span>
                        <span className="text-sm font-medium text-gray-300">
                          {formatNumber(campanha.insights?.clicks || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Investimento:</span>
                        <span className="text-sm font-bold text-blue-400">
                          {formatCurrency(campanha.insights?.spend || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">CTR:</span>
                        <span className="text-sm font-medium text-gray-300">
                          {(campanha.insights?.ctr || 0).toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">CPC:</span>
                        <span className="text-sm font-medium text-gray-300">
                          {formatCurrency(campanha.insights?.cpc || 0)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">ROAS:</span>
                        <span className="text-sm font-bold text-purple-400">
                          {(campanha.insights?.roas || 0).toFixed(1)}x
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => abrirCampanha(campanha.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver no Ads Manager
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 bg-gray-700 border-gray-600 hover:bg-gray-600"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3 bg-gray-700 border-gray-600 hover:bg-gray-600"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Mensagem quando não há dados */}
      {!loading && campanhas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma campanha encontrada</h3>
          <p className="text-gray-400 mb-6">Configure sua API do Facebook para ver suas campanhas reais</p>
          <Button onClick={testarConexao} className="bg-purple-600 hover:bg-purple-700">
            <Settings className="h-4 w-4 mr-2" />
            Configurar API
          </Button>
        </div>
      )}
    </div>
  )
}
