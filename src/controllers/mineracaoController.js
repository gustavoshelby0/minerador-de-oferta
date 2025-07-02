const facebookService = require("../services/facebookService")
const cacheService = require("../services/cacheService")
const logger = require("../utils/logger")
const { formatCampaignData } = require("../utils/dataFormatter")

class MineracaoController {
  // Buscar campanhas do Facebook Ads
  async getCampanhas(req, res) {
    try {
      logger.info("📊 Buscando campanhas do Facebook Ads...")

      // Verificar cache primeiro
      const cacheKey = "campanhas_facebook"
      const cachedData = cacheService.get(cacheKey)

      if (cachedData) {
        logger.info("📦 Dados em cache encontrados")
        return res.json({
          success: true,
          data: cachedData,
          cached: true,
          timestamp: new Date().toISOString(),
        })
      }

      // Buscar dados do Facebook
      const campanhas = await facebookService.getCampanhas()
      const formattedData = formatCampaignData(campanhas)

      // Cache por 5 minutos
      cacheService.set(cacheKey, formattedData, 300)

      logger.info(`✅ ${formattedData.length} campanhas encontradas`)

      res.json({
        success: true,
        data: formattedData,
        cached: false,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error("❌ Erro ao buscar campanhas:", error.message)
      res.status(500).json({
        success: false,
        error: "Erro ao buscar campanhas",
        message: error.message,
      })
    }
  }

  // Atualizar dados (limpar cache)
  async refreshData(req, res) {
    try {
      logger.info("🔄 Atualizando dados...")

      // Limpar cache
      cacheService.clear()

      // Buscar novos dados
      const campanhas = await facebookService.getCampanhas()
      const formattedData = formatCampaignData(campanhas)

      // Atualizar cache
      cacheService.set("campanhas_facebook", formattedData, 300)

      logger.info("✅ Dados atualizados com sucesso")

      res.json({
        success: true,
        message: "Dados atualizados com sucesso",
        data: formattedData,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error("❌ Erro ao atualizar dados:", error.message)
      res.status(500).json({
        success: false,
        error: "Erro ao atualizar dados",
        message: error.message,
      })
    }
  }

  // Buscar anúncios específicos
  async getAnuncios(req, res) {
    try {
      const { campaignId } = req.params
      logger.info(`📱 Buscando anúncios da campanha: ${campaignId}`)

      const anuncios = await facebookService.getAnuncios(campaignId)

      res.json({
        success: true,
        data: anuncios,
        campaignId,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error("❌ Erro ao buscar anúncios:", error.message)
      res.status(500).json({
        success: false,
        error: "Erro ao buscar anúncios",
        message: error.message,
      })
    }
  }

  // Estatísticas gerais
  async getStats(req, res) {
    try {
      logger.info("📈 Calculando estatísticas...")

      const stats = await facebookService.getAccountStats()

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      logger.error("❌ Erro ao calcular estatísticas:", error.message)
      res.status(500).json({
        success: false,
        error: "Erro ao calcular estatísticas",
        message: error.message,
      })
    }
  }
}

module.exports = new MineracaoController()
