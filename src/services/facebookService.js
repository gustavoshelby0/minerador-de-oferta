const axios = require("axios")
const logger = require("../utils/logger")

class FacebookService {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN
    this.adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID
    this.baseURL = "https://graph.facebook.com/v19.0"
  }

  // Verificar se as credenciais estão configuradas
  checkCredentials() {
    if (!this.accessToken) {
      throw new Error("FACEBOOK_ACCESS_TOKEN não configurado")
    }
    if (!this.adAccountId) {
      throw new Error("FACEBOOK_AD_ACCOUNT_ID não configurado")
    }
  }

  // Buscar campanhas
  async getCampanhas() {
    try {
      this.checkCredentials()

      const url = `${this.baseURL}/${this.adAccountId}/campaigns`
      const params = {
        access_token: this.accessToken,
        fields: [
          "id",
          "name",
          "status",
          "objective",
          "created_time",
          "updated_time",
          "start_time",
          "stop_time",
          "budget_remaining",
          "daily_budget",
          "lifetime_budget",
        ].join(","),
        limit: 50,
      }

      logger.info("🔍 Buscando campanhas no Facebook Ads...")
      const response = await axios.get(url, { params, timeout: 30000 })

      if (!response.data || !response.data.data) {
        return []
      }

      return response.data.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Token de acesso inválido ou expirado")
      }
      if (error.response?.status === 403) {
        throw new Error("Sem permissão para acessar esta conta de anúncios")
      }
      throw new Error(`Erro na API do Facebook: ${error.message}`)
    }
  }

  // Buscar anúncios de uma campanha
  async getAnuncios(campaignId) {
    try {
      this.checkCredentials()

      const url = `${this.baseURL}/${campaignId}/ads`
      const params = {
        access_token: this.accessToken,
        fields: [
          "id",
          "name",
          "status",
          "created_time",
          "updated_time",
          "creative",
          "targeting",
          "bid_amount",
          "bid_type",
        ].join(","),
        limit: 100,
      }

      const response = await axios.get(url, { params, timeout: 30000 })
      return response.data.data || []
    } catch (error) {
      throw new Error(`Erro ao buscar anúncios: ${error.message}`)
    }
  }

  // Buscar insights/estatísticas
  async getInsights(objectId, level = "campaign") {
    try {
      this.checkCredentials()

      const url = `${this.baseURL}/${objectId}/insights`
      const params = {
        access_token: this.accessToken,
        fields: [
          "impressions",
          "clicks",
          "spend",
          "ctr",
          "cpc",
          "cpm",
          "reach",
          "frequency",
          "actions",
          "cost_per_action_type",
        ].join(","),
        level: level,
        time_range: JSON.stringify({
          since: "2024-01-01",
          until: "2024-12-31",
        }),
      }

      const response = await axios.get(url, { params, timeout: 30000 })
      return response.data.data || []
    } catch (error) {
      logger.warn(`Erro ao buscar insights para ${objectId}:`, error.message)
      return []
    }
  }

  // Estatísticas da conta
  async getAccountStats() {
    try {
      this.checkCredentials()

      const campanhas = await this.getCampanhas()
      const totalCampanhas = campanhas.length
      const campanhasAtivas = campanhas.filter((c) => c.status === "ACTIVE").length

      // Buscar insights gerais da conta
      const insights = await this.getInsights(this.adAccountId, "account")
      const accountInsights = insights[0] || {}

      return {
        total_campanhas: totalCampanhas,
        campanhas_ativas: campanhasAtivas,
        campanhas_pausadas: totalCampanhas - campanhasAtivas,
        impressions: accountInsights.impressions || 0,
        clicks: accountInsights.clicks || 0,
        spend: accountInsights.spend || 0,
        ctr: accountInsights.ctr || 0,
        cpc: accountInsights.cpc || 0,
        reach: accountInsights.reach || 0,
      }
    } catch (error) {
      throw new Error(`Erro ao calcular estatísticas: ${error.message}`)
    }
  }

  // Testar conexão
  async testConnection() {
    try {
      this.checkCredentials()

      const url = `${this.baseURL}/me`
      const params = {
        access_token: this.accessToken,
        fields: "id,name",
      }

      const response = await axios.get(url, { params, timeout: 10000 })
      return {
        success: true,
        user: response.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

module.exports = new FacebookService()
