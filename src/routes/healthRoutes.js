const express = require("express")
const facebookService = require("../services/facebookService")
const cacheService = require("../services/cacheService")
const logger = require("../utils/logger")

const router = express.Router()

// Health check básico
router.get("/", async (req, res) => {
  try {
    const health = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      facebook_api: "disconnected",
      cache_stats: cacheService.getStats(),
    }

    // Testar conexão com Facebook API
    try {
      const fbTest = await facebookService.testConnection()
      health.facebook_api = fbTest.success ? "connected" : "error"
      health.facebook_user = fbTest.user
    } catch (error) {
      health.facebook_api = "error"
      health.facebook_error = error.message
    }

    res.json(health)
  } catch (error) {
    logger.error("Erro no health check:", error.message)
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Configuração automática da conta
router.post("/configure", async (req, res) => {
  try {
    logger.info("🔧 Iniciando configuração automática...")

    // Testar conexão
    const fbTest = await facebookService.testConnection()
    if (!fbTest.success) {
      throw new Error("Erro na conexão com Facebook: " + fbTest.error)
    }

    // Buscar campanhas para validar
    const campanhas = await facebookService.getCampanhas()

    res.json({
      status: "OK",
      message: "Conta configurada com sucesso",
      ad_account_id: process.env.FACEBOOK_AD_ACCOUNT_ID,
      campanhas_encontradas: campanhas.length,
      facebook_user: fbTest.user,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Erro na configuração automática:", error.message)
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Limpar cache
router.post("/clear-cache", (req, res) => {
  try {
    cacheService.clear()
    logger.info("🧹 Cache limpo via API")

    res.json({
      status: "OK",
      message: "Cache limpo com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Erro ao limpar cache:", error.message)
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
