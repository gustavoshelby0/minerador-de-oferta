"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  DollarSign,
  Share2,
  Copy,
  TrendingUp,
  Award,
  Star,
  Crown,
  Zap,
  Calendar,
  Plus,
  Eye,
  Download,
  MessageCircle,
  Mail,
  Youtube,
  Globe,
  QrCode,
  BarChart3,
  Target,
  Clock,
  Info,
} from "lucide-react"

interface Indicacao {
  id: string
  nome: string
  email: string
  status: "Pendente" | "Ativo" | "Inativo"
  dataIndicacao: string
  dataAtivacao?: string
  comissaoGerada: number
  nivel: number
  avatar: string
  plano: string
  valorPlano: number
}

interface ComissaoHistorico {
  id: string
  descricao: string
  valor: number
  data: string
  status: "Pago" | "Pendente" | "Processando"
  indicadoNome: string
  tipo: "Comissao" | "Bonus" | "Residual"
}

interface MaterialDivulgacao {
  id: string
  titulo: string
  tipo: "Banner" | "Video" | "Texto" | "Email" | "Story"
  formato: string
  tamanho?: string
  preview: string
  downloads: number
}

export function Indique() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([])
  const [historico, setHistorico] = useState<ComissaoHistorico[]>([])
  const [materiais, setMateriais] = useState<MaterialDivulgacao[]>([])
  const [linkAfiliado, setLinkAfiliado] = useState("")
  const [codigoAfiliado, setCodigoAfiliado] = useState("")
  const [linkPersonalizado, setLinkPersonalizado] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [estatisticas, setEstatisticas] = useState({
    totalIndicacoes: 0,
    indicacoesAtivas: 0,
    comissaoTotal: 0,
    comissaoMes: 0,
    comissaoPendente: 0,
    nivel: 1,
    proximoNivel: 2,
    progressoNivel: 0,
    clicksLink: 0,
    conversoes: 0,
    taxaConversao: 0,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)

    try {
      // Aqui você faria a chamada real para sua API
      // const response = await fetch('/api/affiliate/stats')
      // const data = await response.json()

      // Por enquanto, inicializar com valores zerados
      setIndicacoes([])
      setHistorico([])
      setMateriais([])
      setLinkAfiliado("")
      setCodigoAfiliado("")

      setEstatisticas({
        totalIndicacoes: 0,
        indicacoesAtivas: 0,
        comissaoTotal: 0,
        comissaoMes: 0,
        comissaoPendente: 0,
        nivel: 1,
        proximoNivel: 2,
        progressoNivel: 0,
        clicksLink: 0,
        conversoes: 0,
        taxaConversao: 0,
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const gerarLinkAfiliado = async () => {
    setLoading(true)

    try {
      // Aqui você faria a chamada para gerar o link real
      // const response = await fetch('/api/affiliate/generate-link', {
      //   method: 'POST',
      //   body: JSON.stringify({ customCode: linkPersonalizado })
      // })

      const baseUrl = "https://fbadsminer.com/ref"
      const codigo = linkPersonalizado || `USER_${Date.now()}`
      const link = `${baseUrl}/${codigo}`

      setLinkAfiliado(link)
      setCodigoAfiliado(codigo)

      alert("✅ Link de afiliado gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar link:", error)
      alert("❌ Erro ao gerar link de afiliado")
    } finally {
      setLoading(false)
    }
  }

  const copiarTexto = (texto: string, tipo: string) => {
    navigator.clipboard.writeText(texto)
    alert(`✅ ${tipo} copiado para a área de transferência!`)
  }

  const compartilharWhatsApp = () => {
    const mensagem = `🚀 Descubra a plataforma que está revolucionando a mineração de anúncios do Facebook!

💎 Facebook Ads Miner - A ferramenta completa para encontrar anúncios de alta performance

✅ Mineração automática de anúncios
✅ Análise de campanhas em tempo real  
✅ Meta Ad Library integrada
✅ Dashboard completo com métricas

🎁 Use meu link e ganhe acesso especial: ${linkAfiliado}

#FacebookAds #Marketing #DigitalMarketing`

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-900/30 text-green-400 border-green-800"
      case "Pendente":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800"
      case "Inativo":
        return "bg-gray-900/30 text-gray-400 border-gray-800"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800"
    }
  }

  const getComissaoStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-900/30 text-green-400 border-green-800"
      case "Processando":
        return "bg-blue-900/30 text-blue-400 border-blue-800"
      case "Pendente":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800"
    }
  }

  const getNivelInfo = (nivel: number) => {
    const niveis = {
      1: { nome: "Bronze", cor: "text-orange-400", icon: Star, comissao: 30 },
      2: { nome: "Prata", cor: "text-gray-400", icon: Award, comissao: 35 },
      3: { nome: "Ouro", cor: "text-yellow-400", icon: Crown, comissao: 40 },
      4: { nome: "Platina", cor: "text-purple-400", icon: Zap, comissao: 45 },
      5: { nome: "Diamante", cor: "text-blue-400", icon: Crown, comissao: 50 },
    }
    return niveis[nivel as keyof typeof niveis] || niveis[1]
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total de Indicações</p>
                <p className="text-2xl font-bold text-white">{estatisticas.totalIndicacoes}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Comissão Total</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(estatisticas.comissaoTotal)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Este Mês</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(estatisticas.comissaoMes)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-orange-400">{estatisticas.taxaConversao.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nível do Afiliado */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            {React.createElement(getNivelInfo(estatisticas.nivel).icon, { className: "h-5 w-5" })}
            Nível do Afiliado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-white">
                Nível {estatisticas.nivel} - {getNivelInfo(estatisticas.nivel).nome}
              </p>
              <p className="text-sm text-gray-400">Comissão atual: {getNivelInfo(estatisticas.nivel).comissao}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Próximo nível</p>
              <p className="text-lg font-bold text-purple-400">{getNivelInfo(estatisticas.proximoNivel).nome}</p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${estatisticas.progressoNivel}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Nível {estatisticas.nivel}</span>
            <span>{estatisticas.progressoNivel.toFixed(0)}%</span>
            <span>Nível {estatisticas.proximoNivel}</span>
          </div>
        </CardContent>
      </Card>

      {/* Geração de Link */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Share2 className="h-5 w-5" />
            Gerar Link de Afiliado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Código Personalizado (Opcional)</label>
              <Input
                type="text"
                placeholder="Ex: SEUNOME2024"
                value={linkPersonalizado}
                onChange={(e) => setLinkPersonalizado(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco para gerar automaticamente</p>
            </div>

            <Button onClick={gerarLinkAfiliado} disabled={loading} className="bg-purple-600 hover:bg-purple-700 w-full">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Gerar Link de Afiliado
                </>
              )}
            </Button>

            {linkAfiliado && (
              <div className="space-y-3 p-4 bg-gray-700 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Seu Link de Afiliado:</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={linkAfiliado}
                      readOnly
                      className="bg-gray-600 border-gray-500 text-gray-200"
                    />
                    <Button
                      onClick={() => copiarTexto(linkAfiliado, "Link")}
                      className="bg-green-600 hover:bg-green-700 px-4"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Código de Afiliado:</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={codigoAfiliado}
                      readOnly
                      className="bg-gray-600 border-gray-500 text-gray-200"
                    />
                    <Button
                      onClick={() => copiarTexto(codigoAfiliado, "Código")}
                      className="bg-green-600 hover:bg-green-700 px-4"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={compartilharWhatsApp} className="bg-green-600 hover:bg-green-700 flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="bg-gray-600 border-gray-500 hover:bg-gray-500 flex-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIndicacoes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Suas Indicações ({indicacoes.length})</h3>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Convidar Amigo
        </Button>
      </div>

      {indicacoes.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma indicação ainda</h3>
            <p className="text-gray-400 mb-4">Comece a indicar amigos e ganhe comissões sobre cada venda</p>
            <Button className="bg-purple-600 hover:bg-purple-700">Fazer Primeira Indicação</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {indicacoes.map((indicacao) => (
            <Card key={indicacao.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={indicacao.avatar || "/placeholder.svg"}
                      alt={indicacao.nome}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-white">{indicacao.nome}</p>
                      <p className="text-sm text-gray-400">{indicacao.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(indicacao.status)} size="sm">
                          {indicacao.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(indicacao.dataIndicacao)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">{formatCurrency(indicacao.comissaoGerada)}</p>
                    <p className="text-xs text-gray-500">comissão gerada</p>
                    <p className="text-xs text-gray-400">{indicacao.plano}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderHistorico = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Histórico de Comissões</h3>
        <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {historico.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <DollarSign className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma comissão ainda</h3>
            <p className="text-gray-400">Suas comissões aparecerão aqui quando suas indicações fizerem compras</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {historico.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{item.descricao}</p>
                    <p className="text-sm text-gray-400">
                      {item.indicadoNome !== "Sistema" ? `Indicado: ${item.indicadoNome}` : "Bônus do sistema"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getComissaoStatusColor(item.status)} size="sm">
                        {item.status}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.data)}
                      </span>
                      <Badge variant="outline" className="border-gray-600 text-gray-400" size="sm">
                        {item.tipo}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">{formatCurrency(item.valor)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderMateriais = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Materiais de Divulgação</h3>
        <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder para materiais */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="w-full h-32 bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
              <Globe className="h-8 w-8 text-gray-500" />
            </div>
            <h4 className="font-medium text-white mb-1">Banner Principal</h4>
            <p className="text-sm text-gray-400 mb-3">1200x628px - PNG</p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="w-full h-32 bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
              <Youtube className="h-8 w-8 text-gray-500" />
            </div>
            <h4 className="font-medium text-white mb-1">Vídeo Promocional</h4>
            <p className="text-sm text-gray-400 mb-3">1080p - MP4</p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="w-full h-32 bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
              <Mail className="h-8 w-8 text-gray-500" />
            </div>
            <h4 className="font-medium text-white mb-1">Template Email</h4>
            <p className="text-sm text-gray-400 mb-3">HTML - Responsivo</p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="h-full bg-[#121214] text-[#E4E4E7] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-2">Sistema de Afiliados</h1>
        <p className="text-gray-400">Indique amigos e ganhe até 50% de comissão sobre todas as vendas</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          {[
            { id: "overview", label: "Visão Geral", icon: BarChart3 },
            { id: "indicacoes", label: "Indicações", icon: Users },
            { id: "historico", label: "Histórico", icon: Clock },
            { id: "materiais", label: "Materiais", icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9F4CFF]"></div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "indicacoes" && renderIndicacoes()}
          {activeTab === "historico" && renderHistorico()}
          {activeTab === "materiais" && renderMateriais()}
        </>
      )}

      {/* Como Funciona */}
      <Card className="bg-gray-800 border-gray-700 mt-8">
        <CardHeader>
          <CardTitle className="text-purple-400">
            <Info className="h-5 w-5 mr-2 inline" />
            Como Funciona o Sistema de Afiliados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Passos para Começar:</h4>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Gere seu link de afiliado exclusivo</li>
                <li>Compartilhe com amigos, colegas ou redes sociais</li>
                <li>Quando alguém se cadastrar e comprar, você ganha comissão</li>
                <li>Acompanhe seus ganhos em tempo real</li>
                <li>Receba pagamentos semanalmente</li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Comissões por Nível:</h4>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((nivel) => {
                  const info = getNivelInfo(nivel)
                  return (
                    <div key={nivel} className="flex justify-between items-center">
                      <Badge className={`bg-gray-700 ${info.cor} border-gray-600`}>{info.nome}</Badge>
                      <span className="text-gray-300">{info.comissao}% de comissão</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
            <h5 className="font-semibold text-purple-400 mb-2">💡 Dicas para Maximizar Ganhos:</h5>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Compartilhe em grupos relacionados a marketing digital</li>
              <li>• Crie conteúdo explicando os benefícios da plataforma</li>
              <li>• Use seu código personalizado para facilitar o reconhecimento</li>
              <li>• Acompanhe suas métricas e otimize sua estratégia</li>
              <li>• Utilize os materiais de divulgação fornecidos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
