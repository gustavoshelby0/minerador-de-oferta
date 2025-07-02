const logger = require("../utils/logger")

// Middleware de autenticação simples
const authMiddleware = (req, res, next) => {
  try {
    // Por enquanto, apenas log da requisição
    // Em produção, implementar autenticação real
    const apiKey = req.headers["x-api-key"] || req.query.api_key
    const userAgent = req.headers["user-agent"]
    const ip = req.ip || req.connection.remoteAddress

    logger.info("🔐 Requisição autenticada", {
      method: req.method,
      url: req.originalUrl,
      ip: ip,
      userAgent: userAgent,
      hasApiKey: !!apiKey,
    })

    // Validação básica de API key (opcional)
    if (process.env.API_SECRET_KEY && apiKey !== process.env.API_SECRET_KEY) {
      logger.warn("❌ API Key inválida", { ip, userAgent })
      return res.status(401).json({
        success: false,
        error: "API Key inválida ou não fornecida",
      })
    }

    next()
  } catch (error) {
    logger.error("Erro no middleware de autenticação:", error.message)
    res.status(500).json({
      success: false,
      error: "Erro interno de autenticação",
    })
  }
}

module.exports = authMiddleware
