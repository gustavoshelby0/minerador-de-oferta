const logger = require("./logger")
const { formatToXLSX } = require("./xlsxFormatter") // Import formatToXLSX from xlsxFormatter

// Formatar dados de campanhas
function formatCampaignData(campanhas) {
  if (!Array.isArray(campanhas)) {
    logger.warn("Dados de campanhas não são um array")
    return []
  }

  return campanhas.map((campanha, index) => {
    // Gerar dados mock realistas baseados na campanha real
    const mockData = generateMockData(campanha, index)

    return {
      id: campanha.id,
      title: campanha.name || `Campanha ${index + 1}`,
      status: mapStatus(campanha.status),
      adsCount: mockData.adsCount,
      roas: mockData.roas,
      spend: mockData.spend,
      ctr: mockData.ctr,
      color: getStatusColor(campanha.status),
      creativeTypes: mockData.creativeTypes,
      adsManagerLink: `https://business.facebook.com/adsmanager/manage/campaigns/detail?act=${process.env.FACEBOOK_AD_ACCOUNT_ID}&selected_campaign_ids=${campanha.id}`,
      created_time: campanha.created_time,
      updated_time: campanha.updated_time,
      objective: campanha.objective,
      budget: {
        daily: campanha.daily_budget,
        lifetime: campanha.lifetime_budget,
        remaining: campanha.budget_remaining,
      },
    }
  })
}

// Gerar dados mock realistas
function generateMockData(campanha, index) {
  // Seed baseado no ID da campanha para consistência
  const seed = Number.parseInt(campanha.id?.slice(-4) || index.toString(), 10) || index

  return {
    adsCount: Math.floor((seed % 20) + 5), // 5-24 anúncios
    roas: Number.parseFloat((((seed % 50) + 100) / 50).toFixed(2)), // 2.0-3.0 ROAS
    spend: Math.floor((seed % 5000) + 1000), // R$ 1000-6000
    ctr: Number.parseFloat((((seed % 300) + 100) / 100).toFixed(2)), // 1.0-4.0% CTR
    creativeTypes: getRandomCreativeTypes(seed),
  }
}

// Mapear status do Facebook para status interno
function mapStatus(facebookStatus) {
  const statusMap = {
    ACTIVE: "scaling",
    PAUSED: "validating",
    ARCHIVED: "optimizing",
    DELETED: "prescale",
  }

  return statusMap[facebookStatus] || "validating"
}

// Obter cor baseada no status
function getStatusColor(status) {
  const colorMap = {
    ACTIVE: "blue",
    PAUSED: "orange",
    ARCHIVED: "gray",
    DELETED: "red",
  }

  return colorMap[status] || "gray"
}

// Gerar tipos de criativos aleatórios
function getRandomCreativeTypes(seed) {
  const types = ["image", "video", "carousel", "collection"]
  const count = (seed % 3) + 1 // 1-3 tipos
  const selectedTypes = []

  for (let i = 0; i < count; i++) {
    const type = types[(seed + i) % types.length]
    if (!selectedTypes.includes(type)) {
      selectedTypes.push(type)
    }
  }

  return selectedTypes
}

// Formatar dados de anúncios
function formatAdData(anuncios) {
  if (!Array.isArray(anuncios)) {
    return []
  }

  return anuncios.map((anuncio, index) => ({
    id: anuncio.id,
    name: anuncio.name || `Anúncio ${index + 1}`,
    status: mapStatus(anuncio.status),
    created_time: anuncio.created_time,
    updated_time: anuncio.updated_time,
    creative: anuncio.creative,
    targeting: anuncio.targeting,
    bid_amount: anuncio.bid_amount,
    bid_type: anuncio.bid_type,
  }))
}

// Formatar insights/estatísticas
function formatInsightsData(insights) {
  if (!Array.isArray(insights) || insights.length === 0) {
    return {
      impressions: 0,
      clicks: 0,
      spend: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      reach: 0,
      frequency: 0,
    }
  }

  const data = insights[0] // Pegar o primeiro resultado
  return {
    impressions: Number.parseInt(data.impressions || 0),
    clicks: Number.parseInt(data.clicks || 0),
    spend: Number.parseFloat(data.spend || 0),
    ctr: Number.parseFloat(data.ctr || 0),
    cpc: Number.parseFloat(data.cpc || 0),
    cpm: Number.parseFloat(data.cpm || 0),
    reach: Number.parseInt(data.reach || 0),
    frequency: Number.parseFloat(data.frequency || 0),
    actions: data.actions || [],
    cost_per_action_type: data.cost_per_action_type || [],
  }
}

// Formatar dados para exportação
function formatForExport(data, format = "json") {
  switch (format.toLowerCase()) {
    case "csv":
      return formatToCSV(data)
    case "xlsx":
      return formatToXLSX(data)
    default:
      return JSON.stringify(data, null, 2)
  }
}

// Converter para CSV
function formatToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return ""
  }

  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(",")
  const csvRows = data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(","))

  return [csvHeaders, ...csvRows].join("\n")
}

// Formatar números para exibição
function formatNumber(num, decimals = 0) {
  if (typeof num !== "number") {
    return "0"
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + "K"
  }

  return num.toFixed(decimals)
}

// Formatar moeda
function formatCurrency(value, currency = "BRL") {
  if (typeof value !== "number") {
    return "R$ 0,00"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(value)
}

// Formatar porcentagem
function formatPercentage(value, decimals = 2) {
  if (typeof value !== "number") {
    return "0%"
  }

  return (value * 100).toFixed(decimals) + "%"
}

module.exports = {
  formatCampaignData,
  formatAdData,
  formatInsightsData,
  formatForExport,
  formatToCSV,
  formatNumber,
  formatCurrency,
  formatPercentage,
  generateMockData,
  mapStatus,
  getStatusColor,
}
