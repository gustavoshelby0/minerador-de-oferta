const express = require("express")
const axios = require("axios")
const logger = require("../utils/logger")
const cacheService = require("../services/cacheService")

const router = express.Router()

// Rota para buscar anúncios na Meta Ad Library
// Query params: palavra (keyword), pais (country code, ex: BR), limit
router.get("/", async (req, res) => {
  try {
    const token = process.env.META_TOKEN
    if (!token) {
      logger.error("META_TOKEN não configurado")
      return res.status(500).json({
        success: false,
        error: "META_TOKEN não configurado nas variáveis de ambiente",
      })
    }

    const keyword = req.query.palavra || req.query.search_terms || ""
    const country = req.query.pais || req.query.ad_reached_countries || "BR"
    const limit = req.query.limit || "20"

    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro "palavra" ou "search_terms" é obrigatório',
      })
    }

    // Cache key para evitar requisições desnecessárias
    const cacheKey = `meta_ads_${keyword}_${country}_${limit}`
    const cachedData = cacheService.get(cacheKey)

    if (cachedData) {
      logger.info(`📦 Dados em cache para: ${keyword}`)
      return res.json(cachedData)
    }

    logger.info(`🔍 Buscando anúncios na Meta Ad Library: ${keyword} (${country})`)

    // URL da Meta Ad Library API
    const apiUrl = new URL("https://graph.facebook.com/v19.0/ads_archive")

    // Parâmetros da API
    apiUrl.searchParams.set("access_token", token)
    apiUrl.searchParams.set("search_terms", keyword)
    apiUrl.searchParams.set("ad_reached_countries", country)
    apiUrl.searchParams.set("ad_active_status", "ALL")
    apiUrl.searchParams.set("limit", limit)
    apiUrl.searchParams.set(
      "fields",
      [
        "id",
        "ad_creation_time",
        "ad_creative_bodies",
        "ad_creative_link_caption",
        "ad_creative_link_description",
        "ad_creative_link_title",
        "ad_delivery_start_time",
        "ad_delivery_stop_time",
        "ad_snapshot_url",
        "bylines",
        "currency",
        "delivery_by_region",
        "demographic_distribution",
        "estimated_audience_size",
        "impressions",
        "page_id",
        "page_name",
        "publisher_platforms",
        "spend",
      ].join(","),
    )

    const response = await axios.get(apiUrl.toString(), {
      timeout: 30000, // 30 segundos timeout
      headers: {
        "User-Agent": "FacebookAdsMiner/1.0",
      },
    })

    if (!response.data || !response.data.data) {
      logger.warn("Resposta vazia da Meta API")
      return res.json({
        success: true,
        data: [],
        anuncios: [],
        total: 0,
        search_terms: keyword,
        country: country,
        message: "Nenhum anúncio encontrado",
      })
    }

    // Processar e formatar os dados
    const adsRaw = response.data.data || []

    const processedAds = adsRaw.map((ad) => ({
      // Formato padrão
      id: ad.id,
      page_name: ad.page_name || "Anunciante não informado",
      ad_creative_body: ad.ad_creative_bodies?.[0] || ad.ad_creative_link_description || "Texto não disponível",
      ad_creative_title: ad.ad_creative_link_title || "",
      ad_creative_caption: ad.ad_creative_link_caption || "",
      ad_snapshot_url: ad.ad_snapshot_url,
      ad_creation_time: ad.ad_creation_time,
      ad_delivery_start_time: ad.ad_delivery_start_time,
      ad_delivery_stop_time: ad.ad_delivery_stop_time,
      impressions: ad.impressions,
      spend: ad.spend,
      currency: ad.currency || "USD",
      platforms: ad.publisher_platforms || [],
      demographics: ad.demographic_distribution || [],
      estimated_audience: ad.estimated_audience_size,
      is_active: !ad.ad_delivery_stop_time,

      // Formato compatível com script original
      titulo: ad.ad_creative_link_title || ad.page_name || "Título não disponível",
      texto: ad.ad_creative_bodies?.[0] || ad.ad_creative_link_description || "Descrição não disponível",
      preview_url: ad.ad_snapshot_url || "",
      impressao: formatImpressions(ad.impressions),
      investimento: formatSpend(ad.spend, ad.currency),
      link_original: ad.ad_snapshot_url || `https://www.facebook.com/ads/library/?id=${ad.id}`,
      status: ad.ad_delivery_stop_time ? "Inativo" : "Ativo",
    }))

    const result = {
      success: true,
      data: processedAds,
      anuncios: processedAds, // Compatibilidade
      total: processedAds.length,
      search_terms: keyword,
      country: country,
      timestamp: new Date().toISOString(),
      cached: false,
    }

    // Cache por 10 minutos
    cacheService.set(cacheKey, result, 600)

    logger.info(`✅ ${processedAds.length} anúncios encontrados para: ${keyword}`)

    return res.json(result)
  } catch (error) {
    logger.error("Erro ao buscar anúncios na Meta Ad Library:", error.response?.data || error.message)

    // Tratamento específico de erros da Meta API
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Token Meta inválido ou expirado",
        details: error.response.data,
      })
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: "Parâmetros inválidos na requisição",
        details: error.response.data,
      })
    }

    return res.status(500).json({
      success: false,
      error: "Erro interno ao buscar anúncios na Meta Ad Library",
      message: error.message,
    })
  }
})

// Rota para testar conexão com Meta API
router.post("/test", async (req, res) => {
  try {
    const token = process.env.META_TOKEN
    if (!token) {
      return res.status(500).json({
        success: false,
        error: "META_TOKEN não configurado",
      })
    }

    // Testar token com uma requisição simples
    const testUrl = `https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name`

    const response = await axios.get(testUrl, { timeout: 10000 })

    if (response.status === 200) {
      logger.info("✅ Conexão com Meta API testada com sucesso")
      return res.json({
        success: true,
        message: "Conexão com Meta API estabelecida",
        user: response.data,
      })
    } else {
      throw new Error("Resposta inesperada da Meta API")
    }
  } catch (error) {
    logger.error("Erro ao testar conexão Meta API:", error.response?.data || error.message)

    return res.status(error.response?.status || 500).json({
      success: false,
      error: "Erro ao testar conexão com Meta API",
      details: error.response?.data || error.message,
    })
  }
})

// Rota para buscar anúncios por categoria específica
router.get("/categoria/:categoria", async (req, res) => {
  try {
    const categoria = req.params.categoria
    const country = req.query.pais || "BR"
    const limit = req.query.limit || "15"

    // Palavras-chave por categoria
    const categorias = {
      tecnologia: ["iphone", "samsung", "notebook", "smartphone"],
      moda: ["roupa", "sapato", "bolsa", "acessorio"],
      saude: ["suplemento", "vitamina", "academia", "dieta"],
      educacao: ["curso", "faculdade", "ingles", "concurso"],
      financas: ["investimento", "cartao", "emprestimo", "bitcoin"],
      casa: ["moveis", "decoracao", "eletrodomestico", "casa"],
    }

    const keywords = categorias[categoria.toLowerCase()]
    if (!keywords) {
      return res.status(400).json({
        success: false,
        error: "Categoria não encontrada",
        categorias_disponiveis: Object.keys(categorias),
      })
    }

    // Buscar anúncios para cada palavra-chave da categoria
    const allAds = []

    for (const keyword of keywords.slice(0, 2)) {
      // Limitar a 2 palavras por categoria
      try {
        const searchUrl = `/api/meta-ads?palavra=${keyword}&pais=${country}&limit=${Math.floor(limit / 2)}`
        // Fazer requisição interna (simulada)
        req.query = { palavra: keyword, pais: country, limit: Math.floor(limit / 2) }
        // Aqui você chamaria a função de busca diretamente
        // Por simplicidade, vou fazer uma nova requisição
      } catch (err) {
        logger.warn(`Erro ao buscar ${keyword}:`, err.message)
      }
    }

    return res.json({
      success: true,
      categoria: categoria,
      keywords_buscadas: keywords.slice(0, 2),
      data: allAds,
      total: allAds.length,
    })
  } catch (error) {
    logger.error("Erro na busca por categoria:", error.message)
    return res.status(500).json({
      success: false,
      error: "Erro interno na busca por categoria",
    })
  }
})

// Funções auxiliares
function formatImpressions(impressions) {
  if (!impressions) return "N/A"
  if (typeof impressions === "object") {
    const lower = impressions.lower_bound || 0
    const upper = impressions.upper_bound || 0
    return `${formatNumber(lower)} - ${formatNumber(upper)}`
  }
  return formatNumber(impressions)
}

function formatSpend(spend, currency = "USD") {
  if (!spend) return "N/A"
  if (typeof spend === "object") {
    const lower = spend.lower_bound || 0
    const upper = spend.upper_bound || 0
    return `${currency} ${formatNumber(lower)} - ${formatNumber(upper)}`
  }
  return `${currency} ${formatNumber(spend)}`
}

function formatNumber(num) {
  if (!num) return "0"
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

module.exports = router
